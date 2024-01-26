    
    <template>
        <div class="row">
            <!--Navbar, selección de opciones-->
            <!--Lista de todas las tutorias, recibe todos los parámetros para el datatable-->
            <template class="col-md-12 card" v-if="actions === 'LIST'">
                <data-tables v-bind="{ url, propsToSearch, tableColumns, pagination, fuentePDF: 'ISAAC II' }" id="datatable">
                    <template slot="buttons" slot-scope="props">
                        <!--Botones para modificar o hacer otras acciones-->
                        <el-tooltip class="itemAct" effect="dark" content="Editar" placement="top">
                            <a class="btn btn-simple btn-xs btn-icon btn-info"
                                @click="Modify(props.queriedData[props.index].Id)"><i class="fa fa-edit"></i></a>
                        </el-tooltip>
                        <el-tooltip class="itemDel" effect="dark" content="Eliminar" placement="top">
                            <a class="btn btn-simple btn-xs btn-danger btn-icon"
                                @click="removeAccess(props.queriedData[props.index].Id)"><i class="fa fa-trash-alt"></i></a>
                        </el-tooltip>
                        <el-tooltip class="itemApr" effect="light" content="Aprobar" placement="top">
                            <input type="checkbox" :value="props.queriedData[props.index].Id" v-model="SelectedIds"
                                v-on:click="UpdateIds" />
                        </el-tooltip>
                    </template>
                </data-tables>
            </template>
            <!--Si queremos modificar-->
            <template v-if="actions === 'MODIFY'">
                <div class=" col-md-12 card">
                    <EditTutoria :tutoria-id="i" :action="'PUT'" :origin="origen" v-on:back="Back"></EditTutoria>
                </div>
            </template>
            <!--Enviar a aprobación-->
            <div v-if="actions === 'LIST'">
                <div v-if="allIds.length > 0">
                    <div class="row">
                        <div class="col-md-2 el-col-md-offset-2">
                            <button class="btn btn-info" @click="generatePDF">Generar PDF</button>
                        </div>
                        <div class="col-md-3">
                            <button class="btn btn-info" @click="PDFCareer">Generar PDF por Carrera</button>
                        </div>
                        <div class="col-md-2">
                            <button class="btn btn-info" @click="EraseSelected">
                                <span v-if="SelectedIds.length === 0">Marcar Todos</span>
                                <span v-else>Desmarcar Todos</span>
                            </button>
                        </div>
                        <div class="col-md-2">
                            <button class="btn btn-info" @click="UpdateState">Enviar a Pre-Aprobación</button>
                        </div>
                    </div>
                </div>
            </div>
            <template v-if="PDFcarrera === 'SI'">
                <div class="row">
                    <div class="form-group col-md-6 el-col-md-offset-5">
                        <label>Proyecto</label>
                        <div>
                            <model-select class="select-info" :options="Proyecto" v-model="ProyectoModel" @input="actualCarrera"
                                placeholder="Seleccione un proyecto">
                            </model-select>
                        </div>
                    </div>
                </div>
                <div class="form-group col-md-6 el-col-md-offset-5" v-if="aparezco === 'SI'">
                    <reporte-proyecto :origin="origen" :state="estado" :proyecto="ProyectoModel"></reporte-proyecto>
                </div>
            </template>
        </div>
