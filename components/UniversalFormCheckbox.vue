<template>
		<div class="un-form-checkbox">
			<input
				type="checkbox"
				:id="id || name"
				:name="name"
				:checked="checked"
				:disabled="disabled"
				@input="input"
				v-model="value"
			>

			<label class="form__label" :for="id || name">{{ label }}</label>

			<div class="form__message">
				{{ description }}
			</div>

			<div v-if="localErrorText" class="form__message_error">
				<span>
					{{ localErrorText }}
				</span>
			</div>

		</div>
</template>

<script>
	export default {
		components: {
		},
		props: {

			id: String,
			name: String,
			errorText: String,
			required: {
				type: Boolean,
				default: false
			},
			label: String,
			description: String,
			checked: {
				type: Boolean,
				default: false
			},

			disabled: {
				type: Boolean
			},

			
		},
		data() {
			return {
				value: null,
				localErrorText: this.errorText
			}
		},
		computed: {
		},
		watch: {
			value() {
				this.$emit('input', this.value)
			},
			disabled() {
        //this.activeStatusChange()
			},
      errorText() {
        this.localErrorText = this.errorText
      }
		},
		created() {
			this.activeStatusChange()
			this.value = this.checked
		},
		mounted() {
		},
		methods: {
			input() {
				this.localErrorText = ''
			},
			activeStatusChange() {
        this.$emit('activeStatusChange', this.name, this.disabled)
      }
		}
	}
</script>