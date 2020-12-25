<template>
  <div class="city-select-content">
    <button
      class="city-select"
      id="city-select"
      type="button"
      v-show="officeIs !== null"
      @click="showPopper"
    >
      <template v-if="officeIs !== null">
        {{ officeIs.attributes.name }}
      </template>
      <template v-else>Пункт выдачи</template>
    </button>
    <div
      id="city-tooltip"
      class="city-tooltip"
      v-click-outside="clickOutsidePopper"
    >
      <!-- start -->
      <div v-if="isWholesale" class="city-tooltip-wholesale">
        <div
          v-if="addressesLoading"
          class="loading loading_centered"
        >
          <div class="preloader-btn"></div>
        </div>
        Поиск торговой точки
        <input
          class="city-tooltip-address-search"
          type="text"
          v-model="addressSearchValue"
          v-debounce:850ms.lock="addressSearch"
        >
        <div v-if="addresses.length" class="city-tooltip-addresses">
          <div
            v-for="address in addresses"
            :key="address.id"
            class="city-tooltip-address"
            @click="selectOffice(address)"
          >
            <div class="city-tooltip-address__name">
              {{ address.attributes.name }}
            </div>
            <div class="city-tooltip-address__text">
              {{ address.attributes.text }}
            </div>
          </div>
        </div>
        <div v-else>Адресов не найдено</div>
      </div>
      <div v-else-if="!cities.length" class="city-tooltip-empty"></div>
      <div v-else-if="!isRegionSearch" class="region">
        <div class="region__caption">Ваш регион —</div>
        <div class="region__confirmation">
          <template v-if="geoIp && !regionApplied">
            <div class="region__value">
              {{ geoIp }}?
            </div>
            <button
              class="region__btn btn btn_border"
              type="button"
              @click="regionIs = geoIp; regionApplied = true"
            >
              да
            </button>
            <button
              class="region__btn btn btn_border btn_red"
              type="button"
              @click="isRegionSearch = true"
            >
              нет
            </button>
          </template>
          <template v-else-if="regionIs">
            <div class="region__value">
              {{ regionIs }}
            </div>
            <button
              class="region__btn btn btn_border btn_black"
              type="button"
              @click="changeRegion"
            >
              изменить
            </button>
          </template>
          <template v-else>
            <div class="region__value">
              не определён
            </div>
            <button
              class="region__btn btn btn_border"
              type="button"
              @click="isRegionSearch = true"
            >
              выбрать
            </button>
          </template>
        </div>
      </div>
      <!-- office -->
      <div v-if="regionApplied" class="office">
        <div
          v-if="citiesLoading"
          class="loading loading_centered"
        >
          <div class="preloader-btn"></div>
        </div>
        <div class="office__title">Выберите пункт выдачи:</div>
        <div
          v-for="city in cities"
          :key="city.id"
          class="office__list"
        >
          <div class="office__city">{{ city.attributes.name }}</div>
          <div class="office__items">
            <div
              v-for="office in city.pickPoints"
              :key="office.id"
              class="office__item"
            >
              <span class="office__link" @click="selectOffice(office)">{{ office.attributes.name }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- region search -->
      <div v-if="isRegionSearch" class="region-search">
        <div class="region-search__title">Выберите регион</div>
        <input
          v-if="regions.length > 7"
          class="region-search__search"
          type="text"
          name="city-search"
          placeholder="Поиск по регионам"
          v-model.trim="regionSearch"
        >
        <div class="region-search__result">
          <div
            v-for="region in regionsList"
            :key="region.id"
            class="region-search__item"
          >
            <span
              class="region-search__link link"
              @click="selectRegion(region)"
            >
              {{ region.attributes.name }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import { createPopper } from '@popperjs/core'

  export default {
    data() {
      return {
        popperInstance: null,
        officeIs: {
          attributes: {
            name: 'Малиновского'
          }
        },
        regionIs : null,
        geoIp : null,
        isWholesale: false,
        isRegionSearch: false,
        regionApplied: false,
        regionSearch: '',
        cities : [],
        citiesLoading: false,
        regions : [],
        addresses: [],
        addressSearchValue: '',
        addressesLoading: false
      }
    },
    methods: {
      clickOutsidePopper(event) {
        if (event.target.id !== 'city-select' && !event.target.classList.contains('another-pickpoint-btn') ) {
          if (event.target.parentElement.id !== 'city-select' ) {
            this.hidePopper()
          }
        }
      },
      createPopper() {

        const button = document.querySelector('#city-select')
        const tooltip = document.querySelector('#city-tooltip')

        this.popperInstance = createPopper(button, tooltip, {
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: () => [0, -20]
              }
            }
          ]
        })
      },
      destroyPopper() {
        if (this.popperInstance) {
          this.popperInstance.destroy()
          this.popperInstance = null
        }
      },
      showPopper() {
        document.querySelector('#city-tooltip').setAttribute('data-show', '');
        this.createPopper()
      },
      hidePopper() {
        document.querySelector('#city-tooltip').removeAttribute('data-show');
        this.destroyPopper()
      },
    },
  }
</script>