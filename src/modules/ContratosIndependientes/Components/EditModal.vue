<template>
  <el-dialog :visible.sync="dialogVisible" title="Editar Pago Programado" width="60%" :modal-append-to-body="true"
    :append-to-body="true" custom-class="centered-dialog" @close="onClose">

    <div v-loading="loading">
      <div v-if="pago" class="edit-container">
        <!-- Payment Basic Info (Read-only) -->
        <div class="row">
          <div class="col-md-4">
            <label>N° Contrato:</label>
            <p class="read-only-text">{{ pago.NumeroContrato }}</p>
          </div>
          <div class="col-md-4">
            <label>Docente:</label>
            <p class="read-only-text">{{ pago.NombreCompleto }}</p>
          </div>
          <div class="col-md-4">
            <label>Mes/Año:</label>
            <p class="read-only-text">{{ pago.MesNombre }} {{ pago.AnioPago }}</p>
          </div>
        </div>

        <div class="row">
          <div class="col-md-3">
            <label>Sigla:</label>
            <p class="read-only-text">{{ pago.Sigla }}</p>
          </div>
          <div class="col-md-2">
            <label>Paralelo:</label>
            <p class="read-only-text">{{ pago.Paralelo }}</p>
          </div>
          <div class="col-md-3">
            <label>Código Paralelo:</label>
            <p class="read-only-text">{{ pago.CodigoParalelo }}</p>
          </div>
          <div class="col-md-4">
            <label>Monto Total Asignación:</label>
            <p class="read-only-text"><strong>Bs. {{ pago.MontoTotalAsignacion.toFixed(2) }}</strong></p>
          </div>
        </div>

        <hr>

        <!-- Editable Fields -->
        <h5 class="section-title">Datos Editables</h5>

        <div class="row">
          <div class="col-md-7">
            <label>Monto <span style="color: red;">*</span></label>
            <input type="number" class="form-control" v-model.number="form.monto" :max="pago.MontoTotalAsignacion"
              min="0" step="0.01" @input="calculatePercentage">
            <small class="help-block">
              Monto original planificado: Bs. {{ (pago.MontoOriginal || pago.Monto).toFixed(2) }}
            </small>
            <small class="help-block" v-if="pago.Monto !== pago.MontoOriginal" style="color: #F44336;">
              <i class="fa fa-exclamation-triangle"></i> Monto actual antes de esta edición: Bs. {{
              pago.Monto.toFixed(2) }}
            </small>
          </div>

          <div class="col-md-5">
            <label>Porcentaje</label>
            <input type="text" class="form-control" :value="form.porcentaje.toFixed(2) + '%'" readonly disabled>
            <small class="help-block">
              Porcentaje original: {{ pago.Porcentaje.toFixed(2) }}%
            </small>
          </div>

          <div class="col-md-8">
            <label>Estado</label>
            <input type="text" class="form-control" :value="form.estado" readonly disabled>
          </div>
        </div>

        <!-- Observation (required if amount changed) -->
        <div class="row" style="margin-top: 15px;" v-if="montoChanged">
          <div class="col-md-12">
            <div class="alert alert-warning">
              <i class="fa fa-exclamation-triangle"></i>
              <strong>¡Atención!</strong> Ha cambiado el monto del pago. Debe proporcionar una observación explicando el
              motivo del cambio.
            </div>
          </div>
        </div>

        <div class="row" style="margin-top: 10px;">
          <div class="col-md-12">
            <label>
              Observaciones
              <span v-if="montoChanged" style="color: red;">* (Obligatorio si cambió el monto)</span>
              <span v-else>(Opcional)</span>
            </label>
            <textarea class="form-control" v-model="form.observacionCambio" rows="3" maxlength="500"
              placeholder="Agregue observaciones sobre este pago (obligatorio si modifica el monto)...">
            </textarea>
            <small class="help-block text-right">
              {{ form.observacionCambio.length }} / 500
            </small>
          </div>
        </div>

        <!-- Current Observations (if any) -->
        <div class="row" style="margin-top: 15px;" v-if="pago.Observaciones">
          <div class="col-md-12">
            <label>Observaciones Anteriores:</label>
            <pre class="observaciones-box">{{ pago.Observaciones }}</pre>
          </div>
        </div>
      </div>
    </div>

    <span slot="footer" class="dialog-footer">
      <button type="button" class="btn btn-default" @click="onClose">Cancelar</button>
      <button type="button" class="btn btn-success" :disabled="!canSave" @click="guardar">
        <i class="fa fa-save"></i> Guardar Cambios
      </button>
    </span>
  </el-dialog>
