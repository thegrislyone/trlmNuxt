<template>
  <div 
    v-if="!hiddenField"
    class="personal-text"
    :class="{
      'un-form__disabled-field': disabled
    }"
    v-click-outside="hideList"
  >
    <div class="form__label">
        {{ label }}
        <span v-if="required">(обязательное)</span>
    </div>
    <div class="">
        <input 
          type="text"
          class="autocomplete__input" 
          v-model="value"
          :placeholder="placeholder"

          :disabled="disabled"

          @focus="showList"
          @blur="blur = true"
          @input="outerErrorSetFalse"
          :class="{
            'form__input_required': required,
            'form__input_error' : (error && !disabled && ((v.minLength === undefined || v.minLength) || (v.minLength == false && blur))) || localError,
            'personal-text_opened': isListShow && !$is_empty(list)
          }"
        >
    </div>
    <div 
      v-if="isListShow && !$is_empty(list)"
      class="autocomplete__list"
    >
      <div 
        v-for="(item,index) in list"
        :key="index"
        class="autocomplete__list-item"
        @click="choose(index)"
      >
        {{ item.caption }}
      </div>
    </div>

    <div v-if="!$is_empty(description)" class="form__message">
      {{ description }}
    </div>
    
    <div class="form__message_error" v-if="(error && v.$dirty && !disabled) || (localErrorText)">
      <div v-if="v.$error || v.$dirty">

        <span v-if="!v.required && !v.$model">
          Данное поле обязательно для заполнения
        </span>
        <span v-else-if="!$is_empty(v.$params.maxLength) && !v.maxLength">
          Максимальная длина поля {{ v.$params.maxLength.max }} символов
        </span>
        <span v-else-if="!$is_empty(v.$params.minLength) && !v.minLength && blur">
          Минимальная длина поля {{ v.$params.minLength.min }} символов
        </span>

      </div>

      <div v-if="localErrorText" class="form__message_error">
        <span>
          {{ localErrorText }}
        </span>
      </div>
      
    </div>

  </div>
  <div
    v-else
    class="personal-text"
  >
    <input 
      type="hidden"
      v-model="value"
    >
  </div>
</template>

<script>
  import { debounce } from 'vue-debounce'
  import { required, minLength, maxLength, email } from 'vuelidate/lib/validators'

  export default {
    components: {
    },
    props: {
      hidden: {
        type: Boolean,
        default: false
      },
      componentKey: {
        type: String
      },
      autocompleteKey: {
        type: String
      },

      label: {
        type: String
      },
      placeholder: {
        type: String
      },
      outerValue: {
        type: String
      },
      api_url: {
        type: String
      },

      required: {
        type: Boolean,
        default: false
      },
      
      outerError: {
        type: [Boolean, Number],
      },
      outerErrorText: {
        type: String
      },

      name: {
        type: String
      },

      description: {
        type: String
      },

      disabled: {
        type: Boolean
      },

      min: Number,
      max: Number,

      validation: {
        type: Object,
        required: false
      }
    },
    data() {
      return {
        isListShow: false,
        value: "",
        localError: this.outerError,
        localErrorText: this.outerErrorText,
        list: [],
        debounceSearch: "",
        choosed: false,
        v: Object,

        validationModel: "",

        blur: true,
        dirty: false
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

        return {
          validationModel: obj
        }
      }
    },
    computed: {
      hiddenField() {
        return (this.hidden === undefined || this.hidden === null) ? false : this.hidden
      },
      error() {
        return !this.$is_empty(this.v) ? this.v.$error : false
      },
      minLengthError() {
        if (!this.$is_empty(this.v) && this.v.minLength != undefined) {
          return (!this.v.minLength && blur)
        }
        return false
      }
    },
    watch: {
      value() {
        if (!this.choosed && !this.$is_empty(this.api_url)) {
          if (this.dirty) {
            this.debounceSearch()
          } else {
            this.dirty = true
          }
        } else {
          this.choosed = false
        }

        if (!this.$is_empty(this.v)) {
          this.validateInput(this.value)
        }
        
        this.$emit('textFieldChange', this.componentKey, this.value)
      },
      disabled() {
        this.activeStatusChange()
        this.value = ''
        this.$emit('textFieldChange', this.componentKey, this.value)
      },
      outerError() {
        this.localError = this.outerError
      },
      outerErrorText() {
        this.localErrorText = this.outerErrorText
      }
    },
    created() {

      this.v = (this.$is_empty(this.validation)) ? this.$v.validationModel : this.validation
      
      this.activeStatusChange()

      if (!this.$is_empty(this.outerValue)) {
        this.v.$touch()
        this.value = this.outerValue
      }

      if (!this.$is_empty(this.api_url)) {
        this.debounceSearch = debounce(this.getList, 400)
      }
      
    },
    mounted() {
    },
    methods: {
      outerErrorSetFalse() {
        if (this.localError || this.localErrorText) {
          this.localError = false
          this.localErrorText = ''
        }
      },
      getList() {
        
        let url = this.api_url + '?' + (this.autocompleteKey || this.name || 'search') + '=' + this.value
        
        if (!this.value) this.list = []

        else 
          $.ajax({
          url: url,
          method: "GET",
          dataType: "json",
          success: (data) => {
            this.list = data
            this.isListShow = true
          }
        })
      },
      choose(index) {

        this.isListShow = false
        this.value = this.list[index].caption
        
        this.list.splice(index, 1)

        this.choosed = true
        
        this.$emit('textFieldChange', this.componentKey, this.value)
      },
      hideList() {
        this.isListShow = false
      },
      showList() {
        this.blur = false
        if (!this.$is_empty(this.list)) {
          this.isListShow = true
        }
      },
      validateInput(value) {
        this.v.$model = value
      },
      activeStatusChange() {
        this.$emit('activeStatusChange', this.componentKey, this.disabled)
      }
    }
  }
</script>