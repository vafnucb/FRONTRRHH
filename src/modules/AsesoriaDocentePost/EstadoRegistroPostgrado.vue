<template>
    <div class="row">
      <div class="col-md-12 card">
        <div class="col-md-12 padding-0">
          <data-tables
            v-bind="{ url, propsToSearch, tableColumns, pagination, fuentePDF: 'ISAAC POSTGRADO' }"
          >
          </data-tables>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data () {
      return {
        url: '/AsesoriaPostgrado/Estado',
        propsToSearch: ['Id', 'Estado', 'Proyecto', 'Modulo', 'CreatedAt'],
        tableColumns: [
          {
            prop: 'Id',
            label: '#',
            minWidth: 50
          },
          {
            prop: 'Proyecto',
            label: 'Proyecto',
            minWidth: 150
          },
          {
            prop: 'Modulo',
            label: 'Módulo',
            minWidth: 150
          },
          {
            prop: 'Estado',
            label: 'Estado',
            minWidth: 100
          },
          {
            prop: 'CreatedAt',
            label: 'Fecha de Creación',
            minWidth: 150
          }
        ],
        pagination: {
          perPage: 10,
          currentPage: 1,
          perPageOptions: [10, 20, 50],
          total: 0
        }
      }
    }
  }
  </script>
  
  <style>
  .padding-0 {
    padding-right: 0;
    padding-left: 0;
  }
  </style>
  
  