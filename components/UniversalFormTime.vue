<template>
  <div 
		class="un-form-time"
		:class="{
      'un-form__disabled-field': disabled
    }"
	>
		<div class="form__label">
			{{ label || "Время" }}
			<span v-if="required">(обязательное)</span>
		</div>

		<the-mask
			v-model="localValue"
			class="un-form-time__input"
			:mask="mask"
			masked
			:disabled="disabled"
			:tokens="tokens"
			@input="inputFunction"
			@blur.native="blurFunction"
			@focus.native="blur = false"
			:placeholder="placeholder || ''"
			:class="{
				'form__input_required': required,
				'form__input_error': (v.$error && blur) || localError
			}"
		/>

		<!-- <input 
			type="text"
			class="un-form-time__input"
			v-model="localValue"
			:class="{
				'form__input_required': required,
				'form__input_error': (v.$error && blur) || localError
			}"
			:placeholder="placeholder || ''"
			@input="inputFunction"
			@blur="blurFunction"
			@focus="blur = false"
			:disabled="disabled"
		> -->

		<div class="form__message">
			{{ description }}
		</div>

		<div class="form__message_error" v-if="(v.$error && v.$dirty && !disabled && blur)">
			<div v-if="v.$error && v.$dirty">
				<span v-if="v.required === false && !v.$model">
					Данное поле обязательно для заполнения
				</span>
				<span v-else-if="v.minTime === false">
					Минимальное время {{ minTime }}
				</span>
				<span v-else-if="v.maxTime === false">
					Максимальное время {{ maxTime }}
				</span>
			</div>
			
		</div>

		<div v-if="!$is_empty(localErrorText)" class="form__message_error">
			<span>
				{{ localErrorText }}
			</span>
		</div>

  </div>
</template>

<script>


  export default {
	components: {},
	props: {
		name: String,
		error: {
			type: Boolean,
			default: false
		},
		errorText: String,
		required: {
			type: Boolean,
			default: false
		},
		label: String,
		placeholder: String,
		description: String,
		minTime: String,
		maxTime: String,
		value: String,
		disabled: {
			type: Boolean
		},

	  v: {
			type: Object
	  }
	},
	data() {
	  return {
			localValue: "",
			mask: "##:M#",
			tokens: {
				'#': {
					pattern: /\d/
				},
				'H': {
					pattern: /[0-3]/
				},
				'M': {
					pattern: /[0-5]/
				}
			},
			regularExpression: new RegExp("^([0-1][0-9]|2[0-3]):?[0-5]?[0-9]?$"),
			model: {},
			blur: true,
			localError: this.error,
			localErrorText: this.errorText,
			valueFlag: false,
			localDate: new Date(1970, 0, 0, 0, 0, 0),
	  }
	},
	computed: {
		validationError() {
			return this.v.$error
		},
		// mask() {
		// 	if (this.localValue[0] > 2) {
		// 		return "0#:##"
		// 	}
		// 	return "##:##"
		// }
	},
	watch: {
		model() {
		},
		disabled() {
			this.activeStatusChange()
			this.model = ''
			this.v.$touch()
		},
		error() {
			this.localError = this.error
		},
		errorText() {
			this.localErrorText = this.errorText
		},
	},
	created() {
		this.activeStatusChange()
		if (this.value) {
			let hours = this.value.split(':')[0],
					minutes = this.value.split(':')[1]

			this.localValue = hours + ":" + minutes
			this.inputFunction()
		} else this.valueFlag = true
	},
	mounted() {
		
	},
	methods: {
		timeFilling() {
			switch(this.localValue.length) {
				case 1: {
					return this.localValue + "0:00"
				}; break;
				case 2: {
					return this.localValue + ":00"
				}; break;
				case 3: {
					return this.localValue + "00"
				}; break;
				case 4: {
					return this.localValue + "0"
				}; break;
				default: {
					return this.localValue
				}
			}
		},
		activeStatusChange() {
			this.$emit('activeStatusChange', this.componentKey || this.name, this.disabled)
		},
		inputFunction() {

			if (this.localValue[0] > 2) {
				this.mask = "0#:M#"
				setTimeout(()=> {
					document.querySelector(".un-form-time__input").selectionStart = 2
					document.querySelector(".un-form-time__input").selectionEnd = 2
				}, 1)
			} else {
				this.mask = "##:M#"
			}

			if (this.localValue[0] == '2') {
				this.mask = '#H:M#'
			}

			// let i = 0
			// if (this.mask) {
			// 	setTimeout(()=> {
			// 		document.querySelector(".un-form-time__input").selectionStart = 3
			// 		document.querySelector(".un-form-time__input").selectionEnd = 3
			// 	}, 1)
			// }
			

			// document.querySelector(".un-form-time__input").selectionStart = 3
			// document.querySelector(".un-form-time__input").selectionEnd = 3

			// if (this.localValue[0] > 2) {
			// 	this.localValue = "0" + this.localValue + ":"
				
			// 	document.querySelector(".un-form-time__input").setSelectionRange(0, 0)
			// 	// document.querySelector(".un-form-time__input").blur()
			// 	// document.querySelector(".un-form-time__input").focus()
			// 	// this.inputFunction()
			// }
			// if ((this.$is_empty(this.localValue.match(this.regularExpression)) && (this.localValue.length !=1)) || this.localValue[3] > 5) {
			// 	this.localValue = this.localValue.substring(0, this.localValue.length - 1)
			// }
			this.$emit('input', (!this.$is_empty(this.timeFilling())) ? (this.timeFilling() + ":00") : "")
			
		},
		blurFunction() {
			this.blur = true
			this.localValue = this.timeFilling()
			this.$emit('input', (!this.$is_empty(this.timeFilling())) ? (this.timeFilling() + ":00") : "")
		}
	}
  }
</script>