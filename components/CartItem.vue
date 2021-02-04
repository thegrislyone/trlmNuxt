<template>
  <div
    class="offers-list"
    :class="{ 'offers-list_error' : item.attributes.error !== 0 }"
  >
    <div
      class="offer-heading"
      :class="{ 'offer-heading_with-checkbox' : $parent.isAuthorized }"
    >
      <div class="offer-heading__title">
        <div v-if="$parent.isAuthorized" class="offer__checkbox">
          <input
            type="checkbox"
            id="checkAll"
            v-model="$parent.checkAll"
          >
          <label for="checkAll">&nbsp;</label>
        </div>
        Наименование
      </div>
      <div class="offer-heading__name">
        <div v-if="$parent.isAuthorized" class="offer__checkbox">
          <input
            type="checkbox"
            :id="'check-offer-' + item.id"
            v-model="checkbox"
            :value="item.id"
            :disabled="item.attributes.error !== 0"
          >
          <label :for="'check-offer-' + item.id">&nbsp;</label>
        </div>
        {{ item.attributes.brand }}
        <button
          v-if="windowWidth >= 1280 && item.attributes.error === 0"
          class="offer__actuality"
          type="button"
          v-tooltip="item.attributes.actuality_text"
          @click="refreshActuality"
        >
          <i
            class="actuality-icon"
            :class="{
              'actuality-icon_1' : item.attributes.actuality_type === 1,
              'actuality-icon_2' : item.attributes.actuality_type === 2,
              'actuality-icon_3' : item.attributes.actuality_type === 3
            }"
          >
            <svg
              v-if="item.attributes.actuality_type !== 3"
              width="11" height="8" viewBox="0 0 11 8"
              fill="none" xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3.59213 5.96565L1.07909 3.5968L0 4.61397L3.59213 8L11 1.01717L9.92091 0L3.59213 5.96565Z"/>
            </svg>
            <svg
              v-else
              width="10" height="10" viewBox="0 0 14 14"
              fill="none" xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12.2502 0L6.99938 5.24954L1.74984 0L0 1.74985L5.24954 6.99938L0 12.2489L1.74984 13.9988L6.99938 8.74923L12.2502 13.9988L14 12.2489L8.75046 6.99938L14 1.74985L12.2502 0Z"/>
            </svg>
          </i>
        </button>
      </div>
      <div class="offer-heading__description">
        {{ item.attributes.product_name }}
        <br>
        {{ item.attributes.article }}
      </div>      
    </div>

    <div
      v-if="windowWidth < 1280 && item.attributes.error === 0"
      class="offer-actuality row"
    >
      <div class="offer-actuality__text">
        <i
          class="actuality-icon"
          :class="{
            'actuality-icon_1' : item.attributes.actuality_type === 1,
            'actuality-icon_2' : item.attributes.actuality_type === 2,
            'actuality-icon_3' : item.attributes.actuality_type === 3
          }"
        >
          <svg
            v-if="item.attributes.actuality_type !== 3"
            width="11" height="8" viewBox="0 0 11 8"
            fill="none" xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3.59213 5.96565L1.07909 3.5968L0 4.61397L3.59213 8L11 1.01717L9.92091 0L3.59213 5.96565Z"/>
          </svg>
          <svg
            v-else
            width="10" height="10" viewBox="0 0 14 14"
            fill="none" xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12.2502 0L6.99938 5.24954L1.74984 0L0 1.74985L5.24954 6.99938L0 12.2489L1.74984 13.9988L6.99938 8.74923L12.2502 13.9988L14 12.2489L8.75046 6.99938L14 1.74985L12.2502 0Z"/>
          </svg>
        </i>{{ item.attributes.actuality_text }}
      </div>
      <button
        class="offer-actuality__btn"
        type="button"
        @click="refreshActuality"
      >Обновить</button>
    </div>

    <div class="offer-table">
      <div class="offer-table__row offer-table__row_header">
        <div class="offer-table__col">
          <span class="offer-table__value">Срок</span>
        </div>
        <div class="offer-table__col">
          <span class="offer-table__value">Поставщик</span>
        </div>
        <div class="offer-table__col">
          <span class="offer-table__value">Склад</span>
        </div>
        <div class="offer-table__col">
          <span class="offer-table__value">Цена</span>
        </div>
        <div class="offer-table__col">
          <span class="offer-table__value">Кол-во</span>
        </div>
        <div class="offer-table__col">
          <span class="offer-table__value">Итого</span>
        </div>
      </div>

      <div v-if="item.attributes.error === 0" class="offer-table__row">
        <div class="offer-table__col offer-table__col_term">
          <span class="offer-table__caption offer-table__caption_term">
            <span>доставим </span>{{ item.attributes.day_delivery_text }}
          </span>
          <span
            v-if="item.attributes.is_min_day"
            class="offer-table__value offer-table__value_special"
            v-tooltip="'Cамая быстрая доставка'"
          >
            {{ item.attributes.day_delivery }}
          </span>
          <span
            v-else
            class="offer-table__value"
          >
            {{ item.attributes.day_delivery }}
          </span>
        </div>
        <div class="offer-table__col offer-table__col_supplier">
          <span
            v-if="item.attributes.official_distributor"
            class="offer-table__caption offer-table__caption_official"
          >
            оф. дилер
          </span>
          <span v-else class="offer-table__caption">
            поставщик
          </span>
          <span class="offer-table__value">
            {{ item.attributes.supplier_name}}
            <span>{{ item.attributes.supplier_rating}}</span>
          </span>
        </div>
        <div class="offer-table__col offer-table__col_stock">
          <span class="offer-table__caption">склад</span>
          <span class="offer-table__value offer-table__value_stock">{{ item.attributes.warehouse_name }}</span>
        </div>
        <div class="offer-table__col offer-table__col_cost">
          <span class="offer-table__caption">цена</span>
          <span
            v-if="item.attributes.is_min_price"
            class="
              offer-table__value
              offer-table__value_cost
              offer-table__value_special
            "
            v-tooltip="'Cамая низкая цена'"
          >
            {{ item.attributes.price_display | numberPrettify }} ₽
          </span>
          <span
            v-else
            class="
              offer-table__value 
              offer-table__value_cost
            "
          >
            {{ item.attributes.price_display | numberPrettify }} ₽
          </span>
        </div>
        <div class="offer-table__col offer-table__col_btn-group">
          <div class="offer-table__btn-group">
            <quantity-input
              class="offer__quantity"
              v-model="quantity"
              :min="multiplicity"
              :max="(Number(item.attributes.max_count) === 1000) ? Infinity : Number(item.attributes.max_count)"
              :step="multiplicity"
            ></quantity-input>
            <button
              class="offer-table__remove-btn btn btn_border btn_small btn_grey"
              @click.prevent="$store.commit('cart/removeItemFromCart', item.id)"
            >
              <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 18C2 19.103 2.897 20 4 20H14C15.103 20 16 19.103 16 18V6H18V4H14V2C14 0.897 13.103 0 12 0H6C4.897 0 4 0.897 4 2V4H0V6H2V18ZM6 2H12V4H6V2ZM14 6L14.001 18H4V6H14Z"/>
                <path d="M6 8H8V16H6V8ZM10 8H12V16H10V8Z"/>
              </svg>
              <template v-if="windowWidth < 1280">
                Удалить
              </template>
            </button>
          </div>
        </div>
        <div class="offer-table__col">
          <span class="offer-table__caption">итого</span>
          <span
            class="
              offer-table__value 
              offer-table__value_cost
              offer-table__value_subtotal
            "
          >
            {{ item.attributes.price_total | numberPrettify }} ₽
          </span>
        </div>
      </div>

      <!-- error items -->
      <div v-else class="offer-table__row offer-table__row_error">
        <div class="offer-table__error">
          {{ item.attributes.error_text }}
        </div>
        <router-link
          :to="item.attributes.error_url"
          class="offer__search-offer btn btn_border btn_black btn_small"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.69765 15.3945C9.47389 15.3945 11.1068 14.7835 12.4096 13.7704L16.6394 18L18 16.6395L13.7701 12.4099C14.7843 11.1062 15.3953 9.47338 15.3953 7.69724C15.3953 3.45318 11.9419 0 7.69765 0C3.45336 0 0 3.45318 0 7.69724C0 11.9413 3.45336 15.3945 7.69765 15.3945ZM7.69765 1.92431C10.8816 1.92431 13.4709 4.51347 13.4709 7.69724C13.4709 10.881 10.8816 13.4702 7.69765 13.4702C4.51371 13.4702 1.92441 10.881 1.92441 7.69724C1.92441 4.51347 4.51371 1.92431 7.69765 1.92431Z" />
          </svg>
          {{ item.attributes.error_anchor }}
        </router-link>
        <button
          class="offer-table__remove-btn btn btn_border btn_small btn_grey"
          @click.prevent="$store.commit('cart/removeItemFromCart', item.id)"
        >
          <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 18C2 19.103 2.897 20 4 20H14C15.103 20 16 19.103 16 18V6H18V4H14V2C14 0.897 13.103 0 12 0H6C4.897 0 4 0.897 4 2V4H0V6H2V18ZM6 2H12V4H6V2ZM14 6L14.001 18H4V6H14Z"/>
            <path d="M6 8H8V16H6V8ZM10 8H12V16H10V8Z"/>
          </svg>
          <template v-if="windowWidth < 1280">
            Удалить
          </template>
        </button>
      </div>

    </div>
  </div>
