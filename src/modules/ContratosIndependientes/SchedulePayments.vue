<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Pagos Programados</h4>
            <p class="card-category">Consulta y gestión de pagos programados</p>
          </div>

          <div class="card-content">
            <!-- FILTERS -->
            <div class="row">
              <div class="col-md-3">
                <label>Sede <span style="color: red;">*</span></label>
                <el-select v-model="filters.branchId" placeholder="Seleccione sede" class="select-default" filterable
                  @change="onBranchChange">
                  <el-option v-for="sede in sedes" :key="sede.Id" :label="sede.Name" :value="sede.Id">
                  </el-option>
                </el-select>
              </div>

              <div class="col-md-2">
                <label>Período <span style="color: red;">*</span></label>
                <el-select v-model="filters.periodoId" placeholder="Seleccione período" class="select-default"
                  filterable @change="onPeriodoChange">
                  <el-option v-for="periodo in periodos" :key="periodo.Value" :label="periodo.Name"
                    :value="periodo.Value">
                  </el-option>
                </el-select>
              </div>

              <div class="col-md-2">
                <label>Mes <span style="color: red;">*</span></label>
                <el-select v-model="filters.mes" placeholder="Seleccione mes" class="select-default"
                  @change="onMonthChange">
                  <el-option v-for="month in meses" :key="month.value" :label="month.label" :value="month.value">
                  </el-option>
                </el-select>
              </div>

              <div class="col-md-2">
                <label>Año <span style="color: red;">*</span></label>
                <el-select v-model="filters.anio" placeholder="Seleccione año" class="select-default"
                  @change="onYearChange">
                  <el-option v-for="year in anios" :key="year" :label="year" :value="year">
                  </el-option>
                </el-select>
              </div>

              <div class="col-md-3" style="display: flex; align-items: flex-end;">
                <button type="button" class="btn btn-info btn-fill" :disabled="!canSearch" @click="buscarPagos">
                  <i class="fa fa-search"></i> Buscar
                </button>
                <button type="button" class="btn btn-default btn-fill" style="margin-left: 10px;"
                  @click="limpiarFiltros">
                  <i class="fa fa-eraser"></i> Limpiar
                </button>
              </div>
            </div>

            <!-- ACTION BUTTONS -->
            <div class="row" style="margin-top: 20px;" v-if="pagos.length > 0">
              <div class="col-md-6">
                <button type="button" class="btn btn-warning btn-fill" :disabled="selectedIds.length === 0 || loading"
                  @click.prevent="abrirModalEnvio">
                  <i class="fa fa-paper-plane"></i>
                  Enviar para Aprobación ({{ selectedIds.length }})
                </button>

              </div>
              <div class="col-md-6">
                <div class="pull-right">
                  <input type="search" class="form-control input-sm" placeholder="Buscar por CI, nombre, contrato..."
                    v-model="searchQuery" style="width: 300px;">
                </div>
              </div>
            </div>

            <!-- SUMMARY -->
            <div class="row" style="margin-top: 20px;" v-if="pagos.length > 0">
              <div class="col-md-12">
                <div class="alert alert-info">
                  <strong>Total de pagos:</strong> {{ filteredPagos.length }} |
                  <strong>Monto total:</strong> Bs. {{ totalMonto.toFixed(2) }} |
                  <strong>Listos para enviar:</strong> {{ pagosListosParaEnviar }} |
                  <strong>Ya enviados:</strong> {{ pagosEnviados }}
                </div>
              </div>
            </div>

            <!-- TABLE -->
            <div class="row" style="margin-top: 20px;">
              <div class="col-md-12">
                <el-table :data="paginatedData" v-loading="loading" border style="width: 100%"
                  :default-sort="{ prop: 'NumeroContrato', order: 'ascending' }">

                  <!-- Selection Checkbox -->
                  <el-table-column width="60" align="center" label="Sel." fixed="left">
                    <template slot="header">
                      <input type="checkbox" @change="toggleSelectAll" :checked="isAllSelected"
                        :disabled="!hayPagosSeleccionables" title="Seleccionar todos los listos para enviar">
                    </template>
                    <template slot-scope="scope">
                      <input type="checkbox" :value="scope.row.PagoId" v-model="selectedIds"
                        :disabled="!puedeSeleccionar(scope.row)" style="cursor: pointer;">
                    </template>
                  </el-table-column>

                  <!-- Status Indicator -->
                  <el-table-column label="Estado Envío" width="120" align="center" fixed="left">
                    <template slot-scope="scope">
                      <span v-if="scope.row.Estado === 'RECHAZADO'" class="label label-danger">
                        <i class="fa fa-times-circle"></i> Rechazado
                      </span>
                      <span v-else-if="scope.row.Estado === 'ENVIADO'" class="label label-info">
                        <i class="fa fa-paper-plane"></i> Enviado
                      </span>
                      <span v-else-if="scope.row.Estado === 'APROBADO'" class="label label-success">
                        <i class="fa fa-check"></i> Aprobado
                      </span>
                      <span v-else-if="scope.row.TipoDocente" class="label label-success">
                        <i class="fa fa-check-circle"></i> Listo
                      </span>
                      <span v-else class="label label-default">
                        <i class="fa fa-clock-o"></i> Pendiente
                      </span>
                    </template>
                  </el-table-column>

                  <el-table-column prop="NumeroContrato" label="N° Contrato" min-width="120" sortable>
                  </el-table-column>

                  <el-table-column prop="NombreCompleto" label="Docente" min-width="200">
                  </el-table-column>

                  <el-table-column prop="Sigla" label="Sigla" min-width="80">
                  </el-table-column>

                  <el-table-column prop="Paralelo" label="Paralelo" min-width="70">
                  </el-table-column>

                  <!-- Tipo Docente (Inline Editable) -->
                  <el-table-column label="Tipo Docente" min-width="220">
                    <template slot-scope="scope">
                      <el-select v-model="scope.row.TipoDocente" @change="updateTipoDocente(scope.row)"
                        :disabled="scope.row.Estado === 'ENVIADO' || scope.row.Estado === 'APROBADO'" size="small"
                        placeholder="Seleccione tipo" style="width: 100%;">
                        <el-option label="Con Factura (0%)" value="INDEPENDIENTE_CON_FACTURA">
                        </el-option>
                        <el-option label="Sin Factura (16%)" value="INDEPENDIENTE_SIN_FACTURA">
                        </el-option>
                        <el-option label="Extranjero (12.5%)" value="EXTRANJERO">
                        </el-option>
                      </el-select>
                    </template>
                  </el-table-column>

                  <el-table-column prop="CodUnidadOrganizacional" label="Cod U.O." min-width="80" align="center">
                  </el-table-column>

                  <el-table-column prop="UnidadOrganizacional" label="Unidad Organizacional" min-width="180">
                  </el-table-column>

                  <el-table-column prop="Monto" label="Monto" min-width="100" align="right">
                    <template slot-scope="scope">
                      Bs. {{ scope.row.Monto.toFixed(2) }}
                    </template>
                  </el-table-column>

                  <el-table-column prop="Porcentaje" label="%" min-width="80" align="right">
                    <template slot-scope="scope">
                      {{ scope.row.Porcentaje.toFixed(2) }}%
                    </template>
                  </el-table-column>

                  <el-table-column label="Excepción" min-width="80" align="center">
                    <template slot-scope="scope">
                      <span v-if="scope.row.EsExcepcion" class="label label-info">
                        <i class="fa fa-exclamation-circle"></i> Sí
                      </span>
                      <span v-else>-</span>
                    </template>
                  </el-table-column>

                  <!-- ACTION BUTTONS -->
                  <el-table-column label="Acciones" width="150" align="center" fixed="right">
                    <template slot-scope="scope">
                      <el-tooltip content="Ver detalle" placement="top">
                        <button class="btn btn-simple btn-xs btn-info" @click="verDetalle(scope.row.PagoId)">
                          <i class="fa fa-eye"></i>
                        </button>
                      </el-tooltip>

                      <el-tooltip content="Editar" placement="top">
                        <button class="btn btn-simple btn-xs btn-warning" @click="editarPago(scope.row.PagoId)"
                          :disabled="scope.row.Estado === 'ENVIADO' || scope.row.Estado === 'APROBADO'">
                          <i class="fa fa-edit"></i>
                        </button>
                      </el-tooltip>

                      <el-tooltip content="Eliminar" placement="top">
                        <button class="btn btn-simple btn-xs btn-danger" @click="eliminarPago(scope.row)"
                          :disabled="scope.row.Estado === 'ENVIADO' || scope.row.Estado === 'APROBADO'">
                          <i class="fa fa-trash"></i>
                        </button>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>

                <!-- PAGINATION -->
                <div class="row" style="margin-top: 15px;" v-if="filteredPagos.length > 0">
                  <div class="col-sm-6">
                    <p class="category">
                      Mostrando {{ fromRecord }} a {{ toRecord }} de {{ filteredPagos.length }} registros
                    </p>
                  </div>
                  <div class="col-sm-6">
                    <el-pagination @current-change="handlePageChange" @size-change="handleSizeChange"
                      :current-page="pagination.currentPage" :page-sizes="[10, 20, 50, 100]"
                      :page-size="pagination.perPage" :total="filteredPagos.length" layout="sizes, prev, pager, next"
                      class="pull-right">
                    </el-pagination>
                  </div>
                </div>
              </div>
            </div>

            <!-- DETAIL MODAL -->
            <detail-modal :show.sync="showDetailModal" :pago-id="selectedPagoId">
            </detail-modal>

            <!-- EDIT MODAL -->
            <edit-modal :show.sync="showEditModal" :pago-id="selectedPagoId" @payment-updated="onPaymentUpdated">
            </edit-modal>

            <!-- SEND CONFIRMATION MODAL -->
            <envio-modal :show.sync="showEnvioModal" :pagos-ids="selectedIds" @pagos-enviados="onPagosEnviados">
            </envio-modal>

            <!-- EMPTY STATE -->
            <div class="row" style="margin-top: 20px;" v-if="!loading && searched && pagos.length === 0">
              <div class="col-md-12 text-center">
                <i class="fa fa-inbox" style="font-size: 48px; color: #ccc;"></i>
                <p style="margin-top: 10px; color: #999;">
                  No se encontraron pagos programados con los filtros seleccionados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { Select, Option, Table, TableColumn, Pagination, Tooltip, MessageBox } from 'element-ui'
