<template>
  <div>
    <div class="personal__messages" v-if="error">
      <div
        class="message message_error"
      >
        Форма заполнена неверно
      </div>
    </div>
    <div class="un-form-buttons">
      <div class="un-form-buttons__left">
        <div
          v-for="(button,index) in data.left"
          :key="index" 
        >
          <div v-if="!$is_empty(button)">
            <button 
              class="btn"
              :class="button.class.split(' ')"
              type="button"
              :name="button.name"
              @click="click(button.method, button.action, button.url)"
            >
              <span v-if="!loadingBlock">{{ button.caption }} {{ button.value }}</span>
              <div v-else class="preloader-btn"></div>
            </button>
          </div>
          
        </div>
      </div>
      <div class="un-form-buttons__right">
        <div 
          v-for="(button,index) in data.right"
          :key="index"
        >
          <div v-if="!$is_empty(button)">
            <button 
              class="btn"
              :class="button.class.split(' ')"
              :style="(button.icon) && `background-image: url(${button.icon}); background-repeat: no-repeat; background-position: 10px; padding-left: 35px;`"
              type="button"
              :name="button.name"
              @click="click(button.method, button.action, button.url)"
            >
              
              <span v-if="!loadingBlock">{{ button.caption }} {{ button.value }}</span>
              <div v-else class="preloader-btn"></div>
            </button>
          </div>
          
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
      data: {
        type: Object,
        required: true
      },
      error: Boolean,
      postData: {
        type: Object,
      },
      loadingBlock: Boolean
    },
    data() {
      return {
          
      }
    },
    computed: {
    },
    watch: {
    },
    created() {
    },
    mounted() {
    },
    methods: {
      click(method, action, url) {
        if (this.loadingBlock) return
        this.$emit('buttonClick', method, action, url)
      }
    }
  }
</script>