<template>
    <el-dialog
      :visible.sync="dialogVisible"
      title="Detalle del Pago en Ejecución"
      width="80%"
      :modal-append-to-body="true"
      :append-to-body="true"
      custom-class="centered-dialog"
      @close="onClose">
      
      <div v-loading="loading">
        <div v-if="pago" class="detail-container">
          
          <!-- Ejecucion Pago Header -->
          <div class="section-header execution">
            <h5><i class="fa fa-check-circle"></i> Información de Ejecución</h5>
          </div>
          
          <div class="info-card">
            <div class="row">
              <div class="col-md-3">
                <label>ID Ejecución:</label>
                <p>{{ pago.PagoEjecutadoId }}</p>
              </div>
              <div class="col-md-3">
                <label>Estado:</label>
                <p>
                  <span :class="getEstadoBadge(pago.Estado)">
                    {{ pago.Estado }}
                  </span>
                </p>
              </div>
              <div class="col-md-3">
                <label>Tipo Docente:</label>
                <p>
                  <span :class="getTipoDocenteBadge(pago.TipoDocente)">
                    {{ formatTipoDocente(pago.TipoDocente) }}
                  </span>
                </p>
              </div>
              <div class="col-md-3">
                <label>Fecha Envío:</label>
                <p>{{ formatDate(pago.FechaEnvio) }}</p>
              </div>
            </div>
  
            <div class="row">
              <div class="col-md-3">
                <label>Monto Contrato (Bruto):</label>
                <p class="amount-value">Bs. {{ formatMoney(pago.MontoContrato) }}</p>
              </div>
              <div class="col-md-3">
                <label>Porcentaje Retención:</label>
                <p><strong>{{ pago.PorcentajeRetencion.toFixed(2) }}%</strong></p>
              </div>
              <div class="col-md-3">
                <label>Monto Retención:</label>
                <p class="amount-retention">Bs. {{ formatMoney(pago.MontoRetencion) }}</p>
              </div>
              <div class="col-md-3">
                <label>Monto Líquido a Pagar:</label>
                <p class="amount-net">Bs. {{ formatMoney(pago.MontoReal) }}</p>
              </div>
            </div>
  
            <div class="row" v-if="pago.FechaAprobacion">
              <div class="col-md-6">
                <label>Fecha Aprobación:</label>
                <p>{{ formatDate(pago.FechaAprobacion) }}</p>
              </div>
              <div class="col-md-6">
                <label>Aprobado Por (ID):</label>
                <p>{{ pago.AprobadoPor }}</p>
              </div>
            </div>
  
            <div class="row" v-if="pago.ObservacionesEjecucion">
              <div class="col-md-12">
                <label>Observaciones de Ejecución:</label>
                <pre class="observaciones-box">{{ pago.ObservacionesEjecucion }}</pre>
              </div>
            </div>
  
            <div class="row" v-if="pago.MotivoRechazo">
              <div class="col-md-12">
                <div class="alert alert-danger">
                  <strong><i class="fa fa-exclamation-triangle"></i> Motivo de Rechazo:</strong>
                  <p style="margin-top: 10px; margin-bottom: 0;">{{ pago.MotivoRechazo }}</p>
                </div>
              </div>
            </div>
          </div>
  
          <hr>
  
          <!-- Pago Programado Info -->
<div class="section-header scheduled">
  <h5><i class="fa fa-calendar"></i> Información del Pago Programado</h5>
</div>

