<template>
    <div class="row">
      <div class="col-md-12 card">
        <data-tables
          v-bind="{ url, propsToSearch, tableColumns, pagination, fuentePDF: 'ISAAC PREGRADO' }"
        >
        </data-tables>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data () {
      return {
        url: '/AsesoriaDocente/Estado',
        propsToSearch: ['Id', 'TeacherFullName', 'StudentFullName', 'Estado', 'CreatedAt'],
        tableColumns: [
        { prop: 'Id', label: '#', minWidth: 50 },
        { prop: 'TeacherFullName', label: 'Docente', minWidth: 200 },
        { prop: 'StudentFullName', label: 'Estudiante', minWidth: 200 },
        { prop: 'Estado', label: 'Estado', minWidth: 100 },
        { prop: 'CreatedAt', label: 'Fecha De Creación', minWidth: 150, formatter: row => row.CreatedAt ? `${String(new Date(row.CreatedAt).getDate()).padStart(2, '0')}/${String(new Date(row.CreatedAt).getMonth() + 1).padStart(2, '0')}/${new Date(row.CreatedAt).getFullYear()} ${String(new Date(row.CreatedAt).getHours()).padStart(2, '0')}:${String(new Date(row.CreatedAt).getMinutes()).padStart(2, '0')}` : '' }
        ],
        pagination: {
          perPage: 10,
          currentPage: 1,
          perPageOptions: [10, 20, 50],
          total: 0
        }
      }
    }
  }
  </script>
  
  <style>
  .custom-card {
    background-color: #f8f9fa;
    padding: 20px;
  }
  
  .input-search {
    width: 50%;
    margin: 0 auto 10px;
    padding: 10px;
    border: 1px solid #ced4da;
    border-radius: 5px;
    font-size: 18px;
  }
  
  .result-message, .no-results-message, .initial-message {
    font-size: 20px;
    color: #333;
    margin: 0;
    font-weight: bold;
  }
  
  .result-message {
    color: #28a745;
  }
  
  .no-results-message {
    color: #dc3545;
  }
  </style>
  