<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <div class="card card-wizard" id="wizardCard">
<<<<<<< HEAD
          
          <form-wizard
            shape="tab"
            title="Aprobación de Lote Pregrado"
            error-color="#D32F2F"
            color="#FFA000"
            subtitle="Seleccionar el tipo de vinculación"
            @on-change="handleValidation"
          >
            <tab-content title="Validación Dependientes"
                         icon="fa fa-user-check">
              <!--<FirstStep v-if="actualTab == 0" v-bind:estado="'REGISTRADO'" v-bind:origen="'OR'" v-bind:tipo="'otras regionales'"></FirstStep>-->
              <FirstStep v-if="actualTab == 0" v-bind:estado="'VERIFICADO'" v-bind:origen="'DEP'" v-bind:tipo="'dependientes'"></FirstStep>
            </tab-content>
            <tab-content title="Validación Independientes"
                         icon="fa fa-user-check">
              <FirstStep v-if="actualTab == 1" v-bind:estado="'VERIFICADO'" v-bind:origen="'INDEP'" v-bind:tipo="'independientes'"></FirstStep>
            </tab-content>
            <tab-content title="Validación Otras Regionales"
                         icon="fa fa-user-check">
              <FirstStep v-if="actualTab == 2" v-bind:estado="'VERIFICADO'" v-bind:origen="'OR'" v-bind:tipo="'otras regionales'"></FirstStep>

              <!--<FirstStep v-if="actualTab == 2" v-bind:estado="'REGISTRADO'" v-bind:origen="'DEP'" v-bind:tipo="'dependientes'"></FirstStep>-->
            </tab-content>
            <tab-content title="Validación Servicios con Factura"
                         icon="fa fa-user-check">
              <FirstStep v-if="actualTab == 3" v-bind:estado="'VERIFICADO'" v-bind:origen="'FAC'" v-bind:tipo="'factura'"></FirstStep>

              <!--<FirstStep v-if="actualTab == 2" v-bind:estado="'REGISTRADO'" v-bind:origen="'DEP'" v-bind:tipo="'dependientes'"></FirstStep>-->
            </tab-content>
            <tab-content title="Validación Extranjeros"
                         icon="fa fa-user-check">
              <FirstStep v-if="actualTab == 4" v-bind:estado="'VERIFICADO'" :origen="'EXT'" v-bind:tipo="'extranjero'"></FirstStep>

              <!--<FirstStep v-if="actualTab == 2" v-bind:estado="'REGISTRADO'" v-bind:origen="'DEP'" v-bind:tipo="'dependientes'"></FirstStep>-->
            </tab-content>
            <tab-content title="Aprobación"
                         icon="fa fa-university">
              <SecondStepAll v-if="actualTab == 5"></SecondStepAll>
            </tab-content>

            <button slot="prev" class="btn btn-info btn-fill btn-wd btn-back">Atras</button>
            <button slot="next" style="background-color: rgb(255,160,0); border-color: rgb(255,160,0)" class="btn btn-fill btn-wd btn-next">Siguiente</button>
            <button slot="finish" class="btn btn-warning btn-fill btn-wd" @click="volverAHistorial">Finalizar</button>
          </form-wizard>
=======
          <div class="tabs-container">
            <div v-for="(tab, index) in tabs" :key="index" @click="handleTabClick(index)" :class="{ active: actualTab === index }">
              <i :class="tab.icon"></i>
              <span>{{ tab.title }}</span>
            </div>
          </div>
          <div v-for="(tab, index) in tabs" :key="index" v-show="actualTab === index">
            <component
              :is="tab.component"
              ref="currentStepComponent"
              v-if="actualTab === index"
              :estado="tab.estado"
              :origen="tab.origen"
              :tipo="tab.tipo"
            ></component>
          </div>
          <div class="buttonsOptions">
            <button class="btn btn-info btn-fill btn-wd btn-back" :disabled="actualTab === 0" @click="prevTab">Atras</button>
            <button class="btn btn-fill btn-wd btn-next" :disabled="actualTab === tabs.length - 1" @click="nextTab">Siguiente</button>
            <button class="btn btn-warning btn-fill btn-wd" @click="volverAHistorial">Finalizar</button>
          </div>
>>>>>>> dev
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FormWizard, TabContent } from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import FirstStep from './Steps/AprobacionFirstStep'
import SecondStepAll from './Steps/AprobacionSecondStep'
import router from '../../router'

export default {
  components: {
    FormWizard,
    TabContent,
    FirstStep,
    SecondStepAll
  },
  data () {
    return {
      actualTab: 0,
      tabs: [
        { title: 'Validación Dependientes', icon: 'fa fa-user-check', component: 'FirstStep', estado: 'VERIFICADO', origen: 'DEP', tipo: 'dependientes' },
        { title: 'Validación Independientes', icon: 'fa fa-user-check', component: 'FirstStep', estado: 'VERIFICADO', origen: 'INDEP', tipo: 'independientes' },
        { title: 'Validación Otras Regionales', icon: 'fa fa-user-check', component: 'FirstStep', estado: 'VERIFICADO', origen: 'OR', tipo: 'otras regionales' },
        { title: 'Validación Servicios con Factura', icon: 'fa fa-user-check', component: 'FirstStep', estado: 'VERIFICADO', origen: 'FAC', tipo: 'factura' },
        { title: 'Validación Extranjeros', icon: 'fa fa-user-check', component: 'FirstStep', estado: 'VERIFICADO', origen: 'EXT', tipo: 'extranjero' },
        { title: 'Aprobación', icon: 'fa fa-university', component: 'SecondStepAll', estado: '', origen: '', tipo: '' }
      ]
    }
  },
  methods: {
    handleTabClick (index) {
      this.actualTab = index
    },
<<<<<<< HEAD
    data () {
      return {
        // Saber donde nos encontramos es util para renderizar
        // 0->Otras Regionales
        // 1->Independientes
        // 2->Dependientes
        // 3 -> Factura
        // 4 -> Extranjeros
        // 5->Pre-Pre-Aprobados
        actualTab: 0
=======
    prevTab () {
      if (this.actualTab > 0) {
        this.actualTab -= 1
>>>>>>> dev
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
    // Método para acceder al componente actual
    getCurrentStepComponent () {
      return this.$refs.currentStepComponent
    }
  }
}
</script>

<style scoped>
.tabs-container {
  display: flex;
  width: 100%;
  overflow-x: auto;
  background-color: #1c3b6c;
  margin-bottom: 20px;
  font-size: 15px;
}

.tabs-container div {
  cursor: pointer;
  text-align: center;
  padding: 15px;
  background-color: #1c3b6c;
  color: #ffffff;
  flex: 1;
  white-space: nowrap;
  border-bottom: 2px solid #ffffff;
  transition: background-color 0.3s ease;
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
  margin: 0 5px;
}

@media (max-width: 768px) {
  .tabs-container {
    flex-direction: column;
  }

  .tabs-container div {
    flex: none;
    width: 100%;
  }
<<<<<<< HEAD
</style>
=======
}
</style>
>>>>>>> dev
