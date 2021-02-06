<template>
  <div
    ref="component"
    class="un-form-files"
  >

    <div class="form__label">
      {{ label }}
      <span v-if="minCount">(обязательное)</span>
    </div>

    <div>
      <input 
        type="file" 
        class="input-file" 
        :name="name"
        :id="name"
        @change.prevent="fileUpload(false)"
      >
        <div
          id="name"
          class="un-form-files__container"
          :class="[(localError || v.$error || sizeError || typeError || (maxError && maxCount > 1)) ? 'un-form-files__container_error' : '', 'un-form-files__container-' + name]"
          ref="fileForm"
        >
          <label :for="name" class="un-form-files__label">
          
            <div 
              v-if="!over"
              class="un-form-files__choose-file"
            >
              <span>Выбрать файл</span>
            </div>

            <div 
              v-else
              class="un-form-files__over"
            >
              <span>Перетащите файл сюда</span>
            </div>
          </label>

          <div 
            v-if="files.length"
            class="un-form-files__loaded-files"
          >

            <div 
              class="un-form-files__files-list"
              :class="{
                'un-form-files__files-list_preview': preview
              }"
            >
              <div 
                v-for="(file, index) in files"
                :key="index"
                class="un-form-files__file"
                :class="{
                  'un-form-files__file_preview': preview
                }"
                
              >
                <div 
                  class="un-form-files__file-wrapper"
                  :class="{
                    'un-form-files__file-wrapper_preview': preview,
                    'un-form-files__file-wrapper_removable': removability,
                    'un-form-files__file-wrapper_deleted': file.deleted
                  }"
                  @click="fileOperation(index)"
                >
                  <div
                    v-if="preview"
                    class="un-form-files__img-block"
                  >

                    <img 
                      v-if="file.src"
                      class="preview"
                      :src="file.src"
                     >

                    <div 
                      v-if="file.progress > 0 && file.progress < 100"
                      class="un-form-files__preview_loading"
                    >
                      <progress class="un-form-files__progress" max="100" :value="file.progress"></progress>
                    </div>

                    <div 
                      v-if="removability"
                      class="un-form-files__preview_deleted"
                    >
                      <svg width="28" height="30" viewBox="0 0 28 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.5 27C3.5 28.6545 4.8455 30 6.5 30H21.5C23.1545 30 24.5 28.6545 24.5 27V9H27.5V6H21.5V3C21.5 1.3455 20.1545 0 18.5 0H9.5C7.8455 0 6.5 1.3455 6.5 3V6H0.5V9H3.5V27ZM9.5 3H18.5V6H9.5V3ZM21.5 9L21.5015 27H6.5V9H21.5Z" fill="#222222"></path>
                        <path d="M9.5 12H12.5V24H9.5V12ZM15.5 12H18.5V24H15.5V12Z" fill="#222222"></path>
                      </svg>
                    </div>
                    
                    <div
                      v-if="removability"
                      class="un-form-files__preview_hover"
                     >
                      <div class="">
                        <div>
                          <svg v-if="file.deleted" width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.75 4.5H8.25C9.4905 4.5 10.5 5.5095 10.5 6.75C10.5 7.9905 9.4905 9 8.25 9H6V10.5H8.25C10.3177 10.5 12 8.81775 12 6.75C12 4.68225 10.3177 3 8.25 3H3.75V0.75L0 3.75L3.75 6.75V4.5Z" fill="#222222"></path>
                          </svg>
                          <svg v-else width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.2502 0L6.99938 5.24954L1.74984 0L0 1.74985L5.24954 6.99938L0 12.2489L1.74984 13.9988L6.99938 8.74923L12.2502 13.9988L14 12.2489L8.75046 6.99938L14 1.74985L12.2502 0Z" fill="black"></path>
                          </svg>
                        </div>
                        <div>
                          <span v-if="file.deleted">восстановить</span>
                          <span v-else>удалить</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="un-form-files__inf"
                    :class="{
                      'un-form-files__inf_deleted': file.deleted && !preview,
                      'un-form-files__inf_no-preview': !preview,
                      'un-form-files__file-wrapper-short_removable': removability && !preview,
                      'un-form-files__inf_preview': preview
                    }"
                  >
                    <div class="un-form-files__tip">
                      <span v-if="!file.deleted">удалить файл</span>
                      <span v-else>восстановить файл</span>
                    </div>
                    <div class="un-form-files__name">{{ file.file.name }}</div>
                    <div class="un-form-files__size">[{{ (file.file.size > 1000000) ? (((file.file.size/1024)/1024).toFixed(1) + ' Мб') : ((file.file.size > 1000) ? ((file.file.size/1024).toFixed(1) + ' Кб') : (file.file.size + ' б')) }}]</div>
                    <div v-if="file.progress > 0 && file.progress < 100 && !preview">
                      <progress class="un-form-files__progress" max="100" :value="file.progress"></progress>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
            
          </div>

        </div>
    </div>


    <div class="un-form-files__description form__message">
      <span v-html="description"></span>
    </div>

    <div class="form__message_error" v-if="localErrorText || sizeError || typeError || maxError">
			<span v-if="localErrorText">
				{{ localErrorText }}
			</span>
      <span v-else-if="sizeError">
        Размер файла не должен превышать {{ (maxSize > 1000000) ? (((maxSize/1024)/1024).toFixed(1) + ' Мб') : ((maxSize > 1000) ? ((maxSize/1024).toFixed(1) + ' Кб') : (maxSize + ' б')) }}
      </span>
      <span v-else-if="typeError">
        Файлы этого формата недопустимы
      </span>
      <span v-else-if="maxError && maxCount > 1">
        Нельзя выбрать больше {{ maxCount }}
      </span>
		</div>

		<div class="form__message_error" v-if="(!$is_empty(v) && v.$error && v.$dirty && !disabled)">
			<span v-if="!v.requiredArrayLength">
				Данное поле обязательно для заполнения
			</span>
			<span v-else-if="!v.minArrayLength">
				Выбрать нужно как минимум {{ minCount }}
			</span>
		</div>
  
  </div>
