<template>
    <div
        v-if=" filterParameters.attributes.type_filter === 'range' "
        class="filter-group"  
    >
        <div class="filter-group__title">{{ filterParameters.name }}</div>
        <filter-group-range
            :filterParameter="filterParameters"
            :filterParameterName="'range'"
            :inputs="filterParameters.inputs"
        ></filter-group-range>
        <!-- @update-data="updateData({name: 'range-' + filterParameterName, value: $event})" -->
    </div>
    <div
        v-else-if="filterParameters.attributes.visibility === 'visible'"
        class="filter-group"
    >
        <div class="filter-group__title">
            {{ filterParameters.attributes.name }}
        </div>

        <div
            v-if="filterParameters.attributes.type_filter === 'checkbox'"
            class="filter-group__parameters"
        >
            <div class="filter-group__parameters-container">
                <filter-group-parameter
                    v-for=" filterParameter in parametersList "
                    :key="filterParameter.id"
                    :filterParameter="filterParameter"
                    :filterGroupId="filterParameters.id"
                    v-model="checkedValues"
                    :ref="`filter-group-${filterParameter.id}`"
                    @update-data="updateData(`filter-group-${filterParameter.id}`)"
                ></filter-group-parameter>
            </div>

            <div
                v-if=" visibleParameters.length < parameters.length "
                @click.prevent=" showLessParameters = !showLessParameters "
                class="filter-group__showmore"
            >
                {{ showLessParameters === true ? "Ещё" : "Свернуть" }}
            </div>
        </div>
        <multiselect
            v-else-if="
                filterParameters.attributes.type_filter === 'select' ||
                filterParameters.attributes.type_filter === 'autocomplete_select'
            "
            v-model="multiselect" 
            v-tooltip="(!$empty(filterParameters.attributes.tooltip) && $empty(autocompleteValue)) && filterParameters.attributes.tooltip"
            :options="multiselectParametersList" 
            :multiple="true"
            :close-on-select="false"
            :clear-on-select="false" 
            :hide-selected="true" 
            :preserve-search="true"
            :internal-search="(filterParameters.attributes.type_filter === 'autocomplete_select') ? false : true"
            
            selectLabel=""
            placeholder="Поиск по результатам"
            label="value" 
            track-by="value"
            tag-position="bottom"
            @search-change="autocompleteDebounceSearch"
        >
            <template slot="tag" slot-scope="{ option, remove }">
                <span class="selected-parameter" @click="remove(option)">
                    {{ option.value }}
                </span>
            </template>
            <span slot="noResult">Результатов не найдено</span>
            <span slot="placeholder">Выберите из списка</span>
        </multiselect>
        <input
            v-else-if="filterParameters.attributes.type_filter === 'search'"
            type="text"
            v-model="search"
            placeholder="Введите текст"
        >
    </div>
</template>

<script>
    import FilterGroupParameter from './FilterGroupParameter.vue'
    import FilterGroupRange from './FilterGroupRange.vue'
    import Multiselect from 'vue-multiselect'
    import { debounce } from 'vue-debounce'
    
    export default {
        props: {
            filterParameters: {
                type: Object,
                required: true
            },
            filterType: {
                type: String
            }
        },
        components: {
          FilterGroupParameter, 
          FilterGroupRange, 
          Multiselect
        },
        data() {
            return {

                showLessParameters: true,
                multiselectArray: [],
                searchValue: '',
                debounceSearch: null,

                autocompleteDebounceSearch: null,
                parametersListFromApi: null,
                autocompleteValue: '',
                // specialBrands: []
            }
        },
        computed: {
            parameters() {
                return this.filterParameters.relationships.attribute_value.data.map(item => item.attributes)
            },
            visibleParameters() {
                if (this.parametersListFromApi !== null) {
                    return this.parametersListFromApi.filter( item => (item.visibility === undefined || !this.$empty(item.visibility)))  
                }
                return this.parameters.filter( item => (!this.$empty(item.visibility)))
            },
            parametersList() {

                if ( this.showLessParameters ) {

                    return this.visibleParameters

                } else {

                    return this.parameters

                }
            },
            multiselectParametersList() {

                let result = this.visibleParameters

                result = result.map( item => {
                    if (item.disabled === 'disabled') {
                        let newItem = Object.assign({}, item)
                        newItem['$isDisabled'] = true
                        return newItem
                    }
                    return item
                })

                return result

            },
            search: {
                get() {
                    return this.$store.getters.getSearchValue(this.filterParameters.id) || ''
                },
                set(value) {
                    this.searchValue = [value]
                    this.debounceSearch()
                }
            },
            multiselect: {
                get() {
                    return this.$store.getters.getCheckedValuesById(this.filterParameters.id) || []
                },
                set(value) {
                    this.checkedValues = value.map(item => item.id)
                    this.updateData('multiselect')
                }
            },
            checkedValues: {
                get() {
                    return this.$store.getters.getCheckedValuesById(this.filterParameters.id).map(item => item.id) || []
                },
                set(value) {
                    this.$store.commit('setFilterCheckedValues', {
                        id: this.filterParameters.attributes.id,
                        value: value
                    })
                }
            }
        },
        methods: {
            updateData(ref) {
                if (this.filterType === 'offers') {

                    this.$store.commit('updateOffersAppliedFilterValues')
                    this.$emit('update-filter-data', this.filterParameters.id !== 0)

                } else {
                    
                    $('.filter-group').each(function(){
                        $(this).removeClass('target-group')
                    })
                    $('.filter-group__parameter').each(function(){
                        $(this).removeClass('target')
                    })
                    if (ref.includes('range')) {
                        $(this.$refs[ref].$el).addClass('target')
                    } else if (ref.includes('multiselect') || ref.includes('search')) {
                    } else {
                        $(this.$refs[ref][0].$el).addClass('target')
                    }
                    $(this.$el).addClass('target-group')
                    
                    this.$emit('update-filter-data')
                    
                }
            },
            searchInput() {
                this.checkedValues = this.searchValue
                this.updateData('search')
            },
            multiselectAutocomplete(value, id) {

                if (this.filterParameters.attributes.type_filter != 'autocomplete_select') return
                
                this.autocompleteValue = value
                
                const url = this.$parent.$parent.getRequestUrl()

                url.pathname = this.filterParameters.attributes.autocomplete_url
                url.searchParams.set('search', value)

                $.ajax({
                    url: url,
                    method: 'GET',
                    dataType: 'json',
                    success: (data) => {
                        if (Array.isArray(data)) {
                            this.parametersListFromApi = data
                        }
                    }
                })
                
            }
        },
        created() {
            this.autocompleteDebounceSearch = debounce(this.multiselectAutocomplete, 400)
            this.debounceSearch = debounce(this.searchInput, 400)
        },
    }
</script>

<style>
    
</style>