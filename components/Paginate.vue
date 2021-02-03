<template>
	<div class="pagination">
		<div class="pagination__items">
			<template v-for="(page, index) in pages">
				<div
					v-if="page.breakView"
					:key="index"
					class="pagination__item pagination__separator"
				></div>
				<div
					v-else-if="page.selected"
					:key="index"
					class="pagination__item pagination__item_active"
				>
					<span class="pagination__page pagination__page_active">{{ page.content }}</span>
				</div>
				<a
					v-else
					:key="index"
					@click="handlePageSelected(page.index + 1)"
					:class="'pagination__item'"
				>
					{{ page.content }}
				</a>
			</template>		
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			value: {
				type: Number
			},
			paginateData: {
				type: Object,
				required: true
			},
			selectedPage: {
				type: Number,
				default: null
			},
			clickHandler: {
				type: Function,
				default: () => { }
			},
			pageRange: {
				type: Number,
				default: 5
			},
			marginPages: {
				type: Number,
				default: 1
			}
		},
		computed: {
			selected: {
				get: function() {
					return this.value || this.innerValue
				},
				set: function(newValue) {
					this.innerValue = newValue
				}
			},
			pages: function () {
				let items = {}
				if (this.pageCount <= this.pageRange) {
					for (let index = 0; index < this.pageCount; index++) {
						let page = {
							index: index,
							content: index + 1,
							selected: index === (this.selected - 1)
						}
						items[index] = page
					}
				} else {
					const halfPageRange = Math.floor(this.pageRange / 2)

					let setPageItem = index => {
						let page = {
							index: index,
							content: index + 1,
							selected: index === (this.selected - 1)
						}
						items[index] = page
					}

					let setBreakView = index => {
						let breakView = {
							disabled: true,
							breakView: true
						}
						items[index] = breakView
					}

					// 1st - loop thru low end of margin pages
					for (let i = 0; i < this.marginPages; i++) {
						setPageItem(i);
					}

					// 2nd - loop thru selected range
					let selectedRangeLow = 0;
					if (this.selected - halfPageRange > 0) {
						selectedRangeLow = this.selected - 1 - halfPageRange;
					}

					let selectedRangeHigh = selectedRangeLow + this.pageRange - 1;
					if (selectedRangeHigh >= this.pageCount) {
						selectedRangeHigh = this.pageCount - 1;
						selectedRangeLow = selectedRangeHigh - this.pageRange + 1;
					}

					for (let i = selectedRangeLow; i <= selectedRangeHigh && i <= this.pageCount - 1; i++) {
						setPageItem(i);
					}

					// Check if there is breakView in the left of selected range
					if (selectedRangeLow > this.marginPages) {
						setBreakView(selectedRangeLow - 1)
					}

					// Check if there is breakView in the right of selected range
					if (selectedRangeHigh + 1 < this.pageCount - this.marginPages) {
						setBreakView(selectedRangeHigh + 1)
					}

					// 3rd - loop thru high end of margin pages
					for (let i = this.pageCount - 1; i >= this.pageCount - this.marginPages; i--) {
						setPageItem(i);
					}
				}
				return items
			}
		},
		data() {
			return {
				innerValue: this.selectedPage || this.paginateData.current_page,
				pageCount: this.paginateData.last_page
			}
		},
		watch: { 
			selectedPage(newVal, oldVal) {
				this.selected = newVal
			}
		},
		methods: {
			handlePageSelected(selected) {
				if (this.selected === selected || this.$root.loading) return

				this.innerValue = selected
				this.$emit('input', selected)
				this.clickHandler(selected)
			},
			firstPageSelected() {
				return this.selected === 1
			},
			lastPageSelected() {
				return (this.selected === this.pageCount) || (this.pageCount === 0)
			},
			selectFirstPage() {
				if (this.selected <= 1) return

				this.handlePageSelected(1)
			},
			selectLastPage() {
				if (this.selected >= this.pageCount) return

				this.handlePageSelected(this.pageCount)
			}
		}
	}
</script>

<style>

</style>