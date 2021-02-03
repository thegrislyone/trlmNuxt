<template>
  <div class="toolbar">
    <div class="toolbar__main">
      <!-- SEARCH -->
      <div
        v-if="search"
        class="toolbar__item toolbar__search"
        :class="{
          'toolbar__search_full-width': $is_empty(buttons),
          'toolbar__seach-mobile-open': mobileSearchShow && $root.windowWidth < 640
        }"
        @click="mobileToolOpen('search')"
      >
        <div class="toolbar__short-tools toolbar__search_short">
          <img src="/trlm/images/i-search_blue.svg" alt="" v-if="!mobileSearchShow">
          <img src="/trlm/images/i-close_blue.svg" alt="" v-else>
        </div>
        <div class="toolbar__full-tools toolbar__search_full">
            <input 
              type="text" 
              name=""
              placeholder="Поиск" 
              class="search__input"
              v-model="currentSearch"
            >
        </div>
      </div>
      <!-- FILTER -->
      <div 
        v-if="!$is_empty(filters)"
        class="toolbar__item toolbar__filter"
        :class="{
          'toolbar__filter_single': !add && !search,
          'toolbar__filter_no-search': !search,
          'toolbar__filter-mobile-open': mobileFilterShow && $root.windowWidth < 640
        }"
      >
        <div 
          class="toolbar__short-tools toolbar__filter_short"
          @click="mobileToolOpen('filter')"
        >
          <img src="/trlm/images/i-filter_blue.svg" alt="" v-if="!mobileFilterShow">
          <img src="/trlm/images/i-close_blue.svg" alt="" v-else>
          <span 
            v-if="!add && !search"
            class="toolbar__short-headline"
          >Фильтр</span>
        </div>
        <div class="toolbar__full-tools toolbar__filter_full">
          <h3 class="toolbar__filter-headline">
            <span>Фильтр</span>
          </h3>
          <div class="toolbar__filters_wrapper">
            <div 
              v-for="(filter,index) in filters"
              :key="index"
              class="toolbar__filter-item"
            >
              <personal-multiselect
                v-if="filter.type == 'multiselect'"
                :ref="filter.key"

                :select="filter.select"
                :values="filter.values"

                :api_url="filter.api_url"

                :label="filter.label"
                :componentKey="filter.key"
                :placeholder="filter.placeholder"

                :updateComponent="filter.update_component"
                :updateUrl="filter.update_url"
                
                @multiselectAdd="multiselectAdd"
                @multiselectRemove="multiselectRemove"
                @updateBoundedSelect="updateBoundedSelect"
              />
              <personal-date
                v-if="filter.type == 'date'"
                :componentKey="filter.key"
                :label="filter.label"
                :min="filter.min"
                :max="filter.max"
                @chooseDate="chooseDate"
              />
              <personal-number
                v-if="filter.type == 'number'"
                :label="filter.label"
                :componentKey="filter.key"
                :outerMin="filter.min"
                :outerMax="filter.max"
                @rangeChange="rangeChange"
              />
              <personal-text
                v-if="filter.type == 'text'"
                :componentKey="filter.key"
                :label="filter.label"
                :autocompleteKey="filter.key"
                :placeholder="filter.placeholder"
                :value="filter.value"
                :api_url="filter.api_url"

                @textFieldChange="textFieldChange"
              />
                
            </div>
            <div class="toolbar__fltr-btn-block">
              <button class="toolbar__fltr-btn btn" @click="filter">Фильтровать</button>
            </div>
          </div>
        </div>
      </div>
      <!-- BUTTONS -->

      <div
        v-if="!$is_empty(buttons)"
        class="toolbar__buttons"
        :class="{
          'toolbar__buttons_no-padding': $root.windowWidth < 640 || !search
        }"
      >
        <div 
          v-for="(button, index) in buttons"
          :key="index"
          class="toolbar__button-wrapper"
          :class="{
            'toolbar__button-wrapper_no-search': !search
          }"
        >
          <div
            v-if="$root.windowWidth < 640 && button.icon"
            class="toolbar__button-short btn"
            v-tooltip="button.caption"
            :class="[button.class, (!$is_empty(buttons[index + 1])) ? 'toolbar__button_margin' : '']"
            @click="buttonClick(button)"
          >
            <img :src="button.icon">
          </div>
          <div 
            v-else
            class="toolbar__button btn"
            :class="[button.class, (!$is_empty(buttons[index + 1])) ? 'toolbar__button_margin' : '', (!$is_empty(button.icon)) ? 'toolbar__button-signature_icon' : '']"
            :style="{
              backgroundImage: (button.icon) ? `url(${button.icon})` : '',
              backgroundRepeat: (button.icon) ? 'no-repeat' : '',
              backgroundPosition: (button.icon) ? '5px' : ''
            }"
            @click="buttonClick(button)"
          >  
            <span>{{ button.caption }}</span>
          </div>
        </div> 
      </div>

      </div>

      <div class="toolbar__search-and-filter" v-if="$root.windowWidth < 640">
        <div class="toolbar__search-mobile" v-if="mobileSearchShow">
            <input 
              type="text" 
              name=""
              placeholder="Поиск" 
              class="search__input-mobile"
              v-model="currentSearch"
            >
        </div>
        <div class="toolbar__filter-mobile" v-if="mobileFilterShow">
          <h3>
            <span>Фильтр</span>
          </h3>
          <div class="toolbar__filters_wrapper toolbar__filter-mobile">
            <div 
              v-for="(filter,index) in filters"
              :key="index"
              class="toolbar__filter-item"
            >
              <personal-multiselect
                v-if="filter.type == 'multiselect'"
                :ref="filter.key"

                :select="filter.select"
                :values="filter.values"

                :api_url="filter.api_url"

                :updateComponent="filter.update_component"
                :updateUrl="filter.update_url"

                :label="filter.label"
                :componentKey="filter.key"
                :placeholder="filter.placeholder"
                
                @multiselectAdd="multiselectAdd"
                @multiselectRemove="multiselectRemove"
                @updateBoundedSelect="updateBoundedSelect"
              />
              <personal-date
                v-if="filter.type == 'date'"
                :componentKey="filter.key"
                :label="filter.label"
                :min="filter.min"
                :max="filter.max"
                @chooseDate="chooseDate"
              />
              <personal-number
                v-if="filter.type == 'number'"
                :label="filter.label"
                :componentKey="filter.key"
                :outerMin="filter.min"
                :outerMax="filter.max"
                @rangeChange="rangeChange"
              />
              <personal-text
                v-if="filter.type == 'text'"
                :componentKey="filter.key"
                :label="filter.label"
                :autocompleteKey="filter.key"
                :placeholder="filter.placeholder"
                :value="filter.value"
                :api_url="filter.api_url"

                @textFieldChange="textFieldChange"
              />
                
            </div>
            <div class="toolbar__fltr-btn-block">
              <button class="toolbar__fltr-btn btn" @click="filter">Фильтровать</button>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import PersonalMultiselect from './PersonalMultiselect.vue'
