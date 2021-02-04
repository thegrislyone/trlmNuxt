export const state = () => ({
  // authorization: !!window.AUTHORIZED
  authorization: false,
  authorizationProcess: false,
  signInMessage: ''
})

export const getters = {
  isAuthorized: state => state.authorization,
  authorizationProcess: state => state.authorizationProcess,
  signInMessage: state => state.signInMessage
}

export const actions = {
  authorizationForCheckout({commit, dispatch}, vm) {
    commit('setAuthorizationProcess', true)
    const message = 'Для оформления заказа необходимо авторизоваться или зарегистрироваться'
    dispatch('showSignInModal', {
      vm: vm,
      message: message
    })
  },
  showSignInModal({commit}, {vm, message}) {
    commit('setSignInMessage', message)
    vm.$modal.show('sign-in')
  }
}

export const mutations = {
  setAuthorization: (state, value) => {
    state.authorization = value
  },
  setAuthorizationProcess: (state, status) => {
    state.authorizationProcess = status
  },
  setSignInMessage: (state, message = '') => {
    state.signInMessage = message
  }
}