<template>
  <div
    class="search-container"
    :class="{ 'active' : isActive }"
    id="search-autocomplete"
  >
    <div class="search row">
      <i
        v-if="isActive"
        class="search__close close-btn"
        @click="$emit('close')"
      ></i>
      <input
        class="search__input"
        name="search"
        type="text"
        placeholder="Что ищете?"
        v-model="searchAutocompleteInput"
        @focus="$emit('open')"
        v-debounce:850ms.lock="searchAutocomplete"
        @keyup.enter="searchAutocompleteSubmit('enter', $event)"
      >
      <div
        v-if="searchAutocompleteLoading"
        class="search__preloader-btn preloader-btn"
      ></div>
      <transition name="fader">
        <button
          v-if="isActive"
          class="search__btn btn"
          type="button"
          @click="searchAutocompleteSubmit('button')"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.69765 15.3945C9.47389 15.3945 11.1068 14.7835 12.4096 13.7704L16.6394 18L18 16.6395L13.7701 12.4099C14.7843 11.1062 15.3953 9.47338 15.3953 7.69724C15.3953 3.45318 11.9419 0 7.69765 0C3.45336 0 0 3.45318 0 7.69724C0 11.9413 3.45336 15.3945 7.69765 15.3945ZM7.69765 1.92431C10.8816 1.92431 13.4709 4.51347 13.4709 7.69724C13.4709 10.881 10.8816 13.4702 7.69765 13.4702C4.51371 13.4702 1.92441 10.881 1.92441 7.69724C1.92441 4.51347 4.51371 1.92431 7.69765 1.92431Z" />
          </svg>
          Искать
        </button>
      </transition>
    </div>
    <div
      v-if="searchAutocompleteInput.length >= 3 && isActive"
      class="search-result"
    >
      <button
        class="search-result__product-code"
        type="button"
        @click="searchAutocompleteSubmit('article')"
      >
        Поиск по артикулу “{{ searchAutocompleteInput }}”
      </button>

      <template v-if="searchResult">
        <template v-if="'data' in searchResult.relationships.attribute">
          <div
            v-for="attribute in searchResult.relationships.attribute.data"
            :key="attribute.id"
            class="result-group"
          >
            <div class="result-group__title">{{ attribute.attributes.name }}</div>
            <ul class="result-group__list">
              <li
                v-for="value in attribute.relationships.attribute_value.data"
                :key="value.id"
                class="result-group__item"
              >
                <n-link
                  :to="value.attributes.url"
                  class="result-group__link"
                  @click.native="$emit('close')"
                >
                  {{ value.attributes.value }}
                  <span>(товаров — {{ value.attributes.countProduct }})</span>
                </n-link>
              </li>
            </ul>
          </div>
        </template>
        <div
          v-if="'data' in searchResult.relationships.brand"
          class="result-group"
        >
          <div class="result-group__title">Бренды</div>
          <ul class="result-group__list">
            <li
              v-for="brand in searchResult.relationships.brand.data"
              :key="brand.id"
              class="result-group__item"
            >
              <n-link
                :to="brand.attributes.url"
                class="result-group__link"
                @click.native="$emit('close')"
              >
                {{ brand.attributes.name }}
                <span>(товаров — {{ brand.attributes.countProduct }})</span>
              </n-link>
            </li>
          </ul>
        </div>
        <div
          v-if="'data' in searchResult.relationships.product"
          class="result-group"
        >
          <div class="result-group__title">Товары</div>
          <ul class="result-group__list">
            <li
              v-for="product in searchResult.relationships.product.data"
              :key="product.data.id"
              class="result-group__item"
            >
              <n-link
                :to="product.data.attributes.seo_url"
                class="result-group__link result-group__link_product"
                @click.native="$emit('close')"
              >
                <img :src="product.data.attributes.images[0]" alt="">
                {{ product.data.attributes.name }}
              </n-link>
            </li>
          </ul>
        </div>
      </template>
      <div
        v-else-if="searchAutocompleteError"
        class="search-result__message message message_error"
      >Ошибка поиска. Попробуйте снова</div>
    </div>
    <div
      v-else-if="searchAutocompleteMinError && isActive"
      class="search-result"
    >
      <div class="search-result__message message message_error">
        Для поиска необходимо минимум 3 символа
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      isActive: {
        type: Boolean
      }
    },
    data() {
      return {
        searchResult: null,
        searchAutocompleteLoading: false,
        searchAutocompleteError: false,
        searchAutocompleteMinError: false,
        searchAutocompleteInput: ''
      }
    },
    methods: {
      searchAutocomplete(value) {

        this.searchAutocompleteError = false
        
        if (value.length >= 3) {

          this.searchAutocompleteLoading = true

          this.$axios.get('/api/general/public/search?search=' + value)
            .then(response => {
              const data = response.data

              console.log(data)
              this.searchResult = data
              this.searchAutocompleteLoading = false
            })
            .catch(error => {
              const responseText = error.response.request.responseText

              this.searchAutocompleteError = true
              this.searchAutocompleteLoading = false
            })

          // this.$metricGoal('quick_search')

        } else { 

          this.searchResult = null

        }
      },
      searchAutocompleteSubmit(type, event) {

        this.searchAutocompleteMinError = false

        if (this.searchAutocompleteInput.length >= 3) {

          switch(type) {
            case 'enter':
              // this.$metricGoal('quick_search_enter')
              break
            
            case 'button':
              // this.$metricGoal('quick_search_button')
              break
    
            case 'article':
              // this.$metricGoal('quick_search_link')
              break
          }

          if (type === 'enter') {
            event.target.blur()
          }
          
          this.isSearchActive = false
          this.$router.push(`/search-result?search=${ this.searchAutocompleteInput }`)
        } else {
          this.searchAutocompleteMinError = true
        }

      }
    }
  }
</script>