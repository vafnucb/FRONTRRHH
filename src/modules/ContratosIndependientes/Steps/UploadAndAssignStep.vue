<template>
  <div>
    <h5 class="text-center">
      PASO 2: Cargar archivo Excel y asignar número de contrato
    </h5>

    <!-- CONTEXTO (SEDE / PERÍODO) -->
    <div class="row" v-if="sedeNombre || periodoNombre">
      <div class="col-md-12 text-center">
        <p>
          <strong>Sede:</strong> {{ sedeNombre || 'No definida' }}<br>
          <strong>Período:</strong> {{ periodoNombre || 'No definido' }}
        </p>
      </div>
    </div>


    <!-- UPLOADER CENTRADO -->
    <div class="row">
      <div class="col-md-8 col-md-offset-2">
        <div class="uploader text-center">
          <!-- Si ya hay archivo cargado, mostrar éxito + botón limpiar -->
<div v-if="fileUploaded" class="uploader-success">
  <i class="fa fa-check-circle uploader-check-icon" aria-hidden="true"></i>
  <span class="uploader-success-text">Archivo cargado correctamente.</span>
  
  <!-- UPDATED: Changed from "Eliminar archivo" to "Limpiar pantalla" -->
  <button type="button" class="btn btn-wd btn-warning" @click="deleteFile">
    <span class="btn-label">
      <i class="fa fa-eraser"></i>
    </span>
    Limpiar pantalla
  </button>
  
  <!-- NEW: Explanatory message -->
  <p style="margin-top: 10px; font-size: 12px; color: #666;">
    <i class="fa fa-info-circle"></i>
    Limpiar la pantalla no borrará el lote de asignaciones.<br>
    Para borrarlo, hágalo desde la lista de lotes.
  </p>
</div>

          <!-- Si NO hay archivo cargado, mostrar input -->
          <div v-else class="uploader-input-wrapper">
            <input type="file" id="archivo-asignaciones" ref="file" @change="submitFile">
            <label for="archivo-asignaciones" id="file-drag" class="uploader-dropzone">
              <img id="file-image" src="#" alt="Preview" class="hidden">
              <div id="start">
                <i class="fa fa-upload uploader-icon" aria-hidden="true"></i>
                <div class="uploader-text-main">
                  Seleccione un archivo Excel o arrástrelo aquí
                </div>
                <div id="notimage" class="hidden uploader-text-error">
                  Por favor seleccione un archivo válido
                </div>
                <span id="file-upload-btn" class="btn btn-primary">
                  Seleccionar archivo
                </span>
              </div>
              <div id="response" class="hidden">
                <div id="messages"></div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- NOTIFICATION -->
<div class="row" v-if="notification.message" style="margin-top: 20px;">
  <div class="col-md-10 col-md-offset-1">
    <div 
      class="alert alert-dismissible" 
      :class="{
        'alert-danger': notification.type === 'error',
        'alert-success': notification.type === 'success',
        'alert-warning': notification.type === 'warning'
      }" 
      role="alert">
      <button type="button" class="close" @click="notification = { type: '', message: '' }">
        <span>&times;</span>
      </button>
      <i :class="{
        'fa fa-exclamation-triangle': notification.type === 'error' || notification.type === 'warning',
        'fa fa-check-circle': notification.type === 'success'
      }" style="margin-right: 8px;"></i>
      <strong v-if="notification.type === 'error'">Error:</strong>
      <strong v-else-if="notification.type === 'warning'">Advertencia:</strong>
      <strong v-else>Éxito:</strong>
      {{ notification.message }}
    </div>
  </div>
