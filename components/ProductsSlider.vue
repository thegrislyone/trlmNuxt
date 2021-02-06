<template>
  <div class="slider">
    <h3 class="slider__title">{{ title }}</h3>
    <div class="slider-container swiper-container" ref="slider">
      <div class="slider__arrows">
        <div class="slider__arrow slider__arrow_prev btn btn_border btn_small btn_black">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.293 12L6.707 13.414L13.414 6.707L6.707 0L5.293 1.414L9.586 5.707H0V7.707H9.586L5.293 12Z"/>
          </svg>
        </div>
        <div class="slider__arrow slider__arrow_next btn btn_border btn_small btn_black">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.293 12L6.707 13.414L13.414 6.707L6.707 0L5.293 1.414L9.586 5.707H0V7.707H9.586L5.293 12Z"/>
          </svg>
        </div>
      </div>
      <div class="slider-wrapper swiper-wrapper">

        <div
          v-for="item in data"
          :key="item.id"
          class="slider__slide swiper-slide"
        >
          <catalog-block-item
            :itemData="item"
          ></catalog-block-item>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  
  import CatalogBlockItem from './CatalogBlockItem.vue'
  import Swiper from 'swiper'

  export default {
    components: {
      CatalogBlockItem
    },
    props: {
      title: {
        type: String
      },
      data: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        slider: null
      }
    },
    mounted () {
      
      const breakpoints = {
        640: {
          slidesPerView: 2
        },
        960: {
          slidesPerView: 3
        }
      }

      this.slider = new Swiper(this.$refs.slider, {
        speed: 400,
        slidesPerView: 1,
        spaceBetween: 20,
        grabCursor: true,
        breakpoints: breakpoints,
        navigation: {
          prevEl: '.slider__arrow_prev',
          nextEl: '.slider__arrow_next',
          disabledClass: 'slider__arrow_disabled'
        }
      })
      
    },
    beforeDestroy () {
      if ( this.slider !== null ) {
        this.slider.destroy()
      }
    },
  }
</script>