<template>
  <div
    class="catalog-dropdown"
  >
    <div
      class="catalog-btn btn"
      :class="{ 'active' : isCatalogMenuActive }"
      @click="isCatalogMenuActive = !isCatalogMenuActive"
    >
      <div class="catalog-btn__burger">
        <button
          class="burger"
          :class="{
            'is-active' : isCatalogMenuActive
          }"
          type="button"
        >
          <span class="burger-box">
            <span class="burger-inner light"></span>
          </span>
        </button>
      </div>
      Каталог
    </div>
    <div v-show="isCatalogMenuActive" class="dropdown-catalog-menu">
      
      <div class="dropdown-catalog-menu__main">

        <div
          v-for="(item, index) in catalogMenuLinks"
          :key="index"
          class="dropdown-catalog-menu__group"
        >
          <a
            :href="item.attributes.real_url"
            class="dropdown-catalog-menu__main-link"
            @click.prevent="mainLinkClick(item.attributes.real_url, $event)"
          >
            <span>{{ item.attributes.anchor }}</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.293 12L6.707 13.414L13.414 6.707L6.707 0L5.293 1.414L9.586 5.707H0V7.707H9.586L5.293 12Z" fill="#222222"/>
            </svg>
            <span class="btn btn_small btn_border">все</span>
          </a>
          <ul class="dropdown-catalog-menu__list">
            <div class="dropdown-catalog-menu__list-container">

              <li class="dropdown-catalog-menu__item">
                <n-link
                  :to="item.attributes.real_url"
                  class="dropdown-catalog-menu__link btn btn_small btn_border"
                >
                  все
                </n-link>
              </li>

              <li
                v-for="(subItem, index) in item.relationships.menu_catalog.data"
                :key="index"
                class="dropdown-catalog-menu__item"
              >
                <n-link
                  :to="subItem.attributes.real_url"
                  class="dropdown-catalog-menu__link"
                >
                  {{ subItem.attributes.anchor }}
                </n-link>
              </li>

            </div>
          </ul>
        </div>
        
      </div>

      <div class="dropdown-catalog-menu__additional">

        <div
          class="dropdown-catalog-menu__additional-group"
        >
          <n-link
            v-for="(item, index) in catalogMenuBlocks"
            :key="index"
            :to="item.attributes.real_url"
            :class="{
              'dropdown-catalog-menu__banner' : item.attributes.image !== null,
              'dropdown-catalog-menu__btn btn' : item.attributes.image === null
            }"
          >
            <span>{{ item.attributes.anchor }}</span>
            <img
              v-if="item.attributes.image !== null"
              :src="item.attributes.image"
              alt=""
            >
          </n-link>
        </div>

      </div>

    </div>
    <transition name="fader">
      <div
        v-if="isCatalogMenuActive"
        class="overlay"
        @click="isCatalogMenuActive = false"
      ></div>
    </transition>
  </div>
</template>

