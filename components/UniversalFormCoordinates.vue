<template>
  <div 
		class="un-form-coordinates"
		:class="{
      'un-form__disabled-field': disabled
    }"
	>

		<div class="un-form-coordinates__label form__label">
			{{ label }}
			<span v-if="required">(обязательное)</span>
		</div>

		<div class="un-form-coordinates__inputs">
			<input 
				class="un-form-coordinates__input form__input" 
				type="number" 
				placeholder="latitude"
				:disabled="disabled"
				:class="{
					'form__input_error': localError || (!$is_empty(v) && v.$error && v.$dirty && !disabled),
					'form__input_required': required
				}"
				@input="input('latitude')"
				v-model="latitude"
			>
			<input 
				class="un-form-coordinates__input form__input"
				type="number"
				placeholder="longitude"
				:disabled="disabled"				
				:class="{
					'form__input_error': localError || (!$is_empty(v) && v.$error && v.$dirty && !disabled),
					'form__input_required': required
				}"
				@input="input('longitude')"
				v-model="longitude"
			>
		</div>

		<div class="form__message">
			{{ description }}
		</div>

		<div v-if="localErrorText" class="form__message_error">
			<span>
				{{ localErrorText }}
			</span>
		</div>

		<div class="form__message_error" v-if="!$is_empty(v) && v.$error && v.$dirty && !disabled">
			<span v-if="!v.requiredCoordinates">
				Данное поле обязательно для заполнения
			</span>
		</div>

		<div class="un-form-map" :id="'un-form-map' + name"></div>



  </div>
</template>

