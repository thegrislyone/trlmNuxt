<template>
  <header class="header wrapper">
    <n-link to="/" class="logo logo_main">
      <img src="/images/logo.png" alt="trlm.ru">
    </n-link>
    <div class="header__container">
      <div
        class="header__topline row"
        :class="{ 'active' : isNavMenuActive }"
      >
        <div
          class="menu-btn"
          @click="isNavMenuActive = !isNavMenuActive"
        >
          <button
            class="burger"
            :class="{
              'is-active' : isNavMenuActive
            }"
            type="button"
            @blur="isNavMenuActive = false"
          >
            <span class="burger-box">
              <span class="burger-inner"></span>
            </span>
          </button>
        </div>
        <n-link to="/" class="logo logo_mini">trlm.ru</n-link>

        <div class="city-select-container"></div>
        
        <a
          :href="'tel:' + pageData.phone"
          class="header__phone header__phone_desktop"
        >
          {{ pageData.phone }}
        </a>

        <div class="profile-links row">
          <div
            class="profile-links__item profile-links__item_search"
            @click.prevent="isSearchActive = true"
          >
            <img src="/images/i-search.svg" alt="">
          </div>

          <!-- sign-in -->
          <button
            v-if="!$store.getters.isAuthorized"
            class="profile-links__item"
            type="button"
            @click="showSignInModal()"
          >
            <img src="/images/i-profile.svg" alt="">
            <span>Войти</span>
          </button>
          <n-link
            v-else
            to="/personal"
            class="profile-links__item"
          >
            <img src="/images/i-profile.svg" alt="">
            <span>Личный кабинет</span>
          </n-link>
          <modal
            name="sign-in"
            :classes="['modal','sign-in-form']"
            :adaptive="true"
            :height="'auto'"
            :scrollable="true"
            :max-width="356"
            :pivot-y="0"
            @before-close="signInModalBeforeClose"
          >
            <i
              class="modal__close close-btn"
              @click="$modal.hide('sign-in')"
            ></i>
            <transition name="fader" mode="out-in">
              <HeaderSignIn 
                :modal-message="signInMessage"
              />
            </transition>
          </modal>
          
          <!-- cart -->
          <n-link
            v-if="cartItems.length"
            to="/cart"
            class="profile-links__item profile-links__item_cart"
            tag="button"
          >
            <i>{{ cartItems.length }}</i>
            <img src="/images/i-cart-not-empty.svg" alt="">
            <span>Корзина</span>
          </n-link>
          <span
            v-else
            class="profile-links__item profile-links__item_cart"
          >
            <img src="/images/i-cart.svg" alt="">
            <span>Корзина</span>
          </span>
          <transition name="fader">
            <HeaderCart
              v-if="isCartOpen"
              @close-cart="closeCart"   
              @mouseover="cartMouseOver"
              @mouseleave="cartMouseLeave"
            />
          </transition>
        </div>

        <!-- search autocomplete -->
        <transition name="mobile-search">
          <HeaderSearch
            v-show="isSearchActive && windowWidth < 640"
            :is-active="isSearchActive"
            @open="isSearchActive = true"
            @close="isSearchActive = false"
          />
        </transition>
        
        <transition name="fader">
          <div
            v-if="isSearchActive"
            class="overlay"
            @click="isSearchActive = false"
          ></div>
        </transition>

      </div>

      <transition name="dropdown-nav-menu">
        <nav
          v-if="isNavMenuActive"
          class="dropdown-nav-menu"
        >
          <n-link
            v-for="(item, index) in menu.data"
            :key="index"
            :to="item.attributes.url"
            class="dropdown-nav-menu__link"
            :class="{ 'dropdown-nav-menu__link_main' : item.attributes.priority === 1 }"
          >
            {{ item.attributes.title }}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.293 12L6.707 13.414L13.414 6.707L6.707 0L5.293 1.414L9.586 5.707H0V7.707H9.586L5.293 12Z" fill="#222222"/>
            </svg>
          </n-link>
          <a
            :href="'tel:' + pageData.phone"
            class="dropdown-nav-menu__link dropdown-nav-menu__link_phone"
          >
            {{ pageData.phone }}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.7122 10.2933C14.3212 9.90225 13.6892 9.90225 13.2982 10.2933L11.7042 11.8872C10.9652 11.6672 9.58622 11.1672 8.71222 10.2933C7.83822 9.41925 7.33822 8.04025 7.11822 7.30125L8.71222 5.70725C9.10322 5.31625 9.10322 4.68425 8.71222 4.29325L4.71222 0.29325C4.32122 -0.09775 3.68922 -0.09775 3.29822 0.29325L0.586217 3.00525C0.206217 3.38525 -0.00778346 3.90725 0.000216545 4.44025C0.0232165 5.86425 0.400217 10.8103 4.29822 14.7083C8.19622 18.6063 13.1422 18.9823 14.5672 19.0063C14.5722 19.0063 14.5902 19.0063 14.5952 19.0063C15.1232 19.0063 15.6222 18.7983 16.0002 18.4202L18.7122 15.7083C19.1032 15.3173 19.1032 14.6853 18.7122 14.2943L14.7122 10.2933ZM14.5852 17.0052C13.3372 16.9842 9.06722 16.6493 5.71222 13.2933C2.34622 9.92725 2.02022 5.64225 2.00022 4.41925L4.00522 2.41425L6.59122 5.00025L5.29822 6.29325C5.05922 6.53125 4.95722 6.87525 5.02622 7.20525C5.05022 7.32025 5.63722 10.0472 7.29722 11.7072C8.95722 13.3672 11.6842 13.9542 11.7992 13.9782C12.1322 14.0492 12.4732 13.9462 12.7112 13.7072L14.0052 12.4142L16.5912 15.0002L14.5852 17.0052Z" fill="#222222"/>
            </svg>
          </a>
        </nav>
      </transition>
      <transition name="fader">
        <div
          v-if="isNavMenuActive"
          class="overlay overlay_nav-menu"
          @click="isNavMenuActive = false"
        ></div>
      </transition>

      <!-- header bottomline -->
      <div class="header__bottomline row">
        
        <HeaderPickpoint />

        <HeaderSearch
          v-show="windowWidth >= 640"
          :is-active="isSearchActive"
          @open="isSearchActive = true"
          @close="isSearchActive = false"
        />
        
        <!-- <a
          :href="'tel:' + pageData.phone"
          class="header__phone header__phone_mobile"
          :class="{ 'hide' : isSearchActive }"
        >{{ pageData.phone }}</a> -->
        
      </div>

      <!-- Navigation -->
      <nav class="nav-menu" id="navMenu">

        <n-link
          v-for="(item, index) in menu.data"
          :key="index"
          :to="item.attributes.url"
          class="nav-menu__link"
          :class="{ 'nav-menu__link_main' : item.attributes.priority === 1 }"
          :data-priority="item.attributes.priority"
        >
          {{ item.attributes.title }}
        </n-link>

      </nav>

      <!-- Catalog Dropdown -->
      <HeaderCatalogMenu />

    </div>

  </header>
