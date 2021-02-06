<template>
  <div class="events-item-page">

    <sticky-loader v-if="pageLoading" />

    <div v-if="banner" class="events-item-page__main-image">
      <img :src="banner" alt="">
    </div>

    <div class="events-item-page__content">

      <breadcrumbs-component
        v-if="breadcrumbs.length"
        :breadcrumbs="breadcrumbs"
      ></breadcrumbs-component>

      <h1>{{ h1 }}</h1>

      <div class="text" v-html="content"></div>

    </div>
	</div>
</template>

<script>

  import BreadcrumbsComponent from '../components/BreadcrumbsComponent.vue'

  export default {
    components: {
      BreadcrumbsComponent
    },
    data() {
      return {
        h1: '',  
        breadcrumbs: [],
        content: '',
        banner: null,
        pageLoading: false
      }
    },
    methods: {
      initPage(data) {
        console.log(data)
        this.h1 = data.data.attributes.h1 || ''
        this.content = data.data.attributes.text || ''
        this.banner = data.data.attributes.img_src || null
      }
    },
    created () {
      if ('json_page_data' in window && window.json_page_data !== null) {

        console.log('ssr', json_page_data)
        const pageData = window.json_page_data
        this.initPage(pageData)
        this.breadcrumbs = window.json_page_breadcrumbs || []

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
            this.breadcrumbs = data.breadcrumb || []

            this.pageLoading = false

          })

      }
    }
  }
</script>