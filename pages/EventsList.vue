<template>
  <div class="events-list-page">

		<sticky-loader v-if="pageLoading" />

		<h1>Акции</h1>
		
		<div v-if="eventList.length" class="events-list">
			<router-link
				v-for="event in eventList"
				:key="event.id"
				:to="event.attributes.url"
				class="event"
			>
				<img :src="event.attributes.img_src" alt="">
			</router-link>
		</div>
		<div v-else class="message">Нет активных акций</div>

	</div>
</template>

<script>
  export default {
		data() {
			return {
				pageLoading: false,
				eventList: []
			}
		},
		methods: {
			initPage(data) {
				console.log(data)
				this.eventList = data.data || []
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