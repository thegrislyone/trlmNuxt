<template>
  <div>
    <filter-group
      v-for="item in filterList"
      :key="item.id"
      :filter-parameters="item"
      :filter-type="'offers'"
      @update-filter-data="updateFilterData"
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
    computed: {
      filterData() {
        return JSON.parse(this.data)
      },
      filterList() {
        return this.filterData.relationships.filter.relationships.attribute.data
      }
    },
    created() {

      console.log('filterData', this.filterData)
      
      if ('relationships' in this.filterData.relationships.stock.data) {
        this.$parent.offersData = this.filterData.relationships.stock.data.relationships

        let request = new URL(window.location.href)
        request.href = request.origin + request.pathname + '/2' + request.search
        request.searchParams.set('json', '')

        this.$parent.restPartLoad(request)
        
      } else {
        this.$parent.errorMessage = 'Нет ответа от поставщика, попробуйте позже'
      }
      this.$store.commit('common/setFilterData', this.filterList)
      this.$store.commit('common/updateOffersAppliedFilterValues')

    },
    methods: {
      updateFilterData(apply) {
        this.$parent.updateFilterData(apply)
      }
    },
    updated () {
      console.log('offers-filter component updated', this.filterData)
    },
  }
</script>

<style>

</style>