<template>
    <div class="row">
      <div class="col-md-12 card">
        <data-tables 
          v-bind="{
            url: '/ServContract/Search',
            propsToSearch,
            tableColumns,
            pagination,
            fuentePDF: 'SARAI'
          }"
        >
          <!-- Action buttons if needed -->
          <template slot="buttons" slot-scope="props">
            <el-tooltip class="item" effect="dark" content="Ver Detalles" placement="top-start">
              <a class="btn btn-simple btn-xs btn-icon btn-info" @click="viewDetails(props.queriedData[props.index].BatchId)">
                <i class="ti-eye"></i>
              </a>
            </el-tooltip>
          </template>
        </data-tables>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        propsToSearch: [
          'BatchId',
          'CardName',
          'OU',
          'PEI',
          'Memo',
          'LineMemo',
          'AssignedAccount'
        ],
        tableColumns: [
          { prop: 'BatchId', label: '# Lote', minWidth: 80 },
          { 
            prop: 'BranchesId', 
            label: 'Regional', 
            minWidth: 100,
            formatter: this.getRegionalName 
          },
          { 
            prop: 'BatchState', 
            label: 'Estado', 
            minWidth: 120,
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
          { prop: 'OU', label: 'U.O.', minWidth: 100 },
          { prop: 'PEI', label: 'PEI', minWidth: 100 },
          { prop: 'Memo', label: 'Servicio', minWidth: 200, showOverflowTooltip: true },
          { prop: 'LineMemo', label: 'Detalle', minWidth: 250, showOverflowTooltip: true },
          { prop: 'AssignedAccount', label: 'Cuenta', minWidth: 120 },
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
    methods: {
      getRegionalName(id) {
        const regionalMap = {
          3: 'CBB',
          22: 'TEO',
          2: 'TJA',
          17: 'LPZ',
          18: 'EPC',
          16: 'SCZ',
          6: 'UCE'
        }
        return regionalMap[id] || id
      },
      formatState(state) {
        switch (state) {
          case 'PendingApproval': return 'Pendiente'
          case 'INSAP': return 'En SAP'
          case 'Rejected': return 'Rechazado'
          default: return state
        }
      },
      getStateTagType(state) {
        switch (state) {
          case 'PendingApproval': return 'warning'
          case 'INSAP': return 'success'
          case 'Rejected': return 'danger'
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
  /* Add any custom styles here if needed */
  </style>