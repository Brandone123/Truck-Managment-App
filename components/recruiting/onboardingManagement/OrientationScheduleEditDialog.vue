<template>
  <v-dialog v-model="dialog" max-width="800px" scrollable>
    <v-card>
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ currentSchedule.id ? 'Edit Schedule' : 'New Schedule' }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="scheduleForm">
          <div v-if="currentSchedule">
            <v-row>
              <v-col cols="12">
                <ApplicationAutocompleteInput :rules="[validation.required]" density="comfortable" label="Applications*"
                  v-model="currentSchedule.application_ids" multiple variant="outlined" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field :rules="[validation.required]" density="comfortable" label="Schedule Title*"
                  v-model="currentSchedule.title" variant="outlined" />
              </v-col>

             
              <v-col cols="12" md="6">
                <v-select label="Type*" :items="['onboarding', 'interview']" v-model="currentSchedule.schedule_type"
                  :rules="[validation.required]" density="comfortable" variant="outlined"></v-select>
              </v-col>
              
              <v-col cols="12" v-if="currentSchedule.schedule_type">
                <EmployeeAutoCompleteInput variant="outlined" density="comfortable" v-model="currentSchedule.hosts"
                  item-value="id" :label="currentSchedule.schedule_type === 'Onboarding' ? 'Moderator*' : 'Interviewers*'"
                  color="primary" :rules="[validation.required]" multiple/>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-text-field :rules="[validation.required, validateStartTime]" density="comfortable"
                  label="Start Time*" v-model="currentSchedule.start" variant="outlined" type="datetime-local" />
              </v-col>
            
              <v-col cols="12" md="6">
                <v-text-field :rules="[validation.required, validateEndTime]" density="comfortable" label="End Time*"
                  v-model="currentSchedule.end" variant="outlined" type="datetime-local"
                  :disabled="!currentSchedule.start" />
              </v-col>
              
              <v-col cols="12" md="6">
                <v-select label="Status*" :items="statusOptions" v-model="currentSchedule.status"
                  :rules="[validation.required]" density="comfortable" variant="outlined"></v-select>
              </v-col>
            </v-row>
          </div>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer />
        <v-btn color="secondary" @click=" dialog = false">Cancel</v-btn>
        <v-btn color="primary" @click="onSave">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed, defineProps, defineEmits } from 'vue'
import moment from 'moment'
import type { OrientationSchedule } from '@/types/recruiting/onboardingOrientation';
import { useValidation } from '@/composables/formValidation.ts'
import ApplicationAutocompleteInput from '@/components/recruiting/applicationManagement/components/ApplicationAutocompleteInput.vue';
import EmployeeAutoCompleteInput from '~/components/shared/input/EmployeeAutoCompleteInput.vue';

const validation = useValidation()

// Props
const props = defineProps<{
  modelValue: boolean
  // The "event" to edit or create. 
  // If null, we treat it as "no data yet".
  eventData: Partial<OrientationSchedule>
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', event: OrientationSchedule): void
}>()


const scheduleForm = ref<HTMLFormElement | null>(null)
const statusOptions = ['Scheduled', 'Completed', 'Cancelled'];

// Local state
const dialog = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emits('update:modelValue', val)
  }
})

// We keep a local draft of the event
const currentSchedule = ref<Partial<OrientationSchedule>>({})

// Watch for changes from parent so we can re-initialize the dialog data
watch(() => dialog.value, newVal => {
  if (newVal) {
    // If dialog is opening, sync local data from props.eventData
    if (props.eventData) {
      // Deep clone if needed, or just shallow copy
      currentSchedule.value = {
        ...props.eventData,
        start: moment(props.eventData.start)?.format('YYYY-MM-DDTHH:mm'),
        end: moment(props.eventData.end)?.format('YYYY-MM-DDTHH:mm')
      }
    } else {
      // no data
      currentSchedule.value = {} as Partial<OrientationSchedule>
    }
  }
})

// Validation rules
const validateStartTime = (value: string) => {
  if (!value) return true;
  const now = moment().format('YYYY-MM-DDTHH:mm');
  return value >= now || 'Start Time cannot be in the past.';
}

const validateEndTime = (value: string) => {
  if (!value) return true;
  if (!currentSchedule.value.start) return 'Start Time must be selected first.';
  return value > currentSchedule.value.start || 'End Time must be after Start Time.';
}

const onSave = async () => {
  const formStatus = await scheduleForm.value?.validate();
  if (!formStatus.valid) return;

  // Emit "save" with updated event
  emits('save', {
    ...currentSchedule.value,
    start: new Date(currentSchedule.value.start as string).toISOString(),
    end: new Date(currentSchedule.value.end as string).toISOString()
  })
  dialog.value = false
}
</script>