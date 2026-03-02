<template>
  <el-dialog title="Procesos de Asignaciones Masivas" :visible.sync="visible" width="80%" @close="handleClose">

    <div v-loading="loading">
      <!-- Search and filters -->
      <div class="row" style="margin-bottom: 15px;">
        <div class="col-md-6">
          <input type="search" class="form-control" placeholder="Buscar por sede, período o ID..."
            v-model="searchQuery">
        </div>
        <div class="col-md-6 text-right">
          <button class="btn btn-primary btn-sm" @click="loadProcesos(1)">
            <i class="fa fa-refresh"></i> Actualizar
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="row">
        <div class="col-md-10 col-md-offset-1">
          <el-table :data="filteredProcesos" border style="width: 100%" @row-click="handleRowClick"
            :row-class-name="getRowClassName">

            <el-table-column prop="Id" label="ID" width="80" align="center">
            </el-table-column>

            <el-table-column prop="SedeAbr" label="Sede" width="65">
            </el-table-column>

            <el-table-column prop="PeriodoId" label="Período" width="100">
            </el-table-column>

            <el-table-column label="Fecha Creación" width="160">
              <template slot-scope="scope">
                {{ formatDate(scope.row.CreatedAt) }}
              </template>
            </el-table-column>

            <el-table-column prop="TotalAsignaciones" label="Asignaciones" width="100" align="center">
            </el-table-column>

            <el-table-column prop="State" label="Estado" width="120" align="center">
              <template slot-scope="scope">
                <span :class="getStateBadgeClass(scope.row.State)">
                  {{ scope.row.State }}
                </span>
              </template>
            </el-table-column>

            <el-table-column label="Acción" width="180" align="center">
              <template slot-scope="scope">
                <button class="btn btn-info btn-xs btn-fill" @click.stop="loadProceso(scope.row)"
                  style="margin-right: 5px;">
                  <i class="fa fa-folder-open"></i> Abrir
                </button>

                <button class="btn btn-danger btn-xs btn-fill" @click.stop="deleteProceso(scope.row)"
                  :disabled="scope.row.State === 'FINALIZADO'"
                  :title="scope.row.State === 'FINALIZADO' ? 'No se puede eliminar un proceso finalizado' : 'Eliminar proceso'">
                  <i class="fa fa-trash"></i>
                </button>
              </template>
            </el-table-column>
          </el-table>

          <!-- Pagination Info and Load More -->
          <div class="row" style="margin-top: 15px;">
            <div class="col-md-6">
              <p class="text-muted">
                Mostrando {{ procesos.length }} de {{ totalProcesos }} proceso(s)
              </p>
            </div>
            <div class="col-md-6 text-right">
              <button v-if="hasMore" class="btn btn-default btn-sm" @click="loadMore" :disabled="loading">
                <i class="fa fa-plus-circle"></i> Cargar más
              </button>
            </div>
          </div>

          <!-- Empty state -->
          <div v-if="!loading && procesos.length === 0" class="text-center" style="padding: 40px;">
            <i class="fa fa-folder-open" style="font-size: 48px; color: #ccc;"></i>
            <p style="margin-top: 15px; color: #999;">
              No hay procesos de asignaciones registrados
            </p>
          </div>
        </div>
      </div>
    </div>

    <span slot="footer" class="dialog-footer">
      <button class="btn btn-default" @click="handleClose">Cerrar</button>
    </span>
  </el-dialog>
</template>

<script>
import axios from 'axios'
import { MessageBox } from 'element-ui'

