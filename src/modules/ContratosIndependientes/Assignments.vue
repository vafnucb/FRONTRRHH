<template>
  <div>
    <!-- Floating button to open batch list -->
    <button 
      class="btn btn-warning btn-fab btn-fab-mini floating-batch-btn"
      @click="showBatchModal = true"
      title="Ver procesos anteriores">
      <i class="fa fa-folder-open"></i>
    </button>

    <!-- Batch List Modal -->
    <batch-list-modal
      :show.sync="showBatchModal"
      @load-proceso="loadExistingProceso">
    </batch-list-modal>

    <div class="row">
      <div class="col-md-12">
        <div class="card card-wizard" id="wizardCard">
          <form-wizard
            ref="wizard"
            @on-complete="wizardComplete"
            error-color="#D32F2F"
            color="#FFA000"
            title="Carga masiva de asignaciones"
            subtitle="Asignaciones de docentes por sede y período"
          >
            <!-- PASO 1: CONFIGURACIÓN -->
            <tab-content
              title="Configuración"
              icon="fa fa-cogs"
              :before-change="validateConfigStep"
            >
              <config-step ref="configStep" />
            </tab-content>

            <!-- PASO 2: CARGAR ARCHIVO Y ASIGNAR CONTRATOS -->
            <tab-content
              title="Cargar archivo y asignar contratos"
              icon="fa fa-file-excel-o"
              :before-change="validateUploadStep"
            >
              <upload-and-assign-step ref="uploadStep" />
            </tab-content>

            <!-- Botones del wizard -->
            <button slot="prev" class="btn btn-default btn-fill btn-wd btn-back">
              Atrás
            </button>
            <button slot="next" class="btn btn-info btn-fill btn-wd btn-next">
              Siguiente
            </button>
            <!-- Custom finish button -->
<template slot="finish">
  <button 
    type="button"
    class="btn btn-warning btn-fill btn-wd"
    :disabled="procesoFinalizado"
    :title="procesoFinalizado ? 'Este proceso ya está finalizado' : ''"
    @click.prevent="wizardComplete">
    Finalizar
  </button>
</template>
          </form-wizard>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FormWizard, TabContent } from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import axios from 'axios'
import { MessageBox } from 'element-ui'

import ConfigStep from './Steps/ConfigStep.vue'
import UploadAndAssignStep from './Steps/UploadAndAssignStep.vue'
import BatchListModal from './Components/BatchListModal.vue'

