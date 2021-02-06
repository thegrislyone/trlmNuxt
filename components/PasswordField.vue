<template>
  <div 
    class="password-field password-block"
    :class="{
      'un-form__disabled-field': disabled
    }"
  >
    
    <div class="form__label">
      {{ label }}
      <span v-if="required">(обязательное)</span>
    </div>

    <div class="main__password_block form__input">
      <input 
        :type="(show) ? 'text' : 'password'"
        :class="{ 
          'form__input_error': ((v.$error && !disabled && ((v.minLength === undefined || v.minLength) || (v.minLength == false && blur))) || localError) || (passwordChange && outerError)
        }"
        @input="input"
        @focus="blur = false"
        @blur="blur = true"
        class="main__password-field"
        :disabled="disabled"
        v-model="value"
      >
       <div 
          class="main__password-icon_wrapper" 
          :class="{
            'main__password-icon_show': iconShow,
            'main__password-icon_hide': !iconShow
          }"
          @mouseover="iconSwap"
          @mouseleave="iconSwap"
          @click="typeChange"
          v-tooltip="((show) ? 'Скрыть пароль' : 'Показать пароль')"
        ></div> 

    </div>

    <div class="form__message">
      {{ description }}
    </div>

     <div class="form__message_error" v-if="(v.$error && v.$dirty && !disabled) || localErrorText || (passwordChange && outerErrorText)">

      <span v-if="!v.required && !v.$model.length && v.$dirty">
        Данное поле обязательно для заполнения
      </span>

      <span v-if="v.minLength !== undefined && !v.minLength && blur">
        Пароль должен содержать как минимум {{ minLength }} символов
      </span>
      
      <span v-if="v.maxLength !== undefined && !v.maxLength">
        Пароль не может содержать более {{ maxLength }} символов
      </span>
      <div v-if="localErrorText || (passwordChange && outerErrorText)">
        <span>
          {{ (passwordChange) ? outerErrorText : localErrorText }}
        </span>
      </div>
      

    </div>

  </div>
</template>

<script>

import { required, sameAs, minLength, maxLength } from 'vuelidate/lib/validators'

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
      componentKey: String,

      disabled: {
        type: Boolean,
        default: false
      },

      passwordChange: {
        type: Boolean,
        default: false
      },

      data: Object,

      validation: {
        type: Object,
      },
    },
    data() {
      return {
        value: '',
        localError: this.outerError,
        localErrorText: this.outerErrorText,
        show: false,
        blur: true,

        v: {},

        iconShow: false
      }
    },
    validations() {
      
      if (this.$empty(this.validation)) {

        let obj = {}

        if (this.required == 'required') {
          obj.required = required
        }

        if (this.minLength) {
          obj.minLength = minLength(this.minLength)
        }

        if (this.maxLength) {
          obj.maxLength = maxLength(this.maxLength)
        }

        return {
          value: obj
        }
        
      }

    },
    computed: {

    },
    watch: {
      disabled() {
        this.activeStatusChange()
        this.value = ''
        this.$emit('input', this.componentKey, this.value)
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

      this.v = (this.$empty(this.validation)) ? this.$v.value : this.validation
      
      if (this.outerValue) {
        this.v.$model = this.outerValue
        this.value = this.outerValue

        this.$emit('input', this.componentKey, this.value)
      }
      
    },
    mounted() {
    },
    methods: {
      input() {
        this.localError = false
        this.localErrorText = ''

        this.v.$model = this.value
        this.$emit('input', this.componentKey, this.value)
      },
      typeChange() {
        if (!this.disabled) {
          this.show = !this.show
          this.iconShow = !this.iconShow
        }
      },
      iconSwap() {
        if (!this.disabled) {
          this.iconShow = !this.iconShow
        }
      },
      activeStatusChange() {
        this.$emit('activeStatusChange', this.componentKey || this.name, this.disabled)
      }
    }
  }
</script>