export default {
  name: 'BatchListModal',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visible: false,
      loading: false,
      procesos: [],
      searchQuery: '',
      currentPage: 1,
      pageSize: 5,
      totalProcesos: 0,
      totalPages: 0
    }
  },
  computed: {
    filteredProcesos () {
      if (!this.searchQuery) {
        return this.procesos
      }
      
      const query = this.searchQuery.toUpperCase().trim()
      return this.procesos.filter(p => {
        return (
          String(p.Id).includes(query) ||
          (p.SedeAbr && p.SedeAbr.toUpperCase().includes(query)) ||
          (p.SedeNombre && p.SedeNombre.toUpperCase().includes(query)) ||
          (p.PeriodoId && p.PeriodoId.toUpperCase().includes(query))
        )
      })
    },
    
    hasMore () {
      return this.currentPage < this.totalPages
    }
  },
  watch: {
    show (val) {
      this.visible = val
      if (val) {
        // Reset and load first page
        this.procesos = []
        this.currentPage = 1
        this.loadProcesos(1)
      }
    }
  },
  methods: {
    loadProcesos (page) {
      this.loading = true
      this.currentPage = page
      
      axios.get('/AsignacionesMasivas/GetProcesos', {
        params: {
          page: page,
          pageSize: this.pageSize
        },
        headers: {
          token: localStorage.getItem('token')
        }
      })
        .then(response => {
          const data = response.data
          
          // Replace procesos (don't append for refresh)
          this.procesos = data.Items || []
          this.totalProcesos = data.Total || 0
          this.totalPages = data.TotalPages || 0
          
          this.loading = false
        })
        .catch(error => {
          console.error('Error cargando procesos:', error)
          this.$message.error('No se pudieron cargar los procesos')
          this.loading = false
        })
    },
    deleteProceso (proceso) {
    if (proceso.State === 'FINALIZADO') {
      this.$message.warning('No se puede eliminar un proceso finalizado')
      return
    }
    
    MessageBox.confirm(
      `¿Está seguro de eliminar el proceso #${proceso.Id}?\n\n` +
      `Sede: ${proceso.SedeNombre}\n` +
      `Período: ${proceso.PeriodoId}\n` +
      `Asignaciones: ${proceso.TotalAsignaciones}\n\n` +
      `Esta acción no se puede deshacer.`,
      'Confirmar eliminación',
      {
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        type: 'warning',
        center: true
      }
    ).then(() => {
      this.confirmarEliminacion(proceso.Id)
    }).catch(() => {
      console.log('Eliminación cancelada')
    })
  },
  
  confirmarEliminacion (procesoId) {
  this.loading = true
  
  axios.post('/AsignacionesMasivas/DeleteProceso', {
    ProcesoId: procesoId
  }, {
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .then(response => {
      // Reset state and reload FIRST
      this.procesos = []
      this.currentPage = 1
      this.searchQuery = ''
      
      this.$nextTick(() => {
        this.loadProcesos(1)
      })
      
      // Show success message using MessageBox.alert (or whatever works in your project)
      MessageBox.alert('Proceso eliminado correctamente', 'Éxito', {
        confirmButtonText: 'OK',
        type: 'success'
      })
    })
    .catch(error => {
      console.error('Error eliminando proceso:', error)
      this.loading = false
      
      const errorMsg = error.response && error.response.data && error.response.data.Message
        ? error.response.data.Message
        : 'Error al eliminar el proceso'
      
      MessageBox.alert(errorMsg, 'Error', {
        confirmButtonText: 'OK',
        type: 'error'
      })
    })
},
    
    loadMore () {
      if (!this.hasMore || this.loading) return
      
      const nextPage = this.currentPage + 1
      this.loading = true
      
      axios.get('/AsignacionesMasivas/GetProcesos', {
        params: {
          page: nextPage,
          pageSize: this.pageSize
        },
        headers: {
          token: localStorage.getItem('token')
        }
      })
        .then(response => {
          const data = response.data
          
          // Append new items to existing list
          this.procesos = this.procesos.concat(data.Items || [])
          this.currentPage = nextPage
          this.totalProcesos = data.Total || 0
          this.totalPages = data.TotalPages || 0
          
          this.loading = false
        })
        .catch(error => {
          console.error('Error cargando más procesos:', error)
          this.$message.error('No se pudieron cargar más procesos')
          this.loading = false
        })
    },
    
    handleRowClick (row) {
      this.loadProceso(row)
    },
    
    loadProceso (proceso) {
      this.$emit('load-proceso', proceso)
      this.handleClose()
    },
    
    handleClose () {
      this.visible = false
      this.$emit('update:show', false)
    },
    
    formatDate (dateStr) {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      const day = ('0' + date.getDate()).slice(-2)
      const month = ('0' + (date.getMonth() + 1)).slice(-2)
      const year = date.getFullYear()
      const hours = ('0' + date.getHours()).slice(-2)
      const minutes = ('0' + date.getMinutes()).slice(-2)
      return `${day}/${month}/${year} ${hours}:${minutes}`
    },
    
    getStateBadgeClass (state) {
      const classes = {
        'INICIADO': 'label label-info',
        'COMPLETADO': 'label label-success',
        'ERROR': 'label label-danger'
      }
      return classes[state] || 'label label-default'
    },
    
    getRowClassName ({ row }) {
      return 'clickable-row'
    }
  }
}
</script>

<style scoped>
.clickable-row {
  cursor: pointer;
}

.clickable-row:hover {
  background-color: #f5f5f5 !important;
}
</style>