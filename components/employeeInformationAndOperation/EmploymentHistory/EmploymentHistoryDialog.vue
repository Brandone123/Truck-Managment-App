<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, computed, toRefs, watch, } from 'vue'
import type { Ref, PropType } from 'vue'
import type { EmploymentHistoryInfo } from '~/types/employeeInformationAndOperation/employment_history'
import type { PositionInfo } from '~/types/employeeInformationAndOperation/position'

const emit = defineEmits(['update:show', 'bulkActionSuccess'])

const employmentHistoryStore = useEmploymentHistoryStore()

const employeeStore = useEmployeeStore()
const { employeeList } = storeToRefs(employeeStore)

const positionStore = usePositionStore()
const { positionList } = storeToRefs(positionStore)

const departmentStore = useDepartmentStore()
const { departmentList } = storeToRefs(departmentStore)

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
  },
  bulkUpdating: {
    type: Boolean,
    default: false,
  },
  bulkUpdateIds: {
    type: Array<Number>,
    default: []
  },
  selectedEmployeeId: {
    type: [Number, null] as PropType<number | null>, //type defined as number or null
    default: null
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

const employmentHistoryForm: Ref<HTMLFormElement | null> = ref(null);
const employmentHistory = ref<EmploymentHistoryInfo>({})

const title = computed(() => {

  if (props.bulkUpdating) {
    return "Bulk Update Employment History Info"
  }

  return props.updating ? 'Employment History Info' : 'Add Employment History'
})

const saveButtonText = computed(() => {
  return (props.updating || props.bulkUpdating) ? 'Update' : 'Save'
})

const rules = computed(() => {
  return {
    required: (value: string) => !!value || 'Field is required',
  }
})

const getPosition = (positionId: number) => {
  return positionList.value.find((position: PositionInfo) => position.id == positionId)
}

const filteredPositionList = computed(() => {
  return positionList.value.filter((position: PositionInfo) => position.department_id == currentDepartmentId.value)
})

const currentDepartmentId = ref<number | null>(null)

const save = async () => {
  if (employmentHistoryForm.value) {
    const formStatus = await employmentHistoryForm.value.validate()
    if (!formStatus.valid) {
      return
    }

    if (props.bulkUpdating && props.bulkUpdateIds.length) {
      
      // get all non null values from employment history
      let updateData = Object.fromEntries(
        Object.entries(employmentHistory.value).filter(([key,value])=>value !== null)
      )

      const { success, error } = await employmentHistoryStore.bulkUpdateEmploymentHistory({ ids: props.bulkUpdateIds, data: updateData })
      if (success) {
        emit('bulkActionSuccess')
      }
    }
    else {
      if (props.updating) {
        employmentHistoryStore.updateEmploymentHistory(employmentHistory.value);
      } else {
        employmentHistoryStore.createEmploymentHistory(employmentHistory.value)
      }
    }
    dialog.value = false;
  }
};

const resetForm = () => {
  if (employmentHistoryForm.value) {
    (employmentHistoryForm.value as HTMLFormElement).reset(); // Reset the form
  }
  employmentHistory.value = {}
}


watch(dialog, (val) => {
  if (val && props.updating) {
    currentDepartmentId.value = getPosition(props.item?.position_id)?.department_id || null
    nextTick(() => {
      employmentHistory.value = props.item as EmploymentHistoryInfo
    })
  } else {
    resetForm()

    if (props.selectedEmployeeId) {
      employmentHistory.value.employee_id = props.selectedEmployeeId
    }
  }
})

// reset position_id when currentDepartmentId (filter) is updated
watch(currentDepartmentId, (newVal, oldVal) => {
  employmentHistory.value.position_id = null
})

// clear reason for leaving when end_date is removed
watch(() => employmentHistory.value.end_date, (newVal, oldVal) => {
  if (!newVal) {
    employmentHistory.value.reason_for_leaving = null
  }
}, { deep: true })

</script>

<template>
  <v-dialog v-model="dialog" width="800px">
    <template v-slot:activator="{ props }">
      <v-btn density="comfortable" color="primary" flat v-bind="props" class="text-none">
        <v-icon>mdi-plus</v-icon>
        Add History
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
        <v-form ref="employmentHistoryForm">
          <v-row>
            <v-col cols="12" class="pb-0">
              <v-autocomplete v-model="employmentHistory.employee_id" :items="employeeList" variant="solo" flat
                label="Employee" density="compact" item-title="full_name" item-value="id" :rules="[rules.required]"
                readonly></v-autocomplete>
            </v-col>

            <v-col cols="12" md="6" class="pb-0">
              <v-autocomplete v-model="currentDepartmentId" :items="departmentList" variant="solo" flat
                label="Department" density="compact" item-title="name" item-value="id"
                :rules="bulkUpdating ? [] : [rules.required]"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-autocomplete>
            </v-col>


            <v-col cols="12" md="6" class="pb-0">
              <v-autocomplete :disabled="!currentDepartmentId" v-model="employmentHistory.position_id"
                :items="filteredPositionList" variant="solo" flat label="Position" density="compact" item-title="title"
                item-value="id" :rules="bulkUpdating ? [] : [rules.required]"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-autocomplete>
            </v-col>

            <v-col cols="12" md="6" class="pb-0">
              <v-text-field type="date" v-model="employmentHistory.start_date" variant="solo" flat label="Start Date"
                density="compact" :rules="bulkUpdating ? [] : [rules.required]"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-text-field>
            </v-col>


            <v-col cols="12" md="6" class="pb-0">
              <v-text-field type="date" label="End Date" v-model="employmentHistory.end_date" variant="solo" flat
                density="compact" clearable :placeholder="bulkUpdating ? 'Original' : ''"></v-text-field>
            </v-col>

            <v-col cols="12" class="pb-0" v-if="employmentHistory.end_date">
              <v-textarea label="Reason For Leaving" v-model="employmentHistory.reason_for_leaving" variant="solo" flat
                density="compact" :rules="[rules.required]"
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
