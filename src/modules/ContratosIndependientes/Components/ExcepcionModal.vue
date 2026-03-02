<template>
    <el-dialog
      :visible.sync="dialogVisible"
      :show-close="true"
      width="70%"
      :modal-append-to-body="true"
      :append-to-body="true"
      :close-on-click-modal="false"
      custom-class="excepcion-dialog"
      @close="onClose">
      
      <div class="excepcion-modal-content">
        <!-- Header -->
        <div class="modal-header-custom">
          <h4 class="modal-title-custom">
            <i class="fa fa-edit"></i> Programación Personalizada
          </h4>
        </div>
  
        <div v-if="asignacion" class="excepcion-container">
          <!-- Assignment Info -->
          <div class="assignment-info-box">
            <div class="row">
              <div class="col-md-4">
                <label>Docente:</label>
                <p><strong>{{ asignacion.NombreCompleto }}</strong></p>
              </div>
              <div class="col-md-3">
                <label>CI:</label>
                <p>{{ asignacion.CiDocente }}</p>
              </div>
              <div class="col-md-3">
                <label>Materia:</label>
                <p>{{ asignacion.Sigla }} - {{ asignacion.Paralelo }}</p>
              </div>
              <div class="col-md-2">
                <label>Contrato:</label>
                <p>{{ asignacion.NumeroContrato }}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <label>Monto Total de la Asignación:</label>
                <p class="monto-total">Bs. {{ formatMoney(asignacion.MontoTotal) }}</p>
              </div>
              <div class="col-md-6">
                <label>Programación:</label>
                <p>
                  <span v-if="pagosCustom.length === 0" class="label label-default">
                    <i class="fa fa-calendar"></i> Estándar ({{ mesesDefault.length }} meses)
                  </span>
                  <span v-else class="label label-warning">
                    <i class="fa fa-exclamation-circle"></i> Personalizada ({{ pagosCustom.length }} meses)
                  </span>
                </p>
              </div>
            </div>
          </div>
  
          <hr>
  
          <!-- Custom Payments Configuration -->
          <h5 class="section-title">
            <i class="fa fa-calendar-plus-o"></i> Configurar Meses de Pago
          </h5>
  
          <div class="row" style="margin-bottom: 15px;">
            <div class="col-md-6">
              <button 
                type="button" 
                class="btn btn-default btn-sm"
                @click="useDefaultMonths">
                <i class="fa fa-refresh"></i> Usar meses estándar
              </button>
              <button 
                type="button" 
                class="btn btn-info btn-sm"
                style="margin-left: 10px;"
                @click="addCustomMonth">
                <i class="fa fa-plus"></i> Agregar mes
              </button>
            </div>
            <div class="col-md-6 text-right">
              <div class="alert alert-info" style="padding: 5px 10px; margin: 0; display: inline-block;">
                <strong>Total asignado:</strong> Bs. {{ totalAsignado.toFixed(2) }} / Bs. {{ asignacion.MontoTotal.toFixed(2) }}
                <span v-if="Math.abs(totalAsignado - asignacion.MontoTotal) > 0.01" style="color: #d9534f; margin-left: 10px;">
                  <i class="fa fa-exclamation-triangle"></i>
                  Diferencia: Bs. {{ (asignacion.MontoTotal - totalAsignado).toFixed(2) }}
                </span>
                <span v-else style="color: #5cb85c; margin-left: 10px;">
                  <i class="fa fa-check"></i> Correcto
                </span>
              </div>
            </div>
          </div>
  
          <!-- Custom Payments Table -->
          <div v-if="pagosCustom.length > 0" class="custom-payments-table">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th width="10%">Orden</th>
                  <th width="20%">Mes</th>
                  <th width="15%">Año</th>
                  <th width="30%">Monto</th>
                  <th width="15%">% del Total</th>
                  <th width="10%">Acción</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(pago, index) in pagosCustom" :key="index">
                  <td class="text-center">{{ index + 1 }}°</td>
                  <td>
                    <el-select 
                      v-model="pago.Mes" 
                      placeholder="Mes"
                      size="small"
                      style="width: 100%;">
                      <el-option 
                        v-for="mes in meses" 
                        :key="mes.value" 
                        :label="mes.label" 
                        :value="mes.value">
                      </el-option>
                    </el-select>
                  </td>
                  <td>
                    <el-select 
                      v-model="pago.Anio" 
                      placeholder="Año"
                      size="small"
                      style="width: 100%;">
                      <el-option 
                        v-for="year in anios" 
                        :key="year" 
                        :label="year" 
                        :value="year">
                      </el-option>
                    </el-select>
                  </td>
                  <td>
                    <el-input-number
                      v-model="pago.Monto"
                      :precision="2"
                      :step="0.01"
                      :min="0"
                      :max="asignacion.MontoTotal"
                      size="small"
                      style="width: 100%;">
                    </el-input-number>
                  </td>
                  <td class="text-center">
                    <strong>{{ ((pago.Monto / asignacion.MontoTotal) * 100).toFixed(2) }}%</strong>
                  </td>
                  <td class="text-center">
                    <button
                      class="btn btn-danger btn-xs"
                      @click="removeCustomMonth(index)"
                      :disabled="pagosCustom.length === 1">
                      <i class="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="info">
                  <td colspan="3" class="text-right"><strong>TOTAL:</strong></td>
                  <td><strong>Bs. {{ totalAsignado.toFixed(2) }}</strong></td>
                  <td class="text-center">
                    <strong>{{ ((totalAsignado / asignacion.MontoTotal) * 100).toFixed(2) }}%</strong>
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
  
          <!-- Empty State -->
          <div v-else class="text-center" style="padding: 40px;">
            <i class="fa fa-calendar-times-o" style="font-size: 48px; color: #ccc;"></i>
            <p style="margin-top: 15px; color: #999;">
              No hay meses configurados. Use los botones de arriba para configurar.
            </p>
          </div>
  
          <!-- Actions -->
          <div class="row" style="margin-top: 20px;">
            <div class="col-md-12">
              <button 
                type="button" 
                class="btn btn-sm btn-default"
                @click="distributeEqually"
                :disabled="pagosCustom.length === 0">
                <i class="fa fa-balance-scale"></i> Distribuir montos equitativamente
              </button>
            </div>
          </div>
  
          <!-- Warning if not matching -->
          <div v-if="Math.abs(totalAsignado - asignacion.MontoTotal) > 0.01" class="alert alert-warning" style="margin-top: 20px;">
            <i class="fa fa-exclamation-triangle"></i>
            <strong>Advertencia:</strong> El total de los pagos personalizados debe ser igual al monto total de la asignación.
            Ajuste los montos antes de guardar.
          </div>
        </div>
  
        <!-- Footer -->
        <div class="modal-footer-custom">
          <button type="button" class="btn btn-default" @click="onClose">
            <i class="fa fa-times"></i> Cancelar
          </button>
          <button 
            type="button" 
            class="btn btn-warning btn-fill" 
            :disabled="!canSave"
            @click="save">
            <i class="fa fa-save"></i> 
            Guardar Excepción
          </button>
        </div>
      </div>
    </el-dialog>
  </template>
  
  <script>
  import { Dialog, Select, Option, InputNumber } from 'element-ui'
  
  export default {
    name: 'ExcepcionModal',
    components: {
      'el-dialog': Dialog,
      'el-select': Select,
      'el-option': Option,
      'el-input-number': InputNumber
    },
    props: {
      show: {
        type: Boolean,
        default: false
      },
      asignacion: {
        type: Object,
        default: null
      },
      mesesDefault: {
        type: Array,
        default: () => []
      }
    },
    data () {
      const currentYear = new Date().getFullYear()
      return {
        pagosCustom: [],
        meses: [
          { value: 1, label: 'Enero' },
          { value: 2, label: 'Febrero' },
          { value: 3, label: 'Marzo' },
          { value: 4, label: 'Abril' },
          { value: 5, label: 'Mayo' },
          { value: 6, label: 'Junio' },
          { value: 7, label: 'Julio' },
          { value: 8, label: 'Agosto' },
          { value: 9, label: 'Septiembre' },
          { value: 10, label: 'Octubre' },
          { value: 11, label: 'Noviembre' },
          { value: 12, label: 'Diciembre' }
        ],
        anios: [
          currentYear - 1,
          currentYear,
          currentYear + 1,
          currentYear + 2
        ]
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
      
      totalAsignado () {
        return this.pagosCustom.reduce((sum, p) => sum + (p.Monto || 0), 0)
      },
      
      canSave () {
        if (this.pagosCustom.length === 0) return false
        
        // Check all have month, year, and monto
        const allValid = this.pagosCustom.every(p => 
          p.Mes && p.Anio && p.Monto > 0
        )
        
        if (!allValid) return false
        
        // Check total matches (with 0.01 tolerance for rounding)
        const difference = Math.abs(this.totalAsignado - this.asignacion.MontoTotal)
        return difference <= 0.01
      }
    },
    watch: {
      show (newVal) {
        if (newVal && this.asignacion) {
          this.initializePagos()
        }
      }
    },
    methods: {
      initializePagos () {
        // Start with default months if no custom payments
        if (this.mesesDefault.length > 0) {
          this.useDefaultMonths()
        } else {
          this.pagosCustom = []
        }
      },
      
      useDefaultMonths () {
        if (this.mesesDefault.length === 0) return
        
        // Calculate payments based on default months
        const total = this.asignacion.MontoTotal
        const count = this.mesesDefault.length
        
        // Use same precise calculation as backend
        const perPayment = Math.floor((total / count) * 100) / 100
        const remainder = total - (perPayment * count)
        
        this.pagosCustom = this.mesesDefault.map((mes, index) => {
          const isLast = index === count - 1
          const monto = isLast ? perPayment + remainder : perPayment
          
          return {
            Mes: mes.Mes,
            Anio: mes.Anio,
            Monto: monto
          }
        })
      },
      
      addCustomMonth () {
  const currentDate = new Date()
  this.pagosCustom.push({
    Mes: currentDate.getMonth() + 1,
    Anio: currentDate.getFullYear(),
    Monto: 0
  })
  
  // Auto-calculate amounts after adding
  this.$nextTick(() => {
    this.distributeEqually()
  })
},
      
removeCustomMonth (index) {
  if (this.pagosCustom.length > 1) {
    this.pagosCustom.splice(index, 1)
    
    // Auto-recalculate amounts after removing
    this.$nextTick(() => {
      this.distributeEqually()
    })
  }
},
      
      distributeEqually () {
        if (this.pagosCustom.length === 0) return
        
        const total = this.asignacion.MontoTotal
        const count = this.pagosCustom.length
        
        // Use precise calculation
        const perPayment = Math.floor((total / count) * 100) / 100
        const remainder = total - (perPayment * count)
        
        this.pagosCustom.forEach((pago, index) => {
          const isLast = index === count - 1
          pago.Monto = isLast ? perPayment + remainder : perPayment
        })
      },
      
      save () {
        if (!this.canSave) {
          this.$message.warning('Verifique que todos los pagos estén completos y el total coincida')
          return
        }
        
        const excepcion = {
          AsignacionId: this.asignacion.Id,
          PagosCustom: this.pagosCustom.map(p => ({
            Mes: p.Mes,
            Anio: p.Anio,
            Monto: p.Monto
          }))
        }
        
        this.$emit('save', excepcion)
        this.onClose()
      },
      
      formatMoney (amount) {
        if (!amount) return '0.00'
        return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      },
      
      onClose () {
        this.dialogVisible = false
        this.pagosCustom = []
      }
    }
  }
  </script>
  
  <style scoped>
  .excepcion-modal-content {
    padding: 0;
  }
  
  .modal-header-custom {
    padding: 20px 20px 15px 20px;
    border-bottom: 2px solid #e0e0e0;
    margin-bottom: 20px;
  }
  
  .modal-title-custom {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }
  
  .modal-title-custom i {
    color: #FFA000;
    margin-right: 8px;
  }
  
  .excepcion-container {
    padding: 0 20px;
  }
  
  .assignment-info-box {
    background-color: #f9f9f9;
    padding: 15px;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
  }
  
  .assignment-info-box label {
    font-weight: 600;
    color: #666;
    font-size: 11px;
    text-transform: uppercase;
    margin-bottom: 3px;
    display: block;
  }
  
  .assignment-info-box p {
    margin: 0;
    color: #333;
    font-size: 14px;
  }
  
  .monto-total {
    font-size: 18px;
    font-weight: 700;
    color: #2196F3;
  }
  
  .section-title {
    color: #FFA000;
    border-bottom: 2px solid #FFA000;
    padding-bottom: 5px;
    margin-bottom: 15px;
    margin-top: 10px;
    font-size: 16px;
    font-weight: 600;
  }
  
  .section-title i {
    margin-right: 8px;
  }
  
  .custom-payments-table {
    margin-top: 15px;
  }
  
  .label {
    padding: 4px 8px;
    border-radius: 3px;
    font-size: 11px;
    font-weight: 600;
  }
  
  .label-default {
    background-color: #999;
    color: white;
  }
  
  .label-warning {
    background-color: #FFA000;
    color: white;
  }
  
  .modal-footer-custom {
    padding: 15px 20px;
    border-top: 2px solid #e0e0e0;
    margin-top: 25px;
    text-align: right;
    background-color: #fafafa;
  }
  
  .modal-footer-custom .btn {
    margin-left: 10px;
    padding: 8px 20px;
    font-size: 14px;
  }
  
  .alert {
    padding: 10px 15px;
    border-radius: 4px;
  }
  
  .alert-warning {
    background-color: #fff3cd;
    border: 1px solid #ffc107;
    color: #856404;
  }
  
  .alert-info {
    background-color: #e3f2fd;
    border: 1px solid #2196F3;
    color: #1976D2;
  }
  
  hr {
    margin: 20px 0;
    border-top: 1px solid #eee;
  }
  </style>
  
  <style>
  .excepcion-dialog {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .excepcion-dialog .el-dialog {
    margin: 0 !important;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
  }
  
  .excepcion-dialog .el-dialog__header {
    display: none !important;
  }
  
  .excepcion-dialog .el-dialog__body {
    padding: 0 !important;
    flex: 1;
    overflow-y: auto;
  }
  
  .excepcion-dialog .el-dialog__footer {
    display: none !important;
  }
  </style>