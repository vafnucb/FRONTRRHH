<template>
  <div>
      <div class="row">
          <div class="col-md-12">
              <div class="card">
                  <div class="card-header">
                      <h4 class="card-title">Gestión de Pagos</h4>
                  </div>

                  <div class="card-content">
                      <!-- TABS -->
                      <el-tabs v-model="activeTab" type="border-card" @tab-click="handleTabClick">

                          <!-- TAB 1: PENDIENTES -->
                          <el-tab-pane label="Pendientes de Aprobación" name="pendientes">

                              <!-- FILTERS -->
                              <div class="row filter-section">
                                  <div class="col-md-3">
                                      <div class="form-group">
                                          <label>Sede</label>
                                          <el-select v-model="filters.branchesId" placeholder="Todas las sedes"
                                              clearable @change="loadPagos">
                                              <el-option v-for="branch in branches" :key="branch.Id"
                                                  :value="branch.Id" :label="branch.Name">
                                              </el-option>
                                          </el-select>
                                      </div>
                                  </div>

                                  <div class="col-md-3">
                                      <div class="form-group">
                                          <label>Período</label>
                                          <el-select v-model="filters.periodoId" placeholder="Todos los períodos"
                                              clearable @change="loadPagos">
                                              <el-option v-for="periodo in periodos" :key="periodo.Value"
                                                  :value="periodo.Value" :label="periodo.Name">
                                              </el-option>
                                          </el-select>
                                      </div>
                                  </div>

                                  <div class="col-md-2">
                                      <div class="form-group">
                                          <label>Mes</label>
                                          <el-select v-model="filters.mes" placeholder="Todos" clearable
                                              @change="loadPagos">
                                              <el-option v-for="m in meses" :key="m.value" :value="m.value"
                                                  :label="m.label">
                                              </el-option>
                                          </el-select>
                                      </div>
                                  </div>

                                  <div class="col-md-2">
                                      <div class="form-group">
                                          <label>Año</label>
                                          <el-select v-model="filters.anio" placeholder="Todos" clearable
                                              @change="loadPagos">
                                              <el-option v-for="y in anios" :key="y" :value="y" :label="y">
                                              </el-option>
                                          </el-select>
                                      </div>
                                  </div>

                                  <div class="col-md-2">
                                      <div class="form-group">
                                          <label>Tipo Docente</label>
                                          <el-select v-model="filters.tipoDocente" placeholder="Seleccione tipo"
                                              clearable @change="onTipoDocenteChange">
                                              <el-option value="INDEPENDIENTE_CON_FACTURA" label="Con Factura (0%)"></el-option>
                                              <el-option value="INDEPENDIENTE_SIN_FACTURA" label="Sin Factura (16%)"></el-option>
                                              <el-option value="EXTRANJERO" label="Extranjero (12.5%)"></el-option>
                                          </el-select>
                                      </div>
                                  </div>

                                  <div class="col-md-2">
                                      <div class="form-group">
                                          <label>Buscar</label>
                                          <input type="search" class="form-control" placeholder="CI, nombre..."
                                              v-model="searchQuery">
                                      </div>
                                  </div>
                              </div>

                              <!-- SUMMARY -->
                              <div class="row stats-section" v-if="pagos.length > 0">
                                  <div class="col-md-3">
                                      <div class="stat-card">
                                          <i class="fa fa-file-text"></i>
                                          <div class="stat-value">{{ pagos.length }}</div>
                                          <div class="stat-label">Pagos Pendientes</div>
                                      </div>
                                  </div>
                                  <div class="col-md-3">
                                      <div class="stat-card">
                                          <i class="fa fa-dollar"></i>
                                          <div class="stat-value">Bs. {{ formatMoney(totalMontoContrato) }}</div>
                                          <div class="stat-label">Monto Bruto Total</div>
                                      </div>
                                  </div>
                                  <div class="col-md-3">
                                      <div class="stat-card">
                                          <i class="fa fa-money"></i>
                                          <div class="stat-value">Bs. {{ formatMoney(totalRetencion) }}</div>
                                          <div class="stat-label">Total Retenciones</div>
                                      </div>
                                  </div>
                                  <div class="col-md-3">
                                      <div class="stat-card success">
                                          <i class="fa fa-check-circle"></i>
                                          <div class="stat-value">Bs. {{ formatMoney(totalMontoReal) }}</div>
                                          <div class="stat-label">Monto Líquido</div>
                                      </div>
                                  </div>
                              </div>
                              <!-- TIPO DOCENTE FILTER -->
                              <div class="tipo-docente-filter">
                                  <div class="row">
                                      <div class="col-md-4">
                                          <div class="form-group" style="margin-bottom: 0;">
                                              <label style="color: white; font-weight: 600;">
                                                  <i class="fa fa-filter"></i> Tipo Docente (requerido para aprobar)
                                              </label>
                                              <el-select v-model="filters.tipoDocente" placeholder="Seleccione tipo de docente"
                                                  clearable @change="onTipoDocenteChange" style="width: 100%;">
                                                  <el-option value="INDEPENDIENTE_CON_FACTURA" label="Con Factura (0%)"></el-option>
                                                  <el-option value="INDEPENDIENTE_SIN_FACTURA" label="Sin Factura (16%)"></el-option>
                                                  <el-option value="EXTRANJERO" label="Extranjero (12.5%)"></el-option>
                                              </el-select>
                                          </div>
                                      </div>
                                      <div class="col-md-8" style="display: flex; align-items: flex-end;">
                                          <span v-if="!filters.tipoDocente" class="tipo-docente-hint">
                                              <i class="fa fa-info-circle"></i>
                                              Seleccione un tipo de docente para habilitar la aprobación de pagos
                                          </span>
                                          <span v-else class="tipo-docente-active">
                                              <i class="fa fa-check-circle"></i>
                                              Mostrando pagos: <strong>{{ formatTipoDocente(filters.tipoDocente) }}</strong>
                                              — {{ filteredPagos.length }} pago(s)
                                          </span>
                                      </div>
                                  </div>
                              </div>

                              <!-- TABLE -->
                              <div class="table-wrapper">
                                <el-table ref="pendientesTable" :data="filteredPagos" v-loading="loading" border style="width: 100%"
                                      @selection-change="handleSelectionChange">

                                      <el-table-column v-if="filters.tipoDocente" type="selection" width="55" align="center">
                                      </el-table-column>

                                      <el-table-column prop="NumeroContrato" label="N° Contrato" width="120">
                                      </el-table-column>

                                      <el-table-column prop="NombreCompleto" label="Docente" min-width="180">
                                      </el-table-column>

                                      <el-table-column prop="CiDocente" label="CI" width="100">
                                      </el-table-column>

                                      <el-table-column prop="Sigla" label="Sigla" width="90">
                                      </el-table-column>

                                      <el-table-column prop="Paralelo" label="Paralelo" width="80" align="center">
                                      </el-table-column>

                                      <el-table-column label="Tipo Docente" width="150">
                                          <template slot-scope="scope">
                                              <span :class="getTipoDocenteBadge(scope.row.TipoDocente)">
                                                  {{ formatTipoDocente(scope.row.TipoDocente) }}
                                              </span>
                                          </template>
                                      </el-table-column>

                                      <el-table-column label="Monto Bruto" width="120" align="right">
                                          <template slot-scope="scope">
                                              Bs. {{ formatMoney(scope.row.MontoContrato) }}
                                          </template>
                                      </el-table-column>

                                      <el-table-column label="Retención" width="110" align="right">
                                          <template slot-scope="scope">
                                              Bs. {{ formatMoney(scope.row.MontoRetencion) }}
                                          </template>
                                      </el-table-column>

                                      <el-table-column label="Monto Líquido" width="130" align="right">
                                          <template slot-scope="scope">
                                              <strong style="color: #4CAF50;">
                                                  Bs. {{ formatMoney(scope.row.MontoReal) }}
                                              </strong>
                                          </template>
                                      </el-table-column>

                                      <el-table-column label="Fecha Envío" width="150">
                                          <template slot-scope="scope">
                                              {{ formatDate(scope.row.FechaEnvio) }}
                                          </template>
                                      </el-table-column>
                                      <el-table-column label="Acciones" width="120" align="center" fixed="right">
                                          <template slot-scope="scope">
                                              <div class="action-buttons">
                                                  <button class="btn btn-info btn-xs btn-simple"
                                                      @click="viewDetalle(scope.row)" title="Ver detalle">
                                                      <i class="fa fa-eye"></i>
                                                  </button>
                                                  <button class="btn btn-danger btn-xs btn-simple"
                                                      @click="rechazarPago(scope.row)" title="Rechazar pago">
                                                      <i class="fa fa-times"></i>
                                                  </button>
                                              </div>
                                          </template>
                                      </el-table-column>
                                  </el-table>

                                  <!-- ACTIONS -->
                                  <div class="row" style="margin-top: 20px;" v-if="selectedPagos.length > 0">
                                      <div class="col-md-12 text-center">
                                          <button class="btn btn-success btn-fill btn-lg"
                                              @click="aprobarSeleccionados">
                                              <i class="fa fa-check"></i>
                                              Aprobar Seleccionados ({{ selectedPagos.length }})
                                          </button>
                                      </div>
                                  </div>
                              </div>

                              <!-- EMPTY STATE -->
                              <div v-if="!loading && pagos.length === 0" class="empty-state">
                                  <i class="fa fa-check-circle"></i>
                                  <p>No hay pagos pendientes de aprobación</p>
                                  <small>Todos los pagos han sido procesados</small>
                              </div>
                          </el-tab-pane>

                          <!-- TAB 2: HISTÓRICO -->
                          <el-tab-pane label="Histórico de Aprobados" name="historico">

                              <!-- FILTERS HISTORICO -->
                              <div class="row filter-section">
                                  <div class="col-md-2">
                                      <div class="form-group">
                                          <label>Sede</label>
                                          <el-select v-model="filtersHistorico.branchesId" placeholder="Todas"
                                              clearable @change="loadHistorico">
                                              <el-option v-for="branch in branches" :key="branch.Id"
                                                  :value="branch.Id" :label="branch.Name">
                                              </el-option>
                                          </el-select>
                                      </div>
                                  </div>

                                  <div class="col-md-2">
                                      <div class="form-group">
                                          <label>Período</label>
                                          <el-select v-model="filtersHistorico.periodoId" placeholder="Todos"
                                              clearable @change="loadHistorico">
                                              <el-option v-for="periodo in periodos" :key="periodo.Value"
                                                  :value="periodo.Value" :label="periodo.Name">
                                              </el-option>
                                          </el-select>
                                      </div>
                                  </div>

                                  <div class="col-md-2">
                                      <div class="form-group">
                                          <label>Mes</label>
                                          <el-select v-model="filtersHistorico.mes" placeholder="Todos" clearable
                                              @change="loadHistorico">
                                              <el-option v-for="m in meses" :key="m.value" :value="m.value"
                                                  :label="m.label">
                                              </el-option>
                                          </el-select>
                                      </div>
                                  </div>

                                  <div class="col-md-2">
                                      <div class="form-group">
                                          <label>Año</label>
                                          <el-select v-model="filtersHistorico.anio" placeholder="Todos" clearable
                                              @change="loadHistorico">
                                              <el-option v-for="y in anios" :key="y" :value="y" :label="y">
                                              </el-option>
                                          </el-select>
                                      </div>
                                  </div>

                                  <div class="col-md-2">
                                      <div class="form-group">
                                          <label>Fecha Desde</label>
                                          <input type="date" class="form-control"
                                              v-model="filtersHistorico.fechaDesde" @change="loadHistorico">
                                      </div>
                                  </div>

                                  <div class="col-md-2">
                                      <div class="form-group">
                                          <label>Fecha Hasta</label>
                                          <input type="date" class="form-control"
                                              v-model="filtersHistorico.fechaHasta" @change="loadHistorico">
                                      </div>
                                  </div>
                              </div>

                              <!-- TABLE HISTORICO -->
                              <div class="table-wrapper">
                                  <el-table :data="pagosHistorico" v-loading="loadingHistorico" border
                                      style="width: 100%">

                                      <el-table-column prop="NumeroContrato" label="N° Contrato" width="120">
                                      </el-table-column>

                                      <el-table-column prop="NombreCompleto" label="Docente" min-width="180">
                                      </el-table-column>

                                      <el-table-column prop="CiDocente" label="CI" width="100">
                                      </el-table-column>

                                      <el-table-column label="Mes/Año" width="120">
                                          <template slot-scope="scope">
                                              {{ getMonthName(scope.row.MesPago) }} {{ scope.row.AnioPago }}
                                          </template>
                                      </el-table-column>

                                      <el-table-column label="Tipo Docente" width="150">
                                          <template slot-scope="scope">
                                              <span :class="getTipoDocenteBadge(scope.row.TipoDocente)">
                                                  {{ formatTipoDocente(scope.row.TipoDocente) }}
                                              </span>
                                          </template>
                                      </el-table-column>

                                      <el-table-column label="Monto Bruto" width="120" align="right">
                                          <template slot-scope="scope">
                                              Bs. {{ formatMoney(scope.row.MontoContrato) }}
                                          </template>
                                      </el-table-column>

                                      <el-table-column label="Monto Líquido" width="130" align="right">
                                          <template slot-scope="scope">
                                              <strong style="color: #4CAF50;">
                                                  Bs. {{ formatMoney(scope.row.MontoReal) }}
                                              </strong>
                                          </template>
                                      </el-table-column>

                                      <el-table-column label="Fecha Aprobación" width="160">
                                          <template slot-scope="scope">
                                              {{ formatDate(scope.row.FechaAprobacion) }}
                                          </template>
                                      </el-table-column>

                                      <el-table-column label="Acciones" width="120" align="center" fixed="right">
                                          <template slot-scope="scope">
                                              <div class="action-buttons">
                                                  <button class="btn btn-info btn-xs btn-simple"
                                                      @click="viewDetalle(scope.row)" title="Ver detalle">
                                                      <i class="fa fa-eye"></i>
                                                  </button>

                                              </div>
                                          </template>
                                      </el-table-column>
                                  </el-table>

                                  <!-- PAGINATION HISTORICO -->
                                  <div class="row" style="margin-top: 15px;" v-if="totalHistorico > 0">
                                      <div class="col-md-6">
                                          <p class="text-muted">
                                              Mostrando {{ pagosHistorico.length }} de {{ totalHistorico }} pago(s)
                                              aprobado(s)
                                          </p>
                                      </div>
                                      <div class="col-md-6">
                                          <el-pagination @current-change="handleHistoricoPageChange"
                                              :current-page="paginationHistorico.currentPage"
                                              :page-size="paginationHistorico.pageSize" :total="totalHistorico"
                                              layout="prev, pager, next" class="pull-right">
                                          </el-pagination>
                                      </div>
                                  </div>
                              </div>

                              <!-- EMPTY STATE HISTORICO -->
                              <div v-if="!loadingHistorico && pagosHistorico.length === 0" class="empty-state">
                                  <i class="fa fa-history"></i>
                                  <p>No hay pagos aprobados</p>
                                  <small>Los pagos aprobados aparecerán aquí</small>
                              </div>
                          </el-tab-pane>

                      </el-tabs>
                  </div>
              </div>
          </div>
      </div>

      <!-- DETAIL MODAL -->
      <detalle-ejecucion-modal :show.sync="showDetailModal" :pago-id="selectedPagoId"
          :show-excel-values="showExcelValues">
      </detalle-ejecucion-modal>
  </div>
