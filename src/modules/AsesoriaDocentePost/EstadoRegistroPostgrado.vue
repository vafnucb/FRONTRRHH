<template>
    <div class="row">
      <div class="col-md-12 card">
        <template v-if="!showWizard">
          <data-tables v-bind="{ url, propsToSearch, tableColumns, pagination, fuentePDF: 'ISAAC POSTGRADO' }">
            <template slot="buttons" slot-scope="props">
              <el-tooltip class="item" effect="dark" content="Ver Detalles" placement="top-start">
                <a class="btn btn-simple btn-xs btn-icon btn-info" @click="initWizard(props.queriedData[props.index].Id)"><i class="ti-eye"></i></a>
              </el-tooltip>
            </template>
          </data-tables>
        </template>
        <template v-else>
  <div class="row">
    <div class="form-group col-md-12" style="margin-top: 25px">
  <div class="panel-body">
    <!-- First Row: Id, Origen, Estado, Ultima Modificacion -->
    <div class="row">
      <div class="col-md-3">
        <div class="form-group">
          <label>ID</label>
          <div class="form-control form-control-static data-box">{{ detail.Id }}</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="form-group">
          <label>Origen</label>
          <div class="form-control form-control-static data-box">{{ detail.Origen }}</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="form-group">
          <label>Estado</label>
          <div class="form-control form-control-static data-box">{{ detail.Estado }}</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="form-group">
          <label>Última modificación</label>
          <div class="form-control form-control-static data-box">{{ detail.UpdatedAt }}</div>
        </div>
      </div>
    </div>
    
    <!-- Second Row: Proyecto and Modulo -->
    <div class="row">
      <div class="col-md-6">
        <div class="form-group">
          <label>Proyecto</label>
          <div class="form-control form-control-static data-box">{{ detail.NombreProyecto }}</div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group">
          <label>Módulo</label>
          <div class="form-control form-control-static data-box">{{ detail.NombreModulo }}</div>
        </div>
      </div>
    </div>
    
    <!-- Third Row: Docente, Tarea, NumeroContrato -->
    <div class="row">
      <div class="col-md-4">
        <div class="form-group">
          <label>Docente</label>
          <div class="form-control form-control-static data-box">{{ detail.TeacherFullName }}</div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="form-group">
          <label>Tarea</label>
          <div class="form-control form-control-static data-box">{{ detail.Tarea }}</div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="form-group">
          <label>Número de Contrato</label>
          <div class="form-control form-control-static data-box">{{ detail.NumeroContrato }}</div>
        </div>
      </div>
    </div>
    
    <!-- Fourth Row: TotalNeto, TotalBruto, and tax boxes -->
    <div class="row">
      <div class="col-md-2">
        <div class="form-group">
          <label>Total Neto</label>
          <div class="form-control form-control-static data-box">{{ detail.TotalNeto }}</div>
        </div>
      </div>
      <div class="col-md-2">
        <div class="form-group">
          <label>Total Bruto</label>
          <div class="form-control form-control-static data-box">{{ detail.TotalBruto }}</div>
        </div>
      </div>
      <div class="col-md-8">
        <div class="row">
          <div class="col-md-3">
            <div class="form-group">
              <label>IT</label>
              <div class="form-control form-control-static data-box small-box">{{ detail.IT }}</div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group">
              <label>RS-IVA</label>
              <div class="form-control form-control-static data-box small-box">{{ detail.IUE }}</div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group">
              <label>Deducción</label>
              <div class="form-control form-control-static data-box small-box">{{ detail.Deduccion }}</div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group">
              <label>IUE Exterior</label>
              <div class="form-control form-control-static data-box small-box">{{ detail.IUEExterior }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Fifth Row: Observaciones and Estudiante -->
    <div class="row">
      <div class="col-md-8">
        <div class="form-group">
          <label>Observaciones</label>
          <div class="form-control form-control-static data-box">{{ detail.Observaciones }}</div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="form-group">
          <label>Estudiante</label>
          <div class="form-control form-control-static data-box">{{ detail.StudentFullName }}</div>
        </div>
      </div>
    </div>
    
    <!-- Button Row -->
    <div class="row">
      <div class="col-md-12 text-center" style="margin-top: 30px">
        <button class="btn btn-warning btn-fill btn-wd" @click="showWizard = false">Volver al Historial</button>
      </div>
    </div>
  </div>
</div>
  </div>
</template>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    data () {
      return {
        url: '/AsesoriaPostgrado/Estado',
        propsToSearch: ['Id', 'Estado', 'Proyecto', 'Modulo', 'UpdatedAt', 'TotalNeto', 'TotalBruto'],
        tableColumns: [
          { prop: 'Id', label: '#', minWidth: 50 },
          { prop: 'Origen', label: 'Origen', minWidth: 70 },
          { prop: 'Proyecto', label: 'Proyecto', minWidth: 90 },
          { prop: 'Modulo', label: 'Módulo', minWidth: 90 },
          { prop: 'Estado', label: 'Estado', minWidth: 100 },
          { prop: 'Horas', label: 'Horas', minWidth: 70 },
          { prop: 'MontoHora', label: 'Monto Horas', minWidth: 70 },
          { prop: 'TotalBruto', label: 'Total Bruto', minWidth: 100 },
          { prop: 'TotalNeto', label: 'Total Neto', minWidth: 100 },
          { prop: 'UpdatedAt', label: 'Última modificación', minWidth: 150 }
        ],
        pagination: {
          perPage: 10,
          currentPage: 1,
          perPageOptions: [10, 20, 50],
          total: 0
        },
        showWizard: false,
        detail: {}
      }
    },
    methods: {
      initWizard (id) {
        axios.get(`/AsesoriaPostgrado/Estado?=${id}`).then(response => {
          this.detail = response.data
          this.showWizard = true
        }).catch(error => {
          console.error('Error fetching detail:', error)
        })
      }
    }
  }
  </script>
  
  
  <style>
  .padding-0 { padding-right: 0; padding-left: 0; }
   /* Thick black borders for all cells */
   .table-bordered, 
    .table-bordered th, 
    .table-bordered td {
        border: 2px solid #000 !important;
    }
    .table-bordered {
        border-collapse: collapse !important;
    }

    /* Zebra-striping (alternating row colors) */
    .table-bordered tr:nth-child(odd) {
        background-color: #f8f9fa; /* Light gray for odd rows */
    }
    .table-bordered tr:nth-child(even) {
        background-color: #ffffff; /* White for even rows */
    }

    
    .table-bordered tr:hover {
        background-color: #d1e7ff !important; 
    }
    .data-box {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 6px 12px;
  min-height: 38px;
  display: flex;
  align-items: center;
  box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
  cursor: default;
}

  </style>
  
  
  