</template>

<script>

  export default {
    data() {
      return {
        pageData: {
          phone: '88005553535'
        },
        menu: null,

        // sign-in data
        signInMessage: '',
        authorizationProcess: false,

        // Cart
        cartItems: [],
        cartData: null,
        cartLoading: false,

        // Cart widget
        isCartOpen: false,
        cartWidgeteItem: {},
        cartCloseTimer: null,

        // DOM
        isNavMenuActive: false,
        isSearchActive: false
      }
    },
    computed: {
      windowWidth() {
        return this.$store.getters['resize/windowWidth']
      }
    },
    watch: {
      windowWidth(windowWidth) {
        this.onResize()
      }
    },
    methods: {
      onResize() {

        this.$store.commit('resize/setWindowWidth', window.innerWidth)
        this.$store.commit('resize/setWindowHeight', window.innerHeight)

        if ( this.windowWidth >= 640 ) {

          if ( !document.querySelector('.header__bottomline > .catalog-dropdown') ) {
            document.querySelector('.header__bottomline').prepend( document.querySelector('.catalog-dropdown') )
          }

          if ( !document.querySelector('.city-select-container > #city-select') ) {
            document.querySelector('.city-select-container').append( document.querySelector('#city-select') )
          }

          if ( !document.querySelector('.header__bottomline > #search-autocomplete') ) {
            document.querySelector('#city-tooltip').after( document.querySelector('#search-autocomplete') )
          }

        } else {

          if ( document.querySelector('.header__bottomline > .catalog-dropdown') ) {
            document.querySelector('.header__bottomline').after( document.querySelector('.catalog-dropdown') )
          }
          
          if ( document.querySelector('.city-select-container > #city-select') ) {
            document.querySelector('.header__bottomline').prepend( document.querySelector('#city-select') )
          }

          if ( !document.querySelector('.header__topline > #search-autocomplete') ) {
            document.querySelector('.header__topline').append( document.querySelector('#search-autocomplete') )
          }
          
        }

        if ( this.windowWidth >= 1280 ) {

          if ( !document.querySelector('.header__topline > #navMenu') ) {
            document.querySelector('.header__phone_desktop').after( document.querySelector('#navMenu') )
          }

          // if ( !document.querySelector('.header > .tabs-control-container') ) {
          //   document.querySelector('.header').append( document.querySelector('.tabs-control-container') )
          // }

        } else {

          if ( document.querySelector('.header__topline > #navMenu') ) {
            document.querySelector('.header__bottomline').after( document.querySelector('#navMenu') )
          }

          // if ( document.querySelector('.header > .tabs-control-container') ) {
          //   document.querySelector('.tabs').before( document.querySelector('.tabs-control-container') )
          // }

        }

        // $('.dropdown-catalog-menu').outerWidth( $(window).width() )
      },
      showSignInModal(message = '') {
        this.signInMessage = message
        this.$modal.show('sign-in')
      },     
      signInModalBeforeClose() {
        this.signInMessage = ''
        this.authorizationProcess = false
      },

      // Cart widget
      showCartInformer(item) {

        if (this.cartCloseTimer !== null) {
          clearTimeout(this.cartCloseTimer)
        }

        this.cartWidgeteItem = item
        this.isCartOpen = true

        this.cartCloseTimer = setTimeout(this.closeCart, 4000)

      },
      closeCart() {
        this.isCartOpen = false
      },
      cartMouseOver() {
        clearTimeout(this.cartCloseTimer)
      },
      cartMouseLeave() {
        this.cartCloseTimer = setTimeout(this.closeCart, 4000)
      }
    },
    created () {
      this.menu = JSON.parse('{"links":{"self":"/api/general/public/menu_top?page%5Bnumber%5D=1","first":"/api/general/public/menu_top?page%5Bnumber%5D=1","prev":null,"next":null,"last":"/api/general/public/menu_top?page%5Bnumber%5D=1"},"meta":{"page":{"current_page":1,"per_page":100,"from":1,"to":6,"total":6,"last_page":1}},"data":[{"id":1,"attributes":{"id":1,"anchor":"Подбор запчастей","title":"Подбор запчастей","url":"/page-selection-spare-parts","enable":1,"priority":1}},{"id":2,"attributes":{"id":2,"anchor":"Доставка","title":"Доставка","url":"/page-delivery","enable":1,"priority":2}},{"id":3,"attributes":{"id":3,"anchor":"Как купить","title":"Как купить","url":"/page-how-to-buy","enable":1,"priority":3}},{"id":4,"attributes":{"id":4,"anchor":"Оплата","title":"Оплата","url":"/page-payment","enable":1,"priority":4}},{"id":5,"attributes":{"id":5,"anchor":"Акции","title":"Акции","url":"/event","enable":1,"priority":5}},{"id":6,"attributes":{"id":6,"anchor":"Контакты","title":"Контакты","url":"/contact","enable":1,"priority":6}}]}')
    },
    mounted () {
      this.onResize()
    }
  }
</script>