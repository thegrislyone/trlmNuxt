<template>
  <div class="autocomplete">
    <div class="form__label">
        {{ name }}
        <span v-if="required">(обязательное)</span>
    </div>
    <div class="autocomplete__short">
        <input 
          type="text"
          :name="fieldName"
          class="autocomplete__input" 
          v-model="search"
          :class="{
            'form__input_required': required,
            'autocomplete__input_opened': list.length
          }"
        >
    </div>
    <div 
      v-if="list.length"
      class="autocomplete__list"
    >
      <div 
        v-for="(item,index) in list"
        :key="index"
        class="autocomplete__list-item"
        @click="choose(index)"
      >
        {{item.name}}
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from 'vue-debounce'

  export default {
    components: {
        
    },
    props: {
      name: {
        type: String,
        required: true
      },
      required: {
        type: Boolean,
        default: false
      },
      orderNumber: {
        type: Number,
        required: false
      },
      index: {
        type: String,
        required: false
      },
      fieldName: {
        type: String,
        required: false
      },
      api: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        value: "",
        search: "",
        searchName: "",
        previousSearch: "",
        list: [],
        debounceSearch: null
      }
    },
    computed: {
    },
    watch: {
      search() {
        if (this.search != this.searchName) {
          this.debounceSearch()
        }
        // if (!this.search || (this.previousSearch && this.search != this.previousSearch)) {
        //   this.value = ""
        //   this.$emit('autocompleteChange', this.orderNumber, this.value)
        // }
        this.value = this.search
        this.$emit('autocompleteChange', this.orderNumber, this.value)
      }
    },
    created() {
      this.debounceSearch = debounce(this.getList, 400)
    },
    mounted() {
    },
    methods: {
      getList() {
        let url = new URL(this.api)
        url.searchParams.set('search', this.search)

        if (!this.search) {
          this.list = []
        } else {
          this.$axios.get(url)
            .then(response => {
              const data = response.data

              this.list = data
            })
        }
      },
      choose(index) {
        this.value = this.list[index].name
        this.searchName = this.list[index].name
        this.search = this.list[index].name
        this.previousSearch = this.search
        
        this.list = []
        this.$emit('autocompleteChange', this.orderNumber, this.value)
      }
    }
  }
</script>