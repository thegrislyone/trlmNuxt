<template>
  
  <div class="contact-page">

    <sticky-loader v-if="pageLoading" />

    <h1>{{ h1 }}</h1>
    
    <div
      v-if="phones.length"
      class="contact-page-phones"
    >
      <div
        v-for="(phone, index) in phones"
        :key="index"
        class="contact-page-phone"
      >
        <span class="contact-page-phone__caption">{{ phone.attributes.caption }}<i> —</i></span>
        <a
          :href=" 'tel:' + phone.attributes.href "
          class="contact-page-phone__number"
        >{{ phone.attributes.number }}</a>
      </div>
    </div>

    <div 
      v-if="mapData !== null"
      class="contact-page-map"
    >
      <h3>{{ mapTitle }}</h3>
      <map-component
        class="contact-page-map__map"
        :map-data="mapData"
      ></map-component>
    </div>

    <div class="main-container">

      <div class="main-content contact-page-content">

        <div 
          v-if="formData"
          class="contact-page-form contact-page-content__column"
        >
          <h2>{{ formTitle }}</h2>
          <universal-form
            :outsideData="formData"
            @formEnding="formEnding"
          ></universal-form>
        </div>

        <div
          v-if="requisitesData"
          class="contact-page-requisites contact-page-content__column"
        >
          <h2>{{ requisitesTitle }}</h2>
          <div
            class="contact-page-requisites-list"
            v-html="requisitesData"
          ></div>
        </div>

      </div>
    </div>

  </div>

</template>

<script>

  import MapComponent from '../components/MapComponent.vue'
  import UniversalForm from '../components/UniversalForm.vue'

  export default {
    components: {
      MapComponent,
      UniversalForm
    },
    data() {
      return {
        pageLoading: false,
        h1: '',
        phones: [],
        mapTitle: '',
        mapData: null,
        formTitle: '',
        formData: null,
        requisitesTitle: '',
        requisitesData: null,

      }
    },
    computed: {
    },
    methods: {
      initPage(data) {
        this.h1 = data.data.attributes.h1 || ''
        this.textTop = data.data.attributes.text_top || null
        
        if (data.relationships.map) {

          this.mapTitle = data.data.attributes.title_map || ''

          const map = data.relationships.map

          if (map.data.attributes.latitude && map.data.attributes.longitude) {

            const coordinates = [ +map.data.attributes.longitude, +map.data.attributes.latitude ]
            const zoom = +map.data.attributes.zoom || 15
            const tiles = map.data.attributes.url_tiles

            const points = map.relationships.points.data

            const mapData = {
              coordinates,
              zoom,
              tiles,
              points
            }

            this.mapData = mapData

          }

        }

        if (data.relationships.form) {
          this.formTitle = data.data.attributes.title_form || ''
          this.formData = data.relationships.form
        }

        if (data.relationships.phones) {
          this.phones = data.relationships.phones.data || []
        }

        this.requisitesTitle = data.data.attributes.title_text || ''
        this.requisitesData = data.data.attributes.text || null

      },
      formEnding(data) {
        console.log(data)
      }
    },
    created () {

      if ('json_page_data' in window && window.json_page_data !== null) {

        console.log('ssr', json_page_data)
        const pageData = window.json_page_data
        this.initPage(pageData)

      } else {
 
        this.pageLoading = true

        const url_string = window.location.href
        let request = new URL(url_string)
        request.searchParams.set('json', '')

        const $request = this.$axios.get(request)
          .then(response => {
            const data = response.data

            console.log('main-request', data)

            this.initPage(data.data)

            this.pageLoading = false

          })

      }
    },
  }
</script>