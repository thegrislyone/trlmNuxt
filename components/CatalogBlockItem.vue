<template>
	<div class="product">
		<router-link
			v-if="itemData.attributes.product_url"
			:to="itemData.attributes.product_url"
			class="product__image"
		>
			<img v-lazy="decoder(itemData.attributes.images[0])" alt="">
			<div class="preloader-btn"></div>
		</router-link>
		<span v-else class="product__image">
			<img v-lazy="decoder(itemData.attributes.images[0])" alt="">
			<div class="preloader-btn"></div>
		</span>
		<div class="product__description description">
			<div class="product__title-group row">
				<favorite-button
					class="product__favorite-btn product__favorite-btn_list-view"
					:class="{ 'active' : itemData.attributes.favorit_id > 0 }"
					:loading="favoriteLoading"
					@favorite-click="favoriteClick"
				></favorite-button>
				<router-link
					v-if="itemData.attributes.product_url"
					:to="itemData.attributes.product_url"
					class="product__title"
					v-html="itemData.attributes.name"
				></router-link>
				<span
					v-else
					class="product__title"
					v-html="itemData.attributes.name"
				></span>
			</div>
			<div
				v-for="(item, index) in attributes"
				:key="index"
				class="description__item"
			>
				{{ item.attributes.name }}: <span>{{ item.relationships.attribute_value.data[0].attributes.value }}</span>
			</div>
		</div>
		<div class="product__btn-group row">
			<favorite-button
				class="product__favorite-btn product__favorite-btn_grid-view"
				:class="{ 'active' : itemData.attributes.favorit_id > 0 }"
				:loading="favoriteLoading"
				@favorite-click="favoriteClick"
			></favorite-button>
			<a
				:href="itemData.attributes.seo_url"
				class="product__btn btn btn_border"
				type="button"
				@click.prevent="goToOffers(itemData.attributes.seo_url)"
			>
				Узнать цену
			</a>
		</div>
	</div>
</template>

<script>

	import FavoriteButton from '../components/FavoriteButton.vue'

	export default {
		components: {
			FavoriteButton
		},
		props: {
			itemData: {
				type: Object,
				required: true
			}
		},
		data() {
			return {
				favoriteLoading: false
			}
		},
		methods: {
			decoder(str) {
				let textArea = document.createElement('textarea')
				textArea.innerHTML = str
				return textArea.value
			},
			goToOffers(link) {
				this.$metricGoal('catalog_offer')
				this.$router.push(link)
			},
			favoriteClick() {

				if (this.favoriteLoading) {
					return
				}

				this.favoriteLoading = true

				if (this.itemData.attributes.favorit_id > 0) {

					$.ajax({
						url: '/api/favorit-delete/' + this.itemData.attributes.favorit_id,
						type: 'DELETE',
						dataType: 'json',
						success: data => {
							console.log('delete', data)
							this.itemData.attributes.favorit_id = data
							this.favoriteLoading = false
						},
						error: data => {
							console.log(data.responseText)
							this.favoriteLoading = false
						}
					})

				} else {

					const request = {
						article: this.itemData.attributes.article,
						brand: this.itemData.attributes.brand_name,
						name: this.itemData.attributes.name
					}

					$.ajax({
						url: '/api/favorit-add',
						method: 'POST',
						dataType: 'json',
						data: request,
						success: (data) => {
							console.log('favorit-add', data)
							this.itemData.attributes.favorit_id = data
							this.favoriteLoading = false
						},
						error: (data) => {
							console.log(data.responseText)
							this.favoriteLoading = false
						}
					})

				}

			}
		},
		computed: {
			attributes() {
				let result = []
				if ( 'attribute' in this.itemData.relationships ) {
					result = this.itemData.relationships.attribute.data.slice(0, 3)
				}
				return result
			}
		},
		created () {
			// console.log(this.itemData)
		},
	}
</script>

<style>

</style>
