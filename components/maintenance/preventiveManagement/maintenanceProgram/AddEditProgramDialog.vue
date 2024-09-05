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
                <v-text-field v-model="localProgram.name" label="Program Name" variant="solo" flat density="compact" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="localProgram.maintenance_type" :items="['Routine', 'Inspection']" label="Maintenance Type" variant="solo" flat density="compact" required></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="localProgram.next_scheduled_date" label="Next Scheduled Date" type="date" variant="solo" flat density="compact" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="localProgram.recurrence" :items="['Weekly', 'Monthly']" label="Recurrence" variant="solo" flat density="compact" required></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-file-input v-model="localProgram.attachments" label="Attachments" multiple variant="solo" flat density="compact"></v-file-input>
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="localProgram.description" label="Description of Tasks" variant="solo" flat density="compact" required></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="closeDialog">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="saveProgram">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, watch } from 'vue';
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    modelValue: Boolean,
    program: {
      type: Object,
      default: () => ({
        name: '',
        maintenance_type: '',
        next_scheduled_date: '',
        recurrence: 'Monthly',
        description: '',
        attachments: [],
      }),
    },
  });
  
  const emit = defineEmits(['update:modelValue', 'save']);
  
  const localProgram = ref({ ...props.program });
  
  watch(
    () => props.program,
    (newProgram) => {
      localProgram.value = { ...newProgram };
    }
  );
  
  const title = computed(() => (props.program && props.program.id ? 'Edit Program' : 'Add Program'));
  
  const updateModelValue = (value: boolean) => {
    emit('update:modelValue', value);
  };
  
  const closeDialog = () => {
    emit('update:modelValue', false);
  };
  
  const saveProgram = () => {
    emit('save', localProgram.value);
    emit('update:modelValue', false);
  };
  </script>
  
  <style scoped>
  </style>
  