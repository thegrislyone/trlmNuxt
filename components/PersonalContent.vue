<template>
		<div class="personal-content">

			<!-- /  !! SIDEBAR !! \ -->

			<div class="personal-content__sidebar">
				<div class="sidebar__sidebar-content">
						<div class="sidebar__margin-block"></div>
						<div
							v-for="(item,index) in active.submenu" 
							:key="index"
							class="sidebar__list_item_text"
							:class="{'sidebar__item_active': index == brightSubmenuIndex}"
						>
							<span 
								v-if="item.path == 'logout'" 
								@click="logOut"
							>{{ item.title }}</span>
							<router-link v-else :to="'/personal/' + active.path + '/' + item.path ">{{ item.title }}</router-link>
						</div>
						<div class="sidebar__margin-block"></div>
				</div> 
			</div>

				<!-- /  !! MAIN !! \ -->
	
			<div
				v-if="activeSubmenuObject"
				class="personal-content__main"
			>
				<h2 class="main__main_headline">{{ activeSubmenuObject.title }}</h2>

				<!-- !! LOADING !! -->

				<div v-if="loading" class="preloader">
					<div class="preloader-btn"></div>
				</div>
				
					<!-- !! CONTENT !! -->
				
				<div 
					v-else
					class="main__main-content"
				> 

					<!-- PROFILE -->

					<errors-success-modal
						v-if="messageShow"
						:success="success"
						:errors="errors"
						@close="messageClose"
					/>

					<div
						v-if="!$is_empty(getData.alerts) && alertsShow && activeSubmenuObject.component != 'table'"
						class="personal__alerts"
					>
						<div
							v-for="(alert, index) in getData.alerts"
							:key="index"
							class="un-form__alert"
						>
							<div 
								class="un-form__message message"
								:class="'un-form__message_i-' + alert.type"	
							>
								<span v-html="alert.html"></span>
							</div>
						</div>
					</div>
					

					<div 
						v-if="activeMenu == 'profile' && !activeSubmenu"
						class="main__profile"
					>
						<div v-if="profileLoading" class="preloader">
							<div class="preloader-btn"></div>
						</div>
						<form v-else class="main__profile-form form">
							<div 
								v-for="(item, index) in getData.form.main"
								:key="index"
								class="main__profile-form_item form-group"
							>
								<universal-form-email
									v-if="item.type == 'email'"
									:description='item.description'
									:outerError="Boolean(item.error)"
									:errorText="item.error_text"
									:label="item.label"
									:max="item.max"
									:min="item.min"
									:required="item.required"
									:value="item.value"

									v-model="postObject[index]"
								/>

								<universal-form-phone
									v-else-if="item.type == 'phone'"
									:name="item.name"
									:outerError="Boolean(item.error)"
									:errorText="item.error_text"
									:required="(item.required) ? true : false"
									:label="item.label"
									:value="item.value"
									:placeholder="item.placeholder"
									:description="item.description"

									v-model="postObject[index]"
								/>

								<personal-text
									v-else-if="item.type == 'text'"

									:componentKey="index"
									:label="item.label"
									:name="index"
									:placeholder="item.placeholder"
									:required="Boolean(item.required)"
									:outerError="item.error"
									:outerErrorText="item.error_text"
									:outerValue="item.value"
									:description="item.description"

									:min="item.min"
									:max="item.max"

									@textFieldChange="textFieldChange"
								/>
								
							</div>
								<button 
									type="button" 
									class="main__form-save_btn btn"
									@click="formSave"
								>Сохранить
								</button>
						</form>
					</div> 

							<!-- PASSWORD -- CHANGE -->

					<div class="main__password-change" v-if="activeSubmenu == 'change-password'">
						<div v-if="profileLoading" class="preloader">
							<div class="preloader-btn"></div>
						</div>
						<form v-else class="main__password-form">
							<div 
								v-for="(password, index) in mainData"
								:key="index"
								class="main__password-block"
								:class="'main__' + index"
							>
								<password-field

									:name="password.name"
									:outerError="(password.error) ? true : false"
									:outerErrorText="password.error_text"
									:required="password.required"
									:label="password.label"
									:outerValue="password.value"
									:placeholder="password.placeholder"
									:description="password.description"

									:passwordChange="true"

									:maxLength="password.max_length || password.max"
									:minLength="password.min_length || password.min"

									:componentKey="index"


									:index="index"
									@input="passwordInput"
									class=""
								/>
								{{ password.error }}
								{{ password.error_text }}
							</div>

							<button 
								type="button" 
								class="main__password-save btn"
								@click="formSave"
							>
							Сохранить
							</button>

						</form>
					</div>
							
							<!-- MY -- ADDRESSES -->

					<CRUDComponent
						v-if="activeSubmenuObject.component == 'table'"
						:data="getData"
						:url="url"
						@loadingChange="loadingChange"
					/>

						<!-- ORDERS -- HISTORY -->
					
					<PersonalOrdersList
						v-if="activeSubmenuObject.component == 'order-history'"
						:data="getData"
						:url="url"
					/>

				</div>

			</div> 
		</div>
