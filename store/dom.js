export const state = () => ({
  isNavMenuActive: false,
  isCatalogMenuActive: false,
  isSearchActive: false,
  isSidebarActive: false,
  isDesctopSidebar: Boolean,
  showCookieAgreement: false
})

export const getters = {
  isNavMenuActive: state => state.isNavMenuActive,
  isCatalogMenuActive: state => state.isCatalogMenuActive,
  isSearchActive: state => state.isSearchActive,
  isSidebarActive: state => state.isSidebarActive,
  isDesctopSidebar: state => state.isDesctopSidebar,
  showCookieAgreement: state => state.showCookieAgreement
}

export const actions = {

}

export const mutations = {
  setIsNavMenuActive(state, value) {
    state.isNavMenuActive = value
  },
  setIsCatalogMenuActive(state, value) {
    state.isCatalogMenuActive = value
  },
  setIsSearchActive(state, value) {
    state.isSearchActive = value
  },
  setIsSidebarActive(state, value) {
    state.isSidebarActive = value
  },
  setIsDesctopSidebar(state, value) {
    state.isDesctopSidebar = value
  },
  setShowCookieAgreement(state, value) {
    state.showCookieAgreement = value
  }
}