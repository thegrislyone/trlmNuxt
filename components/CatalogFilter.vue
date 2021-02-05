<template>
  <div>
    <filter-group
      v-for="item in data"
      :key="item.id"
      :filter-parameters="item"
      @update-filter-data="$parent.updateFilterData"
    ></filter-group>
  </div>
</template>

<script>
  import FilterGroup from './FilterGroup.vue'

  export default {
    props: {
      data: {
        required: true
      }
    },
    components: {
      FilterGroup
    },
    updated () {
      console.log('filter-catalog component updated', this.data)
    }
  }
</script>