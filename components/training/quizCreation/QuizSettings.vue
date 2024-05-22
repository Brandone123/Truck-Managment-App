<template>`
  <v-form ref="settingsForm" v-model="valid">
    <v-row>
      <v-col cols="12" md="4">
        <!-- Passing Score -->
        <v-text-field v-model="settings.passingScore" label="Passing Score (%)" type="number"
          :rules="[rules.required, rules.percentage]" prepend-inner-icon="mdi-percent" density="comfortable"
          variant="outlined"></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <!-- Time Limit -->
        <v-text-field v-model="settings.timeLimit" label="Time Limit (minutes)" type="number"
          :rules="[rules.required, rules.positive]" prepend-inner-icon="mdi-timer" density="comfortable"
          variant="outlined"></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <!-- Attempts Allowed -->
        <v-text-field v-model="settings.attemptsAllowed" label="Attempts Allowed" type="number"
          :rules="[rules.required, rules.positive]" prepend-inner-icon="mdi-redo-variant" density="comfortable"
          variant="outlined"></v-text-field>
      </v-col>
    </v-row>
    <!-- <v-btn color="primary" @click="saveSettings" density="comfortable" class="text-none">Save Settings</v-btn> -->
  </v-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['update-settings'])

const props = defineProps({
  settings: Object
});

const valid = ref(true);
const settings = ref(props.settings || {
  passingScore: 50,
  timeLimit: 30,
  attemptsAllowed: 3
});

const rules = {
  required: (value: any) => !!value || 'Required.',
  percentage: (value: number) => value >= 0 && value <= 100 || 'Must be between 0 and 100.',
  positive: (value: number) => value > 0 || 'Must be positive.'
};

const saveSettings = () => {
  if (valid.value) {
    // Emit an event to the parent component with the updated settings
    emit('update-settings', settings.value);
  }
};
</script>