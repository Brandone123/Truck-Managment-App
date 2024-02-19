<template>
    <v-menu v-model="isMenuOpen" :close-on-content-click="false" transition="scale-transition">
        <template v-slot:activator="{ props }">
            <v-text-field :label="label" :model-value="formattedDate" readonly v-bind="props" :variant="variant"
                :density="density" :required="required" hide-details></v-text-field>
        </template>
        <!-- <v-card max-width="300px"> -->
            <v-date-picker v-model="selectedDate" hide-header :color="color" landscape>
                <template v-slot:header></template>
            </v-date-picker>
        <!-- </v-card> -->

    </v-menu>
</template>
  
<script setup>
import { ref, computed, defineProps, defineEmits } from "vue";

const { label, color, modelValue, density, required, variant } = defineProps([
    "label",
    "color",
    "modelValue",
    "density",
    "required",
    "variant"
]);
const emit = defineEmits(["update:modelValue"]);

const isMenuOpen = ref(false);
const selectedDate = ref(modelValue);

const formattedDate = computed(() => {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return selectedDate.value ? new Date(selectedDate.value).toLocaleDateString('en-US', options) : "";
});
</script>