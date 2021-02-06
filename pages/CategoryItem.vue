<template>
  <div>

    <breadcrumbs-component
      v-if="breadcrumbs.length"
      :breadcrumbs="breadcrumbs"
    ></breadcrumbs-component>

    <h1>{{ h1 }}</h1>
    
    <div class="main-container">

      <sticky-loader v-if="pageLoading" />
      
      <aside
        v-if="recommendations.length && windowWidth >= 1280"
        class="sidebar sidebar_right sidebar_catalog-item"
      >
        
        <h4>C этим товаром покупают</h4>
        <div class="sidebar-products">
          <catalog-block-item
            v-for="item in recommendations"
            :key="item.id"
            :itemData="item"
          ></catalog-block-item>
        </div>

      </aside>
      <div class="main-content main-content_catalog-item">
        <div class="catalog-item">

          <!-- Info -->
          <div class="catalog-item__info">

            <div v-if="imageSrc.length" class="catalog-item__image">
              <img :src="imageSrc" alt="">
            </div>

            <div class="catalog-item__main-info">

              <div class="catalog-item-price">
                <button
                  v-if="priceLink.length"
                  class="catalog-item-price__btn btn"
                  type="button"
                  @click="priceLinkFollow"
                >
                  Узнать цену
                </button>
                <div class="catalog-item-price__price">
                  <div
                    v-if="priceLoading"
                    class="loading loading_centered"
                  >
                    <div class="preloader-btn"></div>
                  </div>
                  <template v-if="price !== null">
                    <div class="catalog-item-price__value">{{ price.price | numberPrettify }} ₽</div>
                    <div class="catalog-item-price__time">{{ price.relevant }}</div>
                  </template>
                </div>
              </div>

              <favorite-button
                class="catalog-item__favorite-btn"
                :class="{ 'active' : favoriteId > 0 }"
                :loading="favoriteLoading"
                @favorite-click="favoriteClick"
              >
                <span v-if="favoriteId === 0">В избранное</span>
                <span v-else>Удалить из избранного</span>
              </favorite-button>

              <!-- Properties -->
              
              <div v-if="propertiesList.length" class="properties">
                <ul class="properties__list">

                  <li
                    v-for="prop in propertiesList"
                    :key="prop.id"
                    class="properties__item"
                  >
                    <span class="properties__key">
                      <span>{{ prop.attributes.name }}</span>
                    </span>
                    <span class="properties__value">
                      <span>{{ prop.attributes.value }}</span>
                    </span>
                  </li>

                </ul>
                <button
                  class="properties__link"
                  type="button"
                  @click="scrollToProperties"
                >
                  Все характеристики
                </button>
              </div>
              <!-- /Properties -->

              <!-- Sizes -->

              <div v-if="sizes.length" class="sizes">
                <div class="sizes__title">Другие фасовки</div>
                <div class="sizes__list">
                  <router-link
                    v-for="size in sizes"
                    :key="size.id"
                    :to="size.attributes.product_url"
                    class="sizes__btn btn btn_border btn_small btn_black"
                  >
                    {{ size.attributes.packing }}
                  </router-link>
                </div>
              </div>

              <!-- /Sizes -->
            
            </div>

          </div>
          <!-- /Info -->

          <div
            v-if="content.length"
            class="catalog-item-content"
            v-html="content"
          ></div>
          
          <products-slider
            v-if="analogs.length"
            :data="analogs"
            :title="'Аналоги'"
          ></products-slider>

          <products-slider
            v-if="recommendations.length && windowWidth < 1280"
            :data="recommendations"
            :title="'C этим товаром покупают'"
          ></products-slider>

          <!-- Full-properties -->
          <div
            v-if="fullPropertiesList.length"
            class="full-properties"
            ref="properties"
          >
            <h3>Характеристики</h3>
            <ul class="full-properties__list">
 
              <li
                v-for="prop in fullPropertiesList"
                :key="prop.id"
                class="full-properties__item"
              >
                <span class="full-properties__key">
                  <span>{{ prop.attributes.name }}</span>
                </span>
                <span class="full-properties__value">
                  <span>
                    <template
                      v-for="(link, index) in propertiesLinks(prop.attributes.value_url)"
                    >
                      <router-link
                        :key="index"
                        :to="link.href"
                      >{{ link.value }}</router-link><template v-if="index + 1 < propertiesLinks(prop.attributes.value_url).length">, </template>
                    </template>
                  </span>
                </span>
              </li>

            </ul>
          </div>
          <!-- /Full-properties -->

        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import ProductsSlider from '../components/ProductsSlider.vue'
  import CatalogBlockItem from '../components/CatalogBlockItem.vue'
  import BreadcrumbsComponent from '../components/BreadcrumbsComponent.vue'
  import FavoriteButton from '../components/FavoriteButton.vue'

  export default {
    components: {
      ProductsSlider,
      CatalogBlockItem,
      BreadcrumbsComponent,
      FavoriteButton
    },
    data() {
      return {
        pageLoading: false,
        h1: '',
        breadcrumbs: [],
        imageSrc: '',
        priceLink: '',
        price: null,
        priceLoading: false,
        favoriteId: 0,
        favoriteLoading: false,
        propertiesList: [],
        fullPropertiesList: [],
        sizes: [],
        content: '',
        analogs: [],
        recommendations: [],
        article: '',
        brandName: '',
        name: ''
      }
    },
    computed: {
      windowWidth() {
        return this.$store.getters['resize/windowWidth']
      }
    },
    methods: {
      scrollToProperties() {
        const $target = $(this.$refs.properties)
        $('html, body').animate({
          scrollTop: $target.offset().top - 10
        }, 400)
      },
      propertiesLinks(links) {

        let $el = $('<div></div>')
        $el.html(links)

        let result = []

        $el.find('a').each( function() {

          const obj = {
            value: $(this).text(),
            href: $(this).attr("href")
          }

          result.push( obj )

        })

        return result

      },
      priceRequest() {

        this.priceLoading = true

        let priceRequest = '/api/general/public/offer_one?'
        priceRequest += 'article=' + this.article
        priceRequest += '&brand=' + this.brandName

        this.$axios.get(priceRequest)
          .then(response => {
            const data = response.data

            console.log(data)
            if ('price' in data.data) {
              this.price = data.data
            } else {
              this.price = null
            }
            this.priceLoading = false
          })
          .catch(error => {
            console.log(error)
            this.priceLoading = false
          })

      },
      priceLinkFollow() {
        this.$metricGoal('product_offer')
        this.$router.push(this.priceLink)
      },
      favoriteClick() {

        if (this.favoriteLoading) {
					return
        }

				this.favoriteLoading = true

				if (this.favoriteId > 0) {

          this.$axios.delete('/api/favorit-delete/' + this.favoriteId)
            .then(response => {
              const data = response.data

              console.log('delete', data)
							this.favoriteId = data
              this.favoriteLoading = false

            })
            .catch(error => {
              console.log(error)
              this.favoriteLoading = false
            })

				} else {

					const request = {
						article: this.article,
						brand: this.brandName,
						name: this.name
					}

          this.$axios.post('/api/favorit-add', request)
            .then(response => {
              const data = response.data

              console.log('favorit-add', data)
							this.favoriteId = data
              this.favoriteLoading = false

            })
            .catch(error => {
              console.log(error)
              this.favoriteLoading = false
            })

				}
      },
      initPage(data) {

        this.article = data.attributes.article
        this.brandName = data.attributes.brand_name
        this.name = data.attributes.name

        this.priceRequest()

        this.h1 = data.attributes.seo_h1
        this.imageSrc = data.attributes.images[0]
        this.priceLink = data.attributes.seo_url
        this.favoriteId = data.attributes.favorit_id || 0
        this.propertiesList = data.relationships.attribute.data.slice(0, 3)

        this.fullPropertiesList = data.relationships.attribute.data
        
        if ( 'data' in data.relationships.alter_packing ) {
          this.sizes = data.relationships.alter_packing.data
        }

        this.content = data.attributes.extra_data

        this.analogs = data.relationships.similar_product.data
        
        this.recommendations = data.relationships.product_buy.data
        
      },
      changePickpoint() {
        this.priceRequest()
      }
    },
    created () {

      this.$eventBus.$on('change-pick-point', this.changePickpoint)

      if ('json_page_data' in window && window.json_page_data !== null) {

        console.log('ssr', json_page_data)
        const pageData = window.json_page_data.data
        this.initPage(pageData)
        this.breadcrumbs = window.json_page_breadcrumbs || []

      } else {

        const url_string = window.location.href
        let request = new URL(url_string)

        if (this.$store.getters['common/getPreviousRoute'].length) {
          request.searchParams.set('referrer', this.$store.getters['common/getPreviousRoute'])
        }
        
        request.searchParams.set('json', '')

        this.pageLoading = true

        this.$axios.get(request)
          .then(response => {
            const data = response.data

            console.log(data)
            this.initPage(data.data.data)
            this.breadcrumbs = data.breadcrumb || []
            this.pageLoading = false

          })

      }

    },
    beforeDestroy () {
      this.$eventBus.$off('change-pick-point')
    }
  }

</script>
