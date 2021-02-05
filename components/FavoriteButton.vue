<template>
  <button
    v-if="$store.getters['auth/isAuthorized']"
    class="favorite-btn row"
    type="button"
    @click="$emit('favorite-click')"
  >
    <div
      v-if="loading"
      class="loading loading_centered"
    >
      <div class="preloader-btn"></div>
    </div>
    <template v-else>
      <i>
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M11 1L14.09 7.26L21 8.27L16 13.14L17.18 20.02L11 16.77L4.82 20.02L6 13.14L1 8.27L7.91 7.26L11 1Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </i>
      <slot></slot>
    </template>
  </button>
</template>

<script>
  export default {
    props: {
      loading: {
        type: Boolean,
        required: true
      }
    },
  }
</script>