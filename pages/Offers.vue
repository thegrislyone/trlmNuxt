<template>
  <div>
    <!--
      TODO: i should got why there's an error
    -->
    <no-ssr>
      <h1>{{ h1 }}</h1>
      
      <div class="main-container">
        <transition name="sidebar">
          <aside
            v-show="$store.getters['dom/isSidebarActive'] || $store.getters['dom/isDesctopSidebar']"
            class="sidebar"
          >
            <i
              v-if="windowWidth < 960"
              class="sidebar__close close-btn"
              @click="$store.commit('dom/setIsSidebarActive', false)"
            ></i>
            <div
              v-if="$store.getters['pickpoints/officeIs'] !== null"
              class="offers-office"
            >
              <map-component
                v-if="mapData !== null"
                class="offers-office__map"
                :map-data="mapData"
              ></map-component>
              <div class="offers-office__info">
                Цены и сроки указаны для
                <br>
                ПВЗ <strong>{{ $store.getters['pickpoints/officeIs'].attributes.name }}</strong>
                <br>
                <button
                  class="offers-office__btn link another-pickpoint-btn"
                  type="button"
                  @click="pickAnother"
                >
                  Выбрать другой пункт
                </button>
              </div>
            </div>
            <div class="filter-wrapper">

              <sticky-loader v-if="filterLoading" />

              <form class="filter-form" id="filterForm" @submit.prevent >

                <offers-filter
                  v-if="filterData !== null"
                  :data="filterData"
                ></offers-filter>

              </form>
              <transition name="fader">
                <div
                  v-if="popoverShow"
                  class="filter-found"
                >
                  <button
                    class="filter-found__btn btn"
                    type="button"
                    @click="applyMobileFilter"
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.69765 15.3945C9.47389 15.3945 11.1068 14.7835 12.4096 13.7704L16.6394 18L18 16.6395L13.7701 12.4099C14.7843 11.1062 15.3953 9.47338 15.3953 7.69724C15.3953 3.45318 11.9419 0 7.69765 0C3.45336 0 0 3.45318 0 7.69724C0 11.9413 3.45336 15.3945 7.69765 15.3945ZM7.69765 1.92431C10.8816 1.92431 13.4709 4.51347 13.4709 7.69724C13.4709 10.881 10.8816 13.4702 7.69765 13.4702C4.51371 13.4702 1.92441 10.881 1.92441 7.69724C1.92441 4.51347 4.51371 1.92431 7.69765 1.92431Z" />
                    </svg>
                    Показать
                  </button>
                </div>
              </transition>
            </div>
          </aside>
        </transition>
        <transition name="fader">
          <div
            v-if="$store.getters['dom/isSidebarActive'] && windowWidth < 960"
            class="overlay"
            @click="$store.commit('dom/setIsSidebarActive', false)"
          ></div>
        </transition>
        <div class="main-content">

          <sticky-loader v-if="offersLoading" />

          <div
            v-show="windowWidth < 960"
            class="filter-btn btn"
            @click="$store.commit('dom/setIsSidebarActive', true)"
          >
            <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 2H20V4H11V2ZM0 4H7V6H9V0H7V2H0V4ZM7 14H20V16H7V14ZM17 8H20V10H17V8ZM15 12V6.012H13V8H0V10H13V12H15ZM5 18V12H3V14H0V16H3V18H5Z" fill="white"/>
            </svg>
            Фильтр
          </div>
          <div
            v-if="appliedFilterValues.length"
            class="applied-filter"
          >
            <div class="applied-filter__title">Примененные фильтры:</div>
            <div class="selected-parameters">
              
              <button
                v-for="(item, index) in appliedFilterValues"
                :key="index"
                class="selected-parameter"
                type="button"
                @click.prevent="deleteOffersCheckedValue(item)"
              >
                {{ item.name }}: {{ item.value }}
              </button>
              <button
                class="selected-parameter selected-parameter_reset"
                type="button"
                @click.prevent="resetOffersFilter"
              >
                Сбросить все фильтры
              </button>
            </div>
          </div>

          <offers
            ref="offers"
            v-if="Object.keys(offersData).length"
            :data="offersData"
          ></offers>
          <div
            v-if="errorMessage"
            class="message message_error"
          >
            {{ errorMessage }}
          </div>
          
        </div>
      </div>
    </no-ssr>
  </div>
