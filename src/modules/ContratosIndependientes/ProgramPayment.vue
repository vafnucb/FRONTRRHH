<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <div class="card card-wizard">
          <div class="card-header">
            <h4 class="card-title">Programar Pagos por Asignación</h4>
            <p class="card-category">Configure los meses de pago para las asignaciones de una sede y período</p>
          </div>

          <div class="card-content">
            <!-- STEP INDICATOR -->
            <div class="wizard-steps">
              <div class="step" :class="{ active: currentStep === 1, completed: currentStep > 1 }">
                <div class="step-number">1</div>
                <div class="step-label">Sede y Período</div>
              </div>
              <div class="step-line" :class="{ completed: currentStep > 1 }"></div>
              <div class="step" :class="{ active: currentStep === 2, completed: currentStep > 2 }">
                <div class="step-number">2</div>
                <div class="step-label">Meses de Pago</div>
              </div>
              <div class="step-line" :class="{ completed: currentStep > 2 }"></div>
              <div class="step" :class="{ active: currentStep === 3, completed: currentStep > 3 }">
                <div class="step-number">3</div>
                <div class="step-label">Revisar Asignaciones</div>
              </div>
              <div class="step-line" :class="{ completed: currentStep > 3 }"></div>
              <div class="step" :class="{ active: currentStep === 4 }">
                <div class="step-number">4</div>
                <div class="step-label">Confirmar</div>
              </div>
            </div>

            <!-- ADD THIS NEW SECTION - PERSISTENT CONTEXT -->
            <div v-if="currentStep > 1" class="context-header">
              <div class="context-item">
                <i class="fa fa-building"></i>
                <div>
                  <div class="context-label">Sede</div>
                  <div class="context-value">{{ sedeNombre }}</div>
                </div>
              </div>

              <div class="context-divider"></div>

              <div class="context-item">
                <i class="fa fa-calendar"></i>
                <div>
                  <div class="context-label">Período Académico</div>
                  <div class="context-value">{{ form.periodoId }}</div>
                </div>
              </div>

              <div class="context-divider"></div>

              <div class="context-item">
                <i class="fa fa-clock-o"></i>
                <div>
                  <div class="context-label">Fecha Actual</div>
                  <div class="context-value">{{ currentDate }}</div>
                </div>
              </div>
            </div>

            <!-- STEP 1: SELECT BRANCH + PERIOD -->
            <div v-if="currentStep === 1" class="step-content">
              <h5 class="text-center">Paso 1: Seleccionar Sede y Período</h5>

              <div class="row" style="margin-top: 30px;">
                <div class="col-md-6 col-md-offset-3">
                  <div class="form-group">
                    <label>Sede <span class="text-danger">*</span></label>
                    <el-select v-model="form.branchesId" placeholder="Seleccionar sede" class="full-width">
                      <el-option v-for="branch in branches" :key="branch.Id" :value="branch.Id" :label="branch.Name">
                      </el-option>
                    </el-select>
                  </div>

                  <div class="form-group">
                    <label>Período <span class="text-danger">*</span></label>
                    <el-select v-model="form.periodoId" placeholder="Seleccionar período" class="full-width">
                      <el-option v-for="periodo in periodos" :key="periodo.Value" :value="periodo.Value"
                        :label="periodo.Name">
                      </el-option>
                    </el-select>
                  </div>

                  <div class="text-center" style="margin-top: 30px;">
                    <button class="btn btn-info btn-fill" :disabled="!canContinueStep1" @click="goToStep2">
                      Continuar
                      <i class="fa fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- STEP 2: CONFIGURE MONTHS -->
            <div v-if="currentStep === 2" class="step-content">
              <h5 class="text-center">Paso 2: Configurar Meses de Pago</h5>

              <div class="row" style="margin-top: 30px;">
                <div class="col-md-8 col-md-offset-2">

                  <!-- NAME & DESCRIPTION -->
                  <div class="form-group">
                    <label>Nombre del servicio <span style="color: red;">*</span></label>
                    <input type="text" class="form-control" v-model="form.nombrePlantilla"
                      @input="form.nombrePlantilla = $event.target.value.toUpperCase()" placeholder="Ej: DOC TH 2026"
                      maxlength="45" required>
                    <small class="text-muted">
                      {{ form.nombrePlantilla.length }}/45 caracteres
                    </small>
                    <small class="help-block" v-if="form.nombrePlantilla.trim() === ''" style="color: #d9534f;">
                      Este campo es obligatorio
                    </small>
                  </div>


                  <!-- MONTH PICKER -->
                  <div class="form-group">
                    <label>Meses de pago <span class="text-danger">*</span></label>
                    <p class="help-block">
                      <i class="fa fa-info-circle"></i>
                      Los pagos se programaran para ser efectivos en los meses seleccionados
                    </p>
                    <month-picker v-model="form.meses" @update="updateMeses">
                    </month-picker>
                  </div>

                  <!-- SELECTED MONTHS TABLE -->
                  <div v-if="form.meses.length > 0" class="selected-months-table">
                    <table class="table table-bordered">
                      <thead>
                        <tr>
                          <th width="10%">Orden</th>
                          <th width="30%">Mes / Año</th>
                          <th width="25%">% Pago</th>
                          <th width="25%">Descripción</th>
                          <th width="10%">Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(mes, index) in form.meses" :key="index">
                          <td class="text-center">{{ index + 1 }}°</td>
                          <td>{{ getMonthName(mes.Mes) }} {{ mes.Anio }}</td>
                          <td>
                            <input type="number" class="form-control input-sm" v-model.number="mes.PorcentajePorDefecto"
                              step="0.01" min="0" max="100">
                            %
                          </td>
                          <td>
                            <input type="text" class="form-control input-sm" v-model="mes.Descripcion"
                              placeholder="Ej: Primer pago">
                          </td>
                          <td class="text-center">
                            <button class="btn btn-danger btn-xs btn-simple" @click="removeMes(index)">
                              <i class="fa fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colspan="2" class="text-right"><strong>Total:</strong></td>
                          <td><strong>{{ totalPercentage.toFixed(2) }}%</strong></td>
                          <td colspan="2">
                            <span v-if="totalPercentage !== 100" class="text-danger">
                              <i class="fa fa-exclamation-triangle"></i>
                              Debe sumar 100%
                            </span>
                            <span v-else class="text-success">
                              <i class="fa fa-check"></i>
                              Correcto
                            </span>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <!-- BUTTONS -->
                  <div class="text-center" style="margin-top: 30px;">
                    <button class="btn btn-default" @click="currentStep = 1">
                      <i class="fa fa-arrow-left"></i>
                      Atrás
                    </button>
                    <button class="btn btn-info btn-fill" :disabled="!canContinueStep2" @click="goToStep3"
                      style="margin-left: 10px;">
                      Continuar
                      <i class="fa fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- STEP 3: REVIEW ASSIGNMENTS -->
            <div v-if="currentStep === 3" class="step-content">
              <h5 class="text-center">Paso 3: Revisar Asignaciones</h5>

              <div class="row" style="margin-top: 30px;">
                <div class="col-md-10 col-md-offset-1">

                  <!-- SUMMARY -->
                  <div class="summary-stats">
                    <div class="stat-item">
                      <i class="fa fa-file-text"></i>
                      <div>
                        <div class="stat-value">{{ asignacionesSummary.total }}</div>
                        <div class="stat-label">Asignaciones</div>
                      </div>
                    </div>
                    <div class="stat-item">
                      <i class="fa fa-dollar"></i>
                      <div>
                        <div class="stat-value">Bs. {{ formatMoney(asignacionesSummary.montoTotal) }}</div>
                        <div class="stat-label">Monto Total</div>
                      </div>
                    </div>
                    <div class="stat-item">
                      <i class="fa fa-calendar"></i>
                      <div>
                        <div class="stat-value">{{ form.meses.length }}</div>
                        <div class="stat-label">Meses de Pago</div>
                      </div>
                    </div>
                    <div class="stat-item">
                      <i class="fa fa-list"></i>
                      <div>
                        <div class="stat-value">{{ asignacionesSummary.total * form.meses.length }}</div>
                        <div class="stat-label">Pagos a Generar</div>
                      </div>
                    </div>
                  </div>

                  <!-- SEARCH -->
                  <div class="row" style="margin-top: 20px; margin-bottom: 15px;">
                    <div class="col-md-6">
                      <input type="search" class="form-control" placeholder="Buscar por CI, nombre, contrato..."
                        v-model="searchAsignaciones">
                    </div>
                    <div class="col-md-6 text-right">
                      <button class="btn btn-default btn-sm" @click="expandAll">
                        <i class="fa fa-expand"></i> Expandir Todo
                      </button>
                      <button class="btn btn-default btn-sm" @click="collapseAll" style="margin-left: 5px;">
                        <i class="fa fa-compress"></i> Contraer Todo
                      </button>
                    </div>
                  </div>

                  <!-- ASSIGNMENTS TABLE -->
                  <div class="assignments-table">
                    <table class="table table-bordered table-hover">
                      <thead>
                        <tr>
                          <th width="5%">
                            <input type="checkbox" @change="toggleSelectAll" :checked="allSelected">
                          </th>
                          <th width="10%">CI</th>
                          <th width="25%">Docente</th>
                          <th width="10%">Materia</th>
                          <th width="15%">Contrato</th>
                          <th width="12%" class="text-right">Monto Total</th>
                          <th width="8%" class="text-center">Pagos</th>
                          <th width="10%" class="text-center">Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        <template v-for="(asig, index) in filteredAsignaciones">
                          <!-- Main Row -->
                          <tr :key="'asig-' + asig.Id" :class="{ 'warning-row': asig.TienePagosProgramados }">
                            <td class="text-center">
                              <input type="checkbox" :value="asig.Id" v-model="selectedAsignaciones"
                                :disabled="asig.TienePagosProgramados">
                            </td>
                            <td>{{ asig.CiDocente }}</td>
                            <td>
                              {{ asig.NombreCompleto }}
                              <span v-if="asig.TienePagosProgramados" class="label label-warning"
                                style="margin-left: 5px;">
                                Ya programado
                              </span>
                            </td>
                            <td>{{ asig.Sigla }} - {{ asig.Paralelo }}</td>
                            <td>{{ asig.NumeroContrato }}</td>
                            <td class="text-right"><strong>Bs. {{ formatMoney(asig.MontoTotal) }}</strong></td>
                            <td class="text-center">
                              <button class="btn btn-xs btn-info btn-simple" @click="toggleExpand(asig.Id)"
                                :disabled="asig.TienePagosProgramados">
                                <i :class="isExpanded(asig.Id) ? 'fa fa-chevron-up' : 'fa fa-chevron-down'"></i>
                              </button>
                            </td>
                            <td class="text-center">
                              <button class="btn btn-xs btn-warning btn-simple" @click="openExcepcionModal(asig)"
                                :disabled="asig.TienePagosProgramados"
                                :title="asig.TienePagosProgramados ? 'Ya tiene pagos programados' : 'Programación personalizada'">
                                <i class="fa fa-edit"></i>
                              </button>
                            </td>
                          </tr>

                          <!-- Expanded Detail Row -->
                          <tr v-if="isExpanded(asig.Id)" :key="'detail-' + asig.Id" class="detail-row">
                            <td colspan="8">
                              <div class="payment-details">
                                <strong>Pagos calculados:</strong>
                                <table class="table table-sm table-striped" style="margin-top: 10px; margin-bottom: 0;">
                                  <thead>
                                    <tr>
                                      <th>Orden</th>
                                      <th>Mes / Año</th>
                                      <th>%</th>
                                      <th class="text-right">Monto</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr v-for="pago in calculatePayments(asig)" :key="pago.orden">
                                      <td>{{ pago.orden }}°</td>
                                      <td>{{ getMonthName(pago.mes) }} {{ pago.anio }}</td>
                                      <td>{{ pago.porcentaje.toFixed(2) }}%</td>
                                      <td class="text-right">Bs. {{ formatMoney(pago.monto) }}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        </template>
                      </tbody>
                    </table>

                    <!-- Empty State -->
                    <div v-if="filteredAsignaciones.length === 0" class="text-center" style="padding: 40px;">
                      <i class="fa fa-search" style="font-size: 48px; color: #ccc;"></i>
                      <p style="margin-top: 15px; color: #999;">
                        No se encontraron asignaciones
                      </p>
                    </div>
                  </div>

                  <!-- BUTTONS -->
                  <div class="text-center" style="margin-top: 30px;">
                    <button class="btn btn-default" @click="currentStep = 2">
                      <i class="fa fa-arrow-left"></i>
                      Atrás
                    </button>
                    <button class="btn btn-info btn-fill" :disabled="selectedAsignaciones.length === 0"
                      @click="goToStep4" style="margin-left: 10px;">
                      Continuar ({{ selectedAsignaciones.length }} seleccionadas)
                      <i class="fa fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- STEP 4: CONFIRM -->
            <div v-if="currentStep === 4" class="step-content">
              <h5 class="text-center">Paso 4: Confirmar y Generar Pagos</h5>

              <div class="row" style="margin-top: 30px;">
                <div class="col-md-8 col-md-offset-2">

                  <!-- SUMMARY -->
                  <div class="summary-box">
                    <h6><i class="fa fa-info-circle"></i> Resumen</h6>
                    <hr>
                    <div class="row">
                      <div class="col-md-6">
                        <p><strong>Sede:</strong> {{ sedeNombre }}</p>
                        <p><strong>Período:</strong> {{ form.periodoId }}</p>
                        <p><strong>Meses de pago (estándar):</strong> {{ form.meses.length }}</p>
                      </div>
                      <div class="col-md-6">
                        <p><strong>Asignaciones:</strong> {{ selectedAsignaciones.length }}</p>
                        <p><strong>Excepciones:</strong> {{ excepciones.length }}</p>
                        <p><strong>Pagos a generar:</strong> {{ totalPagosReales }}</p>                   
                      </div>
                    </div>

                    <div v-if="form.meses.length > 0" style="margin-top: 20px;">
                      <strong>Calendario de pagos estándar:</strong>
                      <ul style="margin-top: 10px;">
                        <li v-for="(mes, index) in form.meses" :key="index">
                          <strong>{{ getMonthName(mes.Mes) }} {{ mes.Anio }}</strong> -
                          {{ mes.PorcentajePorDefecto.toFixed(2) }}%
                          <span v-if="mes.Descripcion" class="text-muted">
                            - {{ mes.Descripcion }}
                          </span>
                        </li>
                      </ul>
                    </div>

                    <!-- NEW: Show exceptions summary -->
                    <div v-if="excepciones.length > 0" style="margin-top: 20px;">
                      <strong>Excepciones configuradas:</strong>
                      <ul style="margin-top: 10px;">
                        <li v-for="exc in excepciones" :key="exc.AsignacionId">
                          <strong>{{ getAsignacionNombre(exc.AsignacionId) }}</strong> -
                          {{ exc.PagosCustom.length }} pago(s) personalizado(s)
                        </li>
                      </ul>
                    </div>
                  </div>

                  <!-- WARNING -->
                  <div class="alert alert-warning" style="margin-top: 20px;">
                    <i class="fa fa-exclamation-triangle"></i>
                    <strong>Importante:</strong> Esta acción generará
                    <strong>{{ totalPagosReales }}</strong>
                    pagos programados. Si ya existen pagos para estas asignaciones, serán reemplazados.
                  </div>

                  <!-- BUTTONS -->
                  <div class="text-center" style="margin-top: 30px;">
                    <button class="btn btn-default" @click="backToStep2">
                      <i class="fa fa-arrow-left"></i>
                      Atrás
                    </button>
                    <button class="btn btn-info btn-fill" :disabled="selectedAsignaciones.length === 0"
                    @click="confirmarGeneracion" style="margin-left: 10px;" type="button">
                      Continuar ({{ selectedAsignaciones.length }} seleccionadas)
                      <i class="fa fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Exception Modal -->
    <excepcion-modal :show.sync="showExcepcionModal" :asignacion="currentAsignacion" :meses-default="form.meses"
      @save="saveExcepcion">
    </excepcion-modal>
  </div>