<div class="info-card">
  <div class="row">
    <div class="col-md-3">
      <label>Mes/Año de Pago:</label>
      <p><strong>{{ getMonthName(pago.MesPago) }} {{ pago.AnioPago }}</strong></p>
    </div>
    
    <!-- Show MontoOriginal if it exists and differs from MontoBruto -->
    <template v-if="montoFueCambiado">
      <div class="col-md-3">
        <label>Monto Original Planificado:</label>
        <p class="monto-original">Bs. {{ formatMoney(pago.MontoOriginal || pago.MontoBruto) }}</p>
      </div>
      <div class="col-md-3">
        <label>Monto Actual a Pagar:</label>
        <p class="monto-cambiado">Bs. {{ formatMoney(pago.MontoBruto) }}</p>
      </div>
      <div class="col-md-3">
        <label>Diferencia:</label>
        <p :class="diferenciaMonto >= 0 ? 'text-success' : 'text-danger'">
          <strong>{{ diferenciaMonto >= 0 ? '+' : '' }}Bs. {{ formatMoney(Math.abs(diferenciaMonto)) }}</strong>
        </p>
      </div>
    </template>
    
    <!-- Show normal MontoBruto if no change -->
    <template v-else>
      <div class="col-md-3">
        <label>Monto Bruto:</label>
        <p>Bs. {{ formatMoney(pago.MontoBruto) }}</p>
      </div>
      <div class="col-md-3">
        <label>Porcentaje del Total:</label>
        <p>{{ pago.Porcentaje.toFixed(2) }}%</p>
      </div>
      <div class="col-md-3">
        <label>Tipo de Pago:</label>
        <p>
          <span v-if="pago.EsExcepcion" class="label label-warning">
            <i class="fa fa-exclamation-circle"></i> Excepción
          </span>
          <span v-else class="label label-info">
            <i class="fa fa-calendar-check-o"></i> Estándar
          </span>
        </p>
      </div>
    </template>
  </div>

  <!-- Second row when amount was changed -->
  <div class="row" v-if="montoFueCambiado">
    <div class="col-md-3">
      <label>Porcentaje del Total:</label>
      <p>{{ pago.Porcentaje.toFixed(2) }}%</p>
    </div>
    <div class="col-md-3">
      <label>Tipo de Pago:</label>
      <p>
        <span v-if="pago.EsExcepcion" class="label label-warning">
          <i class="fa fa-exclamation-circle"></i> Excepción
        </span>
        <span v-else class="label label-info">
          <i class="fa fa-calendar-check-o"></i> Estándar
        </span>
      </p>
    </div>
  </div>
  
  <!-- Show change observations if exists -->
  <div class="row" v-if="montoFueCambiado && pago.Observaciones">
    <div class="col-md-12">
      <div class="alert alert-info" style="margin-top: 15px; margin-bottom: 0;">
        <strong><i class="fa fa-info-circle"></i> Motivo del cambio de monto:</strong>
        <pre class="observaciones-box" style="margin-top: 10px; background-color: white;">{{ pago.Observaciones }}</pre>
      </div>
    </div>
  </div>
</div>
  
          <hr>
  
          <!-- Asignacion Info -->
          <div class="section-header assignment">
            <h5><i class="fa fa-graduation-cap"></i> Información de la Asignación</h5>
          </div>
  
          <div class="info-card">
            <div class="row">
              <div class="col-md-4">
                <label>Docente:</label>
                <p><strong>{{ pago.NombreCompleto }}</strong></p>
              </div>
              <div class="col-md-2">
                <label>CI:</label>
                <p>{{ pago.CiDocente }}</p>
              </div>
              <div class="col-md-3">
                <label>N° Contrato:</label>
                <p><strong>{{ pago.NumeroContrato }}</strong></p>
              </div>
              <div class="col-md-3">
                <label>Sede:</label>
                <p>{{ pago.SedeName }}</p>
              </div>
            </div>
  
            <div class="row">
              <div class="col-md-2">
                <label>Sigla:</label>
                <p>{{ pago.Sigla }}</p>
              </div>
              <div class="col-md-2">
                <label>Paralelo:</label>
                <p>{{ pago.Paralelo }}</p>
              </div>
              <div class="col-md-3">
                <label>Código Paralelo SAP:</label>
                <p>{{ pago.CodigoParalelo }}</p>
              </div>
              <div class="col-md-2">
                <label>Período:</label>
                <p>{{ pago.PeriodoId }}</p>
              </div>
              <div class="col-md-3">
                <label>ID Proceso:</label>
                <p>{{ pago.ProcesoId }}</p>
              </div>
            </div>
  
            <div class="row">
              <div class="col-md-2">
                <label>Horas/Mes:</label>
                <p>{{ pago.HorasMes.toFixed(2) }}</p>
              </div>
              <div class="col-md-2">
                <label>Costo/Hora:</label>
                <p>Bs. {{ pago.CostoHora.toFixed(2) }}</p>
              </div>
              <div class="col-md-2">
                <label>Cant. Meses:</label>
                <p>{{ pago.CantidadMeses }}</p>
              </div>
              <div class="col-md-3">
                <label>Monto Total Asignación:</label>
                <p class="amount-total">Bs. {{ formatMoney(pago.MontoTotalAsignacion) }}</p>
              </div>
            </div>
          </div>
          <hr>

