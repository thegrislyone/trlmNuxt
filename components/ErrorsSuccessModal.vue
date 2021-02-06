<template>
	<div class="un-form-result">
		<modal
				name="errors-success-modal"
				:classes="['modal','crud__add-status']"
				:adaptive="true"
				:height="'auto'"
				:scrollable="true"
				:max-width="600"
				:pivot-y="0"
				@closed="modalClose"
		>
		<img 
			src="/trlm/images/i-close.svg"
			alt="" 
			class="un-form__close-icon"
			@click="modalClose"
		>

		<div class="un-form-result__icon">
			<img 
				v-if="!$is_empty(success)"
				src="/trlm/images/i-success-status_big.svg" 
				alt=""
			>
			<img 
				v-else-if="!$is_empty(errors)"
				src="/trlm/images/i-error-status_big.svg" 
				alt=""
			>
		</div>

		<div class="un-form-result__signature">
				<div 
					v-if="!$is_empty(success)"
					class="un-form-result__success-message"
				>
					{{ success }}
				</div>

				<div 
					v-else-if="!$is_empty(errors)"
					class="un-form-result__error-message"
				>
					Ошибка
				</div>
		</div>

		<div class="un-form-result__error-list">
			<div 
				v-for="(error,index) in errors"
				:key="index"
			>
				{{ error.caption || error.title }}
			</div>
		</div>

		<div class="un-form-result__close-button">
			<button 
				class="btn btn_black btn_border un-form-result__button"
				@click="modalClose"
			>
				Закрыть
			</button>
		</div>

		
		</modal>
	</div>
</template>

<script>
  export default {
	components: {
	},
	props: {
	  success: {
			type: String,
			required: false
		},
		errors: {
			type: Array,
			required: false
		}
	},
	data() {
	  return {
		
	  }
	},
	computed: {
	},
	watch: {

	},
	created() {
	},
	mounted() {
		this.$modal.show('errors-success-modal')
	},
	methods: {
	  modalClose() {
			
			this.$emit('close')

			if (!this.$is_empty(this.errors)) {
				//this.$router.push('/')
				this.$modal.hide('errors-success-modal')

			} else if (!this.$is_empty(this.success)) {

				this.$modal.hide('errors-success-modal')

				this.$emit('dataRefresh')
				
			}

			this.$emit('close')
		}
	}
  }
</script>