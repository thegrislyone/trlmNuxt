const getDefaultState = () => {
  return {
    previousRoute: '',
    categoryData: {},
    filterData: [],
    filterCheckedValues: {},
    appliedFilterValues: [],
    sortingData: [],
    appliedSorting: {
      attributes: {
        name: ''
      }
    }
  }
}

export const state = () => getDefaultState()

// state.authorization = !!window.AUTHORIZED

export const getters = {
  getUrlValues: state => {

    const result = state.appliedFilterValues.map( item => {

      const key = item.attributes.seo_url
      const values = item.relationships.attribute_value.data.map( item => item.attributes.seo_url)
      let result = {}
      result[key] = values
      return result

    })

    return result

  },
  getCheckedValuesById: state => id => {

    let result = []

    let key = ''

    if (id === 0) {
      key = 'brand'
    } else {
      key = 'attribute.' + id
    }

    if (key in state.filterCheckedValues) {
    
      const filterGroup = state.filterData.find(item => item.id === id)

      filterGroup.relationships.attribute_value.data.forEach( item => {

        const filterGroupItem = item

        state.filterCheckedValues[key].forEach( item => {

          if (item === filterGroupItem.id) {

            result.push(filterGroupItem.attributes)

          }
          
        })

      })

    }

    return result

  },
  getAppliedValues: state => {

    let result = []

    state.appliedFilterValues.forEach( item => {

      const filterGroup = item

      filterGroup.relationships.attribute_value.data.forEach( item => {

        const filterGroupItem = item

        result.push({
          attribute_id: filterGroup.attributes.id,
          id: filterGroupItem.attributes.id,
          name: filterGroup.attributes.name,
          value: filterGroupItem.attributes.value
        })
        
      })

    })

    return result

  },
  getSearchValue: state => id => {
    const value = state.filterData.find(item => item.id === id)
    return value.attributes.value
  },
  getCategoryUrl: state => state.categoryData.url,
  getCategoryRealUrl: state => state.categoryData.real_url,
  getSortingData: state => state.sortingData,
  getAppliedSorting: state => state.appliedSorting,
  getPreviousRoute: state => state.previousRoute,
  isAuthorized: state => state.authorization
}

export const actions = {

}

export const mutations = {
  resetState(state) {
    const authorization = state.authorization
    Object.assign(state, getDefaultState())
    state.authorization = authorization
  },
  setFilterData(state, payload) {
    state.filterData = payload
    console.log('store filterData', state.filterData)
  },
  setCategoryData(state, payload) {
    state.categoryData = payload
    console.log('store categoryData', state.categoryData)
  },
  setSortingData(state, payload) {
    state.sortingData = payload
    state.appliedSorting = payload.find(item => item.attributes.checked === 'checked')
    console.log('store sortingData', state.sortingData)
    console.log('store appliedSorting', state.appliedSorting)
  },
  setAppliedSorting(state, payload) {
    state.appliedSorting = payload
    console.log('store appliedSorting', state.appliedFilterValues)
  },
  pushCheckedValue(state, {vm, payload}) {

    console.log("pushCheckedValue", payload)

    let key = ''

    if (payload.id === 0) {
      key = 'brand'
    } else {
      key = 'attribute.' + payload.id
    }
    
    if (key in state.filterCheckedValues) {
      state.filterCheckedValues[key].push(payload.value)
    } else {
      vm.set(state.filterCheckedValues, key, [payload.value])
    }

  },
  setFilterCheckedValues(state, {vm, payload}) {

    console.log("setFilterCheckedValues", payload.value)

    let key = ''

    if (payload.id === 0) {
      key = 'brand'
    } else {
      key = 'attribute.' + payload.id
    }
    
    if ( !payload.value.length ) {
      vm.delete(state.filterCheckedValues, key)
    } else if (key in state.filterCheckedValues) {
      state.filterCheckedValues[key] = payload.value
    } else {
      vm.set(state.filterCheckedValues, key, payload.value)
    }

  },
  updateAppliedFilterValues(state, vm) {

    console.log("vue instance in store", vm)

    let result = state.filterData.filter( item => {
      const checkedItems = item.relationships.attribute_value.data.filter( item => !!item.attributes.checked)
      return checkedItems.length
    })

    result = JSON.parse(JSON.stringify(result)) // deep copy

    result.forEach( item => {

      const checkedItems = item.relationships.attribute_value.data.filter( item => !!item.attributes.checked)
      item.relationships.attribute_value.data = checkedItems
      
    })

    state.appliedFilterValues = result

  },
  
  updateOffersAppliedFilterValues(state) {

    let result = []

    for (let key in state.filterCheckedValues) {

      const id = (key === 'brand') ? 0 : Number( key.match(/\d+/) )

      result.push(state.filterData.find(item => item.id === id))

    }

    result = JSON.parse(JSON.stringify(result)) // deep copy

    for (let key in state.filterCheckedValues) {
      result.forEach( item => {

        const checkedItems = item.relationships.attribute_value.data.filter( item => state.filterCheckedValues[key].includes(item.attributes.id) )

        if (checkedItems.length) {
          item.relationships.attribute_value.data = checkedItems
        }
        
      })
    }

    state.appliedFilterValues = result

  },
  deleteFilterCheckedValue(state, {vm, payload}) {

    console.log("deleteFilterCheckedValue", payload)

    let key = ''

    if (payload.attribute_id === 0) {
      key = 'brand'
    } else {
      key = 'attribute.' + payload.attribute_id
    }

    if ( state.filterCheckedValues[key].length === 1 ) {
      vm.delete(state.filterCheckedValues, key)
    } else {
      state.filterCheckedValues[key] = state.filterCheckedValues[key].filter(item => item !== payload.id)
    }

  },
  resetFilterCheckedValue(state) {
    state.filterCheckedValues = {}
  },
  setPreviousRoute(state, route) {
    state.previousRoute = route
  },
  setAuthorization(state, value) {
    state.authorization = value
  }
}
