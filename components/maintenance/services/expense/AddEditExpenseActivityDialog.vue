<template>
    <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" scrollable width="800px">
      <v-card class="grey-background">
        <v-toolbar color="primary" dark density="compact">
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form ref="form">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field v-model="localItem.asset_name" label="Asset Name" variant="solo" flat density="compact" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="localItem.expense_activity_type" :items="['Labor', 'Parts', 'Total']" label="Expense/Activity Type" variant="solo" flat density="compact" required></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="localItem.date" label="Date" type="date" variant="solo" flat density="compact" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="localItem.technician_vendor" label="Technician/Vendor" variant="solo" flat density="compact" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="localItem.cost" label="Cost" type="number" variant="solo" flat density="compact" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="localItem.status" :items="['Completed', 'Pending', 'In Progress']" label="Status" variant="solo" flat density="compact" required></v-select>
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="localItem.description" label="Description" variant="solo" flat density="compact" required></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" @click="closeDialog">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="saveItem">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, watch } from 'vue';
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    modelValue: Boolean,
    expenseActivity: {
      type: Object,
      default: () => ({
        asset_name: '',
        expense_activity_type: '',
        date: '',
        technician_vendor: '',
        description: '',
        cost: 0,
        status: 'Pending',
      }),
    },
  });
  
  const emit = defineEmits(['update:modelValue', 'save']);
  
  const localItem = ref({ ...props.expenseActivity });
  
  watch(
    () => props.expenseActivity,
    (newItem) => {
      localItem.value = { ...newItem };
    }
  );
  
  const title = computed(() => (props.expenseActivity && props.expenseActivity.id ? 'Edit Expense/Activity' : 'Add Expense/Activity'));
  
  const updateModelValue = (value: boolean) => {
    emit('update:modelValue', value);
  };
  
  const closeDialog = () => {
    emit('update:modelValue', false);
  };
  
  const saveItem = () => {
    emit('save', localItem.value);
    emit('update:modelValue', false);
  };
  </script>
  
  <style scoped>
  </style>
  