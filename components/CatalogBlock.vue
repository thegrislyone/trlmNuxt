<template>
	<div class="products-container">
		<catalog-block-item
				v-for="catalogItem in itemsList"
				:key="catalogItem.id"
				:item-data="catalogItem"
		></catalog-block-item>
	</div>
</template>

<script>
	import CatalogBlockItem from './CatalogBlockItem.vue'
	export default {
		props: {
			itemsList: {
				type: Array,
				required: true
			}
		},
		components: {
			CatalogBlockItem
		},
		methods: {
			// decoder(str) {
			// 	let textArea = document.createElement('textarea')
			// 	textArea.innerHTML = str
			// 	return textArea.value
			// }
		},
		created () {
		},
		mounted() {
			this.$parent.blockElements.push(this.$el)
		}
	}
</script>

<style>

</style>
