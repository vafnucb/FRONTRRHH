<template>
    <el-dialog
      :visible.sync="dialogVisible"
      title="Detalle del Contrato"
      width="80%"
      :modal-append-to-body="true"
      :append-to-body="true"
      custom-class="centered-dialog"
      @close="onClose">
      
      <div v-loading="loading">
        <div v-if="contrato" class="detail-container">
          <!-- Contract Header Info -->
          <div class="contract-header">
            <div class="row">
              <div class="col-md-3">
                <label>N° Contrato:</label>
                <p class="contract-number">{{ contrato.NumeroContrato }}</p>
              </div>
              <div class="col-md-3">
                <label>Docente:</label>
                <p><strong>{{ contrato.NombreDocente }}</strong></p>
              </div>
              <div class="col-md-2">
                <label>Sede:</label>
                <p>{{ contrato.SedeNombre }} ({{ contrato.SedeAbr }})</p>
              </div>
              <div class="col-md-2">
                <label>Período:</label>
                <p>{{ contrato.PeriodoId }}</p>
              </div>
              <div class="col-md-2">
                <label>Estado:</label>
                <p>
                  <span :class="getEstadoBadgeClass(contrato.Estado)">
                    {{ contrato.Estado }}
                  </span>
                </p>
              </div>
            </div>
            
            <div class="row" style="margin-top: 15px;">
              <div class="col-md-3">
                <label>Monto Total:</label>
                <p class="monto-total">Bs. {{ formatMoney(contrato.MontoTotal) }}</p>
              </div>
              <div class="col-md-3">
                <label>Total Asignaciones:</label>
                <p><strong>{{ asignaciones.length }}</strong></p>
              </div>
              <div class="col-md-6">
                <label>Fecha Creación:</label>
                <p>{{ formatDate(contrato.CreatedAt) }}</p>
              </div>
            </div>
  
            <div class="row" v-if="contrato.Observaciones">
              <div class="col-md-12">
                <label>Observaciones:</label>
                <pre class="observaciones-box">{{ contrato.Observaciones }}</pre>
              </div>
            </div>
          </div>
  
          <hr>
  
          <!-- Assignments Table -->
          <h5 class="section-title">
            <i class="fa fa-list"></i> Asignaciones ({{ asignaciones.length }})
          </h5>
  
          <div class="table-wrapper">
            <el-table
              :data="paginatedAsignaciones"
              border
              style="width: 100%"
              :default-sort="{ prop: 'Sigla', order: 'ascending' }">
  
              <el-table-column
                type="index"
                label="#"
                width="50"
                align="center">
              </el-table-column>
  
              <el-table-column
                prop="CiDocente"
                label="CI"
                width="100">
              </el-table-column>
  
              <el-table-column
                prop="NombreCompleto"
                label="Docente"
                min-width="180">
              </el-table-column>
  
              <el-table-column
                prop="Sigla"
                label="Sigla"
                width="100"
                sortable>
              </el-table-column>

              <el-table-column
                prop="NombreMateria"
                label="Materia"
                min-width="100">
              </el-table-column>
  
              <el-table-column
                prop="Paralelo"
                label="Paralelo"
                width="80"
                align="center">
              </el-table-column>
  
              <el-table-column
                prop="CodigoParalelo"
                label="Cód. Paralelo"
                width="120">
              </el-table-column>
  
              <el-table-column
                label="Horas/Sem"
                width="100"
                align="right">
                <template slot-scope="scope">
                  {{ scope.row.HorasSemana.toFixed(2) }}
                </template>
              </el-table-column>
  
              <el-table-column
                label="Horas/Mes"
                width="100"
                align="right">
                <template slot-scope="scope">
                  {{ scope.row.HorasMes.toFixed(2) }}
                </template>
              </el-table-column>
  
              <el-table-column
                label="Costo/Hora"
                width="110"
                align="right">
                <template slot-scope="scope">
                  Bs. {{ scope.row.CostoHora.toFixed(2) }}
                </template>
              </el-table-column>

              <el-table-column
                prop="CantidadMeses"
                label="Meses"
                width="100">
              </el-table-column>
  
              <el-table-column
                label="Monto Total"
                width="130"
                align="right">
                <template slot-scope="scope">
                  <strong>Bs. {{ formatMoney(scope.row.MontoTotal) }}</strong>
                </template>
              </el-table-column>
  
              <el-table-column
                prop="UnidadOrganizacional"
                label="Unidad Organizacional"
                min-width="150">
              </el-table-column>
            </el-table>
  
            <!-- Pagination for assignments -->
            <div class="row" style="margin-top: 15px;" v-if="asignaciones.length > perPage">
              <div class="col-md-6">
                <p class="text-muted">
                  Mostrando {{ fromRecord }} a {{ toRecord }} de {{ asignaciones.length }} asignación(es)
                </p>
              </div>
              <div class="col-md-6">
                <el-pagination
                  @current-change="handlePageChange"
                  :current-page="currentPage"
                  :page-size="perPage"
                  :total="asignaciones.length"
                  layout="prev, pager, next"
                  class="pull-right">
                </el-pagination>
              </div>
            </div>
          </div>
  
          <!-- Summary -->
          <div class="summary-box">
            <div class="row">
              <div class="col-md-4">
                <label>Total Asignaciones:</label>
                <p><strong>{{ asignaciones.length }}</strong></p>
              </div>
              <div class="col-md-4">
                <label>Total Horas/Mes:</label>
                <p><strong>{{ totalHorasMes.toFixed(2) }}</strong></p>
              </div>
              <div class="col-md-4">
                <label>Monto Total del Contrato:</label>
                <p class="monto-total">Bs. {{ formatMoney(totalMontoAsignaciones) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <span slot="footer" class="dialog-footer">
        <button type="button" class="btn btn-default" @click="onClose">
          Cerrar
        </button>
      </span>
    </el-dialog>
  </template>
  
  <script>
  import axios from 'axios'
  import { Dialog, Table, TableColumn, Pagination, Message } from 'element-ui'
  
  export default {
    name: 'ContratoDetailModal',
    components: {
      'el-dialog': Dialog,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-pagination': Pagination
    },
    props: {
      show: {
        type: Boolean,
        default: false
      },
      contratoId: {
        type: Number,
        default: null
      }
    },
    data () {
      return {
        loading: false,
        contrato: null,
        asignaciones: [],
        currentPage: 1,
        perPage: 10
      }
    },
    computed: {
      dialogVisible: {
        get () {
          return this.show
        },
        set (val) {
          this.$emit('update:show', val)
        }
      },
      
      paginatedAsignaciones () {
        const start = (this.currentPage - 1) * this.perPage
        const end = start + this.perPage
        return this.asignaciones.slice(start, end)
      },
      
      fromRecord () {
        if (this.asignaciones.length === 0) return 0
        return (this.currentPage - 1) * this.perPage + 1
      },
      
      toRecord () {
        const to = this.currentPage * this.perPage
        return Math.min(to, this.asignaciones.length)
      },
      
      totalHorasMes () {
        return this.asignaciones.reduce((sum, a) => sum + (a.HorasMes || 0), 0)
      },
      
      totalMontoAsignaciones () {
        return this.asignaciones.reduce((sum, a) => sum + (a.MontoTotal || 0), 0)
      }
    },
    watch: {
      show (newVal) {
        if (newVal && this.contratoId) {
          this.loadDetalle()
        }
      }
    },
    methods: {
      loadDetalle () {
        this.loading = true
        
        axios.get(`/AsigContratos/GetDetalle/${this.contratoId}`, {
          headers: {
            token: localStorage.getItem('token')
          }
        })
          .then(response => {
            this.contrato = response.data.Contrato
            this.asignaciones = response.data.Asignaciones || []
            this.currentPage = 1
            this.loading = false
          })
          .catch(error => {
            console.error('Error cargando detalle:', error)
            Message({
              message: 'Error al cargar el detalle del contrato',
              type: 'error',
              duration: 3000
            })
            this.loading = false
            this.onClose()
          })
      },
      
      handlePageChange (page) {
        this.currentPage = page
      },
      
      formatDate (dateStr) {
        if (!dateStr) return '-'
        const date = new Date(dateStr)
        return date.toLocaleString('es-BO')
      },
      
      formatMoney (amount) {
        if (!amount) return '0.00'
        return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      },
      
      getEstadoBadgeClass (estado) {
        const classes = {
          'PENDIENTE': 'label label-warning',
          'APROBADO': 'label label-info',
          'PAGADO': 'label label-success',
          'CANCELADO': 'label label-danger'
        }
        return classes[estado] || 'label label-default'
      },
      
      onClose () {
        this.dialogVisible = false
        this.contrato = null
        this.asignaciones = []
        this.currentPage = 1
      }
    }
  }
  </script>
  
  <style scoped>
  .detail-container {
    padding: 10px;
  }
  
  .contract-header {
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
  }
  
  .contract-number {
    font-size: 20px;
    font-weight: 700;
    color: #2196F3;
    margin: 0;
  }
  
  .monto-total {
    font-size: 18px;
    font-weight: 700;
    color: #4CAF50;
    margin: 0;
  }
  
  .section-title {
    color: #2196F3;
    border-bottom: 2px solid #2196F3;
    padding-bottom: 5px;
    margin-bottom: 15px;
    margin-top: 10px;
    font-size: 16px;
    font-weight: 600;
  }
  
  .section-title i {
    margin-right: 8px;
  }
  
  .row {
    margin-bottom: 10px;
  }
  
  label {
    font-weight: 600;
    color: #666;
    display: block;
    margin-bottom: 3px;
    font-size: 12px;
    text-transform: uppercase;
  }
  
  p {
    margin: 0;
    padding: 5px 0;
    color: #333;
  }
  
  .observaciones-box {
    background-color: #fff;
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 4px;
    white-space: pre-wrap;
    word-wrap: break-word;
    max-height: 100px;
    overflow-y: auto;
    font-size: 12px;
    margin: 0;
  }
  
  .label {
    padding: 4px 8px;
    border-radius: 3px;
    font-size: 11px;
    font-weight: 600;
  }
  
  .label-warning {
    background-color: #FFA000;
    color: white;
  }
  
  .label-success {
    background-color: #4CAF50;
    color: white;
  }
  
  .label-danger {
    background-color: #F44336;
    color: white;
  }
  
  .label-info {
    background-color: #2196F3;
    color: white;
  }
  
  .label-default {
    background-color: #999;
    color: white;
  }
  
  hr {
    margin: 20px 0;
    border-top: 1px solid #eee;
  }
  
  .table-wrapper {
    margin-top: 15px;
  }
  
  .summary-box {
    background-color: #e8f5e9;
    border: 2px solid #4CAF50;
    padding: 20px;
    border-radius: 8px;
    margin-top: 20px;
  }
  
  .summary-box label {
    color: #2e7d32;
  }
  
  .summary-box p {
    font-size: 16px;
  }
  
  .text-muted {
    color: #999;
    font-size: 13px;
  }
  </style>
  
  <style>
  .centered-dialog {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .centered-dialog .el-dialog {
    margin: 0 !important;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
  }
  
  .centered-dialog .el-dialog__body {
    flex: 1;
    overflow-y: auto;
  }
  </style>