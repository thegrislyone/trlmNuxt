<template>
  <div class="offers">

    <div
      v-if="originalOffers.length"
      class="offers-container"
    >
      <h3>Запрошенный товар</h3>
      <offers-list
        v-for="(item, index) in getList(originalOffers)"
        :key="index"
        :offer="item"
      ></offers-list>
    </div>
    <div
      v-if="analogOffers.length"
      class="offers-container"
    >
      <h3>Аналоги</h3>
      <offers-list
        v-for="(item, index) in renderingList"
        :key="index"
        :offer="item"
      ></offers-list>
    </div>
  
  </div>
</template>

<script>
  import OffersList from './OffersList.vue'
  import { debounce } from 'vue-debounce'

  export default {
    props: {
      data: {
        required: true
      }
    },
    components: {
      OffersList
    },
    data() {
      return {
        analogOffersReversed: [],
        renderingList: [],
        debounceRender: null,
      }
    },
    computed: {
      offersData() {
        return this.data
      },
      originalOffers() {
        if ('origin' in this.offersData) {
          const brands = this.$store.getters['common/getAppliedValues'].filter(item => item.attribute_id === 0)
          const values = brands.map(item => item.value.toLowerCase())
          
          if (values.length) {
            return this.offersData.origin.data.filter(item => {
              // return values.includes(item.attribute.name.toLowerCase())
              return true
            })
          } else {
            return this.offersData.origin.data
          }

        }
        return []
      },
      analogOffers() {
        if ('replacement' in this.offersData) {
          const brands = this.$store.getters['common/getAppliedValues'].filter(item => item.attribute_id === 0)
          const values = brands.map(item => item.value.toLowerCase())
          
          if (values.length) {
            return this.offersData.replacement.data.filter(item => {
              // return values.includes(item.attribute.name.toLowerCase())
              return true
            })
          } else {
            return this.offersData.replacement.data
          }

        }
        return []
      }
    },
    watch: {
      data() {
        this.refreshRenderingList()
      }
    },
    methods: {
      getList(array) {

        let result = []

        array.forEach(item => result = result.concat(item.relationships.product.data))

        return result
    
      },
      refreshRenderingList(init = false) {
        

        this.analogOffersReversed = this.getList(this.analogOffers).reverse()
        this.renderingList = []
        
        for (let i = 0; i < 20; i++) {
          if (this.$is_empty(this.analogOffersReversed)) break

          this.renderingList.push(this.analogOffersReversed.pop())
        }

        if (!init && !this.$is_empty(this.analogOffersReversed)) {
          window.addEventListener("scroll", this.scrollCheck)
          this.scrollCheck()
        }

      },
      renderMore() {
        for (let i = 0; i < 10; i++) {
          if (this.$is_empty(this.analogOffersReversed)) {
            window.removeEventListener("scroll", this.scrollCheck, false)
            return
          }
          this.renderingList.push(this.analogOffersReversed.pop())
        }
      },
      scrollCheck() {
        if (window.pageYOffset + window.innerHeight >= document.querySelector('.offers').scrollHeight - 1000) {
          this.debounceRender()
        }
      }
      
    },
    created() {
      this.debounceRender = debounce(this.renderMore, 50)
      this.refreshRenderingList(true)
    },
    mounted() {
      if (!this.$is_empty(this.analogOffersReversed)) {
        window.addEventListener("scroll", this.scrollCheck)
      }
    },
    updated() {
    },
    beforeDestroy() {
      window.removeEventListener("scroll", this.scrollCheck, false)
    }
  }
</script>

<style>

</style>$e