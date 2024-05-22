<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, computed, toRefs, watch, } from 'vue'
import type { Ref, PropType } from 'vue'
import type { EmployeeCompensationInfo } from '~/types/employeeInformationAndOperation/employee_compensation'

const emit = defineEmits(['update:show', 'bulkActionSuccess'])

const employeeCompensationStore = useEmployeeCompensationStore()

const employeeStore = useEmployeeStore()
const { employeeList } = storeToRefs(employeeStore)

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

// TODO: abstract into a table in settings which can be updated
const compensationTypeList = ref([
  'salary', 'bonus'
])

const dialog = computed({
  get() {
    return props.show
  },
  set(newValue) {
    emit('update:show', newValue);
  }
})

const employeeCompensationForm: Ref<HTMLFormElement | null> = ref(null);
const employeeCompensation = ref<EmployeeCompensationInfo>({})

const title = computed(() => {

  if (props.bulkUpdating) {
    return "Bulk Update Compensation"
  }

  return props.updating ? 'Compensation Info' : 'Add Compensation'
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
  if (employeeCompensationForm.value) {
    const formStatus = await employeeCompensationForm.value.validate()
    if (!formStatus.valid) {
      return
    }
    if (props.bulkUpdating && props.bulkUpdateIds.length) {

      // get all non null values from employee compensation
      let updateData = Object.fromEntries(
        Object.entries(employeeCompensation.value).filter(([key, value]) => value !== null)
      )

      const { success, error } = await employeeCompensationStore.bulkUpdateEmployeeCompensation({ ids: props.bulkUpdateIds, data: updateData })
      if (success) {
        emit('bulkActionSuccess')
      }
    }
    else {
      if (props.updating) {
        employeeCompensationStore.updateEmployeeCompensation(employeeCompensation.value);
      } else {
        employeeCompensationStore.createEmployeeCompensation(employeeCompensation.value)
      }
    }
    dialog.value = false;
  }
};

const resetForm = () => {
  if (employeeCompensationForm.value) {
    (employeeCompensationForm.value as HTMLFormElement).reset(); // Reset the form
  }
  employeeCompensation.value = {}
}


watch(dialog, (val) => {
  if (val && props.updating) {
    employeeCompensation.value = props.item as EmployeeCompensationInfo
  } else {
    resetForm()

    if (props.selectedEmployeeId) {
      employeeCompensation.value.employee_id = props.selectedEmployeeId
    }
  }
})

</script>

<template>
  <v-dialog v-model="dialog" width="500px">
    <template v-slot:activator="{ props }">
      <v-btn density="comfortable" color="primary" flat v-bind="props" class="text-none">
        <v-icon>mdi-plus</v-icon>
        Add Compensation
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
        <v-form ref="employeeCompensationForm">
          <v-row>
            <v-col cols="12" class="pb-0">
              <v-autocomplete v-model="employeeCompensation.employee_id" :items="employeeList" variant="solo" flat
                label="Employee" density="compact" item-title="full_name" item-value="id" :rules="[rules.required]"
                readonly></v-autocomplete>
            </v-col>

            <v-col cols="12" class="pb-0">
              <v-select v-model="employeeCompensation.type" :items="compensationTypeList" variant="solo" flat
                label="Compensation type" density="compact" :rules="bulkUpdating ? [] : [rules.required]"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-select>
            </v-col>

            <v-col cols="12" class="pb-0">
              <v-text-field type="number" step="2" label="Amount" v-model="employeeCompensation.amount" variant="solo"
                flat density="compact" :rules="bulkUpdating ? [] : [rules.required]"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-text-field>
            </v-col>
            <v-col cols="12" class="pb-0">
              <v-text-field type="date" label="Effective date" v-model="employeeCompensation.effective_date"
                variant="solo" flat density="compact" :rules="bulkUpdating ? [] : [rules.required]"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-text-field>
            </v-col>
            <v-col cols="12" class="pb-0">
              <v-text-field type="date" label="End date" v-model="employeeCompensation.end_date" variant="solo" flat
                density="compact"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-text-field>
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
