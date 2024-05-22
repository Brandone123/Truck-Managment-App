<template>
  <v-dialog v-model="dialog" scrollable width="800px">
    <template v-slot:activator="{ props }">
      <v-btn density="comfortable" color="primary" flat v-bind="props" class="text-none">
        <v-icon>mdi-plus</v-icon>
        Assign Employee Benefit
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
        <v-form ref="employeeBenefitForm">
          <v-row>
            <v-col cols="12" class="pb-0">
              <v-autocomplete v-model="employeeBenefit.employee_id" :items="employeeList" variant="solo" flat
                label="Employee" density="compact" :rules="[rules.required]" item-title="full_name"
                item-value="id" :readonly="updating"></v-autocomplete>
            </v-col>
            <v-col cols="12" class="pb-0">
              <v-autocomplete v-model="employeeBenefit.benefit_id" :items="benefitList" variant="solo" flat
                label="Benefit" density="compact" :rules="[rules.required]" item-title="name"
                item-value="id"></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6" class="pb-0">
              <v-text-field type="date" label="Start Date" v-model="employeeBenefit.start_date" variant="solo" flat
                density="compact" :rules="[rules.required]"></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0">
              <v-text-field type="date" label="End Date" v-model="employeeBenefit.end_date" variant="solo" flat
                density="compact" :rules="[rules.required]"></v-text-field>
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
import { ref, computed, toRefs, watch, } from 'vue'
import type { Ref, PropType } from 'vue'
import type { BenefitInfo, EmployeeBenefitInfo } from '@/types/employeeInformationAndOperation/benefit'

const emit = defineEmits(['update:show', 'addLeavePolicy', 'editLeavePolicy'])

const benefitStore = useBenefitStore()
const { benefitList } = storeToRefs(benefitStore)

const employeeStore = useEmployeeStore()
const { employeeList } = storeToRefs(employeeStore)

const employeeBenefitStore = useEmployeeBenefitStore()

const props = defineProps({
  item: {
    type: Object,
    required: false,
  },

  selectedEmployeeId: {
    type: [Number, null] as PropType<number | null>, //type defined as number or null
    required: false,
    default: null
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

const employeeBenefitForm: Ref<HTMLFormElement | null> = ref(null);
const employeeBenefit = ref<EmployeeBenefitInfo>({})

const title = computed(() => {
  return props.updating ? 'Employee Benefit Info' : 'Assign Benefit'
})

const saveButtonText = computed(() => {
  return props.updating ? 'Update' : 'Save'
})

const rules = computed(() => {
  return {
    required: (value: string) => !!value || 'Field is required',
  }
})

const save = async () => {
  if (employeeBenefitForm.value) {
    const formStatus = await employeeBenefitForm.value.validate()
    if (!formStatus.valid) {
      return
    }
    if (props.updating) {
      employeeBenefitStore.updateEmployeeBenefit(employeeBenefit.value);
    } else {
      employeeBenefitStore.createEmployeeBenefit(employeeBenefit.value)
    }
    dialog.value = false;
  }
};

const resetForm = () => {
  if (employeeBenefitForm.value) {
    (employeeBenefitForm.value as HTMLFormElement).reset(); // Reset the form
  }
  employeeBenefit.value = {}
}


watch(dialog, (val) => {
  if (val && props.updating) {
    employeeBenefit.value = props.item as EmployeeBenefitInfo
  } else {
    resetForm()
    if (props.selectedEmployeeId) {
      employeeBenefit.value.employee_id = props.selectedEmployeeId
    }
  }
})
</script>