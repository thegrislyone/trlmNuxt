<template>
  <div class="date">
    <div class="form__label">
      {{ label }}
    </div>
    <div class="datepicker-trigger">
      <div
        type="text"
        class="date__short"
        @focus="openedDataPicker=true"
      >
      <span class="date__selected-date" id="datepicker-trigger">
        {{ firstDateChoosed }}
        <span
          v-if="firstDateChoosed && secondDateChoosed"
          class="date__dash"
        >–</span>
        {{ secondDateChoosed }}
      </span>
      
      </div>

      <AirbnbStyleDatepicker
        :trigger-element-id="'datepicker-trigger'"
        :mode="(form) ? ('single') : ('range')"
        :fullscreen-mobile="true"
        :date-one="firstDate"
        :mobile-header="label"
        :months-to-show="$root.windowWidth >= 1280 ? 2 : 1"
        :date-two="secondDate"
        
        :showShortcutsMenuTrigger="false"
        @date-one-selected="firstDateSelected"
        @date-two-selected="secondDateSelected"
        @apply="chooseDate"
        @closed="closeDate"
        @cancelled="clearDate"
      > 

      <template v-slot:close-icon>
        <img src="../static/images/i-close.svg" alt="">
      </template>

      <template v-slot:previous-month-icon>
        <img src="../static/images/i-previous.svg" alt="">
      </template>

      <template v-slot:next-month-icon>
        <img src="../static/images/i-next.svg" alt="">
      </template>

      </AirbnbStyleDatepicker>
    </div>
    

    
  </div>
</template>

<script>
  import format from 'date-fns/format'
  export default {
    components: {
    },
    props: {
      label: {
        type: String
      },
      componentKey: {
        type: String
      },
      min: {
        type: String
      },
      max: {
        type: String
      },

      form: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        dateFormat: 'D MMM',
        firstDate: '',
        secondDate: '',

        firstDateChoosed: '',
        secondDateChoosed: '',

        openedDataPicker: false
      }
    },
    watch: {
      
    },
    computed: {
    },
    created() {
    },
    mounted() {
    },
    methods: {
      firstDateSelected(value) {
        this.firstDate = value
        if (this.form) {
          this.$emit('chooseDate', this.componentKey, this.firstDate)
        }
      },
      secondDateSelected(value) {
        this.secondDate = value
      },
      chooseDate() {
        this.firstDateChoosed = this.firstDate
        this.secondDateChoosed = this.secondDate
        this.$emit('chooseDate', this.componentKey, this.firstDate, this.secondDate)
      },
      clearDate() {
        this.firstDateChoosed = ''
        this.secondDateChoosed = ''

        this.firstDate = ''
        this.secondDate = ''

        this.$emit('chooseDate', this.componentKey, this.firstDate, this.secondDate)
      },
      closeDate() {
        if (!this.firstDateChoosed && !this.secondDateChoosed) {
          this.firstDate = ''
          this.secondDate = ''
        }
      } 
    }
  }
</script>