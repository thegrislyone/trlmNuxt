<template>
  <div
    class="quantity-input"
    v-on="listeners"
  >
    <button
      class="quantity-input__btn quantity-input__btn_dec"
      type="button"
      tabindex="-1"
      :disabled="disabled || !decreasable"
      @click="decrease"
    >
      <template v-if="removable && (currentValue - min) <= 1">
        <img src="/trlm/images/i-close-small-red.svg" alt="">
      </template>
      <template v-else>
        −
      </template>
    </button>
    <button
      v-if="increasable"
      class="quantity-input__btn quantity-input__btn_inc"
      type="button"
      tabindex="-1"
      :disabled="disabled"
      @click="increase"
    >+</button>
    <div v-else v-tooltip="'В наличии только ' + max + ' ед.'">
      <button
        class="quantity-input__btn quantity-input__btn_inc"
        type="button"
        tabindex="-1"
        disabled
        @click="increase"
      >+</button>
    </div>
    <input
      ref="input"
      class="quantity-input__input"
      type="number"
      :name="name"
      :value="currentValue"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled || (!decreasable && !increasable)"
      autocomplete="off"
      @change="change"
      @paste="paste"
      @keydown.up.prevent="increase"
      @keydown.down.prevent="decrease"
      @focus="focus"
      @blur="blur"
    >
  </div>
</template>

<script>

const isNaN = Number.isNaN || window.isNaN
const REGEXP_NUMBER = /^-?(?:\d+|\d+\.\d+|\.\d+)(?:[eE][-+]?\d+)?$/
const REGEXP_DECIMALS = /\.\d*(?:0|9){10}\d*$/
const normalizeDecimalNumber = (value, times = 100000000000) => (
  REGEXP_DECIMALS.test(value) ? (Math.round(value * times) / times) : value
)

export default {
  model: {
    event: 'change',
  },
  props: {
    disabled: Boolean,
    removable: {
      type: Boolean,
      default: false,
    },
    max: {
      type: Number,
      default: Infinity,
    },
    min: {
      type: Number,
      default: -Infinity,
    },
    name: {
      type: String,
      default: undefined,
    },
    step: {
      type: Number,
      default: 1,
    },
    value: {
      type: Number,
      default: NaN,
    },
  },
  data() {
    return {
      currentValue: NaN
    }
  },
  computed: {
    increasable() {
      const num = this.currentValue
      return isNaN(num) || num < this.max
    },
    decreasable() {
      const num = this.currentValue
      return isNaN(num) || num > this.min
    },
    listeners() {
      const listeners = { ...this.$listeners }
      delete listeners.change
      return listeners
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(newValue, oldValue) {
        if (
          // Avoid triggering change event when created
          !(isNaN(newValue) && typeof oldValue === 'undefined')
          // Avoid infinite loop
          && newValue !== this.currentValue
        ) {
          this.setValue(newValue)
        }
      },
    },
  },
  methods: {

    change(event) {
      const value = this.roundInput(event.target.value)
      this.setValue(Math.min(this.max, Math.max(this.min, value)))
    },

    paste(event) {
      const clipboardData = event.clipboardData || window.clipboardData
      if (clipboardData && !REGEXP_NUMBER.test(clipboardData.getData('text'))) {
        event.preventDefault()
      }
    },

    decrease() {
      if (this.decreasable) {
        let { currentValue } = this
        if (isNaN(currentValue)) {
          currentValue = 0
        }

        let step = this.step

        if (currentValue > this.max) {
          step = this.max - Math.trunc(currentValue / this.step) * this.step
        }

        this.setValue(Math.min(this.max, Math.max(
          this.min,
          normalizeDecimalNumber(currentValue - step)
        )))
      }
    },

    increase() {
      if (this.increasable) {
        let { currentValue } = this
        if (isNaN(currentValue)) {
          currentValue = 0
        }
        this.setValue(Math.min(this.max, Math.max(
          this.min,
          normalizeDecimalNumber(currentValue + this.step)
        )))
      }
    },

    setValue(value) {
      const oldValue = this.currentValue
      let newValue = Math.round(value)

      newValue = Math.min(this.max, Math.max(this.min, newValue))

      this.currentValue = newValue
      if (newValue === oldValue) {
        // Force to override the number in the input box (#13).
        this.$refs.input.value = newValue
      }
      this.$emit('change', newValue, oldValue)
    },
    roundInput(num) {
      if (num >= this.max) {
        return this.max
      }
      return Math.round(num / this.step) * this.step
    },
    focus(event) {
      if ( !!('ontouchstart' in window) ) {
        event.target.value = ''
      }
    },
    blur(event) {
      if (!event.target.value.length) {
        event.target.value = this.currentValue
      }
    }
  }
}
</script>
        