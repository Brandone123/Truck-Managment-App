<template>
    <v-dialog v-model="dialog" max-width="800px">
      <v-card>
        <v-card-title>{{ policyData.id ? 'Edit' : 'Create' }} Policy</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field v-model="policyData.policy_name" label="Policy Name" :rules="[required]"></v-text-field>
            <v-textarea v-model="policyData.description" label="Description"></v-textarea>
            <v-select v-model="policyData.enforcement_level" :items="enforcementLevels" label="Enforcement Level"></v-select>
            <v-select v-model="policyData.logic_operator" :items="logicOperators" label="Logic Operator"></v-select>
  
            <div class="my-3">
              <h5>Conditions</h5>
              <div v-for="(cond, idx) in policyData.conditions" :key="idx" class="mb-2">
                <v-text-field v-model="cond.condition_type" label="Condition Type"></v-text-field>
                <v-text-field v-model="cond.attribute" label="Attribute"></v-text-field>
                <v-text-field v-model="cond.operator" label="Operator"></v-text-field>
                <v-text-field v-model="cond.value" label="Value"></v-text-field>
                <v-btn text color="red" @click="removeCondition(idx)">Remove Condition</v-btn>
              </div>
              <v-btn text color="primary" @click="addCondition">Add Condition</v-btn>
            </div>
  
            <div class="my-3">
              <h5>Assign to Employees</h5>
              <v-autocomplete
                v-model="policyData.assigned_to_employee_ids"
                :items="employeeOptions"
                item-title="full_name"
                item-value="id"
                label="Employees"
                multiple
                chips
              ></v-autocomplete>
            </div>
  
            <div class="my-3">
              <h5>Assign to Groups</h5>
              <v-autocomplete
                v-model="policyData.assigned_to_group_ids"
                :items="groupOptions"
                item-title="group_name"
                item-value="id"
                label="Groups"
                multiple
                chips
              ></v-autocomplete>
            </div>
  
            <div class="my-3">
              <h5>Apply to Actions</h5>
              <v-autocomplete
                v-model="policyData.action_keys"
                :items="actionOptions"
                item-title="label"
                item-value="value"
                label="Actions"
                multiple
                chips
              ></v-autocomplete>
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text @click="$emit('close')">Cancel</v-btn>
          <v-btn color="primary" @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue';
  import type { PropType } from 'vue';
  import type { Policy } from '@/types/store/policy';
  
  import { useGroupStore } from '@/stores/workforce/groupStore';
  import { useEmployeeStore } from '@/stores/employee';
  
  // Your predefined lists for enforcementLevels, logicOperators, and actionOptions
  const enforcementLevels = ['ignore','warning','stop'];
  const logicOperators = ['AND','OR'];
  const actionOptions = [
    { value: 'dispatch_truck', label:'Dispatch Truck' },
    { value: 'clock_in', label:'Clock In' },
    { value: 'approve_leave', label:'Approve Leave' }
  ];
  
  const props = defineProps({
    modelValue: { type: Boolean, required: true },
    policy: { type: Object as PropType<Partial<Policy>>, required:true },
  });
  
  const emit = defineEmits(['update:modelValue','close','save']);
  
  const dialog = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
  });
  
  const policyData = ref<Partial<Policy>>(JSON.parse(JSON.stringify(props.policy)));
  const required = (v:any)=>!!v || 'Required';
  
  watch(
    () => props.policy,
    (newVal) => {
      policyData.value = JSON.parse(JSON.stringify(newVal));
    },
    { deep:true }
  );
  
  const addCondition = () => {
    if (!policyData.value.conditions) policyData.value.conditions = [];
    policyData.value.conditions.push({ condition_type:'', attribute:'', operator:'', value:'' });
  };
  
  const removeCondition = (index:number) => {
    policyData.value.conditions?.splice(index,1);
  };
  
  const save = () => {
    emit('save', policyData.value);
  };
  
  // Integrate group and employee logic from snippet
  const groupStore = useGroupStore();
  const employeeStore = useEmployeeStore();
  
  const groupOptions = computed(() => groupStore.groups);
  const employeeOptions = computed(() => {
    return employeeStore.employeeList.map(emp => ({
      ...emp,
      full_name: `${emp.first_name} ${emp.last_name}`,
    }));
  });
  
  onMounted(() => {
    if (groupStore.groups.length === 0) {
      groupStore.fetchGroups();
    }
    if (employeeStore.employeeList.length === 0) {
      employeeStore.fetchEmployeeList();
    }
  });
  </script>
  