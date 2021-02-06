<template>
  <div class="password-recovery-page">

    <h1>Смена пароля</h1>
	
    <div class="main-container">
      
      <div class="main-content password-recovery-page__content">

        <div class="password-recovery-page__text text" v-html="content"></div>

        <!-- Form -->
        <div v-if="code.length" class="password-recovery-form-container">

          <div
            v-if="formErrors.length"
            class="message message_error"
          >
            <ul>
              <li
                v-for="(error, index) in formErrors"
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

          <form class="form password-recovery-form" @submit.prevent="onSubmit">

            <form-group
              v-for="(value, name) in formFields"
              :key="name"
              :name="name"
              :class="value.class"
              :form-group="value"
              :v="$v.form[name]"
              v-model.trim="$v.form[name].$model"
            ></form-group>

            <button
              class="btn password-recovery-form__btn"
              type="submit"
            >
              <div
                v-if="formLoading"
                class="button-preloader"
              >
                <div class="preloader-btn preloader-btn_white"></div>
              </div>
              <template v-else>Сохранить пароль</template>
            </button>
          
          </form>

        </div>
        <!-- /Form -->
        
      </div>

    </div>

  </div>
</template>

<script>

  import { required, sameAs, minLength } from 'vuelidate/lib/validators'
  import FormGroup from '../components/FormGroup.vue'

  export default {
    components: {
      FormGroup
    },
    data() {
      return {
        pageLoading: false,
        content: '',
        code: '',
        formFields: {
          password: {
            class: "form-group_half",
            description: "",
            label: "Пароль",
            required: "required",
            type: "password",
            value: null
          },
          repeatPassword: {
            class: "form-group_half",
            description: "",
            label: "Пароль еще раз",
            required: "required",
            type: "password",
            value: null
          }
        },
        form: {
          password: '',
          repeatPassword: ''
        },
        formErrors: [],
        successMessage: '',
        formLoading: false
      }
    },
    validations: {
      form: {
        password: {
          required,
          minLength: minLength(6)
        },
        repeatPassword: {
          required,
          sameAsPassword: sameAs('password')
        }
      }
    },
    methods: {

      initPage(data) {
        this.content = data.message || ''
        this.code = data.code || ''
      },
 
      onSubmit() {

        if (this.formLoading) {
          return
        }

        this.formLoading = true
        this.formErrors = []
        this.successMessage = ''

        this.$v.form.$touch()

        if (this.$v.form.$invalid) {
          this.formLoading = false
          return
        }

        const request = {
          code: this.code,
          password: this.form.password,
          password_confirmation: this.form.repeatPassword
        }

        console.log('request', request)

        this.$axios.get("/auth/password-recovery-save")
          .then(response => {
            const data = response.data

            console.log('password-recovery', data)

            if (data.errors) {
              this.formErrors = data.errors
            } else {
              this.successMessage = data.success
            }

            this.formLoading = false

          })
          .catch(error => {
            this.formErrors.push(error)
            this.formLoading = false
          })

      }
    },
    mounted () {
      
      if ('json_page_data' in window && window.json_page_data !== null) {

        console.log('ssr', json_page_data)
        const pageData = window.json_page_data
        this.initPage(pageData)

      } else {

        this.pageLoading = true

        const url_string = window.location.href
        let request = new URL(url_string)
        request.searchParams.set('json', '')

        const $request = this.$axios.get(request)
          .then(response => {
            const data = response.data

            console.log('main-request', data)
            this.initPage(data.data)
            this.pageLoading = false

          })

      }
      
    },
  }
</script>$e