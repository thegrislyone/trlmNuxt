<template>
  <div class="simple-page">
    
    <sticky-loader v-if="pageLoading" />
    
    <h1>{{ h1 }}</h1>
    
    <div class="main-container">
      
      <div class="main-content">
        <div
          class="text simple-page__text"
          v-html="content"
        ></div>
      </div>
      
    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        h1: '',
        content: '',
        script: null,
        pageLoading: false
      }
    },
    methods: {
      initPage(data) {
        this.h1 = data.data.attributes.h1 || ''
        this.content = data.data.attributes.text || ''

        if (data.data.attributes.script) {
          let el = document.createElement('div')
          let script = document.createElement('script')
          el.innerHTML = data.data.attributes.script
          script.setAttribute('src', el.firstChild.getAttribute('src'))
          this.script = script
          document.head.appendChild(this.script)
        }
        
      }
    },
    mounted () {
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
    beforeDestroy () {
      if (this.script !== null) {
        this.script.remove()
      }
    }
  }
</script>