</template>

<script>
import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import MonthPicker from './Components/MonthPicker.vue'
import ExcepcionModal from './Components/ExcepcionModal.vue'

export default {
  name: 'ProgramarPagosAsignaciones',
  components: {
    MonthPicker,
    ExcepcionModal
  },
  data () {
    return {
      currentStep: 1,
      loading: false,
      searchAsignaciones: '',
      expandedRows: [],
      selectedAsignaciones: [],
      excepciones: [],
      showExcepcionModal: false,
      currentAsignacion: null,
      
      form: {
        branchesId: null,
        periodoId: null,
        nombrePlantilla: '',
        descripcion: '',
        // esPlantilla: false,
        meses: []
      },
      
      branches: [],
      periodos: [],
      asignaciones: [],
      asignacionesSummary: {
        total: 0,
        montoTotal: 0
      }
    }
  },
  
  computed: {
    canContinueStep1 () {
      return this.form.branchesId && this.form.periodoId
    },
    
    canContinueStep2 () {
      return this.form.meses.length > 0 && this.totalPercentage === 100 && this.form.nombrePlantilla.trim() !== ''
    },
    
    sedeNombre () {
      const branch = this.branches.find(b => b.Id === this.form.branchesId)
      return branch ? branch.Name : ''
    },

    currentDate () {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    const now = new Date()
    const day = now.getDate()
    const month = months[now.getMonth()]
    const year = now.getFullYear()
    return `${day} de ${month} de ${year}`
  },
    
    totalPercentage () {
      return this.form.meses.reduce((sum, m) => sum + (m.PorcentajePorDefecto || 0), 0)
    },
    
    filteredAsignaciones () {
      if (!this.searchAsignaciones) {
        return this.asignaciones
      }
      
      const query = this.searchAsignaciones.toUpperCase().trim()
      return this.asignaciones.filter(a => {
        return (
          (a.CiDocente && a.CiDocente.toUpperCase().includes(query)) ||
          (a.NombreCompleto && a.NombreCompleto.toUpperCase().includes(query)) ||
          (a.NumeroContrato && a.NumeroContrato.toUpperCase().includes(query)) ||
          (a.Sigla && a.Sigla.toUpperCase().includes(query))
        )
      })
    },

    totalPagosReales () {
    let total = 0
    
    this.selectedAsignaciones.forEach(asigId => {
      const excepcion = this.excepciones.find(e => e.AsignacionId === asigId)
      
      if (excepcion && excepcion.PagosCustom) {
        // Exception: count custom payments
        total += excepcion.PagosCustom.length
      } else {
        // Standard: count default months
        total += this.form.meses.length
      }
    })
    
    return total
  },
    
    allSelected () {
      const selectableAsignaciones = this.filteredAsignaciones.filter(a => !a.TienePagosProgramados)
      if (selectableAsignaciones.length === 0) return false
      return selectableAsignaciones.every(a => this.selectedAsignaciones.includes(a.Id))
    }
  },
  
  methods: {
    loadBranches () {
      axios.get('/branches/', {
        headers: { token: localStorage.getItem('token') }
      })
        .then(response => {
          this.branches = response.data || []
        })
    },
    getAsignacionNombre (asigId) {
    const asig = this.asignaciones.find(a => a.Id === asigId)
    return asig ? asig.NombreCompleto : `ID ${asigId}`
  },
    
    loadPeriodos () {
      axios.get('/AsignacionesMasivas/Periodos/', {
        headers: { token: localStorage.getItem('token') }
      })
        .then(response => {
          this.periodos = response.data || []
        })
    },
    
    goToStep2 () {
      this.currentStep = 2
    },
    
    goToStep3 () {
  if (this.form.meses.length === 0) {
    Message({
      message: 'Debe configurar al menos un mes de pago estándar',
      type: 'warning',
      duration: 3000
    })
    return
  }
  
  // Clear exceptions when months configuration changes
  if (this.excepciones.length > 0) {
    this.excepciones = []
    Message({
      message: 'Configuración de meses actualizada. Las excepciones anteriores fueron eliminadas.',
      type: 'info',
      duration: 3000
    })
  }
  
  this.currentStep = 3
  this.loadAsignaciones()
},
    
    goToStep4 () {
      this.currentStep = 4
    },
    
    loadAsignaciones () {
      this.loading = true
      
      axios.get('/ProgramacionPagos/GetAsignacionesParaProgramar', {
        params: {
          branchesId: this.form.branchesId,
          periodoId: this.form.periodoId
        },
        headers: { token: localStorage.getItem('token') }
      })
        .then(response => {
          this.asignaciones = response.data.Asignaciones || []
          this.asignacionesSummary.total = response.data.Total || 0
          this.asignacionesSummary.montoTotal = response.data.MontoTotal || 0
          
          // Auto-select all that don't have payments
          this.selectedAsignaciones = this.asignaciones
            .filter(a => !a.TienePagosProgramados)
            .map(a => a.Id)
          
          this.loading = false
        })
        .catch(error => {
          console.error('Error:', error)
          this.$message.error('No se pudieron cargar las asignaciones')
          this.loading = false
        })
    },
    backToStep2 () {
    // Show confirmation if there are exceptions
    if (this.excepciones.length > 0) {
      MessageBox.confirm(
        `Si regresa al paso 2 para modificar los meses, se perderán ${this.excepciones.length} excepción(es) configurada(s). ¿Desea continuar?`,
        'Confirmar',
        {
          confirmButtonText: 'Sí, regresar',
          cancelButtonText: 'Cancelar',
          type: 'warning'
        }
      ).then(() => {
        this.excepciones = [] // Clear all exceptions
        this.currentStep = 2
        Message({
          message: 'Excepciones eliminadas. Configure nuevamente los meses de pago.',
          type: 'info',
          duration: 3000
        })
      }).catch(() => {
        console.log('Cancelado')
      })
    } else {
      // No exceptions, just go back
      this.currentStep = 2
    }
  },
    updateMeses (meses) {
      this.form.meses = meses
      if (meses.length > 0) {
        this.distributePercentagesEqually()
      }
    },
    
    distributePercentagesEqually () {
      const percentage = 100 / this.form.meses.length
      this.form.meses.forEach((mes, index) => {
        mes.PorcentajePorDefecto = parseFloat(percentage.toFixed(2))
        mes.Descripcion = mes.Descripcion || this.getOrdinalName(index + 1)
      })
      
      const total = this.form.meses.reduce((sum, m) => sum + m.PorcentajePorDefecto, 0)
      if (total !== 100 && this.form.meses.length > 0) {
        this.form.meses[this.form.meses.length - 1].PorcentajePorDefecto += (100 - total)
      }
    },
    
    removeMes (index) {
      this.form.meses.splice(index, 1)
      if (this.form.meses.length > 0) {
        this.distributePercentagesEqually()
      }
    },
    
    calculatePayments (asignacion) {
      // Check if this assignment has exception
      const excepcion = this.excepciones.find(e => e.AsignacionId === asignacion.Id)
      
      if (excepcion) {
        // Custom payments
        return excepcion.PagosCustom.map((p, index) => ({
          orden: index + 1,
          mes: p.Mes,
          anio: p.Anio,
          monto: p.Monto,
          porcentaje: (p.Monto / asignacion.MontoTotal) * 100
        }))
      }
      
      // Standard payments with precise calculation
      const total = asignacion.MontoTotal
      const count = this.form.meses.length
      
      // Calculate per-payment (floor to 2 decimals)
      const perPayment = Math.floor((total / count) * 100) / 100
      const remainder = total - (perPayment * count)
      
      return this.form.meses.map((mes, index) => {
        const isLast = index === count - 1
        const monto = isLast ? perPayment + remainder : perPayment
        
        return {
          orden: mes.Orden,
          mes: mes.Mes,
          anio: mes.Anio,
          monto: monto,
          porcentaje: mes.PorcentajePorDefecto
        }
      })
    },
    
    toggleExpand (asigId) {
      const index = this.expandedRows.indexOf(asigId)
      if (index > -1) {
        this.expandedRows.splice(index, 1)
      } else {
        this.expandedRows.push(asigId)
      }
    },
    
    isExpanded (asigId) {
      return this.expandedRows.includes(asigId)
    },
    
    expandAll () {
      this.expandedRows = this.filteredAsignaciones.map(a => a.Id)
    },
    
    collapseAll () {
      this.expandedRows = []
    },
    
    toggleSelectAll () {
      const selectableAsignaciones = this.filteredAsignaciones.filter(a => !a.TienePagosProgramados)
      
      if (this.allSelected) {
        // Deselect all
        selectableAsignaciones.forEach(a => {
          const index = this.selectedAsignaciones.indexOf(a.Id)
          if (index > -1) {
            this.selectedAsignaciones.splice(index, 1)
          }
        })
      } else {
        // Select all
        selectableAsignaciones.forEach(a => {
          if (!this.selectedAsignaciones.includes(a.Id)) {
            this.selectedAsignaciones.push(a.Id)
          }
        })
      }
    },
    
    openExcepcionModal (asignacion) {
      this.currentAsignacion = asignacion
      this.showExcepcionModal = true
    },
    
    saveExcepcion (excepcion) {
      // Remove old exception if exists
      const index = this.excepciones.findIndex(e => e.AsignacionId === excepcion.AsignacionId)
      if (index > -1) {
        this.excepciones.splice(index, 1)
      }
      
      // Add new exception
      if (excepcion.PagosCustom && excepcion.PagosCustom.length > 0) {
        this.excepciones.push(excepcion)
        this.$message.success('Excepción guardada')
      }
    },
    
    confirmarGeneracion () {
      const totalPagos = this.totalPagosReales
      
      MessageBox.confirm(
        `¿Está seguro de generar ${totalPagos} pagos programados para ${this.selectedAsignaciones.length} asignaciones?`,
        'Confirmar generación',
        {
          confirmButtonText: 'Sí, generar',
          cancelButtonText: 'Cancelar',
          type: 'warning'
        }
      ).then(() => {
        this.generarPagos()
      }).catch(() => {
        console.log('Generación cancelada')
      })
    },
    
    generarPagos () {
      this.loading = true
      
      // Step 1: Create schedule
      const schedulePayload = {
        BranchesId: this.form.branchesId,
        PeriodoId: this.form.periodoId,
        NombrePlantilla: this.form.nombrePlantilla,
        Descripcion: this.form.descripcion,
        // EsPlantilla: this.form.esPlantilla,
        Meses: this.form.meses.map((m, index) => ({
          Mes: m.Mes,
          Anio: m.Anio,
          Orden: index + 1,
          PorcentajePorDefecto: m.PorcentajePorDefecto,
          Descripcion: m.Descripcion
        }))
      }
      
      axios.post('/ProgramacionPagos/CrearProgramacion', schedulePayload, {
        headers: { token: localStorage.getItem('token') }
      })
        .then(response => {
          const programacionId = response.data.ProgramacionId
          
          // Step 2: Generate payments
          const generatePayload = {
            ProgramacionId: programacionId,
            AsignacionesIds: this.selectedAsignaciones,
            Excepciones: this.excepciones
          }
          
          return axios.post('/ProgramacionPagos/GenerarPagosAsignaciones', generatePayload, {
            headers: { token: localStorage.getItem('token') }
          })
        })
        .then(response => {
          this.loading = false
          
          MessageBox.alert(
            `Se generaron ${response.data.TotalPagosGenerados} pagos correctamente para ${response.data.TotalAsignaciones} asignaciones.`,
            '¡Éxito!',
            {
              confirmButtonText: 'Ver pagos',
              type: 'success'
            }
          ).then(() => {
            this.$router.push('/PagosPlanificados')
          })
        })
        .catch(error => {
          this.loading = false
          console.error('Error:', error)
          
          const msg = error.response && error.response.data && error.response.data.Message
            ? error.response.data.Message
            : 'No se pudieron generar los pagos'
          
          this.$message.error(msg)
        })
    },
    
    formatMoney (amount) {
      if (!amount) return '0.00'
      return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    
    getMonthName (mes) {
      const meses = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                     'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
      return mes >= 1 && mes <= 12 ? meses[mes] : ''
    },
    
    getOrdinalName (num) {
      const ordinals = {
        1: 'Primer pago',
        2: 'Segundo pago',
        3: 'Tercer pago',
        4: 'Cuarto pago',
        5: 'Quinto pago'
      }
      return ordinals[num] || `${num}° pago`
    }
  },
  
  created () {
    this.loadBranches()
    this.loadPeriodos()
  }
}
</script>

<style scoped>
/* Context Header */
.context-header {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 15px 20px;
  border-radius: 8px;
  margin: 20px 0;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.context-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.context-item i {
  font-size: 24px;
  opacity: 0.9;
}

.context-label {
  font-size: 11px;
  text-transform: uppercase;
  opacity: 0.8;
  letter-spacing: 0.5px;
}

.context-value {
  font-size: 16px;
  font-weight: 600;
  margin-top: 2px;
}

.context-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.3);
  margin: 0 30px;
}

