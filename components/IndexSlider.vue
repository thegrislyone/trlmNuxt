<template>
  <div class="swiper-container fullwidth-slider">
    <div class="fullwidth-slider__arrows">
      <div class="fullwidth-slider__arrow fullwidth-slider__arrow_prev">
        <svg width="26" height="19" viewBox="0 0 26 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.25 9H22.6196L15.8535 1.9378L17.1413 0.75L25.75 9.75L17.1413 18.75L15.9674 17.5761L22.6196 10.5H0.25V9Z" fill="white"/>
        </svg>
      </div>
      <div class="fullwidth-slider__arrow fullwidth-slider__arrow_next">
        <svg width="26" height="19" viewBox="0 0 26 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.25 9H22.6196L15.8535 1.9378L17.1413 0.75L25.75 9.75L17.1413 18.75L15.9674 17.5761L22.6196 10.5H0.25V9Z" fill="white"/>
        </svg>
      </div>
    </div>
    <div class="swiper-wrapper fullwidth-slider__wrapper">
      <div
        v-for="slide in sliderData"
        :key="slide.id"
        class="fullwidth-slide swiper-slide"
      >
        <img
          :src="slide.attributes.background"
          alt=""
          class="fullwidth-slide__bg"
        >
        <div class="fullwidth-slide__content">
          <router-link
            :to="slide.attributes.url"
            class="fullwidth-slide__description"
          >
            <div class="fullwidth-slide__brand">
              <img :src="slide.attributes.logo" alt="">
            </div>
            <div class="fullwidth-slide__title">
              {{ slide.attributes.left_text }}
            </div>
            <div class="fullwidth-slide__link-wrapper">
              <span class="fullwidth-slide__link">{{ slide.attributes.anchor }}</span>
            </div>
          </router-link>
          <div class="fullwidth-slide__foreground-img-wrapper">
            <img
              :src="slide.attributes.image"
              alt=""
              class="fullwidth-slide__foreground-img"
            >
          </div>
          <div class="fullwidth-slide__tagline">
            {{ slide.attributes.right_text }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import Swiper from 'swiper'

  export default {
    props: {
      sliderData: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        slider: null,
      }
    },
    mounted () {

      // Swiper slider
      if (document.querySelectorAll('.fullwidth-slider').length) {
        this.slider = new Swiper('.fullwidth-slider', {
          speed: 400,
          simulateTouch: false,
          slidesPerView: 1,
          navigation: {
            prevEl: '.fullwidth-slider__arrow_prev',
            nextEl: '.fullwidth-slider__arrow_next',
            disabledClass: 'fullwidth-slider__arrow_disabled'
          }
        })
      }

    },
    beforeDestroy () {

      if ( this.slider !== null ) {
        this.slider.destroy()
      }

    }
  }
</script>