<div class="section-header schedule">
  <h5><i class="fa fa-calendar-check-o"></i> Calendario de Pagos Programados</h5>
</div>

<div class="info-card">
  <p class="help-block">
    <i class="fa fa-info-circle"></i>
    Todos los pagos programados para esta asignación
  </p>
  
  <table class="table table-bordered table-sm">
    <thead>
      <tr>
        <th width="10%" class="text-center">#</th>
        <th width="25%">Mes / Año</th>
        <th width="15%" class="text-right">Monto</th>
        <th width="15%" class="text-center">%</th>
        <th width="20%" class="text-center">Tipo</th>
        <th width="15%" class="text-center">Estado</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(pago, index) in pago.CalendarioPagos" 
          :key="pago.Id"
          :class="{ 'current-payment': pago.Id === pagoId }">
        <td class="text-center">{{ index + 1 }}°</td>
        <td>
          <strong>{{ getMonthName(pago.MesPago) }} {{ pago.AnioPago }}</strong>
          <i v-if="pago.Id === pagoId" 
             class="fa fa-arrow-left" 
             style="margin-left: 8px; color: #2196F3;"
             title="Pago actual"></i>
        </td>
        <td class="text-right">Bs. {{ formatMoney(pago.Monto) }}</td>
        <td class="text-center">{{ pago.Porcentaje.toFixed(2) }}%</td>
        <td class="text-center">
          <span v-if="pago.EsExcepcion" class="label label-warning">
            <i class="fa fa-exclamation-circle"></i> Excepción
          </span>
          <span v-else class="label label-info">
            <i class="fa fa-calendar-check-o"></i> Estándar
          </span>
        </td>
        <td class="text-center">
          <span :class="getEstadoPagoBadge(pago.Estado)">
            {{ pago.Estado }}
          </span>
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td colspan="2" class="text-right"><strong>Total:</strong></td>
        <td class="text-right">
          <strong>Bs. {{ formatMoney(totalPagosAsignacion) }}</strong>
        </td>
        <td class="text-center">
          <strong>{{ totalPorcentaje.toFixed(2) }}%</strong>
        </td>
        <td colspan="2"></td>
      </tr>
    </tfoot>
  </table>
