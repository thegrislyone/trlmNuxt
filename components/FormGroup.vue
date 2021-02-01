<template>
  <div
    v-if="name !== 'type'"
    :class=" !inputOnly ? 'form-group' : 'form-group-address__group' "
  >

    <div
      v-if="
        !inputOnly &&
        formGroup.type !== 'checkbox' &&
        formGroup.type !== 'file'
      "
      class="form__label"
    >
      {{ formGroup.label }}
      <span v-if="formGroup.required === 'required'">(обязательное)</span>
    </div>

    <template
      v-if="
        formGroup.type === 'text' ||
        formGroup.type === 'email' ||
        formGroup.type === 'password'
      "
    >
      <input
        v-if="!v.$params.minLength"
        class="form__input"
        :class="{
          'form__input_required' : formGroup.required === 'required',
          'form__input_error' : v.$error || formGroup.error_text
        }"
        :type="formGroup.type"
        :name="name"
        v-model.trim="model"
        :placeholder="placeholder"
      >
      <div v-else class="input-with-length">
        <input
          class="form__input"
          :class="{
            'form__input_required' : requiredClass,
            'form__input_error' : v.$error || formGroup.error_text
          }"
          :type="formGroup.type" 
          :name="name"
          v-model.trim="model"
          @focus="requiredClass = false"
          @blur="requiredClass = true"
        >
        <div
          class="input-with-length__input-length"
          :class="{ 'input-with-length__input-length_error' : model.length < v.$params.minLength.min }"
        >
          {{ model.length }}/{{v.$params.minLength.min}}
        </div>
      </div>
    </template>

    <template v-else-if="formGroup.type === 'textarea'">
      <textarea
        class="form__input"
        :class="{
          'form__input_required' : formGroup.required === 'required',
          'form__input_error' : v.$error || formGroup.error_text
        }"
        :name="name"
        v-model.trim="model"
        :placeholder="placeholder"
      ></textarea>
    </template>
    
    <template v-else-if="formGroup.type === 'file'">
      <input
        :id="name"
        :type="formGroup.type"
        :name="name"
        accept="image/*"
        v-model.trim="model"
        @change="fileChange"
      >
      <label :for="name">
        <span>{{ fileLabel }}</span>
      </label>
    </template>

    <the-mask
      v-else-if="formGroup.type === 'phone'"
      class="form__input"
      :class="{
        'form__input_required' : formGroup.required === 'required',
        'form__input_error' : v.$error || formGroup.error_text
      }"
      type="text"
      :name="name"
      v-model.trim="model"
      mask="+7 (###) ###-##-##"
      placeholder="+7 (___) ___-__-__"
      @change.native="phoneChange"
    ></the-mask>

    <multiselect
      v-else-if="formGroup.type === 'select'"
      v-model="model"
      :class="{ 'error' : v.$error || formGroup.error_text }"
      :options="formGroup.value"
      :show-labels="false"
      :hide-selected="false"
      label="name"
      track-by="name"
      placeholder="Не выбран"
      :disabled="formGroup.value.length <= 1"
    >
      <span slot="noResult">Результатов не найдено</span>
      <span slot="placeholder">Выберите из списка</span>
    </multiselect>

    <template v-else-if="formGroup.type === 'checkbox'">
      <input
        type="checkbox"
        :id="name"
        v-model.trim="model"
      >
      <label class="form__label" :for="name">{{ formGroup.label }}</label>
    </template>

    <div v-if="formGroup.description && !inputOnly" class="form__message">
      {{ formGroup.description }}
    </div>

    <div
      v-if="formGroup.is_sms_valid && v.minLength && model.length"
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
            :class="{ 'form__input_error' : smsErrors.length }"
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
        {{ error.title[0] }}
      </div>

      <div
        class="form__message form__message_success"
        v-if="smsSuccess"
      >
        {{ smsSuccess }}
      </div>
      
    </div>
    
    <div
      class="form__message form__message_error"
      v-if="(v.$error || formGroup.error_text) && !inputOnly"
    >

      <template v-if="v.$params.required && !v.required">Данное поле обязательно для заполнения</template>
      
      <template
        v-if="v.$params.minLength && !v.minLength"
      >
        <template v-if="formGroup.type === 'phone'">Введите номер полностью</template>
        <template v-else-if="formGroup.type === 'password'">Пароль должен содержать как минимум {{ v.$params.minLength.min }} символов</template>
        <template v-else>Поле должно содержать как минимум {{ v.$params.minLength.min }} символов</template>
      </template>
      
      <template v-if="v.$params.email && !v.email">Неверный формат email</template>
      <template v-if="v.$params.sameAsPassword && !v.sameAsPassword">Пароли не совпадают</template>

      <template v-if="formGroup.error_text">{{ formGroup.error_text }}</template>
    
    </div>
  </div>
