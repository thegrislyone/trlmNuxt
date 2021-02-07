<template>
  <div class="offers-list">
    <div class="offer-heading">
      <div class="offer-heading__title">Наименование</div>
      <div class="offer-heading__name">{{ offer.attribute.brand }}</div>
      <div class="offer-heading__description">
        {{ offer.attribute.name }}
        <template v-if="offer.attribute.article">
          <br>
          {{ offer.attribute.article }}
        </template>
      </div>
    </div>

    <div class="offer-table">
      <div class="offer-table__row offer-table__row_header">
        <div class="offer-table__col">
          <span class="offer-table__value">Наличие</span>
        </div>
        <div class="offer-table__col">
          <span class="offer-table__value">Срок</span>
        </div>
        <div class="offer-table__col">
          <span v-if="windowWidth >= 1400" class="offer-table__value">Поставщик</span>
        </div>
        <div class="offer-table__col">
          <span class="offer-table__value">Цена</span>
        </div>
        <div class="offer-table__col">
          <!-- offset -->
        </div>
      </div>
      <transition-group
        name="fader"
        tag="div"
        class="offer-table__body"
      >
        <offers-list-row
          v-for="item in offersList"
          :key="item.id"
          :item="item"
        ></offers-list-row>

        <div
          v-if="offersDiff !== 0"
          class="offer-table__row offer-table__row_more"
          :key="'showmore'"
        >
          <div
            v-if="offersLoading"
            class="loading loading_centered"
          >
            <div class="preloader-btn"></div>
          </div>
          <button
            class="offer-table__more"
            type="button"
            @click.prevent="showMore(offer.attribute.search)"
          >
            Еще {{ offersCount }}
            <img src="/trlm/images/i-arrow_offers.svg">
          </button>
        </div>
      </transition-group>
      
      
    </div>
  </div>
</template>

<script>
  import OffersListRow from './OffersListRow.vue'

  export default {
    props: {
      offer: {
        type: Object,
        required: true
      }
    },
    components: {
      OffersListRow
    },
    data() {
      return {
        offersList: this.offer.relationships.offer.data.slice(),
        defaultOffersCount: this.offer.attribute.per_page,
        offersLoading: false,
        itemsToShow: this.offer.attribute.count,
        page: 1
      }
    },
    watch: {
      offer(newValue) {
        this.offersList = newValue.relationships.offer.data.slice()
      }
    },
    computed: {
      windowWidth() {
        return this.$store.getters['resize/windowWidth']
      },
      offersDiff() {
        return this.offer.attribute.count_all - this.offersList.length
      },
      offersCount() {
        if (this.offersDiff === 0) {
          // this.showMoreButton = false
        } else if (this.offersDiff < this.defaultOffersCount) {
          return this.offersDiff
        } else {
          return this.defaultOffersCount
        }
        
      },
    },
    methods: {
      showMore(search) {
      
        const searchString = window.location.search

        let url_string = window.location.origin
        url_string += `/api/general/public/offer/${search + searchString}`

        let requestUrl = new URL(url_string)
        
        for (let key in this.$store.state.filterCheckedValues) {

          if (key !== 'brand') {
            requestUrl.searchParams.set(`filter[${ key }]`, this.$store.state.filterCheckedValues[key].join(','))
          }

        }

        requestUrl.searchParams.set('page[number]', this.page)

        this.offersLoading = true

        this.$axios.get(requestUrl)
          .then(response => {
            const data = response.data

            console.log(data)
            this.offersList.push(...data.data)
            this.offersLoading = false
            this.page++
          })
          .catch(error => {
            console.log(error)
            this.offersLoading = false
          })
        
      }
    },
    created () {
    }
  }
</script>

<style>

</style>$