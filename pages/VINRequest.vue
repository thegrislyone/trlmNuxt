<template>
  <div class="vin-request-page">
    
    <sticky-loader v-if="pageLoading" />
    
    <h1>{{ h1 }}</h1>

    <div class="title-animated">
      <span class="title-animated__base">
        <span class="title-animated-static">Бесплатн</span>
        <div class="title-animated-dynamic">
          <div class="title-animated__item">ая<span>&nbsp;Доставка</span></div>
          <div class="title-animated__item">ый<span>&nbsp;Подбор</span></div>
          <div class="title-animated__item">ый<span>&nbsp;Звонок</span></div>
        </div>
      </span>
      <span class="title-animated__base title-animated__base_mobile">
        <div class="title-animated-dynamic">
          <div class="title-animated__item">Доставка</div>
          <div class="title-animated__item">Подбор</div>
          <div class="title-animated__item">Звонок</div>
        </div>
      </span>
    </div>
    
    <div class="main-container">
      
      <div class="main-content">

        <form
          class="form vin-form"
          @submit.prevent="formSubmit"
          ref="form"
        >

          <form-group
            v-for="(value, name) in mainFields"
            :key="name"
            :class="value.class"
            :name="name"
            :form-group="value"
            :v="$v.form[name]"
            v-model.trim="$v.form[name].$model"
          ></form-group>

          <h3>Список запчастей</h3>

          <div
            v-for="(item, index) in addingGoods"
            :key="item.id"
            class="vin-form-group"
          >
            <input
              class="form__input"
              :class="{
                'form__input_required' : false,
                'form__input_error' : false
              }"
              type="text"
              v-model="addingGoods[index].name"
              placeholder="Название узла / масло / АКБ / шины"
            >
            <multiselect
              class="vin-form-group__select"
              v-model="addingGoods[index].type"
              :options="selectOptions"
              :searchable="false"
              :show-labels="false"
              :hide-selected="false"
              :allow-empty="false"
              placeholder="Не выбран"
            ></multiselect>
            <quantity-input
              class="vin-form-group__quantity"
              v-model="addingGoods[index].count"
              :min="0"
              :removable="true"
              @change="quantityChange(item.id, $event)"
            ></quantity-input>
          </div>

          <button
            class="btn btn_small btn_border btn_black"
            type="button"
            @click="addItem"
          >
            добавить
          </button>

          <div class="vin-form__btn-group">
            <div class="form__agreement">
              Нажимая кнопку «Отправить запрос», <a href="#">я соглашаюсь на обработку персональных данных</a> в соответствии с <a href="#">политикой конфиденциальности</a>
            </div>
            <button
              class="vin-form__btn btn"
              type="submit"
            >
              <div
                v-if="formLoading"
                class="button-preloader"
              >
                <div class="preloader-btn preloader-btn_white"></div>
              </div>
              <template v-else>Отправить запрос</template>
            </button>
          </div>

        </form>

        <div
          v-if="successMessage.length"
          class="message message_succsess"
        >
          {{ successMessage }}
        </div>
        
      </div>
      
    </div>

  </div>
</template>

<script>

  import { required, minLength } from 'vuelidate/lib/validators'
  import FormGroup from '../components/FormGroup.vue'
  import Multiselect from 'vue-multiselect'
  import QuantityInput from '../components/QuantityInput.vue'
  import Cookies from 'js-cookie'

  export default {
    components: {
      FormGroup, Multiselect, QuantityInput
    },
    data() {
      return {
        h1: 'VIN-запрос',
        pageLoading: false,
        formLoading: false,
        mainFields: {
          vin: {
            description: "",
            label: "VIN",
            required: "required",
            type: "text",
            value: null
          },
          file: {
            description: "",
            label: "Загрузить фото с VIN (не более 5Мб)",
            required: null,
            type: "file",
            value: null
          },
          phone: {
            class: "form-group_half",
            description: "",
            label: "Телефон",
            required: "required",
            type: "phone",
            value: null
          },
          name: {
            class: "form-group_half",
            description: "",
            label: "Имя",
            required: null,
            type: "text",
            value: null
          }
        },
        form: {
          vin: '',
          file: '',
          phone: '',
          name: ''
        },
        file: null,
        addingGoodsId: 0,
        addingGoods: [],
        selectOptions: [
          'Оригинал', 'Заменитель', 'Любой'
        ],
        successMessage: ''
      }
    },
    validations: {
      form: {
        vin: {
          required
        },
        file: {},
        phone: {
          required,
          minLength: minLength(10)
        },
        name: {}
      }
    },
    methods: {

      async formSubmit() {

        if (this.formLoading) {
          return
        }

        this.formLoading = true
        this.successMessage = ''

        this.$v.form.$touch()

        if (this.$v.form.$invalid) {
          this.formLoading = false
          return
        }

        let request = {}

        let formData = new FormData()

        for (let key in this.form) {
          if (key !== 'file') {
            if (key === 'phone') {
              formData.append(key, '+7' +  this.form[key])
            } else {
              formData.append(key, this.form[key])
            }
          }
        }

        let i = 0

        this.addingGoods.forEach(element => {
          for (let key in element) {
            formData.append(`list[${i}][${key}]`, element[key])
          }
          i++
        })

        if (this.file) {
          formData.append('file', this.file)
        }

        const pick_point = Cookies.get('pick_point_id') || 0

        formData.append('pick_point', pick_point)

        console.log('formData', formData)

        try {
          const response = await fetch('/api/vin-request', {
            method: 'POST',
            body: formData
          })
          const result = await response.json()
          this.formLoading = false
          this.successMessage = result.success
        } catch (error) {
          console.error('Ошибка:', error)
        }

      },
      addItem() {
        const newItem = {
          id: this.addingGoodsId,
          name: '',
          type: 'Оригинал',
          count: 1
        }
        this.addingGoods.push(newItem)
        this.addingGoodsId++
      },
      quantityChange(id, count) {
        if (count === 0) {
          this.addingGoods = this.addingGoods.filter(item => item.id !== id)
        }
      }
    },
    created () {

      this.addItem()

    }
  }
</script>