</template>

<script>
  import QuantityInput from './QuantityInput.vue'
  import { debounce } from 'vue-debounce'

  export default {
    props: {
      item: {
        type: Object,
        required: true
      },
      value: {
        type: Array
      }
    },
    components: {
      QuantityInput
    },
    data() {
      return {
        quantity: Number(this.item.attributes.quantity),
        debouncedQuantity: null
      }
    },
    watch: {
      quantity(value) {
        this.debouncedQuantity(value)
      }
    },
    computed: {
      windowWidth() {
        return this.$store.getters['resize/windowWidth']
      },

      checkbox: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('input', val)
        }
      },
      multiplicity() {
        return this.item.attributes.multiplicity < 1 ? 1 : +this.item.attributes.multiplicity
      }
    },
    methods: {
      updateQuantity(value) {

        this.$store.dispatch('cart/updateQuantity', {
          id: this.item.id,
          quantity: value
        })
        // this.$root.updateQuantity(this.item.id, value)
      },
      refreshActuality() {

        this.$store.commit('cart/loadingStatusChange', true)

        // this.$root.cartLoading = true

        $.ajax({
          url: '/api/check-position/' + this.item.id,
          dataType: 'json',
          success: data => {
            console.log('refreshActuality', data)
            this.$store.commit('cart/setCart', data)
            this.$store.commit('cart/loadingStatusChange', false)

            // this.$root.cartItems = Object.values(data.data.relationships.cart_line.data)
            // this.$root.cartData = data.data.attributes
            // this.$root.cartLoading = false
          },
          error: data => {
            console.log(data.responseText)
            this.$store.commit('cart/loadingStatusChange', false)
            // this.$root.cartLoading = false
          }
        })
      }
    },
    created () {
      this.debouncedQuantity = debounce(this.updateQuantity, 400)
    }
  }
</script>

<style>

</style>