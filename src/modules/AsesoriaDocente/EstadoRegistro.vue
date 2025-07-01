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
              <table class="table table-bordered table-sm">
                <tbody>
                  <tr><th>ID</th><td>{{ detail.Id }}</td></tr>
                  <tr><th>Estado</th><td>{{ detail.Estado }}</td></tr>
                  <tr><th>Origen</th><td>{{ detail.Origen }}</td></tr>
                  <tr><th>Docente</th><td>{{ detail.TeacherFullName }}</td></tr>
                  <tr><th>Estudiante</th><td>{{ detail.StudentFullName }}</td></tr>
                  <tr><th>Carrera</th><td>{{ detail.Carrera }}</td></tr>
                  <tr><th>Total Bruto</th><td>{{ detail.TotalBruto }}</td></tr>
                  <tr><th>Total Neto</th><td>{{ detail.TotalNeto }}</td></tr>
                  <tr><th>Última modificación</th><td>{{ detail.UpdatedAt }}</td></tr>
                </tbody>
              </table>
              <button class="btn btn-warning btn-fill btn-wd" @click="showWizard = false">Volver al Historial</button>
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
        propsToSearch: ['Id', 'TeacherFullName', 'StudentFullName', 'Estado', 'Carrera'],
        tableColumns: [
          { prop: 'Id', label: '#', minWidth: 50 },
          { prop: 'Origen', label: 'Origen', minWidth: 60 },
          { prop: 'Carrera', label: 'Carrera', minWidth: 80 },
          { prop: 'TeacherFullName', label: 'Docente', minWidth: 200 },
          { prop: 'StudentFullName', label: 'Estudiante', minWidth: 200 },
          { prop: 'Estado', label: 'Estado', minWidth: 100 },
          { prop: 'TotalBruto', label: 'Total Bruto', minWidth: 90 },
          { prop: 'TotalNeto', label: 'Total Neto', minWidth: 90 },
          { prop: 'UpdatedAt', label: 'Último cambio', minWidth: 150, formatter: row => row.UpdatedAt ? `${String(new Date(row.UpdatedAt).getDate()).padStart(2, '0')}/${String(new Date(row.UpdatedAt).getMonth() + 1).padStart(2, '0')}/${new Date(row.UpdatedAt).getFullYear()} ${String(new Date(row.UpdatedAt).getHours()).padStart(2, '0')}:${String(new Date(row.UpdatedAt).getMinutes()).padStart(2, '0')}` : '' }
        ],
        pagination: { perPage: 10, currentPage: 1, perPageOptions: [10, 20, 50], total: 0 },
        showWizard: false,
        detail: {}
      }
    },
    methods: {
      initWizard (id) {
        axios.get(`/AsesoriaDocente/${id}`).then(response => {
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
  </style>