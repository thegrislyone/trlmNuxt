<template>
  <div
    v-if="$is_empty(getData.errors)"
    class="crud"
  >


    <modal
      name="universal-form"
      :classes="['modal','crud__add']"
      :adaptive="true"
      :height="'auto'"
      :scrollable="true"
      :max-width="600"
      :pivot-y="0"
    >
      <div>
         <universal-form
          :outsideData="formData"
          :isCloseIcon="true"
          @formClose="formClose"
          @formEnding="formEnding"
        ></universal-form>
      </div>    
    </modal>
    
    <errors-success-modal
      v-if="result"
      :success="success"
      :errors="errors"
      @dataRefresh="tableUpdate"
      @close="result = false"
    />

    

    <personalToolbar
      class="crud__toolbar"
      :getData="getData"
      :buttons="(!$is_empty(getData.buttons.top)) ? getData.buttons.top : []"
      :search="getData.search"
      @searchUpdate="searchUpdate"
      @filterUpdate="filterUpdate"
      @buttonClick="crudFunction"
      @containerSizeChange="containerSizeChange"
    />

    <div
      v-if="!$is_empty(getData.alerts) && !loading"
      class="personal__alerts"
    >
      <div
        v-for="(alert, index) in getData.alerts"
        :key="index"
        class="un-form__alert"
      >
        <div 
          class="un-form__message message"
          :class="'un-form__message_i-' + alert.type"	
        >
          <span v-html="alert.html"></span>
        </div>
      </div>
    </div>
      

    
    <div v-if="loading" class="preloader">
      <div class="preloader-btn"></div>
    </div>

    

    <div 
      v-show="!loading"
      class="crud__table_wrapper"
    >

      <table class="crud__table">
        <thead class="crud__thead">
          <tr class="crud__row crud__thead-row">
            <!--<td class="crud__cell">
              <input type="checkbox" class="crud__check-all" id="crud__all" @change="checkAll">
              <label for="crud__all" class="crud__checkbox-label"></label>
            </td>-->
            <td
              v-for="(cell, index) in getData.thead"
              :key="index"
              class="crud__cell crud__head-cell"
              @click="sort(cell.sort, cell.key)"
            >
              <div>
                {{ cell.caption || cell.value }}
                <img 
                  v-if="cell.sort"
                  class="crud__sort-arrow"
                  :class="{'crud__sort-arrow_rotated': cell.sort.order_opposite == 'asc'}"
                  src="../static/images/i-arrow-small.svg"
                >
              </div>
              </td>
          </tr>
        </thead>
        <tbody
          v-if="!$is_empty(getData.row)"
          class="crud__tbody"
        >
          <tr
            v-for="(row,index) in getData.row"
            :key="index"
            class="crud__row"
          >
            <!--<td class="crud__cell crud__id-cell">
              <input type="checkbox" class="crud__check" :id="'crud-checkbox-' + row.id">
              <label :for="'crud-checkbox-' + row.id" class="crud__checkbox-label"></label>
            </td>-->
            <td
              v-for="(cell, theadIndex) in getData.thead"
              :key="theadIndex"
              class="crud__cell"
            >
              <span class="crud__cell-value">{{ row[cell.key] }}</span>
            </td>
            <td 
              v-if="!$is_empty(getData.buttons.last_column)"
              class="crud__cell crud__tools-cell"
            >
              <div 
                v-if="!$is_empty(getData.buttons.last_column)"
                class="crud__buttons"
              >
                <span  
                  v-for="(button, index) in getData.buttons.last_column"
                  :key="index"
                >
                  <img
                    v-if="
                      ((!button.url || !button.url.match(buttonsIdRegexp)) && (!button.action || !button.action.match(buttonsIdRegexp))) ||
                      ((button.url && button.url.match(buttonsIdRegexp) && row[button.url.match(buttonsIdRegexp)[1]]) || (button.action && button.action.match(buttonsIdRegexp) && row[button.action.match(buttonsIdRegexp)[1]]))
                    "
                    class="crud__button"
                    :src="button.icon"
                    @click="crudFunction(button, row)"
                    v-tooltip="button.caption"
                  >
                </span>
                
              </div>
             
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td :colspan="tableColumnsCount + 1" class="crud__no-results">Нет элементов для отображения</td>
          </tr>
        </tbody>
      </table>
    </div>

  <!--<div 
      v-show="!loading"
      class="crud__action_block"
    >
      <div class="crud__choose">
        <input type="checkbox" class="crud__check-all" id="crud__all2" @change="checkAll">
        <label for="crud__all2" class="crud__action-label"></label>
        <label for="crud__all2" class="crud__choose-all">Выбрать всё</label>
      </div>
      <div class="crud__act">
        <personal-multiselect
          
          :headline="'сделать с выбранным'"
        />
      </div>
    </div>-->

    <div 
      v-if="!loading && pagination.last_page != 1"
      class="crud__paginate_wrapper"
    >
      <paginate
        :paginateData="getData.page"
        :clickHandler="goToPage"
        :pageRange="$root.windowWidth > 640 ? 5 : 3"
      />
    </div>

      
  </div>
