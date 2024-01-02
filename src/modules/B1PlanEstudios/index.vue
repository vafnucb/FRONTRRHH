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
        url: '/CostCenters/Careers/',
        propsToSearch: ['PrcCode', 'PrcName', 'ValidFrom', 'ValidTo'],
        tableColumns: [
          {
            prop: 'PrcCode',
            label: '#',
            minWidth: 80
          },
          {
            prop: 'PrcName',
            label: 'Nombre  ',
            minWidth: 120
          },
          {
            prop: 'ValidFrom',
            label: 'Valido Desde',
            minWidth: 120
          },
          {
            prop: 'ValidTo',
            label: 'Valido Hasta',
            minWidth: 120
          },
          {
            prop: 'UO',
            label: 'Unidad Organizacional',
            minWidth: 120
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
        const ws = XLSX.utils.aoa_to_sheet([['Código', 'Nombre', 'Cód Unidad Organizacional', 'Cód Segmento']])
        const excludedColumnsIndices = [2, 3, 4, 5, 8]
        const filteredData = data.map(row => row.filter((_, index) => !excludedColumnsIndices.includes(index)))
        XLSX.utils.sheet_add_aoa(ws, filteredData, { origin: 'A2' })
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Hoja1')
        XLSX.writeFile(wb, 'Programa_Académico.xlsx')
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
        pdf.text('Información Programa Académico', 20, 10)
        const headers = ['Código', 'Nombre', 'Válido Desde', 'Válido Hasta', 'Num Int Car', 'Cód Departamental', 'Cód Unidad Organizacional', 'Cód Segmento', 'Branches']
        const excludedColumnsIndices = [2, 3, 4, 5, 8] // Índices de las columnas a excluir
        // Filtra las columnas que no están en la lista de excluidos
        const filteredHeaders = headers.filter((_, index) => !excludedColumnsIndices.includes(index))
        const filteredData = data.map(row => row.filter((_, index) => !excludedColumnsIndices.includes(index)))
        // Utiliza los headers y data filtrados
        pdf.autoTable({ head: [filteredHeaders], body: filteredData, startY: 40 }) // Ajusta la posición de inicio de la tabla
        // Guarda el PDF o abre en una nueva ventana
        pdf.save('Programa Académico.pdf')
      },
      async getDataFromURL () {
        try {
          const response = await axios.get('/CostCenters/Careers/')
          // Convierte la respuesta a una matriz bidimensional
          const dataArray = response.data.map(item => Object.values(item))
          console.log('OBTENGOOOOOOOO TODOOOO', dataArray)
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