<template>
  <div class="loading loading_sticky">
    <div
      class="preloader-btn"
      ref="loader"
      :style="{ top: top + 'px' }"
    ></div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        top: 0
      }
    },
    methods: {
      handleScroll() {
        const middle = window.innerHeight / 2
        let padding = 20
        
        const loaderHeight = this.$refs.loader.offsetHeight
        const container = this.$refs.loader.parentNode
        const containerOffset = container.getBoundingClientRect().y
        const containerHeight = container.offsetHeight

        if (containerHeight < loaderHeight + padding * 2) {
          padding = 0
        }

        this.top = Math.min(
          Math.max(middle - loaderHeight / 2 - containerOffset, padding),
          containerHeight - loaderHeight - padding
        )
      }
    },
    mounted () {
      window.addEventListener('scroll', this.handleScroll)
      this.handleScroll()
    },
    beforeDestroy () {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', this.handleScroll)
      }
    }
  }
</script>