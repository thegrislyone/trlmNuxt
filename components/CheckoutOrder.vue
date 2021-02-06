<template>
  <div class="checkout-order">

    <h3>{{ order.attributes.number }}</h3>

    <div
      v-if="order.attributes.payment_status"
      class="checkout-order__payment-status"
      :class="{ 'checkout-order__payment-status_not-paid' : order.attributes.payment_status == 0 }"
    >
      {{ order.attributes.payment_status_text }}
    </div>

    <div class="checkout-order__items">

      <sticky-loader v-if="orderLoading" />

      <div
        v-for="item in order.relationships.order_line.data"
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
          <div
            v-if="item.attributes.error == 0"
            class="checkout-cart-item__term"
          >
            Ожидается: <span>{{ item.attributes.day_delivery_text }}, {{ item.attributes.day_delivery }}</span>
          </div>
        </div>
        
        <div class="checkout-cart-item__pricing row">
          <div class="checkout-cart-item__cost">{{ item.attributes.price | numberPrettify }} ₽</div>
          <div class="checkout-cart-item__quantity">{{ item.attributes.quantity }} шт</div>
          <div class="checkout-cart-item__total">{{ item.attributes.price * item.attributes.quantity | round | numberPrettify }} ₽</div>
        </div>

        <div
          class="checkout-cart-item__status"
          :class="{
            'checkout-cart-item__status_ok' : item.attributes.error == 0 && item.attributes.line_status != 0,
            'checkout-cart-item__status_error' : item.attributes.error != 0,
          }"
        >

          <template
            v-if="item.attributes.error != 0"
          >
            {{ item.attributes.error_text }}
          </template>
          <template
            v-else-if="item.attributes.line_status_text"
          >
            {{ item.attributes.line_status_text }}
          </template>
          
        </div>
      </div>

      <div class="checkout-cart-pricing">
        <div class="checkout-cart-pricing__item row">
          <span class="checkout-cart-pricing__key">Сумма</span>
          <span class="checkout-cart-pricing__value">{{ order.attributes.summ | numberPrettify }} ₽</span>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
  export default {
    props: {
      orderData: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        order: this.orderData,
        orderLoading: false
      }
    },
    methods: {
      checkOrder() {

        this.orderLoading = true

        const $request = this.$axios.get('/api/confirm-order/' + this.order.id)
          .then(response => {
            const data = response.data

            console.log('checkOrder', data)

            if (data.data.attributes.order_status == 0) {
              this.checkOrder()
            }

            this.order = data.data

            if (data.data.attributes.order_status == 1) {
              this.orderLoading = false
            }
          })
          .catch(error => {
            console.log(error)
            this.orderLoading = false
          })

        // this.$_ajaxAbort_pushRequest($request)

      }
    },
    created () {
      this.checkOrder();
    },
  }
</script>