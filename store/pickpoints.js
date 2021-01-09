export const state = () => ({
  popperInstance: null,
  officeIs: null,
  regionIs : null,
  geoIp : null,
  isWholesale: false,
  isRegionSearch: false,
  regionApplied: false,
  regionSearch: '',
  cities : [],
  citiesLoading: false,
  regions : [],
  addresses: [],
  addressSearchValue: '',
  addressesLoading: false,
})

export const getters = {
  popperInstance: state => state.popperInstance,
  officeIs: state => state.officeIs,
  regionIs : state => state.regionIs,
  geoIp : state => state.geoIp,
  isWholesale: state => state.isWholesale,
  isRegionSearch: state => state.isRegionSearch,
  regionApplied: state => state.regionApplied,
  regionSearch: state => state.regionSearch,
  cities : state => state.cities,
  citiesLoading: state => state.citiesLoading,
  regions : state => state.regions,
  addresses: state => state.addresses,
  addressSearchValue: state => state.addressSearchValue,
  addressesLoading: state => state.addressesLoading,
}

export const actions = {
  async getRegions({commit}) {
    await this.$axios.get("/api/dbtrlm/public/region")
      .then(response => {
        const data = response.data
        const regionsData = data.data || []

        commit("setRegions", regionsData)
      })
  },
  async selectRegion({commit, dispatch}, region) {
    commit("setRegionIs", region.attributes.name)
    commit("isRegionSearch", false)
    commit("regionApplied", true)
    dispatch("getCities", region.id)
  },
  async getCities({commit, dispatch}, regionId) {
    commit("setCitiesLoading", true)
    await this.$axios.get("/api/dbtrlm/public/city?filter[region_id]=" + regionId)
      .then(response => {
        const data = response.data

        commit("setCities", data.data)
        dispatch("getPickpointsByRegion", regionId)
      })
  },
  async getAddresses({commit}) {
    await this.$axios.get("/api/dbtrlm/public/pick_point")
      .then(response => {
        const data = response.data
        const addressesData = data.data || []

        console.log('addresses', data)
        
        commit('setAddresses', addressesData)
        commit('setIsWholesale', true)
      })
  },
  async addressSearch({commit}, addressesSearchValue) {
    commit('setAddressesLoading', true)

    await this.$axios.get("/api/dbtrlm/public/pick_point?filter[text]=" + addressesSearchValue)
      .then(response => {
        const data = response.data
        const addressesData = data.data || []

        console.log('addresses', data)
        commit('setAddresses', addressesData)
      })
      .then(() => {
        commit('setAddressesLoading', false)
      })
  },
  async getPickpointsByRegion({commit, dispatch, state}, regionId) {
    await this.$axios.get("/api/dbtrlm/public/pick_point?filter[region_id]=" + regionId)
      .then(response => {
        const data = response.data

        for (let key in state.cities) {
          const cityId = state.cities[key].id
          const pickPoints = data.data.filter(item => item.attributes.city_id === cityId)

          commit('addPickpoints', {key: state.cities[key], data: pickPoints})
        }
        commit('setCitiesLoading', false)
      })
  },
  async selectOffice({commit, state}, {vm, office}) {

    if (state.officeIs && office.id == state.officeIs.id) {
      return
    }

    commit('setOfficeIs', office)

    this.$axios.get('/api/change-pick-point/' + office.id)
      .then(response => {
        const data = response.data

        console.log('change-pick-point', data)

        vm.$store.commit('cart/setCartItems', Object.values(data.data.relationships.cart_line.data))
        vm.$store.commit('cart/setCartData', data.data.attributes)

        vm.$eventBus.$emit('change-pick-point')

      })
      .catch(error => {
        console.log(error)
      })

    // this.hidePopper()
  },
  changeRegion({commit}) {
    commit('setIsRegionSearch', true)
    commit('setRegionApplied', false)
  },
  pickpointUpdate({commit, dispatch}, {vm, pickPointData, init = false}) {

    commit('setRegions', [])
    commit('setCities', [])
    commit('setAddresses', [])
    commit('setOfficeIs', null)
    commit('setRegionIs', null)
    commit('setRegionApplied', false)
    commit('setIsWholesale', false)

    if (!vm.$empty(pickPointData)) {
      if (init) {
        commit('setOfficeIs', pickPointData)
      } else {
        dispatch('selectOffice', pickPointData)
      }
      if (pickPointData.relationships && !vm.$empty(pickPointData.relationships.region)) {
        commit('setRegionIs', pickPointData.relationships.region.data.attributes.name)
        commit('setRegionApplied', true)

        dispatch('getRegions')
        dispatch('getCities', pickPointData.relationships.region.data.id)
      } else {
        dispatch('getAddresses')
      }
    }
  },
  async pickpointUpdateById({commit, dispatch}, pickpointId) {
    await this.$axios.get("/api/dbtrlm/public/pick_point/" + pickpointId)
      .then(response => {
        const data = response.data
        dispatch('pickpointUpdate', data.data)
      })
  }
}

export const mutations = {
  setRegions: (state, data) => {
    state.regions = data
  },
  setRegionIs: (state, name) => {
    state.regionIs = name
  },
  setIsRegionSearch: (state, status) => {
    state.isRegionSearch = status
  },
  setRegionApplied: (state, status) => {
    state.regionApplied = status
  },
  setCitiesLoading: (state, status) => {
    state.citiesLoading = status
  },
  setCities: (state, data) => {
    state.cities = data
  },
  addPickpoints: (state, {key, data}) => {
    let newCities = JSON.parse(JSON.stringify(state.cities))
    newCities[key]['pickPoints'] = data

    state.cities = newCities
    // Vue.set(state.cities[key], 'pickPoints', data)
  },
  setAddresses: (state, data) => {
    state.addresses = data
  },
  setIsWholesale: (state, status) => {
    state.isWholesale = status
  },
  setAddressesLoading: (state, status) => {
    state.addressesLoading = status
  },
  setOfficeIs: (state, office) => {
    state.officeIs = office
  }
}