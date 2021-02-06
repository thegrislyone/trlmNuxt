<template>
  <div
    class="schedule-container"
    :class="containerClass"
  >
    <button
      :class="buttonClass"
      type="button"
      @click="getSchedule"
    >
      График работы
    </button>
    <modal
      name="schedule"
      :classes="['modal','schedule-modal']"
      :adaptive="true"
      :height="'auto'"
      :scrollable="true"
      :max-width="600"
      :pivot-y="0"
    >
      <i
        class="modal__close close-btn"
        @click="$modal.hide('schedule')"
      ></i>
      <h2>График работы</h2>
      <p>{{ $store.getters['pickpoints/officeIs'].attributes.name }}</p>
      <multiselect
        v-if="scheduleData !== null"
        v-model="schedule"
        :options="scheduleData"
        :show-labels="false"
        :hide-selected="false"
        :allow-empty="false"
        label="day_text" 
        track-by="day_text"
        placeholder="Не выбран"
      >
        <template slot="option" slot-scope="props">
          <span
            :class="{ 'day-off' : props.option.is_work != 1 }"
          >{{ props.option.day_text }}</span>
        </template>
        <span slot="noResult">Результатов не найдено</span>
        <span slot="placeholder">Выберите из списка</span>
      </multiselect>
      <div
        v-if="schedule !== null"
        class="schedule row"
      >
        <template v-if="schedule.is_work == 1">
          <div class="schedule__col">
            <div class="schedule__caption schedule__caption_special">
              часы работы
            </div>
            <div class="schedule__time">
              {{ schedule.from_time }} — {{ schedule.to_time }}
            </div>
          </div>
          <div class="schedule__col">
            <template v-if="schedule.break_from_time && schedule.break_to_time">
              <div
                class="schedule__caption"
              >
                перерыв
              </div>
              <div class="schedule__time">
                {{ schedule.break_from_time }} — {{ schedule.break_to_time }}
              </div>
            </template>
            <div v-else class="schedule__time">
              без перерыва
            </div>
          </div>
        </template>
        <div v-else class="schedule__col">
          <div class="schedule__time schedule__time_day-off">
            Выходной
          </div>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>

  import Multiselect from 'vue-multiselect'

  export default {
    components: {
      Multiselect
    },
    props: {
      containerClass: {
        type: String,
        default: ''
      },
      buttonClass: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        scheduleData: null,
        schedule: null
      }
    },
    computed: {
      pickpointId() {
        return this.$store.getters['pickpoints/officeIs'].id
      }
    },
    methods: {
      getSchedule() {

        const scheduleType = 3
        const days = 14

        this.$axios.get(`/api/pick-point-shedule/${ this.pickpointId }/${ scheduleType }/${ days }`)
          .then(response => {
            const data = response.data

            console.log('schedule', data)
            this.scheduleData = data
            this.schedule = data[0]
            this.$modal.show('schedule')
          })
          .catch(error => {
            console.log(error)
          })

      },
      
    }
  }
</script>