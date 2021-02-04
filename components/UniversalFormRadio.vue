<template>
  <div 
    class="un-form-radio"
  >
    <div 
      v-if="type == 'big'" 
      class="type-switcher" 
      :class="{
        'un-form-radio__buttons un-form-radio__columns_one': columns == 1
      }"
    >
      <div
        v-for="(type, name) in elements"
        :key="name"
        class="type-switcher-item"
        :class="{ 
          'active' : mainFormModel === type.value,
          'type-switcher-item_full-width': columns == 1,
          'un-form__disabled-field': disabled
         }"
        @click="change(type.value)"
      >
        <div class="type-switcher-item__heading row">
          <div class="type-switcher-item__name">{{ type.label }}</div>
          <div v-if="type.price" class="type-switcher-item__cost">{{ type.price }} ₽</div>
        </div>
        <div class="type-switcher-item__description">
          {{ type.description }}
        </div>
      </div>
    </div>

    <div 
      v-else
      class="un-form-radio__buttons un-form-radio__columns_one"
      :class="{
        'un-form-radio__columns_two': columns == 2
      }"
    >
      <div 
        v-for="(item,index) in elements"
        :key="index"
        class="un-form-radio__item"
      >
      <input 
        type="radio"
        :id="item.id || name + index"
        :name="name"
        :value="item.value"
        :v-model="item.checked"
        :checked="item.checked"
        :disabled="disabled"
        v-model="mainFormModel"
        @input="change($event.target.value)"
        class="un-form-radio__input"
      >

      <label 
        class="form__label" 
        :for="item.id || name + index"
      >{{ item.label }}</label>

      <div class="form__message">
        {{ item.description }}
      </div>

      </div>
    </div>

    <div 
      v-if="localErrorText || (v.$error)" 
      class="form__message_error"
      :class="{
        'un-form-radio__error-text': type == 'big'
      }"
    >

      <span v-if="v.$error">Данное поле обязательно для заполнения</span>

      <div>
        {{ localErrorText }}
      </div>
    </div>

    </div>
</template>

<script>
  export default {
    components: {
    },
    props: {

      data: Object,

      name: String,
      errorText: String,
      type: String,
      columns: Number,
      elements: Array,
      minCount: Number,
      maxCount: Number,

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

        mainFormModel: "",
        localErrorText: this.errorText,
      }
    },
    computed: {
    },
    watch: {
      errorText() {
        this.localErrorText = this.errorText
      },
      disabled() {
        this.activeStatusChange()
        if (this.disabled) {
          this.mainFormModel = ""
          this.$emit('input', '')
        }
      }
    },
    created() {
      this.activeStatusChange()
    },
    mounted() {
      let fit = true
      for (let radio of this.elements) {
        if (radio.checked) {
          fit = false
          this.change(radio.value)
        }
      }
      if (fit) {
        this.change(this.elements[0].value)
        if (this.type != 'big') {
          document.querySelector('.un-form-radio__input').checked = true
        }
       
      }
    },
    methods: {
      change(value) {
          if (!this.disabled) {
            if (this.localErrorText && this.inputFlag) {
              this.localErrorText = ''
            } else if (!this.inputFlag) {
              this.inputFlag = true
            }

            this.value = value
            this.mainFormModel = value
            this.$emit('input', value)
          }
      },
      activeStatusChange() {
        this.$emit('activeStatusChange', this.name, this.disabled)
      }
    }
  }
</script>