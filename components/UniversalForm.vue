<template>
	<div class="un-form">

		<div v-if="loading || $is_empty(data)" class="preloader">
			<div class="preloader-btn"></div>
		</div>
		
		<div v-else>
			<img 
				v-if="isCloseIcon"
				src="/trlm/images/i-close.svg"
				alt="" 
				class="un-form__close-icon"
				@click="formClose"
			>

			<div class="un-form__form-block">
				<form class="un-form__form">
					<div 
						v-for="(block, key) in data.blocks"
						:key="block.id"
						class="un-form__block-for"
					>

						<div 
							v-if="block.repeaterDeletable"
							class="un-form__delete-block"
						>
							<span
								class="un-form__delete-button"
								@click="repeaterBlockRemove(key, block.repeaterName)"
							>
								удалить
							</span>
						</div>

						<div
							v-if="hideActiveModelChange(block)"
							class="un-form__block un-form__blocks_columns_one"
							:class="{'un-form__blocks_columns_two': block.columns == 2}"
						>
							<div 
								v-for="(item,index) in block.grid"
								:key="index"
								v-show="item.component !== 'text' || !item.data.hidden"
								class="un-form__block-item"
								:class="{
									'un-form__block-item_visible': item.component !== 'text' || !item.data.hidden,
								}"
							>
							<!-- Blocks -->
								<div 
									v-if="!$is_empty(item) && item.component == 'message'"
									class="un-form__message-component"
								>
									<span v-html="item.data.html"></span>
								</div>

								<div 
									v-if="!$is_empty(item) && item.component == 'alert'"
									class="un-form__alert"
								>
									<div 
										class="un-form__message message"
										:class="'un-form__message_i-' + item.data.type"	
									>
										<span v-html="item.data.html"></span>
									</div>
								</div>

							<!-- Unique form components -->

								<universal-form-title
									v-if="!$is_empty(item) && item.component == 'title'"
									:level="item.data.level"
									:caption="item.data.caption"
								/>
								<universal-form-buttons
									v-if="!$is_empty(item) && item.component == 'buttons'"
									:data="item.data"
									:postData="registrationForm"
									:loadingBlock="fileUploading"

									:error="error"

									@buttonClick="buttonClick"
								/>
								<universal-form-checkbox
									v-if="!$is_empty(item) && item.component == 'checkbox'"
									
									:id="item.data.id"
									:name="item.data.name"
									:errorText="item.data.error_text"
									:required="Boolean(item.data.required)"
									:label="item.data.label"
									:description="item.data.description"
									:checked="item.data.checked"

									:disabled="(
										(!$is_empty(item.data.disabled)) 
											&&
										(
											(item.data.disabled.rule == '==' && registrationForm[item.data.disabled.for_name] == item.data.disabled.for_value) ||
											(item.data.disabled.rule == '!=' && registrationForm[item.data.disabled.for_name] != item.data.disabled.for_value)
										)
									) ? true : false"
									
									v-model="$v.registrationForm[item.data.name].$model"
								/>
								<universal-form-phone
									v-if="!$is_empty(item) && item.component == 'phone'"

									:name="item.data.name"
									:outerError="item.data.error"
									:errorText="item.data.error_text"
									:required="Boolean(item.data.required)"
									:label="item.data.label"
									:value="item.data.value"
									:placeholder="item.data.placeholder"
									:description="item.data.description"
									:isSmsValid="item.data.is_sms_valid"
									:validation="$v.registrationForm[item.data.name]"
									:smsUrl="item.data.sms_url"

									:disabled="(
										(!$is_empty(item.data.disabled)) 
											&&
										(
											(item.data.disabled.rule == '==' && registrationForm[item.data.disabled.for_name] == item.data.disabled.for_value) ||
											(item.data.disabled.rule == '!=' && registrationForm[item.data.disabled.for_name] != item.data.disabled.for_value)
										)
									) ? true : false"

									v-model="$v.registrationForm[item.data.name].$model"
									@activeStatusChange="activeStatusChange"
								/>
								<universal-form-radio
									v-if="!$is_empty(item) && item.component == 'radiogroup'"

									:name="item.data.name"
									:errorText="item.data.error_text"
									:type="item.data.type"
									:columns="item.data.columns"
									:elements="item.data.elements"
									:minCount="item.data.min_count"
									:maxCount="item.data.max_count"
									:v="$v.registrationForm[item.data.name]"
									:checked="item.data.checked"

									:disabled="(
										(!$is_empty(item.data.disabled)) 
											&&
										(
											(item.data.disabled.rule == '==' && registrationForm[item.data.disabled.for_name] == item.data.disabled.for_value) ||
											(item.data.disabled.rule == '!=' && registrationForm[item.data.disabled.for_name] != item.data.disabled.for_value)
										)
									) ? true : false"
									
									v-model="$v.registrationForm[item.data.name].$model"
									@activeStatusChange="activeStatusChange"
								/>
								<universal-form-email
									v-if="!$is_empty(item) && item.component == 'email'"
									
									:id="item.data.id"
									:name="item.data.name"
									:outerError="item.data.error"
									:errorText="item.data.error_text"
									:required="Boolean(item.data.required)"
									:label="item.data.label"
									:value="item.data.value"
									:placeholder="item.data.placeholder"
									:description="item.data.description"
									:validation="$v.registrationForm[item.data.name]"

									:disabled="(
										(!$is_empty(item.data.disabled)) 
											&&
										(
											(item.data.disabled.rule == '==' && registrationForm[item.data.disabled.for_name] == item.data.disabled.for_value) ||
											(item.data.disabled.rule == '!=' && registrationForm[item.data.disabled.for_name] != item.data.disabled.for_value)
										)
									) ? true : false"

									v-model="$v.registrationForm[item.data.name].$model"
									@activeStatusChange="activeStatusChange"
								/>
								<universal-form-time
									v-if="!$is_empty(item) && item.component == 'time'"

									:name="item.data.name"
									:error="item.data.error"
									:errorText="item.data.error_text"
									:required="Boolean(item.data.required)"
									:label="item.data.label"
									:value="item.data.value"
									:placeholder="item.data.placeholder"
									:description="item.data.description"
									:minTime="item.data.min_time"
									:maxTime="item.data.max_time"
									:v="$v.registrationForm[item.data.name]"

									:disabled="(
										(!$is_empty(item.data.disabled)) 
											&&
										(
											(item.data.disabled.rule == '==' && registrationForm[item.data.disabled.for_name] == item.data.disabled.for_value) ||
											(item.data.disabled.rule == '!=' && registrationForm[item.data.disabled.for_name] != item.data.disabled.for_value)
										)
									) ? true : false"

									v-model="$v.registrationForm[item.data.name].$model"
									@activeStatusChange="activeStatusChange"
								/>
								<universal-form-coordinates
									v-if="!$is_empty(item) && item.component == 'coordinates'"

									:name="item.data.name"
									:outerError="item.data.error"
									:errorText="item.data.error_text"
									:required="Boolean(item.data.required)"
									:label="item.data.label"
									:description="item.data.description"
									:outerLatitude="item.data.latitude"
									:index="item.data.name"
									:outerLongitude="item.data.longitude"
									:v="$v.registrationForm[item.data.name]"

									:disabled="(
										(!$is_empty(item.data.disabled)) 
											&&
										(
											(item.data.disabled.rule == '==' && registrationForm[item.data.disabled.for_name] == item.data.disabled.for_value) ||
											(item.data.disabled.rule == '!=' && registrationForm[item.data.disabled.for_name] != item.data.disabled.for_value)
										)
									) ? true : false"

									@coordsChange="coordsChange"
								/>
								<universal-form-textarea
									v-if="!$is_empty(item) && item.component == 'textarea'"

									:name="item.data.name"
									:outerError="item.data.error"
									:outerErrorText="item.data.error_text"
									:required="Boolean(item.data.required)"
									:label="item.data.label"
									:outerValue="item.data.value"
									:placeholder="item.data.placeholder"
									:description="item.data.description"
									:componentKey="item.data.name"
									:maxLength="item.data.max_length"
									:v="$v.registrationForm[item.data.name]"
									:minLength="item.data.min_length"

									:disabled="(
										(!$is_empty(item.data.disabled)) 
											&&
										(
											(item.data.disabled.rule == '==' && registrationForm[item.data.disabled.for_name] == item.data.disabled.for_value) ||
											(item.data.disabled.rule == '!=' && registrationForm[item.data.disabled.for_name] != item.data.disabled.for_value)
										)
									) ? true : false"

									v-model="$v.registrationForm[item.data.name].$model"
									@activeStatusChange="activeStatusChange"
								/>

								<universal-form-number
									v-if="!$is_empty(item) && item.component == 'number'"

									:name="item.data.name"
									:error="item.data.error"
									:errorText="item.data.error_text"
									:required="Boolean(item.data.required)"
									:label="item.data.label"
									:value="String(item.data.value)"
									:placeholder="item.data.placeholder"
									:description="item.data.description"
									:min="item.data.min"
									:max="item.data.max"
									:before="item.data.before"
									:after="item.data.after"

									:disabled="(
										(!$is_empty(item.data.disabled)) 
											&&
										(
											(item.data.disabled.rule == '==' && registrationForm[item.data.disabled.for_name] == item.data.disabled.for_value) ||
											(item.data.disabled.rule == '!=' && registrationForm[item.data.disabled.for_name] != item.data.disabled.for_value)
										)
									) ? true : false"

									:v="$v.registrationForm[item.data.name]"

									v-model="$v.registrationForm[item.data.name].$model"
									@activeStatusChange="activeStatusChange"
								/>

								<universal-form-date
									v-if="!$is_empty(item) && item.component == 'date'"

									:name="item.data.name"
									:error="item.data.error"
									:errorText="item.data.error_text"
									:required="Boolean(item.data.required)"
									:label="item.data.label"
									:value="item.data.value"
									:placeholder="item.data.placeholder"
									:description="item.data.description"
									:v="$v.registrationForm[item.data.name]"
									:minDate="item.data.min_date"
									:maxDate="item.data.max_date"

									:disabled="(
										(!$is_empty(item.data.disabled)) 
											&&
										(
											(item.data.disabled.rule == '==' && registrationForm[item.data.disabled.for_name] == item.data.disabled.for_value) ||
											(item.data.disabled.rule == '!=' && registrationForm[item.data.disabled.for_name] != item.data.disabled.for_value)
										)
									) ? true : false"

									v-model="$v.registrationForm[item.data.name].$model"
									@activeStatusChange="activeStatusChange"
								/>

								<universal-form-files
									v-if="!$is_empty(item) && item.component == 'files'"
									:data="item"
									:name="item.data.name"
									:error="item.data.error"
									:error_text="item.data.error_text"
									:label="item.data.label"
									:description="item.data.description"
									:minCount="item.data.min_count"
									:maxCount="item.data.max_count"
									:maxSize="item.data.max_size"
									:accept="item.data.accept"
									:preview="item.data.preview"
									:removability="item.data.removability"
									:add_url="item.data.add_url"
									:values="item.data.value"
									:v="$v.registrationForm[item.data.name]"
									:over="filesOver"

									:disabled="(
										(!$is_empty(item.data.disabled)) 
											&&
										(
											(item.data.disabled.rule == '==' && registrationForm[item.data.disabled.for_name] == item.data.disabled.for_value) ||
											(item.data.disabled.rule == '!=' && registrationForm[item.data.disabled.for_name] != item.data.disabled.for_value)
										)
									) ? true : false"

									v-model="$v.registrationForm[item.data.name].$model"
									
									@overFalse="filesOver = false"
									@overTrue="filesOver = true"
									@fileUploadingStart="fileUploading = true"
									@fileUploadingOver="fileUploading = false"
								/>

								<!--<repeater
									v-if="!$is_empty(item) && item.component == 'repeater'"
									:key="'name'"

									:formModel="data"
									:repeatersData="repeatersData"

									:index="index"
									:data="item.data"
									:name="item.data.name"
									:minCount="item.data.min_count"
									:maxCount="item.data.max_count"
									:buttonText="item.data.button_text"
									:block="item.data.block"
									:values="item.data.values"

									@blockAdd="repeaterBlockAdd"

									@repeatersDataCountSet="repeatersDataCountSet"
									@repeatersDataAddBlock="repeatersDataAddBlock"
									@repeatersDataNameSet="repeatersDataNameSet"
									@repeatersDataBlocksSet="repeatersDataBlocksSet"
									@repeatersDataRemoveRepeaterBlock="repeatersDataRemoveRepeaterBlock"
								/>-->

								<div 
									v-if="!$is_empty(item) && item.component == 'repeater'"
									class="repeater"
								>
									<div 
										v-if="repeatersData.repeaters[item.data.name].length != item.data.max_count"
										class="repeater__add-button"
										@click="repeaterBlockAdd(key, item.data)"
									>
										<span class="repeater__add-text">{{ item.data.button_text }}</span>
									</div>
								</div>
								

							<!-- Filter components -->

								<personal-multiselect
									v-if="!$is_empty(item) && item.component == 'select'"
									:ref="item.data.name"

									:select="item.data.options"
									:values="item.data.selected"
									:api_url="item.data.api_url"
									:label="item.data.label"
									:componentKey="item.data.name"
									:description="item.data.description"
									:maxCount="item.data.max_count"
									:minCount="item.data.min_count"
									:outerError="item.data.error"
									:outerErrorText="item.data.error_text"
									:formUsing="true"
									:v="$v.registrationForm[item.data.name]"
									:updateUrl="(item.data.update_url) ? item.data.update_url : null"
									:updateComponent="(item.data.update_component) ? item.data.update_component : null"

									:disabled="(
										(!$is_empty(item.data.disabled)) 
											&&
										(
											(item.data.disabled.rule == '==' && registrationForm[item.data.disabled.for_name] == item.data.disabled.for_value) ||
											(item.data.disabled.rule == '!=' && registrationForm[item.data.disabled.for_name] != item.data.disabled.for_value)
										)
									) ? true : false"
									
									@multiselectAdd="multiselectChange"
									@multiselectRemove="multiselectChange"
									@activeStatusChange="activeStatusChange"
									@updateBoundedSelect="updateBoundedSelect"
								/>

								<personal-text
									v-if="!$is_empty(item) && item.component == 'text'"

									:validation="$v.registrationForm[item.data.name]"
									:componentKey="item.data.name"
									:autocompleteKey="item.data.key"
									:label="item.data.label"
									:name="item.data.name"
									:placeholder="item.data.placeholder"
									:required="Boolean(item.data.required)"
									:outerError="item.data.error"
									:outerErrorText="item.data.error_text"
									:outerValue="item.data.value"
									:description="item.data.description"
									:api_url="item.data.api_url"
									:hidden="item.data.hidden"
									
									:disabled="(
										(!$is_empty(item.data.disabled)) 
											&&
										(
											(item.data.disabled.rule == '==' && registrationForm[item.data.disabled.for_name] == item.data.disabled.for_value) ||
											(item.data.disabled.rule == '!=' && registrationForm[item.data.disabled.for_name] != item.data.disabled.for_value)
										)
									) ? true : false"

									@textFieldChange="textFieldChange"
									@activeStatusChange="activeStatusChange"
								/>


								<!-- Password field -->

								<password-field
									v-if="!$is_empty(item) && item.component == 'password'"

									:name="item.data.name"
									:outerError="item.data.error"
									:outerErrorText="item.data.error_text"
									:required="Boolean(item.data.required)"
									:label="item.data.label"
									:outerValue="item.data.value"
									:placeholder="item.data.placeholder"
									:description="item.data.description"
									:maxLength="item.data.max_length"
									:minLength="item.data.min_length"
									:componentKey="item.data.name"
									:validation="$v.registrationForm[item.data.name]"

									:disabled="(
										(!$is_empty(item.data.disabled)) 
											&&
										(
											(item.data.disabled.rule == '==' && registrationForm[item.data.disabled.for_name] == item.data.disabled.for_value) ||
											(item.data.disabled.rule == '!=' && registrationForm[item.data.disabled.for_name] != item.data.disabled.for_value)
										)
									) ? true : false"

									@input="passwordInput"
									@activeStatusChange="activeStatusChange"
								/>

							</div>
						</div>
						
					</div>
					
				</form>
			</div>
		
		</div>

		
			
	</div>
