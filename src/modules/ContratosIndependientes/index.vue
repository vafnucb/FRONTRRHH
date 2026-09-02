<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Gestión de Contratos</h4>
          </div>

          <div class="card-content">
            <!-- FILTERS -->
            <div class="row filter-section">
              <div class="col-md-3">
                <div class="form-group">
                  <label>Sede</label>
                  <el-select
                    v-model="filters.branchesId"
                    placeholder="Todas las sedes"
                    clearable
                    @change="loadContratos">
                    <el-option
                      v-for="branch in branches"
                      :key="branch.Id"
                      :value="branch.Id"
                      :label="branch.Name">
                    </el-option>
                  </el-select>
                </div>
              </div>

              <div class="col-md-3">
                <div class="form-group">
                  <label>Período</label>
                  <el-select
                    v-model="filters.periodoId"
                    placeholder="Todos los períodos"
                    clearable
                    @change="loadContratos">
                    <el-option
                      v-for="periodo in periodos"
                      :key="periodo.Value"
                      :value="periodo.Value"
                      :label="periodo.Name">
                    </el-option>
                  </el-select>
                </div>
              </div>


              <div class="col-md-3">
                <div class="form-group">
                  <label>Buscar</label>
                  <input
                    type="search"
                    class="form-control"
                    placeholder="N° Contrato, Sede, Docente..."
                    v-model="searchQuery"
                    @input="handleSearch">
                </div>
              </div>
            </div>

            <!-- STATS -->
            <div class="row stats-section" v-if="contratos.length > 0">
              <div class="col-md-2">
                <div class="stat-card">
                  <i class="fa fa-file-text"></i>
                  <div class="stat-value">{{ totalContratos }}</div>
                  <div class="stat-label">Contratos</div>
                </div>
              </div>
              <div class="col-md-2">
                <div class="stat-card">
                  <i class="fa fa-dollar"></i>
                  <div class="stat-value">Bs. {{ formatMoney(montoTotalGeneral) }}</div>
                  <div class="stat-label">Monto Total</div>
                </div>
              </div>
            </div>

            <!-- REPORT BUTTONS -->
            <div class="row" style="margin-bottom: 15px;" v-if="contratos.length > 0">
              <div class="col-md-12 text-right">
                <button class="btn btn-info btn-fill btn-sm" @click="downloadAllContractsReport" :disabled="loading">
                  <i class="fa fa-file-word-o"></i> Descargar Reporte General
                </button>
              </div>
            </div>

            <!-- TABLE -->
            <div class="table-wrapper">
              <el-table
              :data="contratos"
                v-loading="loading"
                border
                style="width: 100%">

                <el-table-column
                  prop="Id"
                  label="ID"
                  width="80"
                  align="center">
                </el-table-column>

                <el-table-column
                  prop="NumeroContrato"
                  label="N° Contrato"
                  min-width="90">
                </el-table-column>

                <el-table-column
                  prop="NombreDocente"
                  label="Docente"
                  min-width="100">
                </el-table-column>

                <el-table-column
                  label="Monto Total"
                  width="130"
                  align="right">
                  <template slot-scope="scope">
                    Bs. {{ formatMoney(scope.row.MontoTotal) }}
                  </template>
                </el-table-column>

                <el-table-column
                  prop="TotalAsignaciones"
                  label="Asignaciones"
                  width="120"
                  align="center">
                </el-table-column>

                <el-table-column
                  label="Fecha Creación"
                  width="150">
                  <template slot-scope="scope">
                    {{ formatDate(scope.row.CreatedAt) }}
                  </template>
                </el-table-column>

                <el-table-column
                  label="Detalles"
                  width="150"
                  align="center"
                  fixed="right">
                  <template slot-scope="scope">
                    <div class="action-buttons">
                      <button
                        class="btn btn-info btn-xs btn-simple"
                        @click="viewContrato(scope.row)"
                        title="Ver detalle">
                        <i class="fa fa-eye"></i>
                      </button>
                      <button
                        class="btn btn-primary btn-xs btn-simple"
                        @click="downloadContratoReport(scope.row)"
                        title="Descargar reporte Word">
                        <i class="fa fa-download"></i>
                      </button>
                      
                    </div>
                  </template>
                </el-table-column>
              </el-table>

              <!-- PAGINATION -->
              <div class="row" style="margin-top: 15px;">
                <div class="col-md-6">
                  <p class="text-muted">
                    Mostrando {{ contratos.length }} de {{ totalContratos }} contrato(s)
                  </p>
                </div>
                <div class="col-md-6 text-right">
                  <button
                    v-if="hasMore"
                    class="btn btn-default btn-sm"
                    @click="loadMore"
                    :disabled="loading">
                    <i class="fa fa-plus-circle"></i> Cargar más
                  </button>
                </div>
              </div>
            </div>

            <!-- EMPTY STATE -->
            <div v-if="!loading && contratos.length === 0" class="empty-state">
              <i class="fa fa-folder-open"></i>
              <p>No se encontraron contratos</p>
              <small>Intente cambiar los filtros de búsqueda</small>
            </div>

            <contrato-detail-modal
            :show.sync="showDetailModal"
            :contrato-id="selectedContratoId">
            </contrato-detail-modal>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { Message } from 'element-ui'
import ContratoDetailModal from './Components/ContratoDetailModal.vue'
import { generateSingleContractReport, generateAllContractsReport, downloadWordFile } from './utils/ContratosWordReport'