</template>

<script>
import CRUDComponent from './CRUDComponent.vue'
import PersonalOrdersList from './PersonalOrdersList.vue'
import PasswordField from './PasswordField.vue'
import ErrorsSuccessModal from './ErrorsSuccessModal.vue'

import UniversalFormEmail from './UniversalFormEmail.vue'
import UniversalFormPhone from './UniversalFormPhone.vue'
import PersonalText from './PersonalText.vue'


	export default {
		components: {
			CRUDComponent,
			PersonalOrdersList,
			PasswordField,
			ErrorsSuccessModal,

			UniversalFormEmail,
			UniversalFormPhone,
			PersonalText
		},
		props: {
			active: Object,
		},
		data() {
			return {
				sidebarSticky: {},

				loading: true,
				profileLoading: false,

				getData: {},
				url: '',
				postObject: {},

				messageShow: false,
				success: "",
				errors: [],

				alertsShow: true
			}
		},
		validations() {
			
		},
		computed: {
			windowWidth() {
				return this.$store.getters['resize/windowWidth']
			},
			mainData() {
				return this.getData.form.main
			},
			lastPage() {
				const page = this.getData.page
				return page["last_page"]
			},
			currentPage() {
				const page = this.getData.page
				return page["current_page"]
			},
			activeMenu() {
				return this.$route.path.split("/")[2]
			},
			activeSubmenu() {
				return this.$route.path.split("/")[3]
			},
			brightSubmenuIndex() {
                let ElemIndex = 0
                this.active.submenu.forEach((elem, index) => {
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
			activeSubmenuObject() {
				let activeSubmenuObject,
                        fit = false
                        
                this.active.submenu.forEach((elem, index) => {
                    if (this.activeSubmenu == elem.path) {
                        activeSubmenuObject = elem
                        fit = true
                        return false
					}
                })

				if (!fit) activeSubmenuObject = this.active.submenu[0]

				return activeSubmenuObject
			},
		},
		watch: {
		},
		created() {
			this.init()
		},
		mounted() {

			if (this.windowWidth >= 960) {
				this.sidebarSticky = new StickySidebar('.personal-content__sidebar', {
					containerSelector: '.personal-content',
					innerWrapperSelector: '.sidebar__sidebar-content',
					topSpacing: 0,
					bottomSpacing: 0,
					resizeSensor: true,
				})
			}

			window.addEventListener('resize', this.stickyResize)

		},
		beforeDestroy() {
			window.removeEventListener('resize', this.stickyResize, false)
			if (!this.$is_empty(this.sidebarSticky)) {
				this.sidebarSticky.destroy()
				this.sidebarSticky = {}
			}
		},
		methods: {
			stickyResize() {
				if (this.windowWidth >= 960) {
					if (this.$is_empty(this.sidebarSticky)) {
						this.sidebarSticky = new StickySidebar('.personal-content__sidebar', {
							containerSelector: '.personal-content',
							innerWrapperSelector: '.sidebar__sidebar-content',
							topSpacing: 0,
							bottomSpacing: 0,
							resizeSensor: true,
						})
					}
				} else if (!this.$is_empty(this.sidebarSticky)) {
					this.sidebarSticky.destroy()
					this.sidebarSticky = {}
				}
			},
			init() {
				this.loadingChange()
				if (!this.activeSubmenu) {
					let fit = true
					for (let item of this.active.submenu) {
						if (this.$is_empty(item.path)) {
							fit = false
						}
					}
					if (fit) {
						this.$router.push(this.active.submenu[0].path)
					}
				}

				for (let item of this.active.submenu) {
					if (this.$is_empty(item.path)) {
						item.path = ""
					}
				}
				
				this.url = this.active.submenu[this.brightSubmenuIndex].api_url

				// this.getData = {"search":false,"page":{"current_page":1,"last_page":1,"per_page":20,"from":1,"to":1},"thead":[{"key":"name","caption":"\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435","sort":false},{"key":"spread","caption":"\u0420\u0430\u0437\u043d\u0438\u0446\u0430 \u043c\u0430\u043a\u0441\u0438\u043c\u0443\u043c %","sort":false},{"key":"discount","caption":"+ \u0441\u043a\u0438\u0434\u043a\u0430 %","sort":false}],"filter":[],"row":[{"id":1,"name":"\u041c\u043e\u0435 Felix \u043f\u0440\u0430\u0432\u0438\u043b\u043e","spread":"19.9","discount":"0.1"}],"buttons":{"top":[{"url":null,"method":"GET","action":"\/api\/form-v2\/rule-controll-price\/create","caption":"\u0421\u043e\u0437\u0434\u0430\u0442\u044c","icon":""}],"last_column":[{"url":null,"method":"GET","action":"\/api\/form-v2\/rule-controll-price\/{id}\/edit","caption":"\u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c","icon":"\/trlm\/images\/i-pen-tool.svg"},{"url":null,"method":"DELETE","action":"\/api\/form-v2\/rule-controll-price\/{id}","caption":"\u0423\u0434\u0430\u043b\u0438\u0442\u044c","icon":"\/trlm\/images\/i-trash-bin_red.svg"}]},"alerts":null}
				// this.loading = false
				// return
				this.$axios.get(this.url)
					.then(response => {
							const data = response.data

							if (!this.$is_empty(data.errors)) {
								this.errors = data.errors
								this.messageShow = true
							}

							this.getData = data

							if (this.activeSubmenu == 'change-password') {
								for (let key in this.getData.form.main) this.postObject[key] = ""
							} else if (this.activeMenu == 'profile' && !this.activeSubmenu && this.getData.form) {
								for (let key in this.getData.form.main) this.postObject[key] = this.getData.form.main[key].value
							}
							this.loading = false
							this.loadingChange()
					})

			},
			changePickpoint() {
				if (this.activeSubmenuObject.component == 'table') {
					this.loading = true
					this.init()
				}
			},
			submenuChoose(menu_id, submenu_id) {
				if(submenu_id != 'default') {
					this.$emit('submenuChoose', menu_id, submenu_id)
				} else {
					this.$emit('submenuChoose', menu_id, 'default')
				}
			},
			formSave() {

				this.success = ""
				this.errors = []
				this.profileLoading = true

				this.alertsShow = false
                
				this.$axios.post(this.url, this.postObject)
					.then(response => {
						const data = response.data

						this.profileLoading = false
						if (!this.$is_empty(data.form)) {
							this.getData = data
						}
						if (data.success) {
							this.success = data.success
							this.messageShow = true
						} else if(data.errors) {
							this.errors = data.errors
							this.messageShow = true
						}
						if (data.alerts) {
							this.alertsShow = true
						}
					})

			},
			passwordInput(key, value) {
				this.postObject[key] = value
			},
			textFieldChange(key, value) {
				this.postObject[key] = value
			},
			loadingChange() {
				if (!this.$is_empty(this.sidebarSticky)) {
					this.sidebarSticky.updateSticky()
				}
				this.$emit('loadingChange')
			},

			logOut() {
				this.$emit('logOut')
			},
			messageClose() {
				this.success = ''
				this.errors = []
				this.messageShow = false
			}
		}
	}
</script>