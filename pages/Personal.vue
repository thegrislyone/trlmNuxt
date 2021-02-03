<template>
  <div 
    class=""
  >
    <div 
      v-if="!loading"
      class="personal" 
      :class="{'personal_menu-opened': menuIsOpen}" 
    >

      <div 
        class="personal__success-block" 
      >

        <personal-logout-modal
          :logoutLoading="logoutLoading"
          :outSuccess="outSuccess"
          @logOutRedirect="logOutRedirect"
        />

        <personal-nav-bar
          ref="navbar"
          class="personal__navbar"
          :menuIsOpen="menuIsOpen" 
          :menu="menu"
          :route="route"
          @logOut="logOut"
          @menuRevealing="menuRevealing"
        />

        <router-view 
          ref="content"
          class="personal__content" 
          :key="route" 
          :active="activeMenuItem" 
          @logOut="logOut"
          @loadingChange="$refs.navbar.updateSticky()"
        ></router-view>

      </div>
    </div>

    <div v-else class="personal__loading">
      <div class="preloader-btn"></div>
    </div>
   
    
  </div>
</template>

<script>
  import PersonalNavBar from '../components/PersonalNavBar.vue'
  import PersonalContent from '../components/PersonalContent.vue'

  import PersonalLogoutModal from '../components/PersonalLogoutModal.vue'

  export default {
    components: {
      PersonalNavBar,
      PersonalContent,

      PersonalLogoutModal
    },
    data() {
      return {
        activeIndex: 0,
        personalData: {},
        menuIsOpen: false,
        activeMenuItem: {},

        loading: true,

        logoutLoading: true,

        outSuccess: "",
        outErrors: [],

        errors: [],

        menu: []
      }
    },
    computed: {
      route() {
        return this.$route.path
      },
      section() {
        return this.$route.params.section
      },
      page() {
        return this.$route.params.page
      }
    },
    watch: {
      route() {
        if (!this.section) {
          this.$router.push(`/personal/${this.menu[0].path}/`)
        }
      },
      section() {
        for (let item of this.menu) {
          if (item.path == this.section) {
            this.activeMenuItem = item
            return
          }
        }
      }
    },
    created() {

        this.$axios.get('https://general.dbtrlm.ru/api/auth/user-menu'/*/api/auth/user-menu*/)
            .then(response => {
                // const data = response.data
                const data = [{"img_src":"\/trlm\/images\/i-cart_personal.svg","title":"\u0417\u0430\u043a\u0430\u0437\u044b","path":"orders","submenu":[{"id":7,"title":"\u041c\u043e\u0438 \u0437\u0430\u043a\u0430\u0437\u044b","path":"","component":"order-history","api_url":"\/api\/dbtrlm\/auth\/order-history"},{"id":35,"title":"\u0417\u0430\u043a\u0430\u0437\u044b \u043a\u043b\u0438\u0435\u043d\u0442\u043e\u0432","path":"inbox-order","component":"table","api_url":"\/api\/table\/inbox-order"},{"id":84,"title":"\u041f\u0435\u0440\u0441\u043e\u043d\u0430\u043b\u044c\u043d\u044b\u0435 \u0441\u043a\u0438\u0434\u043a\u0438","path":"personal-discount","component":"table","api_url":"\/api\/table\/personal-discount"},{"id":85,"title":"\u041c\u043e\u0438 \u043a\u043e\u0440\u0437\u0438\u043d\u044b","path":"my-cart","component":"table","api_url":"\/api\/table\/my-cart"},{"id":40,"title":"\u0412\u044b\u0445\u043e\u0434","path":"logout","component":"logout","api_url":"\/api\/auth\/logout"}]},{"img_src":"\/trlm\/images\/i-profile_personal.svg","title":"\u041f\u0440\u043e\u0444\u0438\u043b\u044c","path":"profile","submenu":[{"id":1,"title":"\u041f\u0435\u0440\u0441\u043e\u043d\u0430\u043b\u044c\u043d\u044b\u0435 \u0434\u0430\u043d\u043d\u044b\u0435","path":"","component":"form","api_url":"\/api\/form\/profile-change"},{"id":2,"title":"\u0421\u043c\u0435\u043d\u0430 \u043f\u0430\u0440\u043e\u043b\u044f","path":"change-password","component":"form","api_url":"\/api\/form\/change-password"},{"id":28,"title":"\u0412\u044b\u0445\u043e\u0434","path":"logout","component":"logout","api_url":"\/api\/auth\/logout"}]},{"img_src":"\/trlm\/images\/i-details_profile.svg","title":"\u0422\u043e\u0432\u0430\u0440\u044b","path":"items","submenu":[{"id":18,"title":"\u041e\u0441\u0442\u0430\u0442\u043a\u0438","path":"","component":"table","api_url":"\/api\/table\/product-stocks"},{"id":36,"title":"\u0410\u043d\u0430\u043b\u043e\u0433\u0438","path":"analog","component":"table","api_url":"\/api\/table\/analog"},{"id":37,"title":"\u0420\u0435\u0433\u0438\u043e\u043d\u044b","path":"region","component":"table","api_url":"\/api\/table\/regions-wc"},{"id":38,"title":"\u0413\u043e\u0440\u043e\u0434\u0430","path":"city","component":"table","api_url":"\/api\/table\/cities-wc"},{"id":77,"title":"\u0417\u043e\u043d\u044b \u0434\u043e\u0441\u0442\u0430\u0432\u043a\u0438","path":"logistic-zones","component":"table","api_url":"\/api\/table\/logistic-zones"},{"id":19,"title":"\u0421\u043a\u043b\u0430\u0434\u044b","path":"warehouses","component":"table","api_url":"\/api\/table\/product-warehouses"},{"id":54,"title":"\u0420\u0430\u0441\u043f\u0438\u0441\u0430\u043d\u0438\u0435 \u0441\u043a\u043b\u0430\u0434\u043e\u0432","path":"warehouse-schedule","component":"table","api_url":"\/api\/table\/warehouse-schedule"},{"id":86,"title":"\u0410\u0434\u0440\u0435\u0441\u0430 \u041f\u0412\u0417","path":"address-pvz","component":"table","api_url":"\/api\/table\/product-address-pvz"},{"id":50,"title":"\u0413\u0440\u0443\u043f\u043f\u044b \u043f\u0440\u043e\u0434\u0443\u043a\u0442\u043e\u0432","path":"group-stock","component":"table","api_url":"\/api\/table\/group-stock"}]},{"img_src":"\/trlm\/images\/i-vendors_personal.svg","title":"\u041f\u043e\u0441\u0442\u0430\u0432\u0449\u0438\u043a\u0438","path":"suppliers","submenu":[{"id":5,"title":"\u041f\u043e\u0441\u0442\u0430\u0432\u0449\u0438\u043a\u0438","path":"","component":"table","api_url":"\/api\/table\/o-suppliers-wc"},{"id":6,"title":"\u041d\u0430\u0446\u0435\u043d\u043a\u0438 \u043f\u043e\u0441\u0442\u0430\u0432\u0449\u0438\u043a\u043e\u0432","path":"online-margins","component":"table","api_url":"\/api\/table\/o-supplier-margins-wc"},{"id":53,"title":"\u0410\u043a\u0442\u0438\u0432\u043d\u043e\u0441\u0442\u044c \u043f\u043e\u0441\u0442\u0430\u0432\u0449\u0438\u043a\u043e\u0432","path":"o-suppliers-rule","component":"table","api_url":"\/api\/table\/o-suppliers-rule"},{"id":4,"title":"\u041c\u043e\u0438 \u043d\u0430\u0446\u0435\u043d\u043a\u0438","path":"my-margins","component":"table","api_url":"\/api\/table\/margins-wc"}]},{"img_src":"\/trlm\/images\/i-logistics_personal.svg","title":"\u041b\u043e\u0433\u0438\u0441\u0442\u0438\u043a\u0430","path":"shipping","submenu":[{"id":11,"title":"\u0417\u043e\u043d\u044b \u0434\u043e\u0441\u0442\u0430\u0432\u043a\u0438","path":"","component":"table","api_url":"\/api\/table\/logistic-zones"},{"id":34,"title":"\u0413\u0440\u0430\u0444\u0438\u043a\u0438 \u0434\u043e\u0441\u0442\u0430\u0432\u043a\u0438","path":"frequencys","component":"table","api_url":"\/api\/table\/logistic-frequencys"},{"id":12,"title":"\u041f\u0440\u0430\u0432\u0438\u043b\u0430 \u0434\u043e\u0441\u0442\u0430\u0432\u043a\u0438","path":"rules","component":"table","api_url":"\/api\/table\/logistic-rules"},{"id":87,"title":"\u041c\u0430\u0440\u0448\u0440\u0443\u0442\u044b","path":"routes","component":"table","api_url":"\/api\/table\/logistic-routes"},{"id":13,"title":"\u041d\u0430\u0446\u0435\u043d\u043a\u0438 \u0434\u043e\u0441\u0442\u0430\u0432\u043a\u0438","path":"margins","component":"table","api_url":"\/api\/table\/logistic-margins"},{"id":39,"title":"\u041c\u043e\u0438 \u043d\u0430\u0446\u0435\u043d\u043a\u0438","path":"my-margins","component":"table","api_url":"\/api\/table\/margins-wc"},{"id":51,"title":"\u0413\u0440\u0443\u043f\u043f\u044b \u0437\u043e\u043d \u0434\u043e\u0441\u0442\u0430\u0432\u043a\u0438","path":"group-zone","component":"table","api_url":"\/api\/table\/group-zone"}]},{"img_src":"\/trlm\/images\/i-car_personal.svg","title":"\u041f\u043e\u043a\u0443\u043f\u0430\u0442\u0435\u043b\u0438","path":"customers","submenu":[{"id":15,"title":"\u041f\u043e\u043a\u0443\u043f\u0430\u0442\u0435\u043b\u0438","path":"","component":"table","api_url":"\/api\/table\/customer-list"},{"id":16,"title":"\u0421\u043a\u0438\u0434\u043a\u0438","path":"discounts","component":"table","api_url":"\/api\/table\/customer-discounts"},{"id":17,"title":"\u0410\u0434\u0440\u0435\u0441\u0430","path":"addresses","component":"table","api_url":"\/api\/table\/customer-addresses"}]},{"img_src":"\/trlm\/images\/i-profile_personal.svg","title":"\u0421\u043e\u0442\u0440\u0443\u0434\u043d\u0438\u043a\u0438","path":"staff","submenu":[{"id":48,"title":"\u041c\u043e\u0438 \u0441\u043e\u0442\u0440\u0443\u0434\u043d\u0438\u043a\u0438","path":"sales","component":"table","api_url":"\/api\/table\/staff-sales"},{"id":49,"title":"\u041f\u0430\u0440\u0442\u043d\u0435\u0440\u044b","path":"partner","component":"table","api_url":"\/api\/table\/staff-partner"},{"id":52,"title":"\u0413\u0440\u0443\u043f\u043f\u044b \u0441\u043e\u0442\u0440\u0443\u0434\u043d\u0438\u043a\u043e\u0432","path":"group-user","component":"table","api_url":"\/api\/table\/group-user"}]},{"img_src":"\/trlm\/images\/i-details_profile.svg","title":"\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438","path":"settings","submenu":[{"id":41,"title":"\u0410\u043a\u043a\u0430\u0443\u043d\u0442 (2)","path":"admin-config","component":"table","api_url":"\/api\/table\/admin-config"},{"id":81,"title":"\u041f\u0435\u0440\u0441\u043e\u043d\u0430\u043b\u044c\u043d\u044b\u0435 \u0441\u043a\u0438\u0434\u043a\u0438","path":"rule-controll-price","component":"table","api_url":"\/api\/table\/rule-controll-price"}]},{"img_src":"\/trlm\/images\/i-profile_personal.svg","title":"\u0422\u0435\u0441\u0442","path":"test","submenu":[{"id":69,"title":"\u0422\u0435\u0441\u0442 \u0444\u0430\u0439\u043b\u043e\u0432","path":"test-table9","component":"table","api_url":"\/api\/table\/test-table9"},{"id":83,"title":"\u0422\u0435\u0441\u0442 repeater","path":"test-table10","component":"table","api_url":"\/api\/table\/test-table10"}]}]
                
                if (data.length) {

                    this.menu = data

                    if (!this.$route.params.section) {
                        this.$router.push(`/personal/${this.menu[0].path}/`)
                        this.activeMenuItem = this.menu[0]
                    } else {
                        for (let elem of this.menu) {
                            if (this.$route.params.section == elem.path) {
                                this.activeMenuItem = elem
                                break
                            }
                        }
                    }
                    
                    this.loading = false
                }
            })

    //   this.$eventBus.$on('change-pick-point', () => {
    //     if (!this.$empty(this.$refs.content) && this.$store.state.authorization) {
    //       this.$refs.content.changePickpoint()
    //     }
    //   })

    },
    // beforeDestroy() {
    //   this.$eventBus.$off('change-pick-point')
    // },
    methods: {
        change(data) {
            this.activeIndex = data
            this.active_menu_item = this.menu[data]
        },
        menuRevealing(data) {
            this.menuIsOpen = data
        },
        submenuChoose(menu_id, submenu_id) {
            this.menu[menu_id].submenu.active = submenu_id
        },
        logOut() {
            this.$modal.show('logout-modal')
            // this.$eventBus.$off('change-pick-point')
            $.ajax({
            url: '/api/auth/logout',
            method: 'GET',
            dataType: 'json',
            success: (data) => {
                if (!this.$empty(data.success)) {
                this.outSuccess = data.success

                this.$store.commit('setAuthorization', false)
                this.$root.logOut(data.pick_point_id)

                } else if (!this.$empty(data.error)) {
                this.outErrors = data.errors
                }
                this.logoutLoading = false
            }
            })
        },
        logOutRedirect() {

            this.$modal.hide('errors-success-modal')

            if (!this.logoutLoading) {
                this.$router.push("/")
            }
        }
    },
  }
</script>

<style>
</style>