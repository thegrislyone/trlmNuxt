<template>
  <div class="registration-page">

    <h1>Регистрация</h1>
	
    <div class="main-container">
      
      <div class="main-content">

        <!-- Form -->
        <div v-if="formData !== null" class="registration-form">

          <div
            v-if="registrationErrors.length"
            class="message message_error"
          >
            <ul>
              <li
                v-for="(error, index) in registrationErrors"
                :key="index"
              >
                {{ error.title[0] }}
              </li>
            </ul>
          </div>

          <div
            v-if="successMessage.length"
            class="message message_succsess"
          >
            {{ successMessage }}
          </div>

          <form class="form" @submit.prevent="onSubmit">

            <!-- wholesale -->
            <div
              v-if="wholesaleCheckbox !== null"
              class="form-group registration-form__wholesale"
            >
              <input
                type="checkbox"
                id="isWholesale"
                v-model="isWholesale"
              >
              <label class="form__label" for="isWholesale">{{ wholesaleCheckbox.label }}</label>
              <div class="form__message">
                {{ wholesaleCheckbox.description }}
              </div>
            </div>

            <form-group
              v-for="(value, name) in mainFields"
              :key="name"
              :name="name"
              :form-group="value"
              :v="$v.registrationForm.main[name]"
              v-model.trim="$v.registrationForm.main[name].$model"
              @setSmsCode="setSmsCode"
            ></form-group>

            <transition name="fader" mode="out-in">
              <div
                v-if="!isWholesale"
                class="form__additional"
                key="retail"
              >

                <h3>Пункт выдачи</h3>

                <form-group
                  v-if="cityField !== null"
                  :name="'city_id'"
                  :form-group="cityField"
                  :v="$v.registrationForm.for_retail.city_id"
                  v-model.trim="$v.registrationForm.for_retail.city_id.$model"
                ></form-group>
                <form-group
                  v-if="pickpointField !== null"
                  :name="'pick_point_id'"
                  :form-group="pickpointField"
                  :v="$v.registrationForm.for_retail.pick_point_id"
                  v-model.trim="$v.registrationForm.for_retail.pick_point_id.$model"
                ></form-group>

              </div>
              <div
                v-else
                class="form__additional"
                key="wholesale"
              >

                <h3>Адрес доставки</h3>

                <form-group
                  :name="'city_text'"
                  :form-group="wholesaleFields.city_text"
                  :v="$v.registrationForm.for_wholesale.city_text"
                  v-model.trim="$v.registrationForm.for_wholesale.city_text.$model"
                ></form-group>

                <div class="form-group form-group-address">

                  <div class="form__label">
                    Адрес <span>(обязательное)</span>
                  </div>

                  <div class="form-group-address__container">

                    <form-group
                      :name="'street_text'"
                      :form-group="wholesaleFields.street_text"
                      :v="$v.registrationForm.for_wholesale.street_text"
                      v-model.trim="$v.registrationForm.for_wholesale.street_text.$model"
                      :input-only="true"
                    ></form-group>
                    <form-group
                      :name="'house_text'"
                      :form-group="wholesaleFields.house_text"
                      :v="$v.registrationForm.for_wholesale.house_text"
                      v-model.trim="$v.registrationForm.for_wholesale.house_text.$model"
                      :input-only="true"
                    ></form-group>
                  
                  </div>

                  <div
                    class="form__message form__message_error"
                    v-if="
                      $v.registrationForm.for_wholesale.street_text.$error ||
                      $v.registrationForm.for_wholesale.house_text.$error ||
                      wholesaleFields.street_text.error_text ||
                      wholesaleFields.house_text.error_text
                    "
                  >

                    <template
                      v-if="
                        $v.registrationForm.for_wholesale.street_text.$params.required &&
                        !$v.registrationForm.for_wholesale.street_text.required ||
                        $v.registrationForm.for_wholesale.house_text.$params.required &&
                        !$v.registrationForm.for_wholesale.house_text.required
                      "
                    >
                      Обязательно для заполнения
                    </template>
                    <template v-if="wholesaleFields.street_text.error_text">{{ wholesaleFields.street_text.error_text }}</template>
                    <template v-if="wholesaleFields.house_text.error_text">{{ wholesaleFields.house_text.error_text }}</template>
                  
                  </div>

                </div>

              </div>
            
            </transition>

            <!-- send -->
            <div class="registration-form__btn-group">
              <div class="form__agreement">
                Нажимая кнопку «Зарегистрировать аккаунт», <a href="#">я соглашаюсь на обработку персональных данных</a> в соответствии с <a href="#">политикой конфиденциальности</a>
              </div>
              <button
                class="registration-form__btn btn"
                type="submit"
              >
                <div
                  v-if="registrationLoading"
                  class="button-preloader"
                >
                  <div class="preloader-btn preloader-btn_white"></div>
                </div>
                <template v-else>Зарегистрировать аккаунт</template>
              </button>
            </div>
            

          </form>

        </div>
        <!-- /Form -->
        
      </div>

    </div>

  </div>
</template>

