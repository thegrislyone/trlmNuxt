<template>
    <div class="filter-group__parameter">   
        <input
            type="checkbox"
            :name=" 'filter-group-' + filterGroupId + '[' + filterParameter.id + ']' "
            :value="filterParameter.id"
            v-model="model"
            :id=" 'filter-group-' + filterGroupId + '[' + filterParameter.id + ']' "
            :disabled="filterParameter.disabled"
            @change="$emit('update-data')"
        >
        <label
            :for=" 'filter-group-' + filterGroupId + '[' + filterParameter.id + ']'"
        >
            <span v-html="filterParameter.value"></span>
        </label>
    </div>
</template>

<script>
    export default {
        props: [
            'value',
            'filterParameter',
            'filterGroupId'
        ],
        computed: {
            model: {
                get() {
                    return this.value
                },
                set(val) {
                    this.$emit('input', val)
                }
            }
        }
    }
</script>

<style>

</style>