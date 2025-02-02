<template>
  <v-text-field
    :variant="variant"
    :flat="flat"
    :density="density"
    v-model="data"
    :label="label"
    :rules="rules"
  ></v-text-field>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import { computed } from "vue";
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
    default: "Phone number",
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
  country: {
    type: String,
    required: false,
  },
  contact_phone: {
    type: String,
    required: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

watch(
  () => props.country,
  (newCountry) => {
    const selectedCountry = countries.value.find(
      (item) => item.iso2 === newCountry
    );
    if (selectedCountry) {
      data.value = `${selectedCountry.emoji} +${selectedCountry.phonecode}`;
    }
  }
);

const data = computed({
  get() {
    return props.modelValue;
  },
  set(value: any) {
    emit("update:modelValue", value);
  },
});
</script>
