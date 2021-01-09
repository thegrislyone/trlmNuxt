export const state = () => ({
  // authorization: !!window.AUTHORIZED
  authorization: false,
  authorizationProcess: false
})

export const getters = {
  isAuthorized: state => state.authorization,
  authorizationProcess: state => state.authorizationProcess
}

export const mutations = {
  setAuthorization: (state, value) => {
    state.authorization = value
  },
  setAuthorizationProcess: (state, status) => {
    state.authorizationProcess = status
  }
}