export default {
  name: 'Contratos',
  components: {
    ContratoDetailModal
  },
  data () {
    return {
      loading: false,
      contratos: [],
      branches: [],
      periodos: [],
      searchQuery: '',
      searchTimeout: null,
      currentPage: 1,
      pageSize: 20,
      totalContratos: 0,
      totalPages: 0,
      montoTotalGeneral: 0,
      showDetailModal: false,
      selectedContratoId: null,
      
      filters: {
        branchesId: null,
        periodoId: null
      }
    }
  },
  
  computed: {
    filteredContratos () {
      if (!this.searchQuery) {
        return this.contratos
      }
      
      const query = this.searchQuery.toUpperCase().trim()
      return this.contratos.filter(c => {
        return (
          (c.NumeroContrato && c.NumeroContrato.toUpperCase().includes(query)) ||
          (c.SedeNombre && c.SedeNombre.toUpperCase().includes(query)) ||
          (c.SedeAbr && c.SedeAbr.toUpperCase().includes(query)) ||
          (c.PeriodoId && c.PeriodoId.toUpperCase().includes(query)) ||
          (c.NombreDocente && c.NombreDocente.toUpperCase().includes(query))
        )
      })
    },
    
    hasMore () {
      return this.currentPage < this.totalPages
    }
  },
  
  methods: {
    loadContratos (resetPage = true) {
      if (resetPage) {
        this.currentPage = 1
        this.contratos = []
      }
      
      this.loading = true
      
      const params = {
      page: this.currentPage,
      pageSize: this.pageSize,
      search: this.searchQuery
          ? this.searchQuery.trim()
          : ''
      }
      
      if (this.filters.branchesId) {
        params.branchesId = this.filters.branchesId
      }
      
      if (this.filters.periodoId) {
        params.periodoId = this.filters.periodoId
      }
      
      axios.get('/AsigContratos/GetContratos', {
        params: params,
        headers: {
          token: localStorage.getItem('token')
        }
      })
        .then(response => {
          const data = response.data
          
          if (resetPage) {
            this.contratos = data.Items || []
          } else {
            // Append for "Load More"
            this.contratos = this.contratos.concat(data.Items || [])
          }
          
          this.totalContratos = data.Total || 0
          this.totalPages = data.TotalPages || 0
          this.currentPage = data.Page || 1
          
          // Calculate total amount
          this.montoTotalGeneral = Number(data.MontoTotalGeneral || 0)
          
          this.loading = false
        })
        .catch(error => {
    console.error('Error cargando contratos:', error)
    Message({
      message: 'No se pudieron cargar los contratos',
      type: 'error',
      duration: 3000
    })
    this.loading = false
  })
    },
    
    loadMore () {
      this.currentPage += 1
      this.loadContratos(false)
    },
    
    loadBranches () {
      axios.get('/branches/', {
        headers: {
          token: localStorage.getItem('token')
        }
      })
        .then(response => {
          this.branches = response.data || []
        })
        .catch(error => {
          console.error('Error cargando sedes:', error)
        })
    },
    
    loadPeriodos () {
      axios.get('/AsignacionesMasivas/Periodos/', {
        headers: {
          token: localStorage.getItem('token')
        }
      })
        .then(response => {
          this.periodos = response.data || []
        })
        .catch(error => {
          console.error('Error cargando períodos:', error)
        })
    },
    
    handleSearch () {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }

      this.searchTimeout = setTimeout(() => {
        this.loadContratos(true)
      }, 300)
    },
    
    calculateTotals () {
      this.montoTotalGeneral = this.contratos.reduce((sum, c) => {
        return sum + (c.MontoTotal || 0)
      }, 0)
    },
    
    viewContrato (contrato) {
  this.selectedContratoId = contrato.Id
  this.showDetailModal = true
},
downloadContratoReport (contrato) {
      // Fetch full details then generate report
      axios.get(`/AsigContratos/GetDetalle/${contrato.Id}`, {
        headers: { token: localStorage.getItem('token') }
      })
        .then(response => {
          const contratoData = response.data.Contrato
          const asignaciones = response.data.Asignaciones || []
          const html = generateSingleContractReport(contratoData, asignaciones)
          downloadWordFile(html, `Contrato_${contratoData.NumeroContrato || contrato.Id}.doc`)
        })
        .catch(error => {
          console.error('Error generando reporte:', error)
          Message({
            message: 'Error al generar el reporte del contrato',
            type: 'error',
            duration: 3000
          })
        })
    },

    downloadAllContractsReport () {
      const html = generateAllContractsReport(this.contratos, this.filters, this.branches, this.periodos)
      downloadWordFile(html, `Reporte_Contratos_${Date.now()}.doc`)
    },
    
    editContrato (contrato) {
      console.log('Edit contrato:', contrato)
      // TODO: Open edit modal
      this.$message.info(`Editar contrato ${contrato.NumeroContrato}`)
    },
    
    deleteContrato (contrato) {
      console.log('Delete contrato:', contrato)
      // TODO: Implement delete
      this.$message.warning(`Eliminar contrato ${contrato.NumeroContrato}`)
    },
    
    formatDate (dateStr) {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      const day = ('0' + date.getDate()).slice(-2)
      const month = ('0' + (date.getMonth() + 1)).slice(-2)
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    },
    
    formatMoney (amount) {
      if (!amount) return '0.00'
      return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    
  },
  
  created () {
    this.loadBranches()
    this.loadPeriodos()
    this.loadContratos()
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

.stat-card i {
  font-size: 32px;
  margin-bottom: 10px;
  opacity: 0.8;
}

.stat-value {
  font-size: 24px;
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

.action-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

.action-buttons .btn {
  padding: 4px 8px;
  font-size: 12px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-state i {
  font-size: 64px;
  margin-bottom: 20px;
  color: #ddd;
}

.empty-state p {
  font-size: 18px;
  margin-bottom: 5px;
}

.empty-state small {
  font-size: 14px;
}
</style>
  