export default {
  name: 'AsignacionesMasivas',
  components: {
    FormWizard,
    TabContent,
    ConfigStep,
    UploadAndAssignStep,
    BatchListModal
  },
  data () {
    return {
      showBatchModal: false
    }
  },
  computed: {
  procesoFinalizado () {
    const state = this.$store.state.asig && this.$store.state.asig.State
    return state === 'FINALIZADO'
  }
},
  methods: {
  validateConfigStep () {
    if (this.$refs.configStep && this.$refs.configStep.validate) {
      return this.$refs.configStep.validate()
    }
    return true
  },

  validateUploadStep () {
    if (this.$refs.uploadStep && this.$refs.uploadStep.canContinue) {
      return this.$refs.uploadStep.canContinue()
    }
    return true
  },

  loadExistingProceso (proceso) {
  console.log('Loading proceso:', proceso)
  
  this.$store.commit('asig/setSede', {
    id: proceso.BranchesId,
    nombre: proceso.SedeNombre,
    abr: proceso.SedeAbr
  })
  
  this.$store.commit('asig/setPeriodo', {
    id: proceso.PeriodoId,
    nombre: proceso.PeriodoId
  })

  // Store the proceso state
  this.$store.commit('asig/setState', proceso.State)

  if (this.$refs.uploadStep) {
    this.$refs.uploadStep.fileId = proceso.Id
    this.$refs.uploadStep.fileUploaded = true
    this.$refs.uploadStep.loadTableData()
  }

  this.$refs.wizard.changeTab(0, 1)
  this.$message.success(`Proceso #${proceso.Id} cargado correctamente`)
},

  wizardComplete () {
    // Validate we have a process
    console.log('wizardComplete called')
    if (!this.$refs.uploadStep || !this.$refs.uploadStep.fileId) {
      this.$message.error('No hay un proceso activo para finalizar')
      return false  // IMPORTANT: Return false to prevent wizard navigation
    }

    const fileId = this.$refs.uploadStep.fileId
    console.log('FileId:', fileId)

    // Show loading
    this.$store.commit('crud/loadSetter', true)
    console.log('Loading started')

    // Call validation endpoint
    axios.post(`/AsignacionesMasivas/ValidarFinalizacion/${fileId}`, {}, {
      headers: {
        token: localStorage.getItem('token')
      }
    })
      .then(response => {
        console.log('Validation response:', response.data)
        this.$store.commit('crud/loadSetter', false)
        const validacion = response.data

        if (!validacion.IsValid) {
          // Show validation errors
          this.mostrarErroresValidacion(validacion)
        } else {
          // All valid - show confirmation using MessageBox
          this.confirmarFinalizacion(fileId)
        }
      })
      .catch(error => {
        this.$store.commit('crud/loadSetter', false)
        console.error('Error validando proceso:', error)
        this.$message.error('Error al validar el proceso. Intente nuevamente.')
      })

    return false  // IMPORTANT: Prevent wizard from navigating
  },

  mostrarErroresValidacion (validacion) {
    // Build error message text (not HTML)
    let errorMessage = 'No se puede finalizar el proceso:\n\n'

    if (validacion.AsignacionesSinContrato && validacion.AsignacionesSinContrato.length > 0) {
      errorMessage += `❌ ${validacion.AsignacionesSinContrato.length} asignación(es) sin número de contrato\n`
    }

    if (validacion.ContratosDuplicados && validacion.ContratosDuplicados.length > 0) {
      errorMessage += `❌ ${validacion.ContratosDuplicados.length} contrato(s) duplicado(s)\n`
      validacion.ContratosDuplicados.forEach(dup => {
        errorMessage += `   • ${dup.NumeroContrato}. No se puede asignar el mismo numero de contrato para la misma persona en la misma sede y periodo\n`
      })
    }

    MessageBox.alert(errorMessage, 'Errores de validación', {
        confirmButtonText: 'Entendido',
        type: 'error',
        center: false
      })
  },

  confirmarFinalizacion (fileId) {
    // Use MessageBox confirm (same pattern as delete)
    MessageBox.confirm(
      'Esta acción creará los contratos oficiales en el sistema y no se puede deshacer. ¿Está seguro de continuar?',
      '¿Finalizar proceso?',
      {
        confirmButtonText: 'Sí, finalizar',
        cancelButtonText: 'Cancelar',
        type: 'warning',
        center: true
      }
    ).then(() => {
      // User confirmed - proceed
      this.finalizarProceso(fileId)
    }).catch(() => {
      // User cancelled
      console.log('Finalización cancelada por el usuario')
    })
  },

  finalizarProceso (fileId) {
    this.$store.commit('crud/loadSetter', true)

    axios.post(`/AsignacionesMasivas/FinalizarProceso/${fileId}`, {}, {
      headers: {
        token: localStorage.getItem('token')
      }
    })
      .then(response => {
        this.$store.commit('crud/loadSetter', false)
        const result = response.data

        // Show success message
        const mensaje = `Proceso finalizado exitosamente\n\n` +
                       `✓ ${result.TotalAsignaciones} asignación(es)\n` +
                       `✓ ${result.TotalContratos} contrato(s) creado(s)`

        MessageBox.alert(mensaje, '¡Éxito!', {
          confirmButtonText: 'Aceptar',
          type: 'success',
          center: true
        }).then(() => {
          // Reload page
          window.location.reload()
        })
      })
      .catch(error => {
        this.$store.commit('crud/loadSetter', false)
        console.error('Error finalizando proceso:', error)

        const data = error.response && error.response.data
        let errorMsg = 'No se pudo finalizar el proceso.'

        if (data && data.Message) {
          errorMsg = data.Message
        }

        if (data && data.Errors && data.Errors.length > 0) {
          errorMsg += '\n\n' + data.Errors.join('\n')
        }

        MessageBox.alert(errorMsg, 'Error', {
          confirmButtonText: 'Entendido',
          type: 'error',
          center: false
        })
      })
  }
}
}
</script>

<style>
.vue-form-wizard .wizard-icon-circle.tab_shape {
  width: 100%;
  min-width: 100px;
  height: 40px;
  border: none;
  background-color: #1c3b6c;
  color: #fff;
  border-radius: 0;
}

.stepTitle {
  color: #1c3b6c;
}

/* Floating button */
.floating-batch-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.floating-batch-btn:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
  transform: scale(1.1);
}

.btn-fab-mini {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  padding: 0;
  font-size: 20px;
}
</style>
  