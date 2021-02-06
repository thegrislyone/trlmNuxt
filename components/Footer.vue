<template>
  <div>
    <footer class="footer">
      <div class="footer-menu">

        <!-- <?php $menuItems = App\Site::getGeneralPublicMenuBottom(); ?>
        @foreach ($menuItems['data'] as $menuItem) -->
          <a
            href=""
            class="footer-menu__link"
            data-priority=""
          >
            <!-- {{ $menuItem['attributes']['title'] }} -->
          </a>
        <!-- @endforeach -->
      </div>

      <div class="social-content row">

        <!-- <?php $socials = App\Site::getSocial(); ?>

        @foreach ($socials as $social) -->
          <a href="" class="social" target="_blank">
            <!-- @switch($social['type'])
              @case('vk') -->
                <img src="/trlm/images/vk.svg" alt="">
                <!-- @break -->

              <!-- @case('whatsapp') -->
                <img src="/trlm/images/wa.svg" alt="">
                <!-- @break -->

              <!-- @case('instagram') -->
                <img src="/trlm/images/inst.svg" alt="">
                <!-- @break -->

            <!-- @endswitch -->
          </a>
        <!-- @endforeach -->

      </div>
      <div class="creator">
        <a href="https://isidea.ru/" target="_blank" class="creator__link">
          Дизайн — «<u>Есть Идея!</u>»
        </a>
      </div>
    </footer>

    <transition name="fader" style="display: none;">
        <div v-if="showCookieAgreement" class="cookie-notice">
          <div class="cookie-notice__message">Этот сайт использует cookie для хранения данных. Продолжая использовать сайт, Вы даёте согласие на использование данной технологии.</div>
          <div class="cookie-notice__message cookie-notice__message_fixed">
            Этот сайт использует cookie для хранения данных. Продолжая использовать сайт, Вы даёте согласие на использование данной технологии.
            <button
              class="cookie-notice__close-btn"
              type="button"
              @click="closeCookieAgreement"
            ></button>
          </div>
        </div>
      </transition>
  </div>
</template>

<script>
import Cookies from 'js-cookie'

export default {
  data() {
    return {
      showCookieAgreement: false
    }
  },
  mounted() {
    if ( !Cookies.get('cookie_agreement') ) {
      this.showCookieAgreement = true
    }
  },
  methods: {
    closeCookieAgreement() {
      this.showCookieAgreement = false
      Cookies.set('cookie_agreement', '1', { expires: 365 })
    },
  },
}
</script>