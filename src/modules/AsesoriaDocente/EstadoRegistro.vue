<template>
    <div class="row">
      <div class="col-md-12 card">
        <template v-if="!showWizard">
          <data-tables v-bind="{ url, propsToSearch, tableColumns, pagination, fuentePDF: 'ISAAC PREGRADO' }">
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
    <!-- First Row: Id, Origen, Estado -->
    <div class="row">
      <div class="col-md-1">
        <div class="form-group">
          <label>ID</label>
          <div class="form-control form-control-static data-box">{{ detail.Id }}</div>
        </div>
      </div>
      <div class="col-md-1">
        <div class="form-group">
          <label>Origen</label>
          <div class="form-control form-control-static data-box">{{ detail.Origen }}</div>
        </div>
      </div>
      <div class="col-md-2">
        <div class="form-group">
          <label>Estado</label>
          <div class="form-control form-control-static data-box">{{ detail.Estado }}</div>
        </div>
      </div>
      <div class="col-md-2">
        <div class="form-group">
          <label>Fecha De Creación</label>
          <div class="form-control form-control-static data-box">{{ detail.CreatedAt }}</div>
        </div>
      </div>
      <div class="col-md-2">
        <div class="form-group">
          <label>Usuario Creador</label>
          <div class="form-control form-control-static data-box">{{ detail.UserCreateName }}</div>
        </div>
      </div>
      <div class="col-md-2">
        <div class="form-group">
            <label>Última modificación</label>
            <div class="form-control form-control-static data-box">{{ detail.UpdatedAt }}</div>
        </div>
    </div>
      <div class="col-md-2">
        <div class="form-group">
          <label>Usuario modificador</label>
          <div class="form-control form-control-static data-box">{{ detail.UserUpdateName }}</div>
        </div>
      </div>
    </div>
    
    <!-- Second Row: Carrera, Docente, Estudiante -->
    <div class="row">
      <div class="col-md-4">
        <div class="form-group">
          <label>Carrera</label>
          <div class="form-control form-control-static data-box">{{ detail.Carrera }}</div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="form-group">
          <label>Docente</label>
          <div class="form-control form-control-static data-box">{{ detail.TeacherFullName }}</div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="form-group">
          <label>Estudiante</label>
          <div class="form-control form-control-static data-box">{{ detail.StudentFullName }}</div>
        </div>
      </div>
    </div>
    
    <!-- Third Row: Modalidad, Tarea, Contrato, Acta -->
    <div class="row">
      <div class="col-md-2">
        <div class="form-group">
          <label>Modalidad</label>
          <div class="form-control form-control-static data-box">{{ detail.Modalidad }}</div>
        </div>
      </div>
      <div class="col-md-2">
        <div class="form-group">
          <label>Tipo de Tarea</label>
          <div class="form-control form-control-static data-box">{{ detail.Tarea }}</div>
        </div>
      </div>
      <div class="col-md-2">
        <div class="form-group">
          <label>Contrato</label>
          <div class="form-control form-control-static data-box">{{ detail.NumeroContrato }}</div>
        </div>
      </div>
      <div class="col-md-2">
        <div class="form-group">
          <label>Acta</label>
          <div class="form-control form-control-static data-box">{{ detail.Acta }}</div>
        </div>
      </div>
      <div class="col-md-2">
        <div class="form-group">
          <label>Fecha Acta</label>
          <div class="form-control form-control-static data-box">{{ detail.ActaFecha }}</div>
        </div>
      </div>
      <div class="col-md-2">
      <div class="form-group">
        <label>Repetido?</label>
        <div class="form-control form-control-static data-box small-box">{{ detail.Factura ? 'Tiene' : 'No tiene' }}</div>
      </div>
    </div>
    </div>
    
    <!-- Fourth Row: TotalNeto, TotalBruto and tax boxes -->
    <div class="row">
    <div class="col-md-2">
        <div class="form-group">
            <label>Total Bruto</label>
            <div class="form-control form-control-static data-box small-box">{{ detail.TotalBruto }}</div>
        </div>
    </div>
    <div class="col-md-2">
        <div class="form-group">
            <label>Total Neto</label>
            <div class="form-control form-control-static data-box small-box">{{ detail.TotalNeto }}</div>
        </div>
    </div>
    <div class="col-md-2">
      <div class="form-group">
        <label>Factura</label>
        <div class="form-control form-control-static data-box small-box">{{ detail.Factura ? 'Tiene' : 'No tiene' }}</div>
      </div>
    </div>
    
    <div class="col-md-6">
        <div class="row">
            <div class="col-md-3">
                <div class="form-group">
                    <label>RC-IVA</label>
                    <div class="form-control form-control-static data-box small-box">{{ detail.IUE }}</div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="form-group">
                    <label>IT</label>
                    <div class="form-control form-control-static data-box small-box">{{ detail.IT }}</div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="form-group">
                    <label>IUE Exterior</label>
                    <div class="form-control form-control-static data-box small-box">{{ detail.IUEExterior }}</div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="form-group">
                    <label>Deducción</label>
                    <div class="form-control form-control-static data-box small-box">{{ detail.Deduccion }}</div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Fifth Row: Observaciones, Ultima Modificacion -->
