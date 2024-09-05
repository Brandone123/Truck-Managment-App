<template>
  <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" max-width="800px" max-heigth="500px"
    scrollable>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form ref="reportForm">
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field variant="solo" flat density="compact" label="Report Name" v-model="localReport.name"
                required></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select variant="solo" flat density="compact" label="Report Type"
                :items="['Maintenance Cost', 'Asset Performance', 'Downtime']" v-model="localReport.type"
                required></v-select>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="closeDialog">Cancel</v-btn>
        <v-btn color="primary" @click="saveReport">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import type { Report } from '@/types/maintenance/reportTypes';

const props = defineProps({
  modelValue: Boolean,
  report: {
    type: Object as any,
    default: () => ({
      id: null,
      name: '',
      type: 'Maintenance Cost',
      generatedDate: '',
      summary: '',
      status: 'Pending',
      notes: '',
    }),
  },
});

let authStore = useAuthStore()
let { user } = storeToRefs(authStore)

const emit = defineEmits(['update:modelValue', 'close', 'save']);

const localReport = ref<Report>({ ...props.report });

const title = computed(() => (props.report && props.report.id ? 'Edit Report' : 'Generate Report'));

watch(
  () => props.report,
  (newReport) => {
    localReport.value = { ...newReport };
  }
);

const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value);
};

const closeDialog = () => {
  emit('update:modelValue', false);
  emit('close');
};

const saveReport = () => {
  let payload = localReport.value
  payload.generated_by = (useAuthStore().user?.id || 1) as number;
  payload.generated_date = new Date().toISOString().substring(0, 10)
  emit('save', payload);
  emit('update:modelValue', false);
  emit('close');
};
</script>