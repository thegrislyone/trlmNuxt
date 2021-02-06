<template>
  <div 
		class="un-form-email"
		:class="{
      'un-form__disabled-field': disabled
    }"
	>
	
	  <div>
			<div class="form__label">
				{{ label }}
				<span v-if="required">(обязательное)</span>
			</div>

			<input
				class="form__input"
				:class="{ 
					'form__input_required': required,
					'form__input_error' : (error && !disabled) || localError,

				}"
				:id="id"
				:placeholder="placeholder"
				:name="name"
				:disabled="disabled"
				v-model.trim="v.$model"
				@input="input"
				@focus="requiredClass = false"
				@blur="requiredClass = true"
    	> 

			<div class="form__message">
      	{{ description }}
    	</div>

		<div class="form__message_error" v-if="(error && v.$dirty && !disabled) || (localErrorText)">
      <div v-if="v.$error || v.$dirty">

        <span v-if="!v.required && !v.$model">
          Данное поле обязательно для заполнения
        </span>

				<span v-else-if="!v.email">
					Неверный формат email
				</span>

      </div>

      <div v-if="localErrorText" class="form__message_error">
        <span>
          {{ localErrorText }}
        </span>
      </div>
      
    </div>

	  </div>

  </div>
</template>

<script>
import { required, minLength, maxLength, email } from 'vuelidate/lib/validators'

  export default {
	components: {
	},
	props: {
		id: String,
		name: String,
		outerError: {
			type: Boolean,
			default: false
		},
		errorText: String,
		required: {
			type: Boolean,
			default: false
		},
		label: String,
		value: String,
		placeholder: String,
		description: String,

		min: Number,
		max: Number,

		disabled: {
			type: Boolean
		},
		
	  validation: {
			type: Object
	  }
	},
	data() {
	  return {
			model: "",
			localErrorText: this.errorText,
			localError: this.outerError
	  }
	},
	validations() {
      
		if (this.$is_empty(this.validation)) {

			let obj = {}

			if (this.required == 'required' || this.required == true) {
				obj.required = required
			}

			if (this.min) {
				obj.minLength = minLength(this.min)
			}

			if (this.max) {
				obj.maxLength = maxLength(this.max)
			}

			obj.email = email

			return {
				model: obj
			}
			
		}

	},
	computed: {
		error() {
			return this.v.$error
		}
	},
	watch: {
		disabled() {
			this.activeStatusChange()
			this.v.$model = ''
			this.$emit('input', this.v.$model)
		},
		outerError() {
			this.localError = this.outerError
		},
		errorText() {
			this.localErrorText = this.errorText
		}
	},
	created() {

		this.activeStatusChange()
		
		this.v = (this.$is_empty(this.validation)) ? this.$v.model : this.validation
		if (!this.$is_empty(this.value)) {
			this.v.$model = this.value
		}
	},
	mounted() {
	},
	methods: {
		input() {
			this.$emit('input', this.v.$model)

			this.localError = false
			this.localErrorText = ''
		},
		activeStatusChange() {
        this.$emit('activeStatusChange', this.name, this.disabled)
      }
	}
  }
</script>