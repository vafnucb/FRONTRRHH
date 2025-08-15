<template>
  <div>
    <!-- Filter Selection Page -->
    <div v-if="!filtersApplied" class="row">
      <div class="col-md-6 offset-md-3 card">
        <div class="card-body">
          <h4 class="card-title" style="color: #1c3b6c;">Filtrar Lotes de Servicio</h4>
          
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label style="color: #1c3b6c; font-weight: 500;">Tipo de Servicio:</label>
                <el-select
                  v-model="batchFileType"
                  placeholder="Seleccione tipo"
                  class="w-100"
                  style="border: 1px solid #1c3b6c; border-radius: 4px;"
                >
                  <el-option
                    v-for="type in batchTypes"
                    :key="type.value"
                    :label="type.label"
                    :value="type.value">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label style="color: #1c3b6c; font-weight: 500;">Sede:</label>
                <el-select
                  v-model="branchId"
                  placeholder="Seleccione la Sede"
                  class="w-100"
                  style="border: 1px solid #1c3b6c; border-radius: 4px;"
                >
                  <el-option
                    v-for="region in regions"
                    :key="region.id"
                    :label="region.name"
                    :value="region.id">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          
          <div class="text-center mt-4">
            <button @click="applyFilters" class="btn btn-info btn-fill btn-wd">
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Table Page -->
    <div v-else class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header" style="background-color: #f8f9fa;">
            <button @click="resetFilters" class="btn btn-default btn-fill btn-wd btn-back">
              ← Volver a Filtros
            </button>
            <h4 class="d-inline-block ml-3" style="color: #1c3b6c;">Lotes de Pago</h4>
          </div>
          <div class="applied-filters" style="padding: 15px 20px; background-color: #f5f7fa; border-bottom: 1px solid #e6e6e6;">
        <h5 style="color: #1c3b6c; font-size: 14px; margin-bottom: 10px; font-weight: 500;">
          Filtros aplicados:
        </h5>
        <div v-if="selectedFilters.length > 0">
          <el-tag
            v-for="(filter, index) in selectedFilters"
            :key="index"
            type="info"
            style="margin-right: 8px; margin-bottom: 8px;"
          >
            {{ filter.label }}: <strong>{{ filter.value }}</strong>
          </el-tag>
        </div>
        <div v-else style="color: #666; font-size: 13px;">
          Sin filtros aplicados (mostrando todos los registros)
        </div>
      </div>
          <div class="card-body">
            <data-tables 
              v-bind="{
                url: tableUrl,
                propsToSearch,
                tableColumns,
                pagination,
                fuentePDF: 'SARAI'
              }"
            >
              <!-- Action buttons -->
              <!-- <template slot="buttons" slot-scope="props">
                <el-tooltip class="item" effect="dark" content="Ver Detalles" placement="top-start">
                  <a class="btn btn-simple btn-xs btn-icon btn-info" @click="viewDetails(props.queriedData[props.index].BatchId)">
                    <i class="ti-eye"></i>
                  </a>
                </el-tooltip>
              </template>-->
            </data-tables>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filtersApplied: false,
      batchFileType: null,
      branchId: null,
      batchTypes: [
        { value: 'VARIOS', label: 'Varios' },
        { value: 'PARALELO', label: 'Paralelo' },
        { value: 'PROYECTOS', label: 'Proyectos' },
        { value: 'CARRERA', label: 'Carrera' }
      ],
      regions: [
        { id: 2, name: 'TJA' },
        { id: 3, name: 'CBB' },
        { id: 16, name: 'SCZ' },
        { id: 17, name: 'LPZ' },
        { id: 18, name: 'EPC' },
        { id: 22, name: 'TEO' },
        { id: 23, name: 'SUC' },
        { id: 24, name: 'ORU' }
      ],
      propsToSearch: [
        'BatchId',
        'CardName',
        'BatchSAPId',
        'OU',
        'Memo',
        'LineMemo',
        'BatchState'
       
      ],
      tableColumns: [
        { prop: 'BatchId', label: '# Lote', minWidth: 80 },
        { 
          prop: 'BranchAbr', 
          label: 'Sede', 
          minWidth: 80
        },
        { 
          prop: 'BatchState', 
          label: 'Estado', 
          minWidth: 100,
          formatter: this.formatState,
          render: (h, { row }) => {
            return h('el-tag', {
              props: {
                type: this.getStateTagType(row.BatchState)
              }
            }, this.formatState(row.BatchState))
          }
        },
        { prop: 'BatchSAPId', label: 'SAPId', minWidth: 100 },
        { 
          prop: 'BatchCreatedAt', 
          label: 'Creado', 
          minWidth: 120,
          formatter: this.formatDate 
        },
        { prop: 'CardName', label: 'Docente', minWidth: 180 },
        { prop: 'OU', label: 'U.O.', minWidth: 80 },
        
        { prop: 'Memo', label: 'Servicio', minWidth: 150, showOverflowTooltip: true },
        { prop: 'LineMemo', label: 'Detalle', minWidth: 250, showOverflowTooltip: true },
        
        { 
          prop: 'Credit', 
          label: 'Monto Bruto', 
          minWidth: 120,
          align: 'right',
          formatter: this.formatCurrency
        },
        { 
          prop: 'Debit', 
          label: 'Monto Pagar', 
          minWidth: 120,
          align: 'right',
          formatter: this.formatCurrency
        }
      ],
      pagination: { 
        perPage: 10, 
        currentPage: 1, 
        perPageOptions: [10, 20, 50], 
        total: 0 
      }
    }
  },
  computed: {
    tableUrl() {
      let url = '/ServContract/Search';
      const params = [];
      
      if (this.batchFileType) {
        params.push(`batchFileType=${this.batchFileType}`);
      }
      
      if (this.branchId) {
        params.push(`branchId=${this.branchId}`);
      }
      
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }
      
      return url;
    },
    selectedFilters() {
    const filters = [];
    
    if (this.batchFileType) {
      const type = this.batchTypes.find(t => t.value === this.batchFileType);
      if (type) {
        filters.push({ label: 'Tipo de Servicio', value: type.label });
      }
    }
    
    if (this.branchId) {
      const region = this.regions.find(r => r.id === this.branchId);
      if (region) {
        filters.push({ label: 'Sede', value: region.name });
      }
    }
    
    return filters;
  }
  },
  methods: {
    applyFilters() {
      this.filtersApplied = true;
    },
    resetFilters() {
      this.filtersApplied = false;
      this.batchFileType = null;
      this.branchId = null;
    },
    formatState(state) {
      switch (state) {
        case 'PendingApproval': return 'Pendiente'
        case 'INSAP': return 'En SAP'
        case 'Rejected': return 'Rechazado'
        case 'ESPERANDO APROBACION': return 'Pendiente'
        case 'IN SAP': return 'En SAP'
        case 'RECHAZADO': return 'Rechazado'
        default: return state
      }
    },
    getStateTagType(state) {
      switch (state) {
        case 'PendingApproval': 
        case 'ESPERANDO APROBACION': 
          return 'warning'
        case 'INSAP': 
        case 'IN SAP': 
          return 'success'
        case 'Rejected': 
        case 'RECHAZADO': 
          return 'danger'
        default: return ''
      }
    },
    formatCurrency(value) {
      return value ? new Intl.NumberFormat('es-BO', {
        style: 'currency',
        currency: 'BOB'
      }).format(value) : ''
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
    },
    viewDetails(batchId) {
      // Implement your detail view logic here
      console.log('Viewing details for batch:', batchId)
    }
  }
}
</script>

<style>

.card {
  margin-top: 20px;
  border-radius: 4px;
}
.btn-info {
  background-color: #1c3b6c;
  border-color: #1c3b6c;
}
.btn-info:hover {
  background-color: #0d2a5a;
  border-color: #0d2a5a;
}
.el-select {
  width: 100%;
}
.applied-filters {
  padding: 15px 20px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e6e6e6;
}

.applied-filters h5 {
  color: #1c3b6c;
  font-size: 14px;
  margin-bottom: 10px;
  font-weight: 500;
}

.el-tag {
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>