</template>

<script>
import axios from 'axios'
import { Message, MessageBox, Tabs, TabPane, Pagination } from 'element-ui'
import DetalleEjecucionModal from './Components/EjecucionDetailModal.vue'

export default {
name: 'AprobacionPagos',
components: {
  DetalleEjecucionModal,
  'el-tabs': Tabs,
  'el-tab-pane': TabPane,
  'el-pagination': Pagination
},
data () {
  const currentYear = new Date().getFullYear()
  return {
    activeTab: 'pendientes',
    
    // PENDIENTES
    loading: false,
    pagos: [],
    selectedPagos: [],
    branches: [],
    periodos: [],
    searchQuery: '',
    showDetailModal: false,
    selectedPagoId: null,
    showExcelValues: false,
    
    filters: {
      branchesId: null,
      periodoId: null,
      mes: null,
      anio: null,
      tipoDocente: null
    },
    
    // HISTORICO
    loadingHistorico: false,
    pagosHistorico: [],
    totalHistorico: 0,
    
    filtersHistorico: {
      branchesId: null,
      periodoId: null,
      mes: null,
      anio: null,
      fechaDesde: null,
      fechaHasta: null
    },
    
    paginationHistorico: {
      currentPage: 1,
      pageSize: 50
    },
    
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
      currentYear + 1
    ]
  }
},