</div>
  
          <!-- Excel Values Section (Only for approved payments) -->
          <template v-if="showExcelValues && valoresExcel">
            <hr>
            
            <div class="section-header excel">
              <h5><i class="fa fa-file-excel-o"></i> Valores Generados en Excel</h5>
            </div>
  
            <div class="info-card excel-card">
              <div class="row">
                <div class="col-md-3">
                  <label>Codigo_Socio:</label>
                  <p>{{ valoresExcel.CodigoSocio || '-' }}</p>
                </div>
                <div class="col-md-4">
                  <label>Nombre_Socio:</label>
                  <p>{{ valoresExcel.NombreSocio }}</p>
                </div>
                <div class="col-md-3">
                  <label>Cod_Dependencia:</label>
                  <p>{{ valoresExcel.CodDependencia || '-' }}</p>
                </div>
                <div class="col-md-2">
                  <label>PEI_PO:</label>
                  <p>{{ valoresExcel.PEIPO }}</p>
                </div>
              </div>
  
              <div class="row">
                <div class="col-md-4">
                  <label>Nombre_del_Servicio:</label>
                  <p>{{ valoresExcel.NombreDelServicio || '-' }}</p>
                </div>
                <div class="col-md-2">
                  <label>Periodo_Academico:</label>
                  <p>{{ valoresExcel.PeriodoAcademico }}</p>
                </div>
                <div class="col-md-2">
                  <label>Sigla_Asignatura:</label>
                  <p>{{ valoresExcel.SiglaAsignatura }}</p>
                </div>
                <div class="col-md-2">
                  <label>Paralelo:</label>
                  <p>{{ valoresExcel.Paralelo }}</p>
                </div>
                <div class="col-md-2">
                  <label>Código_Paralelo_SAP:</label>
                  <p>{{ valoresExcel.CodigoParaleloSAP }}</p>
                </div>
              </div>
  
              <div class="row">
                <div class="col-md-3">
                  <label>Cuenta_Asignada:</label>
                  <p>{{ valoresExcel.CuentaAsignada }}</p>
                </div>
                <div class="col-md-2">
                  <label>Monto_Contrato:</label>
                  <p class="excel-amount">Bs. {{ formatMoney(valoresExcel.MontoContrato) }}</p>
                </div>
                <div class="col-md-2">
                  <label>Monto_IUE:</label>
                  <p class="excel-amount">Bs. {{ formatMoney(valoresExcel.MontoIUE) }}</p>
                </div>
                <div class="col-md-2">
                  <label>Monto_IT:</label>
                  <p class="excel-amount">Bs. {{ formatMoney(valoresExcel.MontoIT) }}</p>
                </div>
                <div class="col-md-3">
                  <label>IUEExterior:</label>
                  <p class="excel-amount">Bs. {{ formatMoney(valoresExcel.IUEExterior) }}</p>
                </div>
              </div>
  
              <div class="row">
                <div class="col-md-3">
                  <label>Monto_a_Pagar:</label>
                  <p class="excel-amount-final">Bs. {{ formatMoney(valoresExcel.MontoAPagar) }}</p>
                </div>
                <div class="col-md-9">
                  <label>Observaciones:</label>
                  <p>{{ valoresExcel.Observaciones || '-' }}</p>
                </div>
              </div>
            </div>
          </template>
  
          <!-- Summary Box -->
          <div class="summary-box">
            <h6><i class="fa fa-calculator"></i> Resumen de Cálculos</h6>
            <div class="row">
              <div class="col-md-3">
                <div class="summary-item">
                  <span class="summary-label">Monto Base:</span>
                  <span class="summary-value">Bs. {{ formatMoney(pago.MontoContrato) }}</span>
                </div>
              </div>
              <div class="col-md-3">
                <div class="summary-item">
                  <span class="summary-label">(-) Retención {{ pago.PorcentajeRetencion.toFixed(2) }}%:</span>
                  <span class="summary-value negative">Bs. {{ formatMoney(pago.MontoRetencion) }}</span>
                </div>
              </div>
              <div class="col-md-3">
                <div class="summary-item">
                  <span class="summary-label">(=) Monto Líquido:</span>
                  <span class="summary-value success">Bs. {{ formatMoney(pago.MontoReal) }}</span>
                </div>
              </div>
              <div class="col-md-3">
                <div class="summary-item">
                  <span class="summary-label">% del Total:</span>
                  <span class="summary-value">{{ pago.Porcentaje.toFixed(2) }}%</span>
                </div>
              </div>
            </div>
          </div>
  
        </div>
      </div>
      
      <span slot="footer" class="dialog-footer">
        <button type="button" class="btn btn-default" @click="onClose">
          <i class="fa fa-times"></i> Cerrar
        </button>
      </span>
    </el-dialog>
  </template>
  
  <script>
  import axios from 'axios'
  import { Dialog, Message } from 'element-ui'
  
  export default {
    name: 'DetalleEjecucionModal',
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
      },
      showExcelValues: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        loading: false,
        pago: null,
        valoresExcel: null
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
      
  montoFueCambiado () {
    if (!this.pago) return false
    
    // If MontoOriginal exists and is different from current amount
    if (this.pago.MontoOriginal && this.pago.MontoOriginal !== this.pago.MontoBruto) {
      return true
    }
    
    return false
  },
  
 
  diferenciaMonto () {
    if (!this.pago || !this.montoFueCambiado) return 0
    return this.pago.MontoBruto - (this.pago.MontoOriginal || this.pago.MontoBruto)
  },
  
      totalPagosAsignacion () {
    if (!this.pago || !this.pago.CalendarioPagos) return 0
    return this.pago.CalendarioPagos.reduce((sum, p) => sum + p.Monto, 0)
  },
  
  
  totalPorcentaje () {
    if (!this.pago || !this.pago.CalendarioPagos) return 0
    return this.pago.CalendarioPagos.reduce((sum, p) => sum + p.Porcentaje, 0)
  }
    },
    watch: {
      show (newVal) {
        if (newVal && this.pagoId) {
          this.loadDetalle()
          if (this.showExcelValues) {
            this.loadValoresExcel()
          }
        }
      }
    },
    methods: {
      loadDetalle () {
        this.loading = true
        
        axios.get(`/EjecucionPagos/GetDetalle/${this.pagoId}`, {
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
            Message({
              message: 'Error al cargar el detalle del pago',
              type: 'error',
              duration: 3000
            })
            this.loading = false
            this.onClose()
          })
      },
      getEstadoPagoBadge (estado) {
    const badges = {
      'PENDIENTE': 'label label-default',
      'PROGRAMADO': 'label label-info',
      'ENVIADO': 'label label-info',
      'APROBADO': 'label label-success',
      'RECHAZADO': 'label label-danger',
      'PAGADO': 'label label-success'
    }
    return badges[estado] || 'label label-default'
  },
      
      loadValoresExcel () {
        axios.get(`/EjecucionPagos/GetValoresExcel/${this.pagoId}`, {
          headers: {
            token: localStorage.getItem('token')
          }
        })
          .then(response => {
            this.valoresExcel = response.data
          })
          .catch(error => {
            console.error('Error cargando valores Excel:', error)
            Message({
              message: 'Error al cargar los valores del Excel',
              type: 'warning',
              duration: 3000
            })
          })
      },
      
      formatDate (dateStr) {
        if (!dateStr) return '-'
        const date = new Date(dateStr)
        return date.toLocaleString('es-BO')
      },
      
      formatMoney (amount) {
        if (!amount && amount !== 0) return '0.00'
        return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      },
      
      getMonthName (mes) {
        const meses = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                       'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
        return mes >= 1 && mes <= 12 ? meses[mes] : ''
      },
      
      formatTipoDocente (tipo) {
        const tipos = {
          'INDEPENDIENTE_CON_FACTURA': 'Con Factura (0%)',
          'INDEPENDIENTE_SIN_FACTURA': 'Sin Factura (16%)',
          'EXTRANJERO': 'Extranjero (12.5%)'
        }
        return tipos[tipo] || tipo
      },
      
      getEstadoBadge (estado) {
        const badges = {
          'PENDIENTE_APROBACION': 'label label-warning',
          'APROBADO': 'label label-success',
          'RECHAZADO': 'label label-danger'
        }
        return badges[estado] || 'label label-default'
      },
      
      getTipoDocenteBadge (tipo) {
        const badges = {
          'INDEPENDIENTE_CON_FACTURA': 'label label-success',
          'INDEPENDIENTE_SIN_FACTURA': 'label label-warning',
          'EXTRANJERO': 'label label-info'
        }
        return badges[tipo] || 'label label-default'
      },
      
      onClose () {
        this.dialogVisible = false
        this.pago = null
        this.valoresExcel = null
      }
    }
  }
  </script>
  
  <style scoped>
  .detail-container {
    padding: 10px;
  }
  
  .section-header {
    padding: 10px 15px;
    border-radius: 5px;
    margin-bottom: 15px;
  }
  
  .section-header h5 {
    margin: 0;
    color: white;
    font-size: 16px;
    font-weight: 600;
  }
  
  .section-header.execution {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  
  .section-header.scheduled {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  }
  
  .section-header.assignment {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  }
  
  .section-header.excel {
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  }
  
  .info-card {
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
  }
  
  .excel-card {
    background-color: #f0fff4;
    border: 2px solid #38ef7d;
  }
  
  .row {
    margin-bottom: 15px;
  }
  
  label {
    font-weight: 600;
    color: #666;
    display: block;
    margin-bottom: 3px;
    font-size: 12px;
    text-transform: uppercase;
  }
  
  p {
    margin: 0;
    padding: 5px 0;
    color: #333;
    font-size: 14px;
  }
  
  .amount-value {
    font-size: 18px;
    font-weight: 700;
    color: #2196F3;
  }
  
  .amount-retention {
    font-size: 16px;
    font-weight: 700;
    color: #F44336;
  }
  
  .amount-net {
    font-size: 18px;
    font-weight: 700;
    color: #4CAF50;
  }
  
  .amount-total {
    font-size: 16px;
    font-weight: 700;
    color: #FF9800;
  }
  
  .excel-amount {
    font-size: 14px;
    font-weight: 700;
    color: #11998e;
  }
  
  .excel-amount-final {
    font-size: 18px;
    font-weight: 700;
    color: #38ef7d;
  }
  
  .observaciones-box {
    background-color: #fff;
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 4px;
    white-space: pre-wrap;
    word-wrap: break-word;
    max-height: 100px;
    overflow-y: auto;
    font-size: 12px;
    margin: 5px 0 0 0;
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
  
  .label-default {
    background-color: #999;
    color: white;
  }
  
  hr {
    margin: 25px 0;
    border-top: 2px solid #eee;
  }
  
  .alert {
    padding: 15px;
    border-radius: 4px;
    margin: 10px 0 0 0;
  }
  
  .alert-danger {
    background-color: #ffebee;
    border: 1px solid #F44336;
    color: #c62828;
  }
  
  .summary-box {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
    border-radius: 8px;
    margin-top: 20px;
    color: white;
  }
  
  .summary-box h6 {
    margin: 0 0 15px 0;
    font-size: 16px;
    font-weight: 600;
  }
  
  .summary-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .summary-label {
    font-size: 11px;
    text-transform: uppercase;
    opacity: 0.9;
    margin-bottom: 5px;
  }
  
  .summary-value {
    font-size: 20px;
    font-weight: 700;
  }
  
  .summary-value.negative {
    color: #ffcdd2;
  }
  
  .summary-value.success {
    color: #c8e6c9;
  }

  .section-header.schedule {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.current-payment {
  background-color: #e3f2fd !important;
  font-weight: 600;
}

.current-payment td {
  border-left: 3px solid #2196F3 !important;
}

.table-sm {
  font-size: 13px;
}

.table-sm th {
  background-color: #f5f5f5;
  font-weight: 600;
  padding: 8px;
}

.table-sm td {
  padding: 8px;
}

.help-block {
  color: #999;
  font-size: 12px;
  margin-bottom: 10px;
}

.monto-original {
  color: #999;
  text-decoration: line-through;
  font-size: 14px;
}

.monto-cambiado {
  color: #2196F3;
  font-size: 16px;
  font-weight: 700;
}

.alert-info {
  background-color: #e3f2fd;
  border: 1px solid #2196F3;
  color: #1976d2;
}

.alert-info .observaciones-box {
  background-color: white;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 4px;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 150px;
  overflow-y: auto;
  font-size: 12px;
  margin: 0;
  color: #333;
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
    max-height: 90vh;
    display: flex;
    flex-direction: column;
  }
  
  .centered-dialog .el-dialog__body {
    flex: 1;
    overflow-y: auto;
  }
  </style>