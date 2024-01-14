<template>
  <div class="row-UO">
    <div class="card-UO">
      <div class="search-bar-UO">
        <input v-model="searchTerm" @input="handleSearch" placeholder="Buscar por código, denominación, gestión, ámbito y directriz" class="search-input-UO" />
        <button class="buttonPdf-UO" @click="generatePDF">Generar PDF</button>
        <button class="buttonExcel-UO" @click="generateExcel">Generar Excel</button>
      </div>

      <!-- Tabla para mostrar los resultados -->
      <table class="custom-table-UO">
        <thead>
          <tr>
            <th v-for="(column, index) in tableColumns" :key="index">{{ column.label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in paginatedData" :key="rowIndex">
            <td v-for="(value, columnIndex) in row" :key="columnIndex">{{ value }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Paginación personalizada -->
      <div class="custom-pagination-UO">
        <button class="anterior" @click="prevPage" :disabled="currentPage === 1">Anterior</button>
        <span class="spanPage">{{ currentPage }} de {{ totalPages }}</span>
        <button class= "siguiente" @click="nextPage" :disabled="currentPage === totalPages">Siguiente</button>
      </div>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import jsPDF from 'jspdf'
  import * as XLSX from 'xlsx'

  export default {
    data () {
      return {
        searchTerm: '',
        tableColumns: [
          { label: 'Código', prop: 'PrcCode' },
          { label: 'Denominación', prop: 'PrcName' },
          { label: 'Gestión', prop: 'U_GestionCC' },
          { label: 'Válido Desde', prop: 'ValidFrom' },
          { label: 'Válido Hasta', prop: 'ValidTo' },
          { label: 'Ámbito', prop: 'U_AmbitoPEI' },
          { label: 'Dorectriz', prop: 'U_DirectrizPEI' }
        ],
        filteredData: [],
        currentPage: 1,
        pageSize: 10 // Cantidad de elementos por página
      }
    },
    watch: {
      searchTerm: 'handleSearch'
    },
    computed: {
      totalPages () {
        return Math.ceil(this.filteredData.length / this.pageSize)
      },
      paginatedData () {
        const startIndex = (this.currentPage - 1) * this.pageSize
        const endIndex = startIndex + this.pageSize
        return this.filteredData.slice(startIndex, endIndex)
      }
    },
    methods: {
      async generateExcel () {
        try {
          // Obtener datos completos
          const allData = await this.getDataFromURL()
          // Generar Excel de resultados de la búsqueda si existen
          if (this.filteredData.length > 0) {
            const wbSearch = XLSX.utils.book_new()
            const wsSearch = XLSX.utils.aoa_to_sheet([['Código', 'Denominación', 'Gestión', 'Ámbito', 'Directriz']])
            const excludedColumnsIndices = [3, 4, 7]
            const filteredDataSearch = this.filteredData.map(row => row.filter((_, index) => !excludedColumnsIndices.includes(index)))
            XLSX.utils.sheet_add_aoa(wsSearch, filteredDataSearch, { origin: 'A2' })
            XLSX.utils.book_append_sheet(wbSearch, wsSearch, 'Hoja1')
            // Descargar el archivo Excel de resultados de la búsqueda
            XLSX.writeFile(wbSearch, 'PEI_Busqueda.xlsx')
          } else {
            // Generar Excel de toda la respuesta
            const wbAll = XLSX.utils.book_new()
            const wsAll = XLSX.utils.aoa_to_sheet([['Código', 'Denominación', 'Gestión', 'Ámbito', 'Directriz']])
            const excludedColumnsIndices = [3, 4, 7]
            const filteredDataAll = allData.map(row => row.filter((_, index) => !excludedColumnsIndices.includes(index)))
            XLSX.utils.sheet_add_aoa(wsAll, filteredDataAll, { origin: 'A2' })
            XLSX.utils.book_append_sheet(wbAll, wsAll, 'Hoja1')
            // Descargar el archivo Excel de toda la respuesta
            XLSX.writeFile(wbAll, 'PEI_Completa.xlsx')
          }
        } catch (error) {
          console.error('Error al obtener datos:', error)
        }
      },
      async generatePDF () {
        try {
          // Obtener datos completos
          const allData = await this.getDataFromURL()
          // Generar PDF de resultados de la búsqueda si existen
          if (this.filteredData.length > 0) {
            const pdfSearch = new jsPDF({
              orientation: 'landscape',
              unit: 'mm',
              format: 'letter'
            })
            this.generatePDFContent(pdfSearch, this.filteredData)
            // Guardar el PDF de resultados de la búsqueda
            pdfSearch.save('PEI_Busqueda.pdf')
          } else {
            // Generar PDF de toda la respuesta
            const pdfAll = new jsPDF({
              orientation: 'landscape',
              unit: 'mm',
              format: 'letter'
            })
            this.generatePDFContent(pdfAll, allData)
            // Guardar el PDF de toda la respuesta
            pdfAll.save('PEI_Completa.pdf')
          }
        } catch (error) {
          console.error('Error al obtener datos:', error)
        }
      },
      generatePDFContent (pdf, data) {
        // console.log('estoy en el pdf de PIE: ', data)
        // Armando la cabecera para el reporte
        var img = new Image()
        img.src = './../static/img/logo_ucb3.png'
        pdf.addImage(img, 'png', 14, 10, 20, 29)
        pdf.setFontSize(8)
        pdf.setFontStyle('bold')
        pdf.setFontSize(18)
        pdf.text('Información PEI', 145, 25, null, null, 'center')
        // Agrega la información de la tabla al PDF
        pdf.setFontSize(14)
        pdf.text('Universidad Católica Boliviana "San Pablo"', 20, 10)
        const headers = ['Código', 'Denominación', 'Gestión', 'Válido Desde', 'Válido Hasta', 'Ámbito', 'Directriz', 'U_Indicador']
        const excludedColumnsIndices = [3, 4, 7] // Índices de las columnas a excluir
        // Filtra las columnas que no están en la lista de excluidos
        const filteredHeaders = headers.filter((_, index) => !excludedColumnsIndices.includes(index))
        const filteredData = data.map(row => row.filter((_, index) => !excludedColumnsIndices.includes(index)))
        pdf.autoTable({ head: [filteredHeaders], body: filteredData, startY: 40 })
      },
      async getDataFromURL () {
        try {
          const response = await axios.get('/CostCenters/PEI')
          // Convierte la respuesta a una matriz bidimensional
          this.allData = response.data.map((item) => Object.values(item))
          return this.allData
        } catch (error) {
          console.error('Error al obtener datos:', error)
          return [] // o manejar el error de alguna manera
        }
      },
      handleSearch () {
        // Filtrar los datos basados en el término de búsqueda
        this.filteredData = this.allData.filter((row) =>
          row.some((value) =>
            value.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
          )
        )
        // Actualizar la página actual al realizar una nueva búsqueda
        this.currentPage = 1
      },
      prevPage () {
        if (this.currentPage > 1) {
          this.currentPage -= 1
        }
      },
      nextPage () {
        if (this.currentPage < this.totalPages) {
          this.currentPage += 1
        }
      }
    },
    async created () {
      await this.getDataFromURL()
      this.handleSearch()
    }
  }
</script>
<style>
.row-UO {
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-UO {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
}

.search-bar-UO {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  width: 50%;
  margin: 0 auto;
}

.search-input-UO {
  flex: 1;
  padding: 10px;
  border: 3px solid #363636;
  border-radius: 5px;
  margin-right: 10px;
}

.buttonPdf-UO,
.buttonExcel-UO {
  padding: 10px;
  border-radius: 20px;
  font-weight: bold;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
}

.buttonPdf-UO {
  background-color: #2d5abd;
  color: #fafafa;
  margin: 10px;
}

.buttonPdf-UO:hover {
  background-color: #f74848;
  color: #ffffff;
}

.buttonExcel-UO {
  background-color: #2d5abd;
  color: #ffffff;
}

.buttonExcel-UO:hover {
  background-color: #37b642;
  color: #ffffff;
}

.custom-table-UO {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.custom-table-UO th,
.custom-table-UO td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.custom-table-UO th {
  background-color: #2d5abd;
  color: #ffffff;
}

.custom-table-UO tr:hover {
  background-color: #f5f5f5;
}

.custom-pagination-UO {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}

.siguiente {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 15px;
  font-weight: bold;
}

.siguiente:hover {
  background-color: #45a049;
}

.siguiente:disabled {
  background-color: #dddddd;
  color: #666666;
  cursor: not-allowed;
}
.anterior {
  background-color: #f59619;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 15px;
  font-weight: bold;
}

.anterior:hover {
  background-color: #e48101;
}

.anterior:disabled {
  background-color: #dddddd;
  color: #666666;
  cursor: not-allowed;
}

.spanPage {
font-weight: bold;
font-size: 15px;
}
</style>
