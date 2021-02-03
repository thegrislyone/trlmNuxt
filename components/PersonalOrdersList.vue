<template>
  <div>

    <div class="preloader" v-show="loading">
      <div class="preloader-btn"></div>
    </div>

    <div
      v-show="!loading" 
      class="orders-list"
    >
      <PersonalToolbar
        :getData="getData.relationships"
        :add="false"
        :search="false"
        @filterUpdate="filterUpdate"
      />

      <!-- short < 1280 list-version -->
      <div
        v-if="$is_empty(orderList)"
        class="personal__alerts"
      >
        <div 
          class="un-form__message message un-form__message_i-danger"
        >
          <span>Нет результатов</span>
        </div>
      </div>

      <div 
        v-else
        class="orders-list__list"
      >
        <div 
          v-if="$root.windowWidth >= 1280"
          class="order-list__header_full"
        >
          <div class="order-list__header-item order-list__header-order">
            <span>{{ getData.relationships.thead[0] }}</span>
          </div>
          <div class="order-list__header-item order-list__header-product">
            <span>{{ getData.relationships.thead[1] }}</span>
          </div>

          <div 
            v-if="$root.windowWidth >= 1600"
            class="order-list__header-item order-list__header-delivery"
          >
            <span>{{ getData.relationships.thead[2] }}</span>
          </div>

          <div 
            v-if="$root.windowWidth >= 1600"
            class="order-list__header-item order-list__header-status"
          >
            <span>{{ getData.relationships.thead[3] }}</span>
          </div>
          
          <div class="order-list__header-item order-list__header-vendor">
            <span>{{ getData.relationships.thead[4] }}</span>
          </div>
          <div class="order-list__header-item order-list__header-price">
            <span>{{ getData.relationships.thead[5] }}</span>
          </div>
          <div class="order-list__header-item order-list__header-quantity">
            <span>{{ getData.relationships.thead[6] }}</span>
          </div>
          <div class="order-list__header-item order-list__header-final-price">
            <span>{{ getData.relationships.thead[7] }}</span>
          </div>
        </div>
        <div
          v-for="(order, index) in orderList"
          :key="index"
          class="order-list__item"
        >
          <div class="order-list__headline">
            <div class="order-list__first_column">
              <h3 class="order-list__order-id">
                <span v-if="$root.windowWidth < 1280">Заказ</span> №{{ order.attributes.id }}
              </h3>
              <div class="order-list__from">
                от {{order.attributes.date}}
              </div>
            </div>
            <div class="order-list__second-column">

              <div
                v-if="!$is_empty(order.attributes.payment_status)"
                class="order-list__payment-status"
                :class="{
                  'order-list__payment-status_success': order.attributes.payment_status,
                  'order-list__payment-status_error': !order.attributes.payment_status
                }"
              >
                {{ order.attributes.payment_status_text }}
              </div>
              
            </div>
          
          </div>
          
          <div class="order-list__orders">

            <div 
              v-for="item in order.relationships.order_line.data"
              :key="item.id"
              class="order-list__order"
            >
              <div class="order-list__order-headline">
              <div class="order-list__headline-first-column">
                <h3 class="order-list__order-name">
                  {{ item.attributes.brand }} 
                  <span 
                    v-if="$root.windowWidth >= 1280"
                    class="order-list__article"
                  >{{ item.article }}</span>
                  </h3>
                  <div class="order-list__order-item">{{ item.attributes.product_name }}</div>
                  <span
                    v-if="$root.windowWidth < 1280"
                    class="order-list__article"
                  >{{ item.article }}</span>
                  <div 
                    v-if="$root.windowWidth >= 1280"
                    class="order-list__status"
                  >
                    <span class=""
                      :style="{color: item.attributes.line_status_color}">
                      {{ item.attributes.line_status_text }}
                    </span> 
                  </div>
                  <div 
                    v-if="$root.windowWidth < 1600 && $root.windowWidth >= 1280"
                    class="order-list__delivery"
                  >
                    <div 
                      class="order-list__delivery-value">
                      <span class="">
                        доставка: {{ item.attributes.day_delivery }}
                      </span> 
                    </div>
                  </div>
              </div>

              <div class="order-list__search-again order-list__search-again_640" @click="searchAgain(item.id, item.attributes.offer_url)">
                <img src="/trlm/images/i-search_blue.svg" alt="">
                <span>Искать заново</span>
              </div>
                
              </div>

              <div 
                v-if="$root.windowWidth >= 1600"
                class="order-list__delivery"
              >
                <div 
                  class="order-list__delivery-value">
                  <span class="">
                    {{ item.attributes.day_delivery }}
                  </span> 
                </div>
              </div>

              <div 
                v-if="$root.windowWidth < 1280 || $root.windowWidth >= 1600"
                class="order-list__status"
              >
                <div class=""><span v-if="$root.windowWidth < 1600">статус</span></div>
                <div 
                  class="order-list__status-value">
                  <span 
                    class=""
                    :style="{color: item.attributes.line_status_color}"
                    v-tooltip="item.attributes.line_status_annotation"
                  >
                    {{ item.attributes.line_status_text }}
                  </span> 
                </div>
              </div>

              <div 
                v-if="$root.windowWidth < 1280"
                class="order-list__delivery-date"
              >
                <div class="">доставим</div>
                <div class="">{{ item.attributes.day_delivery }}</div>
              </div>

              <div class="order-list__vendor">
                <div class="order-list__label"><span>поставщик</span></div>
                <div class="order-list__vendor-value">
                <span v-tooltip="'склад ' + item.attributes.warehouse_name">{{ item.attributes.supplier_name }}</span>
                <span class="order-list__vendor-rating">3.35</span>
                </div>
              </div>
              
              <div 
                v-if="$root.windowWidth < 1280"
                class="order-list__stock"
              >
                <div class="order-list__label"><span>склад</span></div>
                <div class="order-list__stock-value"><span>{{ item.attributes.warehouse_name }}</span></div>
              </div>        

              <div class="order-list__retail-price">
                <div class="order-list__label">цена</div>
                <div class="order-list__number">
                  <span v-tooltip="String(item.attributes.price) + ' ₽'">{{ item.attributes.price }}<span class="order-list__sign">₽</span></span>
                </div>
              </div>

              <div class="order-list__quantity">
                <div class="order-list__label">кол-во</div>
                <div class="order-list__number"><span class="order-list__price-wrapper" v-tooltip="String(item.attributes.quantity) + ' шт.'">{{ item.attributes.quantity }} <span class="order-list__sign">шт.</span></span></div>
              </div>

              <div class="order-list__final-price">
                <div class="order-list__label">итого</div>
                <div class="order-list__number"><span v-tooltip="String(item.attributes.summ) + ' ₽'">{{ item.attributes.summ }}<span class="order-list__sign">₽</span></span></div>
              </div>

              <div class="order-list__search">
                <div class="order-list__search-button" v-tooltip="'Искать заново'" @click="searchAgain(item.id, item.attributes.offer_url)">
                  <img src="/trlm/images/i-search_blue.svg" alt="">
                </div>
                
              </div>

              <div 
                v-if="$root.windowWidth < 640"
                class="order-list__search-again order-list__search-again_320" 
                @click="searchAgain(item.id, item.attributes.offer_url)"
              >
                <img src="/trlm/images/i-search_blue.svg" alt="">
                <span>Искать заново</span>
              </div>

            </div>

          </div>

        </div>
      </div>

      <!-- full 1280+ list-version -->

      <div 
        v-if="pagination.last_page != 1"
        class="order-list__paginate_wrapper"
      >
        <paginate
          :paginateData="pagination"
          :clickHandler="goToPage"
          :pageRange="$root.windowWidth > 640 ? 5 : 3"
        />
      </div>
    </div>
  </div>
  
