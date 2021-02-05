<template>
  <div>

    <breadcrumbs-component
      v-if="true/*breadcrumbs.length*/"
      :breadcrumbs="breadcrumbs"
    ></breadcrumbs-component>

    <h1>{{ h1 }}</h1>
    
    <div class="main-container">
      <transition name="sidebar">
        <aside
          v-show="$root.isSidebarActive || $root.isDesctopSidebar"
          class="sidebar"
        >
          <i
            v-if="$root.windowWidth < 960"
            class="sidebar__close close-btn"
            @click="$root.isSidebarActive = false"
          ></i>
          <h2 v-if="$root.windowWidth < 960">Фильтр</h2>
          <div class="filter-wrapper">
            
            <sticky-loader v-if="filterLoading" />

            <form class="filter-form" id="filterForm" @submit.prevent>

              <catalog-filter
                v-if="true/*filterData.length*/"
                :data="filterData"
              ></catalog-filter>

              <button
                v-show="popoverShow"
                class="filter__popover"
                type="button"
                :style="{
                  top: popoverPositionTop + 'px',
                  left: popoverPositionLeft + 'px'
                }"
                @click="applyFilter"
              >
                Найдено: {{ popoverItemsCount }} товаров
              </button>
            </form>
            <transition name="fader">
              <div
                v-if="popoverShow"
                class="filter-found"
              >
                <div class="filter-found__count">
                  Найдено: {{ popoverItemsCount }} товаров
                </div>
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
          v-if="$root.isSidebarActive && $root.windowWidth < 960"
          class="overlay"
          @click="$root.isSidebarActive = false"
        ></div>
      </transition>
      <div class="main-content">

        <sticky-loader v-if="catalogLoading" />

        <div
          v-show="$root.windowWidth < 960"
          class="filter-btn btn"
          @click="$root.isSidebarActive = true"
        >
          <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 2H20V4H11V2ZM0 4H7V6H9V0H7V2H0V4ZM7 14H20V16H7V14ZM17 8H20V10H17V8ZM15 12V6.012H13V8H0V10H13V12H15ZM5 18V12H3V14H0V16H3V18H5Z" fill="white"/>
          </svg>
          Фильтр
        </div>
        <div
          v-if="true/*appliedFilterValues.length*/"
          class="applied-filter"
        >
          <div class="applied-filter__title">Примененные фильтры:</div>
          <div class="selected-parameters">
            
            <button
              v-for="(item, index) in appliedFilterValues"
              :key="index"
              class="selected-parameter"
              type="button"
              @click.prevent="deleteCheckedValue(item)"
            >
              {{ item.name }}: {{ item.value }}
            </button>
            <button
              class="selected-parameter selected-parameter_reset"
              type="button"
              @click.prevent="resetFilter"
            >
              Сбросить все фильтры
            </button>
          </div>
        </div>
        <div class="catalog-options row">
          <div
            v-if="true/*sortingData.length*/"
            class="catalog-sorting"
          >
            <div
              class="sorting-btn btn btn_border btn_small"
              id="sortingBtn"
              @click="isSortingListActive = !isSortingListActive"
            >
              <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 16L8 12H5V0H3V12H0L4 16ZM9 4H18V6H9V4ZM9 8H16V10H9V8ZM9 0H20V2H9V0ZM9 12H14V14H9V12Z"/>
              </svg>
              Сортировка: <span>{{ sortingValue }}</span>
            </div>
            <transition name="fader">
              <div
                v-if="isSortingListActive"
                class="sorting-list"
                v-click-outside="clickOutsideSorting"
              >
                <li
                  v-for="sort in sortingData"
                  :key="sort.id"
                  class="sorting-list__item"
                  :class="{ 'active' : sort.id === $store.getters['common/getAppliedSorting'].id }"
                  @click="applySorting(sort)"
                >
                  {{ sort.attributes.name }}
                </li>
              </div>
            </transition>
          </div>
          <div
            v-if="$root.windowWidth >= 1280"
            class="view-options row"
          >
            <button
              class="view-option view-option_grid"
              @click.prevent="catalogViewToggle(false)"
              :class="{ 'active' : !isListView }"
            ></button>
            <button
              class="view-option view-option_list"
              @click.prevent="catalogViewToggle(true)"
              :class="{ 'active' : isListView }"
            ></button>
          </div>
        </div>
        <div
          class="product-list"
          :class="{ 'product-list_grid' : isListView && $root.windowWidth >= 1280 }"
        >
          <template v-if="true/*blocksList.length*/">
            <catalog-block
              v-for="(catalogBlock, index) in blocksList"
              :key="index"
              :items-list="catalogBlock"
            ></catalog-block>
          </template>
          <span
            v-else-if="!catalogLoading"
            class="empty-products-message"
          >
            Товаров по заданным условиям не найдено
          </span>
          <div
            v-if="showMoreButton"
            class="product-list__showmore btn"
            :class="{ 'btn_border' : $root.windowWidth >= 1280 }"
            @click="loadMore"
          >
            <div
              v-if="loading"
              class="button-preloader"
            >
              <div class="preloader-btn preloader-btn_white"></div>
            </div>
            <template v-else>Показать еще {{ buttonGoodsCount }}</template>
          </div>
        </div>
        <paginate
          v-if="showPaginate"
          :paginate-data="paginateData"
          :selected-page="selectedPage"
          :click-handler="goToPage"
          :page-range="$root.windowWidth < 640 ? 3 : 5"
        ></paginate>
      </div>
    </div>
  </div>
