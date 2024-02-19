<script setup lang="ts">
import { ref } from 'vue';
import {useAuthStore} from "~/stores/useAuthStore";
const checkbox = ref(true);

const form = ref({
    name: "",
    email: "",
    password: "",
    password_confirmation: ""

});

const auth = useAuthStore();
const isLoading = ref(false);

function isValidEmail(email : string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function formIsValid() {
  if (!form.value.name || !form.value.email || !form.value.password || !form.value.password_confirmation) {
    alert('Please fill in all fields');
    return false;
  }

  if (!isValidEmail(form.value.email)) {
    alert('Please enter a valid email address');
    return false;
  }

  if (form.value.password !== form.value.password_confirmation) {
    alert('Password and password confirmation do not match');
    return false;
  }

  return true;
}

async function handleRegister() {
  if (!formIsValid()) {
    return;
  }

  isLoading.value = true; 
  const { error } = await auth.register(form.value);
  isLoading.value = false; 

  if (!error.value) {
    isLoading.value = false; 
    navigateTo('/');
  }
}
</script>

<template>
    <form @submit.prevent="handleRegister">
        <v-row class="d-flex mb-3">
            <v-col cols="12">
                <v-label class="font-weight-bold mb-1">Name</v-label>
                <v-text-field v-model="form.name" variant="outlined" hide-details color="primary"></v-text-field>
            </v-col>
            <v-col cols="12">
                <v-label class="font-weight-bold mb-1">Email Address</v-label>
                <v-text-field v-model="form.email" variant="outlined" type="email" hide-details color="primary"></v-text-field>
            </v-col>
            <v-col cols="12">
                <v-label class="font-weight-bold mb-1">Password</v-label>
                <v-text-field v-model="form.password" variant="outlined" type="password"  hide-details color="primary"></v-text-field>
            </v-col>
            <v-col cols="12">
                <v-label class="font-weight-bold mb-1">Confirm Password</v-label>
                <v-text-field v-model="form.password_confirmation" variant="outlined" type="password"  hide-details color="primary"></v-text-field>
            </v-col>
            <v-col cols="12" >
                <v-btn type="submit" color="primary" size="large" block   flat>Sign up</v-btn>
            </v-col>
        </v-row>
        <div class="overlay" v-if="isLoading">
              <v-progress-circular :size="70" :width="7" color="primary" indeterminate></v-progress-circular>
          </div>
    </form>
</template>

<style scoped>
  .v-progress-circular {
    margin: 1rem;
  }
  
.overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