</template>

<script>

  export default {
    components: {
    },
    props: {
      data: Object,

      name: String,
      error: {
        type: Boolean,
        default: false
      },
      error_text: String,
      label: String,
      description: String,
      disabled: {
        type: Boolean,
        default: false
      },
      minCount: Number,
      maxCount: Number,
      maxSize: Number,
      accept: String,
      preview: Boolean,
      removability: Boolean,
      add_url: String,
      value: Array,
      values: Array,
      over: Boolean,

      v: Object,
    },
    data() {
      return {
        vModalArray: [],

        loaderContainer: null,


        localErrorText: this.error_text,
        localError: this.error,
        sizeError: false,
        typeError: false,
        maxError: false,

        events: ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'],

        files: [],
        returnedFiles: []
      }
    },
    computed: {
      types() {
        if (!this.$is_empty(this.accept)) {
          return this.accept.split(',')
        }
        return []
      }
    },
    watch: {
    },
    created() {
      if (!this.$is_empty(this.values)) {
        for (let file of this.values) {
          this.files.push({
            isImg: (!this.$is_empty(file.src)),
            deleted: false,
            src: file.src,
            progress: 0,
            file: {
              name: file.name,
              size: file.size
            }
          })
          this.vModalArray.push(file.id)
        }
        this.$emit('input', this.vModalArray)
      }
    },
    mounted() {
      this.loaderContainer = document.querySelector('.un-form-files__container-' + this.name)

        this.events.forEach(function(evt) {
          this.$refs.fileForm.addEventListener(evt, this.addDefaultEvent)
        }.bind(this));

        let enterTarget = null;


        document.addEventListener('dragenter', this.dragEnter)

        document.addEventListener('dragleave', this.dragLeave)

        this.$refs.fileForm.addEventListener('drop', this.drop);
    },
    beforeDestroy() {
      this.events.forEach(function(evt) {
        this.$refs.fileForm.removeEventListener(evt, this.addDefaultEvent)
      }.bind(this));
      document.removeEventListener('dragenter', this.dragEnter)
      document.removeEventListener('dragleave', this.dragLeave)
      this.$refs.fileForm.removeEventListener('drop', this.drop);
    },
    methods: {
      drop() {
        this.fileUpload(event.dataTransfer.files)
        this.$emit('overFalse')
      },
      dragEnter() {
        this.$emit('overTrue')
      },
      dragLeave() {
        if (!event.fromElement) {
          this.$emit('overFalse')
        }
      },
      addDefaultEvent() {
        event.preventDefault();
        event.stopPropagation();
      },
      fileOperation(i) {

        if (!this.removability) return 

        if (!this.files[i].deleted) {
          this.removeFile(this.files[i].remove_url)
        } else {
          let data = new FormData()
          data.append("file", this.files[i].file)

          this.recoverFile(data, this.add_url)
        }
        this.files[i].deleted = !this.files[i].deleted
      },
      removeFile(url) {
        $.ajax({
          url: url,
          method: "DELETE",
          success: (status) => {
            if (status) {
              return true
            }
          }
        })
      },
      recoverFile(data, url) {
        $.ajax({
          method: "POST",
          url: url,
          data: data,
          dataType: 'json',
          processData: false,
          contentType : false,
        })
      },
      fileUpload(fls) {

        this.localErrorText = ''
        this.localError = false

        this.sizeError = false
        this.typeError = false
        this.maxError = false

      
        const files = (!this.$is_empty(fls)) ? fls : event.target.files 

        if (!files.length) {
          return
        }

        let data = new FormData()
        
        for (let i = 0; i < files.length; i++) {
          
          if (!this.$is_empty(this.types)) {
            let fit = false
            for (let type of this.types) {
              if (files[i].type == type) {
                fit = true
                break
              }
            }
            if (!fit) {
              this.typeError = true
              break
            }
          }

          if (!this.$is_empty(this.maxCount) && this.files.length == this.maxCount) {
            this.maxError = true
            if (this.maxCount > 1) break
          }

          if (!this.$is_empty(this.maxSize) && files[i].size > this.maxSize) {
            this.sizeError = true
            break
          }

          const index = this.files.length
          
          if (this.preview && files[i].type.includes('image') && (/\.(jpe?g|png|gif)$/i.test(files[i].name))) {
            let reader = new FileReader();
            reader.addEventListener("load", function() {
              if (!this.$is_empty(this.maxCount) && this.files.length == this.maxCount) {
                
                this.removeFile(this.files[0].remove_url)
                this.files[0].deleted = true

                this.files[0] = {
                  isImg: true,
                  deleted: false,
                  src: reader.result,
                  progress: 0,
                  file: files[i]
                }
              } else {
                this.files.push({
                  isImg: true,
                  deleted: false,
                  src: reader.result,
                  progress: 0,
                  file: files[i]
                })
              }

              data.append("file", this.files[this.files.length - 1].file)

              let vm = this

              this.$emit('fileUploadingStart')

              $.ajax({
                url: this.add_url,
                method: 'POST',
                data: data,
                dataType: 'json',
                processData: false,
                contentType : false,
                success: (data) => {

                  if (data.errors) {
                    this.files.pop()
                    this.localError = true
                    this.localErrorText = data.errors[0].title
                    return
                  }

                  if (!this.$is_empty(this.maxCount) && this.maxCount == 1 && index == this.maxCount) {
                    this.returnedFiles[0] = data
                    this.vModalArray[0] = data.id
                  } else {
                    this.returnedFiles.push(data)
                    this.vModalArray.push(data.id)
                  }

                  this.files[this.files.length - 1]['remove_url'] = data.remove_url

                  this.$emit('input', this.vModalArray)
                  this.$emit('fileUploadingOver')
                },
                xhr: function() {

                  var xhr = new window.XMLHttpRequest();

                  xhr.upload.addEventListener("progress", function(evt) {
                    if (evt.lengthComputable) {
                      var percentComplete = evt.loaded / evt.total;
                      percentComplete = parseInt(percentComplete * 100);
                      vm.files[vm.files.length - (i+1)].progress = percentComplete
                    }
                  }, false);
                  event.target.value = ''
                  return xhr;
                },
                error: (error) => {
                  this.$emit('fileUploadingOver')
                }
              })

            }.bind(this), false);
            reader.readAsDataURL(files[i]);
          } else {

            if (!this.$is_empty(this.maxCount) && this.files.length == this.maxCount) {
              
              this.removeFile(this.files[0].remove_url)
              this.files[0].deleted = true

              this.files[0]  = {
                isImg: false,
                deleted: false,
                src: '',
                progress: 0,
                file: files[i]
              }
            } else {
              this.files.push({
                isImg: false,
                deleted: false,
                src: '',
                progress: 0,
                file: files[i]
              })
            }

            data.append("file", this.files[this.files.length - 1].file)

            let vm = this

            this.$emit('fileUploadingStart')

            $.ajax({
              url: this.add_url,
              method: 'POST',
              data: data,
              dataType: 'json',
              processData: false,
              contentType : false,
              success: (data) => {

                if (data.errors) {
                  this.files.pop()
                  this.localError = true
                  this.localErrorText = data.errors[0].title
                  return
                }
                
                if (!this.$is_empty(this.maxCount) && this.maxCount == 1 && index == this.maxCount) {
                  this.returnedFiles[0] = data
                  this.vModalArray[0] = data.id
                } else {
                  this.returnedFiles.push(data)
                  this.vModalArray.push(data.id)
                }

                this.files[this.files.length - 1]['remove_url'] = data.remove_url

                this.$emit('input', this.vModalArray)
                this.$emit('fileUploadingOver')
              },
              xhr: function() {
                var xhr = new window.XMLHttpRequest();

                xhr.upload.addEventListener("progress", function(evt) {
                  if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total;
                    percentComplete = parseInt(percentComplete * 100);
                    vm.files[vm.files.length - (i+1)].progress = percentComplete
                  }
                }, false);
                event.target.value = ''
                return xhr;
              },
              error: (error) => {
                this.$emit('fileUploadingOver')
              }
            })
          }
        }
      },
    }
  }
</script>