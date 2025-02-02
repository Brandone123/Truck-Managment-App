<template>
  <v-dialog v-model="dialog" max-width="800px" scrollable>
    <v-card>
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ draftEvent.id ? 'Edit Meeting' : 'New Meeting' }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form>
          <div v-if="draftEvent">
            <v-row>
              <v-col cols="12">
                <v-text-field density="comfortable" label="Meeting Title" v-model="draftEvent.title" variant="outlined"
                  hide-details />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field density="comfortable" label="Start Time" v-model="draftEvent.start" variant="outlined"
                  hide-details class="mb-3" type="datetime-local" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field density="comfortable" label="End Time" v-model="draftEvent.end" variant="outlined"
                  hide-details class="mb-3" type="datetime-local" />
              </v-col>
              <v-col cols="12">
                <v-text-field density="comfortable" label="Online Meeting Link" v-model="draftEvent.meetingLink"
                  variant="outlined" hide-details />
              </v-col>
              <v-col cols="12">
                <v-checkbox density="comfortable" label="Recurring Meeting?" v-model="draftEvent.isRecurring"
                  hide-details />
              </v-col>
              <v-col cols="12">
                <v-select density="comfortable" label="Attendees" :items="attendeesList" v-model="draftEvent.attendees"
                  multiple variant="outlined" hide-details />
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

// Define an interface or reuse from a shared .ts file
interface MeetingEventIso {
  id: string | null
  title: string
  start: string
  end: string
  color?: string
  meetingLink?: string
  isRecurring?: boolean
  attendees?: string[]
}

// Props
const props = defineProps<{
  modelValue: boolean
  // The "event" to edit or create. 
  // If null, we treat it as "no data yet".
  eventData: Partial<MeetingEventIso>
  attendeesList: string[]
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', event: MeetingEventIso): void
}>()

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
const draftEvent = ref<Partial<MeetingEventIso>>({})

// Watch for changes from parent so we can re-initialize the dialog data
watch(() => dialog.value, newVal => {
  if (newVal) {
    // If dialog is opening, sync local data from props.eventData
    if (props.eventData) {
      // Deep clone if needed, or just shallow copy
      draftEvent.value = {
        ...props.eventData,
        start: moment(props.eventData.start)?.format('YYYY-MM-DDTHH:mm'),
        end: moment(props.eventData.end)?.format('YYYY-MM-DDTHH:mm')
      }
    } else {
      // no data
      draftEvent.value = {} as Partial<MeetingEventIso>
    }
  }
})


const onSave = () => {
  if (!draftEvent.value) {
    // Should not happen if the dialog is open and we had to fill data
    return
  }

  // Emit "save" with updated event
  emits('save', {
    ...draftEvent.value,
    start: new Date(draftEvent.value.start as string).toISOString(),
    end: new Date(draftEvent.value.end as string).toISOString()
  })
  dialog.value = false
}
</script>
