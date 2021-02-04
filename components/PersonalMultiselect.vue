<template>
	<div 
		class="multiselect_personal"
		:class="{
			'multiselect_opened': isOpen,
			'un-form__disabled-field': disabled
		}"
		v-click-outside="close"
	>
		<div class="form__label">
			{{ label }}
			<span v-if="minCount > 0">(обязательное)</span>
		</div>
		<div 
			class="multiselect__short"
			:class="{
				'multiselect__short_opened': isOpen,
				'multiselect__short_error': localError || (!$is_empty(v) && v.$error && v.$dirty && !disabled)
			 }"
		 	@click="open"
		 >

			<div>
				<input 
					v-if="isOpen"
					type="text" 
					name="" 
					placeholder="Поиск" 
					v-model.trim="search"
					class="multiselect__input"
				>
				<span v-else-if="!isOpen" class="multiselect__choosen-number">
					<div v-if="!formUsing">
						<span v-if="choosen.length > 1">Выбрано {{ choosen.length }}</span>
						<span v-else-if="choosen.length">{{ choosen[0].name || choosen[0].caption || choosen[0].value }}</span>
						<span v-else>{{ placeholder || 'Выбрать' }}</span>
					</div>
					<div v-else>
						<span v-if="choosen.length == 0">
							Выбрать
						</span>
						<div v-else class="multiselect__choosen-wrapper">
							<div 
								class="multiselect__choosen-itm"
								v-for="(item,index) in choosen"
								:key="index"
							>
								<span>{{ item.caption }}</span>
								<img 
									src="../static/images/i-close-small.svg"
									alt="" 
									class="multiselect__choosen-close"
									@click="remove(index)"
								>
							</div>
						</div>
						
					</div>
				</span>
			</div>
		 
			<img 
				src="../static/images/i-arrow-small.svg" 
				alt="" 
				class="multiselect__arrow"
				:class="{'crud__sort-arrow_rotated': isOpen}"
			>
		</div>
		<div class="multiselect__full" v-if="isOpen">
			<div class="multiselect__choosen_wrapper" v-if="choosen[0]">
				<div 
					class="multiselect__choosen-itm"
					v-for="(item,index) in choosen"
					:key="index"
				>
					<span>{{ item.caption }}</span>
					<img 
						src="../static/images/i-close-small.svg"
						alt="" 
						class="multiselect__choosen-close"
						@click="remove(index)"
					>
				</div>
			</div>
			<div class="multiselect__list_wrapper" v-if="!$is_empty(localList)">
				<div 
					v-for="(item,index) in localList"
					:key="index"
					@click="add(index)"
				>
					<div v-if="item.caption && item.value != null" class="multiselect__list-itm">
						<span>{{ item.caption }}</span>
					</div>
					
				</div>
			</div>
		</div>



		<div class="form__message_error" v-if="(localErrorText)">
			<span>
				{{ localErrorText }}
			</span>
		</div>

		<div class="form__message_error" v-if="!$is_empty(v) && v.$error && v.$dirty && !disabled">
			<span v-if="!v.requiredArrayLength">
				Данное поле обязательно для заполнения
			</span>
			<span v-else-if="!v.minArrayLength">
				Выбрать нужно как минимум {{ minCount }}
			</span>
		</div>

		<div v-if="!$is_empty(description)" class="form__message">
			{{ description }}
		</div>

		

	</div>
</template>