</div>

    <!-- TABLA DE ASIGNACIONES - THIS ONLY SHOWS WHEN FILE IS UPLOADED -->
    <div v-if="fileUploaded && fileId" class="table-section">
      <div class="row">
        <div class="col-md-12">
          <hr>

          <!-- HEADER DE LA TABLA -->
          <div class="row">
            <div class="col-md-6">
              <h5 class="table-title">Asignaciones detectadas en el archivo</h5>
            </div>
            <div class="col-md-6 text-right">

              <!--Numero de lote-->
              <div class="row" v-if="fileUploaded && fileId">
                <div class="col-md-12 text-center">
                  <div class="alert alert-info" style="display: inline-block; padding: 10px 20px; margin-bottom: 15px;">
                    <i class="fa fa-inbox"></i>
                    <strong>Número de Lote:</strong> {{ fileId }}
                  </div>
                </div>
              </div>

              <button type="button" class="btn btn-primary btn-sm" @click="toggleManualForm"
                :disabled="procesoFinalizado"
                :title="procesoFinalizado ? 'No se puede agregar en proceso finalizado' : 'Agregar asignación manual'">
                <i class="fa fa-plus"></i> Agregar asignación manual
              </button>

            </div>
          </div>

          <!-- FORMULARIO DE CARGA MANUAL -->
          <div v-if="showManualForm" class="panel panel-default manual-form-panel">
            <div class="panel-heading">
              <strong>{{ editingId ? 'Editar asignación' : 'Nueva asignación manual' }}</strong>
            </div>
            <div class="panel-body">
              <div class="row">
                <div class="col-md-3">
                  <label>CI Docente</label>
                  <input type="text" class="form-control" v-model="manualForm.CiDocente"
                    @input="manualForm.CiDocente = $event.target.value.toUpperCase()">
                </div>
                <div class="col-md-3">
                  <label>Primer apellido</label>
                  <input type="text" class="form-control" v-model="manualForm.PrimerApellido"
                    @input="manualForm.PrimerApellido = $event.target.value.toUpperCase()">
                </div>
                <div class="col-md-3">
                  <label>Segundo apellido</label>
                  <input type="text" class="form-control" v-model="manualForm.SegundoApellido"
                    @input="manualForm.SegundoApellido = $event.target.value.toUpperCase()">
                </div>
                <div class="col-md-3">
                  <label>Tercer apellido</label>
                  <input type="text" class="form-control" v-model="manualForm.TercerApellido"
                    @input="manualForm.TercerApellido = $event.target.value.toUpperCase()">
                </div>
              </div>

              <div class="row" style="margin-top: 10px;">
                <div class="col-md-6">
                  <label>Nombres</label>
                  <input type="text" class="form-control" v-model="manualForm.Nombres"
                    @input="manualForm.Nombres = $event.target.value.toUpperCase()">
                </div>
                <div class="col-md-3">
                  <label>Período (del proceso)</label>
                  <input type="text" class="form-control" :value="periodoNombre || periodoIdProceso" disabled>
                </div>
              </div>

              <div class="row" style="margin-top: 10px;">
                <div class="col-md-3">
                  <label>Sigla <span style="color: red;">*</span></label>
                  <input type="text" class="form-control" v-model="manualForm.Sigla"
                    @input="manualForm.Sigla = $event.target.value.toUpperCase()">
                </div>
                <div class="col-md-2">
                  <label>Paralelo <span style="color: red;">*</span></label>
                  <input type="text" class="form-control" v-model="manualForm.Paralelo"
                    @input="manualForm.Paralelo = $event.target.value.toUpperCase()">
                </div>
                <div class="col-md-2">
                  <label>Código paralelo</label>
                  <input type="text" class="form-control" v-model="manualForm.CodigoParalelo" disabled
                    placeholder="Auto-completado" style="background-color: #f5f5f5;">
                  <small class="help-block" style="margin-top: 2px; color: #999;">
                    Se completa automáticamente
                  </small>
                </div>
              </div>

              <div class="row" style="margin-top: 10px;">
                <div class="col-md-2">
                  <label>Horas/semana</label>
                  <input type="number" step="0.01" class="form-control" v-model.number="manualForm.HorasSemana">
                </div>
                <div class="col-md-2">
                  <label>Horas/mes</label>
                  <input type="number" step="0.01" class="form-control" v-model.number="manualForm.HorasMes">
                </div>
                <div class="col-md-2">
                  <label>Monto/Hora</label>
                  <input type="number" step="0.01" class="form-control" v-model.number="manualForm.CostoHora">
                </div>
                <div class="col-md-2">
                  <label>Cantidad Meses <span style="color: red;">*</span></label>
                  <input type="number" class="form-control" v-model.number="manualForm.CantidadMeses" min="1" max="12">
                </div>
              </div>

              <div class="row" style="margin-top: 15px;">
                <div class="col-md-12 text-right">
                  <button type="button" class="btn btn-default btn-sm" @click="cancelManual">
                    Cancelar
                  </button>
                  <button type="button" class="btn btn-success btn-sm" :disabled="!canSaveManual" @click="saveManual"
                    style="margin-left: 5px;">
                    <i class="fa fa-save"></i> Guardar asignación
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- CONTROLES DE TABLA -->
          <div class="card-content row table-controls">
            <div class="col-sm-3">
              <el-select class="select-default" v-model="pagination.perPage" placeholder="Por página"
                @change="handlePerPageChange(pagination.perPage)">
                <el-option v-for="item in pagination.perPageOptions" :key="item" :label="item + ' por página'"
                  :value="item">
                </el-option>
              </el-select>
            </div>

            <div class="col-sm-9">
              <div class="pull-right">
                <div class="row">
                  <div class="col-sm-2">
                    <label style="vertical-align: middle; margin-top: 7px;">Buscar</label>
                  </div>
                  <div class="col-sm-6">
                    <input type="search" class="form-control input-sm" placeholder="Criterio de búsqueda"
                      v-model="searchQuery">
                  </div>
                  <div class="col-sm-2">
                    <el-tooltip content="Exportar en formato Excel" placement="top">
                      <a class="btn btn-icon btn-success btn-fill" @click="exportExcel">
                        <i class="fa fa-file-excel fa-lg"></i>
                      </a>
                    </el-tooltip>
                  </div>
                  <div class="col-sm-2">
                    <el-tooltip content="Exportar en formato PDF" placement="top">
                      <a class="btn btn-icon btn-danger btn-fill" @click="exportPDF">
                        <i class="fa fa-file-pdf fa-lg"></i>
                      </a>
                    </el-tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TABLA PRINCIPAL -->
          <div class="col-sm-12">
            <el-table :data="paginatedData" :key="reloadKey" class="table-striped" border style="width: 100%"
              v-loading="isLoadingTable" :row-class-name="getRowClassName">

              <!-- Columnas de datos -->
              <el-table-column v-for="column in tableColumns" :key="column.prop" :prop="column.prop"
                :label="column.label" :min-width="column.minWidth">
              </el-table-column>

              <!-- Columna de selección -->
              <el-table-column width="60" align="center" label="Sel." fixed="right">
                <template slot="header">
                  <input type="checkbox" @change="toggleSelectAll" :checked="isAllSelected" title="Seleccionar todo"
                    style="cursor: pointer;">
                </template>
                <template slot-scope="scope">
                  <input type="checkbox" :value="scope.row.Id" v-model="selectedIds" style="cursor: pointer;">
                </template>
              </el-table-column>

              <!-- Columna EDITAR -->
              <el-table-column label="Edit" width="50" align="center" fixed="right">
                <template slot-scope="scope">
                  <a v-if="!procesoFinalizado" href="javascript:void(0)" class="btn btn-simple btn-xs btn-info"
                    @click="editFromRow(scope.row)" title="Editar">
                    <i class="fa fa-edit"></i>
                  </a>
                  <span v-else class="btn btn-simple btn-xs btn-disabled"
                    title="No se puede editar en proceso finalizado" style="cursor: not-allowed; opacity: 0.4;">
                    <i class="fa fa-ban"></i>
                  </span>
                </template>
              </el-table-column>

              <!-- Columna ELIMINAR -->
              <el-table-column label="Del" width="50" align="center" fixed="right">
                <template slot-scope="scope">
                  <a v-if="!procesoFinalizado" href="javascript:void(0)" class="btn btn-simple btn-xs btn-danger"
                    @click="deleteFromRow(scope.row)" title="Eliminar">
                    <i class="fa fa-trash"></i>
                  </a>
                  <span v-else class="btn btn-simple btn-xs btn-disabled"
                    title="No se puede eliminar en proceso finalizado" style="cursor: not-allowed; opacity: 0.4;">
                    <i class="fa fa-ban"></i>
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- PAGINACIÓN E INFO -->
          <div class="row" style="margin-top: 15px;">
            <div class="col-sm-6">
              <p class="category">
                Mostrando {{ fromRecord }} a {{ toRecord }} de {{ filteredData.length }} registros
                <br>
                <small>Página actual: {{ pagination.currentPage }} | Por página: {{ pagination.perPage }}</small>
              </p>
            </div>
            <div class="col-sm-6">
              <el-pagination @current-change="handlePageChange" :current-page="pagination.currentPage"
                :page-size="pagination.perPage" :total="filteredData.length" layout="prev, pager, next"
                class="pull-right">
              </el-pagination>
            </div>
          </div>

          <!-- ACCIONES MASIVAS -->
          <div class="row mass-actions">
            <div class="col-md-12">
              <!-- Validation error message -->
              <div v-if="!canAssignContractValidation.valid && canAssignContractValidation.message"
                class="alert alert-warning" style="margin-bottom: 15px;">
                <i class="fa fa-exclamation-triangle"></i> {{ canAssignContractValidation.message }}
              </div>
            </div>

            <div class="col-md-2">
              <label>N° de contrato</label>
              <input type="text" class="form-control" v-model="contractNumber" placeholder="Ej. 2025-001-ACAD">
            </div>

            <div class="col-md-2">
  <label>Filas seleccionadas</label>
  <p class="form-control-static">
    <strong>{{ selectedRowsData.length }}</strong> registro(s)
  </p>
