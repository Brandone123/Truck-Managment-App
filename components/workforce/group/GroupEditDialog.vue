<template>
    <v-dialog v-model="dialog" max-width="800px">
      <v-card>
        <v-card-title>{{ currentGroup.id ? 'Edit' : 'Create' }} Group</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field v-model="currentGroup.group_name" label="Name" :rules="[required]"></v-text-field>
            <v-textarea v-model="currentGroup.description" label="Description"></v-textarea>
            <v-autocomplete
              v-model="currentGroup.member_ids"
              :items="employeeOptions"
              item-title="full_name"
              item-value="id"
              label="Assign Members"
              multiple
              chips
            ></v-autocomplete>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="$emit('close')">Cancel</v-btn>
          <v-btn color="primary" @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue';
  import type { PropType } from 'vue';
  import type { Group } from '@/types/workforce/attendanceRecord';
  import { useEmployeeStore } from '@/stores/employee';
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true,
    },
    group: {
      type: Object as PropType<Partial<Group>>,
      required: true,
    },
  });
  
  const emits = defineEmits(['update:modelValue', 'close', 'save']);
  
  const dialog = computed({
    get: () => props.modelValue,
    set: (value) => emits('update:modelValue', value),
  });
  
  const currentGroup = ref<Partial<Group>>({ ...props.group });
  
  const form = ref(null);
  const required = (value: any) => !!value || 'Required';
  
  const employeeStore = useEmployeeStore();
  const employeeOptions = computed(() => {
    return employeeStore.employeeList.map((emp) => ({
      ...emp,
      full_name: `${emp.first_name} ${emp.last_name}`,
    }));
  });
  
  onMounted(() => {
    if (employeeStore.employeeList.length === 0) {
      employeeStore.fetchEmployeeList();
    }
  });
  
  watch(
    () => props.group,
    (newGroup) => {
      currentGroup.value = { ...newGroup };
    },
    { deep: true }
  );
  
  const save = () => {
    // Ensure that if no member_ids are selected, we set it to []
    if (!currentGroup.value.member_ids) {
      currentGroup.value.member_ids = [];
    }
    emits('save', currentGroup.value);
  };
  </script>
  