</template>

<script>
import PersonalToolbar from './PersonalToolbar.vue'

import Paginate from './Paginate.vue'
import PersonalMultiselect from './PersonalMultiselect.vue'
import PersonalAutocomplete from './PersonalAutocomplete.vue'
import PersonalText from './PersonalText.vue'
import PersonalDate from './PersonalDate.vue'
import PersonalNumber from './PersonalNumber.vue'

  export default {
    components: {
      PersonalToolbar,

      Paginate,
      PersonalMultiselect,
      PersonalAutocomplete,
      PersonalText,
      PersonalDate,
      PersonalNumber
    },
    props: {
      data: {
        type: Object,
        required: true,
      },
      url: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        getData: this.data.data,
        currentUrl: this.url,
        currentFilter: "",
        loading: false,

        urlObject: {},

        //currentPagination: 1
      }
    },
    computed: {
      // lastPage() {
      //   const page = this.getData.relationships.order_history.meta.page
      //   return page["last_page"]
      // },
      // currentPage() {
      //   const page = this.getData.relationships.order_history.meta.page
      //   return page["current_page"]
      // },
      pagination() {
        return this.getData.relationships.order_history.meta.page
      },
      orderList() {
        return this.getData.relationships.order_history.data
      },
      // ajaxUrlConstruct() {
      //   return this.currentUrl + '?page[number]=' + this.currentPagination + this.currentFilter
      // },
    },
    watch: {
      
    },
    created() {
      this.urlObject = new URL(document.location.origin + this.currentUrl)
      this.urlObject.searchParams.set('page[number]', 1)
    },
    mounted() {
    },
    methods: {
      goToPage(page) {
        this.urlObject.searchParams.set('page[number]', page)

        this.loading = true

        $.ajax({
          url: this.urlObject.href,
          method: "GET",
          dataType: "json",
          success: (data) => {
            this.getData = data.data
            this.loading = false
          }
        })
      },
      
      filterUpdate(filter) {

        for (let [key, elem] of Object.entries(filter)) {

          if (elem.type == 'text') {

            if (elem.value) {
              this.urlObject.searchParams.set('filter[' + key + ']', elem.value)
            } else {
              this.urlObject.searchParams.delete('filter[' + key + ']')
            }

          } else if (elem.type == 'multiselect') {

            if (elem.choosen.length) {

              let multiselectFilterValue = ''
              elem.choosen.forEach(function(item, index) {
                multiselectFilterValue += item
                if (elem.choosen[index + 1] !== undefined && elem.choosen[index + 1] !== null) {
                  multiselectFilterValue += ','
                }
              })

              this.urlObject.searchParams.set('filter[' + key + ']', multiselectFilterValue)

            } else {
              this.urlObject.searchParams.delete('filter[' + key + ']')
            }
          } else if (elem.type == 'number' || elem.type == 'date') {
            if (!this.$is_empty(elem.from)) {
              this.urlObject.searchParams.set('filter[' + key + '][from]', elem.from)
            } else {
              this.urlObject.searchParams.delete('filter[' + key + '][from]')
            }
            if (!this.$is_empty(elem.to)) {
              this.urlObject.searchParams.set('filter[' + key + '][to]', elem.to)
            } else {
              this.urlObject.searchParams.delete('filter[' + key + '][to]')
            }
          }
        }

        this.urlObject.searchParams.set('page[number]', 1)
        this.loading = true

         $.ajax({
          url: this.urlObject.href,
          method: "GET",
          dataType: "json",
          success: (data) => {
            this.getData = data.data
            this.loading = false
          }
        })
      },
      searchAgain(id, url) {
        this.$router.push(url)
      }
    }
  }
</script>