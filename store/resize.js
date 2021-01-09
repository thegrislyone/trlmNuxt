export const state = () => ({
  windowWidth: 0,
  windowHeight: 0
})

export const getters = {
  // Cart
  windowWidth: state => state.windowWidth,
  windowHeight: state => state.windowHeight,
}

export const mutations = {
  setWindowWidth: (state, payload) => {
    state.windowWidth = payload
  },
  setWindowHeight: (state, payload) => {
    state.windowHeight = payload
  },
}