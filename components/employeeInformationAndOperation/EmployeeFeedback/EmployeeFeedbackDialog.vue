<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, computed, toRefs, watch, } from 'vue'
import type { Ref, PropType } from 'vue'
import type { EmployeeFeedbackInfo } from '~/types/employeeInformationAndOperation/employee_feedback';

const emit = defineEmits(['update:show', 'bulkActionSuccess'])

const authStore = useAuthStore()
const employeeFeedbackStore = useEmployeeFeedbackStore()

const props = defineProps({
  item: {
    type: Object,
    required: false,
  },
  updating: {
    type: Boolean,
    default: false
  },
  bulkUpdating: {
    type: Boolean,
    default: false,
  },
  bulkUpdateIds: {
    type: Array<Number>,
    default: []
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

const employeeFeedbackForm: Ref<HTMLFormElement | null> = ref(null);
const employeeFeedback = ref<EmployeeFeedbackInfo>({})

const title = computed(() => {
  if (props.bulkUpdating) {
    return "Bulk Update Feedback"
  }

  return props.updating ? 'Feedback Info' : 'Add Feedback'
})

const saveButtonText = computed(() => {
  return (props.updating || props.bulkUpdating) ? 'Update' : 'Save'
})

const rules = computed(() => {
  return {
    required: (value: string) => !!value || 'Field is required',
  }
})

const save = async () => {
  if (employeeFeedbackForm.value) {
    const formStatus = await employeeFeedbackForm.value.validate()
    if (!formStatus.valid) {
      return
    }

    if (props.bulkUpdating && props.bulkUpdateIds.length) {

      // get all non null values from employee compensation
      let updateData = Object.fromEntries(
        Object.entries(employeeFeedback.value).filter(([key, value]) => value !== null)
      )

      const { success, error } = await employeeFeedbackStore.bulkUpdateEmployeeFeedback({ ids: props.bulkUpdateIds, data: updateData })
      if (success) {
        emit('bulkActionSuccess')
      }
    }
    else {
      if (props.updating) {
        employeeFeedbackStore.updateEmployeeFeedback(employeeFeedback.value);
      } else {
        if (authStore?.user?.employee?.id) {
          employeeFeedback.value.employee_id = authStore.user.employee.id
          employeeFeedback.value.resolved = false
          employeeFeedbackStore.createEmployeeFeedback(employeeFeedback.value)
        }
      }
    }
    dialog.value = false;
  }
};

const resetForm = () => {
  if (employeeFeedbackForm.value) {
    (employeeFeedbackForm.value as HTMLFormElement).reset(); // Reset the form
  }
  employeeFeedback.value = {}
}


watch(dialog, (val) => {
  if (val && props.updating) {
    employeeFeedback.value = props.item as EmployeeFeedbackInfo
  } else {
    resetForm()
  }
})
</script>

<template>
  <v-dialog v-model="dialog" width="800px">
    <template v-slot:activator="{ props }">
      <v-btn density="comfortable" color="primary" flat v-bind="props" class="text-none">
        <v-icon>mdi-plus</v-icon>
        Add Feedback
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
        <v-form ref="employeeFeedbackForm">
          <v-row>
            <v-col cols="12" class="pb-0">
              <v-textarea label="Content" v-model="employeeFeedback.content" variant="solo" flat density="compact"
                :rules="bulkUpdating ? [] : [rules.required]"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-textarea>
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
