import Vue from 'vue'
import addDays from 'date-fns/addDays'
import '../node_modules/vue-airbnb-style-datepicker/dist/vue-airbnb-style-datepicker.css'
import AirBnbStyleDatepicker from '../node_modules/vue-airbnb-style-datepicker/dist/vue-airbnb-style-datepicker'

Vue.use(AirBnbStyleDatepicker, {
  sundayFirst: false,
  dateLabelFormat: 'dddd, MMMM D, YYYY',
  days: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
  daysShort: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
  monthNames: [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ],
  colors: {
    selected: '#1C69D4',
    inRange: '#1787E0',
    selectedText: '#fff',
    text: '#565a5c',
    inRangeBorder: '#1C69D4',
    disabled: '#fff',
    hoveredInRange: '#1787E0'
  },
  texts: {
    apply: 'Применить',
    cancel: 'Очистить',
    keyboardShortcuts: '',
  },
})