</template>

<script>

  import Offers from '../components/Offers.vue'
  import OffersFilter from '../components/OffersFilter.vue'
  import MapComponent from '../components/MapComponent.vue'

  export default {
    components: {
      Offers,
      OffersFilter,
      MapComponent
    },
    data() {
      return {
        h1: '',
        data: null,
        offersData: {},
        filterLoading: false,
        offersLoading: false,
        popoverShow: false,
        errorMessage: ''
      }
    },
    computed: {     
      windowWidth() {
        return this.$store.getters['resize/windowWidth']
      },
      appliedFilterValues() {
        return this.$store.getters['common/getAppliedValues']
      },
      filterData() {
        return this.data
      },
      mapData() {
        
        if (this.data === null) {
          return null
        }

        const data = JSON.parse(this.data)
        const map = data.relationships.map

        if (!map.data.attributes.latitude && !map.data.attributes.longitude) {
          return null
        }

        const coordinates = [ +map.data.attributes.longitude, +map.data.attributes.latitude ]
        const zoom = +map.data.attributes.zoom || 13
        const tiles = map.data.attributes.url_tiles

        const points = map.relationships.points.data

        const mapData = {
          coordinates,
          zoom,
          tiles,
          points
        }

        return mapData

      }
    },
    methods: {
      deleteOffersCheckedValue(item) {
        this.$store.commit('common/deleteFilterCheckedValue', item)
        this.$store.commit('common/updateOffersAppliedFilterValues')

        this.updateFilterData(item.attribute_id !== 0)

      },   
      resetOffersFilter() {

        const apply = this.appliedFilterValues.findIndex(item => item.attribute_id !== 0) !== -1
        

        this.$store.commit('common/resetFilterCheckedValue')
        this.$store.commit('common/updateOffersAppliedFilterValues')

        this.updateFilterData(apply)

      },
      getPageData() {
        
        this.filterLoading = true
        this.offersLoading = true

        const url_string = window.location.href
        let request = new URL(url_string)
        request.searchParams.set('json', '')
        console.log("происходит этот запрос")

        const $request = this.$axios.get(request)
          .then(response => {
            // const data = response.data
            const data = {"data":{"relationships":{"stock":{"data":{"relationships":{"origin":{"data":[]},"replacement":{"data":[]}}}},"filter":{"relationships":{"attribute":{"data":[]}},"data":[]},"map":{"data":{"attributes":{"url_tiles":"https:\/\/a.tile.openstreetmap.org\/{z}\/{x}\/{y}.png","latitude":"47.315513","longitude":"39.648618","zoom":13}},"relationships":{"points":{"data":[{"id":30592,"attributes":{"id":30592,"street":null,"house":null,"latitude":"47.315513","longitude":"39.648618","city_id":3,"region_id":4,"name":"Magic Clean","icon_color":"#B60000"},"relationships":{"region":{"data":{"id":4,"attributes":{"id":4,"name":"\u041a\u0440\u0430\u0441\u043d\u043e\u0434\u0430\u0440\u0441\u043a\u0438\u0439 \u043a\u0440\u0430\u0439"}}},"city":{"data":{"id":3,"attributes":{"id":3,"name":"\u041a\u0440\u0430\u0441\u043d\u043e\u0434\u0430\u0440"}}}}}]}}}}},"seo":{"title":"\u0420\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u044b \u043f\u043e\u0438\u0441\u043a\u0430","description":"\u0420\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u044b \u043f\u043e\u0438\u0441\u043a\u0430","h1":"\u0420\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u044b \u043f\u043e\u0438\u0441\u043a\u0430","canonical":"https:\/\/trlm.ru\/offers"},"breadcrumb":[{"name":"\u0413\u043b\u0430\u0432\u043d\u0430\u044f","url":"\/"},{"name":"\u0420\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u044b \u043f\u043e\u0438\u0441\u043a\u0430","url":"\/offers"}]}

            console.log(data)
            this.h1 = data.seo.h1 || ''
            this.data = JSON.stringify(data.data)
            this.filterLoading = false
            this.offersLoading = false

            // this.$metricGoal('offer_get')
          })

        // this.$_ajaxAbort_pushRequest($request)

      },
      restPartLoad(request) {

        this.$axios.get(request)
          .then(response => {
            const data = response.data

            const restData = data.data.relationships.stock.data.relationships.replacement.data
            const originalDataLength = this.offersData.replacement.data.length

            if (originalDataLength) {
              this.offersData.replacement.data = this.offersData.replacement.data.concat(restData.slice(originalDataLength, restData.length))
              this.$refs.offers.refreshRenderingList()
            }
          })


      },
      getRequestUrl(isFilterUpdate = false) {
        
        let url_string = window.location.href
        const url = new URL(url_string)

        const articleValue = url.searchParams.get('article')
        const brandValue = url.searchParams.get('brand')

        url_string = window.location.origin
        url_string += '/api/general/public/offer'

        let request = new URL(url_string)

        request.searchParams.set('article', articleValue)
        request.searchParams.set('brand', brandValue)

        for (let key in this.$store.state.filterCheckedValues) {

          if (key !== 'brand' || isFilterUpdate) {
            request.searchParams.set(`filter[${ key }]`, this.$store.state.filterCheckedValues[key].join(','))
          }

        }

        return request

      },
      changePickpoint() {
        this.updateFilterData(true)
        this.$store.commit('common/resetFilterCheckedValue')
        this.$store.commit('common/updateOffersAppliedFilterValues')
      },
      updateFilterData(apply) {

        console.log('update')

        this.filterLoading = true
        this.popoverShow = false

        const isFilterUpdate = true
        const request = this.getRequestUrl(isFilterUpdate)

        this.$axios.get(request.href)
          .then(response => {
            const data = response.data

            console.log(data)

            console.log(this.$store)

            this.$store.commit('common/setFilterData', data.relationships.filter.relationships.attribute.data.filter(item => item.relationships))

            this.data = JSON.stringify(data)
            this.offersData = JSON.parse(JSON.stringify(data.relationships.stock.data.relationships))
            
            let restPartUrl = new URL(window.location.href)
            
            restPartUrl.search = request.search
            restPartUrl.searchParams.set('json','')

            restPartUrl.href = restPartUrl.origin + restPartUrl.pathname + '/2' + restPartUrl.search

            // this.restPartLoad(restPartUrl)

            this.filterLoading = false

            this.popoverShow = true

            // if (apply) {
            //   this.applyFilter()
            // }
            
          })

      },
      applyFilter() {
        this.refreshCatalog()
      },
      applyMobileFilter() {

        this.popoverShow = false
        this.$store.commit('dom/setIsSidebarActive', false)
        
        $('html, body').animate({
          scrollTop: $('.main-content').offset().top
        }, 400)

      },
      refreshCatalog() {

        this.offersLoading = true
        this.offersData = {}
        this.errorMessage = ''
        
        const request = this.getRequestUrl()

        this.$axios.get(request)
          .then(response => {
            const data = response.data

            console.log('refresh', data)

            if ('relationships' in data.relationships.stock.data) {
              this.offersData = data.relationships.stock.data.relationships
            } else {
              this.errorMessage = 'Нет ответа от поставщика, попробуйте позже'
            }
            this.offersLoading = false
          })

        $('html, body').animate({
          scrollTop: $('.main-content').offset().top
        }, 400)

      },
      pickAnother() {
        this.$store.commit('dom/setIsSidebarActive', false)
        // todo: разобраться с поппером
        // this.$root.showPopper()
        $('html, body').animate({
          scrollTop: 0
        }, 400)
      }
    },
    created () {
      // console.log(this.$router)
      if (process.browser){
        this.getPageData()
      }
      
      // this.$eventBus.$on('change-pick-point', this.changePickpoint)

    },
    beforeDestroy () {
      
      this.$store.commit('common/resetState')
      // this.$eventBus.$off('change-pick-point')
    }
  }

</script>

<style>

</style>