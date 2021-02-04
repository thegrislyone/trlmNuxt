<template>
  <div>

    <h1>{{ cartName }}</h1>
	
    <div class="main-container">
      
      <div class="main-content">

        <sticky-loader v-if="cartLoading" />

        <div class="main-content__message message message_i-time">
          По статистике 10% заказов, сделанных более
          чем через час после проценки, не могут быть исполнены,
          так как товар к тому времени уже куплен. Вы можете
          оформлять заказ частями.
        </div>
        <div
          v-if="cartItems.length"
          class="cart"
        >
          <cart-item
            v-for="item in cartItems"
            :key="item.id"
            :item="item"
            v-model="checkedItems"
          ></cart-item>

          <div
            v-if="selectErrors.length"
            class="message message_error cart-message"
          >
            <li
              v-for="(error, index) in selectErrors"
              :key="index"
            >
              {{ error }}
            </li>
          </div>
          <div
            v-else-if="selectSuccessMessage"
            class="message message_succsess cart-message"
          >
            {{ selectSuccessMessage }}
          </div>
          
          <div class="cart-footer">
            <template v-if="!isNotComputedPricing">
              <div class="check-all">
                <div class="check-all__content">
                  <input
                    type="checkbox"
                    id="checkAllFooter"
                    v-model="checkAll"
                  >
                  <label class="check-all__label" for="checkAllFooter">
                    <span>Выбрать все</span>
                  </label>
                  <div class="check-all__select-container">
                    <div
                      v-if="selectLoading"
                      class="loading loading_centered"
                    >
                      <div class="preloader-btn"></div>
                    </div>
                    <multiselect
                      class="check-all__select"
                      v-model="selected"
                      :options="selectOptions"
                      track-by="name"
                      label="name"
                      :reset-after="true"
                      :searchable="false"
                      :show-labels="false"
                      :disabled="checkedItems.length === 0 || selectLoading"
                      placeholder="сделать с выбранными"
                      @select="selectAction"
                    ></multiselect>

                    <transition>
                      <div
                        v-if="postponeShow"
                        class="postpone"
                      >
                        <div class="postpone__top">
                          <div class="postpone__text">
                            <p>Выбранные товары будут перемещены в отдельную корзину, доступную в личном кабинете.</p>
                            <p>Укажите название новой корзины:</p>
                          </div>
                          <div class="postpone__close-img">
                            <img 
                              src="/trlm/images/i-close.svg"
                              @click="postponeClose"
                            >
                          </div>
                        </div>
                        <div class="postpone__form">
                          <div class="postpone__input">
                            <input 
                              type="text"
                              v-model="postponeCartName"
                            />
                          </div>
                          <div class="postpone__buttons">
                            <button 
                              class="postpone__replace-btn btn btn_blue"
                              @click="postponeApply"
                            >
                              <span v-if="!postponeLoading">Переместить</span>
                              <div v-else class="preloader-btn"></div>
                            </button>
                            <button 
                              class="postpone__cancel-btn btn btn_black btn_border"
                              @click="postponeClose"
                            >Отменить</button>
                          </div>
                        </div>
                      </div>
                    </transition>

                  </div>
                </div>
              </div>
            </template>
            <div v-if="officeIs" class="cart-office">
              <div class="cart-office__message">
                <b>Сроки доставки и цены</b> указаны для пункта выдачи: {{ officeIs.attributes.name }}
              </div>
              <!-- schedule-modal -->
              <pickpoint-schedule
                :container-class="'cart-office__btn'"
                :button-class="'link'"
              ></pickpoint-schedule>
              <!-- /schedule-modal -->
              <button
                class="cart-office__btn link another-pickpoint-btn"
                type="button"
                @click="pickAnother"
              >
                Выбрать другой пункт
              </button>
            </div>
            <div
              v-if="windowWidth >= 1280"
              class="checked-subtotal"
            >
              <template
                v-if="checkedItems.length"
              >
                <div class="checked-subtotal__caption">Выбрано на сумму:</div>
                <div class="checked-subtotal__value">{{ checkedSubtotal | round | numberPrettify }} ₽</div>
              </template>
              <template
                v-else
              >
                <div class="checked-subtotal__caption">Заказ на сумму:</div>
                <div class="checked-subtotal__value">{{ cartData.summ | numberPrettify }} ₽</div>
              </template>
            </div>
          </div>
          <div class="cart-total">
            <div class="cart-total__item promocode">
              <input
                class="promocode__input"
                name="promocode"
                type="text" 
                placeholder="Промокод"
                v-model="promocode"
                @keyup.enter="applyPromocode"
              >
              <button
                class="promocode__btn btn"
                type="button"
                @click="applyPromocode"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.293 12L6.707 13.414L13.414 6.707L6.707 0L5.293 1.414L9.586 5.707H0V7.707H9.586L5.293 12Z"/>
                </svg>
              </button>
            </div>
            <div
              v-if="windowWidth < 1280"
              class="cart-total__item cart-total__item_subtotal"
            >
              <div class="cart-total__caption">Заказ на сумму</div>
              <div class="cart-total__value">{{ cartData.summ | numberPrettify }} ₽</div>
            </div>
            <div
              v-if="discountCondition"
              class="cart-total__item cart-total__item_discount"
            >
              <div class="cart-total__caption">
                <img
                  src="/trlm/images/i-question.svg"
                  alt=""
                  v-tooltip="{
                    content: discountTooltipContent,
                    classes: 'align-left'
                  }"
                >
                Скидка
              </div>
              <div class="cart-total__value">
                <template v-if="isNotComputedPricing || !checkedItems.length">
                  -{{ cartData.summ_discount | numberPrettify }} ₽
                </template>
                <template v-else>
                  -{{ discountSumm | round | numberPrettify }} ₽
                </template>
              </div>
            </div>
            <div class="cart-total__item cart-total__item_total">
              <div class="cart-total__caption">Итого</div>
              <div class="cart-total__value">
                <template v-if="isNotComputedPricing || !checkedItems.length">
                  {{ cartData.total | numberPrettify }} ₽
                </template>
                <template v-else>
                  {{ totalSumm | round | numberPrettify }} ₽
                </template>
              </div>
            </div>
            <button
              class="cart__checkout-btn btn"
              type="button"
              @click="goToCheckout"
            >
              Оформить заказ
            </button>
          </div>
        </div>
        <div
          v-else
          class="cart"
        >
          Корзина пуста
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import CartItem from '../components/CartItem.vue'
  import PickpointSchedule from '../components/PickpointSchedule.vue'
  import Multiselect from 'vue-multiselect'

  export default {
    components: {
      CartItem, PickpointSchedule, Multiselect
    },
    data() {
      return {
        postponeShow: false,
        postponeCartName: 'Отложенный заказ',
        postponeLoading: false,

        checkedItems: [],
        checkboxAll: false,
        promocode: '',
        selected: '',
        selectOptions: [
          { name: 'Отложить выбранное', action: 'postpone' },
          { name: 'Добавить в избранные', action: 'favorite' },
          { name: 'Удалить выбранное', action: 'delete' },
        ],
        selectLoading: false,
        selectErrors: [],
        selectSuccessMessage: ''
      }
    },
    computed: {
      //cart store
      cartLoading() {
        return this.$store.getters['cart/cartLoading']
      },
      cartItems() {
        return this.$store.getters['cart/cartItems']
      },
      cartData() {
        return this.$store.getters['cart/cartData']
      },

      windowWidth() {
        return this.$store.getters['resize/windowWidth']
      },

      officeIs() {
        return this.$store.getters['pickpoints/officeIs']
      },
      

      checkAll: {
        get() {
          return this.checkboxAll
        },
        set(value) {
          this.checkboxAll = value

          if (value) {

            const validItems = this.cartItems.filter(item => item.attributes.error === 0)
            this.checkedItems = validItems.map(item => item.id)

          } else {

            this.checkedItems = []

          }

        }
      },
      isAuthorized() {
        return this.$store.getters.isAuthorized
      },
      checkedValues() {
        return this.cartItems.filter(item => this.checkedItems.includes(item.id))
      },
      checkedSubtotal() {
        let result = 0
        this.checkedValues.forEach(item => {
          result += +item.attributes.price_display * +item.attributes.quantity
        })
        return result
      },
      isNotComputedPricing() {
        return this.windowWidth < 1280 || !this.isAuthorized
      },
      discountSumm() {
        let result = 0
        this.checkedValues.forEach(item => {
          result += (+item.attributes.price_display - +item.attributes.price_discount) * +item.attributes.quantity
        })
        return result
      },
      totalSumm() {
        return this.checkedSubtotal - this.discountSumm
      },
      discountCondition() {
        const condition = this.isNotComputedPricing ? this.cartData.summ_discount > 0 : this.discountSumm > 0
        return condition
      },
      discountTooltipContent() {

        let promocodes = []

        const promocodesHandler = (data) => {
          data.forEach(item => {
            const discountSumm = (+item.attributes.price_display - +item.attributes.price_discount) * +item.attributes.quantity
            if ( item.attributes.apply_promo_code in promocodes ) {
              promocodes[item.attributes.apply_promo_code] += this.$options.filters.round(discountSumm)
            } else {
              promocodes[item.attributes.apply_promo_code] = this.$options.filters.round(discountSumm)
            }
          })
        }

        if (this.isNotComputedPricing) {
          promocodesHandler(this.checkedValues)
        } else {
          promocodesHandler(this.cartItems)
        }

        let content = ''

        for ( let code in promocodes ) {
          content += `${code}: -${promocodes[code]} ₽<br>`
        }
        
        return content

      },
      cartName() {
        return (!this.$is_empty(this.cartData)) ? this.cartData.name : "Корзина"
      }
    },
    created() {

      console.log(this.officeIs, 'officeIs')

      const cartDate = new Date()

      const cartDay = (String(cartDate.getDate()).length == 1) ? ('0' + String(cartDate.getDate())) : String(cartDate.getDate())
      const cartMonth = (String(cartDate.getMonth() + 1).length == 1) ? ('0' + String(cartDate.getMonth() + 1)) : String(cartDate.getMonth() + 1)
      const cartHours = (String(cartDate.getHours()).length == 1) ? ('0' + String(cartDate.getHours())) : String(cartDate.getHours())
      const cartMinutes = (String(cartDate.getMinutes()).length == 1) ? ('0' + String(cartDate.getMinutes())) : String(cartDate.getMinutes())
      
      this.postponeCartName = `Корзина ${cartDay}.${cartMonth} ${cartHours}:${cartMinutes}`
      
    },
    methods: {
      applyPromocode() {

        this.cartLoading = true

        const request = {
          code: this.promocode,
          cart_id: null
        }

        this.$axios.post('/api/dbtrlm/public/cart_promo_code', request)
          .then(response => {
            const data = response.data

            console.log('promocode', data)
            this.$store.commit('cart/setCart', data)
            this.$store.commit('cart/loadingStatusChange', false)

            // this.cartItems = Object.values(data.data.relationships.cart_line.data)
            // this.cartData = data.data.attributes
            // this.cartLoading = false
          })
          .catch(error => {
            console.log(error)
            this.$store.commit('cart/loadingStatusChange', false)
          })

      },
      pickAnother() {
        this.$root.showPopper()
        $('html, body').animate({
          scrollTop: 0
        }, 400)
      },
      goToCheckout() {

        this.$metricGoal('order_start')
        
        if (!this.isAuthorized) {
          this.$root.authorizationForCheckout()
        } else {
          this.$router.push({
            name: 'checkout',
            params: {
              start: true,
              check_group: this.checkedItems.join()
            }
          })
        }

      },
      selectAction(item) {
        switch (item.action) {
          case 'postpone':
            this.postponeOpen()
            break
          case 'favorite':
            this.addToFavorite()
            break
          case 'delete':
            this.deleteSelected()
        }
      },
      postponeOpen() {
        this.postponeShow = true
      },
      postponeClose() {
        this.postponeShow = false
      },
      postponeApply() {

        this.postponeLoading = true

        let cartCreateUrl = new URL(window.location.origin + '/api/cart/create')
        cartCreateUrl.searchParams.set('name', this.postponeCartName)

        this.$axios.get(cartCreateUrl.href)
          .then(response => {
            const data = response.data

            let cartReplaceUrl = new URL(window.location.origin + `/api/cart/transfer/${cartId}`)

            this.checkedItems.forEach((value, index) => {
              cartReplaceUrl.searchParams.set('lines_id[' + index + ']', value)
            })

            this.$axios.get(cartReplaceUrl.href)
              .then(response => {
                const data = response.data

                this.postponeLoading = false
                this.postponeShow = false
                this.$store.dispatch('cart/getCart')
              })

          })

      },
      async addToFavorite() {

        this.selectLoading = true

        this.selectErrors = []
        this.selectSuccessMessage = ''

        for (const id of this.checkedItems) {

          const cartItem = this.cartItems.find(item => item.id == id)

          if (cartItem && cartItem.attributes.favorit_id == 0) {

            const request = {
              article: cartItem.attributes.article,
              brand: cartItem.attributes.brand,
              name: cartItem.attributes.product_name
            }

            const response = this.$axios.post('/api/favorit-add')
              .then(response => {
                const data = response.data

                console.log('favorit-add', data)
                if (data.errors.length) {
                  const errors = data.errors.map(e => e.title)
                  this.selectErrors.push(...errors)
                } else {
                  cartItem.attributes.favorit_id = data
                }
              })
              .error(error => {
                console.log(error)
                this.selectErrors.push('Что-то пошло не так, попробуйте позже')
              })

          }

        }

        if (!this.selectErrors.length) {
          this.selectSuccessMessage = 'Выбранные товары успешно добавлены в избранное'
        }

        this.selectLoading = false

      },
      async deleteSelected() {

        this.cartLoading = true

        for (const id of this.checkedItems) {

          const response = await this.removeItemFromCartRequest(id)

        }

        this.cartLoading = false

      }
    }
  }
</script>