import Vue from 'vue'
import './pollyfills'
import VueRouter from 'vue-router'
import VueNotify from 'vue-notifyjs'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import App from './App.vue'
import axios from 'axios'
import VueWorker from 'vue-worker'

// Plugins
import GlobalComponents from './gloablComponents'
import GlobalDirectives from './globalDirectives'
import SideBar from './components/UIComponents/SidebarPlugin'
// router setup
import router from '@/router'

// vuex setup
import store from './store/index.js'

import './assets/sass/paper-dashboard.scss'
import './assets/sass/element_variables.scss'
import './assets/sass/demo.scss'

// import Vee validate
import VeeValidate from 'vee-validate'

// plugin setup
Vue.use(VueRouter)
Vue.use(GlobalDirectives)
Vue.use(GlobalComponents)
Vue.use(VueNotify)
Vue.use(SideBar)
Vue.use(VeeValidate)
Vue.use(VueWorker)
locale.use(lang)

// Prod server, usar este para probar el servidor de producción
// axios.defaults.baseURL = 'http://192.168.18.75:8002/api'

// Agregando dirección para el servidor de desarrollo
// El servidor de desarrollo apunta directamente al backend local
// Para hacer los cambios localmente sin afectar a producción
// Luego se debe hacer el merge, revisar documentación!

axios.defaults.baseURL = 'http://localhost:60749/api'


// Agregando token y id de usuario a las peticiones

axios.defaults.headers.common['id'] = localStorage.getItem('userId')
axios.defaults.headers.common['token'] = localStorage.getItem('token')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
