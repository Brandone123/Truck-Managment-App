<template>
    <v-dialog v-model="dialog" scrollable width="500px">
      <!-- <template v-slot:activator="{ props }">
        <v-btn density="comfortable" color="primary" flat v-bind="props" class="text-none">
          <v-icon>mdi-plus</v-icon>
          Add Leave Policy
        </v-btn>
      </template> -->
      <v-card class="grey-background">
        <v-toolbar color="primary" :title="title" density="compact">
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-window-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form ref="employeePolicyForm">
            <v-row class="my-4">
              <v-col cols="12" class="pb-0">
                <v-autocomplete v-model="employeePolicyInfo.policy_id" :items="leavePolicyList" variant="solo" flat
                  label="Name" density="compact" :rules="[rules.required]" item-title="name"
                  item-value="employee_id"></v-autocomplete>
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
  import type { EmployeeInfo } from '@/types/store/employee'
  
  const emit = defineEmits(['update:show', 'addLeavePolicy', 'editLeavePolicy'])
  
  const leavePolicyStore = useLeavePolicyStore()
  const { leavePolicyList } = storeToRefs(leavePolicyStore)
  
  const employeeStore = useEmployeeStore()
  
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
  
  const employeePolicyForm = ref(null)
  const employeePolicyInfo = ref<EmployeeInfo>({})
  
  const title = computed(() => {
    return props.updating ? 'Employee Policy Info' : 'Add Employee Policy'
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
    employeeStore.updateEmployee(employeePolicyInfo.value);
    dialog.value = false;
  };
  
  
  const resetForm = () => {
    if (employeePolicyForm.value) {
      (employeePolicyForm.value as HTMLFormElement).reset(); // Reset the form
    }
    employeePolicyInfo.value = {}
  }
  
  
  watch(dialog, (val) => {
    if (val && props.updating) {
      employeePolicyInfo.value = props.item as EmployeeInfo
    } else {
      resetForm()
    }
  })
  </script>