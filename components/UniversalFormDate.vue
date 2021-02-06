<template>
  <div 
    class="date"
    :class="{
      'un-form__disabled-field': disabled
    }"
  >
    <div class="form__label">
      {{ label }}
      <span v-if="required">(обязательное)</span>
    </div>
    <div class="datepicker-trigger">
      <div
        type="text"
        class="date__short"
        :class="{
          'data__error': localError || (v.$error && !disabled)
        }"
        @focus="openedDataPicker=true"
      >
        <span 
          class="date__selected-date"
          :class="{
            'date__selected-date_placeholder': !selectedDate
          }"
          :id="'datepicker_' + name"
        >
          {{ (selectedDate) ? selectedDate : placeholder }}
        </span>
        <!-- <span v-else class="date__placeholder">
          {{ placeholder }}
        </span> -->
      </div>

      <AirbnbStyleDatepicker
        v-if="!disabled"
        :trigger-element-id="'datepicker_' + name"
        :mode="'single'"
        :fullscreen-mobile="true"
        :date-one="date"
        
        :min-date="minDate"
        :endDate="maxDate"
        
        :mobile-header="label"
        :months-to-show="$root.windowWidth >= 1280 ? 2 : 1"
        
        :showShortcutsMenuTrigger="false"
        @date-one-selected="chooseDate"
      > 

      <template v-slot:close-icon>
        <img src="/trlm/images/i-close.svg" alt="">
      </template>

      <template v-slot:previous-month-icon>
        <img src="/trlm/images/i-previous.svg" alt="">
      </template>

      <template v-slot:next-month-icon>
        <img src="/trlm/images/i-next.svg" alt="">
      </template>

      </AirbnbStyleDatepicker>
    </div>

    <div v-if="!$is_empty(description)" class="form__message">
      {{ description }}
    </div>

    <div v-if="localErrorText || (!$is_empty(v) && v.$error && !disabled)" class="form__message_error">

      <span v-if="v.$error && !v.required && !disabled">
        Данное поле обязательно для заполнения
      </span>

      <div v-if="localErrorText">
        {{ localErrorText }}
      </div>

    </div>
    

    
  </div>
</template>

<script>
  import format from 'date-fns/format'
  export default {
    components: {
    },
    props: {
      name: String,
      error: Boolean,
      errorText: String,
      required: Boolean,
      label: String,
      value: String,
      placeholder: String,
      description: String,
      minDate: String,
      maxDate: String,

      disabled: {
        type: Boolean
      },

      v: {
        type: Object
      }
    },
    data() {
      return {
        dirty: false,

        date: '',
        
        localError: this.error,
        localErrorText: this.errorText,

        selectedDate: '',

        openedDataPicker: false
      }
    },
    watch: {
      disabled() {
        this.activeStatusChange()
        this.date = ''
        this.selectedDate = ''
        this.$emit('input', this.selectedDate)
      },
      error() {
        this.localError = this.error
      },
      errorText() {
        this.localErrorText = this.errorText
      }
    },
    computed: {
    },
    created() {

      this.activeStatusChange()
      
      if (!this.$is_empty(this.value)) {
        this.date = this.value
        this.selectedDate = this.value
        this.v.$model = this.date
      } else {
        this.dirty = true
      }
      
    },
    mounted() {
    },
    methods: {
      chooseDate(value) {
        this.date = value
        this.selectedDate = this.date

        if (this.dirty) {
          if (this.localError || this.localErrorText) {
            this.localError = false
            this.localErrorText = ''
          }
        } else {
          this.dirty = true
        }
        

        this.$emit('input', this.selectedDate)
      },
      activeStatusChange() {
        this.$emit('activeStatusChange', this.name, this.disabled)
      }
    }
  }
</script>