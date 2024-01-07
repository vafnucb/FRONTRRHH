import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  FileType: null,
  BranchesId: '',
  uploadedFiles: {
    array: [],
    state: 'STARTED',
    id: ''
  },
  TipoDocente: ''
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}
