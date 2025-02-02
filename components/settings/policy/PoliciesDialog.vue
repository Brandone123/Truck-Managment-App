<!-- components/policy/PoliciesDialog.vue -->

<template>
  <v-dialog v-model="dialog" max-width="800px" persistent scrollable>
    <v-card>
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="policyForm" v-model="isValid">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field variant="outlined" flat density="compact" v-model="policyInfo.policy_name"
                label="Policy Name*" :rules="[validation.required, uniquePolicyName]" required></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <!-- <v-select variant="outlined" flat density="compact" v-model="policyInfo.type" :items="policyTypes"
                label="Type" clearable></v-select> -->
              <v-text-field variant="outlined" flat density="compact" v-model="policyInfo.type" label="Type*"
                :rules="[validation.required]" required></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-textarea variant="outlined" flat density="compact" v-model="policyInfo.description"
                label="Description"></v-textarea>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field variant="outlined" flat density="compact" v-model="policyInfo.version"
                label="Version"></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-select variant="outlined" flat density="compact" v-model="policyInfo.enforcement_level"
                :items="enforcementLevels" label="Enforcement Level*" :rules="[validation.required]"
                required></v-select>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn @click="closeDialog">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="savePolicy" :disabled="!isValid">
          {{ saveButtonText }}
        </v-btn>

      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { usePolicyStore } from '@/stores/policyStore';
import type { PolicyInfo } from '@/types/store/policy';
import { useValidation } from '~/composables/formValidation';
import { storeToRefs } from 'pinia';

const validation = useValidation();

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  item: {
    type: Object as () => PolicyInfo | null,
    default: null,
  },
});


const emit = defineEmits(['update:modelValue', 'save']);

const policyStore = usePolicyStore();
const { policies } = storeToRefs(policyStore);

const dialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});

const policyForm = ref<HTMLFormElement | null>(null);
const isValid = ref(false);

const policyInfo = ref<Partial<Omit<PolicyInfo, 'rules' | 'created_at' | 'updated_at'>>>({});



const uniquePolicyName = (value: any) => {
  // Check if the policy name already exists in the list
  const isDuplicate = (policies.value || []).some(
    (policy) => policy.policy_name?.toLocaleLowerCase() === value?.toLocaleLowerCase() && policy.id != props.item?.id
  )

  return !isDuplicate ? true : 'Policy name already exists';
}


// Define policy types and enforcement levels
const policyTypes = [
  'Compliance',
  'Business',
  // Add more types as needed
];

const enforcementLevels = [
  { title: 'Ignore', value: 'ignore' },
  { title: 'Warning', value: 'warning' },
  { title: 'Stop', value: 'stop' },
];

// Watch for changes in props to populate form when updating
watch(
  () => dialog.value,
  (value) => {
    if (value) {
      policyInfo.value = {
        id: props.item?.id,
        policy_name: props.item?.policy_name,
        type: props.item?.type,
        description: props.item?.description,
        version: props.item?.version,
        enforcement_level: props.item?.enforcement_level || 'ignore',
      };
    }
  },
  { immediate: true }
);

// Compute dialog title and save button text
const title = computed(() => (props.item?.id ? 'Edit Policy' : 'Add Policy'));
const saveButtonText = computed(() => (props.item?.id ? 'Update' : 'Save'));

// Save policy (create or update)
const savePolicy = async () => {
  let formStatus = await policyForm.value?.validate()
  if (!formStatus.valid) {
    return;
  }

  emit('save', { ...policyInfo.value })

  dialog.value = false
};

// Close dialog and reset form
const closeDialog = () => {
  dialog.value = false;
  policyInfo.value = {
    policy_name: '',
    type: null,
    description: '',
    version: '',
    enforcement_level: 'ignore',
  };
};
</script>

<style scoped>
.v-toolbar-title {
  flex: auto !important;
}
</style>