computed: {
  filteredPagos () {
    let result = this.pagos

    if (this.filters.tipoDocente) {
      result = result.filter(p => p.TipoDocente === this.filters.tipoDocente)
    }

    if (this.searchQuery) {
      const query = this.searchQuery.toUpperCase().trim()
      result = result.filter(p => {
        return (
          (p.CiDocente && p.CiDocente.toUpperCase().includes(query)) ||
          (p.NombreCompleto && p.NombreCompleto.toUpperCase().includes(query)) ||
          (p.NumeroContrato && p.NumeroContrato.toUpperCase().includes(query)) ||
          (p.Sigla && p.Sigla.toUpperCase().includes(query))
        )
      })
    }

    return result
  },
  
  totalMontoContrato () {
    return this.pagos.reduce((sum, p) => sum + (p.MontoContrato || 0), 0)
  },
  
  totalRetencion () {
    return this.pagos.reduce((sum, p) => sum + (p.MontoRetencion || 0), 0)
  },
  
  totalMontoReal () {
    return this.pagos.reduce((sum, p) => sum + (p.MontoReal || 0), 0)
  }
},

methods: {
  handleTabClick (tab) {
    if (tab.name === 'historico' && this.pagosHistorico.length === 0) {
      this.loadHistorico()
    }
  },
  
  // PENDIENTES METHODS
  loadPagos () {
    this.loading = true
    
    const params = {}
    
    if (this.filters.branchesId) params.branchesId = this.filters.branchesId
    if (this.filters.periodoId) params.periodoId = this.filters.periodoId
    if (this.filters.mes) params.mes = this.filters.mes
    if (this.filters.anio) params.anio = this.filters.anio
    
    axios.get('/EjecucionPagos/GetPagosPendientes', {
      params: params,
      headers: {
        token: localStorage.getItem('token')
      }
    })
      .then(response => {
        this.pagos = response.data || []
        this.loading = false
      })
      .catch(error => {
        console.error('Error cargando pagos:', error)
        Message({
          message: 'No se pudieron cargar los pagos',
          type: 'error',
          duration: 3000
        })
        this.loading = false
      })
  },
  
  loadBranches () {
    axios.get('/branches/', {
      headers: { token: localStorage.getItem('token') }
    })
      .then(response => {
        this.branches = response.data || []
      })
  },
  
  loadPeriodos () {
    axios.get('/AsignacionesMasivas/Periodos/', {
      headers: { token: localStorage.getItem('token') }
    })
      .then(response => {
        this.periodos = response.data || []
      })
  },
  
  handleSelectionChange (selection) {
    this.selectedPagos = selection
  },

  onTipoDocenteChange () {
    this.selectedPagos = []
    if (this.$refs.pendientesTable) {
      this.$refs.pendientesTable.clearSelection()
    }
  },
  
  aprobarSeleccionados () {
    if (this.selectedPagos.length === 0) {
      Message({
        message: 'Debe seleccionar al menos un pago',
        type: 'warning',
        duration: 3000
      })
      return
    }
    
    const totalLiquido = this.selectedPagos.reduce((sum, p) => sum + p.MontoReal, 0)
    
    MessageBox.confirm(
      `¿Está seguro de aprobar ${this.selectedPagos.length} pago(s)?\n\n` +
      `Monto líquido total: Bs. ${this.formatMoney(totalLiquido)}\n\n` +
      `Se generará un archivo Excel con los pagos aprobados.`,
      'Confirmar Aprobación',
      {
        confirmButtonText: 'Sí, aprobar',
        cancelButtonText: 'Cancelar',
        type: 'warning',
        center: true
      }
    ).then(() => {
      this.ejecutarAprobacion()
    }).catch(() => {
      console.log('Aprobación cancelada')
    })
  },
  
  ejecutarAprobacion () {
    this.loading = true
    
    const pagosIds = this.selectedPagos.map(p => p.PagoEjecutadoId).filter(id => id != null)

    if (pagosIds.length === 0) {
      Message({
        message: 'No se pudieron obtener los IDs de los pagos seleccionados',
        type: 'error',
        duration: 3000
      })
      this.loading = false
      return
    }
    
    axios.post('/EjecucionPagos/AprobarPagosLote', {
      PagosIds: pagosIds
    }, {
      headers: {
        token: localStorage.getItem('token')
      },
      responseType: 'blob'
    })
      .then(response => {
        // Download Excel file
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `Pagos_Aprobados_${Date.now()}.xlsx`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        
        Message({
          message: `${this.selectedPagos.length} pago(s) aprobado(s) correctamente`,
          type: 'success',
          duration: 3000
        })
        
        this.loading = false
        this.loadPagos()
      })
      .catch(error => {
        console.error('Error aprobando pagos:', error)
        this.loading = false
        
        // If error response is a Blob, we need to read it
        if (error.response && error.response.data instanceof Blob) {
          const reader = new FileReader()
          reader.onload = () => {
            try {
              const errorData = JSON.parse(reader.result)
              console.log('Parsed error data:', errorData)
              
              const errorMsg = errorData.Message || 'Error al aprobar los pagos'
              Message({
                message: errorMsg,
                type: 'error',
                duration: 5000
              })
            } catch (e) {
              console.error('Could not parse error blob:', e)
              Message({
                message: 'Error al aprobar los pagos',
                type: 'error',
                duration: 3000
              })
            }
          }
          reader.readAsText(error.response.data)
        } else {
          const errorMsg = error.response && error.response.data && error.response.data.Message 
            ? error.response.data.Message 
            : 'Error al aprobar los pagos'
          
          Message({
            message: errorMsg,
            type: 'error',
            duration: 5000
          })
        }
      })
  },
  
  viewDetalle (pago) {
    this.selectedPagoId = pago.PagoEjecutadoId
    this.showExcelValues = false
    this.showDetailModal = true
  },
  rechazarPago (pago) {
MessageBox.prompt(
  `¿Por qué desea rechazar este pago?\n\nDocente: ${pago.NombreCompleto}\nMonto: Bs. ${this.formatMoney(pago.MontoReal)}`,
  'Rechazar Pago',
  {
    confirmButtonText: 'Rechazar',
    cancelButtonText: 'Cancelar',
    inputPlaceholder: 'Ingrese el motivo del rechazo',
    inputType: 'textarea',
    inputPattern: /.+/,
    inputErrorMessage: 'Debe ingresar un motivo',
    inputValidator: (value) => {
      if (!value || value.trim() === '') {
        return 'El motivo del rechazo es obligatorio'
      }
      return true
    }
  }
).then(({ value }) => {
  this.ejecutarRechazo(pago.PagoEjecutadoId, value)
}).catch(() => {
  console.log('Rechazo cancelado')
})
},

ejecutarRechazo (pagoEjecutadoId, motivo) {
this.loading = true

axios.post('/EjecucionPagos/RechazarPago', {
  PagoEjecutadoId: pagoEjecutadoId,
  MotivoRechazo: motivo.trim()
}, {
  headers: {
    token: localStorage.getItem('token')
  }
})
  .then(response => {
    Message({
      message: 'Pago rechazado correctamente',
      type: 'success',
      duration: 3000
    })
    this.loading = false
    this.loadPagos()
  })
  .catch(error => {
    console.error('Error rechazando pago:', error)
    this.loading = false
    
    const errorMsg = error.response && error.response.data && error.response.data.Message 
      ? error.response.data.Message 
      : 'Error al rechazar el pago'
    
    Message({
      message: errorMsg,
      type: 'error',
      duration: 5000
    })
  })
},
  
  // HISTORICO METHODS
  loadHistorico () {
    this.loadingHistorico = true
    
    const params = {
      page: this.paginationHistorico.currentPage,
      pageSize: this.paginationHistorico.pageSize
    }
    
    if (this.filtersHistorico.branchesId) params.branchesId = this.filtersHistorico.branchesId
    if (this.filtersHistorico.periodoId) params.periodoId = this.filtersHistorico.periodoId
    if (this.filtersHistorico.mes) params.mes = this.filtersHistorico.mes
    if (this.filtersHistorico.anio) params.anio = this.filtersHistorico.anio
    if (this.filtersHistorico.fechaDesde) params.fechaDesde = this.filtersHistorico.fechaDesde
    if (this.filtersHistorico.fechaHasta) params.fechaHasta = this.filtersHistorico.fechaHasta
    
    axios.get('/EjecucionPagos/GetPagosAprobados', {
      params: params,
      headers: {
        token: localStorage.getItem('token')
      }
    })
      .then(response => {
        this.pagosHistorico = response.data.Items || []
        this.totalHistorico = response.data.Total || 0
        this.loadingHistorico = false
      })
      .catch(error => {
        console.error('Error cargando histórico:', error)
        Message({
          message: 'No se pudo cargar el histórico de pagos',
          type: 'error',
          duration: 3000
        })
        this.loadingHistorico = false
      })
  },
  
  handleHistoricoPageChange (page) {
    this.paginationHistorico.currentPage = page
    this.loadHistorico()
  },
  
  viewDetalleHistorico (pago) {
    this.selectedPagoId = pago.PagoEjecutadoId
    this.showExcelValues = true
    this.showDetailModal = true
  },
  
  // SHARED METHODS
  formatDate (dateStr) {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return date.toLocaleString('es-BO')
  },
  
  formatMoney (amount) {
    if (!amount) return '0.00'
    return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  },
  
  getMonthName (mes) {
    const month = this.meses.find(m => m.value === mes)
    return month ? month.label : mes
  },
  
  formatTipoDocente (tipo) {
    const tipos = {
      'INDEPENDIENTE_CON_FACTURA': 'Con Factura (0%)',
      'INDEPENDIENTE_SIN_FACTURA': 'Sin Factura (16%)',
      'EXTRANJERO': 'Extranjero (12.5%)'
    }
    return tipos[tipo] || tipo
  },
  
  getTipoDocenteBadge (tipo) {
    const badges = {
      'INDEPENDIENTE_CON_FACTURA': 'label label-success',
      'INDEPENDIENTE_SIN_FACTURA': 'label label-warning',
      'EXTRANJERO': 'label label-info'
    }
    return badges[tipo] || 'label label-default'
  }
},

