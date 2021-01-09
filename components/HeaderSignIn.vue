<template>
  <div v-if="!isResetPassword && !$store.getters.isAuthorized" key="sign-in">
    <h2>Вход на сайт</h2>
    <div
      v-if="modalMessage"
      class="message"
    >
      {{ modalMessage }}
    </div>
    <div
      v-if="signInErrors.length"
      class="message message_error"
    >
      <ul>
        <li
          v-for="(error, index) in signInErrors"
          :key="index"
        >
          {{ error.title }}
        </li>
      </ul>
    </div>
    <form class="form" @submit.prevent="signIn">
      <transition name="fader" mode="out-in">
        <div v-if="isPhoneMethod" class="form-group" key="phone">
          <the-mask
            class="form__input"
            :class="{ 'form__input_error' : $v.signInForm.phone.$error || passwordResetErrors.length }"
            type="text"
            name="phone"
            placeholder="Телефон"
            v-model="$v.signInForm.phone.$model"
            mask="+7 (###) ###-##-##"
          ></the-mask>
          <div class="form__message form__message_error" v-if="$v.signInForm.phone.$error">
            <template v-if="!$v.signInForm.phone.required">Данное поле обязательно для заполнения</template>
          </div>
        </div>
        <div v-else class="form-group" key="email">
          <input
            class="form__input"
            :class="{ 'form__input_error' : $v.signInForm.email.$error }"
            type="email"
            name="email"
            placeholder="Email"
            v-model.trim="$v.signInForm.email.$model"
          >
          <div class="form__message form__message_error" v-if="$v.signInForm.email.$error">
            <template v-if="!$v.signInForm.email.required">Данное поле обязательно для заполнения</template>
            <template v-if="!$v.signInForm.email.email">Неверный формат email</template>
          </div>
        </div>
      </transition>
      <button
        class="sign-in-form__link link"
        type="button"
        @click="isPhoneMethod = !isPhoneMethod"
      >
        Использовать
        <template v-if="isPhoneMethod">
          e-mail
        </template>
        <template v-else>
          телефон
        </template>
      </button>

      <div class="form-group">
        <input
          class="form__input"
          :class="{ 'form__input_error' : $v.signInForm.password.$error }"
          type="password"
          placeholder="Пароль"
          v-model.trim="$v.signInForm.password.$model"
        >
        <div class="form__message form__message_error" v-if="$v.signInForm.password.$error">
          <template v-if="!$v.signInForm.password.required">Данное поле обязательно для заполнения</template>
        </div>
      </div>
      
      <button
        class="sign-in-form__link link"
        type="button"
        @click="isResetPassword = true"
      >
        Забыли пароль?
      </button>

      <button
        class="sign-in-form__btn btn"
        type="submit"
      >
        <div
          v-if="signInLoading"
          class="button-preloader"
        >
          <div class="preloader-btn preloader-btn_white"></div>
        </div>
        <template v-else>Войти</template>
      </button>
    </form>
    <n-link
      to="/registration"
      tag="button"
      class="sign-in-form__heavy-link link"
      @click.native="$modal.hide('sign-in')"
    >
      Регистрация
    </n-link>
  </div>
  <!-- authorized -->
  <div v-else-if="$store.getters.isAuthorized" key="authorized">
    <h2>Войти</h2>
    <p>Вы успешно авторизовались</p>
    <n-link
      to="/personal"
      class="sign-in-form__btn btn"
      tag="button"
      @click="personalRedirect"
    >
      В личный кабинет
    </n-link>
  </div>
  <!-- reset password -->
  <div v-else key="reset-password">
    <h2>Смена пароля</h2>
    <div
      v-if="passwordResetErrors.length"
      class="message message_error"
    >
      <ul>
        <li
          v-for="(error, index) in passwordResetErrors"
          :key="index"
        >
          {{ error.title }}
        </li>
      </ul>
    </div>
    <div
      v-else-if="passwordResetSuccess"
      class="message message_success"
      v-html="passwordResetSuccess"
    ></div>
    <p v-else>Ссылка на смену пароля будет отправлена на email, даже если Вы введёте номер, используемый для авторизации</p>
    <div class="form">
      <transition name="fader" mode="out-in">
        <div v-if="isPhoneMethod" class="form-group" key="phone">
          <the-mask
            class="form__input"
            :class="{ 'form__input_error' : $v.signInForm.phone.$error || passwordResetErrors.length }"
            type="text"
            name="phone"
            placeholder="Телефон"
            v-model="$v.signInForm.phone.$model"
            mask="+7 (###) ###-##-##"
          ></the-mask>
          <div class="form__message form__message_error" v-if="$v.signInForm.phone.$error">
            <template v-if="!$v.signInForm.phone.required">Данное поле обязательно для заполнения</template>
          </div>
        </div>
        <div v-else class="form-group" key="email">
          <input
            class="form__input"
            :class="{ 'form__input_error' : $v.signInForm.email.$error || passwordResetErrors.length }"
            type="email"
            name="email"
            placeholder="Email"
            v-model.trim="$v.signInForm.email.$model"
          >
          <div class="form__message form__message_error" v-if="$v.signInForm.email.$error">
            <template v-if="!$v.signInForm.email.required">Данное поле обязательно для заполнения</template>
            <template v-if="!$v.signInForm.email.email">Неверный формат email</template>
          </div>
        </div>
      </transition>
      <button
        class="sign-in-form__link link"
        type="button"
        @click="isPhoneMethod = !isPhoneMethod"
      >
        Использовать
        <template v-if="isPhoneMethod">
          e-mail
        </template>
        <template v-else>
          телефон
        </template>
      </button>

      <button
        class="sign-in-form__btn btn"
        type="button"
        @click="resetPassword"
      >
        <div
          v-if="signInLoading"
          class="button-preloader"
        >
          <div class="preloader-btn preloader-btn_white"></div>
        </div>
        <template v-else>Отправить письмо</template>
      </button>
    </div>
    <button
      class="sign-in-form__heavy-link link"
      type="button"
      @click="isResetPassword = false"
    >
      Вспомнил пароль
    </button>
  </div>
