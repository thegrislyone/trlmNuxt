<template>
    <div
        class="filter-group__parameter filter-group__parameter_range"
    >
        <vue-slider
            v-model="slider"
            :name=" filterParameterName "
            :min="this.filterParameter.min"
            :max="this.filterParameter.max"
            :height="3"
            :dotSize="17"
            :lazy="false"
            :silent="true"
            :enableCross="false"
            :marks="marks"
            :tooltip="tooltip"
            :tooltipPlacement="'bottom'"
            @change="changeSlider($event)"
            ref="slider"
        >
            <template v-slot:label="{ label }">
                <div :class="['vue-slider-mark-label', 'custom']">{{ label }}</div>
            </template>
            <template
                v-if="!inputs && mergeTooltip"
                v-slot:process="{ start, end, style }">
                <div class="vue-slider-process" :style="style">
                    <div :class="[
                        'merge-tooltip',
                        'vue-slider-dot-tooltip-inner'
                    ]">
                        {{ slider[0] }} - {{ slider[1] }}
                    </div>
                </div>
            </template>
        </vue-slider>
        <div
            v-if="inputs"
            class="filter-group__range-controls"
        >
            <input
                class="filter-group__range-from"
                type="text"
                v-model.number="slider[0]"
                v-debounce:850ms.lock="inputMin"
            >
            <input
                class="filter-group__range-to"
                type="text"
                v-model.number="slider[1]"
                v-debounce:850ms.lock="inputMax"
            >
        </div>
    </div>
</template>

<script>
    // import VueSlider from 'vue-slider-component'

    export default {
        components: {
            // VueSlider
        },
        props: {
            filterParameter: Object,
            filterParameterName: String,
            inputs: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                minDot: Number,
                maxDot: Number,
                dotsValues: [this.filterParameter.min, this.filterParameter.max],
                resultValues: [this.filterParameter.totalMin, this.filterParameter.totalMax],
                marks: [this.filterParameter.min, Math.ceil(this.filterParameter.max / 2), this.filterParameter.max],
                mergeTooltip: false
            }
        },
        computed: {
            slider: {
                get() {
                    return this.dotsValues
                },
                set(val) {
                    this.dotsValues = val
                }
            },
            tooltip() {
                if (!this.inputs && !this.mergeTooltip) {
                    return 'always'
                }
                return 'none'
            }
        },
        watch: { 
            filterParameter: function(newVal, oldVal) {
                if (newVal.min > this.resultValues[0] && newVal.max < this.resultValues[1]) {
                    this.slider = [newVal.min, newVal.max]
                } else if (newVal.max < this.resultValues[1]) {
                    this.slider = [this.resultValues[0], newVal.max]
                } else if (newVal.min > this.resultValues[0]) {
                    this.slider = [newVal.min, this.resultValues[1]]
                } else {
                    this.slider = this.resultValues
                }
            }
        },
        methods: {
            changeSlider(value) {

                if (!this.inputs) {

                    const $slider = $(this.$refs.slider.$el)
                    
                    const processWidth = $slider.find('.vue-slider-process').width()
                    let dotsWidth = 0

                    $slider.find('.vue-slider-dot-tooltip').each(function(){
                        dotsWidth += $(this).width()
                    })

                    if (processWidth - dotsWidth <= 10) {
                        this.mergeTooltip = true
                    }

                }
                
                if (this.resultValues[0] >= this.filterParameter.min ) {
                    this.minDot = value[0]
                } else if (value[0] !== this.filterParameter.min ) {
                    this.minDot = value[0]
                }
                if (this.resultValues[1] <= this.filterParameter.max) {
                    this.maxDot = value[1]
                } else if (value[1] !== this.filterParameter.max ) {
                    this.maxDot = value[1]
                }
            },
            inputMin(value) {
                let regexp = /\d/g
                let minValue = Number(value)
                if ( regexp.test(value) && Number.isInteger(minValue) ) {
                    if (minValue > this.resultValues[1] || minValue > this.filterParameter.max) {
                        if (minValue > this.filterParameter.max) {
                            if (this.resultValues[1] < this.filterParameter.max) {
                                this.resultValues[0] = this.resultValues[1]
                            } else {
                                this.resultValues[0] = this.filterParameter.max
                            }
                        } else { 
                            this.inputMax(minValue)
                            return
                        }
                    } else if (minValue > this.filterParameter.min) {
                        this.resultValues[0] = minValue
                    } else {
                        this.resultValues[0] = this.filterParameter.totalMin
                    }
                } else this.resultValues[0] = this.filterParameter.totalMin
                
                this.$emit('update-data', this.resultValues.join(';'))
            },
            inputMax(value) {
                let regexp = /\d/g
                let maxValue = Number(value)
                if ( regexp.test(value) && Number.isInteger(maxValue) ) {
                    if (maxValue < this.resultValues[0] || maxValue < this.filterParameter.min) {
                        if (maxValue < this.filterParameter.min) {
                            if (this.resultValues[0] > this.filterParameter.min) {
                                this.resultValues[1] = this.resultValues[0]
                            } else {
                                this.resultValues[1] = this.filterParameter.min
                            }
                        } else { 
                            this.inputMin(maxValue)
                            return
                        }
                    } else if (maxValue < this.filterParameter.max) {
                        this.resultValues[1] = maxValue
                    } else {
                        this.resultValues[1] = this.filterParameter.totalMax
                    }
                } else this.resultValues[1] = this.filterParameter.totalMax
                
                this.$emit('update-data', this.resultValues.join(';'))
            }
        },
        created () {
            let queryString = window.location.search
            let urlParams = new URLSearchParams(queryString)
            if (urlParams.has(this.filterParameterName)) {
                this.$root.updatedFilterData[this.filterParameterName] = urlParams.get(this.filterParameterName)
            }
            
            if (this.filterParameter.minSelected > this.filterParameter.min) {
                this.resultValues[0] = this.filterParameter.minSelected
            } else {
                this.resultValues[0] = this.filterParameter.totalMin
            }
            if (this.filterParameter.maxSelected < this.filterParameter.max) {
                this.resultValues[1] = this.filterParameter.maxSelected
            } else {
                this.resultValues[1] = this.filterParameter.totalMax
            }
            if (this.filterParameter.min > this.resultValues[0] && this.filterParameter.max < this.resultValues[1]) {
                this.slider = [this.filterParameter.min, this.filterParameter.max]
            } else if (this.filterParameter.max < this.resultValues[1]) {
                this.slider = [this.resultValues[0], this.filterParameter.max]
            } else if (this.filterParameter.min > this.resultValues[0]) {
                this.slider = [this.filterParameter.min, this.resultValues[1]]
            } else {
                this.slider = this.resultValues
            }

            this.minDot = this.slider[0]
            this.maxDot = this.slider[1]

            this.$watch('minDot', function(newVal, oldVal) {
                this.inputMin(newVal)
            })
            this.$watch('maxDot', function(newVal, oldVal) {
                this.inputMax(newVal)
            })
        }
    }
</script>

<style>

</style>