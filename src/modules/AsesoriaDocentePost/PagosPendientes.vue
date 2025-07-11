<template>
    <div class="row">
      <div class="col-md-12 card">
        <data-tables 
          v-bind="{
            url: '/ProjectModules/PagosPendientes',
            propsToSearch,
            tableColumns,
            pagination,
            fuentePDF: 'ISAAC II'
          }"
        >
          
        </data-tables>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
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
            minWidth: 25
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
            minWidth: 15,
            align: 'right',
            formatter: this.formatCurrency
          },
          {
            prop: 'Total',
            label: 'Total a Pagar',
            minWidth: 25,
            align: 'right',
            formatter: this.formatCurrency
          },
          {
            prop: 'Fecha_Inicio',
            label: 'Fecha Inicio',
            minWidth: 30
          },
          {
            prop: 'Fecha_Fin',
            label: 'Fecha Fin',
            minWidth: 30
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
    methods: {
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
  </style>