</template>
<script>
 import Datepicker from 'vuejs-datepicker'
 import { ModelSelect } from 'vue-search-select'
 import EditTutoria from '../ABM/RegistroTutorias'
 import axios from 'axios'
 import swal from 'sweetalert2'
 import jsPDF from 'jspdf'
 import 'jspdf-autotable'
 import ReporteProyecto from '../ReportProjects'
 /* eslint-disable indent */
 export default {
    components: {
     Datepicker,
     EditTutoria,
     ReporteProyecto,
     ModelSelect
    },
    data () {
     return {
       aparezco: 'NO',
       ProyectoModel: '',
       Proyecto: [],
       PDFcarrera: 'NO',
       mes: null,
       segmento: null,
       segmentoOrigen: null,
       gestion: null,
       i: null,
       actions: 'LIST',
       SelectedIds: [],
       tutoriaLoaded: false,
       initialview: 'year',
       format: 'dd-MM-yyyy',
       opendate: new Date(1975, 5, 1),
       url: '/AsesoriaPostgrado?by=' + this.estado + '-' + this.origen,
       propsToSearch: ['Id', 'Proyecto', 'Modulo', 'TeacherFullName', 'TipoTarea', 'TotalNeto', 'TotalBruto'],
       tableColumns: [
         {
           prop: 'Id',
           field: 'Id',
           label: '#',
           minWidth: 15
         },
         {
           prop: 'Proyecto',
           field: 'Proyecto',
           label: 'Proyecto',
           minWidth: 20
         },
         {
           prop: 'Modulo',
           field: 'Modulo',
           label: 'Módulo',
           minWidth: 20
         },
         {
           prop: 'TeacherFullName',
           field: 'TeacherFullName',
           label: 'Profesor',
           minWidth: 60
         },
         {
           prop: 'TipoTarea',
           field: 'TipoTarea',
           label: 'Tarea',
           minWidth: 20
         },
         {
           prop: 'TotalBruto',
           field: 'TotalBruto',
           label: 'TB',
           minWidth: 25
         },
         {
           prop: 'TotalNeto',
           field: 'TotalNeto',
           label: 'TN',
           minWidth: 25
         },
         {
           prop: 'Ignored',
           field: 'Ignored',
           label: 'Dup',
           minWidth: 10
         }
       ],
       pagination: {
         perPage: 10,
         currentPage: 1,
         perPageOptions: [10, 20, 50],
         total: 0
       },
       tutoria: null,
       create: false,
       allIds: [],
       // variables para el reporte PDF
       selectBranches: [],
       // datos de la tabla
       headers: ['Docente', 'Tarea', 'Modulo', 'Horas', 'Costo Hora', 'Total Bruto', 'Deduccion', 'IUE', 'IT', 'Total Neto', 'Observaciones', 'Dup'],
       careers: [],
       teachers: [],
       records: [],
       recordsD: [],
       careerResult: [],
       teacherResult: [],
       finalResult: [],
       finalResultD: [],
       selectMes: {
         values: [{value: '01', text: 'Enero'},
           {value: '02', text: 'Febrero'},
           {value: '03', text: 'Marzo'},
           {value: '04', text: 'Abril'},
           {value: '05', text: 'Mayo'},
           {value: '06', text: 'Junio'},
           {value: '07', text: 'Julio'},
           {value: '08', text: 'Agosto'},
           {value: '09', text: 'Septiembre'},
           {value: '10', text: 'Octubre'},
           {value: '11', text: 'Noviembre'},
           {value: '12', text: 'Diciembre'},
           {value: '13', text: 'Retroactivo Enero'},
           {value: '14', text: 'Retroactivo Febrero'},
           {value: '15', text: 'Retroactivo Marzo'},
           {value: '16', text: 'Retroactivo Abril'}]
       },
       formError: {
         Mes: {
           active: false,
           message: '*Este valor no puede ser vacio.'
         },
         Gestion: {
           active: false,
           message: '*Este valor no puede ser vacio.'
         },
         Segmento: {
           active: false,
           message: '*Este valor no puede ser vacio.'
         }
       }
     }
   },
    props: {
        // INDEPENDIENTE, DEPENDIENTE, OR
        origen: {
        required: true
        },
        // REGISTRADO, PRE-APROBADO, APROBADO
        estado: {
        required: true
        },
        // Para complementar el titulo del reporte PDF
        tipo: {
        required: true
        }
    },
      methods: {
        toArchivoOR () {
          let data = this.segmento + ';' + this.mes + ';' + this.gestion + ';' + this.segmentoOrigen
          axios.get(this.fileUrl + data,
            {
              responseType: 'arraybuffer',
              headers: {
                'token': localStorage.getItem('token')
              }
            }
          )
            .then(response => {
              const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              })
              const url = window.URL.createObjectURL(blob)
              const link = document.createElement('a')
              link.href = url
              var filename = response.request.getResponseHeader('Content-Disposition')
              link.setAttribute('download', filename.split('filename=')[1])
              document.body.appendChild(link)
              link.click()
              swal({
                title: 'Buen trabajo!!',
                text: 'Se enviaron los registros al historial',
                type: 'success',
                confirmButtonClass: 'btn btn-success btn-fill',
                buttonsStyling: false
              }).then(function () {
                // la página se recarga con frescura :v
                location.reload()
              })
            })
            .catch(error => {
              const blob = new Blob([error.response.data], {type: 'text/plain'})
              const reader = new FileReader()
              let text
              reader.addEventListener('loadend', (e) => {
                text = e.srcElement.result
                console.log(text)
                swal({
                  title: `Ups!`,
                  text: text,
                  buttonsStyling: false,
                  confirmButtonClass: 'btn btn-success btn-fill',
                  type: 'warning'
                })
              })
              reader.readAsText(blob)
            })
        },
        loadBranchData () {
        let regionals = this.selectBranches
        axios.get('branches/')
          .then(response => {
            response.data.forEach(function (element) {
              console.log('Si leo una regional')
              regionals.push({value: element.Id, text: element.Name})
            })
            this.selectBranches = regionals
          })
          .catch(error => console.log(error))
      },
        EraseSelected () {
          if (this.SelectedIds.length === 0) {
            this.SelectedIds = this.allIds
          } else {
            this.SelectedIds = []
          }
        },
        isEmptyBlanckOrNull: function (val) {
          return !val || val.length === 0 || !val.toString().trim()
        },
        // TODO: Esta es la funcion donde envia todo a aprobacion, si es OR lo manda directo
        UpdateState () {
          var vm = this
          if (vm.SelectedIds.length < 1) {
            swal({
              title: 'Debe seleccionar al menos un registro antes de enviar a pre-aprobación.',
              text: 'Intentelo nuevamente.',
              type: 'error',
              confirmButtonClass: 'btn btn-info btn-fill',
              buttonsStyling: false
            })
          } else {
            if (vm.SelectedIds.length > 200) {
              swal({
                title: 'No se puede enviar más de 200 registros a pre-aprobación.',
                text: 'Intentelo nuevamente con menos registros.',
                type: 'error',
                confirmButtonClass: 'btn btn-info btn-fill',
                buttonsStyling: false
              })
            } else {
              swal({
                title: 'Se enviaran a Pre-Aprobación ' + vm.SelectedIds.length + ' registros.',
                text: '¿Esta seguro?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, enviar!',
                cancelButtonText: 'No, cancelar',
                confirmButtonClass: 'btn btn-success btn-fill',
                cancelButtonClass: 'btn btn-danger btn-fill',
                buttonsStyling: false
              }).then(function () {
                axios.put('ToVerificacionPost?myArray=' + vm.SelectedIds.join())
                    .then(response => {
                      swal({
                        title: 'Buen trabajo!!',
                        text: 'Se enviaron los registros a pre-aprobación',
                        type: 'success',
                        confirmButtonClass: 'btn btn-success btn-fill',
                        buttonsStyling: false
                      }).then(function () {
                        // la página se recarga con frescura :v
                        // location.reload()
                      })
                    })
                    .catch(error => swal({
                      title: 'Hubo un problema al enviar los registros',
                      text: error,
                      type: 'error',
                      confirmButtonClass: 'btn btn-info btn-fill',
                      buttonsStyling: false
                    }))
              }, function (dismiss) {
                if (dismiss === 'cancel') {
                  swal({
                    title: 'Cancelado',
                    text: 'No se envió ningún registro a pre-aprobación',
                    type: 'error',
                    confirmButtonClass: 'btn btn-info btn-fill',
                    buttonsStyling: false
                  })
                }
              })
            }
          }
        },
        // ta gueno
        errorMessage: function (text) {
          swal({
            title: `Ups!`,
            text: 'Ocurrio un error!\n' + text,
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-success btn-fill',
            type: 'error'
          })
        },
        UpdateIds () {
          this.$emit('childinfo', this.SelectedIds)
        },
        Modify (index) {
          this.i = index
          this.actions = 'MODIFY'
        },
        Back () {
          this.actions = 'LIST'
        },
        // SON LOS IDs necesarios para marcar todo lo que esta en la tabla
        loadTutoriaIds () {
        let id = this.allIds
        axios.get('AsesoriaPostgrado?by=' + this.estado + '-' + this.origen)
          .then(response => {
            response.data.forEach(function (element) {
              // console.log(6
              id.push(element.Id)
            })
            this.allIds = id
          })
          .catch(error => console.log(error + 'Im here cause I messed up'))
        },
        removeAccess (index) {
          swal({
            title: 'Estas Seguro?',
            text: 'No será posible volver atras!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, borrar!',
            cancelButtonText: 'No, cancelar',
            confirmButtonClass: 'btn btn-success btn-fill',
            cancelButtonClass: 'btn btn-danger btn-fill',
            buttonsStyling: false
          }).then(function () {
            axios.delete('DeleteRecord/' + index)
              .then(response => {
                swal({
                  title: 'Eliminado!',
                  text: 'Se elimino de forma correcta',
                  type: 'success',
                  confirmButtonClass: 'btn btn-success btn-fill',
                  buttonsStyling: false
                }).then(function () {
                  // la página se recarga con frescura :v
                  location.reload()
                })
              })
              .catch(error => swal({
                title: 'No se pudo eliminar el registro',
                text: error.response.data.Message,
                type: 'error',
                confirmButtonClass: 'btn btn-info btn-fill',
                buttonsStyling: false
              }))
          }, function (dismiss) {
            if (dismiss === 'cancel') {
              swal({
                title: 'Cancelado',
                text: 'Este item está a salvo :)',
                type: 'error',
                confirmButtonClass: 'btn btn-info btn-fill',
                buttonsStyling: false
              })
            }
          })
        },
        date_function () {
          this.formattedDate = this.convert()
        },
        convert () {
          let date = new Date()
          let mnth = ('0' + (date.getMonth() + 1)).slice(-2)
          let day = ('0' + date.getDate()).slice(-2)
          return [day, mnth, date.getFullYear()].join('-')
        },
        con () {
          console.log('kheeee' + this.searchQueryProp)
        },
        // Metodo para generar el reporte
        generatePDF () {
        // Para que sea largo
        let doc = new jsPDF('landscape')
        doc.setFontSize(8)
        doc.text('Fecha:' + this.formattedDate, 280, 10, null, null, 'right')
        doc.text('Fuente: ISAAC II', 280, 15, null, null, 'right')
        var img = new Image()
        img.src = './../static/img/logo_ucb3.png'
        doc.addImage(img, 'PNG', 14, 10, 20, 29)
        doc.setFontSize(18)
        doc.setFontStyle('bold')
        doc.text('Universidad Católica Boliviana "San Pablo" ', 85, 25)
        doc.setFontSize(15)
        doc.text('Actividades Académicas en Postgrado para ' + this.tipo, 85, 32)
        // Para controlar donde comienza el reporte en el eje Y
        let y = 54
        // Para no volver a pasar por un mismo índice de los registros de tutorías
        let index = 0
        // Iteración basada en el número de carreras --> número de tablas a generar
        for (let i = 0; i < this.careers.length; i++) {
          // Nombre de la carrera para filtro
          let careerName = this.careers[i]

          console.log('aqui puej:' + this.careers[i] + i)
          doc.autoTable({
            startY: y,
            head: [
              [
                {
                  content: careerName,
                  colSpan: 12,
                  styles: {halign: 'center', fillColor: [241, 196, 15]}
                }
              ]
            ],
            theme: 'grid'
          })
          // -----------------------------------Para generar la tabla con registros-------------------------------------
          // Para obtener el conteo de filas para la tabla: ocurrencias de la carrera en registros PRE-APROBADOS
          let tableLength = this.records.filter(function (tutoria) {
            console.log(tutoria.Proyecto + '=' + careerName)
            return tutoria.Proyecto === careerName
          }).length
          console.log('El número de filas para la carrera: ' + careerName + ' es:' + tableLength)
          // Cuerpo de la tabla
          let files = this.records
          let tableBody = []
          for (var tableIndex = index; tableIndex < index + tableLength; tableIndex++) {
            // Crear un array de arrays con los elementos que correspondan
            tableBody.push([files[tableIndex].TeacherFullName, files[tableIndex].Alumno, files[tableIndex].TipoTarea, files[tableIndex].Modulo, files[tableIndex].Horas, files[tableIndex].MontoHora, files[tableIndex].Total_Bruto, files[tableIndex].Deduccion, files[tableIndex].IUE, files[tableIndex].IT, files[tableIndex].IUEExt, files[tableIndex].Total_Neto, files[tableIndex].Observaciones, files[tableIndex].Dup])
          }
          // console.log('this is the body with results: ')
          // console.log(tableBody)
          // Para no recorrer el array desde su primera posicion
          index = index + tableLength
          // cargamos la tabla con el cuerpo para la carrera actual
          doc.autoTable({
            startY: doc.previousAutoTable.finalY,
            head: [['Docente', 'Alumno', 'Tarea', 'Modulo', 'Horas', 'Costo Hora', 'Total Bruto', 'Deduccion', 'RCIVA', 'IT', 'IUEExt', 'Total Neto', 'Observaciones', 'Dup']],
            body: tableBody,
            theme: 'grid',
            styles: {cellPadding: 0.5, fontSize: 8, cellWidth: 'wrap', valign: 'middle'},
            headStyles: {
              fillColor: [4, 134, 230],
              fontSize: 8
            },
            // Las posiciones de los nombres y las observaciones se mantienen estáticas
            columnStyles: {
              text: {cellWidth: 'auto', valign: 'center'},
              0: {cellWidth: 45},
              1: {cellWidth: 45},
              2: {cellWidth: 10},
              3: {cellWidth: 40},
              4: {cellWidth: 10},
              5: {cellWidth: 14},
              6: {cellWidth: 12},
              7: {cellWidth: 12},
              8: {cellWidth: 12},
              9: {cellWidth: 12},
              10: {cellWidth: 10},
              11: {cellWidth: 12},
              12: {cellWidth: 25},
              13: {cellWidth: 10}
            }
          })
          // -------------------------------------Tabla con totales por carrera-----------------------------------------
          let careerResults = this.careerResult.filter(function (result) {
            return result.Proyecto === careerName
          })
          let resultBody = []
          resultBody.push([careerResults[0].Total_Bruto, careerResults[0].Deduccion, careerResults[0].IUE, careerResults[0].IT, careerResults[0].IUEExt, careerResults[0].Total_Neto])
          doc.autoTable({
            startY: doc.previousAutoTable.finalY,
            // para que aparezca debajo de los montos
            margin: {left: 178.2},
            theme: 'grid',
            body: resultBody,
            columnStyles: {0: {cellWidth: 12}, 1: {cellWidth: 12}, 2: {cellWidth: 12}, 3: {cellWidth: 12}, 4: {cellWidth: 10}, 5: {cellWidth: 12}},
            styles: {cellPadding: 0.5, fontSize: 8, fillColor: [222, 222, 222], fontStyle: 'bold'}
          })
          // Reset del cuerpo para otras carreras y sus resultados
          tableBody = []
          resultBody = []
          // para que el próximo título se posicione después de la tabla
          y = doc.previousAutoTable.finalY + 10
        }
        // ---------------------------------------Generar la tabla con costos finales ----------------------------------
        doc.autoTable({
          startY: y,
          theme: 'grid',
          body: this.finalResult,
          margin: {left: 178.2},
          columnStyles: {0: {cellWidth: 12}, 1: {cellWidth: 12}, 2: {cellWidth: 12}, 3: {cellWidth: 12}, 4: {cellWidth: 10}, 5: {cellWidth: 12}},
          styles: {cellPadding: 0.5, fontSize: 8, fillColor: [222, 222, 222], fontStyle: 'bold'}
        })
        doc.setFontSize(8)
        doc.setFontStyle('normal')
        doc.text('Reporte generado por: ' + this.username, 14, y + (205 - y) - 10)
        doc.save('ReporteAgrupadoPostgrado.pdf')
        return doc
      },
      loadCareerBody () {
        if (this.origen === 'DEPEN') {
          this.origen = 'DEPEN'
        }
        // Cargar el cuerpo, es decir datos por carrera
        let rec = this.records
        axios.get('PDFReportBodyPostgrado?part=Body;' + this.estado + ';' + this.origen)
          .then(response => {
            response.data.forEach(function (tutoria) {
              rec.push(tutoria)
            })
          })
          .catch(error => console.log(error))
        if (this.origen === 'DEPEN') {
          this.origen = 'DEPEN'
        }
      },
      loadCareerTotals () {
        // Cargar el agrupado por carrera, montos Totales
        // Cargamos los nombres de las carreras
        if (this.origen === 'DEPEN') {
          this.origen = 'DEPEN'
        }
        let uniqueCareers = this.careers
        let currentResults = this.careerResult
        axios.get('PDFReportBodyPostgrado?part=Results;' + this.estado + ';' + this.origen)
          .then(response => {
            response.data.forEach(function (element) {
              uniqueCareers.push(element.Proyecto)
              currentResults.push(element)
            })
          })
          .catch(error => console.log(error))
        if (this.origen === 'DEPEN') {
          this.origen = 'DEPEN'
        }
      },
        loadAllTotals () {
            if (this.origen === 'DEPEN') {
              this.origen = 'DEPEN'
            }
              // Cargar el total de todas las regionales que ve el usuario
              let final = this.finalResult
              axios.get('PDFReportBodyPostgrado?part=FinalResult;' + this.estado + ';' + this.origen)
                .then(response => {
                  response.data.forEach(function (element) {
                  final.push([element.Total_Bruto, element.Deduccion, element.IUE, element.IT, element.IUEExt, element.Total_Neto])
                  })
                })
                .catch(error => console.log(error))
                if (this.origen === 'DEPEN') {
                this.origen = 'DEPEN'
              }
        },
        sayMyName () {
          axios.get('auth/UserData')
            .then(response => {
              this.username = response.data
              console.log(this.username + ' is the user who does the report')
            })
            .catch(error => console.log(error))
        }
      },
   created () {
     this.date_function()
     this.loadTutoriaIds()
    // para el reporte
     this.loadCareerBody()
     this.loadCareerTotals()
     this.loadAllTotals()
// Docente PDF
     this.loadBranchData()
     this.sayMyName()
   }
}
  </script>
  <style>
    .btn-group {
      margin: 20px;
    }
    input[type=radio] {
      margin: 0 10px 0 10px;
    }
    /* Estilo para los botones de acción */
  .itemAct{
    margin-right: 10px; /* Añade un pequeño margen entre los botones */
    color: #568da7;
    font-size: 15px;
  }
  .itemDel{
    margin-right: 10px; /* Añade un pequeño margen entre los botones */
    color: #ff3029;
    font-size: 15px;
  }
  
  .itemApr{
    margin-left: 8px; /* Añade un margen a la izquierda del checkbox */
    width: 15px; /* Ancho del checkbox */
    height: 15px; /* Altura del checkbox */
  }
  </style>