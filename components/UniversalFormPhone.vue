<template>
  <div 
    class="un-form-phone"
    :class="{
      'un-form__disabled-field': disabled
    }"
  >
    <div class="un-form-phone__field">
      <div class="form__label">
        {{ label }}
        <span v-if="required">(обязательное)</span>
      </div>
      <the-mask
        class="form__input"
        :class="{
          'form__input_required' : required,
          'form__input_error' : (v.$error && !disabled && ((v.minLength === undefined || v.minLength) || (v.minLength == false && blur))) || error
        }"
        type="text"
        :name="name"
        :disabled="disabled"
        v-model="model"
        @input="outerErrorSetFalse"
        @focus.native="blur = false"
        @blur.native="blur = true"
        mask="+7 (###) ###-##-##"
        :placeholder="placeholder || '+7 (___) ___-__-__'"
      ></the-mask> 
      <div class="form__message">
        {{ description }}
      </div>
    </div>

    <div v-if="v.$error && v.$dirty" class="form__message_error">
			<span v-if="v.required == false && v.$dirty && !disabled">
				Данное поле обязательно для заполнения
			</span>
      <span v-else-if="!v.minLength && !disabled && blur">
        Минимальная длина поля 11 символов
      </span>
    </div>

    <div v-if="localErrorText" class="form__message_error">
      <span>
        {{ localErrorText }}
      </span>
    </div>

    <div
      v-if="isSmsValid && v.minLength"
      class="sms-verification"
    >
      <div
        v-if="smsLoading"
        class="loading loading_centered"
      >
        <div class="preloader-btn"></div>
      </div>
      <div
        v-if="activeStep === 1"
        class="sms-verification__step-1"
      >
        <span class="sms-verification__info row">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 0C4.486 0 0 4.486 0 10C0 15.514 4.486 20 10 20C15.514 20 20 15.514 20 10C20 4.486 15.514 0 10 0ZM10 18C5.589 18 2 14.411 2 10C2 5.589 5.589 2 10 2C14.411 2 18 5.589 18 10C18 14.411 14.411 18 10 18Z" />
            <path d="M9 9H11V15H9V9ZM9 5H11V7H9V5Z" />
          </svg>
          Необходимо подтвердить телефон
        </span>
        <button
          class="sms-verification__send"
          type="button"
          @click="codeRequest"
        >
          Отправить СМС
        </button>
      </div>
      <div
        v-if="activeStep === 2"
        class="sms-verification__step-2"
      >
        <div class="sms-verification__form row">
          <input
            class="sms-verification__input"
            :class="{ 'form__input_error' : !$is_empty(smsErrors) && smsErrors.length }"
            type="text"
            name="sms"
            placeholder="Код из смс"
            v-model.trim="smsInput"
          >
          <button
            class="btn"
            type="button"
            @click="smsFormSubmit"
          >
            Подтвердить
          </button>
        </div>
        <button
          v-if="smsSendTime <= 2"
          class="sms-verification__send"
          :disabled="smsCountDown > 0"
          type="button"
          @click="codeRequest"
        >
          <template v-if="smsCountDown > 0">Отправить ещё раз (через {{ smsCountDown }} сек)</template>
          <template v-else>Отправить СМС</template>
        </button>
        
        <div v-if="smsSendTime > 2" class="form__message">
          Если СМС так и не пришла, позвоните на номер 8 800 550 12 83 с номера <nobr>{{ phoneFormat(model) }}</nobr>, менеджер продиктует Вам код
        </div>

      </div>

      <div
        class="form__message form__message_error"
        v-for="(error, index) in smsErrors"
        :key="index"
      >
        {{ error.title }}
      </div>

      <div
        class="form__message form__message_success"
        v-if="smsSuccess"
      >
        {{ smsSuccess }}
      </div>
      
    </div>
      

  </div>
</template>

<script>
import { required, minLength, maxLength } from 'vuelidate/lib/validators'

  export default {
    components: {
    },
    props: {
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

      isSmsValid: {
        type: Boolean,
        default: false
      },
      smsUrl: String,

      disabled: {
        type: Boolean
      },

      validation: {
        type: Object
      }
    },
    data() {
      return {
        inputFlag: false,
        val: "",
        blur: true,
        v: {},
        model: "",
        error: this.outerError,
        localErrorText: this.errorText,
        model: "",
        activeStep: 1,
        smsTimer: null,
        smsInput: '',
        smsCountDown: 0,
        smsSendTime: 1,
        smsErrors: [],
        smsSuccess: '',
        smsLoading: false
      }
    },
    validations() {
      
		if (this.$is_empty(this.validation)) {

			let obj = {}

			if (this.required == 'required' || this.required == true) {
				obj.required = required
      }
      
      if (!this.$is_empty(this.minLength)) {
        obj.minLength = minLength(this.minLength)
      }

      if (!this.$is_empty(this.maxLength)) {
        obj.maxLength = maxLength(this.maxLength)
      }

			return {
				val: obj
			}
			
		}

	},
    computed: {
    },
    watch: {
      model() {
        this.v.$model = this.model
        this.$emit('input', (this.model && '+7' + this.model))
      },
      disabled() {
        this.activeStatusChange()
        this.model = ''
        this.$emit('input', '')
      },
      outerError() {
        this.error = this.outerError
      },
      errorText() {
        this.localErrorText = this.errorText
      }
    },
    created() {

      this.activeStatusChange()

      this.v = (this.$is_empty(this.validation)) ? this.$v.val : this.validation

      if (!this.$is_empty(this.value)) {
        this.model = this.value
      }
    },
    mounted() {
    },
    methods: {
      outerErrorSetFalse() {
        if ((this.error || this.localErrorText) && this.inputFlag) {
          this.error = false
          this.localErrorText = ''
        } else if (!this.inputFlag) {
          this.inputFlag = true
        }
      },
      codeRequest() {
        this.smsLoading = true

        this.smsErrors = []

        let url_string = window.location.origin
        url_string += this.smsUrl + ((this.smsUrl[this.smsUrl.length - 1] == '/') ? 'create' : '/create')

        let request = new URL(url_string)
        request.searchParams.set('phone', `+7${this.model}`)

        this.$axios.get(request)
          .then(response => {
            const data = response.data

            if (data.errors) {

              this.smsErrors = data.errors

            } else {

              this.activeStep = 2
              this.smsSendTime++
              this.smsCountDown = 30

              this.smsTimer = setInterval( () => { 
                this.smsCountDown--
                if (this.smsCountDown == 0) {
                  clearInterval(this.smsTimer)
                }
              }, 1000)

            }

            this.smsLoading = false
          })
          .catch(error => {
            this.smsLoading = false
          })

      },
      smsFormSubmit() {
        this.smsLoading = true

        this.smsErrors = []

        let url_string = window.location.origin
        url_string += this.smsUrl + ((this.smsUrl[this.smsUrl.length - 1] == '/') ? 'has' : '/has')
        let request = new URL(url_string)
        request.searchParams.set('phone', `+7${this.model}`)
        request.searchParams.set('code', this.smsInput)

        this.$axios.get(request)
          .then(response => {
            const data = response.data

            if (data.errors) {
              this.smsErrors = data.errors
            } else {
              this.smsSuccess = data.success
              this.activeStep = 0
              this.acceptedPhone = this.model
              this.$emit('setSmsCode', this.smsInput)
            }

            this.smsLoading = false
          })
          .catch(error => {
            this.smsLoading = false
          })
        
      },
      activeStatusChange() {
        this.$emit('activeStatusChange', this.name, this.disabled)
      }
    }
  }
</script>