</template>

<script>

	import { required, email, minLength, maxLength, minValue, maxValue, helpers } from 'vuelidate/lib/validators'

	import UniversalFormCheckbox from './UniversalFormCheckbox.vue'
	import UniversalFormRadio from './UniversalFormRadio.vue'
	import UniversalFormPhone from './UniversalFormPhone.vue'
	import UniversalFormButtons from './UniversalFormButtons.vue'
	import UniversalFormEmail from './UniversalFormEmail.vue'
	import UniversalFormTime from './UniversalFormTime.vue'
	import UniversalFormCoordinates from './UniversalFormCoordinates.vue'
	import UniversalFormTextarea from './UniversalFormTextarea.vue'
	import UniversalFormNumber from './UniversalFormNumber.vue'
	import UniversalFormDate from './UniversalFormDate.vue'
	import UniversalFormFiles from './UniversalFormFiles.vue'
	import UniversalFormTitle from './UniversalFormTitle.vue'
	// import Repeater from './Repeater.vue'

	import PersonalMultiselect from './PersonalMultiselect.vue'
	import PersonalText from './PersonalText.vue'
 
	import PasswordField from './PasswordField.vue'

	export default {
		components: {
			UniversalFormCheckbox,
			UniversalFormRadio,
			UniversalFormPhone,
			UniversalFormButtons,
			UniversalFormEmail,
			UniversalFormTime,
			UniversalFormCoordinates,
			UniversalFormTextarea,
			UniversalFormNumber,
			UniversalFormDate,
			UniversalFormFiles,
			UniversalFormTitle,
			// Repeater,

			PersonalMultiselect,
			PersonalText,

			PasswordField
		},
		props: {
			outsideData: {
				type: Object,
				required: true
			},
			isCloseIcon: {
				type: Boolean,
				default: false
			},
			v: {
				type: Object,
				required: false
			}
		},
		data() {
			return {
				repeatersData: {
					count: 0,
					id: 0,
					repeaters: {}
				},

				filesOver: false,
				fileUploading: false,

				registrationForm: {},
				defaultForm: {},

				activeModel: {},
				secondDefaultForm: {},

				value: null,
				error: false,
				loading: false,
				data: this.outsideData
			}
		},
		validations() {
			if ( this.data !== null ) {

				this.defaultForm = {}
				this.secondDefaultForm = {}

				let validators = {}
				let results = {}
				let registrationFormCopy = (!this.$is_empty(this.registrationForm)) ? JSON.parse(JSON.stringify(this.registrationForm)) : {}

				for (let block of this.data.blocks) {
					
					for (let item of block.grid) {

						if (

							(!this.$is_empty(item) &&
							!this.$is_empty(item.data)) 
							
							&&

							(item.component == 'text' ||
							item.component == 'password' ||
							item.component == 'textarea' ||
							item.component == 'number' ||
							item.component == 'date' ||
							item.component == 'time' ||
							item.component == 'phone' ||
							item.component == 'email' ||
							item.component == 'checkbox' ||
							item.component == 'coordinates' ||
							item.component == 'radiogroup' ||
							item.component == 'select' ||
							item.component == 'files')

						) {

							validators[item.data.name] = item.data
							validators[item.data.name].validationType = item.component		

						}
					}
				}

				for (let key in validators) {

					results[key] = {}

					this.$set(this.defaultForm, key, validators[key].value || '')
					
					this.$set(this.secondDefaultForm, key, true)

					if (!this.$is_empty(validators[key].min_length)) {
						results[key].minLength = minLength(validators[key].min_length)
					}

					if (!this.$is_empty(validators[key].max_length)) {
						results[key].maxLength = maxLength(validators[key].max_length)
					}

					if (validators[key].required && validators[key].validationType != 'select' && validators[key].validationType != 'coordinates') {
						results[key].required = required
					}

					if (validators[key].validationType == 'number') {
						const contains = (before, after) =>
								(value) => {

									let regExp = new RegExp("\-?\\\d{1," + ((before) ? before : "999") + "}(\\\.\\\d{1," + ((after) ? after : "999") + "})?")

									if (!this.$is_empty(value) && (this.$is_empty(value.match(regExp)) || value.match(regExp)[0] != value.match(regExp)["input"])) {
										return false
									} else {
										return true
									}
								}

						results[key].numberFormat = contains(validators[key].before, validators[key].after)
					}

					if ((validators[key].validationType == 'select' || validators[key].validationType == 'files') && validators[key].min_count > 0) {

						const requiredArrayLength = (value) => value.length > 0
						results[key].requiredArrayLength = requiredArrayLength

						if (validators[key].min_count > 1) {
							
							const contains = (minLength) =>
								(value) => value.length >= minLength

							results[key].minArrayLength = contains(validators[key].min_count)
						}

					}

					if (validators[key].validationType == 'phone') {
						results[key].minLength = minLength(12)
					}

					if (validators[key].validationType == 'time') {
						if (!this.$is_empty(validators[key].min_time)) {
							const contains = (hours, minutes, seconds) =>
								(value) => {
									let valueHours = value.split(':')[0],
										valueMinutes = value.split(':')[1],
										valueSeconds = value.split(':')[2],

									valueDate = new Date(1970, 0, 0, Number(valueHours), Number(valueMinutes), Number(valueSeconds)),
									date = new Date(1970, 0, 0, Number(hours), Number(minutes), Number(seconds))
									return !helpers.req(value) || (valueDate >= date)
								}

							let hours = validators[key].min_time.split(':')[0],
								minutes = validators[key].min_time.split(':')[1],
								seconds = validators[key].min_time.split(':')[2]
							
							results[key].minTime = contains(hours, minutes, seconds)
							
						}
						if (!this.$is_empty(validators[key].max_time)) {
							const contains = (hours, minutes, seconds) =>
								(value) => {
									let valueHours = value.split(':')[0],
										valueMinutes = value.split(':')[1],
										valueSeconds = value.split(':')[2],

									valueDate = new Date(1970, 0, 0, Number(valueHours), Number(valueMinutes), Number(valueSeconds)),
									date = new Date(1970, 0, 0, Number(hours), Number(minutes), Number(seconds))

									return !helpers.req(value) || (valueDate <= date)
								}

							let hours = validators[key].max_time.split(':')[0],
								minutes = validators[key].max_time.split(':')[1],
								seconds = validators[key].max_time.split(':')[2]
							
							results[key].maxTime = contains(hours, minutes, seconds)
						}
					}

					if (validators[key].validationType === 'email') {
						results[key].email = email
					}

					if (validators[key].validationType === 'number') {
						if (!this.$is_empty(validators[key].max)) {
							results[key].maxValue = maxValue(validators[key].max)
						}
						if (!this.$is_empty(validators[key].min)) {
							results[key].minValue = minValue(validators[key].min)
						}
					}

					if (validators[key].validationType === 'coordinates') {
						this.$set(this.defaultForm, key, {
							longitude: validators[key].longitude,
							latitude: validators[key].latitude
						})
						if (validators[key].required) {
							const requiredCoordinates = (value) => (value.longitude != null && value.longitude !== '') && (value.latitude != null && value.longitude !== '')
							results[key].requiredCoordinates = requiredCoordinates
						}
					}
					 
					if (validators[key].validationType === 'select') {
						this.$set(this.defaultForm, key, [])
						for (let option of validators[key].options) {
							if (option.selected) {
								this.defaultForm[key].push(option.value)
							}
						}
					}	
				}

				this.registrationForm = Object.assign({}, this.defaultForm)
				this.activeModel = Object.assign({}, this.secondDefaultForm)
				
				if (!this.$is_empty(registrationFormCopy)) {
					for (let index in this.registrationForm) {
						if (registrationFormCopy[index]) {
							this.registrationForm[index] = registrationFormCopy[index]
						}
					}
				}	

				return {
					registrationForm: results
				}
			}
		},
		computed: {
		},
		watch: {
			outsideData() {
				this.data = this.outsideData
			}
		},
		created() {
			
			this.data.blocks.forEach((block, index) => {
				block['id'] = index
			})

			this.repeatersData.id = this.data.blocks.length

			let positionCounter = 0
			const model = JSON.parse(JSON.stringify(this.data))

			for (let key in model.blocks) {
				for(let item of model.blocks[key].grid) {
					if (item.component == 'repeater') {
						this.repeatersData.repeaters[item.data.name] = []
						if (!this.$is_empty(item.data.values.length)) {
							for (let i = 0;i<item.data.values.length; i++) {
								this.repeaterBlockAdd(Number(key) + Number(positionCounter), item.data)
								positionCounter++
							}
						}
					}
				}
			
			}
		},
		mounted() {
		},
		methods: {
			buttonClick(method, action, url) {

				this.error = false
				let valid = true

				for (let [key, elem] of Object.entries(this.activeModel)) {
					if (elem) {
						if (this.$v.registrationForm[key].$invalid) {
							this.$v.registrationForm[key].$touch()
							valid = false
						}
					}
				}

				if (!valid) {
					this.error = true
					return
				}

				if (!this.$is_empty(method) && !this.$is_empty(action)) {

					this.loading = true

					let postObject = JSON.parse(JSON.stringify(this.registrationForm))

					for (let [key, elem] of Object.entries(this.repeatersData.repeaters)) {
						postObject[key] = []
						for (let block of elem) {
							postObject[key].push({})
							for (let [index, item] of Object.entries(block)) {
								postObject[key][postObject[key].length - 1][index] = postObject[item]
								delete postObject[item]
							}
						}
          }
          
          this.$axios({method, url})
            .then(response => {
              const data = response.data

              if (!this.$is_empty(data.blocks)) {
								this.data = data
								$(".un-form").css('height', 'auto')
								this.loading = false
							} else if (!this.$is_empty(data.success) || !this.$is_empty(data.errors)) {
								this.$emit('formEnding', data)
							}
            })

				} else if (!this.$is_empty(url)) {

					if ((url.indexOf(document.location.hostname) + 1) || url[0] == '/') {
						this.$router.push(url)
					} else {
						document.location.href = url
					}
					  
				}
			},
			formClose() {
				this.$emit('formClose')
			},
			activeStatusChange(key, disabled) {
				this.activeModel[key] = !disabled
			},


			multiselectChange(key, choosen) {
				this.$v.registrationForm[key].$model = choosen
			},
			multiselectRemove(key, choosen) {
				this.$v.registrationForm[key].$model = choosen
			},
			updateBoundedSelect(valuesArray, triggeredName, boundedName, boundedUrl) {
				this.$refs[boundedName][0].bundedUpdate(valuesArray, triggeredName, boundedUrl)
			},

			formNumberChange(key, value) {
				this.registrationForm[key] = value
			},
			chooseDate(index, date) {
				this.registrationForm[index] = date
			},
			passwordInput(key, value) {
				this.$v.registrationForm[key].$model = value
			},
			coordsChange(index, type, value) {
				eval('this.registrationForm[index].' + type + '= value')
			},
			textFieldChange(key, value) {
				this.$v.registrationForm[key].$model = value
			},
			repeaterBlockAdd(key, data) {

				if (data.max_count == this.repeatersData.count) return

				this.repeatersData.count = this.repeatersData.count + 1
				this.repeatersData.id = this.repeatersData.id + 1
				
				let block = JSON.parse(JSON.stringify(data.block))

				this.repeatersData.repeaters[data.name].push({})

				if (this.repeatersData.count > data.min_count) {
					block['repeaterDeletable'] = true
					block['repeaterName'] = data.name
				}
				
				block.id = this.repeatersData.id

				for (let component of block.grid) {
					let cleanName = component.data.name
					component.data.name = component.data.name + this.repeatersData.id

					this.repeatersData.repeaters[data.name][this.repeatersData.repeaters[data.name].length - 1][cleanName] = component.data.name

					if (component.component == 'select') {
						if (data.values[key]) {
							if (Array.isArray(data.values[key][cleanName])) {
								for (let item of data.values[key][cleanName]) {
									for (let value of component.data.options) {
										value.selected = false
										if (value.value === item) {
											value.selected = true
											break
										}
									}
								}
							} else {
								for (let item of component.data.options) {
									item.selected = false
									if (item.value === data.values[key][cleanName]) {
										item.selected = true
									}
								}
							}
						}
						
					} else {
						if (data.values[key]) {
							if (data.values[key][cleanName]) {
								component.data.value = String(data.values[key][cleanName])
							}
						}
					}
				}

				let localDataBlocks = JSON.parse(JSON.stringify(this.data.blocks)),
						firstPart = localDataBlocks.slice(0, key),
						secondPart = localDataBlocks.slice(key, localDataBlocks.length)

				this.data.blocks = firstPart.concat(block, secondPart)

			},
			repeaterBlockRemove(key, name) {
				
				let localDataBlocks = JSON.parse(JSON.stringify(this.data.blocks))

				this.repeatersData.repeaters[name] = this.repeatersData.repeaters[name].slice(0, key).concat(this.repeatersData.repeaters[name].slice(key + 1))
				this.repeatersData.count = this.repeatersData.count - 1

				this.data.blocks = localDataBlocks.slice(0, key).concat(localDataBlocks.slice(key + 1))
			},

			// repeatersDataCountSet(count) {
			// 	this.repeatersData.count = count
			// },
			// repeatersDataAddBlock(key) {
			// 	this.repeatersData.repeaters[key].push({})
			// },
			// repeatersDataNameSet(blockKey, gridKey, repeaterKey, name) {
			// 	this.repeatersData.repeaters[blockKey][gridKey][repeaterKey] = name
			// },
			// repeatersDataBlocksSet(blocks) {
			// 	this.data.blocks = blocks
			// },
			// repeatersDataRemoveRepeaterBlock(key) {
			// 	this.repeatersData.repeaters[key] = this.repeatersData.repeaters[key].slice(0, key).concat(this.repeatersData.repeaters[key].slice(key + 1))
			// },

			hideActiveModelChange(block) {

				let show = (this.$is_empty(block.hide) ||
				(
					(
						(block.hide.rule == '!=' && this.registrationForm[block.hide.for_name] != block.hide.for_value) ||
						(block.hide.rule == '==' && this.registrationForm[block.hide.for_name] == block.hide.for_value)
					)
					
				) ) ? true : false

				if (!show) {
					for (let item of block.grid) {
						if (
							item.component == 'text' ||
							item.component == 'password' ||
							item.component == 'textarea' ||
							item.component == 'number' ||
							item.component == 'date' ||
							item.component == 'time' ||
							item.component == 'phone' ||
							item.component == 'email' ||
							item.component == 'checkbox' ||
							item.component == 'coordinates' ||
							item.component == 'radiogroup' ||
							item.component == 'select'
						) {
							this.activeModel[item.data.name] = show
						}
					}
				}
				
				return show
			}
		}
	}
</script>