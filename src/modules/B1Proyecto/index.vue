<template>
  <div class="row">
    <div class="card">
      <data-tables v-bind="{url, propsToSearch, tableColumns,pagination,actions}">
      </data-tables>
      <button class="buttonPdf" @click="generatePDF">Generar PDF</button>
      <button class="buttonExcel" @click="generateExcel">Generar Excel</button>
    </div>  
  </div>
</template>
<script>
  import jsPDF from 'jspdf'
  import * as XLSX from 'xlsx'
  import Vue from 'vue'
  import {Tooltip} from 'element-ui'
  import axios from 'axios'
  Vue.use(Tooltip)
  export default {
    data () {
      return {
        actions: false,
        url: '/CostCenters/Proyectos/',
        propsToSearch: ['PrjCode', 'PrjName', 'ValidTo', 'U_ModalidadProy', 'U_Sucursal', 'U_Tipo', 'U_PEI_PO'],
        tableColumns: [
          {
            prop: 'PrjCode',
            label: '#',
            minWidth: 40
          },
          {
            prop: 'PrjName',
            label: 'Nombre  ',
            minWidth: 150
          },
          {
            prop: 'ValidTo',
            label: 'Valido Hasta',
            minWidth: 80
          },
          {
            prop: 'U_ModalidadProy',
            label: 'Modalidad',
            minWidth: 35
          },
          {
            prop: 'U_Sucursal',
            label: 'Sucursal',
            minWidth: 35
          },
          {
            prop: 'U_Tipo',
            label: 'Tipo',
            minWidth: 35
          },
          {
            prop: 'U_PEI_PO',
            label: 'PEI/PO',
            minWidth: 35
          },
          {
            prop: 'U_UORGANIZA',
            label: 'Unidad Org.',
            minWidth: 20
          }
        ],
        pagination: {
          perPage: 5,
          currentPage: 1,
          perPageOptions: [5, 10, 20],
          total: 0
        }
      }
    },
    methods: {
      async generateExcel () {
        const data = await this.getDataFromURL()
        // Crear una nueva hoja de trabajo
        const ws = XLSX.utils.aoa_to_sheet([['Código Proyecto', 'Nombre Proyecto', 'Locked', 'Data Source', 'Activo', 'Modalidad', 'Sucursal', 'Tipo', 'Unidad Organizacional', 'PEI/PO']])
        // Aplicar estilos a la primera fila
        const range = XLSX.utils.decode_range('A1:L1')
        // Excluir columnas (4 y 5 en este ejemplo)
        const excludedColumnsIndices = [4, 5]
        const filteredData = data.map(row => row.filter((_, index) => !excludedColumnsIndices.includes(index)))
        // Agregar datos a la hoja de trabajo
        XLSX.utils.sheet_add_aoa(ws, filteredData, { origin: 'A2' })
        // Crear un libro de trabajo y agregar la hoja de trabajo
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Hoja1')
        // Descargar el archivo Excel
        XLSX.writeFile(wb, 'Proyectos.xlsx')
      },
      async generatePDF () {
        const data = await this.getDataFromURL()
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'letter'
        })
        // Armando la cabecera para el reporte
        var img = new Image()
        img.src = './../static/img/logo_ucb3.png'
        pdf.addImage(img, 'png', 14, 10, 20, 29)
        pdf.setFontSize(8)
        pdf.setFontStyle('bold')
        pdf.setFontSize(18)
        pdf.text('Universidad Católica Boliviana "San Pablo" ', 145, 25, null, null, 'center')
        // Agrega la información de la tabla al PDF
        pdf.setFontSize(14)
        pdf.text('Información Proyectos', 20, 10)
        const headers = ['Código Proyecto', 'Nombre Proyecto', 'Locked', 'Data Source', 'Válido Desde', 'Válido Hasta', 'Activo', 'Modalidad', 'Sucursal', 'Tipo', 'Unidad Organizacional', 'PEI/PO']
        const excludedColumnsIndices = [4, 5] // Índices de las columnas a excluir
        // Filtra las columnas que no están en la lista de excluidos
        const filteredHeaders = headers.filter((_, index) => !excludedColumnsIndices.includes(index))
        const filteredData = data.map(row => row.filter((_, index) => !excludedColumnsIndices.includes(index)))
        // Utiliza los headers y data filtrados
        pdf.autoTable({ head: [filteredHeaders], body: filteredData, startY: 40 }) // Ajusta la posición de inicio de la tabla
        // Guarda el PDF o abre en una nueva ventana
        pdf.save('Proyectos.pdf')
      },
      async getDataFromURL () {
        try {
          const response = await axios.get('/CostCenters/Proyectos')
          // Convierte la respuesta a una matriz bidimensional
          const dataArray = response.data.map(item => Object.values(item))
          return dataArray
        } catch (error) {
          console.error('Error al obtener datos:', error)
          return [] // o manejar el error de alguna manera
        }
      }
    },
    created () {
      this.getDataFromURL()
    }
  }
</script>
<style>
  .card {
    margin: 20px;
    padding: 20px;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
  }
  .buttonPdf {
    margin-left: 10px;
    padding: 10px;
    border-radius: 20px;
    background-color: #2d5abd;
    font-weight: bold;
    color:#f8d94d;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
  }
  .buttonPdf:hover {
    background-color: #f8d94d;
    color: #2d5abd;
  }
  .buttonExcel {
    margin-left: 10px;
    padding: 10px;
    border-radius: 20px;
    background-color: #2aa74f;
    font-weight: bold;
    color:#ffffff;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
  }
  .buttonExcel:hover {
    background-color: #98ffa0;
    color: #21348b;
  }
</style>
