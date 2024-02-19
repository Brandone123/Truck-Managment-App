<template>
  <v-dialog v-model="dialog" scrollable width="800px">
    <template v-slot:activator="{ props }">
      <v-btn density="comfortable" color="primary" flat v-bind="props" class="text-none">
        <v-icon>mdi-plus</v-icon>
        Add Leave Type
      </v-btn>
    </template>
    <v-card class="grey-background">
      <v-toolbar color="primary" :title="title" density="compact">
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-window-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form ref="leaveTypeForm">
          <v-row class="my-4">
            <v-col cols="12" md="6" class="pb-0">
              <v-text-field v-model="leaveTypeInfo.name" variant="solo" flat label="Name" density="compact"
                :rules="[rules.required]"></v-text-field>
            </v-col>

            <SharedColorPicker :value="(leaveTypeInfo.color as string)" @selectColor="updateColor"></SharedColorPicker>

            <v-col cols="12" class="pb-0">
              <v-textarea v-model="leaveTypeInfo.description" variant="solo" flat label="Description"
                density="compact"></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="save">{{ saveButtonText }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, computed, toRefs, watch } from 'vue'
import type { LeaveTypeInfo } from '@/types/attendance/leave_type'

const emit = defineEmits(['update:show', 'addLeaveType', 'editLeaveType'])

const leaveTypeListStore = useLeaveTypeStore()

const props = defineProps({
  item: {
    type: Object,
    required: false,
  },
  updating: {
    type: Boolean,
    default: false
  },
  show: {
    type: Boolean,
    default: false
  }
});

const dialog = computed({
  get() {
    return props.show
  },
  set(newValue) {
    emit('update:show', newValue);
  }
})

function updateColor(color: string) {
  leaveTypeInfo.value.color = color
}

const leaveTypeForm = ref(null)
const leaveTypeInfo = ref<LeaveTypeInfo>({})

const title = computed(() => {
  return props.updating ? 'Leave Type Info' : 'Create Leave Type'
})

const saveButtonText = computed(() => {
  return props.updating ? 'update' : 'Save'
})

const rules = computed(() => {
  return {
    required: (value: string) => !!value || 'Field is required',
  }
})

const save = () => {
  if (props.updating) {
    leaveTypeListStore.updateLeaveType(leaveTypeInfo.value);
  } else {
    leaveTypeListStore.createLeaveType(leaveTypeInfo.value);
  }

  dialog.value = false;
};


const resetForm = () => {
  if (leaveTypeForm.value) {
    (leaveTypeForm.value as HTMLFormElement).reset(); // Reset the form
  }
  leaveTypeInfo.value = {}
}


watch(dialog, (val) => {
  if (val && props.updating) {
    leaveTypeInfo.value = props.item as LeaveTypeInfo
  } else {
    resetForm()
  }
})
</script>