import PersonalAutocomplete from './PersonalAutocomplete.vue'
import PersonalText from './PersonalText.vue'
import PersonalDate from './PersonalDate.vue'
import PersonalNumber from './PersonalNumber.vue' 

  
  export default {
    components: {
      PersonalMultiselect,
      PersonalAutocomplete,
      PersonalText,
      PersonalDate,
      PersonalNumber,

    },
    props: {
      search: {
        type: Boolean,
        default: true
      },
      add: {
        type: Boolean,
        default: true
      },
      buttons: {
        type: Array,
      },
      getData: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        currentSearch: "",
        filterResults: {},

        toolOpen: false,
        mobileSearchShow: false,
        mobileFilterShow: false
      }
    },
    computed: {
      filters() {
        return this.getData.filter
      },
      filterData() {
        let arr = [],
            obj = {}

        for (let item of this.filters) {
          obj[item.key] = {}
          if (item.type == 'multiselect') {
            obj[item.key] = Object.assign({}, {
              type: item.type,
              choosen: []
            })
          } else if (item.type == 'number' || item.type == 'date') {
            obj[item.key] = Object.assign({}, {
              type: item.type,
              from: null,
              to: null
            })
          } else if (item.type == 'text') {
            obj[item.key] = Object.assign({}, {
              type: item.type,
              value: ""
            })
          }
        }

        return obj
      },
    },
    watch: {
      currentSearch() {
        this.$emit('searchUpdate', this.currentSearch)
      }
    },
    created() {
      this.filterResults = this.filterData
      this.addFormObj = this.addForm
    },
    mounted() {
    },
    methods: {
      updateBoundedSelect(valuesArray, triggeredName, boundedName, boundedUrl) {
        this.$refs[boundedName][0].bundedUpdate(valuesArray, triggeredName, boundedUrl)
      },
      mobileToolOpen(type) {
        this.toolOpen = true
        if (type == 'search') {
          this.mobileSearchShow = !this.mobileSearchShow
          this.mobileFilterShow = false
        } else if (type == 'filter') {
          this.mobileFilterShow = !this.mobileFilterShow
          this.mobileSearchShow = false
        }
        this.$emit('containerSizeChange')
      },
      filter() {
        this.$emit('filterUpdate', this.filterResults)
      },
      buttonClick(button) {
        this.$emit('buttonClick', button)
      },

      /**
       * $emit методы всех полей ввода фильтра
       * TODO: позже объединю их в один, наверное
      */ 

      multiselectAdd(key, value) {
        this.filterResults[key].choosen.push(value)
      },
      multiselectRemove(key, i) {
        this.filterResults[key].choosen.splice(i,1)
      },
      textFieldChange(key, value) {
        this.filterResults[key].value = value
      },
      rangeChange(type, key, value) {
        eval('this.filterResults[key].' + type + '= value')
      },
      chooseDate(key, firstDate, secondDate) {
        this.filterResults[key].from = firstDate
        this.filterResults[key].to = secondDate
      },
    }
  }
</script>