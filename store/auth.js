export const state = () => ({
  // authorization: !!window.AUTHORIZED
  authorization: false
})

export const getters = {
  isAuthorized: state => state.authorization
}

export const mutations = {
  setAuthorization: (state, value) => {
    state.authorization = value
  }
}