/* Responsive */
@media (max-width: 768px) {
  .context-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .context-divider {
    width: 60%;
    height: 1px;
    margin: 0;
  }
}
.wizard-steps {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
  padding: 20px 0;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #ddd;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 8px;
  transition: all 0.3s;
}

.step.active .step-number {
  background: #1c3b6c;
  color: white;
}

.step.completed .step-number {
  background: #5cb85c;
  color: white;
}

.step-label {
  font-size: 12px;
  color: #999;
  text-align: center;
}

.step.active .step-label {
  color: #1c3b6c;
  font-weight: bold;
}

.step-line {
  width: 80px;
  height: 2px;
  background: #ddd;
  margin: 0 15px;
  margin-bottom: 28px;
  transition: all 0.3s;
}

.step-line.completed {
  background: #5cb85c;
}

.step-content {
  min-height: 400px;
}

.full-width {
  width: 100%;
}

.selected-months-table {
  margin-top: 20px;
}

.summary-box {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.summary-box h6 {
  margin-top: 0;
  color: #1c3b6c;
}

.summary-stats {
  display: flex;
  justify-content: space-around;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.stat-item {
  flex: 1;
  min-width: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  border-radius: 8px;
  color: white;
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-item i {
  font-size: 32px;
  opacity: 0.8;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
}

.stat-label {
  font-size: 12px;
  text-transform: uppercase;
  opacity: 0.9;
}

.assignments-table {
  margin-top: 20px;
  max-height: 500px;
  overflow-y: auto;
}

.detail-row {
  background: #f9f9f9;
}

.payment-details {
  padding: 15px;
}

.warning-row {
  background-color: #fcf8e3 !important;
}
</style>
  