<template>
    <v-dialog v-model="dialog" scrollable width="800px">
      <template v-slot:activator="{ props }">
        <v-btn density="comfortable" color="primary" flat v-bind="props" class="text-none">
          <v-icon>mdi-plus</v-icon>
          Add Driver
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
          <v-form ref="driverForm">
            <v-row class="my-4">
              <v-col cols="12" md="6" class="pb-0">
                <v-autocomplete v-model="driverInfo.employee_id" variant="solo" flat label="Employee"
                                :items='formattedEmployeeList' item-title="full_name" item-value="id" density="compact"  :rules="[rules.required]"></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6" class="pb-0">
                <v-select v-model="driverInfo.category" variant="solo" flat label="Category"
                                :items='categoryList' item-title="name" item-value="value" density="compact"  :rules="[rules.required]"></v-select>
              </v-col>
              <v-col cols="12" md="3" class="pb-0">
                <v-text-field type="date" variant="solo" flat density="compact" label="CDL Expiration"
                                v-model="driverInfo.cdl_expiration"></v-text-field>
              </v-col>
              
              <v-col cols="12" md="3" class="pb-0">
                <v-text-field type="date" variant="solo" flat density="compact" label="MVR Due"
                                v-model="driverInfo.mvr_due"></v-text-field>
              </v-col>
              <v-col cols="12" md="3" class="pb-0">
                <v-text-field type="date" variant="solo" flat density="compact" label="Hazmat Expiration"
                                v-model="driverInfo.hazmat_expiration"></v-text-field>  
            </v-col>
              <v-col cols="12" md="3" class="pb-0">
                <v-text-field type="date" variant="solo" flat density="compact" label="Physical Due"
                                v-model="driverInfo.physical_due"></v-text-field>  
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="save">{{saveButtonText}}</v-btn>
          <v-btn color="primary" variant="text" @click="dialog = false">cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, computed,toRefs, watch } from 'vue'
import type { DriverInfo } from '@/types/store/driver'
import type { EmployeeInfo } from '@/types/store/employee'
import { v4 as uuidv4 } from 'uuid';

const emit = defineEmits(['update:show', 'addDriver', 'editDriver'])

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

const driverForm = ref(null)

const driverListStore = useDriverStore()
const employeeListStore = useEmployeeStore()
const {employeeList} = storeToRefs(employeeListStore)

onMounted(() => {
    employeeListStore.fetchEmployeeList();
});

const formattedEmployeeList = computed(() => {
  return employeeList.value.map((item: EmployeeInfo) => { 
    return {...item, full_name: `${item.first_name} ${item.last_name}`}})
});

const defaultDriver = ref<DriverInfo>({
    id: null,
    employee_id: null,
    category: "",
    cdl_expiration: null,
    mvr_due: null,
    hazmat_expiration: null,
    physical_due: null,
})

const driverInfo = ref(defaultDriver.value)

const title = computed(() => {
    return props.updating ? 'Driver Info' : 'Create Driver'
})

const saveButtonText = computed(() => {
    return props.updating ? 'update' : 'Save'
})

const rules = {
  required: (value: string) => !!value || 'Field is required',
};

const categoryList = [
  { id: 1, value: "independent_contractor", name: "Independent Contractor" },
  { id: 2, value: "company_employee", name: "Company Employee" }
];


const save = () => {
  if (props.updating) {
    driverListStore.updateDriverTemplate(driverInfo.value);
  } else {
    driverListStore.createDriverTemplate(driverInfo.value);
  }
      dialog.value = false;
};

const resetForm = () => {
    if (driverForm.value) {
        (driverForm.value as HTMLFormElement).reset(); // Reset the form
    }
}

watch(dialog, (val) => {
    if (val && props.updating) {
        driverInfo.value = props.item as DriverInfo
    } else {
        // stopInfo.value = defaultDriver.value
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