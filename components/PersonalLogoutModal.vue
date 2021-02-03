<template>
    <modal
        name="logout-modal"
        :classes="['modal','personal__logout-modal']"
        :adaptive="true"
        :height="'auto'"
        :scrollable="true"
        :max-width="356"
        :pivot-y="0"
        @closed="logOutRedirect"
    >
        <div v-if="logoutLoading" class="preloader">
            <div class="preloader-btn"></div>
        </div>

        <div v-else>
            <i 
            class="modal__close close-btn"
            @click="logOutRedirect"
            ></i>
            <div>
            <h2>Выход</h2>
            <p>{{ outSuccess }}</p>
            <button 
                class="personal__logout-btn btn"
                @click="logOutRedirect"
            >На главную страницу</button>
            </div>
        </div>
    </modal>
</template>

<script>
export default {
    props: {
        logoutLoading: Boolean,
        outSuccess: String
    },
    methods: {
        logOutRedirect() {
            this.$emit('logOutRedirect')
        }
    }
}
</script>