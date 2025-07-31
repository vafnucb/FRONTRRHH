<template>
    <div>
      <!-- Filter Selection Page -->
      <div v-if="!filtersApplied" class="row">
        <div class="col-md-8 offset-md-2 card">
          <div class="card-body">
            <h4 class="card-title" style="color: #1c3b6c; margin-bottom: 1.5rem;">Filtrar Pagos Pendientes</h4>
            
            <div class="row">
  <!-- Moved branch filter to the top -->
  <div class="col-md-12">
    <div class="form-group">
      <label style="color: #1c3b6c; font-weight: 500;">Sede:</label>
      <el-select
        v-model="branchesId"
        placeholder="Seleccione una sede"
        class="w-100"
        style="border: 1px solid; color: #1c3b6c; border-radius: 4px;"
      >
        <el-option
          v-for="region in regions"
          :key="region.id"
          :label="region.abr"
          :value="region.id">
        </el-option>
      </el-select>
    </div>
  </div>
  
  <!-- Date filters below -->
  <div class="col-md-6">
    <div class="form-group">
      <label style="color: #1c3b6c; font-weight: 500;">Fecha de Inicio:</label>
      <input 
        type="date" 
        v-model="fechaInicio" 
        class="form-control"
        style="border: 1px solid #1c3b6c; border-radius: 4px; padding: 8px 12px; height: 40px;"
      >
    </div>
  </div>
  
  <div class="col-md-6">
    <div class="form-group">
      <label style="color: #1c3b6c; font-weight: 500;">Fecha de Fin:</label>
      <input 
        type="date" 
        v-model="fechaFin" 
        class="form-control"
        style="border: 1px solid #1c3b6c; border-radius: 4px; padding: 8px 12px; height: 40px;"
      >
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
        <h4 class="d-inline-block ml-3" style="color: #1c3b6c;">Pagos Pendientes</h4>
      </div>
      
      <!-- Add this new section for applied filters -->
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
            fuentePDF: 'ISAAC II'
          }"
        >
          <!-- Custom column rendering for Branch -->
          <template slot="BranchesId" slot-scope="{row}">
            {{ getRegionalAbr(row.BranchesId) }}
          </template>
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
        fechaInicio: '',
        fechaFin: '',
        branchesId: null,
        regions: [
          { id: 2, abr: 'TJA' },
          { id: 3, abr: 'CBB' },
          { id: 16, abr: 'SCZ' },
          { id: 17, abr: 'LPZ' },
          { id: 18, abr: 'EPC' },
          { id: 22, abr: 'TEO' },
          { id: 23, abr: 'SUC' },
          { id: 24, abr: 'ORU' }
        ],
        propsToSearch: [
          'Cod_Proyecto',
          'Nombre_Proyecto',
          'Cod_Modulo',
          'Nombre_Modulo',
          'Docente',
          'Fecha_Inicio',
          'Fecha_Fin'
        ],
        tableColumns: [
          {
            prop: 'BranchesId',
            label: 'Sede',
            minWidth: 15,
            render: (h, { row }) => {
              return h('span', this.getRegionalAbr(row.BranchesId));
            }
          },
          {
            prop: 'Cod_Proyecto',
            label: 'Código Proyecto',
            minWidth: 25
          },
          {
            prop: 'Nombre_Proyecto',
            label: 'Nombre Proyecto',
            minWidth: 80
          },
          {
            prop: 'Cod_Modulo',
            label: 'Código Módulo',
            minWidth: 35
          },
          {
            prop: 'Nombre_Modulo',
            label: 'Nombre Módulo',
            minWidth: 90
          },
          {
            prop: 'Docente',
            label: 'Docente',
            minWidth: 90
          },
          {
            prop: 'Horas',
            label: 'Horas',
            minWidth: 20,
            align: 'right'
          },
          {
            prop: 'MontoHora',
            label: 'Monto Hora',
            minWidth: 25,
            align: 'right',
            formatter: this.formatCurrency
          },
          {
            prop: 'Total',
            label: 'Total a Pagar',
            minWidth: 35,
            align: 'right',
            formatter: this.formatCurrency
          },
          {
            prop: 'Fecha_Inicio',
            label: 'Fecha Inicio',
            minWidth: 60
          },
          {
            prop: 'Fecha_Fin',
            label: 'Fecha Fin',
            minWidth: 60
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
      let url = '/ProjectModules/PagosPendientes';
      const params = [];
      
      if (this.fechaInicio) {
        params.push(`fechaInicioFiltro=${this.fechaInicio}`);
      }
      
      if (this.fechaFin) {
        params.push(`fechaFinFiltro=${this.fechaFin}`);
      }
      
      if (this.branchesId) {
        params.push(`branchesId=${this.branchesId}`); 
      }
      
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }
      
      return url;
    },
    selectedFilters() {
    const filters = [];
    
    if (this.branchesId) {
      const region = this.regions.find(r => r.id === this.branchesId);
      if (region) {
        filters.push({ label: 'Sede', value: region.abr });
      }
    }
    
    if (this.fechaInicio) {
      filters.push({ label: 'Fecha Inicio', value: this.fechaInicio });
    }
    
    if (this.fechaFin) {
      filters.push({ label: 'Fecha Fin', value: this.fechaFin });
    }
    
    return filters;
  }
  },
    methods: {
        getRegionalAbr(id) {
      const region = this.regions.find(r => r.id === id);
      console.log(region);
      return region.abr;
    },
      applyFilters() {
        this.filtersApplied = true;
      },
      resetFilters() {
        this.filtersApplied = false;
        this.fechaInicio = '';
        this.fechaFin = '';
      },
      formatCurrency(value) {
        if (!value) return ''
        return new Intl.NumberFormat('es-BO', {
          style: 'currency',
          currency: 'BOB'
        }).format(value)
      }
    }
  }
  </script>
  
  <style scoped>
  .padding-0 {
    padding-right: 0;
    padding-left: 0;
  }
  .card {
    margin-top: 20px;
    border-radius: 6px;
  }
  .btn-info {
    background-color: #1c3b6c;
    border-color: #1c3b6c;
  }
  .btn-info:hover {
    background-color: #0d2a5a;
    border-color: #0d2a5a;
  }
  .form-control:focus {
    border-color: #1c3b6c;
    box-shadow: 0 0 0 0.2rem rgba(28, 59, 108, 0.25);
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