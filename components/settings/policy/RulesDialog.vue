<!-- components/policy/RulesDialog.vue -->

<template>
  <v-dialog v-model="dialog" max-width="700px" persistent scrollable>
    <v-card>
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="ruleForm" v-model="isValid">
          <v-row>
            <v-col cols="12">
              <v-select variant="outlined" flat density="compact" v-model="ruleInfo.policy_id" :items="policies"
                item-title="policy_name" item-value="id" label="Policy*" :rules="[validation.required]" required
                :readonly="item?.id ? true : false" :hint="item?.id ? 'Selected policy cannot be changed' : ''"
                persistent-hint></v-select>
            </v-col>
            <v-col cols="12">
              <v-text-field variant="outlined" flat density="compact" v-model="ruleInfo.name" label="Rule Name*"
                :rules="[validation.required, uniqueRuleName]" required></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-textarea variant="outlined" flat density="compact" v-model="ruleInfo.description"
                label="Description" hide-details></v-textarea>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-switch variant="outlined" flat density="compact" color="primary" v-model="ruleInfo.enabled"
                label="Enabled"></v-switch>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn @click="dialog = false">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveRule" :disabled="!isValid">
          {{ saveButtonText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { usePolicyStore } from '@/stores/policyStore';
import type { RuleInfo, PolicyInfo } from '@/types/store/policy';
import { useValidation } from '~/composables/formValidation';
import { storeToRefs } from 'pinia';

const validation = useValidation();

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  item: {
    type: Object as () => RuleInfo | null,
    default: null,
  },
});

const emit = defineEmits(['update:modelValue', 'save']);

const dialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});

const policyStore = usePolicyStore();
const { policies, rules } = storeToRefs(policyStore);

const ruleForm = ref<HTMLFormElement | null>(null);
const isValid = ref(false);

const ruleInfo = ref<Partial<Omit<RuleInfo, 'policy' | 'conditions' | 'actions'>>>({});

// Watch for changes in props to populate form when updating
watch(
  () => dialog.value,
  (value) => {
    if (value) {
      ruleInfo.value = {
        id: props.item?.id,
        policy_id: props.item?.policy_id,
        name: props.item?.name,
        description: props.item?.description,
        enabled: props.item?.enabled ?? true
      };
    }
  },
  { immediate: true }
);

// Compute dialog title and save button text
const title = computed(() => (props.item?.id ? 'Edit Rule' : 'Add Rule'));
const saveButtonText = computed(() => (props.item?.id ? 'Update' : 'Save'));

const uniqueRuleName = (value: any) => {
  // Check if the rule name already exists in the list
  const isDuplicate = (rules.value || []).some(
    (rule) => rule.name?.toLocaleLowerCase() === value?.toLocaleLowerCase() && rule.id != props.item?.id
  )

  return !isDuplicate ? true : 'Rule name already exists';
}

// Save rule (create or update)
const saveRule = async () => {
  let formStatus = await ruleForm.value?.validate()
  if (!formStatus.valid) {
    return;
  }

  emit('save', { ...ruleInfo.value })
  dialog.value = false
};

</script>

<style scoped>
.v-toolbar-title {
  flex: auto !important;
}
</style>