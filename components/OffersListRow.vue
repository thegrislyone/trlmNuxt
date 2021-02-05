<template>
  <div class="offer-table__row">
    <div v-if="windowWidth >= 640" class="offer-table__col">
      <span class="offer-table__value">{{ item.attribute.quantity }} шт</span>
    </div>
    <div class="offer-table__col">
      <span
        v-if="item.attribute.is_min_day === 1"
        class="offer-table__value offer-table__value_special"
        v-tooltip="'Cамая быстрая доставка'"
      >
        {{ item.attribute.delivery_text }}
      </span>
      <span
        v-else
        class="offer-table__value"
      >
        {{ item.attribute.delivery_text }}
      </span>
    </div>
    <div class="offer-table__col">
      <template v-if="windowWidth >= 1400">
        <span
          v-if="item.attribute.official_distributor"
          class="offer-table__caption offer-table__caption_official"
        >
          оф. дилер
        </span>
        <span class="offer-table__value" v-tooltip="'Cклад: ' + item.attribute.warehouse_name">
          {{ item.attribute.supplier_name }}
        </span>
      </template>
      <template v-else>
        <button
          class="supplier-btn"
          :id="`supplierBtn-${item.id}`"
          :class="{ 'supplier-btn_official' : item.attribute.official_distributor }"
          type="button"
          ref="supplierBtn"
          @click="showPopper"
        >
          <img 
            v-if="item.attribute.official_distributor"
            src="/trlm/images/i-house_offers_green.svg"
          >
          <img 
            v-else
            src="/trlm/images/i-house_offers_black.svg"
          >
        </button>
        <div
          class="supplier-popover"
          :id="`supplierPopover-${item.id}`"
          ref="supplierPopover"
          v-click-outside="clickOutsidePopover"
        >
          <i
            class="supplier-popover__close close-btn"
            @click="hidePopper"
          ></i>
          <div class="supplier-popover__content row">
            <div class="supplier-popover__column">
              <span
                v-if="item.attribute.official_distributor"
                class="offer-table__caption offer-table__caption_official"
              >
                оф. дилер
              </span>
              <span v-else class="offer-table__caption">
                диллер
              </span>
              <span class="offer-table__value supplier-popover__value">
                {{ item.attribute.supplier_name }}
              </span>
            </div>
            <div class="supplier-popover__column">
              <span class="offer-table__caption">склад</span>
              <span class="offer-table__value supplier-popover__value">{{ item.attribute.warehouse_name }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="offer-table__col">
      <span
        v-if="item.attribute.is_min_price === 1"
        class="
          offer-table__value
          offer-table__value_cost
          offer-table__value_special
        "
        v-tooltip="'Cамая низкая цена'"
      >
        {{ item.attribute.price_display | round(0, 'slice') | numberPrettify }} ₽
      </span>
      <span
        v-else
        class="
          offer-table__value 
          offer-table__value_cost
        "
      >
        {{ item.attribute.price_display | round(0, 'slice') | numberPrettify }} ₽
      </span>
    </div>
    <div v-if="isAddingActive && windowWidth < 640" class="offer-table__col">
      <button
        class="offer__btn btn btn_border btn_small btn_red"
        type="button"
        @click="isAddingActive = false"
      >
        <img src="/trlm/images/i-close_offers.svg">
      </button>
    </div>
    <div
      class="offer-table__col offer-table__col_btn-group"
      :class="{ 'active' : isAddingActive && windowWidth < 640 }"
    >
      <div class="offer-table__btn-group">
        <quantity-input
          class="offer__quantity"
          v-model="quantity"
          :min="Number(item.attribute.multiplicity)"
          :max="(Number(item.attribute.quantity) === 1000) ? Infinity : Number(item.attribute.quantity)"
          :step="Number(item.attribute.multiplicity)"
        ></quantity-input>
        <button
          class="offer__btn btn btn_border btn_small"
          type="button"
          @click="addToCart"
        >
          <i><!-- icon --></i>
          <span>В корзину</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import QuantityInput from './QuantityInput.vue'

  export default {
    components: {
      QuantityInput
    },
    props: {
      item: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        quantity: Number(this.item.attribute.multiplicity),
        popperInstance: null,
        isAddingActive: false
      }
    },
    computed: {
      windowWidth() {
        return this.$store.getters['resize/windowWidth']
      }
    },
    methods: { 
      createPopper() {
        const button = this.$refs.supplierBtn
        const tooltip = this.$refs.supplierPopover

        this.popperInstance = this.$createPopper(button, tooltip, {
          modifiers: [
            {
              name: 'offset',
              options: {
                // offset: () => [0, -20]
              }
            }
          ]
        })
      },
      destroyPopper() {
        if (this.popperInstance) {
          this.popperInstance.destroy()
          this.popperInstance = null
        }
      },
      showPopper() {
        this.$refs.supplierPopover.setAttribute('data-show', '');
        this.createPopper()
      },
      hidePopper() {
        this.$refs.supplierPopover.removeAttribute('data-show');
        this.destroyPopper()
      },
      clickOutsidePopover(event) {
        if (event.target.id !== `supplierBtn-${this.item.id}`) {
          if (event.target.parentElement.id !== `supplierBtn-${this.item.id}` ) {
            if (event.target.parentElement.parentElement.id !== `supplierBtn-${this.item.id}` ) {
              this.hidePopper()
            }
          }
        }
      },

      addToCart() {
        if (this.isAddingActive || this.windowWidth >= 640) {

          const request = {
            "cart_id": 0,
            "product_id": this.item.attribute.product_id,
            "warehouse_id": this.item.attribute.warehouse_id,
            "price": this.item.attribute.price,
            "quantity": this.quantity,
            "max_count": this.item.attribute.quantity,
            "article": this.item.attribute.article,
            "brand": this.item.attribute.brand,
            "day_delivery": this.item.attribute.delivery,
            "online_supplier_id": this.item.attribute.my_supplier_id,
            "pick_point_id": this.item.attribute.pick_point_id,
            "product_name": this.item.attribute.product_name,
            "multiplicity": this.item.attribute.multiplicity,
            "is_min_price": this.item.attribute.is_min_price,
            "is_min_day": this.item.attribute.is_min_day,
            "warehouse_name": this.item.attribute.warehouse_name,
            "supplier_name": this.item.attribute.supplier_name,
            "official_distributor": this.item.attribute.official_distributor
          }

          this.$axios.post('/api/dbtrlm/auth/cart_line', request)
            .then(response => {
              const data = response.data

              console.log('cartItem', data)

              const cartItem = data.data

              this.$store.dispatch('cart/getCart', {
                vm: this,
                item: cartItem
              })
            })
            .catch(error => {
              console.log(error)
            })

          // this.$metricGoal('add_cart')

        } else {
          this.isAddingActive = true
        }
      }
    }
  }
</script>

<style>

</style>