<script>

  import { required, email, sameAs, minLength } from 'vuelidate/lib/validators'
  import FormGroup from '../components/FormGroup.vue'

  export default {
    components: {
      FormGroup
    },
    data() {
      return {
        formData: null,
        mainFields: {},
        retailFields: {},
        wholesaleFields: {},
        requiredClass: true,
        registrationForm: {},
        defaultForm: {},
        registrationErrors: [],
        registrationLoading: true,
        isWholesale: false,
        wholesaleCheckbox: null,
        successMessage: '',
        smsCode: ''
      }
    },
    validations() {
      if ( this.formData !== null ) {

        let result = {}
        let validators = {}

        for (let key in this.formData) {

          const group = key

          validators[group] = {}

          for (let key in this.formData[group]) {

            validators[group][key] = this.formData[group][key]

          }
          
        }

        for (let key in validators) {

          const group = key

          result[group] = {}

          this.$set(this.defaultForm, group, {})

          for (let key in validators[group]) {

            result[group][key] = {}

            if (key === 'pick_point_id' || key === 'city_id') {
              this.$set(this.defaultForm[group], key, '')
            } else if (validators[group][key].type === 'select') {

              const selected = validators[group][key].value.find(item => item.selected === 'selected')
              if (selected) {
                this.$set(this.defaultForm[group], key, selected)
              } else {
                this.$set(this.defaultForm[group], key, '')
              }

            } else {

              this.$set(this.defaultForm[group], key, '')

            }

            if (validators[group][key].required === 'required') {
              result[group][key].required = required
            }

            if (validators[group][key].min > 0 || validators[group][key].type === 'phone') {
              const minLengthValue = (validators[group][key].type === 'phone') ? 10 : validators[group][key].min
              result[group][key].minLength = minLength(minLengthValue)
            }

            if (validators[group][key].type === 'phone' && validators[group][key].is_sms_valid) {
              result[group][key].smsCode = () => !!this.smsCode.length
            }

            if (validators[group][key].type === 'email') {
              result[group][key].email = email
            }

            if (key === 'password_confirmation') {
              result[group][key].sameAsPassword = sameAs('password')
            }

          }

        }

        this.registrationForm = Object.assign({}, this.registrationForm, this.defaultForm)

        result.retailerGroup = [
          'registrationForm.main',
          'registrationForm.for_retail'
        ]

        result.wholesaleGroup = [
          'registrationForm.main',
          'registrationForm.for_wholesale'
        ]

        return {
          registrationForm : result
        }

      }
    },
    computed: {
      pickpointField() {

        let field = null
        const cities = this.$root.cities
        const cityId = this.registrationForm.for_retail.city_id.id

        if (this.formData !== null && cities.length && 'pickPoints' in cities[0]) {
          const targetCity = cities.find(item => item.id === cityId)
          field = this.retailFields.pick_point_id
          field.value = targetCity.pickPoints.map(item => item.attributes)
          this.defaultForm.for_retail.pick_point_id = field.value[0]
          this.registrationForm.for_retail.pick_point_id = field.value[0]
        }
        
        return field
      },
      cityField() {

        let field = null
        const cities = this.$root.cities

        if (this.formData !== null && cities.length) {
          field = this.retailFields.city_id
          field.value = cities.map(item => item.attributes)
          this.defaultForm.for_retail.city_id = field.value[0]
          this.registrationForm.for_retail.city_id = field.value[0]
        }
        
        return field
      }
    },
    methods: {

      clearErrors(object) {

        for (let key in object) {

          object[key].error_text = ''

        }

      },

      setSmsCode(code) {
        this.smsCode = code
      },
 
      onSubmit() {

        console.log('submit', this.registrationForm)

        if (this.registrationLoading) {
          return
        }

        this.registrationLoading = true
        this.registrationErrors = []
        this.successMessage = ''
        this.clearErrors(this.mainFields)
        this.clearErrors(this.retailFields)
        this.clearErrors(this.wholesaleFields)

        this.$v.registrationForm.$touch()

        if (this.isWholesale) {
          if (this.$v.registrationForm.wholesaleGroup.$invalid) {
            this.registrationLoading = false
            return
          }
        } else {
          if (this.$v.registrationForm.retailerGroup.$invalid) {
            this.registrationLoading = false
            return
          }
        }

        let request = {}

        const values = Object.values(this.registrationForm)

        values.forEach(element => {
          for (let key in element) {
            if (key !== 'type') {
              if (key === 'phone') {
                request[key] = '+7' +  element[key]
              } else if ( typeof element[key] === 'object' && 'id' in element[key] ) {
                request[key] = element[key].id
              } else {
                request[key] = element[key]
              }
            } else {
              request[key] = this.isWholesale
            }
          }
        })

        request.code = this.smsCode

        console.log('request', request)

        this.$axios.post('https://general.dbtrlm.ru/api/auth/register'/*api/auth/register*/, request)
          .then(response => {

            const data = response.data

            console.log('registration', data)

            if (data.errors) {

              this.registrationErrors = data.errors

              this.mainFields = Object.assign({}, this.mainFields, data.form.main)
              this.retailFields =  Object.assign({}, this.retailFields, data.form.for_retail)
              this.wholesaleFields = Object.assign({}, this.wholesaleFields, data.form.for_wholesale)

            } else {

              this.$v.$reset()
              this.registrationForm = Object.assign({}, this.registrationForm, this.defaultForm)
              this.successMessage = data.success

            }

            $('html, body').animate({
              scrollTop: $('.content').offset().top
            }, 400)

            this.registrationLoading = false
          })
          .catch(error => {

            const responseText = error.response.request.responseText

            this.registrationErrors.push(responseText)
            this.registrationLoading = false
          })

      }
    },
    created () {
      
      this.$axios.get('https://general.dbtrlm.ru/api/auth/register-form'/*/api/auth/register-form*/)
        .then(response => {

          const data = response.data

          console.log('registration', data)

          this.formData = data.form

          this.wholesaleCheckbox = data.form.main.type

          this.mainFields = Object.assign({}, this.mainFields, data.form.main)
          this.retailFields =  Object.assign({}, this.retailFields, data.form.for_retail)
          this.wholesaleFields = Object.assign({}, this.wholesaleFields, data.form.for_wholesale)

          this.registrationLoading = false
        })
      
    },
  }
</script>