<script>
import { debounce } from 'vue-debounce'
import Multiselect from 'vue-multiselect'

	export default {
		components: {
			Multiselect
		},
		props: {
			formUsing: {
				type: Boolean,
				default: false
			},

			select: {
				type: Array
			},
			values: {
				type: Array,
			},
			api_url: {
				type: String
			},

			orderNumber: {
				type: Number
			},
			componentKey: {
				type: String
			},

			label: {
				type: String
			},
			placeholder: {
				type: String,
			},
			
			outerError: {
				type: Boolean
			},
			outerErrorText: {
				type: String
			},

			maxCount: Number,
			minCount: Number,

			form: {
				type: Boolean,
				default: false
			},

			disabled: {
				type: Boolean,
				default: false
			},

			updateUrl: {
				type: String,
				default: ""
			},
			updateComponent: {
				type: String,
				default: ""
			},

			description: {
				type: String
			},

			v: {
				type: Object
			}
		},
		data() {
			return {
				isOpen: false,
				localList: [],
				search: "",
				choosen: [],

				localError: this.outerError,
				localErrorText: this.outerErrorText,

				dirty: false
			}
		},
		computed: {
			filteredList() {
				let search = this.search
				return this.select.filter(function (elem) {
						if(search === '') {
							return true
						}
						else {
							return elem.caption.toLowerCase().trim().indexOf(
								search.toLowerCase()
							) > -1
						}
				})
			},
		},
		watch: {
			search() {
				if (!this.$is_empty(this.api_url)) {
					this.debounceSearch()
				} else {
					this.localList = this.filteredList
				}
			},
			disabled() {
				this.activeStatusChange()
				this.choosen = []
				this.$emit('multiselectRemove', this.componentKey, [])
			},
			outerError() {
        this.localError = this.outerError
      },
      outerErrorText() {
        this.localErrorText = this.outerErrorText
      }
		},
		created() {

			this.activeStatusChange()
			
			if (!this.$is_empty(this.select)) {
				this.localList = this.select
				
				if (this.formUsing) {
					let choosenValueArray = []
					for (let item of this.localList) {
						if (item.selected) {
							this.choosen.push(item)
							choosenValueArray.push(item.value)
						}
					}
					if (this.choosen.length) {
						this.$emit('multiselectAdd', this.componentKey, choosenValueArray)
					}
				}
				
			}

			if (!this.$is_empty(this.values)) {
				this.choosen = this.values
			}

			if (!this.$is_empty(this.api_url)) {
				this.debounceSearch = debounce(this.updateList, 400)
			}

		},
		mounted() {
		},
		methods: {
			open() {
				if (!this.disabled) {
					if(event.target.tagName != "INPUT" && event.target.classList[0] != 'multiselect__choosen-close') {
						this.isOpen = !this.isOpen
					}
					return false
				}
				
			},
			close() {
				this.isOpen = false
			},
			add(i) {

				if (this.localError || this.localErrorText) {
					this.localError = false
					this.localErrorText = ''
				}

				if (!this.$is_empty(this.v)) {
					this.v.$touch()
				}

				let fit = true

				for (let elem of this.choosen) {
					if (this.localList[i].value === elem.value) {
						fit = false
						break
					}
				}

 				if (this.$is_empty(this.maxCount) || this.choosen.length < this.maxCount) {
					
					this.dirty = true

					

					if (fit) {
						this.choosen.push(this.localList[i])

						if (this.formUsing) {
							let choosenValueArray = []
							for (let item of this.choosen) {
								choosenValueArray.push(item.value)
							}
							this.$emit('multiselectRemove', this.componentKey, choosenValueArray)
						} else {
							this.$emit('multiselectAdd', this.componentKey, this.localList[i].value)
						}

							// bounded select list update

						if (
							!this.$is_empty(this.updateComponent) &&
							!this.$is_empty(this.updateUrl)
						) {
							this.$emit('updateBoundedSelect', this.choosen, this.componentKey, this.updateComponent, this.updateUrl)
						}

					}

				} else {
					if (!fit) {
						return
					}
					this.dirty = true
					if (this.formUsing) {

						this.choosen.shift()
						this.choosen.push(this.localList[i])

						// bounded select list update

						if (
							!this.$is_empty(this.updateComponent) &&
							!this.$is_empty(this.updateUrl)
						) {
							this.$emit('updateBoundedSelect', this.choosen, this.componentKey, this.updateComponent, this.updateUrl)
						}

						let choosenValueArray = []
							for (let item of this.choosen) {
								choosenValueArray.push(item.value)
						}
						this.$emit('multiselectRemove', this.componentKey, choosenValueArray)
					}
 					
				}

			

				if (this.maxCount == 1) {
					this.close()
				}
			},
			remove(i) {
				if (!this.$is_empty(this.v)) {
					this.v.$touch()
				}

				this.choosen.splice(i, 1)

				if (this.formUsing) {
					let choosenValueArray = []
					for (let item of this.choosen) {
						choosenValueArray.push(item.value)
					}
					this.$emit('multiselectRemove', this.componentKey, choosenValueArray)
				} else {
					this.$emit('multiselectRemove', this.componentKey, i)
				}

				// bounded select list update

				if (
					!this.$is_empty(this.updateComponent) &&
					!this.$is_empty(this.updateUrl)
				) {
					this.$emit('updateBoundedSelect', this.choosen, this.componentKey, this.updateComponent, this.updateUrl)
				}
				
			},

			updateList() {
				
                let url = this.api_url + '?' + (this.componentKey || 'search') + '=' + this.search
                
                this.$axios.get(url)
                    .then(response => {
                        const data = response.data

                        if (Array.isArray(data)) {
                            this.localList = data
                        }
                    })

			},
			activeStatusChange() {
        this.$emit('activeStatusChange', this.componentKey || this.name, this.disabled)
			},
			
			bundedUpdate(boundedValues, triggeredName, apiUrl) {

				let url = new URL(window.location.origin + apiUrl)

				boundedValues.forEach((param, index) => {
					url.searchParams.set(`${triggeredName}[${index}]`, param.value)
				})

                url.searchParams.set('for', this.componentKey)
                
                this.$axios.get(url)
                    .then(response => {
                        const data = response.data

                        if (Array.isArray(data) && !this.$is_empty(data)) {
                            this.localList = data
                        }
                    })
			}
		}
	}
</script>