<template>
    <v-dialog v-model="dialog" scrollable width="800px">
      <template v-slot:activator="{ props }">
        <v-btn density="comfortable" color="primary" flat v-bind="props" class="text-none">
          <v-icon>mdi-plus</v-icon>
          Add Employee
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
          <v-form ref="employeeForm">
            <v-row class="my-4">
              <v-col cols="12" md="6" class="pb-0">
                <v-text-field v-model="employeeInfo.first_name" variant="solo" flat label="First Name" density="compact"  :rules="[rules.required]"></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="pb-0">
                <v-text-field v-model="employeeInfo.last_name" variant="solo" flat label="Last Name" density="compact"  :rules="[rules.required]"></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="pb-0">
                <v-text-field v-model="employeeInfo.email" variant="solo" flat label="Email" density="compact"  :rules="[rules.required]"></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="pb-0">
                <v-select v-model="employeeInfo.department_id" variant="solo" flat label="Department"
                                :items='formattedDepartmentList' item-title="full_name" item-value="id" density="compact"  :rules="[rules.required]"></v-select>
              </v-col>
              <v-col cols="12" class="pb-0">
                <v-select v-model="employeeInfo.role_id" variant="solo" flat label="Role"
                                :items='roleList' item-title="name" item-value="id" density="compact"  :rules="[rules.required]"></v-select>
              </v-col>
              <v-col cols="12" md="6" class="pb-0">
                <v-text-field v-model="employeeInfo.address1" variant="solo" flat label="Address 1" density="compact"></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="pb-0">
                <v-text-field v-model="employeeInfo.address2" variant="solo" flat label="Address 2" density="compact"></v-text-field>
              </v-col>
              <v-col cols="12" md="4" class="pb-0">
                <v-text-field v-model="employeeInfo.city" variant="solo" flat label="City" density="compact"></v-text-field>
              </v-col>
              <v-col cols="12" md="4" class="pb-0">
                <v-text-field v-model="employeeInfo.state" variant="solo" flat label="State" density="compact"></v-text-field>
              </v-col>
              <v-col cols="12" md="4" class="pb-0">
                <v-text-field v-model="employeeInfo.zip" variant="solo" flat label="Zip" density="compact"></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="pb-0">
                <v-text-field v-model="employeeInfo.cell_phone" variant="solo" flat label="Cell Phone" density="compact"  :rules="[rules.required]"></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="pb-0">
                <v-text-field v-model="employeeInfo.other_phone" variant="solo" flat label="Other Phone" density="compact"></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="pb-0">
                <v-text-field type="date" variant="solo" flat density="compact" label="Hire Date"
                                v-model="employeeInfo.hire_date" :rules="[rules.required]"></v-text-field>  
              </v-col>
              <v-col cols="12" md="6" class="pb-0">
                <v-text-field type="date" variant="solo" flat density="compact" label="Termination Date"
                                v-model="employeeInfo.termination_date"></v-text-field>  
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" variant="text" @click="dialog = false">cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="save">{{saveButtonText}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, computed,toRefs, watch } from 'vue'
import type { EmployeeInfo } from '@/types/store/employee'
import type { DepartmentInfo } from '@/types/store/department'
import { v4 as uuidv4 } from 'uuid';

const emit = defineEmits(['update:show', 'addEmployee', 'editEmployee'])

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

const employeeForm = ref(null)

const departmentListStore = useDepartmentStore()
const { departmentList } = storeToRefs(departmentListStore)

const roleListStore = useRoleStore()
const { roleList } = storeToRefs(roleListStore)

const formattedDepartmentList = computed(() => {
  return departmentList.value.map((item: DepartmentInfo) => { 
    return {...item, full_name: `${item.name}`}})
});

const employeeListStore = useEmployeeStore()
const {employeeList} = storeToRefs(employeeListStore)

const defaultEmployee = ref<EmployeeInfo>({
    id: null,
    user_id: null,
    first_name: null,
    last_name: null,
    user: {
      email: null,
    },
    department_id: null,
    role_id: null,
    address1: null,
    address2: null,
    city: null,
    state: null,
    zip: null,
    cell_phone: null,
    other_phone: null,
})

const employeeInfo = ref(defaultEmployee.value)

const employeeWithEmail = computed(() => {
  const employeeId = employeeInfo.value.id;
  const employeeItem = employeeList.value.find(employee => employee.id === employeeId);
  return employeeItem && employeeItem.user ? employeeItem.user.email : null;
});

const title = computed(() => {
    return props.updating ? 'Employee Info' : 'Create Employee'
})

const saveButtonText = computed(() => {
    return props.updating ? 'update' : 'Save'
})

const rules = {
  required: (value: string) => !!value || 'Field is required',
};

const save = () => { 
  if (props.updating) {
    employeeListStore.updateEmployee(employeeInfo.value);
  } else {
    employeeListStore.createEmployee(employeeInfo.value);
  }
    dialog.value = false; 
};

const resetForm = () => {
    if (employeeForm.value) {
        (employeeForm.value as HTMLFormElement).reset(); // Reset the form
    }
}

watch(dialog, (val) => {
    if (val && props.updating) {
        employeeInfo.value = props.item as EmployeeInfo
        employeeInfo.value.email = employeeWithEmail.value
    } else {
        // stopInfo.value = defaultEmployee.value
        resetForm()
    }
})
</script>

<style scoped>
  .v-progress-circular {
    margin: 1rem;
  }
  
.overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.error-message {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px;
  background-color: red;
  color: white;
  font-weight: bold;
  border-radius: 5px;
}
</style>