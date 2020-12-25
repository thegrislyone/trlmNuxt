<template>
  <div class="cart-widget">
    <i
      class="cart-widget__close close-btn"
      @click="$emit('close-cart')"
    ></i>
    <div class="cart-widget-container">
      <div class="cart-widget__caption">Добавлено в корзину</div>
      <transition name="fader" mode="out-in">
        <div class="cart-widget-offer" :key="Math.random()">
          <div class="cart-widget-offer__data">
            <div class="cart-widget-offer__name">{{ cartWidgeteItem.attributes.brand }}</div>
            <div class="cart-widget-offer__description">{{ cartWidgeteItem.attributes.product_name }}</div>
            <div class="cart-widget-offer__cost row">
              <span>{{ cartWidgeteItem.attributes.price_display | numberPrettify }} ₽</span>
              <i>x</i>
              <span>{{ cartWidgeteItem.attributes.quantity }} ед.</span>
              <i>=</i>
              <span>{{ cartWidgeteItem.attributes.price_total | numberPrettify }} ₽</span>
            </div>
            <div class="cart-widget-offer__total row">
              <span class="cart-widget__caption">Всего в корзине:</span>
              <span>{{ cartData.total | numberPrettify }} ₽</span>
            </div>
          </div>
        </div>
      </transition>
      <div class="cart-widget__btn-group row">
        <template v-if="$windowWidth < 640">
          <n-link
            to="/cart"
            tag="button"
            class="btn btn_border btn_small"
            @click.native="$emit('close-cart')"
          >
            В корзину
          </n-link>
          <button
            class="btn btn_border btn_small btn_red"
            type="button"
            @click="$emit('close-cart')"
          >
            Закрыть
          </button>
        </template>
        <n-link
          v-else
          to="/cart"
          tag="button"
          class="btn btn_border btn_small"
          @click.native="$emit('close-cart')"
        >
          Перейти в корзину
        </n-link>
      </div>
      
    </div>
    <div class="cart-widget__message">
      <p>
        Рекомендуем оформлять заказы как можно быстрее:
        даже если вы будете заказывать товары по одному -
        это никак не отразится на бесплатной доставке,
        но зато вас никто не опередит и цена не успеет
        измениться.
      </p>
      <button class="btn" @click.prevent>Больше не показывать</button>
    </div>
  </div>
</template>

<script>
  export default {
    
  }
</script>