</template>

<script>
import Paginate from './Paginate.vue'
import PersonalToolbar from './PersonalToolbar.vue'
import PersonalMultiselect from './PersonalMultiselect.vue'
import PersonalAutocomplete from './PersonalAutocomplete.vue'
import UniversalForm from './UniversalForm.vue'
import ErrorsSuccessModal from './ErrorsSuccessModal.vue'

import { debounce } from 'vue-debounce'

  export default {
    components: {
      Paginate,
      PersonalToolbar,
      PersonalMultiselect,
      PersonalAutocomplete,
      UniversalForm,
      
      ErrorsSuccessModal,
    },
    props: {
      data: {
        type: Object,
        required: true
      },
      url: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        loading: false,
        getData: this.data,
        currentUrl: this.url,
        filterResults: [],
        currentPagination: 1,
        currentSearch: '',
        isAddOpen: false,
        formData: {},
        formOpen: false,
        isAddOpen: false,
        debounceSearch: null,
        closedFormData: null,

        urlObject: null,

        result: false,
        errors: [],
        success: "",

        buttonsIdRegexp: new RegExp("\{([^}]+)\}")

      }
    },
    computed: {
      pagination() {
        return this.getData.page
      },
      sortObject() {
        let sort = []
        $.each(this.getData.thead, (index, elem) => {
          if(elem.sort) {
            sort.push({
              name: "",

            })
          }
        })
      },
      tableColumnsCount() {
        return Object.keys(this.getData.thead).length
      },
      addForm() {
        let obj = Object.assign({}, this.getData.thead)
        $.each(obj, (index, elem) => {
          let copy = Object.assign({}, obj[index])
          obj[index] = {
            name: index,
            title: elem.value,
            value: ""
          }
        })
        return obj
      }
    },
    watch: {
      currentSearch() {
        this.debounceSearch()
      }
    },
    created() {

      this.urlObject = new URL(document.location.origin + this.currentUrl + '/' + 1)
      
      if (!this.$is_empty(this.getData.alerts)) {
        this.alerts = this.getData.alerts
      }
    
      this.debounceSearch = debounce(this.searchTableUpdate, 400)
    },
    mounted() {
    },
    methods: {
      containerSizeChange() {
        this.$emit('loadingChange')
      },
      checkAll() {
        $(".crud__check-all").each((index, elem) => {
          if (event.target.checked) elem.checked = true
          else elem.checked = false
        })
        $('.crud__check').each((index, elem) => {
          if (event.target.checked) 
            elem.checked = true
           else 
            elem.checked = false
        })  
        return false  
      },
      searchTableUpdate() {

        let pathname = this.urlObject.pathname

        while (true) {
          if (pathname[pathname.length - 1] == '/') {
            pathname += '1'
            break
          } else {
            pathname = pathname.substring(0, pathname.length - 1)
          }
        }

          this.urlObject.pathname = pathname
        
        this.errors = []
        this.success = ""
        
        this.loading = true
        this.$emit('loadingChange')

        this.$axios.get(this.urlObject.href)
          .then(response => {
            const data = response.data

            this.getData = data
            this.loading = false
            this.$emit('loadingChange')
          })

      },
      goToPage(page) {
        this.errors = []
        this.success = ""

        let pathname = this.urlObject.pathname

        while (true) {
        if (pathname[pathname.length - 1] == '/') {
          pathname += page
          break
        } else {
          pathname = pathname.substring(0, pathname.length - 1)
        }
      }

        this.urlObject.pathname = pathname
        
        this.loading = true
        this.$emit('loadingChange')

        this.$axios.get(this.urlObject.href)
          .then(response => {
            const data = response.data

            this.getData = data
            this.loading = false
            this.$emit('loadingChange')

            $('html, body').animate({
              scrollTop: $('.crud').offset().top
            }, 400)
          })

      },
      sort(sort, key) {
        this.errors = []
        this.success = ""

        if(sort) {

          if (sort.order_opposite == 'desc') {
            this.urlObject.searchParams.set('sort', '-' + key)
            // this.currentSort = 'sort=-' + key
          } else if (sort.order_opposite == 'asc') {
            this.urlObject.searchParams.set('sort', key)
          }

          this.loading = true
          this.$emit('loadingChange')

          this.$axios.get(this.urlObject.href)
            .then(response => {
              const data = response.data

              if (data.errors) {
                this.errors = data.errors
              }
              this.getData = data
              this.loading = false
              this.$emit('loadingChange')
            })
          
        }
      },
      searchUpdate(value) {
        this.errors = []
        this.success = ""

        if (!this.$is_empty(value)) {
          this.urlObject.searchParams.set('search', value)
        } else {
          this.urlObject.searchParams.delete('search')
        }

        this.debounceSearch()
      },
      filterUpdate(filter) {

        for (let [key, elem] of Object.entries(filter)) {

          if (elem.type == 'text') {

            if (elem.value) {
              this.urlObject.searchParams.set('filter[' + key + ']', elem.value)
            } else {
              this.urlObject.searchParams.delete('filter[' + key + ']')
            }

          } else if (elem.type == 'multiselect') {

            if (elem.choosen.length) {

              let multiselectFilterValue = ''

              elem.choosen.forEach(function(item, index) {
                multiselectFilterValue += item
                if (elem.choosen[index + 1] !== undefined && elem.choosen[index + 1] !== null) {
                  multiselectFilterValue += ','
                }
              })

              this.urlObject.searchParams.set('filter[' + key + ']', multiselectFilterValue)

            } else {
              this.urlObject.searchParams.delete('filter[' + key + ']')
            }
          } else if (elem.type == 'number' || elem.type == 'date') {
            if (!this.$is_empty(elem.from) || elem.from === 0 || elem.from === '0') {
              this.urlObject.searchParams.set('filter[' + key + '][from]', elem.from)
            } else {
              this.urlObject.searchParams.delete('filter[' + key + '][from]')
            }
            if (!this.$is_empty(elem.to) || elem.to === 0 || elem.from === '0') {
              this.urlObject.searchParams.set('filter[' + key + '][to]', elem.to)
            } else {
              this.urlObject.searchParams.delete('filter[' + key + '][to]')
            }
          }
        }

        this.errors = []
        this.success = ""
        this.alerts = []

        this.loading = true
        this.$emit('loadingChange')

        let pathname = this.urlObject.pathname

        while (true) {
        if (pathname[pathname.length - 1] == '/') {
          pathname += '1'
          break
        } else {
          pathname = pathname.substring(0, pathname.length - 1)
        }
      }

        this.urlObject.pathname = pathname

        this.$axios.get(this.urlObject.href)
          .then(response => {
            const data = response.data

            if (!this.$is_empty(data.errors)) {
              this.errors = data.errors
              this.result = true
            }
            this.getData = data
            this.loading = false
            this.$emit('loadingChange')
          })

      },
      formClose() {
        this.$modal.hide('universal-form')
        // this.$modal.hide('universal-form-result')
        this.formOpen = false
      },
      formResultClose() {
        this.formOpen = false
        this.closedFormData = null
      },
      formEnding(data) {
        this.$modal.hide('universal-form')

        if (!this.$is_empty(data.errors)) {
          this.errors = data.errors
        } else if (!this.$is_empty(data.success)) {
          this.success = data.success
        }

        this.result = true
      },
      tableUpdate() {
        this.loading = true
        this.$emit('loadingChange')

        this.$axios.get(this.urlObject.href)
          .then(response => {
            const data = response.data

            if (data.page.last_page < this.getData.page.current_page) {
              this.goToPage(data.page.last_page)
              return
            } else if (this.getData.page.current_page < 1) {
              this.goToPage(1)
              return
            }

            if (data.errors) {
              this.errors = data.errors
            } else if (data.success) {
              this.success = data.success
            }
            this.getData = data
            this.loading = false
            this.$emit('loadingChange')
          })

      },

      // Any crud-button click

      crudFunction(buttonObject, row) {
        this.errors = []
        this.success = ""

        let localUrl = buttonObject.action || buttonObject.url

        const urlMatch = localUrl.match(this.buttonsIdRegexp)

        if (!this.$is_empty(urlMatch)) {
          localUrl = localUrl.replace(this.buttonsIdRegexp, row[urlMatch[1]])
        }

        if (
          !this.$is_empty(buttonObject.method) &&
          !this.$is_empty(buttonObject.action)
        ) {

          this.loading = true
          this.$emit('loadingChange')

          // !: динамический метод

          const method = buttonObject.method
          const url = localUrl

          this.formData = {"blocks":[{"columns":2,"grid":[{"component":"text","data":{"name":"name","hidden":false,"error":false,"error_text":null,"required":false,"label":"\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435","value":null,"placeholder":null,"description":null,"min_length":null,"max_length":null,"api_url":""}},{"component":"select","data":{"name":"group_stock_id","error":false,"error_text":null,"label":"\u0413\u0440\u0443\u043f\u043f\u0430 \u0442\u043e\u0432\u0430\u0440\u043e\u0432","description":null,"options":[{"caption":"\u0422-\u0421","value":1,"selected":false},{"caption":"Valvoline","value":2,"selected":false},{"caption":"Felix","value":3,"selected":false},{"caption":"\u041d\u0430\u0448\u0438 \u0442\u043e\u0432\u0430\u0440\u044b","value":4,"selected":false}],"min_count":0,"max_count":1,"api_url":"","update_component":false,"update_url":""}},{"component":"number","data":{"name":"spread","error":false,"error_text":null,"required":false,"label":"\u0420\u0430\u0437\u043d\u0438\u0446\u0430 \u043c\u0430\u043a\u0441\u0438\u043c\u0443\u043c %","value":"0","placeholder":null,"description":null,"min":0.1,"max":null,"before":2,"after":1}},{"component":"number","data":{"name":"discount","error":false,"error_text":null,"required":false,"label":"+ \u0441\u043a\u0438\u0434\u043a\u0430 %","value":"0","placeholder":null,"description":null,"min":-9.9,"max":null,"before":2,"after":1}}]},{"columns":1,"grid":[{"component":"buttons","data":{"left":[],"right":[{"url":null,"method":"POST","action":"\/api\/form-v2\/rule-controll-price","caption":"\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c","icon":"","class":""}]}}]}]}
          this.$modal.show('universal-form')


          this.$axios({method, url})
            .then(response => {
              const data = response.data

              if (!this.$is_empty(data.blocks)) {

                this.formData = data
                this.$modal.show('universal-form')

              } 
              if (!this.$is_empty(data.errors)) {

                this.errors = data.errors
                this.result = true

              } 
              if (!this.$is_empty(data.success)) {

                this.success = data.success
                this.result = true

              } 
              if (!this.$is_empty(data.row)) {

                this.getData = data

              }

              this.loading = false
              this.$emit('loadingChange')
            })

        } else if (!this.$is_empty(buttonObject.url)) {

          if (localUrl.includes('http://') || localUrl.includes('https://')) {
            document.location.href = localUrl
          } else {
            this.$router.push(localUrl)
          }
          
        }
      },
    }
      
  }
</script>