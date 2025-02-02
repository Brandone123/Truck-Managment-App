<!-- components/SettingsConditionDialog.vue -->

<template>
    <v-dialog v-model="dialog" width="800px">
      <template v-slot:activator="{ props }">
        <v-btn density="comfortable" color="primary" flat v-bind="props" class="text-none">
          <v-icon>mdi-plus</v-icon>
          Add Condition
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
          <v-form ref="conditionForm">
            <v-row>
              <!-- Name -->
              <v-col cols="12" md="6" class="pb-0">
                <v-text-field
                  label="Name"
                  v-model="condition.name"
                  variant="outlined"
                  flat
                  density="compact"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
  
              <!-- Condition Type -->
              <v-col cols="12" md="6" class="pb-0">
                <v-select
                  label="Condition Type"
                  v-model="condition.condition_type"
                  :items="conditionTypes"
                  item-title="text"
                  item-value="value"
                  variant="outlined"
                  flat
                  density="compact"
                  :rules="[rules.required]"
                  @change="onConditionTypeChange"
                ></v-select>
              </v-col>
  
              <!-- Level -->
              <v-col cols="12" md="6" class="pb-0">
                <v-select
                  label="Level"
                  v-model="condition.level"
                  :items="levels"
                  item-title="text"
                  item-value="value"
                  variant="outlined"
                  flat
                  density="compact"
                  :rules="[rules.required]"
                ></v-select>
              </v-col>
  
              <!-- Level Message -->
              <v-col cols="12" md="6" class="pb-0" v-if="showMessageField">
                <v-text-field
                  label="Message"
                  v-model="condition[condition.level + '_message']"
                  variant="outlined"
                  flat
                  density="compact"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
  
              <!-- Action Type -->
              <v-col cols="12" md="6" class="pb-0">
                <v-select
                  label="Action Type"
                  v-model="condition.action_type"
                  :items="actionTypes"
                  item-title="text"
                  item-value="value"
                  variant="outlined"
                  flat
                  density="compact"
                  :rules="[rules.required]"
                ></v-select>
              </v-col>
  
              <!-- Model -->
              <v-col cols="12" md="6" class="pb-0" v-if="showAttributeFields">
                <v-select
                  label="Model"
                  v-model="condition.model"
                  :items="models"
                  item-title="text"
                  item-value="value"
                  variant="outlined"
                  flat
                  density="compact"
                  :rules="[rules.required]"
                ></v-select>
              </v-col>
  
              <!-- Attribute -->
              <v-col cols="12" md="6" class="pb-0" v-if="showAttributeFields">
                <v-select
                  label="Attribute"
                  v-model="condition.attribute"
                  :items="attributes"
                  item-title="label"
                  item-value="value"
                  variant="outlined"
                  flat
                  density="compact"
                  :rules="[rules.required]"
                  :disabled="!condition.model"
                ></v-select>
              </v-col>
  
              <!-- Operator -->
              <v-col cols="12" md="6" class="pb-0" v-if="showOperatorField">
                <v-select
                  label="Operator"
                  v-model="condition.operator"
                  :items="operators"
                  variant="outlined"
                  flat
                  density="compact"
                  :rules="[rules.required]"
                ></v-select>
              </v-col>
  
              <!-- Value -->
              <v-col cols="12" md="6" class="pb-0" v-if="showValueField">
                <v-select
                  v-if="attributeValues.length > 0"
                  label="Value"
                  v-model="condition.value"
                  :items="attributeValues"
                  variant="outlined"
                  flat
                  density="compact"
                  :rules="[rules.required]"
                ></v-select>
                <v-text-field
                  v-else
                  label="Value"
                  v-model="condition.value"
                  variant="outlined"
                  flat
                  density="compact"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
  
              <!-- Custom Code -->
              <v-col cols="12" md="12" class="pb-0" v-if="showCustomCodeField">
                <ExpressionBuilder
                  v-model="condition.custom_code"
                  :available-variables="availableVariables"
                  :operators="expressionOperators"
                  :rules="[rules.required]"
                ></ExpressionBuilder>
              </v-col>
  
              <!-- Active -->
              <v-col cols="12" md="6" class="pb-0">
                <v-checkbox
                  label="Active"
                  v-model="condition.active"
                  density="compact"
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" variant="text" @click="dialog = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="save">{{ saveButtonText }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import type { PropType } from 'vue';
  import type { ConditionInfo } from '~/types/store/condition';
  import ExpressionBuilder from './ExpressionBuilder.vue';
  
  const conditionStore = useConditionStore();
  const { mapping } = storeToRefs(conditionStore);
  
  const emit = defineEmits(['update:show']);
  
  const props = defineProps({
    item: {
      type: Object as PropType<ConditionInfo>,
      required: false,
    },
    updating: {
      type: Boolean,
      default: false,
    },
    show: {
      type: Boolean,
      default: false,
    },
  });
  
  const dialog = computed({
    get() {
      return props.show;
    },
    set(newValue) {
      emit('update:show', newValue);
    },
  });
  
  const conditionForm = ref<HTMLFormElement | null>(null);
  const condition = ref<ConditionInfo>({
    id: null,
    name: '',
    condition_type: null,
    action_type: null,
    model: null,
    attribute: null,
    operator: null,
    value: null,
    level: null,
    ignore_message: null,
    warn_message: null,
    stop_message: null,
    parameters: null,
    active: true,
    custom_code: '',
  });
  
  const title = computed(() => {
    return props.updating ? 'Edit Condition' : 'Add Condition';
  });
  
  const saveButtonText = computed(() => {
    return props.updating ? 'Update' : 'Save';
  });
  
  const rules = {
    required: (value: string) => !!value || 'Field is required',
  };
  
  const conditionTypes = [
    { text: 'Attribute', value: 'attribute' },
    { text: 'Date-Based', value: 'date_based' },
    { text: 'Custom Code', value: 'custom_code' },
    { text: 'Status-Based', value: 'status_based' },
  ];
  
  const levels = [
    { text: 'Ignore', value: 'ignore' },
    { text: 'Warn', value: 'warn' },
    { text: 'Stop', value: 'stop' },
  ];
  
  const expressionOperators = ['==', '!=', '>', '<', '>=', '<=', '&&', '||'];
  
  const actionTypes = computed(() => {
    return mapping.value ? mapping.value.action_types : [];
  });
  
  const models = computed(() => {
    return mapping.value
      ? mapping.value.models.map((model: any) => ({
          text: model.name,
          value: model.name, // Use model.name as value
          class: model.class, // Keep class if needed for backend
          attributes: model.attributes,
        }))
      : [];
  });
  
  const selectedModel = computed(() => {
    return models.value.find((model) => model.value === condition.value.model);
  });
  
  const selectedAttribute = computed(() => {
    if (!selectedModel.value || !condition.value.attribute) return null;
    return selectedModel.value.attributes.find(
      (attr: any) => attr.name === condition.value.attribute
    );
  });
  
  const attributes = computed(() => {
    if (!selectedModel.value) return [];
  
    // Determine the required category based on the condition type
    let requiredCategory = null;
    if (condition.value.condition_type === 'date_based') {
      requiredCategory = 'date';
    } else if (condition.value.condition_type === 'status_based') {
      requiredCategory = 'status';
    }
  
    // Filter attributes based on the required category and map to label/value
    return selectedModel.value.attributes
      .filter((attribute: any) => {
        if (requiredCategory) {
          return attribute.category === requiredCategory;
        }
        // For 'attribute' condition type, include all attributes
        return true;
      })
      .map((attribute: any) => ({
        label: attribute.name,
        value: attribute.name,
      }));
  });
  
  const attributeValues = computed(() => {
    return selectedAttribute.value?.values || [];
  });
  
  const operators = computed(() => {
    const attributeType = selectedAttribute.value?.type;
  
    if (attributeType === 'string' || selectedAttribute.value?.category === 'status') {
      return ['==', '!='];
    } else if (attributeType === 'date' || attributeType === 'number') {
      return ['==', '!=', '>', '<', '>=', '<='];
    } else {
      return ['==', '!=', '>', '<', '>=', '<='];
    }
  });
  
  const availableVariables = computed(() => {
    const vars = [];
    mapping.value?.models.forEach((model) => {
      const modelVarName = model.name.toLowerCase(); // e.g., 'driver'
      model.attributes.forEach((attribute) => {
        vars.push({
          label: `${model.name}.${attribute.name}`, // e.g., 'Driver.license_status'
          value: `${modelVarName}.${attribute.name}`, // e.g., 'driver.license_status'
        });
      });
    });
    return vars;
  });
  
  const save = async () => {
    if (conditionForm.value) {
      const formStatus = await conditionForm.value.validate();
      if (!formStatus.valid) {
        return;
      }
  
      // Include model_class if backend requires it
      const payload = {
        ...condition.value,
        model_class: selectedModel.value.class, // Add this line if needed
      };
  
      if (props.updating) {
        conditionStore.updateCondition(payload);
      } else {
        conditionStore.createCondition(payload);
      }
  
      dialog.value = false;
    }
  };
  
  const resetForm = () => {
    if (conditionForm.value) {
      conditionForm.value.reset();
    }
    condition.value = {
      id: null,
      name: '',
      condition_type: null,
      action_type: null,
      model: null,
      attribute: null,
      operator: null,
      value: null,
      level: null,
      ignore_message: null,
      warn_message: null,
      stop_message: null,
      parameters: null,
      active: true,
      custom_code: '',
    };
  };
  
  watch(dialog, (val) => {
    if (val && props.updating) {
      condition.value = { ...props.item } as ConditionInfo;
    } else if (!val) {
      resetForm();
    }
  });
  
  const showAttributeFields = computed(() => {
    return (
      condition.value.condition_type === 'attribute' ||
      condition.value.condition_type === 'date_based' ||
      condition.value.condition_type === 'status_based'
    );
  });
  
  const showOperatorField = computed(() => {
    return showAttributeFields.value;
  });
  
  const showValueField = computed(() => {
    return showAttributeFields.value;
  });
  
  const showMessageField = computed(() => {
    return condition.value.level !== null;
  });
  
  const showCustomCodeField = computed(() => {
    return condition.value.condition_type === 'custom_code';
  });
  </script>
  