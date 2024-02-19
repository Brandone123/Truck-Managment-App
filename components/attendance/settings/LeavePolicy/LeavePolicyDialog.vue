<template>
  <v-dialog v-model="dialog" scrollable width="800px">
    <template v-slot:activator="{ props }">
      <v-btn density="comfortable" color="primary" flat v-bind="props" class="text-none">
        <v-icon>mdi-plus</v-icon>
        Add Leave Policy
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
        <v-form ref="leavePolicyForm">
          <v-row class="my-4">
            <v-col cols="12" md="6" class="pb-0">
              <v-text-field v-model="leavePolicyInfo.name" variant="solo" flat label="Name" density="compact"
                :rules="[rules.required]"></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0">
              <v-text-field v-model="leavePolicyInfo.min_notice_period" type="number" variant="solo" flat label="Min notice period (Days)" density="compact"
                :rules="[rules.required]"></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0">
              <v-text-field v-model="leavePolicyInfo.annual_leave_days" type="number" variant="solo" flat label="Max annual leave days" density="compact"
                :rules="[rules.required]"></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0">
              <v-text-field v-model="leavePolicyInfo.effective_date" type="number" variant="solo" flat label="Effective from date (Years)" density="compact"
                :rules="[rules.required]"></v-text-field>
            </v-col>
            <v-col cols="12" class="pb-0">
              <v-textarea v-model="leavePolicyInfo.description" variant="solo" flat label="Description" density="compact"
                :rules="[rules.required]"></v-textarea>
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
import type { LeavePolicyInfo } from '@/types/attendance/leave_policy'

const emit = defineEmits(['update:show', 'addLeavePolicy', 'editLeavePolicy'])

const leavePolicyListStore = useLeavePolicyStore()

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



const leavePolicyForm = ref(null)
const leavePolicyInfo = ref<LeavePolicyInfo>({})

const title = computed(() => {
  return props.updating ? 'Leave Policy Info' : 'Create Leave Policy'
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
    leavePolicyListStore.updateLeavePolicy(leavePolicyInfo.value);
  } else {
    leavePolicyListStore.createLeavePolicy(leavePolicyInfo.value);
  }

  dialog.value = false;
};


const resetForm = () => {
  if (leavePolicyForm.value) {
    (leavePolicyForm.value as HTMLFormElement).reset(); // Reset the form
  }
  leavePolicyInfo.value = {}
}


watch(dialog, (val) => {
  if (val && props.updating) {
    leavePolicyInfo.value = props.item as LeavePolicyInfo
  } else {
    resetForm()
  }
})
</script>