</template>

<script>

import CatalogBlock from '../components/CatalogBlock.vue'
import CatalogFilter from '../components/CatalogFilter.vue'
import Paginate from '../components/Paginate.vue'
import BreadcrumbsComponent from '../components/BreadcrumbsComponent.vue'

export default {
  components: {
    CatalogBlock, CatalogFilter, Paginate, BreadcrumbsComponent
  },
  data() {
    return {
      h1: '',
      breadcrumbs: [],

      // filter data
      filterData: [],
      popoverShow: false,
      popoverPositionTop: 0,
      popoverPositionLeft: 0,
      filterSendButtonUrl: null,
      popoverItemsCount: '',
      filterLoading: false,

      // catalog data
      catalogCounter: [],
			blocksList: [],
			blockElements: [],
			preloadedBlocksList: [],
      loading: false,
      catalogLoading: false,
			showMoreButton: false,
			showPaginate: false,
			blockedLoadMore: false,
			timerId: null,
			defaultGoodsCount: Number,
			buttonGoodsCount: Number,
			totalGoodsCount: Number,
			goodsCount: Number,
      paginateData: null,
			selectedPage: Number,
      selectedPageOffset: Number,
      
      // DOM
      isListView: Boolean,
      isSortingListActive: false

    }
  },
  computed: {
    goodsDiff() {
  		return this.goodsCount - this.catalogCounter.length
    },
    appliedFilterValues() {
      return this.$store.getters['common/getAppliedValues']
    },
    sortingData() {
      return this.$store.getters['common/getSortingData']
    },
    sortingValue() {
      return this.$store.getters['common/getAppliedSorting'].attributes.name
    }
  },
  methods: {

    handleScroll() {
  		this.blockElements.forEach( (item, index) => {
  			if (this.isElementInViewport(item)) {
          if (this.selectedPage !== index + this.selectedPageOffset) {
            this.selectedPage = index + this.selectedPageOffset
  					this.setPageUrl()
  				}
  			}
  		})
    },
    isElementInViewport(el) {
      const bounding = el.getBoundingClientRect()

      let out = {}
      out.top = bounding.top < (window.innerHeight / 2 || document.documentElement.clientHeight / 2)
      out.bottom = bounding.bottom > (window.innerHeight / 2 || document.documentElement.clientHeight / 2)
      out.any = out.top || out.bottom
      out.all = out.top && out.bottom

      return out.all
    },
    
    updateFilterData(force) {

      console.log('update')

      this.filterLoading = true
      this.popoverShow = false

      this.catalogLoading = true

      this.resetCatalog()

      const $request = this.$axios.get(this.getRequestUrl())
        .then(response => {
          const data = response.data

          console.log('updateFilterData', data)

          const meta = data.data.relationships.product.meta.page
          this.popoverItemsCount = meta.total

          let search = data.data.relationships.catalog_filter.relationships.attribute.data.find( item => item.attributes.type_filter === 'search' )
          
          if (search) {
            const obj = {
              relationships: {
                attribute_value: {
                  data: [
                    {
                      attributes: {
                        id: search.id,
                        checked: null,
                        disabled: null,
                        value: search.attributes.value
                      },
                      id: search.id
                    }
                  ]
                }
              }
            }
            search = Object.assign(search, obj)
          }

          const filterList = data.data.relationships.catalog_filter.relationships.attribute.data.filter( item => item.relationships )
        
          this.filterData = filterList

          this.$store.commit('common/setFilterData', filterList)

          this.filterLoading = false

          if ( !force ) {

            const showPopover = () => {

              let $target = $('.filter-group__parameter.target label'),
                targetPositionTop = Number,
                targetPositionLeft = Number,
                targetWidth = Number,
                targetCenter = Number,
                // popoverCenter = $('.filter__popover').height() / 2,
                filterPosition = $('#filterForm').offset()
      
              if ( !$target.length ) {
                $target = $('.filter-group.target-group').find('.multiselect')
              }
      
              if ( !$target.length ) {
                $target = $('.filter-group.target-group').find('.filter-group__title')
              }
              
              targetPositionTop = $target.offset().top
              targetPositionLeft =  $target.offset().left
              targetWidth =  $target.width()
              targetCenter = $target.height() / 2
      
              if ( $target.hasClass('multiselect') ) {
                targetPositionTop += 21
                targetPositionLeft = -10
              }
              // else if ( $target.hasClass('filter-group__parameter_range') ) {
              //   popoverCenter = 0
              //   targetCenter = 11
              // }
              
              // this.popoverPositionTop = targetPositionTop + targetCenter - filterPosition.top - popoverCenter
              this.popoverPositionTop = targetPositionTop - filterPosition.top
              this.popoverPositionLeft = targetPositionLeft + targetWidth + 20
              this.popoverShow = true
            }
            setTimeout(showPopover, 500)

          }

          this.setCatalogData(data)

          this.catalogLoading = false
        })

      this.$_ajaxAbort_pushRequest($request)

    },
    setPageUrl() {

      const url = this.getUrl(this.selectedPage)
      history.pushState(null, null, url)

      this.$metricHit(url)
      
    },
    getUrl(page) {

      let url_string = window.location.origin
      url_string += this.$store.getters['common/getCategoryRealUrl']      
      url_string += `/${page}`

      const appliedValues = this.$store.getters['common/getUrlValues']

      let i = 0
      appliedValues.forEach( (item, index, array) => {
        i++
        for (let key in item) {
          const values = item[key].join('_')
          url_string += ( i === 1 ) ? '/' : ''
          url_string += `attr-${key}_${values}`
          url_string += ( array.length === i ) ? '' : '-'
        }
      })

      let url = new URL(url_string)

      if ( this.sortingData.length && this.$store.getters['common/getAppliedSorting'].attributes.field !== 'priority' ) {
        const sign = this.$store.getters['common/getAppliedSorting'].attributes.sort === 'ASC' ? '' : '-'
        const sort = sign + this.$store.getters['common/getAppliedSorting'].attributes.field
        url.searchParams.set(`sort`, sort)
      }
      
      return url
      
    },
    getRequestUrl() {

      let url_string = window.location.origin
      url_string += '/api/general/public/catalog'
      
      let request = new URL(url_string)

      let mainFilter = 'filter[menu_catalog.url]'

      switch (this.$route.name) {
        case 'brand':
          mainFilter = 'filter[brand.url]'
          break
        case 'attribute':
          mainFilter = 'filter[attribute.url]'
          break
        case 'favorite':
          mainFilter = 'filter[group.url]'
      }

      request.searchParams.set(mainFilter, this.$store.getters['common/getCategoryUrl'])
      
      for (let key in this.$store.state['common/filterCheckedValues']) {
        request.searchParams.set(`filter[${ key }]`, this.$store.state['common/filterCheckedValues'][key].join(','))
      }

      if ( this.sortingData.length && this.$store.getters['common/getAppliedSorting'].attributes.field !== 'priority' ) {
        const sign = this.$store.getters['common/getAppliedSorting'].attributes.sort === 'ASC' ? '' : '-'
        const sort = sign + this.$store.getters['common/getAppliedSorting'].attributes.field
        request.searchParams.set(`sort`, sort)
      }

      request.searchParams.set('page[number]', this.selectedPage)

      return request

    },
    loadMore() {
      if (!this.blockedLoadMore) {
        if (!this.loading) {
          this.blocksList.push(this.preloadedBlocksList.pop())
          console.log('block-list', this.blocksList)
          this.selectedPage += 1

          if (this.goodsDiff === 0) {
            this.showMoreButton = false
          } else if (this.goodsDiff < this.defaultGoodsCount) {
            this.getItems(this.goodsDiff)
          } else {
            this.getItems(this.defaultGoodsCount)
          }
               
          this.setPageUrl()
        }
      } else {
        goToPage(this.selectedPage + 1)
      }
    },
    getItems(count) {
      this.loading = true
			this.buttonGoodsCount = count
      this.getItemsRequest()
		},
		getItemsRequest() {

      let request = this.getRequestUrl()
      request.searchParams.set('page[number]', this.selectedPage + 1)

      const $request = this.$axios.get(request)
        .then(response => {
          const data = response.data

          const items = data.data.relationships.product.data
          this.preloadedBlocksList.push(items)
          this.catalogCounter = this.catalogCounter.concat(items)
          this.loading = false
        })

      this.$_ajaxAbort_pushRequest($request)
      
    },
    goToPage(page) {
      if (page < this.selectedPage && page >= this.selectedPageOffset) {
        const scrollIndex = page - this.selectedPageOffset
        $('html, body').animate({
          scrollTop: $('.products-container').eq(scrollIndex).offset().top
        }, 400)
      } else if (this.selectedPage === page - 1 && !this.blockedLoadMore) {
        this.loadMore()
      } else {
        let url = this.getUrl(page)
        url = url.pathname + url.search
        this.$router.push(url)
      }	
    },
		applyFilter() {

      $('html, body').animate({
        scrollTop: $('.main-content').offset().top
      }, 400)

      this.popoverShow = false

    },
    applyMobileFilter() {
      this.applyFilter()
      this.$root.isSidebarActive = false
    },
    deleteCheckedValue(item) {
      this.$store.commit('common/deleteFilterCheckedValue', item)
      this.updateFilterData(true)
    },
    resetFilter() {
      this.$store.commit('common/resetFilterCheckedValue')
      this.updateFilterData(true)
    },
    resetCatalog() {

			this.blocksList = []

      this.catalogCounter = []
			this.blockElements = []
      this.preloadedBlocksList = []
      
			this.loading = false
			this.showMoreButton = false
			this.showPaginate = false
      this.blockedLoadMore = false
      
			this.buttonGoodsCount = Number
			this.totalGoodsCount = Number
			this.goodsCount = Number
      this.paginateData = null
      
      this.selectedPage = 1
      this.selectedPageOffset = 1

    },
    setCatalogData(data) {

      this.$store.commit('common/updateAppliedFilterValues', this)
      this.setPageUrl()

      const meta = data.data.relationships.product.meta.page
      const items = data.data.relationships.product.data

      if (items) {
        this.blocksList.push(items)
      }
      
      if (meta.total > this.defaultGoodsCount) {
        this.paginateData = meta
        this.showPaginate = true
      }
      
      const itemsCount = meta.total - (meta.current_page - 1) * this.defaultGoodsCount
      if (itemsCount > this.defaultGoodsCount) {
        this.goodsCount = meta.total - meta.current_page * this.defaultGoodsCount
        if (this.goodsCount >= this.defaultGoodsCount) {	
          this.getItems(this.defaultGoodsCount)
        } else {
          this.getItems(this.goodsCount)
        }
        this.showMoreButton = true
      }

      this.totalGoodsCount = meta.total

    },
    refreshCatalog() {

      this.catalogLoading = true

      this.resetCatalog()

      let request = this.getRequestUrl()

      const $request = this.$axios.get(request)
        .then(response => {
          const data = response.data

          console.log('refresh', data)
          
          this.setCatalogData(data)

          this.catalogLoading = false
        })

      this.$_ajaxAbort_pushRequest($request)

      $('html, body').animate({
        scrollTop: $('.main-content').offset().top
      }, 400)

    },

    // Sorting
    applySorting(type) {
      if ( type.id !== this.$store.getters['common/getAppliedSorting'].id) {
        this.$store.commit('common/setAppliedSorting', type)
        this.refreshCatalog()
        this.isSortingListActive = false
      }
    },
    clickOutsideSorting(event) {
      if (event.target.id !== 'sortingBtn') {
        if (event.target.parentElement.id !== 'sortingBtn' ) {
          this.isSortingListActive = false
        }
      }
    },

    catalogViewToggle(value) {
      this.isListView = value
      localStorage.catalogView = value ? 'list' : 'grid'
    },

    initPage(data) {

      let search = data.data.relationships.catalog_filter.relationships.attribute.data.find( item => item.attributes.type_filter === 'search' )
      
      if (search) {
        const obj = {
          relationships: {
            attribute_value: {
              data: [
                {
                  attributes: {
                    id: search.id,
                    checked: null,
                    disabled: null,
                    value: search.attributes.value
                  },
                  id: search.id
                }
              ]
            }
          }
        }
        search = Object.assign(search, obj)
      }

      const filterList = data.data.relationships.catalog_filter.relationships.attribute.data.filter( item => item.relationships )
      
      this.filterData = filterList

      this.$store.commit('common/setFilterData', filterList)
      this.$store.commit('common/setCategoryData', data.data.attributes)

      if (data.data.relationships.sort) {
        this.$store.commit('setSortingData', data.data.relationships.sort.data)
      }
      
      this.$store.commit('common/updateAppliedFilterValues', this)

      // attributes
      filterList.forEach( (item, index, array) => {

        const attribute_id = item.attributes.id

        item.relationships.attribute_value.data.forEach( item => {
          
          if (item.attributes.checked === 'checked' ) {
            this.$store.commit('common/pushCheckedValue', {
              id: attribute_id,
              value: item.attributes.id
            })
          }

        })

      })
      
      this.defaultGoodsCount = data.data.relationships.product.meta.page.per_page

      this.setCatalogData(data)

      this.catalogLoading = false

    },

    changePickpoint() {
      this.updateFilterData(true)
    }

  },
  created () {

  },
  mounted () {

    // original created below

    // this.$eventBus.$on('change-pick-point', this.changePickpoint)

    this.catalogLoading = true
    
    const time = 3 * 60 * 60 * 1000 // hours => ms
    this.timerId = setTimeout(() => this.blockedLoadMore = true, time)
    
    const url_string = window.location.href
    
    const page = url_string.match(/\/\d+\/|\/\d+$|\/\d+\?/)

    if (page) {
      this.selectedPage = Number( page[0].match(/\d+/) )
      this.selectedPageOffset = Number( page[0].match(/\d+/) )
    } else {
      this.selectedPage = 1
      this.selectedPageOffset = 1
    }

    if ('json_page_data' in window && window.json_page_data !== null) {

      console.log('ssr', json_page_data)
      const pageData = window.json_page_data
      this.initPage(pageData)
      this.breadcrumbs = window.json_page_breadcrumbs || []
      this.h1 = window.json_page_seo.h1 || ''

    } else {

      let request = new URL(url_string)
      request.searchParams.set('json', '')

      const $request = this.$axios.get(request)
        .then(response => {
          const data = response.data

          console.log('main-request', data)

          this.initPage(data.data)
          this.breadcrumbs = data.breadcrumb || []
          this.h1 = data.seo.h1 || ''

        })

      this.$_ajaxAbort_pushRequest($request)

    }

    // original mounted below
    
    window.addEventListener('scroll', this.handleScroll)

    if ( localStorage.catalogView === 'list' ) {
      this.isListView = true
    } else {
      this.isListView = false
    }
  },
  beforeDestroy () {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.handleScroll)
    }
      
    this.$store.commit('common/resetState')
    // this.$eventBus.$off('change-pick-point')

  }
}
</script>