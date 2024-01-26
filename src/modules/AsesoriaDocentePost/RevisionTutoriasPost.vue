<template>
    <div>
      <div class="row">
        <div class="col-md-12">
          <div class="card card-wizard" id="wizardCard">
            <div class="tabs-container">
              <div v-for="(tab, index) in tabs" :key="index" @click="handleTabClick(index)" :class="{ active: actualTab === index }">
                <i :class="tab.icon"></i>
                <span>{{ tab.title }}</span>
              </div>
            </div>
            <div v-for="(tab, index) in tabs" :key="index" v-show="actualTab === index">
              <FirstStep
                ref="firstStepComponent"
                v-if="actualTab === index"
                :estado="tab.estado"
                :origen="tab.origen"
                :tipo="tab.tipo"
              ></FirstStep>
            </div>
            <div class="buttonsOptions">
              <button class="btn btn-info btn-fill btn-wd btn-back" :disabled="actualTab === 0" @click="prevTab">Atras</button>
              <button class="btn btn-fill btn-wd btn-next" :disabled="actualTab === tabs.length - 1" @click="nextTab">Siguiente</button>
              <button class="btn btn-warning btn-fill btn-wd" @click="volverAHistorial">Finalizar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import FirstStep from './Steps/AprobacionFirstStep'
  import SecondStepAll from './Steps/AprobacionSecondStep'
  import router from '../../router'
  
  export default {
    components: {
      FirstStep,
      SecondStepAll
    },
    data () {
      return {
        actualTab: 0,
        tabs: [
          { title: 'Verificación Dependientes', icon: 'fa fa-user-check', estado: 'REGISTRADO', origen: 'DEPEN', tipo: 'dependientes' },
          { title: 'Verificación Independientes', icon: 'fa fa-user-check', estado: 'REGISTRADO', origen: 'INDEP', tipo: 'independientes' },
          { title: 'Verificación Otras Regionales', icon: 'fa fa-user-check', estado: 'REGISTRADO', origen: 'OR', tipo: 'otras regionales' },
          { title: 'Verificación Servicios con Factura', icon: 'fa fa-user-check', estado: 'REGISTRADO', origen: 'FAC', tipo: 'factura' },
          { title: 'Verificación Extranjeros', icon: 'fa fa-user-check', estado: 'REGISTRADO', origen: 'EXT', tipo: 'extranjero' }
        ]
      }
    },
    methods: {
      handleTabClick (index) {
        this.actualTab = index
      },
      prevTab () {
        if (this.actualTab > 0) {
          this.actualTab -= 1
        }
      },
      nextTab () {
        if (this.actualTab < this.tabs.length - 1) {
          this.actualTab += 1
        }
      },
      volverAHistorial () {
        router.push('../AsesoriaDocente')
      },
      // Método para acceder al componente FirstStep
      getFirstStepComponent () {
        return this.$refs.firstStepComponent
      }
    }
  }
  </script>
  
  <style scoped>
  .tabs-container {
    display: flex;
    width: 100%;
    overflow-x: auto;
    background-color: #1c3b6c; /* Color de fondo de las pestañas */
    margin-bottom: 20px;
    font-size: 15px;
    height: auto;
  }
  
  .tabs-container div {
    cursor: pointer;
    text-align: center;
    padding: 15px; /* Aumenta el espacio interno para hacer clic más fácil en dispositivos táctiles */
    background-color: #1c3b6c;
    color: #ffffff;
    flex: 1;
    white-space: nowrap;
    border-bottom: 2px solid #ffffff; /* Añade un borde en la parte inferior para separar las pestañas */
    transition: background-color 0.3s ease; /* Agrega una transición de color suave */
  }
  
  .tabs-container div.active {
    background-color: #f0b22b;
    font-weight: bold;
  }
  .buttonsOptions {
    text-align: center;
    margin-top: 30px;
  }
  
  .buttonsOptions button {
    margin: 0 5px; /* Añade un margen a los botones para separarlos ligeramente */
  }
  
  @media (max-width: 768px) {
    .tabs-container {
      flex-direction: column;
    }
  
    .tabs-container div {
      flex: none; /* Establece el ancho de cada pestaña a su contenido en pantallas pequeñas */
      width: 100%;
    }
  }
  </style>
  
  
  