export const state = () => ({
  // Cart
  cartItems: [],
  cartData: null,
  cartLoading: false,
})

export const getters = {
  // Cart
  cartItems: state => state.cartItems,
  cartData: state => state.cartData,
  cartLoading: state => state.cartLoading,
}

export const actions = {
  async getCart({commit, dispatch}, item) {

    commit('loadingStatusChange', true)

    await this.$axios.get('https://general.dbtrlm.ru/api/dbtrlm/auth/cart_default')
      .then(response => {

        const data = response.data
        
        commit('setCart', data)

        if (item !== null) {
          //show cart informer
        }

        // if (this.authorizationProcess) {
            
        //   this.authorizationProcess = false
        //   this.$modal.hide('sign-in')
        //   this.$router.push('/checkout?start')
          
        // }

        commit('loadingStatusChange', false)
        
      })
      .catch(error => {
        console.log(error)
        commit('loadingStatusChange', false)
      })

  },
  async updateQuantity({commit, dispatch}, id, quantity) {
    
    commit('loadingStatusChange', true)

    const request = {
      quantity: quantity,
      forcibly: 1
    }

    const url = '/api/dbtrlm/auth/cart_line/' + id

    this.$axios.put(url, request)
      .then(response => {

        console.log('put', data)
        dispatch('getCart')

      })
      .catch(error => {
        console.log(error)
        commit('loadingStatusChange', false)
      })

  },
  async removeItemFromCartRequest({commit, dispatch}, item) {

    const url = '/api/dbtrlm/auth/cart_line/' + id

    const response = 
      await this.$axios.delete(url)
        .then(response => {
          const data = response.data

          console.log('delete', data)
          commit('setCart', data)

        })
        .catch(error => {
          console.log(error)
        })

      
    return response
        
  }
  /**
   * getGart
   * updateQuantity
   * removeItemFromCartRequest
   */
}

export const mutations = {
  setCart: (state, data) => {
    state.cartItems = Object.values(data.data.relationships.cart_line.data)
    state.cartData = data.data.attributes
  },
  setCartItems: (state, data) => {
    state.cartItems = Object.values(data.data.relationships.cart_line.data)
  },
  setCartData: (state, data) => {
    state.cartData = data.data.attributes
  },
  removeItemFromCart: ({state, commit, dispatch}, id) => {
    commit('loadingStatusChange', true)

    dispatch('removeItemFromCartRequest', id).then( () => {
      commit('loadingStatusChange', false)
    })
  },
  loadingStatusChange: (state, status) => {
    state.cartLoading = status
  }
  /**
   * setCart
   * removeitemfromcart
   */
}