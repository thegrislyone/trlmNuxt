<template>
  <div
    class="checkout-page"
    :class="{ 'checkout-page_wholesale' : isWholesale }"
  >

    <h1 v-if="orders.length">Подтверждение заказа</h1>

    <div v-if="orders.length" class="checkout-orders">

      <checkout-order
        v-for="order in orders"
        :key="order.id"
        :order-data="order"
      ></checkout-order>

    </div>

    <div v-if="orders.length" class="checkout-orders-pickpoint">
      <div class="checkout-orders-pickpoint__address-caption">
        Адрес пункта выдачи:
      </div>
      <div class="checkout-orders-pickpoint__address">
        {{ pickpointAddress }}
        <template v-if="pickpointPhone.length">
          <br>
          Телефон: {{ pickpointPhone }}
        </template>
      </div>
      <map-component
        v-if="mapData !== null"
        class="checkout-orders-pickpoint__map"
        :map-data="mapData"
      ></map-component>
    </div>
    
    <div
      v-if="cartItems.length"
      class="checkout-cart"
    >

      <h1>Оформление заказа</h1>

      <template v-if="successItems.length">

        <!-- checkout-cart-items -->
        <div class="checkout-cart-items">
          <div
            v-for="item in successItems"
            :key="item.id"
            class="checkout-cart-item"
          >
            <div class="checkout-cart-item__heading row">
              <div class="checkout-cart-item__brand">{{ item.attributes.brand }}</div>
              <div class="checkout-cart-item__code">{{ item.attributes.article }}</div>
            </div>

            <div class="checkout-cart-item__description">
              <div class="checkout-cart-item__name">
                {{ item.attributes.product_name }}
              </div>
              <div class="checkout-cart-item__term">
                Ожидается: <span>{{ item.attributes.day_delivery_text }}, {{ item.attributes.day_delivery }}</span>
              </div>
            </div>
            
            <div class="checkout-cart-item__pricing row">
              <div class="checkout-cart-item__cost">{{ item.attributes.price | numberPrettify }} ₽</div>
              <div class="checkout-cart-item__quantity">{{ item.attributes.quantity }} шт</div>
              <div class="checkout-cart-item__total">{{ item.attributes.price * item.attributes.quantity | round | numberPrettify }} ₽</div>
            </div>
          </div>
        </div>
        <!-- /checkout-cart-items -->

        <!-- checkout-pricing -->
        <div class="checkout-cart-pricing">
          <div class="checkout-cart-pricing__item row">
            <span class="checkout-cart-pricing__key">Сумма</span>
            <span class="checkout-cart-pricing__value">{{ cartData.summ | numberPrettify }} ₽</span>
          </div>
          <div
            v-if="showPromocodeInput || isWholesale"
            class="checkout-cart-pricing__item checkout-cart-pricing__item_promocode row"
          >
            <input
              type="text"
              name="promocode"
              v-model="promocode"
              placeholder="Промокод"
              @keyup.enter="applyPromocode"
            >
            <button
              class="btn"
              type="button"
              @click="applyPromocode"
            >
              Применить
            </button>
          </div>
          <div
            v-for="code in cartPromocodes"
            :key="code.attributes.id"
            class="checkout-cart-pricing__item row"
          >
            <span class="checkout-cart-pricing__key">
              Промо-код
              <span>({{ code.attributes.code }})</span>
            </span>
            <span class="checkout-cart-pricing__value">-{{ code.attributes.summ | numberPrettify }} ₽</span>
          </div>
          <div class="checkout-cart-pricing__item row">
            <span class="checkout-cart-pricing__key">Итого</span>
            <span class="checkout-cart-pricing__value checkout-cart-pricing__value_total">{{ cartData.total | numberPrettify }} ₽</span>
          </div>
          <div class="checkout-cart-pricing__message">
            Информация о цене и наличии товара, а также о стоимости и условиях доставки является предварительной и будет уточнена в момент оформления заказа.
          </div>
        </div>
        <!-- /checkout-pricing -->

      </template>

      <!-- checkout-error-items -->
      <div
        v-if="errorItems.length"
        class="checkout-cart-items"
      >
        <div class="message message_error">
          Некоторые товары закончились, выберите другого поставщика или оформите без них
        </div>
        <div
          v-for="item in errorItems"
          :key="item.id"
          class="checkout-cart-item checkout-cart-item_error"
        >
          <div class="checkout-cart-item__main">
            <div class="checkout-cart-item__heading row">
              <div class="checkout-cart-item__brand">{{ item.attributes.brand }}</div>
              <div class="checkout-cart-item__code">{{ item.attributes.article }}</div>
            </div>

            <div class="checkout-cart-item__description">
              <div class="checkout-cart-item__name">
                {{ item.attributes.product_name }}
              </div>
            </div>
          </div>

          <router-link
            :to="item.attributes.error_url"
            class="checkout-cart-item__search-offer btn btn_border btn_black btn_small"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.69765 15.3945C9.47389 15.3945 11.1068 14.7835 12.4096 13.7704L16.6394 18L18 16.6395L13.7701 12.4099C14.7843 11.1062 15.3953 9.47338 15.3953 7.69724C15.3953 3.45318 11.9419 0 7.69765 0C3.45336 0 0 3.45318 0 7.69724C0 11.9413 3.45336 15.3945 7.69765 15.3945ZM7.69765 1.92431C10.8816 1.92431 13.4709 4.51347 13.4709 7.69724C13.4709 10.881 10.8816 13.4702 7.69765 13.4702C4.51371 13.4702 1.92441 10.881 1.92441 7.69724C1.92441 4.51347 4.51371 1.92431 7.69765 1.92431Z" />
            </svg>
            {{ item.attributes.error_anchor }}
          </router-link>

        </div>
      </div>
      <!-- /checkout-error-items -->

    </div>

    <!-- buyer-checkout-process -->
    <div
      v-if="formData !== null"
      class="checkout-process"
    >

      <sticky-loader v-if="formLoading" />

      <!-- checkout-process -->
      <form
        class="checkout-form form"
        @submit.prevent="formSubmit"
      >

        <h3>Доставка</h3>

        <div v-if="successMessage.length" class="checkout-form__message message message_i-message">
          {{ successMessage }}
        </div>

        <div
          v-for="(group, groupName) in mainForm"
          :key="groupName"
        >

          <!-- switcher -->
          <div v-if="isSwitcher(group)" class="type-switcher">
            <div
              v-for="(type, name) in group"
              :key="name"
              class="type-switcher-item"
              :class="{ 'active' : mainFormModel[groupName] === name }"
              @click="mainFormModel[groupName] = name"
            >
              <div class="type-switcher-item__heading row">
                <div class="type-switcher-item__name">{{ type.label }}</div>
                <div v-if="type.price" class="type-switcher-item__cost">{{ type.price }} ₽</div>
              </div>
              <div class="type-switcher-item__description">
                {{ type.description }}
              </div>
            </div>
            <div class="type-switcher-options">
              <div
                v-for="optionsGroup in getOptions(group)"
                :key="optionsGroup.optionName"
                class="type-switcher-options__item"
                v-show=" mainFormModel[groupName] === optionsGroup.optionName "
              >
                <form-group
                  v-for="(value, name) in optionsGroup.options"
                  :key="name"
                  :name="name"
                  :form-group="value"
                  :v="$v.mainFormModel[name]"
                  v-model.trim="$v.mainFormModel[name].$model"
                  @setSmsCode="setSmsCode"
                ></form-group>
              </div>
            </div>
          </div>

          <!-- pickpoint -->
          <div
            v-else-if="groupName === 'pick_point'"
            class="checkout-pick-point"
          >
            <h3>Адрес самовывоза</h3>
            
            <input
              type="radio"
              :id="'pickpoint-' + 1"
              name="pickpoint"
              v-model="pickpoint"
              :value="1"
            >
            <label
              class="checkout-pick-point__label"
              :for="'pickpoint-' + 1"
            >{{ $store.getters['pickpoints/officeIs'].attributes.name }}</label>
            <div class="checkout-pick-point-buttons">

              <!-- schedule-modal -->
              <pickpoint-schedule
                :container-class="'checkout-pick-point-buttons__item'"
              ></pickpoint-schedule>
              <!-- /schedule-modal -->

              <button
                class="checkout-pick-point-buttons__item another-pickpoint-btn btn btn_small btn_border"
                type="button"
                @click="pickAnother"
              >
                Выбрать другой пункт
              </button>
            </div>
            
          </div>

          <div
            v-else-if="groupName !== 'main'"
            class="checkout-recipient"
          >

            <h3>Получатель</h3>

            <div class="checkout-recipient__fields">

              <form-group
                v-for="(value, name) in group"
                :key="name"
                :name="name"
                :form-group="value"
                :v="$v.mainFormModel[name]"
                v-model.trim="$v.mainFormModel[name].$model"
                @setSmsCode="setSmsCode"
              ></form-group>

            </div>

          </div>
          
        </div>

        <!-- send -->
        <div
          v-if="buttons !== null"
          class="checkout-form__btn-group"
        >
          <div v-if="buttons.agreement" class="form__agreement">
            Нажимая кнопку «Перейти к оплате», <a href="#">я соглашаюсь на обработку персональных данных</a> в соответствии с <a href="#">политикой конфиденциальности</a>
          </div>
          <button
            v-for="button in buttons.right"
            :key="button.name"
            class="checkout-form__btn_right"
            :class="button.class"
            :type="button.type"
            @click.prevent="btnClickHandler(button)"
            v-show="isShow(button)"
          >
            {{ button.caption }}
          </button>
          <button
            v-for="button in buttons.left"
            :key="button.name"
            class="checkout-form__btn_left"
            :class="button.class"
            :type="button.type"
            @click.prevent="btnClickHandler(button)"
            v-show="isShow(button)"
          >
            {{ button.caption }}
          </button>
        </div>

      </form>
      <!-- /checkout-proccess -->

    </div>
    <!-- /buyer-checkout-process -->

    <!-- wholesale-checkout-process -->
    <div v-if="isWholesale" class="checkout-wholesale">

      <h3>Доставка</h3>

      <form class="checkout-wholesale-form form" @submit.prevent="formSubmit">

        <div class="checkout-pick-point">
          <input
            type="radio"
            :id="'pickpoint-' + 1"
            name="pickpoint"
            v-model="pickpoint"
            :value="1"
          >
          <label
            class="checkout-pick-point__label"
            :for="'pickpoint-' + 1"
          >{{ $store.getters['pickpoints/officeIs'].attributes.name }}</label>
          <div class="checkout-pick-point-buttons">
            <button
              class="checkout-pick-point-buttons__item another-pickpoint-btn btn btn_small btn_border"
              type="button"
              @click="pickAnother"
            >
              Выбрать другую точку
            </button>
            <div class="checkout-pick-point__message">При изменении адреса необходимо будет произвести пересчёт всей корзины</div>
          </div>
        </div>

        <!-- send -->
        <div
          v-if="buttons !== null"
          class="checkout-form__btn-group"
        >
          <div v-if="buttons.agreement" class="form__agreement">
            Нажимая кнопку «Перейти к оплате», <a href="#">я соглашаюсь на обработку персональных данных</a> в соответствии с <a href="#">политикой конфиденциальности</a>
          </div>
          <button
            v-for="button in buttons.right"
            :key="button.name"
            class="checkout-form__btn_right"
            :class="button.class"
            :type="button.type"
            @click.prevent="btnClickHandler(button)"
            v-show="isShow(button)"
          >
            {{ button.caption }}
          </button>
          <button
            v-for="button in buttons.left"
            :key="button.name"
            class="checkout-form__btn_left"
            :class="button.class"
            :type="button.type"
            @click.prevent="btnClickHandler(button)"
            v-show="isShow(button)"
          >
            {{ button.caption }}
          </button>
        </div>

      </form>
              
    </div>
    <!-- /wholesale-checkout-process -->

  </div>