</template>

<script>

  import { required, email } from 'vuelidate/lib/validators'

  export default {
    props: {
      modalMessage: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        signInForm: {
          phone: '',
          email: '',
          password: ''
        },
        authorizationProcess: false,
        signInErrors: [],
        signInLoading: false,
        isPhoneMethod: true,
        isResetPassword: false,
        passwordResetErrors: [],
        passwordResetSuccess: '',
      }
    },
    validations: {
      signInForm : {
        phone: {
          required
        },
        password: {
          required
        },
        email: {
          required,
          email
        },
        phoneGroup: ['signInForm.phone', 'signInForm.password'],
        emailGroup: ['signInForm.email', 'signInForm.password']
      }
    },
    methods: {
      personalRedirect() {
        this.$router.push('/personal')
        this.$modal.hide('sign-in')
      },
      signIn() {

        if (this.signInLoading) {
          return
        }

        this.signInLoading = true
        this.signInErrors = []

        this.$v.signInForm.$touch()

        if (this.isPhoneMethod) {
          if (this.$v.signInForm.phoneGroup.$invalid) {
            this.signInLoading = false
            return
          }
        } else {
          if (this.$v.signInForm.emailGroup.$invalid) {
            this.signInLoading = false
            return
          }
        }

        let request = {
          "password" : this.signInForm.password
        }

        if (this.isPhoneMethod) {
          request.login = '+7' + this.signInForm.phone
        } else {
          request.login = this.signInForm.email
        }

        // $axios.$post('/api/auth/login', request)
        //   .then()

        // $.ajax({
        //   url: "/api/auth/login",
        //   method: "POST",
        //   dataType: 'json',
        //   data: request,
        //   success: (data) => {
            
        //     console.log('login', data)

        //     if (data.errors) {

        //       this.signInErrors = data.errors

        //     } else {

        //       this.$store.commit('setAuthorization', true)

        //       this.getCart()

        //       const pickPointData = data.data.relationships.pick_point.data
        //       this.pickpointUpdate(pickPointData)

        //       this.$metricGoal(data.data.attributes.role)

        //     }

        //     this.signInLoading = false

        //   },
        //   error: (data) => {
        //     this.signInErrors.push(data.responseText)
        //     this.signInLoading = false
        //   }
        // })
      },
      resetPassword() {

        if (this.signInLoading) {
          return
        }

        this.signInLoading = true
        this.passwordResetErrors = []
        this.passwordResetSuccess = ''

        this.$v.signInForm.$touch()

        if (this.isPhoneMethod) {
          if (this.$v.signInForm.phone.$invalid) {
            this.signInLoading = false
            return
          }
        } else {
          if (this.$v.signInForm.email.$invalid) {
            this.signInLoading = false
            return
          }
        }

        const request = {
          "login" : this.isPhoneMethod ? '+7' + this.signInForm.phone : this.signInForm.email
        }

        this.userPasswordReset(request)
      },
      userPasswordReset(data) {
        // $.ajax({
        //   url: "/api/auth/password-recovery-new",
        //   method: "GET",
        //   dataType: 'json',
        //   data: data,
        //   success: (data) => {
        //     if (data.success) {
        //       this.passwordResetSuccess = data.success
        //     } else if (data.errors) {
        //       this.passwordResetErrors = data.errors
        //     }
        //     this.signInLoading = false
        //   },
        //   error: (data) => {
        //     console.log(data)
        //     this.passwordResetErrors.push(data.responseText)
        //     this.signInLoading = false
        //   }
        // })
      },
    },
  }
</script>