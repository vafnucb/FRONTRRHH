import axios from 'axios/index'

const uploadedFiles = ({ commit, state }) => {
  const formData = {
    FileType: state.FileType,
    BranchesId: state.BranchesId,
    ProcessId: state.uploadedFiles.id,
    TipoDocente: state.TipoDocente
  }
  console.log('Datos enviados:', formData)
  axios.post('/ServContract/CheckUpload', formData, {
    headers: {
      'token': localStorage.getItem('token')
    }
  })
    .then(response => {
      if (response.data !== '') {
        commit('uploadedFilesSetter', response.data)
      } else {
        commit('uploadedFilesCleaner')
      }
    })
    .catch(error => console.log(error))
}
export default {
  uploadedFiles
}
