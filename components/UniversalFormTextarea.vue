<template>
  <div 
		class="un-form-textarea"
		:class="{
      'un-form__disabled-field': disabled
    }"
	>
		<div class="form__label">
      {{ label }}
      <span v-if="required">(обязательное)</span>
    </div>

		<textarea 
			class="un-form-textarea__field"
			:class="{ 
        'form__input_required': required,
        'form__input_error' : (v.$error && !disabled && ((v.minLength === undefined || v.minLength) || (v.minLength == false && blur))) || localError,

      }"
			:placeholder="placeholder"
			:disabled="disabled"
			@focus="blur = false"
			@blur="blur = true"
			@input="input"
			v-model="value"
		>
		</textarea>

		<div class="form__message">
      {{ description }}
    </div>

		<div v-if="(v.$error && v.$dirty && !disabled)" class="form__message_error">

      <span v-if="!v.required && !v.$model.length">
        Данное поле обязательно для заполнения
      </span>

      <span v-if="v.minLength !== undefined && !v.minLength && blur">
				 Минимальная длина поля {{ minLength }} символов
      </span>
      
      <span v-if="v.maxLength !== undefined && !v.maxLength">
				 Максимальная длина поля {{ maxLength }} символов
      </span>
  
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
	components: {
	},
	props: {
	  name: String,
		outerError: {
			type: Boolean,
			default: false
		},
		outerErrorText: String,
		required: {
			type: Boolean,
			default: false
		},
		label: String,
		outerValue: String,
		placeholder: String,
		description: String,
		minLength: Number,
		maxLength: Number,

		disabled: {
			type: Boolean
		},

		componentKey: String,
	  v: {
			type: Object
	  }
	},
	data() {
	  return {
			value: '',
			blur: true,
			localError: this.outerError,
			localErrorText: this.outerErrorText,
	  }
	},
	computed: {
	},
	watch: {
		disabled() {
			this.activeStatusChange()
			this.value = ''
			this.$emit("input", this.value)
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
		if (!this.$is_empty(this.outerValue)) {
			this.value = this.outerValue
		}
	},
	mounted() {
		
	},
	methods: {
		input() {
			this.localError = false
			this.localErrorText = ''

			this.v.$model = this.value
			this.$emit("input", this.value)
		},
		activeStatusChange() {
			this.$emit('activeStatusChange', this.componentKey || this.name, this.disabled)
		}
	}
  }
</script>