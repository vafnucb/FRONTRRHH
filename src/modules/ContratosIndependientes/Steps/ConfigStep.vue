<template>
    <div>
      <h5 class="text-center">PASO 1: Seleccionar Sede y Período Académico</h5>

      <div class="container custom-centered-row">
        <div class="row">

          <!-- SEDE -->
          <div class="col-md-6">
            <div class="form-group">
              <label class="control-label">Sede</label>
              <br>
              <el-select
                class="select-info"
                size="large"
                placeholder="Seleccionar sede"
                v-model="form.sedeId"
              >
                <el-option
                  v-for="option in selectBranches.values"
                  :key="option.Id"
                  :value="option.Id"
                  :label="option.Name"
                />
              </el-select>
              <small class="text-danger" v-if="fieldErrors.sede">
                {{ errors.sede }}
              </small>
            </div>
          </div>

          <!-- PERÍODO -->
          <div class="col-md-6">
            <div class="form-group">
              <label class="control-label">Período / Gestión</label>
              <br>
              <el-select
                class="select-info"
                size="large"
                placeholder="Seleccionar período"
                v-model="form.periodoId"
              >
                <el-option
                  v-for="option in selectPeriodos.values"
                  :key="option.Id"
                  :value="option.Value"
                  :label="option.Name"
                />
              </el-select>
              <small class="text-danger" v-if="fieldErrors.periodo">
                {{ errors.periodo }}
              </small>
            </div>
          </div>

        </div>
      </div>

      <!-- Resumen visual -->
      <div class="row" v-if="form.sedeId && form.periodoId">
        <div class="col-md-12 text-center">
          <p>
            <strong>Sede seleccionada:</strong> {{ sedeNombre }}<br>
            <strong>Período seleccionado:</strong> {{ periodoNombre }}
          </p>
        </div>
      </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ConfigStep',
  data () {
    return {
      form: {
        sedeId: null,
        periodoId: null
      },
      fieldErrors: {   // antes era "errors"
      sede: '',
      periodo: ''
      },
      selectBranches: {
        values: []
      },
      selectPeriodos: {
        values: []
      }
    }
  },
  computed: {
    sedeNombre () {
      const found = this.selectBranches.values.find(b => b.Id === this.form.sedeId)
      return found ? found.Name : ''
    },
    periodoNombre () {
      const found = this.selectPeriodos.values.find(p => p.Value === this.form.periodoId)
      return found ? found.Name : ''
    }
  },
  methods: {
    loadBranches () {
      axios.get('branches/')
        .then(res => {
          this.selectBranches.values = res.data
        })
    },
    loadPeriodos () {
      axios.get('AsignacionesMasivas/Periodos/')
        .then(res => {
          this.selectPeriodos.values = res.data
        })
    },
    validate () {
  this.errors.sede = ''
  this.errors.periodo = ''

  if (!this.form.sedeId) {
    this.errors.sede = 'Debe seleccionar una sede.'
  }
  if (!this.form.periodoId) {
    this.errors.periodo = 'Debe seleccionar un período.'
  }

  const valid = !this.errors.sede && !this.errors.periodo

  if (valid) {
    // Guardar id + nombre en Vuex
    this.$store.commit('asig/setSede', {
      id: this.form.sedeId,
      nombre: this.sedeNombre
    })
    this.$store.commit('asig/setPeriodo', {
      id: this.form.periodoId,        // aquí puede ser "1S2019"
      nombre: this.periodoNombre
    })

    console.log('ASIG STATE AFTER STEP 1:', this.$store.state.asig)
  }

  return valid
}


  },
  created () {
    this.loadBranches()
    this.loadPeriodos()
  }
}
</script>

  
  <style>
  .custom-centered-row {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  </style>
  