</div>
            <div class="col-md-2">
              <label>Monto total</label>
              <p class="form-control-static">
                <strong>Bs. {{ selectedTotalAmount.toFixed(2) }}</strong>
              </p>
            </div>

            <div class="col-md-3">
              <label>Observaciones</label>
              <textarea class="form-control" v-model="observaciones" rows="3"
                placeholder="Escriba observaciones del contrato (opcional)" style="resize: vertical;"></textarea>
            </div>

            <div class="col-md-3">
              <label>&nbsp;</label>
              <button class="btn btn-success btn-fill btn-block" :disabled="!canAssignContract || procesoFinalizado"
                @click="assignContract"
                :title="procesoFinalizado ? 'No se puede asignar contratos en proceso finalizado' : ''"
                style="margin-top: 0;">
                <span class="btn-label">
                  <i class="fa fa-link"></i>
                </span>
                Asignar N° de contrato
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import 'jspdf-autotable'
import { Pagination, MessageBox } from 'element-ui'

export default {
  name: 'UploadAndAssignStep',
  components: {
    'el-pagination': Pagination
  },
  beforeCreate () {
    this.$confirm = MessageBox.confirm
  },
  data () {
    return {
      fileUploaded: false,
      fileId: null,
      uploadUrl: 'AsignacionesMasivas/UploadFile',
      reloadKey: 0,
      observaciones: '',
      showManualForm: false,
      searchCodigoTimeout: null,
      editingId: null,
      isLoadingTable: false,
      searchQuery: '',
      
      notification: {
        type: '',
        message: ''
      },
      
      manualForm: {
        CiDocente: '',
        PrimerApellido: '',
        SegundoApellido: '',
        TercerApellido: '',
        Nombres: '',
        Sigla: '',
        CodigoParalelo: '',
        Paralelo: '',
        HorasSemana: null,
        HorasMes: null,
        CostoHora: null,
        CantidadMeses: 1
      },
      
      tableData: [],
      
      tableColumns: [
        { prop: 'Id', label: '#', minWidth: 40 },
        { prop: 'CiDocente', label: 'CI Docente', minWidth: 90 },
        { prop: 'NombreCompleto', label: 'Nombre completo', minWidth: 220 },
        { prop: 'Periodo', label: 'Periodo', minWidth: 80 },
        { prop: 'Sigla', label: 'Sigla', minWidth: 80 },
        { prop: 'Paralelo', label: 'Paralelo', minWidth: 50 },
        { prop: 'CodigoParalelo', label: 'Cód. Paralelo', minWidth: 110 },       
        { prop: 'HorasSemana', label: 'Horas/semana', minWidth: 50 },
        { prop: 'HorasMes', label: 'Horas/mes', minWidth: 50 },
        { prop: 'CostoHora', label: 'Monto/Hora', minWidth: 70 },
        { prop: 'CantidadMeses', label: 'Cant. Meses', minWidth: 50 }, 
        { prop: 'MontoTotal', label: 'Monto total', minWidth: 100 },
        { prop: 'Sede', label: 'Sede', minWidth: 70 },
        { prop: 'UnidadOrganizacional', label: 'U. Organiz.', minWidth: 60 },
        { prop: 'NumeroContrato', label: 'N° Contrato', minWidth: 110 }
      ],
      
      pagination: {
        perPage: 10,
        currentPage: 1,
        perPageOptions: [10, 20, 50, 100],
        total: 0
      },
      
      selectedIds: [],
      contractNumber: ''
    }
  },
  
  computed: {
    sedeNombre () {
      return this.$store.state.asig && this.$store.state.asig.SedeNombre
        ? this.$store.state.asig.SedeNombre
        : ''
    },

    procesoFinalizado () {
    const state = this.$store.state.asig && this.$store.state.asig.State
    return state === 'FINALIZADO'
  },
    
    periodoNombre () {
      return this.$store.state.asig && this.$store.state.asig.PeriodoNombre
        ? this.$store.state.asig.PeriodoNombre
        : ''
    },
    
    periodoIdProceso () {
      return this.$store.state.asig && this.$store.state.asig.PeriodoId
        ? this.$store.state.asig.PeriodoId
        : ''
    },
    
    canAssignContract () {
  return this.canAssignContractValidation.valid
},
    
    canSaveManual () {
      const f = this.manualForm
      return (
        this.fileId &&
        f.CiDocente &&
        f.PrimerApellido &&
        f.Nombres &&
        f.Sigla &&
        f.CodigoParalelo &&
        f.Paralelo &&
        f.HorasSemana !== null &&
        f.HorasMes !== null &&
        f.CostoHora !== null &&
        f.CantidadMeses !== null && f.CantidadMeses > 0
      )
    },
    
    // Datos filtrados por búsqueda
    filteredData () {
      if (!this.searchQuery) {
        return this.tableData
      }
      
      const query = this.searchQuery.toUpperCase().trim()
      return this.tableData.filter(row => {
        // Buscar en todas las propiedades relevantes
        const searchableFields = [
          'CiDocente',
          'PrimerApellido',
          'SegundoApellido',
          'TercerApellido',
          'Nombres',
          'NombreCompleto',
          'Periodo',
          'Sigla',
          'CodigoParalelo',
          'Paralelo',
          'Sede',
          'NumeroContrato'
        ]
        
        return searchableFields.some(field => {
          const value = row[field]
          return value && String(value).toUpperCase().includes(query)
        })
      })
    },
    
    // Datos paginados
    paginatedData () {
      const start = (this.pagination.currentPage - 1) * this.pagination.perPage
      const end = start + this.pagination.perPage
      return this.filteredData.slice(start, end)
    },
    
    fromRecord () {
      if (this.filteredData.length === 0) return 0
      return (this.pagination.currentPage - 1) * this.pagination.perPage + 1
    },
    
    toRecord () {
      const to = this.pagination.currentPage * this.pagination.perPage
      return Math.min(to, this.filteredData.length)
    },
    
    // Check if all visible rows are selected
    isAllSelected () {
      if (this.paginatedData.length === 0) return false
      return this.paginatedData.every(row => this.selectedIds.includes(row.Id))
    },
    // NEW: Check if all selected rows have the same CI
selectedRowsData () {
  return this.tableData.filter(row => this.selectedIds.includes(row.Id))
},

canAssignContractValidation () {
    if (!this.contractNumber || this.selectedRowsData.length === 0) {
      return { valid: false, message: '' }
    }
    
    if (this.selectedRowsData.length === 1) {
      return { valid: true, message: '' }
    }
    
    // Get unique CIs from selected rows
    const uniqueCIs = [...new Set(this.selectedRowsData.map(row => row.CiDocente))]
    
    if (uniqueCIs.length > 1) {
      return { 
        valid: false, 
        message: 'No se puede asignar un mismo contrato a docentes diferentes. Seleccione solo asignaciones del mismo docente (CI).'
      }
    }
    
    return { valid: true, message: '' }
  },

selectedTotalAmount () {
  return this.selectedRowsData.reduce((sum, row) => {
    return sum + (row.MontoTotal || 0)
  }, 0)
}
  },
  
  watch: {
    fileId (newVal) {
      if (newVal) {
        this.loadTableData()
      }
    },
    'notification.message': function (newVal, oldVal) {
    console.log('=== NOTIFICATION CHANGED ===')
    console.log('Old:', oldVal)
    console.log('New:', newVal)
    console.log('Type:', this.notification.type)
    console.log('Full notification object:', JSON.stringify(this.notification))
  },
    
    reloadKey () {
      if (this.fileId) {
        this.loadTableData()
      }
    },
    'manualForm.Sigla': function (newVal, oldVal) {
    if (newVal !== oldVal) {
      // Clear previous timeout
      if (this.searchCodigoTimeout) {
        clearTimeout(this.searchCodigoTimeout)
      }
      
      // Wait 500ms after user stops typing
      this.searchCodigoTimeout = setTimeout(() => {
        this.buscarCodigoParalelo()
      }, 500)
    }
  },
  
  'manualForm.Paralelo': function (newVal, oldVal) {
    if (newVal !== oldVal) {
      if (this.searchCodigoTimeout) {
        clearTimeout(this.searchCodigoTimeout)
      }
      
      this.searchCodigoTimeout = setTimeout(() => {
        this.buscarCodigoParalelo()
      }, 500)
    }
  }
  },
  
  methods: {
    canContinue () {
      return this.fileUploaded && this.fileId
    },
    getRowClassName ({ row, rowIndex }) {
    // Highlight rows that have contract number assigned
    if (row.NumeroContrato && row.NumeroContrato.trim() !== '') {
      return 'row-with-contract'
    }
    return ''
  },
    
    toggleManualForm () {
      this.showManualForm = !this.showManualForm
      if (this.showManualForm) {
        this.resetManualForm()
        this.editingId = null
      }
    },
    
    resetManualForm () {
  this.manualForm = {
    CiDocente: '',
    PrimerApellido: '',
    SegundoApellido: '',
    TercerApellido: '',
    Nombres: '',
    Sigla: '',
    CodigoParalelo: '',  // Will be auto-filled
    Paralelo: '',
    HorasSemana: null,
    HorasMes: null,
    CostoHora: null,
    CantidadMeses: 1
  }
  
  // Clear any error notifications when resetting
  this.notification = { type: '', message: '' }
},
    
    cancelManual () {
      this.resetManualForm()
      this.showManualForm = false
      this.editingId = null
    },
    
    editFromRow (row) {
      if (!row) return
      
      this.showManualForm = true
      this.editingId = row.Id
      
      this.manualForm = {
        CiDocente: row.CiDocente || '',
        PrimerApellido: row.PrimerApellido || '',
        SegundoApellido: row.SegundoApellido || '',
        TercerApellido: row.TercerApellido || '',
        Nombres: row.Nombres || '',
        Sigla: row.Sigla || '',
        CodigoParalelo: row.CodigoParalelo || '',
        Paralelo: row.Paralelo || '',
        HorasSemana: row.HorasSemana != null ? Number(row.HorasSemana) : null,
        HorasMes: row.HorasMes != null ? Number(row.HorasMes) : null,
        CostoHora: row.CostoHora != null ? Number(row.CostoHora) : null,
        CantidadMeses: row.CantidadMeses != null ? Number(row.CantidadMeses) : 1
      }
    },
    
    deleteFromRow (row) {
  if (!row || !row.Id) return

  // Show confirmation dialog
  this.$confirm(
    '¿Está seguro que desea eliminar esta asignación?', 
    'Confirmar eliminación', 
    {
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      type: 'warning',
      center: true
    }
  ).then(() => {
    // User confirmed - proceed with deletion
    const url = 'AsignacionesMasivas/DeleteSingle'
    const payload = { Id: row.Id }
    const headers = {
      'Content-Type': 'application/json'
    }
    const token = localStorage.getItem('token')
    if (token) {
      headers.token = token
    }

    axios.post(url, payload, { headers })
      .then(() => {
        // Reload table data
        this.reloadKey += 1
        this.pagination.currentPage = 1

        // Show success notification
        this.notification = {
          type: 'success',
          message: 'La asignación se eliminó correctamente.'
        }

        // Auto-clear notification after 3 seconds
        setTimeout(() => {
          this.notification = { type: '', message: '' }
        }, 3000)
      })
      .catch(error => {
        console.error('Error eliminando asignación:', error)

        const data = error.response && error.response.data
        const errorMsg = data && data.Message 
          ? data.Message 
          : 'No se pudo eliminar la asignación.'

        this.notification = {
          type: 'error',
          message: errorMsg
        }
      })
  }).catch(() => {
    // User cancelled - do nothing
    console.log('Eliminación cancelada por el usuario')
  })
},

    async buscarCodigoParalelo () {
    const sigla = this.manualForm.Sigla && this.manualForm.Sigla.trim()
    const paralelo = this.manualForm.Paralelo && this.manualForm.Paralelo.trim()
    
    // Only search if both fields are filled
    if (!sigla || !paralelo || !this.fileId) {
      this.manualForm.CodigoParalelo = ''
      return
    }
    
    try {
      const headers = {
        token: localStorage.getItem('token')
      }
      
      const response = await axios.get('/AsignacionesMasivas/BuscarCodigoParalelo', {
        params: {
          procesoId: this.fileId,
          sigla: sigla,
          paralelo: paralelo
        },
        headers: headers
      })
      
      // Auto-fill CodigoParalelo
      this.manualForm.CodigoParalelo = response.data.CodigoParalelo || ''
      
      // Show success notification (optional)
      this.notification = {
        type: 'success',
        message: `Código de paralelo encontrado: ${response.data.CodigoParalelo}`
      }
      
      // Auto-clear notification after 3 seconds
      setTimeout(() => {
        this.notification = { type: '', message: '' }
      }, 3000) 
    } catch (error) {
      console.error('Error buscando código paralelo:', error)
      
      this.manualForm.CodigoParalelo = ''
      
      const data = error.response && error.response.data
      const message = data && data.Message 
        ? data.Message 
        : 'No se encontró el código de paralelo con los datos ingresados.'
      
      this.notification = {
        type: 'error',
        message: message
      }
    }
  },
  
    saveManual () {
      if (!this.canSaveManual) return
      
      const basePayload = {
        CiDocente: this.manualForm.CiDocente,
        PrimerApellido: this.manualForm.PrimerApellido,
        SegundoApellido: this.manualForm.SegundoApellido,
        TercerApellido: this.manualForm.TercerApellido,
        Nombres: this.manualForm.Nombres,
        Periodo: this.periodoIdProceso,
        Sigla: this.manualForm.Sigla,
        CodigoParalelo: this.manualForm.CodigoParalelo,
        Paralelo: this.manualForm.Paralelo,
        HorasSemana: this.manualForm.HorasSemana,
        HorasMes: this.manualForm.HorasMes,
        CostoHora: this.manualForm.CostoHora,
        CantidadMeses: this.manualForm.CantidadMeses 
      }
      
      let url
      let payload
      
      if (this.editingId) {
        url = 'AsignacionesMasivas/UpdateSingle'
        payload = Object.assign({ Id: this.editingId }, basePayload)
      } else {
        url = 'AsignacionesMasivas/AddSingle'
        payload = Object.assign({ ProcesoId: this.fileId }, basePayload)
      }
      
      const headers = {
        'Content-Type': 'application/json'
      }
      const token = localStorage.getItem('token')
      if (token) {
        headers.token = token
      }
      
      const esEdicion = !!this.editingId
      
      axios.post(url, payload, { headers })
        .then(() => {
          this.showManualForm = false
          this.editingId = null
          this.resetManualForm()
          this.reloadKey += 1
          this.pagination.currentPage = 1
          
          this.notification = {
            type: 'success',
            message: esEdicion
              ? 'La asignación se actualizó correctamente.'
              : 'La asignación se agregó correctamente.'
          }
        })
        .catch(error => {
          console.error('Error guardando asignación:', error)
          
          const data = error.response && error.response.data
          const errors = data && (data.Errors || data.errors)
          
          let msg = ''
          if (Array.isArray(errors) && errors.length) {
            msg = errors.join('\n')
          }
          
          this.notification = {
            type: 'error',
            message: msg || 'Ocurrió un error al validar los datos.'
          }
        })
    },
    
    submitFile () {
  if (!this.$refs.file || !this.$refs.file.files.length) return
  
  const file = this.$refs.file.files[0]
  const formData = new FormData()
  
  formData.append('file', file)
  
  const asigState = this.$store.state.asig || {}
  formData.append('BranchesId', asigState.SedeId || '')
  formData.append('PeriodoId', asigState.PeriodoId || '')
  
  this.$store.commit('crud/loadSetter', true)
  
  console.log('=== UPLOAD STARTED ===')
  console.log('File:', file.name)
  console.log('BranchesId:', asigState.SedeId)
  console.log('PeriodoId:', asigState.PeriodoId)
  
  axios.post(this.uploadUrl, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      token: localStorage.getItem('token')
    },
    responseType: 'arraybuffer'
  })
    .then(response => {
      console.log('=== SUCCESS RESPONSE ===')
      console.log('Status:', response.status)
      console.log('Headers:', response.headers)
      console.log('Data length:', response.data.byteLength)
      
      try {
        const text = new TextDecoder('utf-8').decode(response.data)
        console.log('Decoded text:', text.substring(0, 200))
        const json = JSON.parse(text)
        console.log('Parsed JSON:', json)
        
        this.fileId = json.id || json.Id || null
        this.fileUploaded = true
        this.selectedIds = []
        
        this.notification = {
          type: 'success',
          message: 'Archivo cargado correctamente'
        }
        
        this.$store.commit('crud/loadSetter', false)
      } catch (e) {
        console.error('Parse error:', e)
        this.fileUploaded = false
        this.fileId = null
        this.$store.commit('crud/loadSetter', false)
      }
    })
    .catch(error => {
  console.log('=== ERROR RESPONSE ===')
  console.error('Full error object:', error)
  
  this.fileUploaded = false
  this.fileId = null
  this.$store.commit('crud/loadSetter', false)
  
  if (this.$refs.file) {
    this.$refs.file.value = ''
  }
  
  if (!error.response) {
    console.log('NO RESPONSE from server')
    this.notification = {
      type: 'error',
      message: 'Error de conexión. No se pudo comunicar con el servidor.'
    }
    return
  }
  
  console.log('Response status:', error.response.status)
  console.log('Response headers:', error.response.headers)
  console.log('Response data type:', typeof error.response.data)
  console.log('Response data length:', error.response.data ? error.response.data.byteLength : 0)
  
  const headers = error.response.headers
  const contentType = headers['content-type'] || ''
  
  console.log('Content-Type:', contentType)
  
  // Case 1: Excel file with errors (MOST COMMON)
  if (contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
    console.log('✓ Detected Excel file response')
    
    // Download the Excel file
    const blob = new Blob([error.response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    
    console.log('Blob created, size:', blob.size)
    
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    
    // Determine filename from Content-Disposition or use default
    const contentDisposition = headers['content-disposition'] || ''
    let filename = 'Errores_Asignaciones.xlsx'
    
    if (contentDisposition.includes('filename=')) {
      const matches = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
      if (matches && matches[1]) {
        filename = matches[1].replace(/['"]/g, '')
      }
    }
    
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    
    console.log('Triggering download...')
    link.click()
    
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    console.log('Download triggered, cleanup done')
    
    // Get error details from header if available
    let errorDetails = ''
    const uploadErrorsKey = Object.keys(headers).find(k => k.toLowerCase() === 'uploaderrors')
    
    if (uploadErrorsKey) {
      try {
        const parsed = JSON.parse(headers[uploadErrorsKey])
        console.log('Parsed UploadErrors:', parsed)
        
        // Extract meaningful error summary
        if (parsed.Error) {
          errorDetails = parsed.Error
        } else if (parsed.Errores) {
          const errorCount = Array.isArray(parsed.Errores) ? parsed.Errores.length : 0
          errorDetails = `Se encontraron errores en ${errorCount} fila(s)`
        } else if (parsed.MissingColumns && Array.isArray(parsed.MissingColumns)) {
          errorDetails = `Faltan columnas: ${parsed.MissingColumns.join(', ')}`
        }
      } catch (e) {
        console.warn('Could not parse UploadErrors header:', e)
      }
    }
    
    // Show error notification
    this.notification = {
      type: 'error',
      message: errorDetails 
        ? `El archivo contiene errores: ${errorDetails}. Se descargó un archivo Excel con los detalles de los errores para que pueda corregirlos.`
        : 'El archivo contiene errores de validación. Se descargó un archivo Excel con los detalles de los errores resaltados para que pueda corregirlos.'
    }
    
    console.log('Notification set:', this.notification)
    
    // Force Vue to update
    this.$forceUpdate()
    
    return
  }
  
  console.log('✗ Not an Excel file, trying other formats...')
  
  // Case 2: JSON error
  if (contentType.includes('application/json')) {
    console.log('Detected JSON response')
    try {
      const text = new TextDecoder('utf-8').decode(error.response.data)
      const json = JSON.parse(text)
      console.log('Parsed JSON error:', json)
      
      this.notification = {
        type: 'error',
        message: json.Message || json.message || 'Error al procesar el archivo'
      }
      return
    } catch (e) {
      console.warn('Could not parse JSON:', e)
    }
  }
  
  // Case 3: Plain text or unknown format
  console.log('Using fallback error handling')
  
  try {
    const text = new TextDecoder('utf-8').decode(error.response.data)
    console.log('Decoded fallback text:', text)
    
    // Check headers for additional errors
    const uploadErrorsKey = Object.keys(headers).find(k => k.toLowerCase() === 'uploaderrors')
    let headerErrors = []
    
    if (uploadErrorsKey) {
      try {
        const parsed = JSON.parse(headers[uploadErrorsKey])
        console.log('Parsed header errors:', parsed)
        if (typeof parsed === 'object') {
          headerErrors = Object.values(parsed)
        }
      } catch (e) {
        console.warn('Could not parse UploadErrors header:', e)
      }
    }
    
    const errorText = headerErrors.length > 0
      ? headerErrors.join(' ')
      : (text || 'Error al procesar el archivo')
    
    this.notification = {
      type: 'error',
      message: errorText
    }
  } catch (e) {
    console.error('Could not decode error:', e)
    this.notification = {
      type: 'error',
      message: 'Error al procesar el archivo. Por favor, verifique el formato y vuelva a intentarlo.'
    }
  }
})
},
    
    deleteFile () {
      this.fileUploaded = false
      this.fileId = null
      this.selectedIds = []
      this.reloadKey = 0
      this.tableData = []
      if (this.$refs.file) {
        this.$refs.file.value = ''
      }
    },
    
    assignContract () {
  // Double-check validation
  if (!this.canAssignContractValidation.valid) {
    this.notification = {
      type: 'error',
      message: this.canAssignContractValidation.message
    }
    return
  }

  const payload = {
    fileId: this.fileId,
    contractNumber: this.contractNumber,
    assignmentIds: this.selectedIds,
    observaciones: this.observaciones  // NEW
  }

  axios.post('/AsignacionesMasivas/AssignContractNumber', payload, {
    headers: {
      token: localStorage.getItem('token')
    }
  })
  .then((response) => {
      this.selectedIds = []
      this.contractNumber = ''
      this.observaciones = ''
      this.reloadKey += 1
      this.pagination.currentPage = 1

      this.notification = {
        type: 'success',
        message: 'Número de contrato asignado correctamente.'
      }

      // Show warning if present
    if (response.data && response.data.Warning) {
      setTimeout(() => {
        this.notification = {
          type: 'warning',
          message: response.data.Warning
        }
      }, 3000) // Show warning after success message
    }
    })
    .catch(error => {
      console.error('Error asignando número de contrato:', error)
      
      const data = error.response && error.response.data
      const errorMsg = data && data.Message ? data.Message : 'No se pudo asignar el número de contrato.'
      
      this.notification = {
        type: 'error',
        message: errorMsg
      }
    })
},
    
    loadTableData () {
      if (!this.fileId) return
      
      this.isLoadingTable = true
      
      axios.get(`/AsignacionesMasivas/GetDetail/${this.fileId}`, {
        headers: {
          token: localStorage.getItem('token')
        }
      })
        .then(response => {
          this.tableData = response.data || []
          this.isLoadingTable = false
        })
        .catch(error => {
          console.error('Error cargando datos de la tabla:', error)
          this.tableData = []
          this.isLoadingTable = false
        })
    },
    
    handlePageChange (page) {
      console.log('Page changed to:', page)
      this.pagination.currentPage = page
    },
    
    handlePerPageChange (val) {
      console.log('Per page changed to:', val)
      this.pagination.perPage = val
      this.pagination.currentPage = 1
    },
    
    toggleSelectAll () {
      if (this.isAllSelected) {
        // Deselect all visible rows
        this.paginatedData.forEach(row => {
          const index = this.selectedIds.indexOf(row.Id)
          if (index > -1) {
            this.selectedIds.splice(index, 1)
          }
        })
      } else {
        // Select all visible rows
        this.paginatedData.forEach(row => {
          if (!this.selectedIds.includes(row.Id)) {
            this.selectedIds.push(row.Id)
          }
        })
      }
    },
    
    // Exportar Excel
    exportExcel () {
      const dataToExport = this.filteredData
      
      if (!dataToExport || dataToExport.length === 0) {
        this.$message.warning('No hay datos para exportar')
        return
      }
      
      let csv = this.convertArrayOfObjectsToCSV({ data: dataToExport })
      if (csv == null) return
      
      const filename = 'asignaciones_export.csv'
      const data = 'data:text/csv;charset=utf-8,' + encodeURI(csv)
      
      const link = document.createElement('a')
      link.setAttribute('href', data)
      link.setAttribute('download', filename)
      link.click()
    },
    
    convertArrayOfObjectsToCSV (args) {
      const data = args.data || null
      if (data == null || !data.length) {
        return null
      }
      
      const columnDelimiter = ';'
      const lineDelimiter = '\n'
      const keys = Object.keys(data[0])
      
      let result = ''
      result += keys.join(columnDelimiter)
      result += lineDelimiter
      
      data.forEach(function (item) {
        let ctr = 0
        keys.forEach(function (key) {
          if (ctr > 0) result += columnDelimiter
          result += item[key]
          ctr++
        })
        result += lineDelimiter
      })
      
      return result
    },
    
    // Exportar PDF
    exportPDF () {
      const dataToExport = this.filteredData
      
      if (!dataToExport || dataToExport.length === 0) {
        this.$message.warning('No hay datos para exportar')
        return
      }
      
      const doc = new jsPDF('landscape')
      
      // Header
      const img = new Image()
      img.src = './../static/img/logo_ucb3.png'
      doc.addImage(img, 'png', 14, 10, 20, 29)
      doc.setFontSize(8)
      doc.text('Fecha: ' + this.formattedDate(), 280, 10, null, null, 'right')
      doc.text('Fuente: ASIGNACIONES', 280, 15, null, null, 'right')
      doc.setFontStyle('bold')
      doc.setFontSize(18)
      doc.text('Universidad Católica Boliviana "San Pablo"', 145, 25, null, null, 'center')
      doc.setFontSize(12)
      doc.text('Asignaciones Masivas', 145, 35, null, null, 'center')
      
      // Table data
      const body = this.getPDFBody(dataToExport)
      const header = Object.keys(dataToExport[0])
      header.splice(0, 1) // Remove Id
      
      let fontSize = 10
      if (header.length >= 10) fontSize = 8
      if (header.length >= 12) fontSize = 6
      if (header.length >= 14) fontSize = 4.5
      
      doc.autoTable({
        startY: 54,
        head: [header],
        body: body,
        theme: 'grid',
        styles: { fontSize: fontSize },
        headStyles: {
          fillColor: [4, 134, 230],
          fontSize: fontSize
        }
      })
      
      doc.save('asignaciones_export.pdf')
    },
    
    getPDFBody (data) {
      const pdf = []
      for (let i = 0; i < data.length; i++) {
        const row = Object.values(data[i])
        row.splice(0, 1) // Remove Id
        pdf.push(row)
      }
      return pdf
    },
    
    formattedDate () {
      const date = new Date()
      const mnth = ('0' + (date.getMonth() + 1)).slice(-2)
      const day = ('0' + date.getDate()).slice(-2)
      return [day, mnth, date.getFullYear()].join('-')
    }
  }
}
</script>

<style scoped>
.uploader {
  margin-top: 20px;
  margin-bottom: 20px;
}

#archivo-asignaciones {
  display: none;
}

.uploader-input-wrapper {
  width: 100%;
}

.uploader-dropzone {
  display: block;
  border: 2px dashed #ccc;
  border-radius: 6px;
  padding: 25px 20px;
  cursor: pointer;
  text-align: center;
  background-color: #fafafa;
  transition: all 0.2s ease;
}

.uploader-dropzone:hover {
  border-color: #999;
  background-color: #f5f5f5;
}

.uploader-icon {
  font-size: 38px;
  margin-bottom: 8px;
}

.uploader-text-main {
  font-size: 14px;
  margin-bottom: 8px;
}

.uploader-text-error {
  color: #d9534f;
  margin-bottom: 8px;
}

.uploader-success {
  padding: 10px 15px;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background-color: #f5fff7;
  border-radius: 4px;
  border: 1px solid #d6eedb;
}

.uploader-check-icon {
  font-size: 22px;
  color: #5cb85c;
}

.uploader-success-text {
  margin: 0;
}

.table-section {
  margin-top: 10px;
}

.table-title {
  margin-bottom: 15px;
}

.manual-form-panel {
  margin-top: 10px;
  padding: 10px;
}

.table-controls {
  margin-top: 20px;
  margin-bottom: 15px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.action-icon {
  display: inline-flex;
  align-items: center;
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.action-icon:hover {
  opacity: 0.7;
}

/* Compact action buttons in table */
.el-table .btn-simple.btn-xs {
  padding: 2px 4px !important;
  font-size: 12px !important;
  line-height: 1.2 !important;
  min-width: auto !important;
}

.el-table .btn-simple.btn-xs i {
  font-size: 12px !important;
  margin: 0 !important;
}

/* Ensure checkboxes are visible and clickable */
.el-table input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.mass-actions {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
}
</style>

<style>
.el-table .row-with-contract {
  background-color: #e8f5e9 !important;
}

.el-table .row-with-contract:hover > td {
  background-color: #c8e6c9 !important;
}
</style>