created () {
  this.loadBranches()
  this.loadPeriodos()
  this.loadPagos()
}
}
</script>

<style scoped>
.filter-section {
margin-bottom: 20px;
padding-bottom: 20px;
border-bottom: 1px solid #eee;
}

.stats-section {
margin-bottom: 20px;
}

.stat-card {
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
padding: 20px;
border-radius: 8px;
text-align: center;
color: white;
}

.stat-card.success {
background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
}

.stat-card i {
font-size: 32px;
margin-bottom: 10px;
opacity: 0.8;
}

.stat-value {
font-size: 20px;
font-weight: bold;
margin: 10px 0 5px 0;
}

.stat-label {
font-size: 12px;
text-transform: uppercase;
opacity: 0.9;
}

.table-wrapper {
margin-top: 20px;
}

.empty-state {
text-align: center;
padding: 60px 20px;
color: #999;
}

.empty-state i {
font-size: 64px;
margin-bottom: 20px;
color: #4CAF50;
}

.empty-state p {
font-size: 18px;
margin-bottom: 5px;
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

.text-muted {
color: #999;
font-size: 13px;
}

.pull-right {
float: right;
}
.action-buttons {
display: flex;
justify-content: center;
align-items: center;
gap: 5px;
}

.action-buttons .btn {
padding: 4px 8px;
font-size: 12px;
margin: 0;
}

.btn-simple {
background: transparent;
border: none;
}

.btn-simple:hover {
background: rgba(0, 0, 0, 0.1);
}
.tipo-docente-filter {
background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
padding: 15px 20px;
border-radius: 8px;
margin-bottom: 20px;
}

.tipo-docente-hint {
color: rgba(255, 255, 255, 0.7);
font-size: 13px;
padding-bottom: 8px;
}

.tipo-docente-hint i {
margin-right: 5px;
}

.tipo-docente-active {
color: #81C784;
font-size: 14px;
padding-bottom: 8px;
}

.tipo-docente-active i {
margin-right: 5px;
}
</style>