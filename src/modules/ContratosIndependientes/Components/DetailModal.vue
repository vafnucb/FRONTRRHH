<template>
  <el-dialog :visible.sync="dialogVisible" title="Detalle del Pago Programado" width="70%" :modal-append-to-body="true"
    :append-to-body="true" custom-class="centered-dialog" @close="onClose">

    <div v-loading="loading">
      <div v-if="pago" class="detail-container">
        <!-- Payment Information -->
        <h5 class="section-title">Información del Pago</h5>
        <div class="row">
          <div class="col-md-3">
            <label>ID Pago:</label>
            <p>{{ pago.PagoId }}</p>
          </div>
          <div class="col-md-3">
            <label>Mes/Año:</label>
            <p>{{ pago.MesNombre }} {{ pago.AnioPago }}</p>
          </div>
          <div class="col-md-3">
            <label>Monto a Pagar:</label>
            <p><strong>Bs. {{ pago.Monto.toFixed(2) }}</strong></p>
          </div>
          <div class="col-md-3">
  <label>Monto Original:</label>
  <p><strong>Bs. {{ (pago.MontoOriginal || pago.Monto).toFixed(2) }}</strong></p>
</div>
          <div class="col-md-3">
            <label>Porcentaje:</label>
            <p>{{ pago.Porcentaje.toFixed(2) }}%</p>
          </div>
        </div>

        <div class="row">
          <div class="col-md-3">
            <label>Estado:</label>
            <p>
              <span class="label" :class="{
                'label-default': pago.Estado === 'PROGRAMADO',
                'label-warning': pago.Estado === 'PENDIENTE',
                'label-info': pago.Estado === 'ENVIADO',
                'label-success': pago.Estado === 'APROBADO' || pago.Estado === 'PAGADO',
                'label-danger': pago.Estado === 'RECHAZADO' || pago.Estado === 'CANCELADO'
              }">
                {{ pago.Estado }}
              </span>
            </p>
          </div>
          <div class="col-md-3">
            <label>Excepción:</label>
            <p>
              <span v-if="pago.EsExcepcion" class="label label-info">Sí</span>
              <span v-else>No</span>
            </p>
          </div>
          <div class="col-md-6">
            <label>Fecha Creación:</label>
            <p>{{ formatDate(pago.CreatedAt) }}</p>
          </div>
        </div>

        <div class="row" v-if="pago.Observaciones">
          <div class="col-md-12">
            <label>Observaciones:</label>
            <pre class="observaciones-box">{{ pago.Observaciones }}</pre>
          </div>
        </div>

        <hr>

        <!-- Assignment Information -->
        <h5 class="section-title">Información de la Asignación</h5>
        <div class="row">
          <div class="col-md-3">
            <label>ID Asignación:</label>
            <p>{{ pago.AsignacionCargaId }}</p>
          </div>
          <div class="col-md-3">
            <label>N° Contrato:</label>
            <p><strong>{{ pago.NumeroContrato }}</strong></p>
          </div>
          <div class="col-md-3">
            <label>CI Docente:</label>
            <p>{{ pago.CiDocente }}</p>
          </div>
          <div class="col-md-3">
            <label>Monto Total Asignación:</label>
            <p><strong>Bs. {{ pago.MontoTotalAsignacion.toFixed(2) }}</strong></p>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <label>Docente:</label>
            <p>{{ pago.NombreCompleto }}</p>
          </div>
          <div class="col-md-2">
            <label>Sigla:</label>
            <p>{{ pago.Sigla }}</p>
          </div>
          <div class="col-md-3" v-if="pago.NombreMateria">
            <label>Materia:</label>
            <p><strong>{{ pago.NombreMateria }}</strong></p>
          </div>
          <div class="col-md-2">
            <label>Paralelo:</label>
            <p>{{ pago.Paralelo }}</p>
          </div>
          <div class="col-md-2">
            <label>Codigo de Paralelo:</label>
            <p>{{ pago.CodigoParalelo }}</p>
          </div>
        </div>

        <div class="row">
          <div class="col-md-2">
            <label>Horas/Semana:</label>
            <p>{{ pago.HorasSemana }}</p>
          </div>
          <div class="col-md-2">
            <label>Horas/Mes:</label>
            <p>{{ pago.HorasMes }}</p>
          </div>
          <div class="col-md-2">
            <label>Costo/Hora:</label>
            <p>Bs. {{ pago.CostoHora }}</p>
          </div>
          <div class="col-md-2">
            <label>Cant. Meses:</label>
            <p>{{ pago.CantidadMeses }}</p>
          </div>
          <div class="col-md-4">
            <label>Cod U.O.:</label>
            <p>{{ pago.CodUnidadOrganizacional }}</p>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <label>Unidad Organizacional:</label>
            <p>{{ pago.UnidadOrganizacional }}</p>
          </div>
        </div>

        <hr>

        <!-- Process Information -->
        <h5 class="section-title">Información del Proceso</h5>
        <div class="row">
          <div class="col-md-3">
            <label>ID Proceso:</label>
            <p>{{ pago.ProcesoId }}</p>
          </div>
          <div class="col-md-3">
            <label>Sede:</label>
            <p>{{ pago.SedeName }}</p>
          </div>
          <div class="col-md-3">
            <label>Período:</label>
            <p>{{ pago.PeriodoId }}</p>
          </div>
          <div class="col-md-3">
            <label>Estado Proceso:</label>
            <p>{{ pago.ProcesoEstado }}</p>
          </div>
        </div>
      </div>
    </div>

    <span slot="footer" class="dialog-footer">
      <button type="button" class="btn btn-default" @click="onClose">Cerrar</button>
    </span>
  </el-dialog>
</template>
  
  <script>
  import axios from 'axios'
  import { Dialog } from 'element-ui'
  
  export default {
    name: 'DetailModal',
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
        pago: null
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
            this.loading = false
          })
          .catch(error => {
            console.error('Error cargando detalle:', error)
            this.$message.error('Error al cargar el detalle del pago')
            this.loading = false
            this.onClose()
          })
      },
      
      formatDate (date) {
        if (!date) return '-'
        const d = new Date(date)
        return d.toLocaleString('es-BO')
      },
      
      onClose () {
        this.dialogVisible = false
        this.pago = null
      }
    }
  }
  </script>
  
  <style scoped>
.detail-container {
  padding: 10px;
}

.section-title {
  color: #2196F3;
  border-bottom: 2px solid #2196F3;
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
  margin-bottom: 3px;
}

p {
  margin: 0;
  padding: 5px 0;
}

.observaciones-box {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 4px;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 150px;
  overflow-y: auto;
}

.label {
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
}

.label-warning {
  background-color: #FFA000;
  color: white;
}

.label-success {
  background-color: #4CAF50;
  color: white;
}

.label-danger {
  background-color: #F44336;
  color: white;
}

.label-info {
  background-color: #2196F3;
  color: white;
}

hr {
  margin: 20px 0;
  border-top: 1px solid #eee;
}
</style>


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