<div class="row">
    <div class="col-md-8">
        <div class="form-group">
            <label>Observaciones</label>
            <div class="form-control form-control-static data-box text-wrap" style="margin-top: 10px; overflow-wrap: break-word; min-height: 50px; max-height: 100px; overflow-y: auto;">
                {{ detail.Observaciones }}
            </div>
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
        url: '/AsesoriaDocente/Estado',
        propsToSearch: ['Id', 'TeacherFullName', 'StudentFullName', 'Estado', 'Carrera', 'Origen'],
        tableColumns: [
          { prop: 'Id', label: '#', minWidth: 50 },
          { prop: 'Origen', label: 'Origen', minWidth: 60 },
          { prop: 'Carrera', label: 'Carrera', minWidth: 80 },
          { prop: 'TeacherFullName', label: 'Docente', minWidth: 200 },
          { prop: 'Tarea', label: 'Tarea', minWidth: 150 },
          { prop: 'StudentFullName', label: 'Estudiante', minWidth: 200 },
          { prop: 'Estado', label: 'Estado', minWidth: 100 },
          { prop: 'TotalBruto', label: 'Total Bruto', minWidth: 90 },
          { prop: 'TotalNeto', label: 'Total Neto', minWidth: 90 }
         // { prop: 'UpdatedAt', label: 'Último cambio', minWidth: 150, formatter: row => row.UpdatedAt ? `${String(new Date(row.UpdatedAt).getDate()).padStart(2, '0')}/${String(new Date(row.UpdatedAt).getMonth() + 1).padStart(2, '0')}/${new Date(row.UpdatedAt).getFullYear()} ${String(new Date(row.UpdatedAt).getHours()).padStart(2, '0')}:${String(new Date(row.UpdatedAt).getMinutes()).padStart(2, '0')}` : '' }
        ],
        pagination: { perPage: 10, currentPage: 1, perPageOptions: [10, 20, 50], total: 0 },
        showWizard: false,
        detail: {}
      }
    },
    methods: {
      initWizard (id) {
        axios.get(`/AsesoriaDocente/Estado?id=${id}`).then(response => {
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
  .custom-card { background-color: #f8f9fa; padding: 20px; }
  .input-search { width: 50%; margin: 0 auto 10px; padding: 10px; border: 1px solid #ced4da; border-radius: 5px; font-size: 18px; }
  .result-message, .no-results-message, .initial-message { font-size: 20px; color: #333; margin: 0; font-weight: bold; }
  .result-message { color: #28a745; }
  .no-results-message { color: #dc3545; }
  .table-bordered tbody tr td, .table-bordered tbody tr th { border: 1px solid #dee2e6; }
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