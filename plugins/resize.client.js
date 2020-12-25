export default ({ store }) => {
  store.commit('resize/setWindowWidth', window.innerWidth)
  window.addEventListener('resize', () => {
    store.commit('resize/setWindowWidth', window.innerWidth)
  })
}