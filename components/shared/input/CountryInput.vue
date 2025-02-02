<template>
  <v-autocomplete
    :variant="variant"
    :flat="flat"
    :density="density"
    :items="countries"
    item-value="iso2"
    item-title="name"
    v-model="data"
    :label="label"
    :rules="rules"
  />
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import {computed } from "vue";
import { storeToRefs } from "pinia";

const countryStore = useCountriesStore();
const { countries } = storeToRefs(countryStore);

const props = defineProps({
  variant: {
    type: String,
    default: "",
  },
  flat: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: "Country",
  },
  density: {
    type: String,
    default: "",
  },
  rules: {
    type: Array as PropType<any>,
    default: "",
  },
  modelValue: {
    type: String,
    required: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

onMounted(() => {
  countryStore.fetchCountries();
});

const data = computed({
  get() {
    return props.modelValue;
  },
  set(value: any) {
    emit("update:modelValue", value);
  },
});
</script>
