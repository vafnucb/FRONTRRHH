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
                <table class="table table-bordered table-sm">
                    <tr><th>ID</th><td>{{ detail.Id }}</td></tr>
                    <tr><th>Estado</th><td>{{ detail.Estado }}</td></tr>
                    <tr><th>Proyecto</th><td>{{ detail.Proyecto }}</td></tr>
                    <tr><th>Módulo</th><td>{{ detail.Modulo }}</td></tr>
                    <tr><th>Horas</th><td>{{ detail.Horas }}</td></tr>
                    <tr><th>Monto por Hora</th><td>{{ detail.MontoHora }}</td></tr>
                    <tr><th>Total Bruto</th><td>{{ detail.TotalBruto }}</td></tr>
                    <tr><th>Total Neto</th><td>{{ detail.TotalNeto }}</td></tr>
                    <tr><th>Última modificación</th><td>{{ detail.UpdatedAt }}</td></tr>
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
        axios.get(`/AsesoriaPostgrado/${id}`).then(response => {
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

  </style>
  
  
  