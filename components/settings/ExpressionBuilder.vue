<!-- components/ExpressionBuilder.vue -->

<template>
    <div>
      <div class="expression-builder">
        <v-row>
          <!-- Variable Selection -->
          <v-col cols="12" md="4">
            <v-select
              v-model="selectedVariable"
              :items="availableVariables"
              label="Variables"
              item-text="label"
              item-value="value"
              @change="addVariable"
            ></v-select>
          </v-col>
  
          <!-- Operator Selection -->
          <v-col cols="12" md="4">
            <v-select
              v-model="selectedOperator"
              :items="operators"
              label="Operators"
              @change="addOperator"
            ></v-select>
          </v-col>
  
          <!-- Value Input -->
          <v-col cols="12" md="4">
            <v-text-field
              v-model="inputValue"
              label="Value"
              @keyup.enter="addValue"
            ></v-text-field>
          </v-col>
        </v-row>
  
        <!-- Expression Display -->
        <v-textarea
          v-model="expression"
          label="Expression"
          auto-grow
          :rules="rules"
        ></v-textarea>
  
        <!-- Clear Expression -->
        <v-btn color="error" @click="clearExpression">
          Clear
        </v-btn>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue';
  
  const props = defineProps({
    availableVariables: {
      type: Array,
      required: true,
    },
    operators: {
      type: Array,
      required: true,
    },
    modelValue: {
      type: String,
      default: '',
    },
    rules: {
      type: Array,
      default: () => [],
    },
  });
  
  const emit = defineEmits(['update:modelValue']);
  
  const selectedVariable = ref('');
  const selectedOperator = ref('');
  const inputValue = ref('');
  const expression = ref(props.modelValue);
  
  watch(
    () => props.modelValue,
    (newVal) => {
      expression.value = newVal;
    }
  );
  
  const addVariable = () => {
    if (selectedVariable.value) {
      expression.value += selectedVariable.value;
      selectedVariable.value = '';
      emit('update:modelValue', expression.value);
    }
  };
  
  const addOperator = () => {
    if (selectedOperator.value) {
      expression.value += ` ${selectedOperator.value} `;
      selectedOperator.value = '';
      emit('update:modelValue', expression.value);
    }
  };
  
  const addValue = () => {
    if (inputValue.value) {
      expression.value += `"${inputValue.value}"`;
      inputValue.value = '';
      emit('update:modelValue', expression.value);
    }
  };
  
  const clearExpression = () => {
    expression.value = '';
    emit('update:modelValue', expression.value);
  };
  </script>
  
  <style scoped>
  .expression-builder {
    margin-bottom: 1rem;
  }
  </style>
  