<script>
import { computeStyles } from '@popperjs/core'
  export default {
    data() {
      return {
        isCatalogMenuActive: false,
        catalogMenu: null,
        isMobile: true
      }
    },
    computed: {
      catalogMenuLinks() {
        return this.catalogMenu.data.filter( item => item.attributes.type === 'link') 
      },
      catalogMenuBlocks() {
        return this.catalogMenu.data.filter( item => item.attributes.type === 'block') 
      },
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
        if (this.windowWidth < 960) {
          if (this.isMobile) {
            this.closeDropdownGroupAll()
            this.isMobile = false
          }
          document.querySelectorAll('.dropdown-catalog-menu__main-link.open').forEach(element => this.setDropdownGroupHeigth(element))
        } else {
          this.openDropdownGroupAll()
          this.isMobile = true
        }
      },
      mainLinkClick(url, event) {
        const target = event.currentTarget
        if ( window.innerWidth < 960 ) {
          if ( !target.classList.contains('open') ) {
            this.openDropdownGroup(target)
          } else if ( target.classList.contains('open') ) {
            this.closeDropdownGroup(target)
          }
        } else {
          this.isCatalogMenuActive = false
          this.$router.push(url)
        }
      },
      openDropdownGroup(titleDropdownGroup) {
        this.setDropdownGroupHeigth(titleDropdownGroup)
        titleDropdownGroup.classList.add("open")
      },
      setDropdownGroupHeigth(titleDropdownGroup) {
        const dropdownGroupList = titleDropdownGroup.parentNode.querySelector('.dropdown-catalog-menu__list')
        const dropdownGroupContainer = dropdownGroupList.querySelector('.dropdown-catalog-menu__list-container')
        const listHeight = dropdownGroupContainer.offsetHeight
        dropdownGroupList.style.height = listHeight + 'px'
      },
      closeDropdownGroup(titleDropdownGroup) {
        titleDropdownGroup.classList.remove('open')
        const dropdownGroupList = titleDropdownGroup.parentNode.querySelector('.dropdown-catalog-menu__list')
        dropdownGroupList.style.height = '0px'
      },
      openDropdownGroupAll() {
        document.querySelectorAll('.dropdown-catalog-menu__list').forEach(element => element.style.height = 'auto')
      },
      closeDropdownGroupAll() {
        document.querySelectorAll('.dropdown-catalog-menu__main-link').forEach(element => this.closeDropdownGroup(element))
      }
    },
    created () {
      this.catalogMenu = JSON.parse('{"links":{"self":"/api/general/public/menu_catalog?page%5Bnumber%5D=1","first":"/api/general/public/menu_catalog?page%5Bnumber%5D=1","prev":null,"next":null,"last":"/api/general/public/menu_catalog?page%5Bnumber%5D=1"},"meta":{"page":{"current_page":1,"per_page":1000,"from":1,"to":13,"total":13,"last_page":1}},"data":[{"id":1,"relationships":{"menu_catalog":{"data":[{"id":2,"attributes":{"id":2,"anchor":"Тормозные жидкости","url":"tormoznye-zhidkosti","real_url":"/category-rashodnye-zhidkosti/tormoznye-zhidkosti","type":"link","image":null}},{"id":3,"attributes":{"id":3,"anchor":"Охлаждающие жидкости","url":"ohlazhdayuschie-zhidkosti","real_url":"/category-rashodnye-zhidkosti/ohlazhdayuschie-zhidkosti","type":"link","image":null}},{"id":4,"attributes":{"id":4,"anchor":"Стеклоомывающие жидкости","url":"stekloomyvayuschie-zhidkosti","real_url":"/category-rashodnye-zhidkosti/stekloomyvayuschie-zhidkosti","type":"link","image":null}},{"id":5,"attributes":{"id":5,"anchor":"Жидости ГУР","url":"zhidosti-gur","real_url":"/category-rashodnye-zhidkosti/zhidosti-gur","type":"link","image":null}}]},"parent_menu_catalog":[]},"attributes":{"id":1,"anchor":"Расходные жидкости","title":"Купить расходные жидкости","url":"rashodnye-zhidkosti","real_url":"/category-rashodnye-zhidkosti","h1":"Расходные жидкости","description":"Купить расходные жидкости","parent":0,"filter":"attribute.50=124,125,144,2146,3216,3299,3300","type":"link","image":null}},{"id":6,"relationships":{"menu_catalog":{"data":[{"id":7,"attributes":{"id":7,"anchor":"Моторные","url":"masla-motornye","real_url":"/category-masla/masla-motornye","type":"link","image":null}},{"id":8,"attributes":{"id":8,"anchor":"Трансмиссионные","url":"masla-transmissionnye","real_url":"/category-masla/masla-transmissionnye","type":"link","image":null}},{"id":9,"attributes":{"id":9,"anchor":"Для двухтактных двигателей","url":"masla-dlya-dvuhtaktnyh-dvigateley","real_url":"/category-masla/masla-dlya-dvuhtaktnyh-dvigateley","type":"link","image":null}},{"id":10,"attributes":{"id":10,"anchor":"Индустриальные","url":"masla-industrialnye","real_url":"/category-masla/masla-industrialnye","type":"link","image":null}}]},"parent_menu_catalog":[]},"attributes":{"id":6,"anchor":"Масла","title":"Купить масла автомобильные","url":"masla","real_url":"/category-masla","h1":"Масла","description":"Купить масла автомобильные","parent":0,"filter":"attribute.49=119,120,121,122,123,857,1624,1625,1626,1882","type":"link","image":null}},{"id":11,"relationships":{"menu_catalog":{"data":[{"id":12,"attributes":{"id":12,"anchor":"Оригинальные каталоги","url":"originalnye-katalogi","real_url":"/page-originalnye-katalogi","type":"link","image":null}},{"id":13,"attributes":{"id":13,"anchor":"Aftermarket каталоги","url":"aftermarket-katalogi","real_url":"/page-aftermarket-katalogi","type":"link","image":null}},{"id":14,"attributes":{"id":14,"anchor":"Оригинальные аксессуары","url":"originalnye-aksessuary","real_url":"/page-originalnye-aksessuary","type":"link","image":null}},{"id":15,"attributes":{"id":15,"anchor":"Подбор запчастей","url":"selection-spare-parts","real_url":"/page-selection-spare-parts","type":"link","image":null}}]},"parent_menu_catalog":[]},"attributes":{"id":11,"anchor":"Запчасти","title":"Купить запчасти","url":"zapchasti","real_url":"/page-zapchasti","h1":"Запчасти","description":"Купить запчасти","parent":0,"filter":null,"type":"link","image":null}},{"id":16,"relationships":{"menu_catalog":{"data":[{"id":17,"attributes":{"id":17,"anchor":"Легковые","url":"akkumulyatory-dlya-legkovyh-mashin","real_url":"/category-akkumulyatory/akkumulyatory-dlya-legkovyh-mashin","type":"link","image":null}},{"id":18,"attributes":{"id":18,"anchor":"Грузовые","url":"akkumulyatory-dlya-gruzovyh-mashin","real_url":"/category-akkumulyatory/akkumulyatory-dlya-gruzovyh-mashin","type":"link","image":null}}]},"parent_menu_catalog":[]},"attributes":{"id":16,"anchor":"Аккумуляторы","title":"Купить аккумуляторы","url":"akkumulyatory","real_url":"/category-akkumulyatory","h1":"Аккумуляторы","description":"Купить аккумуляторы","parent":0,"filter":"attribute.66=2326,2327,2328","type":"link","image":null}},{"id":31,"relationships":{"menu_catalog":{"data":[{"id":32,"attributes":{"id":32,"anchor":"Лампы","url":"lampy-avtomobilnye","real_url":"/category-rashodnye-materialy/lampy-avtomobilnye","type":"link","image":null}},{"id":33,"attributes":{"id":33,"anchor":"Тормозные колодки","url":"tormoznye-kolodki","real_url":"/category-rashodnye-materialy/tormoznye-kolodki","type":"link","image":null}},{"id":34,"attributes":{"id":34,"anchor":"Свечи зажигания","url":"svechi-zazhiganiya","real_url":"/category-rashodnye-materialy/svechi-zazhiganiya","type":"link","image":null}}]},"parent_menu_catalog":[]},"attributes":{"id":31,"anchor":"Расходные материалы","title":"Расходные материалы","url":"rashodnye-materialy","real_url":"/category-rashodnye-materialy","h1":"Расходные материалы","description":"Расходные материалы","parent":0,"filter":"attribute.96=3207,3206,3205","type":"link","image":null}},{"id":35,"relationships":{"menu_catalog":{"data":[{"id":36,"attributes":{"id":36,"anchor":"Двухкомпонентные","url":"smazki-dvuhkomponentnye","real_url":"/category-smazki/smazki-dvuhkomponentnye","type":"link","image":null}},{"id":37,"attributes":{"id":37,"anchor":"ГОСТовские","url":"smazki-gostovskie","real_url":"/category-smazki/smazki-gostovskie","type":"link","image":null}}]},"parent_menu_catalog":[]},"attributes":{"id":35,"anchor":"Смазки","title":"Купить смазки автомобильные","url":"smazki","real_url":"/category-smazki","h1":"Смазки","description":"Купить смазки автомобильные","parent":0,"filter":"attribute.97=3211,3210,3209,2945","type":"link","image":null}},{"id":40,"relationships":{"menu_catalog":{"data":[{"id":41,"attributes":{"id":41,"anchor":"Герметик-прокладки","url":"germetik-prokladki","real_url":"/category-avtohimiya/germetik-prokladki","type":"link","image":null}},{"id":42,"attributes":{"id":42,"anchor":"Очистители карбюратора","url":"ochistiteli-karbyuratora","real_url":"/category-avtohimiya/ochistiteli-karbyuratora","type":"link","image":null}}]},"parent_menu_catalog":[]},"attributes":{"id":40,"anchor":"Автохимия","title":"Купить автохимию","url":"avtohimiya","real_url":"/category-avtohimiya","h1":"Автохимия","description":"Купить автохимию","parent":0,"filter":"attribute.80=2945,2946,2947,2948,2949,2964,2996,3008","type":"link","image":null}},{"id":44,"relationships":{"menu_catalog":{"data":[{"id":45,"attributes":{"id":45,"anchor":"Полироли кузова","url":"poliroli-kuzova","real_url":"/category-avtokosmetika/poliroli-kuzova","type":"link","image":null}},{"id":46,"attributes":{"id":46,"anchor":"Очистители кузова","url":"ochistiteli-kuzova","real_url":"/category-avtokosmetika/ochistiteli-kuzova","type":"link","image":null}},{"id":47,"attributes":{"id":47,"anchor":"Очистители салона","url":"ochistiteli-salona","real_url":"/category-avtokosmetika/ochistiteli-salona","type":"link","image":null}},{"id":48,"attributes":{"id":48,"anchor":"Очистители стекол","url":"ochistiteli-stekol","real_url":"/category-avtokosmetika/ochistiteli-stekol","type":"link","image":null}}]},"parent_menu_catalog":[]},"attributes":{"id":44,"anchor":"Автокосметика","title":"Купить автокосметику","url":"avtokosmetika","real_url":"/category-avtokosmetika","h1":"Автокосметика","description":"Купить автокосметику","parent":0,"filter":"attribute.81=2944,2943,2942,2941,2940,2939,2938,2937,2936,2935,2934","type":"link","image":null}},{"id":49,"relationships":{"menu_catalog":{"data":[{"id":50,"attributes":{"id":50,"anchor":"Коврики","url":"kovriki-avtomobilnye","real_url":"/category-aksessuary-avtomobilnye/kovriki-avtomobilnye","type":"link","image":null}},{"id":51,"attributes":{"id":51,"anchor":"Скребки и лопаты","url":"skrebki-i-lopaty","real_url":"/category-aksessuary-avtomobilnye/skrebki-i-lopaty","type":"link","image":null}},{"id":52,"attributes":{"id":52,"anchor":"Ароматизаторы","url":"aromatizatory-avtomobilnye","real_url":"/category-aksessuary-avtomobilnye/aromatizatory-avtomobilnye","type":"link","image":null}},{"id":53,"attributes":{"id":53,"anchor":"Тросы","url":"trosy-avtomobilnye","real_url":"/category-aksessuary-avtomobilnye/trosy-avtomobilnye","type":"link","image":null}}]},"parent_menu_catalog":[]},"attributes":{"id":49,"anchor":"Аксессуары","title":"Купить аксессуары автомобильные","url":"aksessuary-avtomobilnye","real_url":"/category-aksessuary-avtomobilnye","h1":"Аксессуары автомобильные","description":"Купить аксессуары автомобильные","parent":0,"filter":"attribute.87=2981,2982,2983,2984,2988","type":"link","image":null}},{"id":54,"relationships":{"menu_catalog":{"data":[{"id":55,"attributes":{"id":55,"anchor":"Батарейки","url":"batareyki","real_url":"/category-obschehozyaystvennye-tovary/batareyki","type":"link","image":null}},{"id":56,"attributes":{"id":56,"anchor":"Клеи и фиксаторы","url":"klei-i-fiksatory","real_url":"/category-obschehozyaystvennye-tovary/klei-i-fiksatory","type":"link","image":null}},{"id":57,"attributes":{"id":57,"anchor":"Перчатки","url":"perchatki","real_url":"/category-obschehozyaystvennye-tovary/perchatki","type":"link","image":null}},{"id":58,"attributes":{"id":58,"anchor":"Дистилированная вода","url":"distilirovannaya-voda","real_url":"/category-obschehozyaystvennye-tovary/distilirovannaya-voda","type":"link","image":null}}]},"parent_menu_catalog":[]},"attributes":{"id":54,"anchor":"Общехозяйственные товары","title":"Купить общехозяйственные товары","url":"obschehozyaystvennye-tovary","real_url":"/category-obschehozyaystvennye-tovary","h1":"Общехозяйственные товары","description":"Купить общехозяйственные товары","parent":0,"filter":"attribute.98=3215,3214,3213,3212","type":"link","image":null}},{"id":79,"relationships":{"menu_catalog":[],"parent_menu_catalog":[]},"attributes":{"id":79,"anchor":"Подбор запчастей","title":"Подбор запчастей","url":"selection-spare-parts","real_url":"/page-selection-spare-parts","h1":"Подбор запчастей","description":"Подбор запчастей","parent":0,"filter":null,"type":"block","image":null}},{"id":80,"relationships":{"menu_catalog":[],"parent_menu_catalog":[]},"attributes":{"id":80,"anchor":"Подбор шин и дисков","title":"Подбор шин и дисков","url":"podbor-shin-i-diskov","real_url":"/page-podbor-shin-i-diskov","h1":"Подбор шин и дисков","description":"Подбор шин и дисков","parent":0,"filter":null,"type":"block","image":"/trlm/images/b-tails.jpg"}},{"id":81,"relationships":{"menu_catalog":[],"parent_menu_catalog":[]},"attributes":{"id":81,"anchor":"Подбор АКБ","title":"Подбор АКБ","url":"podbor-akb","real_url":"/page-podbor-akb","h1":"Подбор АКБ","description":"Подбор АКБ","parent":0,"filter":null,"type":"block","image":"/trlm/images/b-akb.jpg"}}]}')
    },
    mounted () {
      this.onResize()
    }
  }
</script>