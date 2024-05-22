<template>
    <v-dialog :value="dialog" @input="updateDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ isEditMode ? 'Edit' : 'Add New' }} Payroll Entry</span>
        </v-card-title>
        <v-form ref="form" v-model="valid">
          <v-card-text>
            <v-container>
              <v-row>
                <!-- Payroll form fields go here -->
                <v-col cols="12">
                  <v-text-field
                    v-model="editedPayroll.payPeriod"
                    label="Pay Period"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="editedPayroll.baseSalary"
                    label="Base Salary"
                    type="number"
                    required
                  ></v-text-field>
                </v-col>
                <!-- Include other fields as necessary -->
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
            <v-btn color="blue darken-1" text :disabled="!valid" @click="save">Save</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup>
  import { reactive, toRefs, computed, watchEffect } from 'vue';
  
  // Props
  const props = defineProps({
    dialog: Boolean,
    payrollEntry: Object,
  });
  
  // Emits
  const emit = defineEmits(['update:dialog', 'save']);
  
  // A reactive state for the form data
  const editedPayroll = reactive({
    payPeriod: '',
    baseSalary: 0,
    // ... other payroll fields
  });
  const valid = ref(false);
  
  const isEditMode = computed(() => !!props.payrollEntry);
  
  // Watch effect to reset or set editedPayroll when prop changes
  watchEffect(() => {
    if (props.payrollEntry) {
      Object.assign(editedPayroll, props.payrollEntry);
    } else {
      Object.keys(editedPayroll).forEach(key => {
        editedPayroll[key] = ''; // Reset to default value
      });
    }
  });
  
  // Emit update for dialog visibility
  function updateDialog(value) {
    emit('update:dialog', value);
  }
  
  // Close the dialog
  function closeDialog() {
    emit('update:dialog', false);
  }
  
  // Save the payroll entry
  function save() {
    if (valid.value) {
      emit('save', { ...toRefs(editedPayroll) });
      closeDialog();
    }
  }
  </script>
  