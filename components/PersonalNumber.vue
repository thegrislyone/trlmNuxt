<template>
  <div class="number">
    <div class="form__label">{{ label || "Выберете диапазон" }}</div>
    <div class="number__block">
      <div class="number__short">
        <div class="number__limit_block">
          <span class="number__limit number__from">от</span>
          <input 
            type="number"
            class="number__limit_input"
            :placeholder="outerMin"
            v-model="min"
          >
        </div>
        <div class="number__limit_block">
          <span class="number__limit number__to">до</span>
          <input 
            type="number"
            class="number__limit_input"
            :placeholder="outerMax"
            v-model="max"
          >
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
      label: {
        type: String,
        required: false
      },
      componentKey: {
        type: String
      },
      index: {
        type: String,
        required: false
      },
      outerMin: {
        type: Number,
        default: -Infinity,
      },
      before: {
        type: Number,
      },
      after: {
        type: Number,
      },
      outerMax: {
        type: Number,
        default: Infinity,
      },
      form: {
        type: Boolean,
        default: false
      },
      required: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
      }
    },
    data() {
      return {
        min: null,
        max: null,
      }
    },
    computed: {
    },
    watch: {
      min() {
        if (this.min.length > 1 && this.min[0] == '0') {
          this.min = this.min.substring(1, this.min.length)
        }

        if (this.outerMin !== undefined && Number(this.min) < this.outerMin) {
          this.min = String(this.outerMin)
        }
        if ( 
          !this.$is_empty(this.min.split(".")) &&
          this.min.split(".").length > 1 &&
          this.min.split(".").pop().length > this.after 
        ) {
          this.min = Number(this.min).toFixed(this.after)
        }
        if (this.min != null && this.min != 'null')
        this.$emit('rangeChange', "from", this.componentKey, this.min)
      },
      max() {

        if (this.max.length > 1 && this.max[0] == '0') {
          this.max = this.max.substring(1, this.max.length)
        }

        if (this.outerMax !== undefined && Number(this.max) >= this.outerMax) {
          this.max = String(this.outerMax)
        }
        if ( 
          !this.$is_empty(this.max.split(".")) &&
          this.max.split(".").length > 1 &&
          this.max.split(".").pop().length > this.after 
        ) {
          this.max = Number(this.max).toFixed(this.after)
        }
        if (this.max != null && this.max != 'null')
        this.$emit('rangeChange', "to", this.componentKey, this.max)
      }
    },
    created() {
    },
    mounted() {
    },
    methods: {
    }
  }
</script>