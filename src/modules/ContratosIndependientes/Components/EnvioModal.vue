<template>
    <el-dialog
      :visible.sync="dialogVisible"
      :show-close="true"
      width="70%"
      :modal-append-to-body="true"
      :append-to-body="true"
      :close-on-click-modal="false"
      custom-class="envio-dialog"
      @close="onClose">
      
      <div v-loading="loading" class="envio-modal-content">
        <!-- Header -->
        <div class="modal-header-custom">
          <h4 class="modal-title-custom">
            <i class="fa fa-paper-plane"></i> Confirmar Envío para Aprobación
          </h4>
        </div>
  
        <!-- Content -->
        <div v-if="resumen" class="envio-container">
          <!-- Warning/Info Alert -->
          <div class="alert alert-info">
            <i class="fa fa-info-circle"></i>
            <strong>Información:</strong> Está a punto de enviar <strong>{{ resumen.TotalPagos }}</strong> 
            pago(s) para aprobación. Una vez enviados, no podrán ser modificados hasta que sean aprobados o rechazados.
          </div>
  
          <!-- Summary Totals -->
          <div class="summary-totals">
            <div class="summary-card highlight">
              <div class="summary-label">Total de Pagos a Enviar</div>
              <div class="summary-value text-primary">
                <strong>{{ resumen.TotalPagos }}</strong> pago(s)
              </div>
            </div>
          </div>
  
          <hr>
  
          <!-- Breakdown by Teacher Type -->
          <h5 class="section-title">
            <i class="fa fa-list"></i> Detalle por Tipo de Docente
          </h5>
  
          <el-table
            :data="resumen.DetallesPorTipo"
            border
            style="width: 100%; margin-top: 15px;">
            
            <el-table-column
              prop="TipoDocente"
              label="Tipo de Docente"
              min-width="180">
              <template slot-scope="scope">
                <span v-if="scope.row.TipoDocente === 'INDEPENDIENTE_CON_FACTURA'">
                  <i class="fa fa-file-text-o"></i> Con Factura
                </span>
                <span v-else-if="scope.row.TipoDocente === 'INDEPENDIENTE_SIN_FACTURA'">
                  <i class="fa fa-user"></i> Sin Factura
                </span>
                <span v-else-if="scope.row.TipoDocente === 'EXTRANJERO'">
                  <i class="fa fa-globe"></i> Extranjero
                </span>
                <span v-else>{{ scope.row.TipoDocente }}</span>
              </template>
            </el-table-column>
  
            <el-table-column
              prop="Cantidad"
              label="Cantidad"
              width="100"
              align="center">
              <template slot-scope="scope">
                <span class="badge badge-primary">{{ scope.row.Cantidad }}</span>
              </template>
            </el-table-column>
  
            <el-table-column
              prop="Porcentaje"
              label="% Retención"
              width="120"
              align="center">
              <template slot-scope="scope">
                <span class="label" :class="{
                  'label-success': scope.row.Porcentaje === 0,
                  'label-warning': scope.row.Porcentaje > 0
                }">
                  {{ scope.row.Porcentaje.toFixed(2) }}%
                </span>
              </template>
            </el-table-column>
  
            <el-table-column
              prop="MontoBruto"
              label="Monto Bruto"
              width="150"
              align="right">
              <template slot-scope="scope">
                <strong>Bs. {{ scope.row.MontoBruto.toFixed(2) }}</strong>
              </template>
            </el-table-column>
  
            <el-table-column
              prop="MontoRetencion"
              label="Retención"
              width="150"
              align="right">
              <template slot-scope="scope">
                <span style="color: #F44336;">
                  - Bs. {{ scope.row.MontoRetencion.toFixed(2) }}
                </span>
              </template>
            </el-table-column>
  
            <el-table-column
              prop="MontoLiquido"
              label="Monto Líquido"
              width="170"
              align="right">
              <template slot-scope="scope">
                <strong style="color: #4CAF50;">
                  Bs. {{ scope.row.MontoLiquido.toFixed(2) }}
                </strong>
              </template>
            </el-table-column>
          </el-table>
  
          <!-- Additional Information -->
          <div class="alert alert-warning" style="margin-top: 20px;">
            <i class="fa fa-exclamation-triangle"></i>
            <strong>Nota Importante:</strong>
            <ul style="margin-bottom: 0; margin-top: 8px;">
              <li>Los pagos enviados pasarán al estado <strong>"ENVIADO"</strong></li>
              <li>Los montos de retención se calcularán automáticamente según el tipo de docente</li>
              <li>Los pagos enviados deberán ser aprobados en el módulo de <strong>PagosAprobados</strong></li>
              <li>Una vez enviados, solo podrán ser modificados si son rechazados</li>
            </ul>
          </div>
        </div>
  
        <!-- Error State -->
        <div v-if="errorMessage" class="alert alert-danger">
          <i class="fa fa-exclamation-circle"></i>
          <strong>Error:</strong> {{ errorMessage }}
        </div>
  
        <!-- Footer Buttons -->
        <div class="modal-footer-custom">
          <button type="button" class="btn btn-default" @click="onClose">
            <i class="fa fa-times"></i> Cancelar
          </button>
          <button 
            type="button" 
            class="btn btn-warning btn-fill" 
            :disabled="!resumen || loading"
            @click="confirmarEnvio">
            <i class="fa fa-paper-plane"></i> 
            Confirmar Envío ({{ resumen ? resumen.TotalPagos : 0 }} pagos)
          </button>
        </div>
      </div>
    </el-dialog>
  </template>
  
  <script>
  import axios from 'axios'
  import { Dialog, Table, TableColumn, MessageBox } from 'element-ui'
  
  export default {
    name: 'EnvioModal',
    components: {
      'el-dialog': Dialog,
      'el-table': Table,
      'el-table-column': TableColumn
    },
    props: {
      show: {
        type: Boolean,
        default: false
      },
      pagosIds: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        loading: false,
        resumen: null,
        errorMessage: null
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
        if (newVal && this.pagosIds && this.pagosIds.length > 0) {
          this.loadResumen()
        }
      }
    },
    methods: {
      loadResumen () {
        this.loading = true
        this.errorMessage = null
        this.resumen = null
        
        axios.post('/ProgramacionPagos/GetResumenEnvio', this.pagosIds, {
          headers: {
            token: localStorage.getItem('token'),
            'Content-Type': 'application/json'
          }
        })
          .then(response => {
            this.resumen = response.data
            this.loading = false
          })
          .catch(error => {
            console.error('Error cargando resumen:', error)
            this.loading = false
            
            this.errorMessage = error.response && error.response.data && error.response.data.Message
              ? error.response.data.Message
              : 'Error al cargar el resumen de envío'
            
            if (error.response && error.response.status === 400) {
              this.$message.error(this.errorMessage)
            }
          })
      },
      
      confirmarEnvio () {
        MessageBox.confirm(
          `¿Está seguro que desea enviar ${this.resumen.TotalPagos} pago(s) para aprobación?\n\n` +
          `Una vez enviados, los pagos no podrán ser modificados hasta que sean aprobados o rechazados.`,
          'Confirmar Envío',
          {
            confirmButtonText: 'Sí, enviar',
            cancelButtonText: 'Cancelar',
            type: 'warning',
            center: true
          }
        ).then(() => {
          this.enviarPagos()
        }).catch(() => {
          console.log('Envío cancelado por el usuario')
        })
      },
      
      enviarPagos () {
  console.log('🚀 Starting enviarPagos with IDs:', this.pagosIds)
  this.loading = true
  
  axios.post('/EjecucionPagos/EnviarParaAprobacion', {
    PagosIds: this.pagosIds
  }, {
    headers: {
      token: localStorage.getItem('token'),
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      console.log('✅ Response received:', response.data)
      console.log('About to reload page...')
      
      // Force reload immediately
      location.reload()
    })
    .catch(error => {
      console.error('❌ Error enviando pagos:', error)
      console.error('Error details:', error.response)
      this.loading = false
      
      const errorMsg = error.response && error.response.data && error.response.data.Message
        ? error.response.data.Message
        : 'Error al enviar los pagos para aprobación'
      
      this.$message.error(errorMsg)
    })
},
      
      onClose () {
        this.dialogVisible = false
        this.resumen = null
        this.errorMessage = null
      }
    }
  }
  </script>
  
  <style scoped>
  /* Modal Content Container */
  .envio-modal-content {
    padding: 0;
  }
  
  /* Custom Header */
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
  
  /* Content Container */
  .envio-container {
    padding: 0 20px;
  }
  
  /* Section Title */
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
  
  /* Summary Card */
  .summary-totals {
    margin: 20px 0;
  }
  
  .summary-card {
    background-color: #f9f9f9;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 10px;
    text-align: center;
    transition: all 0.3s ease;
  }
  
  .summary-card:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transform: translateY(-2px);
  }
  
  .summary-card.highlight {
    background-color: #f1f8f4;
    border-color: #4CAF50;
    border-width: 2px;
  }
  
  .summary-label {
    font-size: 13px;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 10px;
    font-weight: 600;
  }
  
  .summary-value {
    font-size: 20px;
    font-weight: 700;
    margin: 0;
  }
  
  .text-primary {
    color: #2196F3;
  }
  
  /* Table Badges and Labels */
  .badge {
    padding: 5px 12px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 600;
  }
  
  .badge-primary {
    background-color: #2196F3;
    color: white;
  }
  
  .label {
    padding: 4px 8px;
    border-radius: 3px;
    font-size: 11px;
    font-weight: 600;
  }
  
  .label-success {
    background-color: #4CAF50;
    color: white;
  }
  
  .label-warning {
    background-color: #FFA000;
    color: white;
  }
  
  /* Alerts */
  .alert {
    padding: 12px 15px;
    border-radius: 4px;
    margin-bottom: 15px;
  }
  
  .alert i {
    margin-right: 8px;
  }
  
  .alert ul {
    padding-left: 20px;
    margin-top: 8px;
    margin-bottom: 0;
  }
  
  .alert ul li {
    margin-bottom: 5px;
  }
  
  .alert-info {
    background-color: #e3f2fd;
    border: 1px solid #2196F3;
    color: #1976D2;
  }
  
  .alert-warning {
    background-color: #fff3cd;
    border: 1px solid #ffc107;
    color: #856404;
  }
  
  .alert-danger {
    background-color: #ffebee;
    border: 1px solid #F44336;
    color: #c62828;
  }
  
  /* Divider */
  hr {
    margin: 20px 0;
    border: 0;
    border-top: 1px solid #e0e0e0;
  }
  
  /* Custom Footer */
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
  </style>
  
  <!-- Global styles for dialog positioning -->
  <style>

.envio-dialog {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-left: 330px;
  padding-top: 2px;
}
  
  .envio-dialog .el-dialog {
    margin: 0 !important;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
  }
  
  .envio-dialog .el-dialog__header {
    display: none !important;
  }
  
  .envio-dialog .el-dialog__body {
    padding: 0 !important;
    flex: 1;
    overflow-y: auto;
  }
  
  .envio-dialog .el-dialog__footer {
    display: none !important;
  }
  </style>
</style>