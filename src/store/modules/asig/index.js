// src/store/modules/asig.js
const state = () => ({
    SedeId: null,
    PeriodoId: null,
    SedeNombre: '',
    SedeAbr: '',
    PeriodoNombre: '',
    State: null
  })
  
  const mutations = {
    setSede (state, payload) {
      // Permitir que le pases sólo el id o { id, nombre }
      if (typeof payload === 'object' && payload !== null) {
        state.SedeId = payload.id
        state.SedeNombre = payload.nombre || ''
        state.SedeAbr = payload.abr || ''
      } else {
        state.SedeId = payload
      }
    },
    setPeriodo (state, payload) {
      if (typeof payload === 'object' && payload !== null) {
        state.PeriodoId = payload.id
        state.PeriodoNombre = payload.nombre || ''
      } else {
        state.PeriodoId = payload
      }
    },
   
  setState (state, procesoState) {
    state.State = procesoState
  }
  }
  
  const getters = {
    getSedeId: (state) => state.SedeId,
    getPeriodoId: (state) => state.PeriodoId
  }
  
  export default {
    namespaced: true,
    state,
    mutations,
    getters
  }
