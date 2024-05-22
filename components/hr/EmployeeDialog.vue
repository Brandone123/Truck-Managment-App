<template>
  <v-dialog v-model="show" persistent max-width="600px">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" color="primary" density="comfortable" class="text-none" @click="newItem">
        Add New Employee
      </v-btn>
    </template>
    <v-card class="grey-background">
      <v-toolbar color="primary" density="compact" class="d-flex justify-space-between">
        <v-toolbar-title>{{ isEditMode ? 'Edit' : 'Add New' }} Employee</v-toolbar-title>
        <v-btn icon density="comfortable" @click="close"><v-icon>mdi-window-close</v-icon></v-btn>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col class="pb-0" cols="12" sm="6">
            <v-text-field variant="solo" density="comfortable" v-model="editedEmployee.firstName" label="First Name"
              required></v-text-field>
          </v-col>
          <v-col class="pb-0" cols="12" sm="6">
            <v-text-field variant="solo" density="comfortable" v-model="editedEmployee.lastName" label="Last Name"
              required></v-text-field>
          </v-col>
          <v-col class="pb-0" cols="12">
            <v-text-field variant="solo" density="comfortable" v-model="editedEmployee.email" label="Email"
              required></v-text-field>
          </v-col>
          <v-col class="pb-0" cols="12" sm="6">
            <v-text-field variant="solo" density="comfortable" v-model="editedEmployee.phone" label="Phone Number"
              required></v-text-field>
          </v-col>
          <v-col class="pb-0" cols="12" sm="6">
            <v-text-field variant="solo" density="comfortable" v-model="editedEmployee.jobTitle" label="Job Title"
              required></v-text-field>
          </v-col>
          <!-- Add additional fields as necessary -->
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" density="comfortable" color="blue darken-1" text @click="close">Cancel</v-btn>
        <v-btn variant="text" density="comfortable" color="blue darken-1" text @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { toRefs, watchEffect } from 'vue';

// Props
const props = defineProps({
  dialog: Boolean,
  employee: Object,
});

// Emits
const emit = defineEmits(['update:dialog', 'close-dialog', 'save']);

// Create a reactive object for the edited employee
const editedEmployee = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  jobTitle: '',
  // Initialize additional fields as needed
});

const show = computed({
  get() {
    return props.dialog
  },
  set(val) {
    emit('update:dialog', val)
  }
})

// Compute edit mode based on the presence of an employee prop
const isEditMode = computed(() => !!props.employee);

// Watch effect to reset or set editedEmployee when prop changes
watchEffect(() => {
  if (props.employee) {
    Object.assign(editedEmployee, props.employee);
  } else {
    Object.assign(editedEmployee, {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      jobTitle: '',
      // Reset additional fields as needed
    });
  }
});

// Method to close the dialog and emit the event
function close() {
  show.value = false
}

// Method to save the employee and close the dialog
function save() {
  emit('save', { ...editedEmployee });
  close();
}
</script>