</template>
  
  <script>
  import axios from 'axios'
  import { Dialog, Message } from 'element-ui'
  
  export default {
    name: 'EditModal',
    components: {
      'el-dialog': Dialog
    },
    props: {
      show: {
        type: Boolean,
        default: false
      },
      pagoId: {
        type: Number,
        default: null
      }
    },
    data () {
      return {
        loading: false,
        pago: null,
        form: {
          monto: 0,
          porcentaje: 0,
          estado: 'PENDIENTE',
          observacionCambio: ''
        }
      }
    },
    computed: {
      dialogVisible: {
        get () {
          return this.show
        },
        set (val) {
          this.$emit('update:show', val)
        }
      },
      
      montoChanged () {
        if (!this.pago) return false
        return this.form.monto !== this.pago.Monto
      },
      
      canSave () {
        // If monto changed, observation is required
        if (this.montoChanged && !this.form.observacionCambio.trim()) {
          return false
        }
        
        // Basic validation
        return this.form.monto > 0 && 
               this.form.porcentaje >= 0 && 
               this.form.porcentaje <= 100
      }
    },
    watch: {
      show (newVal) {
        if (newVal && this.pagoId) {
          this.loadDetail()
        }
      }
    },
    methods: {
      loadDetail () {
        this.loading = true
        
        axios.get(`/ProgramacionPagos/GetPagoDetalle/${this.pagoId}`, {
          headers: {
            token: localStorage.getItem('token')
          }
        })
          .then(response => {
            this.pago = response.data
            
            // Initialize form with current values
            this.form = {
              monto: this.pago.Monto,
              porcentaje: this.pago.Porcentaje,
              estado: this.pago.Estado,
              observacionCambio: ''
            }
            
            this.loading = false
          })
          .catch(error => {
            console.error('Error cargando detalle:', error)
            Message({
              message: 'Error al cargar el detalle del pago',
              type: 'error',
              duration: 3000
            })
            this.loading = false
            this.onClose()
          })
      },
      
      calculatePercentage () {
        // Auto-calculate percentage based on monto and total assignment amount
        if (this.pago && this.pago.MontoTotalAsignacion > 0) {
          this.form.porcentaje = (this.form.monto / this.pago.MontoTotalAsignacion) * 100
        } else {
          this.form.porcentaje = 0
        }
      },
      
      guardar () {
        if (!this.canSave) {
          Message({
            message: 'Complete todos los campos obligatorios',
            type: 'warning',
            duration: 3000
          })
          return
        }
        
        this.loading = true
        
        axios.post('/ProgramacionPagos/UpdatePago', {
          PagoId: this.pagoId,
          Monto: this.form.monto,
          Porcentaje: this.form.porcentaje,
          Estado: this.form.estado,
          ObservacionCambio: this.form.observacionCambio.trim()
        }, {
          headers: {
            token: localStorage.getItem('token')
          }
        })
          .then(response => {
            Message({
              message: 'Pago actualizado correctamente',
              type: 'success',
              duration: 3000
            })
            this.loading = false
            this.$emit('payment-updated')
            this.onClose()
          })
          .catch(error => {
            console.error('Error actualizando pago:', error)
            this.loading = false
            
            const errorMsg = error.response && error.response.data && error.response.data.Message
              ? error.response.data.Message
              : 'Error al actualizar el pago'
            
            Message({
              message: errorMsg,
              type: 'error',
              duration: 5000
            })
          })
      },
      
      onClose () {
        this.dialogVisible = false
        this.pago = null
        this.form = {
          monto: 0,
          porcentaje: 0,
          estado: 'PENDIENTE',
          observacionCambio: ''
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .edit-container {
    padding: 10px;
  }
  
  .section-title {
    color: #4CAF50;
    border-bottom: 2px solid #4CAF50;
    padding-bottom: 5px;
    margin-bottom: 15px;
    margin-top: 10px;
  }
  
  .row {
    margin-bottom: 10px;
  }
  
  label {
    font-weight: 600;
    color: #666;
    display: block;
    margin-bottom: 5px;
  }
  
  .read-only-text {
    background-color: #f9f9f9;
    padding: 8px;
    border-radius: 4px;
    margin: 0;
    color: #333;
  }
  
  .help-block {
    color: #999;
    font-size: 11px;
    margin-top: 3px;
    display: block;
  }
  
  .help-block.text-right {
    text-align: right;
  }
  
  .observaciones-box {
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 4px;
    white-space: pre-wrap;
    word-wrap: break-word;
    max-height: 120px;
    overflow-y: auto;
    font-size: 12px;
  }
  
  hr {
    margin: 20px 0;
    border-top: 1px solid #eee;
  }
  
  .alert-warning {
    background-color: #fff3cd;
    border-color: #ffc107;
    color: #856404;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 10px;
  }
  
  .alert-warning i {
    margin-right: 8px;
  }
  
  /* Style for disabled fields */
  input[disabled],
  input[readonly] {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
  </style>
  
  <!-- Unscoped style for centering -->
  <style>
  .centered-dialog {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .centered-dialog .el-dialog {
    margin: 0 !important;
  }
  </style>