<script>

	// import Graticule from 'ol/layer/Graticule'
	// import Map from 'ol/Map'
	// import Feature from 'ol/Feature'
	// import OSM from 'ol/source/OSM'
	// import Stroke from 'ol/style/Stroke'
	// import TileImage from 'ol/source/TileImage'
	// import View from 'ol/View'
	// import proj4 from 'proj4'
	// import {Circle, Fill, Icon, Style} from 'ol/style'
	// import {LineString, Point, Polygon} from 'ol/geom'
	// import {
	// 	Pointer as PointerInteraction,
	// 	defaults as defaultInteractions,
	// } from 'ol/interaction'
	// import {TileJSON, Vector as VectorSource} from 'ol/source';
	// import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
	// import {applyTransform} from 'ol/extent'
	// import {get as getProjection, getTransform, fromLonLat, toLonLat, transform} from 'ol/proj'
	// import {register} from 'ol/proj/proj4'
	// import {toStringHDMS} from 'ol/coordinate'

	// import { debounce } from 'vue-debounce'


  	export default {
		components: {
		},
		props: {

			name: String,
			outerError: {
				type: Boolean,
				default: false
			},
			errorText: String,
			required: {
				type: Boolean,
				default: false
			},
			label: String,
			description: String,

			outerLatitude: String,
			outerLongitude: String,

			v: {
				type: Object
			},
			index: {
				type: String,
				required: true
			},
			disabled: {
				type: Boolean,
				default: false
			},
			zoom: {
				type: Number,
				default: 12
			}
		},
		data() {
			return {
				localError: this.outerError,
				localErrorText: this.errorText,

				inputFlag: false,			
				inputSecondFlag: false,			// я знаю что это бред, но пока не пришло ничего умнее в голову

				search: "",
				debounceSearch: "",

				latitude: "",
				longitude: "",

				debounceCoordinatesInput: null,

				map: {},
			}
		},
		computed: {
			coordinates() {
				return [Number(this.longitude),Number(this.latitude)]
			},
			pointFeature() {
				return new Feature({
					geometry: new Point(fromLonLat(this.coordinates)),
					name: this.name
				})
			}
		},
		watch: {
			latitude() {

				if (this.inputFlag && this.inputSecondFlag) {
					this.outerErrorSetFalse()
				} else if (!this.inputFlag) {
					this.inputFlag = true
				} else if (!this.inputSecondFlag) {
					this.inputSecondFlag = true
				}

				this.$emit("coordsChange", this.index, "latitude", this.latitude)
			},
			longitude() {

				if (this.inputFlag && this.inputSecondFlag) {
					this.outerErrorSetFalse()
				} else if (!this.inputFlag) {
					this.inputFlag = true
				} else if (!this.inputSecondFlag) {
					this.inputSecondFlag = true
				}
				
				this.$emit("coordsChange", this.index, "longitude", this.longitude)
			},
			disabled() {
				this.latitude = null
				this.longitude = null

				this.v.$touch()

				this.$emit("coordsChange", this.index, "latitude", this.latitude)
				this.$emit("coordsChange", this.index, "longitude", this.longitude)
			},
			outerError() {
        this.localError = this.outerError
      },
      errorText() {
        this.localErrorText = this.errorText
      }
		},
		created() {

			this.debounceCoordinatesInput = debounce(this.coordinatesHandleInput, 400)
			
			this.latitude = this.outerLatitude
			this.longitude = this.outerLongitude

			this.$emit("coordsChange", this.index, "latitude", this.latitude)
			this.$emit("coordsChange", this.index, "longitude", this.longitude)
		},
		mounted() {
			this.mapSet()
		},
		methods: {
			mapSet() {
				function handleDownEvent(evt) {
					var map = evt.map;

					var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
						return feature;
					});

					if (feature) {
						this.coordinate_ = evt.coordinate;
						this.feature_ = feature;
					}

					return !!feature;
				}
				function handleDragEvent(evt) {
					if (!vm.disabled) {
						var deltaX = evt.coordinate[0] - this.coordinate_[0];
						var deltaY = evt.coordinate[1] - this.coordinate_[1];

						var geometry = this.feature_.getGeometry();
						geometry.translate(deltaX, deltaY);

						this.coordinate_[0] = evt.coordinate[0];
						this.coordinate_[1] = evt.coordinate[1];

						
						vm.latitude = transform(this.feature_.getGeometry().getCoordinates(),'EPSG:3857','EPSG:4326')[1]
						vm.longitude = transform(this.feature_.getGeometry().getCoordinates(),'EPSG:3857','EPSG:4326')[0]
					}
					
				}
				function handleMoveEvent(evt) {
					if (this.cursor_) {
						var map = evt.map;
						var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
						return feature;
						});
						var element = evt.map.getTargetElement();
						if (feature) {
						if (element.style.cursor != this.cursor_) {
							this.previousCursor_ = element.style.cursor;
							element.style.cursor = this.cursor_;
						}
						} else if (this.previousCursor_ !== undefined) {
						element.style.cursor = this.previousCursor_;
						this.previousCursor_ = undefined;
						}
					}
				}
				function handleUpEvent() {
					this.coordinate_ = null;
					this.feature_ = null;
					return false;
				}

				var vm = this

				var Drag = (function (PointerInteraction) {
					function Drag() {
						PointerInteraction.call(this, {
							handleDownEvent: handleDownEvent,
							handleDragEvent: handleDragEvent,
							handleMoveEvent: handleMoveEvent,
							handleUpEvent: handleUpEvent,
						});
						this.coordinate_ = null
						this.cursor_ = 'grab'
						this.feature_ = null
						this.previousCursor_ = undefined
					}

					if ( PointerInteraction ) Drag.__proto__ = PointerInteraction
					Drag.prototype = Object.create( PointerInteraction && PointerInteraction.prototype )
					Drag.prototype.constructor = Drag

					return Drag;
				}(PointerInteraction));
				
				this.map = new ol.Map({
					interactions: defaultInteractions().extend([new Drag()]),
					layers: [
					new ol.layer.Tile({
						source: new ol.source.OSM()
					}),
					new VectorLayer({
						source: new VectorSource({
							features: [this.pointFeature],
						}),
						style: new Style({
							image: new Icon({
								anchor: [0.5, 1],
								color:  '#1C69D4',
								src: '../../../map/markers/i-map-marker.svg',
							}),
						}),
					})
					],
					target: 'un-form-map' + this.name,
					view: new ol.View({
						projection: 'EPSG:3857',
						center: ol.proj.fromLonLat(this.coordinates),
						zoom: this.zoom
					})
			})
			},
			outerErrorSetFalse() {
				this.localError = false
				this.localErrorText = ''
			},
			coordinatesHandleInput() {
				document.querySelector('.un-form-map').innerHTML = ""
				this.mapSet()
			},
			input(type) {
				this.debounceCoordinatesInput()
			}
		}
	}

</script>