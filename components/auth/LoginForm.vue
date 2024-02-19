<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue'

const auth = useAuthStore()
const layout = useLayoutStore()

const checkbox = ref(false);

const loginForm: Ref<HTMLFormElement | null> = ref(null);

const form = ref({
    email: "",
    password: ""
});

const showErrorMessage = ref(false);

const rules = computed(() => {
    return {
        email: [
            (value: string) => !!value || "Email is required",
            (value: string) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value) || 'Email must be valid'
            }
        ],
        password: [
            (value: string) => !!value || "Password is required"
        ]
    }
})

async function handleLogin() {
    if (loginForm.value) {
        showErrorMessage.value = false;

        const formStatus = await loginForm.value.validate()
        if (!formStatus.valid) {
            return
        }
        if (auth.isLoggedIn) {
            return navigateTo("/");
        }

        layout.setOverlay(true)

        const { error } = await auth.login(form.value);
        layout.setOverlay(false)

        if (error.value) {
            showErrorMessage.value = true;
        } else {
            return navigateTo('/');
        }
    }

}

</script>

<template>
    <v-form ref="loginForm" class="mt-5" @submit.prevent="handleLogin">
        <label class="v-label text-subtitle-1 font-weight-medium pb-2 text-lightText">Email</label>
        <v-text-field variant="outlined" density="compact" v-model="form.email" :rules="rules.email"
            required></v-text-field>

        <label class="v-label text-subtitle-1 font-weight-medium pb-2 text-lightText">Password</label>
        <v-text-field type="password" variant="outlined" density="compact" v-model="form.password" :rules="rules.password"
            required></v-text-field>

        <div class="d-flex flex-wrap align-center my-3 ml-n2">
            <v-checkbox v-model="checkbox" label="Remeber this Device" hide-details density="compact"></v-checkbox>
            <div class="ml-sm-auto"><a aria-current="page" href="/auth/login"
                    class="router-link-active router-link-exact-active text-primary text-decoration-none text-body-1 opacity-1 font-weight-medium">Forgot
                    Password ?</a></div>
        </div>

        <v-btn block color="primary" type="submit">Sign In</v-btn>
        <v-alert class="mt-2" v-if="showErrorMessage" density="compact" type="error" :text="auth.errorMessage"></v-alert>
    </v-form>
</template>

<style scoped></style>
