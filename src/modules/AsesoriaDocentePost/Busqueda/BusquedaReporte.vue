<template>
  <div v-if="!IsFetching" class="col-md-12">
    <div class="panel-body">
      <!--Proyecto-->
      <div class="row">
        <div class="form-group col-md-9 col-md-offset-2">
          <label>Proyecto</label>
          <div>
            <model-select class="select-info"
                          :options="projects"
                          @input="loadModulesUsedByProject"
                          v-model="busqProjects">
            </model-select>
          </div>
        </div>
      </div>
      <!--Modulo-->
      <div class="row">
        <div class="form-group col-md-9 col-md-offset-2">
          <label>Módulo</label>
          <div>
            <model-select class="select-info"
                          :options="modulos"
                          v-model="busqModules">
            </model-select>
          </div>
        </div>
      </div>
      <!--Docente-->
      <div class="row">
        <div class="form-group col-md-7 col-md-offset-2">
          <label>Docente</label>
          <model-select class="select-info"
                        :options="teachers"
                        v-model="busqTeacherCUNI"
          >
          </model-select>
        </div>
        <div class="form-group col-md-2">
          <label>Origen</label>
          <model-select class="select-info"
                        :options="origins"
                        v-model="busqOrigenQuery"
          >
          </model-select>
        </div>
      </div>
      <!--Tarea Mes Gestion-->
      <div class="row">
        <div class="form-group col-md-3 col-md-offset-2">
          <label>Tipo Tarea</label>
          <div>
            <model-select class="select-info"
                          :options="tipoTarea"
                          v-model="busqTarea">
            </model-select>
          </div>
        </div>
        <div class="form-group col-md-2 col-md-2">
          <label>Tipo Pago</label>
          <div>
            <model-select class="select-info"
                          :options="tipoPago"
                          v-model="busqTipoPago">
            </model-select>
          </div>
        </div>
        <div class="col-md-2">
          <label>Mes</label>
          <div>
            <model-select class="select-info"
                          :options="months"
                          v-model="busqMes">
            </model-select>
          </div>
        </div>
        <div class="col-md-2">
          <label >Gestión</label>
          <input type="text" style="text-transform: uppercase;" class="form-control textBox" v-model="busqGestion">

        </div>
      </div>
      <div class="row">
        <div class="form-group col-md-4 col-md-offset-2">
          <label>Importe Bruto</label>

          <!-- Slider para rango -->
          <vue-slider
            v-model="importeRange"
            :min="1"
            :max="25000"
            :interval="1"
            @drag-end="updateInputs"
          ></vue-slider>

          <!-- Inputs para valores exactos -->
          <div class="input-group mt-3">
            <div class="input-group-prepend">
              <span class="input-group-text">Mínimo</span>
            </div>
            <input type="number" min="0" class="form-control" v-model="importeMinExacto" @input="updateSlider">
          </div>

          <div class="input-group mt-3">
            <div class="input-group-prepend">
              <span class="input-group-text">Máximo</span>
            </div>
            <input type="number" min="0" class="form-control" v-model="importeMaxExacto" @input="updateSlider">
          </div>
        </div>

        <div class="form-group col-md-4 col-md-offset-1">
          <label>Importe Neto</label>

          <!-- Slider para rango -->
          <vue-slider
            v-model="importeRangeNeto"
            :min="1"
            :max="25000"
            :interval="1"
            @drag-end="updateInputsNeto"
          ></vue-slider>

          <!-- Inputs para valores exactos -->
          <div class="input-group mt-3">
            <div class="input-group-prepend">
              <span class="input-group-text">Mínimo</span>
            </div>
            <input type="number" min="0" class="form-control" v-model="importeMinExactoNeto" @input="updateSliderNeto">
          </div>

          <div class="input-group mt-3">
            <div class="input-group-prepend">
              <span class="input-group-text">Máximo</span>
            </div>
            <input type="number" min="0" class="form-control" v-model="importeMaxExactoNeto" @input="updateSliderNeto">
          </div>
        </div>
      </div>
      <!--Botón que envía la información del form-->
      <div class="row">
        <div class="form-group col-md-2 col-md-offset-4">
           <reporte :url="busqProjects + '/' + busqModules + '/' + busqTeacherCUNI + '/' + busqOrigenQuery + '/' + busqTarea + '/' + busqMes + '/' + busqGestion + '/' + importeMinExacto + '/' + importeMaxExacto + '/' + importeMinExactoNeto + '/' + importeMaxExactoNeto + '/' + busqTipoPago "></reporte>
        </div>
        <div class="col-md-2">
          <button class="btn btn-danger btn-fill" @click="cleanScreen()">Reset</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import 'vue2-datepicker/index.css'
  import 'vue2-datepicker/locale/es'
  import swal from 'sweetalert2'
  import { ModelSelect } from 'vue-search-select'
  import 'vue-form-wizard/dist/vue-form-wizard.min.css'
  import Reporte from './ReporteBusquedaAvanzada'
  import VueSlider from 'vue-slider-component'
  import 'vue-slider-component/theme/default.css'
  export default {
    components: {
      ModelSelect,
      Reporte,
      VueSlider
    },
    data: function () {
      return {
        importeRange: [1, 15000],
        importeRangeNeto: [1, 15000],
        months: [],
        origins: [],
        selectMes: [{Id: '01', Name: 'ENERO'},
            {Id: '02', Name: 'FEBRERO'},
            {Id: '03', Name: 'MARZO'},
            {Id: '04', Name: 'ABRIL'},
            {Id: '05', Name: 'MAYO'},
            {Id: '06', Name: 'JUNIO'},
            {Id: '07', Name: 'JULIO'},
            {Id: '08', Name: 'AGOSTO'},
            {Id: '09', Name: 'SEPTIEMBRE'},
            {Id: '10', Name: 'OCTUBRE'},
            {Id: '11', Name: 'NOVIEMBRE'},
            {Id: '12', Name: 'DICIEMBRE'}],
        selectOrigen: [{Id: '0', Name: 'TODOS'},
          {Id: '1', Name: 'DEPEN'},
          {Id: '2', Name: 'INDEP'},
          {Id: '3', Name: 'OR'},
          {Id: '4', Name: 'FAC'},
          {Id: '5', Name: 'EXT'}
        ],
        dependencyOptions: [],
        but: false,
        IsFetching: true,
        projects: [],
        modulos: [],
        tipoTarea: [],
        tipoPago: [],
        dependiente: true,
        or: false,
        teacherIdentifier: '',
        teacherArray: [],
        teachers: [],
        busqProjects: null,
        busqModules: null,
        busqTeacherCUNI: null,
        busqDependencyCod: null,
        busqStudent: null,
        busqMes: null,
        busqGestion: null,
        busqOrigen: 'DEPEN',
        busqModalidad: null,
        busqTarea: null,
        busqOrigenQuery: '0',
        importeMinExacto: 1,
        importeMaxExacto: 25000,
        importeMinExactoNeto: 1,
        importeMaxExactoNeto: 25000,
        busqTipoPago: null
      }
    },
    methods: {
      // --------------------------Para la validación antes del POST/PUT----------------------------
      isEmptyBlanckOrNull: function (val) {
        return !val || val.length === 0 || !val.toString().trim()
      },
      fakeLoad () {
        this.$store.commit('crud/loadSetter', true)
        setTimeout(() => {
          this.$store.commit('crud/loadSetter', false)
        }, 500)
      },
      updateSlider () {
        // Actualiza el valor del slider cuando cambian los inputs
        this.importeRange = [parseInt(this.importeMinExacto) || 0, parseInt(this.importeMaxExacto) || 0]
      },
      updateInputs () {
        // Actualiza los valores de los inputs cuando cambia el slider
        this.importeMinExacto = this.importeRange[0].toString()
        this.importeMaxExacto = this.importeRange[1].toString()
      },
      updateSliderNeto () {
        // Actualiza el valor del slider cuando cambian los inputs
        this.importeRangeNeto = [parseInt(this.importeMinExactoNeto) || 0, parseInt(this.importeMaxExactoNeto) || 0]
      },
      updateInputsNeto () {
        // Actualiza los valores de los inputs cuando cambia el slider
        this.importeMinExactoNeto = this.importeRangeNeto[0].toString()
        this.importeMaxExactoNeto = this.importeRangeNeto[1].toString()
      },
      loadTipoPago () {
        let tipop = this.tipoPago
        axios.get('TipoPago')
          .then(response => {
            response.data.forEach(function (element) {
              tipop.push({value: element.Id, text: element.Nombre})
            })
          })
          .catch(error => console.log(error + 'Im here cause I messed up'))
      },
      loadProjects () {
        let proyectos = this.projects
        axios.get('ProyectosUsed')
          .then(response => {
            console.log('Proyectos: si cargo')
            response.data.forEach(function (element) {
              proyectos.push({value: element.Cod, text: element.Cod + '-' + element.Name, BranchesId: element.BranchesId, Id: element.Id})
            })
          })
          .catch(error => console.log(error))
        this.IsFetching = false
      },
      loadModulesUsed () {
        let modulo = this.modulos
        axios.get('ModulesUsed')
          .then(response => {
            console.log('Modulos: si cargo')
            response.data.forEach(function (element) {
              modulo.push({value: element.Cod, text: element.CodAux + '-' + element.Cod + '-' + element.Name, Id: element.Id})
            })
          })
          .catch(error => console.log(error))
        this.IsFetching = false
      },
      loadModulesUsedByProject () {
        this.modulos = []
        let modulo = this.modulos
        axios.get('ModulesUsedByProject/' + this.busqProjects)
          .then(response => {
            console.log('Modulos por proyecto: si cargo')
            response.data.forEach(function (element) {
              modulo.push({value: element.Cod, text: element.CodAux + '-' + element.Cod + '-' + element.Name, Id: element.Id})
            })
          })
          .catch(error => console.log(error))
        this.IsFetching = false
      },
      loadMonth () {
        let month = this.months
        this.selectMes.forEach(function (element) {
          console.log('Mes: si cargo')
          month.push({value: element.Id, text: element.Name})
        })
      },
      loadOrigin () {
        let month = this.origins
        this.selectOrigen.forEach(function (element) {
          console.log('Origen: si cargo')
          month.push({value: element.Id, text: element.Name})
        })
      },
      convert (str) {
        let date = new Date(str)
        let mnth = ('0' + (date.getMonth() + 1)).slice(-2)
        let day = ('0' + date.getDate()).slice(-2)
        return [date.getFullYear(), mnth, day].join('-')
      },
      loadTeachers () {
        let teachers = this.teachers
        axios.get('DocentesListBusquedaPost')
            .then(response => {
              console.log('Teachers: si cargo')
              response.data.forEach(function (element) {
                // Se envío el BP como CUNI para que solo llegara un valor en el value, que se asignará después a teacherCUNI o teacherBP dependiendo de su origen
                teachers.push({value: element.FullName, text: element.Regional + '-' + element.FullName, name: element.FullName})
                // console.log('Terachers' + element.CUNI + '-' + element.FullName)
                // Creamos un array con los docentes dependientes
              })
              // console.log('el array de los profesores es:')
              // console.log(firstTeachers)
            })
            .catch(error => console.log(error))
        this.IsFetching = false
      },
      loadTipoTarea () {
        let tipot = this.tipoTarea
        axios.get('TipoTarea')
          .then(response => {
            console.log('Tarea: si cargo')
            response.data.forEach(function (element) {
              tipot.push({value: element.Id, text: element.Tarea})
            })
          })
          .catch(error => console.log(error + 'Im here cause I messed up'))
      },
      cleanScreen () {
        // este método limpia la pantalla
        this.busqProjects = null
        this.busqModules = null
        this.busqTeacherCUNI = null
        this.busqMes = null
        this.busqGestion = null
        this.busqTarea = null
        this.busqOrigenQuery = '0'
        this.importeMinExacto = 1
        this.importeMaxExacto = 25000
        this.importeMinExactoNeto = 1
        this.importeMaxExactoNeto = 25000
        this.busqTipoPago = null
      },
      onClose () {
        // emit para cerrar el componente
        this.$emit('back')
      },
      successMessage: function () {
        swal({
          title: `Buen trabajo!`,
          text: 'Se guardaron los cambios!',
          buttonsStyling: false,
          confirmButtonClass: 'btn btn-success btn-fill',
          type: 'success'
        })
      },
      errorMessage: function (text) {
        swal({
          title: `Ups!`,
          text: 'Ocurrio un error!\n' + text,
          buttonsStyling: false,
          confirmButtonClass: 'btn btn-success btn-fill',
          type: 'error'
        })
      },
      validationMessage: function () {
        swal({
          title: `Ups!`,
          text: 'Algunos datos no están validados',
          buttonsStyling: false,
          confirmButtonClass: 'btn btn-success btn-fill',
          type: 'error'
        })
      }
    },
    created () {
      this.loadProjects()
      this.loadModulesUsed()
      this.loadTeachers()
      this.loadOrigin()
      this.loadTipoTarea()
      this.loadMonth()
      this.loadTipoPago()
    }
  }
</script>

<style scoped>
  .fixI i:link, .fixI i {
    top: 25px!important;
  }
  .calendarProp {
    color: red;
  }
  .textBox {
    background-color: white;
    text-transform: uppercase;
  }
</style>
