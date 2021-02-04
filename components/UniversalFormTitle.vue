<script>
export default {
    render(createElement) {
        return createElement(
            'h' + this.levelValidated,
            this.caption
        )
  },
  props: {
    level: {
      type: Number,
      required: true
    },
    caption: {
        type: String,
        required: true
    }
  },
  computed: {
      levelValidated() {
          return (this.level == 3 || this.level == 4) ?  this.level : 2
      }
  }
}
</script>