</template>

<script>
  
  import Multiselect from 'vue-multiselect'

  export default {
    props: {
      value: {
        
      },
      v: {
        type: Object,
        required: true
      },
      formGroup: {
        type: Object,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      inputOnly: {
        type: Boolean,
        default: false
      }
    },
    components: {
      Multiselect
    },
    data() {
      return {
        requiredClass: true,
        activeStep: 1,
        smsTimer: null,
        smsInput: '',
        smsCountDown: 0,
        smsSendTime: 1,
        smsErrors: [],
        smsSuccess: '',
        smsLoading: false,
        acceptedPhone: ''
      }
    },
    computed: {
      model: {
        get() {
          return this.value
        },
        set(value) {
          this.v.$touch()
          this.$emit('input', value)
        }
      },
      placeholder() {
        if (this.inputOnly) {
          return this.formGroup.label
        }
        return false
      },
      fileLabel() {
        let label = this.formGroup.label
        if (this.$parent.file && this.$parent.file.name) {
          label = this.$parent.file.name
        }
        return label
      }
    },
    methods: {
      codeRequest() {

        if (this.smsSendTime > 2) {
          return
        }

        this.smsLoading = true

        this.smsErrors = []
 
        let url_string = 'https://general.dbtrlm.ru'/*window.location.origin*/
        url_string += '/api/sms-code/create'
        let request = new URL(url_string)
        request.searchParams.set('phone', `+7${this.model}`)

        this.$axios.get(request)
          .then(response => {
            const data = response.data

            console.log('sms', data)

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
            console.log('sms error', error)

            this.smsLoading = false
          })
        
      },
      phoneFormat(phone) {
        return '+7 ' + phone.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '($1) $2-$3-$4')
      },
      smsFormSubmit() {

        this.smsLoading = true

        this.smsErrors = []

        let url_string = window.location.origin
        url_string += '/api/sms-code/has'
        let request = new URL(url_string)
        request.searchParams.set('phone', `+7${this.model}`)
        request.searchParams.set('code', this.smsInput)

        this.$axios.get(request)
          .then(response => {
            const data = response.data

            console.log('smsResponse', data)

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

            console.log('sms error', data)

            this.smsLoading = false

          })

      },
      phoneChange() {

        console.log('change')

        if (this.formGroup.is_sms_valid) {

          if (this.acceptedPhone) {

            if (this.v.$error) {
              this.model = this.acceptedPhone
            } else if (this.acceptedPhone !== this.model) {
              this.smsReset()
            }

          } else {
            this.smsReset()
          }

        }

      },
      smsReset() {
        this.smsErrors = []
        this.smsSuccess = ''
        this.sms = ''
        this.acceptedPhone = ''
        this.activeStep = 1
        this.smsSendTime = 1
        clearInterval(this.smsTimer)
      },
      fileChange(event) {
        this.$parent.file = event.target.files[0]
      }
    },
    created () {
    },
  }
</script>