import DetailModal from './Components/DetailModal.vue'
import EditModal from './Components/EditModal.vue'
import EnvioModal from './Components/EnvioModal.vue'

export default {
  name: 'VerPagosProgramados',
  components: {
    'el-select': Select,
    'el-option': Option,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-pagination': Pagination,
    'el-tooltip': Tooltip,
    DetailModal,
    EditModal,
    EnvioModal
  },
  data () {
    return {
      loading: false,
      searched: false,
      searchQuery: '',
      
      sedes: [],
      periodos: [],
      
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
      
      anios: [],
      
      filters: {
        branchId: null,
        periodoId: null,
        mes: null,
        anio: null
      },
      
      pagos: [],
      selectedIds: [],
      
      pagination: {
        currentPage: 1,
        perPage: 20
      },

      // Modals
      showDetailModal: false,
      showEditModal: false,
      showEnvioModal: false,
      selectedPagoId: null
    }
  },
  
  computed: {
    canSearch () {
      return this.filters.branchId && 
             this.filters.periodoId && 
             this.filters.mes &&
             this.filters.anio
    },
    
    filteredPagos () {
      if (!this.searchQuery) {
        return this.pagos
      }
      
      const query = this.searchQuery.toLowerCase().trim()
      return this.pagos.filter(pago => {
        return (
          (pago.NumeroContrato && pago.NumeroContrato.toLowerCase().includes(query)) ||
          (pago.CiDocente && pago.CiDocente.toLowerCase().includes(query)) ||
          (pago.NombreCompleto && pago.NombreCompleto.toLowerCase().includes(query)) ||
          (pago.Sigla && pago.Sigla.toLowerCase().includes(query)) ||
          (pago.CodUnidadOrganizacional && pago.CodUnidadOrganizacional.toLowerCase().includes(query)) ||
          (pago.UnidadOrganizacional && pago.UnidadOrganizacional.toLowerCase().includes(query))
        )
      })
    },
    
    paginatedData () {
      const start = (this.pagination.currentPage - 1) * this.pagination.perPage
      const end = start + this.pagination.perPage
      return this.filteredPagos.slice(start, end)
    },
    
    fromRecord () {
      if (this.filteredPagos.length === 0) return 0
      return (this.pagination.currentPage - 1) * this.pagination.perPage + 1
    },
    
    toRecord () {
      const to = this.pagination.currentPage * this.pagination.perPage
      return Math.min(to, this.filteredPagos.length)
    },
    
    totalMonto () {
      return this.filteredPagos.reduce((sum, pago) => sum + (pago.Monto || 0), 0)
    },
    
    pagosListosParaEnviar () {
      return this.filteredPagos.filter(p => 
        p.TipoDocente && 
        p.Estado !== 'ENVIADO' && 
        p.Estado !== 'APROBADO'
      ).length
    },
    
    pagosEnviados () {
      return this.filteredPagos.filter(p => 
        p.Estado === 'ENVIADO' || 
        p.Estado === 'APROBADO'
      ).length
    },
    
    hayPagosSeleccionables () {
      return this.paginatedData.some(p => this.puedeSeleccionar(p))
    },
    
    isAllSelected () {
      const seleccionables = this.filteredPagos.filter(p => this.puedeSeleccionar(p))
      if (seleccionables.length === 0) return false
      return seleccionables.every(p => this.selectedIds.includes(p.PagoId))
    }
  },
  
  mounted () {
    this.loadSedes()
    this.loadPeriodos()
    this.loadAnios()
  },
  
  methods: {
    loadSedes () {
      axios.get('/branches', {
        headers: {
          token: localStorage.getItem('token')
        }
      })
        .then(response => {
          this.sedes = response.data || []
        })
        .catch(error => {
          console.error('Error cargando sedes:', error)
          this.$message.error('Error al cargar las sedes')
        })
    },
    
    loadPeriodos () {
      axios.get('/AsignacionesMasivas/Periodos', {
        headers: {
          token: localStorage.getItem('token')
        }
      })
        .then(response => {
          this.periodos = response.data || []
        })
        .catch(error => {
          console.error('Error cargando períodos:', error)
          this.$message.error('Error al cargar los períodos')
        })
    },
    
    loadAnios () {
      const currentYear = new Date().getFullYear()
      this.anios = [
        currentYear - 2,
        currentYear - 1,
        currentYear,
        currentYear + 1,
        currentYear + 2
      ]
      this.filters.anio = currentYear
    },
    
    onBranchChange () {
      this.pagos = []
      this.searched = false
      this.selectedIds = []
    },
    
    onPeriodoChange () {
      this.pagos = []
      this.searched = false
      this.selectedIds = []
    },
    
    onMonthChange () {
      this.pagos = []
      this.searched = false
      this.selectedIds = []
    },
    
    onYearChange () {
      this.pagos = []
      this.searched = false
      this.selectedIds = []
    },
    
    getNombreMes (mes) {
      const month = this.meses.find(m => m.value === mes)
      return month ? month.label : mes
    },
    
    buscarPagos () {
      if (!this.canSearch) {
        this.$message.warning('Debe seleccionar sede, período, mes y año')
        return
      }
      
      this.loading = true
      this.searched = true
      this.selectedIds = []
      
      axios.get('/ProgramacionPagos/GetPagosProgramados', {
        params: {
          branchId: this.filters.branchId,
          periodoId: this.filters.periodoId,
          mes: this.filters.mes,
          anio: this.filters.anio
        },
        headers: {
          token: localStorage.getItem('token')
        }
      })
      .then(response => {
  this.pagos = (response.data || []).map(pago => {
    // normalize (in case backend sends "" or "  ")
    const tipo = (pago.TipoDocente || '').trim()

    if (!tipo) {
      // Vue2-safe reactive set + mark as auto-defaulted (not persisted yet)
      this.$set(pago, 'TipoDocente', 'INDEPENDIENTE_SIN_FACTURA')
      this.$set(pago, '__tipoDocenteAuto', true)
    } else {
      this.$set(pago, 'TipoDocente', tipo)
      this.$set(pago, '__tipoDocenteAuto', false)
    }

    return pago
  })

  this.loading = false
  this.pagination.currentPage = 1

  if (this.pagos.length === 0) {
    this.$message.info('No se encontraron pagos para los filtros seleccionados')
  } else {
    this.$message.success(`Se encontraron ${this.pagos.length} pagos`)
  }
})

        .catch(error => {
          console.error('Error cargando pagos:', error)
          this.loading = false
          
          const errorMsg = error.response && error.response.data && error.response.data.Message
            ? error.response.data.Message
            : 'Error al cargar los pagos programados'
          
          this.$message.error(errorMsg)
        })
    },
    
    limpiarFiltros () {
      const currentYear = new Date().getFullYear()
      this.filters = {
        branchId: null,
        periodoId: null,
        mes: null,
        anio: currentYear
      }
      this.pagos = []
      this.searched = false
      this.searchQuery = ''
      this.selectedIds = []
      this.pagination.currentPage = 1
    },
    
    handlePageChange (page) {
      this.pagination.currentPage = page
    },
    
    handleSizeChange (size) {
      this.pagination.perPage = size
      this.pagination.currentPage = 1
    },
    
    puedeSeleccionar (pago) {
      return pago.TipoDocente && 
             pago.Estado !== 'ENVIADO' && 
             pago.Estado !== 'APROBADO'
    },
    
    toggleSelectAll () {
      const seleccionables = this.filteredPagos.filter(p => this.puedeSeleccionar(p))
      
      if (this.isAllSelected) {
        // Deselect all
        seleccionables.forEach(pago => {
          const index = this.selectedIds.indexOf(pago.PagoId)
          if (index > -1) {
            this.selectedIds.splice(index, 1)
          }
        })
      } else {
        // Select all across all pages
        seleccionables.forEach(pago => {
          if (!this.selectedIds.includes(pago.PagoId)) {
            this.selectedIds.push(pago.PagoId)
          }
        })
      }
    },
    
    updateTipoDocente (pago) {
      axios.post('/ProgramacionPagos/UpdateTipoDocente', {
        PagoId: pago.PagoId,
        TipoDocente: pago.TipoDocente
      }, {
        headers: {
          token: localStorage.getItem('token')
        }
      })
        .then(response => {
          this.$message.success('Tipo de docente actualizado')
          // Update local estado
          pago.Estado = response.data.Estado
        })
        .catch(error => {
          console.error('Error actualizando tipo docente:', error)
          
          const errorMsg = error.response && error.response.data && error.response.data.Message
            ? error.response.data.Message
            : 'Error al actualizar el tipo de docente'
          
          this.$message.error(errorMsg)
          // Reload to get correct state
          this.buscarPagos()
        })
    },
    
    async abrirModalEnvio () {
  // prevent double execution if user clicks fast
  if (this.loading) return

  // Ensure Vue has applied checkbox v-model updates before we read selectedIds
  await this.$nextTick()

  if (this.selectedIds.length === 0) {
    MessageBox.alert('Debe seleccionar al menos un pago', 'Atención', {
      type: 'warning',
      confirmButtonText: 'OK'
    })
    return
  }

  const pagosSeleccionados = this.pagos.filter(p => this.selectedIds.includes(p.PagoId))
  const pendientesDePersistir = pagosSeleccionados.filter(p =>
    p.__tipoDocenteAuto === true &&
    p.Estado !== 'ENVIADO' &&
    p.Estado !== 'APROBADO'
  )

  if (pendientesDePersistir.length > 0) {
    try {
      this.loading = true

      for (const pago of pendientesDePersistir) {
        const { data } = await axios.post('/ProgramacionPagos/UpdateTipoDocente', {
          PagoId: pago.PagoId,
          TipoDocente: pago.TipoDocente
        }, {
          headers: { token: localStorage.getItem('token') }
        })

        pago.Estado = data.Estado
        pago.__tipoDocenteAuto = false
      }
    } catch (error) {
      console.error('Error persistiendo TipoDocente por defecto:', error)

      const errorMsg = error.response && error.response.data && error.response.data.Message
        ? error.response.data.Message
        : 'Error al guardar Tipo Docente por defecto'

      MessageBox.alert(errorMsg, 'Error', {
        type: 'error',
        confirmButtonText: 'OK'
      })
      return
    } finally {
      this.loading = false
    }
  }

  // Force the modal open after DOM/reactivity settles
  this.$nextTick(() => {
    this.showEnvioModal = true
  })
},
    
    onPagosEnviados () {
      this.selectedIds = []
      this.buscarPagos()
    },

    verDetalle (pagoId) {
      this.selectedPagoId = pagoId
      this.showDetailModal = true
    },
    
    editarPago (pagoId) {
      this.selectedPagoId = pagoId
      this.showEditModal = true
    },
    
    eliminarPago (pago) {
      if (this.loading) return
      
      // Force close any open tooltips by blurring the button
      if (document.activeElement) {
        document.activeElement.blur()
      }
      
      // Small delay to let tooltip close before opening MessageBox
      setTimeout(() => {
        MessageBox.confirm(
          '¿Está seguro que desea eliminar este pago?\n\nDocente: ' + pago.NombreCompleto + '\nMonto: Bs. ' + pago.Monto.toFixed(2) + '\nMes: ' + this.getNombreMes(pago.MesPago) + ' ' + pago.AnioPago,
          'Confirmar eliminación',
          {
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            type: 'warning',
            center: true
          }
        ).then(() => {
          this.loading = true
          
          axios.post('/ProgramacionPagos/DeletePago', {
            PagoId: pago.PagoId
          }, {
            headers: {
              token: localStorage.getItem('token')
            }
          })
            .then(() => {
              this.pagos = this.pagos.filter(p => p.PagoId !== pago.PagoId)
              var idx = this.selectedIds.indexOf(pago.PagoId)
              if (idx > -1) {
                this.selectedIds.splice(idx, 1)
              }
              this.loading = false
              this.$message.success('Pago eliminado correctamente')
            })
            .catch(error => {
              console.error('Error eliminando pago:', error)
              this.loading = false
              
              var errorMsg = error.response && error.response.data && error.response.data.Message
                ? error.response.data.Message
                : 'Error al eliminar el pago'
              
              this.$message.error(errorMsg)
            })
        }).catch(() => {
          console.log('Eliminación cancelada')
        })
      }, 100)
    },
    
    confirmarEliminacion (pagoId) {
      axios.post('/ProgramacionPagos/DeletePago', {
        PagoId: pagoId
      }, {
        headers: {
          token: localStorage.getItem('token')
        }
      })
        .then(() => {
          this.$message.success('Pago eliminado correctamente')
          // Remove from local data immediately
          this.pagos = this.pagos.filter(p => p.PagoId !== pagoId)
          // Remove from selected if it was selected
          var idx = this.selectedIds.indexOf(pagoId)
          if (idx > -1) {
            this.selectedIds.splice(idx, 1)
          }
        })
        .catch(error => {
          console.error('Error eliminando pago:', error)
          
          const errorMsg = error.response && error.response.data && error.response.data.Message
            ? error.response.data.Message
            : 'Error al eliminar el pago'
          
          this.$message.error(errorMsg)
        })
    },
    
    onPaymentUpdated () {
      this.buscarPagos()
    }
  }
}
</script>

<style scoped>
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
</style>