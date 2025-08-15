<template>
  <div v-show="!IsFetching" class="col-md-12">
    <div class="panel-body">
      <!--Carrera-->
      <div class="row">
        <div class="form-group col-md-6">
          <label>Carrera</label>
          <div>
            <model-select class="select-info" v-bind:class="{fixI : action==='PUT'}" :options="careers"
              v-model.lazy="tutoria.Carrera" placeholder="Seleccione una carrera">
            </model-select>
          </div>
        </div>
      </div>
      <!--Del Profesor-->
      <div class="row">
        <div class="form-group col-md-4">
          <label>Docente</label>
          <model-select class="select-info" v-bind:class="{fixI : action==='PUT'}" :options="teacherArray"
            v-model.lazy="teacherIdentifier" placeholder="Seleccionar docente" @input="actualCat(teacherIdentifier)">
          </model-select>
        </div>
        <div class="form-group col-md-1">
          <label>Categoría</label>
          <model-select class="select-info" v-bind:class="{fixI : action==='PUT'}" :options="tipoDoc"
            v-model="tutoria.Categoría">
          </model-select>
        </div>
        <div class="form-group col-md-1">
          <label>Dependiente?</label>
          <input type="checkbox" class="form-control" v-model.lazy="dependiente" :disabled="extranjero"
            @click="filterTeachers()">
        </div>
        <div class="form-group col-md-1">
          <label>Otra Regional?</label>
          <input type="checkbox" class="form-control" v-model.lazy="or" @click="ChangeButton()">
        </div>
        <div class="form-group col-md-1">
          <label>Por Hora?</label>
          <input type="checkbox" class="form-control" v-model.lazy="porHora">
        </div>
        <div class="form-group col-md-1">
          <label>Extranjero?</label>
          <input type="checkbox" class="form-control" v-model.lazy="extranjero" :disabled="dependiente"
            @click="lockExtranjero()">
        </div>
      </div>
      <!--Modalidad-->
      <div class="row">
        <div class="form-group col-md-2">
          <label>Modalidad</label>
          <div>
            <model-select class="select-info" v-bind:class="{fixI : action==='PUT'}" :options="modalidades"
              v-model.lazy="tutoria.ModalidadId" placeholder="Modalidad">
            </model-select>
          </div>
        </div>
        <div class="form-group col-md-2">
          <label>Tipo Tarea</label>
          <div>
            <model-select class="select-info" v-bind:class="{fixI : action==='PUT'}" :options="tipoTarea"
              v-model.lazy="tutoria.TipoTareaId" placeholder="Tipo de tarea">
            </model-select>
          </div>
        </div>
        <div class="form-group col-md-2">
          <label>Tipo Pago</label>
          <div>
            <model-select class="select-info" v-bind:class="{fixI : action==='PUT'}" :options="tipoPago"
              v-model.lazy="tutoria.TipoPago" placeholder="Tipo Pago">
            </model-select>
          </div>
        </div>
        <div class="form-group col-md-2">
          <label>N° de Contrato?</label>
          <input type="checkbox" class="form-control" v-model.lazy="contrato">
        </div>
        <div v-show="contrato" class="form-group col-md-2">
          <label>N° de Contrato</label>
          <input type="text" placeholder="N° de Contrato" class="form-control textBox"
            v-model.lazy="tutoria.NumeroContrato">
          <small v-show="formError.NumeroContrato.active"
            class="form-text text-muted text-danger">{{formError.NumeroContrato.message}}</small>
        </div>
      </div>
      <!--Del Alumno y acta-->
      <div class="row">
        <div class="form-group col-md-6">
          <label>Nombre del Alumno</label>
          <input type="text" placeholder="Apellidos y nombres del estudiante" style="text-transform: uppercase;"
            class="form-control textBox" v-model.lazy="tutoria.StudentFullName">
          <small v-show="formError.Student.active"
            class="form-text text-muted text-danger">{{formError.Student.message}}</small>
        </div>
        <div class="form-group col-md-2">
          <label>Tiene acta?</label>
          <input type="checkbox" placeholder="Acta" class="form-control" v-model.lazy="acta">
        </div>
        <!--Si el acta existe, llenar datos-->
        <div v-show="acta">
          <div class="form-group col-md-2">
            <label>Acta</label>
            <input type="text" placeholder="N° Acta" class="form-control textBox" v-model.lazy="tutoria.Acta">
            <small v-show="formError.Acta.active"
              class="form-text text-muted text-danger">{{formError.Acta.message}}</small>
          </div>
          <div class="form-group col-md-2">
            <label> Fecha </label>
            <div class="row">
              <date-picker v-model="tutoria.ActaFecha" :format=format :use-utc="true"
                placeholder="DD/MM/YYYY"></date-picker>
            </div>
          </div>
        </div>
      </div>
      <!--Observaciones-->
      <div class="row">
        <div class="form-group col-md-6">
          <label for="exampleFormControlTextarea1">Observaciones</label>
          <textarea class="form-control textBox" style="text-transform: uppercase;" id="exampleFormControlTextarea1"
            rows="2" v-model.lazy="tutoria.Observaciones"></textarea>
        </div>
        <div class="form-group col-md-2">
          <label>Ignorar repetido?</label>
          <input type="checkbox" class="form-control" v-model="tutoria.Ignore">
        </div>
        <div class="form-group col-md-2" v-show="!dependiente">
          <label>Factura?</label>
          <input type="checkbox" class="form-control" v-model="tutoria.Factura" @change="facturaOn">
        </div>


      </div>
      <!--Costos-->
      <div class="row">
        <div class="form-group col-md-2">
          <label>Costo Hora</label>
          <input type="text" placeholder="C/H" class="form-control" v-model.lazy="tutoria.MontoHora" readonly>
        </div>
        <div class="form-group col-md-2">
          <label>Horas</label>
          <input type="text" placeholder="Horas" class="form-control" :onchange="hrsChange()" v-model="tutoria.Horas"
            :readonly="!porHora">
        </div>
        <div class="form-group col-md-2">
          <label>Total Bruto</label>
          <input type="text" placeholder="TB" class="form-control textBox" :readonly="porHora"
            v-model.lazy="totalBruto">
        </div>
        <!-- Deducción (solo dependiente, sin extranjero, y sin Factura) -->
        <!-- Deducción (solo dependiente, no extranjero, y sin factura) -->
        <div v-if="dependiente && !extranjero && !tutoria.Factura" class="form-group col-md-2">
          <label>Deduccion(%)</label>
          <input type="text" placeholder="%" class="form-control textBox" v-model.lazy="Deduccion">
        </div>

        <!-- RC-IVA e IT (independiente, no extranjero, y sin factura) -->
        <div v-if="!dependiente && !extranjero && !tutoria.Factura" class="form-group col-md-2">
          <label>RC-IVA(%)</label>
          <input type="text" placeholder="%" class="form-control textBox" v-model.lazy="IUE"
            :readonly="!dependiente && !extranjero">
        </div>
        <div v-if="!dependiente && !extranjero && !tutoria.Factura" class="form-group col-md-2">
          <label>IT(%)</label>
          <input type="text" placeholder="%" class="form-control textBox" v-model.lazy="IT"
            :readonly="!dependiente && !extranjero">
        </div>

        <!-- IUE Exterior (solo extranjero y sin factura) -->
        <div v-if="extranjero && !tutoria.Factura" class="form-group col-md-2">
          <label>IUE Exterior(%)</label>
          <input type="text" placeholder="IUE en %" class="form-control textBox" v-model.lazy="IUEExterior"
            :readonly="extranjero">
        </div>


        <div class="form-group col-md-2"> <label>Total Neto</label> <input type="text" placeholder="TN"
            class="form-control textBox" v-model="totalNeto" readonly> </div>

      </div>
      <!--Botón que envía la información del form-->
      <div class="row">
        <div class="col-md-2">
          <button class="btn btn-success btn-fill" @click="send()">Guardar</button>
        </div>
        <div class="col-md-2" v-show="action === 'PUT'">
          <button class="btn btn-danger btn-fill" @click="onClose()">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import DatePicker from 'vue2-datepicker'
  import 'vue2-datepicker/index.css'
  import 'vue2-datepicker/locale/es'
  /* import Datepicker from 'vuejs-datepicker' */
  import swal from 'sweetalert2'
  import { ModelSelect } from 'vue-search-select'
  import {FormWizard, TabContent} from 'vue-form-wizard'
  import 'vue-form-wizard/dist/vue-form-wizard.min.css'
  /* import {es} from 'vuejs-datepicker/dist/locale' */
  export default {
    components: {
      ModelSelect,
      DatePicker,
      FormWizard,
      TabContent
    },
    props: {
      tutoriaId: {
        type: Number,
        required: false
      },
      action: {
        // Por defecto es POST, y cuando haya que actualizar, la función send revisará el prop
        type: String,
        required: false,
        default: 'POST'
      },
      origin: {
        type: String,
        required: false,
        default: 'DEPEN'
      }
    },
    data: function () {
      return {
        contrato: false,
        initialTotalBruto: 0,
        extranjero: false,
        ridy: false,
        Regional: '',
        format: 'DD/MM/YYYY',
        opendate: new Date(),
        initialview: 'day',
        but: false,
        IsFetching: true,
        totalBruto: 0,
        options: [],
        careers: [],
        branches: [],
        modalidades: [],
        tipoTarea: [],
        alumnos: [],
        tipoPago: [],
        dependiente: true,
        or: false,
        Deduccion: 0,
        teacherIdentifier: '',
        teacherArray: [],
        IUE: 0,
        IUEExterior: 0,
        IT: 0,
        acta: true,
        porHora: true,
        monto: null,
        teachers: [],
        tipoDoc: [
          {value: 'LPZ-A', text: 'LPZ-A', pricing: 54.75},
          {value: 'LPZ-B', text: 'LPZ-B', pricing: 51.03},
          {value: 'LPZ-C', text: 'LPZ-C', pricing: 46.78},
          {value: 'CBB-U', text: 'CBB-U', pricing: 0},
          {value: 'TEO-U', text: 'TEO-U', pricing: 0},
          {value: 'TJA-U', text: 'TJA-U', pricing: 0},
          {value: 'EPC-U', text: 'EPC-U', pricing: 0},
          {value: 'SCZ-U', text: 'SCZ-U', pricing: 0}
        ],
        tutoria: {
          Id: null,
          Carrera: '',
          TeacherFullName: '',
          TeacherCUNI: '',
          TeacherBP: '',
          Categoría: '',
          BranchesId: null,
          DependencyCod: '',
          Acta: '',
          ActaFecha: null,
          Horas: null,
          MontoHora: null,
          TotalNeto: null,
          TotalBruto: null,
          StudentFullName: '',
          Mes: null,
          Gestion: null,
          Observaciones: '',
          Deduccion: null,
          Origen: 'DEPEN',
          ModalidadId: null,
          TipoTareaId: null,
          TipoPago: null,
          Ignore: false,
          Factura: false,
          IUE: null,
          IT: null,
          IUEExterior: null,
          NumeroContrato: ''
        },
        formError: {
          Acta: {
            active: false,
            message: '*Este valor no puede ser vacio.'
          },
          Student: {
            active: false,
            message: '*Este valor no puede ser vacio.'
          },
          NumeroContrato: {
            active: false,
            message: '*Este valor no puede ser vacio.'
          }
        }
      }
    },
    computed: {
      // --------------------------Para el cálculo de los montos----------------------------
      totalNeto: function () {
        // Factura: no taxes, net = bruto, zero out tax amounts
        if (this.tutoria.Factura) {
    this.tutoria.Deduccion = 0
    this.tutoria.IUE = 0
    this.tutoria.IT = 0
    this.tutoria.IUEExterior = 0
    this.tutoria.TotalNeto = parseFloat(((this.totalBruto || 0)).toFixed(2))
    return this.tutoria.TotalNeto
  }
        if (this.extranjero) {
          this.IUEExterior = 12.5
          this.tutoria.IUEExterior = parseFloat((this.totalBruto * (this.IUEExterior / 100)).toFixed(2))
          this.tutoria.TotalNeto = parseFloat((this.totalBruto - this.tutoria.IUEExterior).toFixed(2))
          this.tutoria.Deduccion = 0
          this.tutoria.IT = 0
          this.tutoria.IUE = 0
          // Devolver el resultado redondeado para su presentación
          return this.tutoria.TotalNeto
        } else {
          // Lógica para Dependientes o Independientes que no son extranjeros
          if (this.dependiente) {
            // Calcular el TotalNeto sin redondeo
            this.tutoria.TotalNeto = this.totalBruto - (this.totalBruto * (this.Deduccion / 100))
            // Aplicar redondeo a todos los valores
            this.tutoria.TotalNeto = parseFloat(this.tutoria.TotalNeto.toFixed(2))
            this.tutoria.Deduccion = parseFloat((this.totalBruto - this.tutoria.TotalNeto).toFixed(2))
            this.tutoria.IUEExterior = 0
            this.tutoria.IT = 0
            this.tutoria.IUE = 0
            // Devolver el resultado redondeado para su presentación
            return this.tutoria.TotalNeto
          } else {
            // Fijar los porcentajes
            this.IUE = 13
            this.IT = 3
            this.tutoria.IUE = parseFloat((this.totalBruto * (this.IUE / 100)).toFixed(2))
            this.tutoria.IT = parseFloat((this.totalBruto * (this.IT / 100)).toFixed(2))
            this.tutoria.TotalNeto = parseFloat((this.totalBruto - this.tutoria.IUE - this.tutoria.IT).toFixed(2))
            this.tutoria.Deduccion = 0
            this.tutoria.IUEExterior = 0
            return this.tutoria.TotalNeto
          }
        }
      },
      brutoCalculado: function () {
        return this.tutoria.Horas * this.tutoria.MontoHora
      },
      lockDependiente: function () {
        if (this.or && !this.dependiente) {
          this.dependiente = false
        }
      }
    },
    methods: {
      reloadPage () {
        // Recarga la página
        window.location.reload()
      },
      resetValues: function () {
        console.log('Resetting values...')
        this.MontoHora = ''
        this.Horas = ''
        this.Deduccion = ''
        this.IUE = ''
        this.IT = ''
        this.IUEExterior = ''
        this.TotalNeto = ''
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
      lockExtranjero: function () {
        this.resetValues()
        if (!this.extranjero) {
          this.dependiente = false
        }
      },
      // --------------------------Para la validación antes del POST/PUT----------------------------
      valid: function () {
        if (this.acta) {
          this.formError.Acta.active = this.isEmptyBlanckOrNull(this.tutoria.Acta)
        }
        this.formError.Student.active = this.isEmptyBlanckOrNull(this.tutoria.StudentFullName)
        var x = this.formError.Acta.active || this.formError.Student.active
        return x
      },
      isEmptyBlanckOrNull: function (val) {
        return !val || val.length === 0 || !val.toString().trim()
      },
      // --------------------------Para el cálculo de los montos-----------------------------------------
      // --------------------------Para encontrar y asignar datos del docente----------------------------
      filterTeachers: function () {
        console.log('Filtering teachers...')
        let boolean
        if (this.dependiente) {
          boolean = '0'
        } else {
          boolean = '1'
        }
        this.teacherArray = this.teachers.filter(function (e) {
          return e.TipoPago === boolean
        })
      },
      // ----------------------------------------Cargar datos desde BD----------------------------------------
      fakeLoad () {
        this.$store.commit('crud/loadSetter', true)
        setTimeout(() => {
          this.$store.commit('crud/loadSetter', false)
        }, 1000)
      },
      // Usamos esta función en el PUT, para cargar los datos actuales del registro
      loadTutoria: function () {
        axios.get('AsesoriaDocente/' + this.tutoriaId)
          .then(response => {
            this.tutoria = response.data
            this.initialTotalBruto = this.tutoria.TotalBruto
            this.TipoPago = this.tutoria.TipoPago
            // Dependiendo dl origen del docente se carga el CUNI o el BP
            if (this.tutoria.Origen === 'DEPEN' || this.tutoria.Origen === 'OR') {
              this.teacherIdentifier = this.tutoria.TeacherCUNI
              console.log('DEPEN' + this.teacherIdentifier)
              if (this.tutoria.Origen === 'OR') {
                this.or = true
              }
              // para igualar costos, es necesario hacer un cálculo inverso porque nosotros guardamos monto pero desplegamos porcentaje
              this.Deduccion = parseFloat(((100 * this.tutoria.Deduccion) / this.tutoria.TotalBruto).toFixed(2))
            } else if (this.tutoria.Origen === 'INDEP') {
              this.origin = 'INDEP'
              this.dependiente = false
              this.extranjero = false
              this.teacherIdentifier = this.tutoria.TeacherBP
              // para igualar costos
              this.IUE = parseFloat(((100 * this.tutoria.IUE) / this.tutoria.TotalBruto).toFixed(2))
              this.IT = parseFloat(((100 * this.tutoria.IT) / this.tutoria.TotalBruto).toFixed(2))
            } else if (this.tutoria.Origen === 'EXT') { // Nueva funcionalidad para extranjeros
              this.origin = 'EXT'
              this.dependiente = false
              this.extranjero = true
              this.teacherIdentifier = this.tutoria.TeacherBP
              // para igualar costos en caso de ser extranjero
              this.IUEExterior = parseFloat(((100 * this.tutoria.IUEExterior) / this.tutoria.TotalBruto).toFixed(2))
            }
            this.totalBruto = this.initialTotalBruto
            if (this.tutoria.Horas <= 0) {
              // para que no oculte el valor de la edición
              this.porHora = false
              // para que no cargue el total bruto ni el neto desde 0
              this.totalBruto = this.tutoria.TotalBruto
            }
            if (this.tutoria.Acta === '') {
              this.acta = false
            }
            // La fecha solo la tienen algunos registros, el cargado de la fecha será opcional
            if (this.tutoria.ActaFecha != null) {
              var actaYear = this.tutoria.ActaFecha.substring(0, 4)
              var actaMonth = this.tutoria.ActaFecha.substring(5, 7)
              var actaDay = this.tutoria.ActaFecha.substring(8, 10)
              var date = new Date(actaYear, actaMonth - 1, actaDay)
              this.tutoria.ActaFecha = date
            }
            if (this.tutoria.NumeroContrato === '' || this.tutoria.NumeroContrato === null) {
              this.contrato = false
            } else {
              this.contrato = true
            }
            this.IsFetching = false
          })
          .catch(error => { console.log('el error es:' + error) })
      },
      convert (str) {
        let date = new Date(str)
        let mnth = ('0' + (date.getMonth() + 1)).slice(-2)
        let day = ('0' + date.getDate()).slice(-2)
        return [date.getFullYear(), mnth, day].join('-')
      },
      ChangeButton () {
        this.resetValues()
        if (this.but) {
          this.but = false
        }
        if (!this.but) {
          this.but = true
        }
        this.loadTeachers()
      },
      hrsChange () {
        if (this.porHora) {
          this.tutoria.TotalBruto = this.brutoCalculado
          this.totalBruto = this.brutoCalculado
        } else {
          this.tutoria.TotalBruto = this.totalBruto
        }
      },
      actualCat (teacher) {
        /*
        for (var i = 0; i < this.teacherArray.length; i++) {
          // si es dependiente y el valor iguala, entonces se guarda en el CUNI, sino en el BP
          // resetea el otro identificador, para no guardar el identificador de un docente seleccionado antes
          if (this.dependiente && this.teacherArray[i]['value'] === this.teacherIdentifier) {
            this.tutoria.TeacherBP = ''
            this.tutoria.TeacherCUNI = this.teacherArray[i]['value']
            this.tutoria.TeacherFullName = this.teacherArray[i]['name']
            this.tutoria.Categoría = this.teacherArray[i]['Categoria']
            this.tutoria.MontoHora = this.teacherArray[i]['Precio']
          }
          if (!this.dependiente && this.teacherArray[i]['value'] === this.teacherIdentifier) {
            this.tutoria.TeacherCUNI = ''
            this.tutoria.TeacherBP = this.teacherArray[i]['value']
            this.tutoria.TeacherFullName = this.teacherArray[i]['name']
            this.tutoria.Categoría = this.teacherArray[i]['Categoria']
            this.tutoria.MontoHora = this.teacherArray[i]['Precio']
          }
        }
        return this.tutoria.Categoría
        */
        axios.get('DocentesList/' + teacher)
          .then(response => {
            this.infoTeacher = response.data
            console.log(response.data[0].CUNI)
            if (this.dependiente) {
              this.tutoria.TeacherBP = ''
              this.tutoria.TeacherCUNI = this.infoTeacher[0].CUNI
              this.tutoria.TeacherFullName = this.infoTeacher[0].FullName
              this.tutoria.Categoría = this.infoTeacher[0].Categoria
              this.tutoria.MontoHora = this.infoTeacher[0].Precio
            }
            if (!this.dependiente) {
              this.tutoria.TeacherCUNI = ''
              this.tutoria.TeacherBP = this.infoTeacher[0].CUNI
              this.tutoria.TeacherFullName = this.infoTeacher[0].FullName
              this.tutoria.Categoría = ''
              this.tutoria.MontoHora = 0
            }
            // console.log('TeacherAntesde Enviar' + this.infoTeacher[0].FullName) Esto sirve para enviar al método loadAlumno el docente seleccionado
            // this.loadAlumno(this.infoTeacher[0].FullName)
          })
          .catch(error => console.log(error))
      },
      loadCareers () {
        let carreras = this.careers
        axios.get('CostCenters/Careers')
          .then(response => {
            response.data.forEach(function (element) {
              // console.log('RESPONSE DATA DE CARRERA PARA ACT: ', response.data)
              carreras.push({value: element.PrcCode, text: element.PrcCode + '-' + element.PrcName, BranchesId: element.BranchesId, Id: element.Id})
            })
          })
          .catch(error => console.log(error))
        this.IsFetching = false
      },
      loadTeachers () {
        if (!this.but) {
          if (this.origin === 'FAC') {
            this.origin = 'INDEP'
          }
          let teachers = this.teachers
          // Este array guarda la info de los profesores que se cargan la primera vez
          let firstTeachers = this.teacherArray
          let selectedOrigin = '1'
          if (this.origin === 'INDEP' || this.origin === 'EXT') {
            // console.log('This is the PUT action and the selected origin is:' + selectedOrigin)
            selectedOrigin = '0'
          }
          axios.get('DocentesList')
            .then(response => {
              response.data.forEach(function (element) {
                // Se envío el BP como CUNI para que solo llegara un valor en el value, que se asignará después a teacherCUNI o teacherBP dependiendo de su origen
                teachers.push({value: element.CUNI, text: element.Regional + '-' + element.CUNI + '-' + element.FullName, name: element.FullName, TipoPago: element.TipoPago, Categoria: element.Categoria, Precio: element.Precio})
                // console.log('Terachers' + element.CUNI + '-' + element.FullName)
                // Creamos un array con los docentes dependientes
                if (element.TipoPago === selectedOrigin) {
                  // console.log('This is the update action: ' + selectedOrigin)
                  firstTeachers.push({value: element.CUNI, text: element.Regional + '-' + element.CUNI + '-' + element.FullName, name: element.FullName, TipoPago: element.TipoPago, Categoria: element.Categoria, Precio: element.Precio})
                  // console.log('FirstTeachers' + element.CUNI + '-' + element.FullName)
                }
              })
              // console.log('el array de los profesores es:')
              // console.log(firstTeachers)
            })
            .catch(error => console.log(error))
          this.IsFetching = false
        }
        if (this.but) {
          let teachers = this.teachers
          // Este array guarda la info de los profesores que se cargan la primera vez
          let firstTeachers = this.teacherArray
          let selectedOrigin = '1'
          if (this.origin === 'INDEP' || this.origin === 'EXT') {
            // console.log('This is the PUT action and the selected origin is:' + selectedOrigin)
            selectedOrigin = '0'
          }
          axios.get('DocentesListAll')
            .then(response => {
              response.data.forEach(function (element) {
                // Se envío el BP como CUNI para que solo llegara un valor en el value, que se asignará después a teacherCUNI o teacherBP dependiendo de su origen
                teachers.push({value: element.CUNI, text: element.CUNI + '-' + element.FullName, name: element.FullName, TipoPago: element.TipoPago, Categoria: element.Categoria})
                // console.log('Terachers' + element.CUNI + '-' + element.FullName)
                // Creamos un array con los docentes dependientes
                if (element.TipoPago === selectedOrigin) {
                  // console.log('This is the update action: ' + selectedOrigin)
                  firstTeachers.push({value: element.CUNI, text: element.CUNI + '-' + element.FullName, name: element.FullName, TipoPago: element.TipoPago, Categoria: element.Categoria})
                  // console.log('FirstTeachers' + element.CUNI + '-' + element.FullName)
                }
              })
              // console.log('el array de los profesores es:')
              // console.log(firstTeachers)
            })
            .catch(error => console.log(error))
          this.IsFetching = false
        }
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
      // Método de Alumno que deberá conectarse posteriormente con la tabla maestra alumnos.
      // loadAlumno (infoTeacher) {
      //   let alumnos = this.alumnos
      //   // Realiza la llamada a la API con los parámetros de paginación
      //   axios.get(`AlumnosListBusqueda2/${infoTeacher}`)
      //       .then(response => {
      //         // console.log('Response Data:', response.data)
      //             // Limpia la lista actual antes de agregar nuevos elementos
      //         alumnos = []
      //             // Itera sobre los elementos y agrégales a la lista
      //         response.data.forEach(function (element) {
      //           alumnos.push({ value: element, text: element })
      //         })
      //             // Actualiza la propiedad this.alumnos
      //         this.alumnos = alumnos
      //       })
      //       .catch(error => console.error('El error es ', error.response || error))
      //   this.IsFetching = false
      // },
      // Envío de datos
      send () {
        if (!this.valid() && this.action === 'POST') {
          if (this.acta && (!this.tutoria.Acta || !this.tutoria.ActaFecha)) {
            swal({
              title: `Error!`,
              text: 'Debe llenar los campos de Acta y Fecha de Acta',
              buttonsStyling: false,
              confirmButtonClass: 'btn btn-danger btn-fill',
              type: 'error'
            })
            return // No continuar con el guardado si la validación falla
          }
          if (!this.contrato) {
            this.tutoria.NumeroContrato = ''
          }
          if (this.contrato && !this.tutoria.NumeroContrato) {
            swal({
              title: `Error!`,
              text: 'Debe llenar el Número de Contrato',
              buttonsStyling: false,
              confirmButtonClass: 'btn btn-danger btn-fill',
              type: 'error'
            })
            return
          }
          this.post()
        } else if (!this.valid() && this.action === 'PUT') {
          if (this.acta && (!this.tutoria.Acta || !this.tutoria.ActaFecha)) {
            swal({
              title: `Error!`,
              text: 'Debe llenar los campos de Acta y Fecha de Acta',
              buttonsStyling: false,
              confirmButtonClass: 'btn btn-danger btn-fill',
              type: 'error'
            })
            return // No continuar con el guardado si la validación falla
          }
          if (!this.contrato) {
            this.tutoria.NumeroContrato = ''
          }
          if (this.contrato && !this.tutoria.NumeroContrato) {
            swal({
              title: `Error!`,
              text: 'Debe llenar el Número de Contrato',
              buttonsStyling: false,
              confirmButtonClass: 'btn btn-danger btn-fill',
              type: 'error'
            })
            return
          }
          this.put()
          setTimeout(() => {
            // Código a ejecutar después de la actualización exitosa
            location.reload()
          }, 2000)
        } else {
          console.log('something was printed:' + this.action + ' ' + this.valid())
          // resetear variables de validación
          this.formError.Acta.active = false
          this.formError.Student.active = false
          this.validationMessage()
        }
      },
      cleanScreen () {
        // este método limpia la pantalla, con excepcion del porcentaje y la carrera
        // Variables del objeto que se envía mediante el POST
        this.tutoria.DependencyCod = ''
        this.tutoria.Observaciones = ''
        this.tutoria.TotalNeto = null
        this.tutoria.MontoHora = null
        this.tutoria.Horas = null
        this.tutoria.Categoría = ''
        this.tutoria.TotalBruto = null
        this.totalBruto = 0
        this.tutoria.TotalNeto = null
        this.tutoria.Acta = Acta
        this.tutoria.ActaFecha = ActaFecha
        this.tutoria.TeacherFullName = ''
        this.tutoria.TeacherBP = ''
        this.tutoria.TeacherCUNI = ''
        this.tutoria.ModalidadId = ModalidadId
        this.tutoria.TipoTareaId = null
        this.tutoria.TipoPago = null
        this.tutoria.NumeroContrato = ''
        // Variables del componente
        this.Deduccion = 0
        this.IUE = 0
        this.IT = 0
        this.IUEExterior = 0
        // Variables de control de errores
        this.formError.Acta.active = false
        this.formError.Student.active = false
      },
      post () {
        console.log('Aqui la infoDDD:')
        console.log('Carrera' + this.tutoria.Carrera)
        // Variables del componente
        console.log('Deduccion' + this.tutoria.Deduccion)
        console.log('IUE' + this.tutoria.IUE)
        console.log('IT' + this.tutoria.IT)
        console.log('IUEExterior' + this.tutoria.IUEExterior)
        axios.post('AsesoriaDocente', this.tutoria)
          .then(response => {
            console.log('Tutoria aqui' + this.tutoria.TeacherFullName)
            this.successMessage()
            this.cleanScreen()
          })
          .catch(error => {
            this.errorMessage(error.response.data.Message)
            console.log(error.response.data.Message)
          })
      },
      // Actualización de datos
      put () {
        // console.log('AsesoriaDocente/' + this.tutoriaId, this.tutoria)
        console.log('Aqui la actualización:')
        console.log('Carrera' + this.tutoria.Carrera)
        console.log('Código de dependencia: ' + this.tutoria.DependencyCod)
        axios.put('AsesoriaDocente/' + this.tutoriaId, this.tutoria)
          .then(response => {
            this.successMessage()
            this.cleanScreen()
            this.onClose()
          })
          .catch(error => {
            this.errorMessage(error.response.data.Message)
          })
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
      },
      facturaOn () {
    // When Factura is ON, clear tax amounts; when OFF, keep as-is (computed will recalc).
    if (this.tutoria.Factura) {
      this.Deduccion = 0
      this.IUE = 0
      this.IT = 0
      this.IUEExterior = 0
    }
  }
    },
    watch: {
      porHora: function () {
        // Para que el dato de la tutoria no se quede con el valor anterior si fue marcada como "por horas"
        if (!this.porHora) { this.tutoria.Horas = 0 }
      },
      acta: function () {
        if (!this.acta) {
          this.tutoria.Acta = ''
          this.tutoria.ActaFecha = null
        }
      },
      or: function () {
        if (this.or) {
          // Si no es dependiente no puede ser OR
          if (!this.dependiente) {
            this.or = false
          } else {
            // Pero si lo es, entonces el origen es OR
            this.tutoria.Origen = 'OR'
          }
        } else {
          if (this.dependiente) {
            this.tutoria.Origen = 'DEPEN'
          }
        }
      },
      extranjero: function () {
        if (this.extranjero) {
          this.tutoria.Origen = 'EXT'
          // si no es dependiente no puede ser OR
          this.or = false
        }
        if (!this.extranjero && !this.dependiente) {
          this.tutoria.Origen = 'INDEP'
          // si no es dependiente no puede ser OR
          this.or = false
        }
        this.tutoria.Categoría = ''
      },
      'tutoria.Factura': function (on) {
    if (on) {
      // limpiar todos los montos de impuestos
      this.tutoria.Deduccion = 0
      this.tutoria.IUE = 0
      this.tutoria.IT = 0
      this.tutoria.IUEExterior = 0
      this.Deduccion = 0
      this.IUE = 0
      this.IT = 0
      this.IUEExterior = 0
    }
    // Forzar una reevaluación visual inmediata
    this.$nextTick(() => {
      // Asignar el mismo valor vuelve a activar la reactividad si venía como string
      this.totalBruto = Number(this.totalBruto || 0)
    })
  },
      dependiente: function (val) {
  if (val) {
    if (!this.or) {
      this.tutoria.Origen = 'DEPEN'
    }
    // Factura no aplica para dependientes
    this.tutoria.Factura = false
  }
  if (!this.dependiente && !this.extranjero) {
    this.tutoria.Origen = 'INDEP'
    this.or = false
  }
  this.tutoria.Categoría = ''
}
    },
    created () {
      if (this.action === 'PUT') {
        // Solo cargamos los datos de la tutoría cuando hay un PUT, sino cargamos todo menos eso
        this.fakeLoad()
        this.loadTutoria()
        this.loadModalidades()
        this.loadTipoTarea()
        this.loadTeachers()
        this.loadCareers()
        this.loadTipoPago()
        this.loadCategory()
      } else {
        this.loadCareers()
        this.loadTeachers()
        this.loadModalidades()
        this.loadTipoTarea()
        this.loadTipoPago()
        // Activar esto para cuando se conecte Alumnos a la tabla maestra: this.loadAlumno()
      }
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