</template>

<script>

  import { required, email, sameAs, minLength } from 'vuelidate/lib/validators'
  import FormGroup from '../components/FormGroup.vue'
  import CheckoutOrder from '../components/CheckoutOrder.vue'
  import PickpointSchedule from '../components/PickpointSchedule.vue'
  import MapComponent from '../components/MapComponent.vue'

  export default {
    components: {
      FormGroup, CheckoutOrder, PickpointSchedule, MapComponent
    },

    data() {
      return {

        promocode: '',
        pickpoint: 1,
        successMessage: '',

        cartData: null,
        cartItems: [],
        cartPromocodes: [],

        orders: [],
        pickpointAddress: '',
        pickpointPhone: '',
        mapData: null,

        buttons: null,

        formData: null,
        mainForm: {},
        mainFormModel: {},
        defaultForm: {},
        smsCode: '',

        formLoading: false,
        paymentLoading: false,
        wholesaleLoading: false,

      }
    },
    validations() {
      if ( this.formData !== null ) {

        let result = {}
        let validators = {}
        this.defaultForm = {}
        this.mainFormModel = {}

        for (let key in this.formData) {

          const group = key

          validators[group] = {}

          for (let key in this.formData[group]) {

            validators[group][key] = this.formData[group][key]

            if (this.formData[group][key].options) {
              for (let optionKey in this.formData[group][key].options) {
                validators[group][optionKey] = this.formData[group][key].options[optionKey]
              }
            }

          }
          
        }

        for (let key in validators) {

          const group = key

          for (let key in validators[group]) {

            result[key] = {}

            if (validators[group][key].type === 'select') {
              const selected = validators[group][key].value.find(item => item.selected === 'selected')
              if (selected) {
                this.$set(this.defaultForm, key, selected)
              } else {
                this.$set(this.defaultForm, key, '')
              }
            } else if (validators[group][key].type === 'radio') {
              if ( !(group in this.defaultForm) ) {
                this.$set(this.defaultForm, group, key)
              }
            } else {
              this.$set(this.defaultForm, key, validators[group][key].value || '')
            }

            if (validators[group][key].required === 'required') {
              result[key].required = required
            }

            if (validators[group][key].min > 0 || validators[group][key].type === 'phone') {
              const minLengthValue = (validators[group][key].type === 'phone') ? 10 : validators[group][key].min
              result[key].minLength = minLength(minLengthValue)
            }

            if (validators[group][key].type === 'phone' && validators[group][key].is_sms_valid) {
              result[key].smsCode = () => !!this.smsCode.length
            }

            if (validators[group][key].type === 'email') {
              result[key].email = email
            }

            if (key === 'password_confirmation') {
              result[key].sameAsPassword = sameAs('password')
            }

            // if (validators[group][key].options) {
            //   for (let optionKey in validators[group][key].options) {
            //     result[key + '_group'] = [ 'mainFormModel.' + optionKey ]
            //     console.log('result', result)
            //   }
            // }

          }

        }

        this.mainFormModel = Object.assign({}, this.mainFormModel, this.defaultForm)

        return {
          mainFormModel : result
        }

      }
    },

    computed: {
      successItems() {
        return this.cartItems.filter(item => item.attributes.error === 0)
      },
      errorItems() {
        return this.cartItems.filter(item => item.attributes.error !== 0)
      },
      showPromocodeInput() {
        let result = false
        if (this.mainForm !== null) {
          result = Object.keys(this.mainForm).includes('pick_point')
        }
        return result
      },
      isWholesale() {
        return this.cartItems.length && this.formData === null
      }
    },

    methods: {
      isSwitcher(group) {
        const values = Object.values(group)
        return values.some(item => item.type === 'radio')
      },
      btnClickHandler(btn) {
        if (btn.url) {
          this.getRequest(btn.url)
        } else {
          this.formSubmit(btn)
        }
      },
      isShow(btn) {
        let result = true
        if (btn.show) {
          result = btn.show.rule === this.mainFormModel[btn.show.for]
        }
        return result
      },
      applyPromocode() {

        this.formLoading = true

        this.$axios.get('/api/checkout?add_promo_code=' + this.promocode)
          .then(response => {
            const data = response.data

            console.log('applyPromocode', data)

            this.incomingDataHandling(data)

            this.formLoading = false
          })
          .catch(error => {
            console.log(error)
            this.formLoading = false
          })

      },
      formSubmit(btn) {

        console.log('formSubmit')

        if (this.formLoading) {
          return
        }

        this.formLoading = true

        let request = {}

        if (this.formData !== null) {
        
          this.$v.mainFormModel.$touch()

          if (this.$v.mainFormModel.$invalid) {
            this.formLoading = false
            return
          }

          const values = this.mainFormModel

          for (let key in values) {
            if (key === 'phone') {
              request[key] = '+7' +  values[key]
            } else {
              request[key] = values[key]
            }
          }

          request.code = this.smsCode

          console.log('request', request)

        }

        const url = btn.action
        const type = btn.method

        this.$axios.get(url)
          .then(response => {
            const data = response.data

            console.log('formSubmit', data)

            this.incomingDataHandling(data)

            // $('html, body').animate({
            //   scrollTop: $('.checkout-page').offset().top
            // }, 400)

            this.formLoading = false
          })
          .catch(error => {
            console.log(error)
            this.formLoading = false
          })


      },
      setSmsCode(code) {
        this.smsCode = code
      },
      getRequest(url) {

        this.formLoading = true

        this.$axios.get(url)
          .then(response => {
            const data = response.data

            console.log('checkout-prev', data)

            this.incomingDataHandling(data)

            // $('html, body').animate({
            //   scrollTop: $('.checkout-process').offset().top
            // }, 400)

            this.formLoading = false
          })
          .catch(error => {
            console.log(error)
            this.formLoading = false
          })
      },
      pickAnother() {
        this.$router.push('/cart')
        // this.$root.showPopper()
        // $('html, body').animate({
        //   scrollTop: 0
        // }, 400)
      },
      getOptions(group) {

        let options = []

        for (let key in group) {
          if (group[key].options) {
            let obj = group[key]
            obj.optionName = key
            options.push(obj)
          }
        }

        return options

      },
      incomingDataHandling(data) {

        if (data.redirect_url) {
          if (data.redirect_type === 'external') {
            window.location = data.redirect_url
          } else {
            this.$router.push(data.redirect_url)
          }
        }

        this.successMessage = data.success || ''

        if (data.cart) {
          this.cartItems = Object.values(data.cart.data.relationships.cart_line.data)
          this.cartData = data.cart.data.attributes
          this.cartPromocodes = data.cart.data.relationships.promo_code.data.filter(item => item.attributes.summ > 0)
        } else {
          this.cartItems = []
          this.cartData = null
          this.cartPromocodes = []
        }

        this.formData = data.form || null
        this.mainForm = data.form || {}

        if (!this.$is_empty(data.orders)) {
          this.orders = data.orders
          this.$store.dispatch('cart/getCart')
          this.$metricGoal('order_end')
        } else {
          this.orders = []
        }

        this.buttons = data.buttons || null

        if (data.map) {

          this.pickpointAddress = data.map.data.attributes.full_address || ''
          this.pickpointPhone = data.map.data.attributes.phone || ''

          if (data.map.data.attributes.latitude && data.map.data.attributes.longitude) {

            const coordinates = [ +data.map.data.attributes.longitude, +data.map.data.attributes.latitude ]
            const zoom = +data.map.data.attributes.zoom || 15
            const tiles = data.map.data.attributes.url_tiles

            const points = data.map.relationships.points.data

            const mapData = {
              coordinates,
              zoom,
              tiles,
              points
            }

            this.mapData = mapData

          }

          // -- Yandex Constructor
          // const src = data.map.data.attributes.map_src || null

          // if (src) {
          //   this.mapInit(src)
          // }

        }
        
      }
    },

    created () {

      if (!process.browser) return

      let urlString = window.location.origin
      urlString += '/api/checkout'

      let requestUrl = new URL(urlString)

      if (this.$route.params.start) {
        requestUrl.searchParams.set('start', '')
      }
      if (this.$route.params.check_group) {
        requestUrl.searchParams.set('check_group', this.$route.params.check_group)
      }
      for (let key in this.$route.query) {
        requestUrl.searchParams.set(key, this.$route.query[key])
      }

      this.$axios.get(requestUrl)
        .then(response => {
          const data = response.data

          console.log('checkout', data)

          this.incomingDataHandling(data)
        })
        .catch(error => {
          console.log(error)
        })

    }
    
  }
</script>