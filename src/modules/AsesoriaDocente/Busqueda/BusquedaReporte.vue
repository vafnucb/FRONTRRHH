<template>
  <div v-if="!IsFetching" class="col-md-12">
    <div class="panel-body">
      <!--Carrera-->
      <div class="row">
        <div class="form-group col-md-6 col-md-offset-2">
          <label>Carrera</label>
          <div>
            <model-select class="select-info"
                          :options="careers"
                          v-model="busqCarrera">
            </model-select>
          </div>
        </div>
      </div>
      <!--Docente-->
      <div class="row">
        <div class="form-group col-md-4 col-md-offset-2">
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
        <!-- <div class="form-group col-md-6 col-md-offset-2">
          <label>Extranjero</label>
          <model-select class="select-info"
                        :options="extranjeros"
                        v-model="busqExtranjero"
          >
          </model-select>
        </div> -->
      </div>
      <!--Modalidad-->
      <div class="row">
        <div class="form-group col-md-2 col-md-offset-2">
          <label>Modalidad</label>
          <div>
            <model-select class="select-info"
                          :options="modalidades"
                          v-model="busqModalidad">
            </model-select>
          </div>
        </div>
        <div class="form-group col-md-2">
          <label>Tipo Tarea</label>
          <div>
            <model-select class="select-info"
                          :options="tipoTarea"
                          v-model="busqTarea">
            </model-select>
          </div>
        </div>
        <div class="form-group col-md-2">
          <label>Tipo Pago</label>
          <div>
            <model-select class="select-info"
                          :options="tipoPago"
                          v-model="busqTipoPago">
            </model-select>
          </div>
        </div>
      </div>
      <!--Estudiante-->
      <div class="row">
        <!-- <div class="form-group col-md-8 col-md-offset-2">
          <label >Nombre del Alumno</label>
          <input type="text" style="text-transform: uppercase;" class="form-control textBox" v-model.lazy="busqStudent">
        </div> -->
        <div>
          <div class="form-group col-md-4 col-md-offset-2">
          <label >Nombre del Alumno</label>
          <input type="text" style="text-transform: uppercase;" class="form-control textBox" v-model.lazy="busqStudent">
        </div>
        <div class="form-group col-md-1">
          <label>Mes</label>
          <div>
            <model-select class="select-info"
                          :options="months"
                          v-model="busqMes">
            </model-select>
          </div>
        </div>
        <div class="form-group col-md-1">
          <label >Gestión</label>
          <input type="text" style="text-transform: uppercase;" class="form-control textBox" v-model="busqGestion">
        </div>             
          <!-- <div class="form-group col-md-6 col-md-offset-2">
            <label>Nombre del Alumno</label>
            <model-select class="select-info"
                          :options="alumnos"
                          v-model="busqStudent"
            >
            </model-select>
          </div> -->
        </div>
        <!--
        <div>
          <div class="form-group col-md-3">
            <label >Acta</label>
            <input type="text" placeholder="N° Acta" class="form-control textBox" v-model="busqueda.Acta">
            <small v-if="formError.Acta.active" class="form-text text-muted text-danger">{{formError.Acta.message}}</small>
          </div>
          <div class="form-group col-md-3">
            <label> Fecha </label>
            <div class="row">
              <date-picker
                v-model="busqueda.ActaFecha"
                :format=format
                :use-utc="true"
                placeholder="DD/MM/YYYY"
              ></date-picker>
            </div>
          </div>
        </div>
        -->
      </div>
      <!--Mes y Gestion-->
      <div class="row">
        <div class="form-group col-md-3 col-md-offset-2">
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

        <div class="form-group col-md-3">
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
        <div class="col-md-4">
        </div>
        <reporte :url="busqCarrera + '/' + busqTeacherCUNI + '/' + busqModalidad + '/' + busqTarea + '/' + busqStudent + '/' + busqMes + '/' + busqGestion + '/' + busqOrigenQuery + '/' + busqTipoPago "></reporte>
        <div class="col-md-1">
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
        selectMes: [{Id: '01', Name: 'Enero'},
            {Id: '02', Name: 'Febrero'},
            {Id: '03', Name: 'Marzo'},
            {Id: '04', Name: 'Abril'},
            {Id: '05', Name: 'Mayo'},
            {Id: '06', Name: 'Junio'},
            {Id: '07', Name: 'Julio'},
            {Id: '08', Name: 'Agosto'},
            {Id: '09', Name: 'Septiembre'},
            {Id: '10', Name: 'Octubre'},
            {Id: '11', Name: 'Noviembre'},
            {Id: '12', Name: 'Diciembre'}],
        selectOrigen: [{Id: '0', Name: 'TODOS'},
          {Id: '1', Name: 'DEPEN'},
          {Id: '2', Name: 'INDEP'},
          {Id: '3', Name: 'OR'},
          {Id: '4', Name: 'FAC'},
          {Id: '5', Name: 'EXT'}],
        dependencyOptions: [],
        but: false,
        IsFetching: true,
        alumnos: [],
        careers: [],
        modalidades: [],
        tipoTarea: [],
        tipoPago: [],
        dependiente: true,
        or: false,
        teacherIdentifier: '',
        teacherArray: [],
        teachers: [],
        busqCarrera: null,
        busqTeacherCUNI: null,
        busqDependencyCod: null,
        busqStudent: '',
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
    computed: {
      lockDependiente: function () {
        if (this.or && !this.dependiente) {
          this.dependiente = false
        }
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
      // loadExtranjero () {
      //   let extranjero = this.extranjeros
      //   axios.get('Extranjero')
      //     .then(response => {
      //       response.data.forEach(function (element) {
      //         extranjero.push({value: element.Id, text: element.Name})
      //       })
      //     })
      //     .catch(error => console.log(error))
      // },
      // loadAlumno () {
      //   let alumnos = this.alumnos

      //   axios.get('AlumnosListBusqueda')
      //     .then(response => {
      //       console.log('Response Data:', response.data)

      //       // Filtra elementos nulos de la respuesta
      //       let cleanedAlumnos = response.data.filter(element => element !== null)

      //       cleanedAlumnos.forEach(function (element) {
      //         console.log('Adding Element:', element)
      //         alumnos.push({ value: element.StudentFullName, text: element.StudentFullName })
      //       })
      //     })
      //     .catch(error => console.error('El error es ', error.response || error))
      //   this.IsFetching = false
      // },
      // loadAlumno (pagina = 1, tamanoPagina = 10) {
      //   let alumnos = this.alumnos
      //   // Realiza la llamada a la API con los parámetros de paginación
      //   axios.get(`AlumnosListBusqueda2?pagina=${pagina}&tamanoPagina=${tamanoPagina}`)
      //       .then(response => {
      //         console.log('Response Data:', response.data)
      //           // Limpia la lista actual antes de agregar nuevos elementos
      //         alumnos = []
      //           // Itera sobre los elementos y agrégales a la lista
      //         response.data.forEach(function (element) {
      //           alumnos.push({ value: element, text: element })
      //         })
      //           // Actualiza la propiedad this.alumnos
      //         this.alumnos = alumnos
      //       })
      //       .catch(error => console.error('El error es ', error.response || error))
      //   this.IsFetching = false
      // },
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
      loadCareers () {
        let carreras = this.careers
        axios.get('CarrerasListBusqueda')
          .then(response => {
            response.data.forEach(function (element) {
              carreras.push({value: element.Cod, text: element.Cod + '-' + element.Name, BranchesId: element.BranchesId, Id: element.Id})
            })
          })
          .catch(error => console.log(error))
        this.IsFetching = false
      },
      loadMonth () {
        let month = this.months
        this.selectMes.forEach(function (element) {
          month.push({value: element.Id, text: element.Name})
        })
      },
      loadOrigin () {
        let month = this.origins
        this.selectOrigen.forEach(function (element) {
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
        axios.get('DocentesListBusqueda')
            .then(response => {
              response.data.forEach(function (element) {
                // Se envío el BP como CUNI para que solo llegara un valor en el value, que se asignará después a teacherCUNI o teacherBP dependiendo de su origen
                teachers.push({value: element.FullName, text: element.Regional + '-' + element.FullName, name: element.FullName, extranjero: element.Extranjero, origen: element.Origen})
                // console.log('Terachers' + element.CUNI + '-' + element.FullName)
                // Creamos un array con los docentes dependientes
              })
              // console.log('el array de los profesores es:')
              // console.log(firstTeachers)
            })
            .catch(error => console.log(error))
        this.IsFetching = false
      },
      loadModalidades () {
        let mods = this.modalidades
        axios.get('Modalidades')
          .then(response => {
            response.data.forEach(function (element) {
              mods.push({value: element.Id, text: element.Modalidad})
            })
          })
          .catch(error => console.log(error + 'Im here cause I messed up'))
      },
      loadTipoTarea () {
        let tipot = this.tipoTarea
        axios.get('TipoTarea')
          .then(response => {
            response.data.forEach(function (element) {
              tipot.push({value: element.Id, text: element.Tarea})
            })
          })
          .catch(error => console.log(error + 'Im here cause I messed up'))
      },
      loadDependency () {
        let op = this.dependencyOptions
        axios.get('/AsesoriaDocente/dependenciasUsadas/')
          .then(response => {
            response.data.forEach(function (element) {
              // console.log(element)
              op.push({value: element.Cod, text: element.Cod + '-' + element.Name})
            })
          })
          .catch(error => console.log(error))
      },
      cleanScreen () {
        // este método limpia la pantalla, con excepcion del porcentaje y la carrera
        // Variables del objeto que se envía mediante el POST
        this.busqCarrera = null
        this.busqTeacherCUNI = null
        this.busqDependencyCod = null
        this.busqStudent = null
        this.busqMes = null
        this.busqGestion = null
        this.busqOrigen = 'DEPEN'
        this.busqModalidad = null
        this.busqTarea = null
        this.busqOrigenQuery = '0'
        this.busqExtranjero = '0'
        // this.importeMinExacto = 1
        // this.importeMaxExacto = 25000
        // this.importeMinExactoNeto = 1
        // this.importeMaxExactoNeto = 25000
        this.busqTipoPago = null
        // Variables del componente
        // Variables de control de errores
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
      this.loadModalidades()
      this.loadTipoTarea()
      this.loadTeachers()
      this.loadCareers()
      // this.loadAlumno()
      this.loadDependency()
      this.loadMonth()
      this.loadOrigin()
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
