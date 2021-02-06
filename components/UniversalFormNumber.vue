<template>
  <div 
    class="number"
    :class="{
      'un-form__disabled-field': disabled
    }"
  >
    <div class="form__label">
      {{ label }}
      <span v-if="required">(обязательное)</span>
    </div>
    <div class="number__block">
      <div 
        class="number__short"
        :class="{
          'number__error-field': localError || (v.$error && !disabled && ((v.minValue === undefined || v.minValue) || (v.minValue == false && blur)) && ((v.numberFormat === undefined || v.numberFormat) || ((v.numberFormat == false && blur) || !v.maxValue))),
        }"
      >
        <input 
          type="text"
          class="number__limit_input"
          :placeholder="placeholder"
          :name="name"
          :min="min"
          :max="max"
          :class="{
            'form__input_required': required,
          }"
          v-model="localValue"
          :disabled="disabled"
          @focus="blur = false"
          @blur="blurField"
          @input="input"
        >

      </div>

      <div v-if="!$is_empty(description)" class="form__message">
        {{ description }}
      </div>
        
      <div v-if="localErrorText || (!$is_empty(v) && v.$error && !disabled)" class="form__message_error">

        <span v-if="v.$error && !v.numberFormat && blur">
          Неправильный формат числа
        </span>

        <span v-else-if="v.$error && !v.required && !v.$model">
          Данное поле обязательно для заполнения
        </span>

        <span v-else-if="v.$error && v.minValue != undefined && !v.minValue && blur && !isNaN(Number(v.$model))">
          Нельзя указывать меньше {{ min }}
        </span>

        <span v-else-if="v.$error && v.maxValue != undefined && !v.maxValue && !isNaN(Number(v.$model))">
          Нельзя указывать больше {{ max }}
        </span>

        <div v-if="localErrorText">
          {{ localErrorText }}
        </div>
      
      </div>

    </div>
  </div>
</template>

<script>
   
  export default {
    components: {
    },
    props: {
      name: String,
      error: Boolean,
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
      before: Number,
      after: Number,

      disabled: {
        type: Boolean
      },

      v: {
        type: Object
      }
    },
    data() {
      return {
        inputFlag: false,
        blur: true,
        localValue: "",
        localError: this.error,
        localErrorText: this.errorText
      }
    },
    computed: {
      regularExpression() {
        return new RegExp("\-?\\\d{0," + ((this.before) ? this.before : "999") + "}(\\\.\\\d{0," + ((this.after) ? this.after : "999") + "})?")    
      }
    },
    watch: {
      disabled() {
        this.activeStatusChange()
        this.localValue = null
        this.input()
      },
      error() {
        this.localError = this.error
      },
      errorText() {
        this.localErrorText = this.errorText
      }
    },
    created() {
      this.activeStatusChange()
      this.localValue = this.value
    },
    mounted() {
    },
    methods: {
      input() {
        
        this.localValue = this.localValue.match(this.regularExpression)[0]

        if (this.localValue[0] == 0 && this.localValue[1] && this.localValue[1] != '.') {
          this.localValue = this.localValue.substring(1, this.localValue.length)
        }
        if (
          (this.localValue[0] == '-' && this.localValue[1] == '0' && (this.localValue[2] && Number.isInteger(Number(this.localValue[2])))) ||
          (this.localValue[0] == '.') ||
          (this.localValue[0] == '-' && this.localValue[1] == '.') 
        ) {
          this.localValue = this.localValue.substring(0, this.localValue.length - 1)
        }
        
        this.$emit('input', this.localValue)
      },
      activeStatusChange() {
        this.$emit('activeStatusChange', this.name, this.disabled)
      },
      blurField() {
        this.blur = true
      }
    }
  }
</script>