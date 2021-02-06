<template>
  <div 
    class="navbar" 
    :class="{'navbar_opened': menuIsOpen}"
  >
    <div class="navbar__sticky">
    <div class="navbar__margin-block"></div>
      <div class="navbar__item navbar__item_arrow" @click="menuRevealing">
        <div class="navbar__short">
          <div 
            class="navbar__icon navbar__icon_arrow_closed" 
            :class="{'navbar__icon_arrow_opened': menuIsOpen}"
          >
              <img src="/trlm/images/i-menu-arrow_personal.svg" alt="" class="">
          </div>
          <div 
            class="navbar__item-sign"
            :class="{
              'navbar__item-sign_mobile': windowWidth < 640
            }"
          >
              <span>Свернуть меню</span>
            </div>
        </div>
      </div>
      <div 
        v-for="(item, index) in menu" 
        :key="index"
        class="navbar__item"
        :class="{
          'navbar__item_active': (windowWidth > 640 && (activeMenu == item.path)) || (windowWidth < 640 && index == active),
          'navbar__item_menu-opened': (windowWidth > 640 && (activeMenu == item.path && menuIsOpen)) || (windowWidth < 640 && index == active) && menuIsOpen
        }"
      >
        <nuxt-link
          v-if="windowWidth > 640"
          :to="'/personal/' + item.path + '/'"
          class="navbar__link"
        >
          <div class="navbar__short">
            <div class="navbar__icon">
              <img :src="item.icon || item.img_src" alt="" class="">
            </div>
            <div 
              class="navbar__item-sign"
              :class="{
                'navbar__item-sign_mobile': windowWidth < 640
              }"
            >
              <span>{{ item.title }}</span>
            </div>
          </div>              
        </nuxt-link>

        <div
          v-else
          class="navbar__link"
          @click="mobileSectionChoose(item, index)"
        >
          <div class="navbar__short">
            <div class="navbar__icon">
              <img :src="item.icon || item.img_src" alt="" class="">
            </div>
            <div 
              class="navbar__item-sign"
              :class="{
                'navbar__item-sign_mobile': windowWidth < 640
              }"
            >
              <span>{{ item.title }}</span>
            </div>
          </div> 
        </div>
        
        <div class="nav-submenu">
          <div class="nav-submenu__item"
            v-for="(value,index) in item.submenu" 
            :key="index"
            :class="{'nav-submenu__item_active': index == brightSubmenuIndex}"
          >
            <div 
              v-if="value.path == 'logout'"
              class="nav-submenu__item"
              @click="logOut"
            >
              <span>Выход</span>
            </div>

            <span
              v-else
              @click="menuRevealing"
            >
              <nuxt-link
                :to="'/personal/' + item.path + '/' + value.path"
                class="nav-submenu__link"
              >{{ value.title }}</nuxt-link>
            </span>
              
          </div>   

        </div>
            
      </div>
      <div class="navbar__margin-block"></div>
    </div>
    
  </div>
</template>

<script>

  import { debounce } from 'vue-debounce'
   
  export default {
    components: {
    },
    props: {
      menu: Array,
      menuIsOpen: Boolean
    },
    data() {
        return {
            active: 0,
            activeSubmenuIndex: 0,
            navbarSticky: {},
            debounceWidthUpdate: null
        }
    },
    computed: {
        stickySidebarClass() {

        },
        windowWidth() {
            return this.$store.getters['resize/windowWidth']
        },
        activeMenu() {
            return this.$route.path.split("/")[2]
        },
        activeSubmenu() {
            return this.$route.path.split("/")[3]
        },
        brightSubmenuIndex() {
            
            if (this.windowWidth > 640) {
                this.gettingActives()
            }

            if (this.menu[this.active].path != this.activeMenu) {
                return null
            }

            let ElemIndex = 0

            this.menu[this.active].submenu.forEach((index, elem) => {
                if (this.activeSubmenu && this.activeSubmenu == elem.path) {
                    ElemIndex = index
                    return false
                } else if (!this.activeSubmenu && !elem.path) {
                    ElemIndex = index
                    return false
                }
            })
            
            return ElemIndex    
        },
    },
    watch: {
        windowWidth() {
            if (this.windowWidth >= 640 && this.menuIsOpen) {
                this.menuRevealing()
                this.$emit('menuRevealing', false)
            }
        }
    },
    created() {

        this.gettingActives()

        for (let item of this.menu[this.activeSubmenuIndex].submenu) {
            if (this.$is_empty(item.path)) {
                item.path = ""
            }
        }

        this.debounceWidthUpdate = debounce(this.stickyResize, 800)

    },
    mounted() {

        this.navbarSticky = new StickySidebar('.navbar', {
            containerSelector: '.personal__success-block',
            innerWrapperSelector: '.navbar__sticky',
            topSpacing: 0,
            bottomSpacing: 0,
            resizeSensor: true,
        })

        window.addEventListener('resize', this.debounceWidthUpdate)

    },
    beforeDestroy() {
        this.navbarSticky.destroy()
        this.navbarSticky = {}
        window.removeEventListener('resize', this.debounceWidthUpdate)
    },
    methods: {
        updateSticky() {
            if (!this.$is_empty(this.navbarSticky)) {
                this.navbarSticky.updateSticky()
            }
        },
        mobileSectionChoose(item, index) {
            let active = this.active
            this.active = index
            if (this.menuIsOpen && this.menu[active] == item && this.activeMenu != item.path) {
            for (let value of item.submenu) {
                if (value.path === '') {
                this.$router.push('/personal/' + item.path + '/' + value.path)
                this.menuRevealing()
                return
                }
            }
            this.$router.push('/personal/' + item.path + '/' + item.submenu[0].path)
            this.menuRevealing()
            }
            if (
                this.windowWidth < 640 &&
                item.submenu.length > 1 &&
                (!this.menuIsOpen || this.menu[active] == item)
            ) {
                this.menuRevealing()
            }
        },
        stickyResize() {
            this.navbarSticky.updateSticky()
        },
        gettingActives() {
            this.menu.forEach((index, elem) => {
                if(elem.path == this.activeMenu) {
                    this.active = index
                    elem.submenu.items.forEach((i, el) => {
                        if (el.path == this.activeSubmenu) {
                            this.activeSubmenuIndex = i
                        }
                    })
                }
            })

        },
        menuRevealing() {

            if (this.menuIsOpen && this.windowWidth < 640) {
                this.gettingActives()
            }
            this.$emit('menuRevealing', !this.menuIsOpen)

            setTimeout(() => {
                this.navbarSticky.updateSticky()
            }, 800)
            
        },
        logOut() {
            this.$emit("logOut")
        }
    }
  }
</script>