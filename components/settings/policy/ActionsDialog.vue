<!-- components/policy/ActionsDialog.vue -->

<template>
  <v-dialog v-model="dialog" max-width="800px" persistent scrollable>
    <v-card>
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="actionForm" v-model="isValid">
          <v-row>
            <v-col cols="12">
              <v-autocomplete variant="outlined" flat density="compact" v-model="actionInfo.rule_id"
                :items="rulesList" item-title="name" item-value="id" label="Rule*" :rules="[validation.required]"
                required :readonly="item?.id ? true : false" :hint="item?.id ? 'Selected rule cannot be changed' : ''"
                persistent-hint></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field variant="outlined" flat density="compact" v-model="actionInfo.name" label="Action Name*"
                :rules="[validation.required, uniqueActionName]" required></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field variant="outlined" flat density="compact" v-model="actionInfo.domain"
                label="Domain"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-select variant="outlined" flat density="compact" v-model="actionInfo.action_type" :items="actionTypes"
                label="Action Type*" :rules="[validation.required]" required></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field variant="outlined" flat density="compact" v-model="actionInfo.description"
                label="Description"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-textarea variant="outlined" flat density="compact" v-model="actionInfo.parameters"
                label="Parameters (JSON)"
                placeholder='e.g., {"email_template": "CDL Expiry", "recipient": "driver_email"}'></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn @click="dialog = false">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveAction" :disabled="!isValid">
          {{ saveButtonText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { usePolicyStore } from '@/stores/policyStore';
import type { ActionInfo } from '@/types/store/policy';
import { useValidation } from '~/composables/formValidation';

const validation = useValidation();

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  item: {
    type: Object as () => ActionInfo | null,
    default: null,
  },
});

const emit = defineEmits(['update:modelValue', 'save']);

const policyStore = usePolicyStore();
const { actions,rules: rulesList  } = storeToRefs(policyStore);

const uniqueActionName = (value: any) => {
  // Check if the action name already exists in the list
  const isDuplicate = (actions.value || []).some(
    (action) => action.name?.toLocaleLowerCase() === value?.toLocaleLowerCase() && action.id != props.item?.id
  )

  return !isDuplicate ? true : 'Action name already exists';
}

const dialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});

const actionForm = ref<HTMLFormElement | null>(null);
const isValid = ref(false);


const actionInfo = ref<Partial<Omit<ActionInfo, 'rules' | 'actions' | 'created_at' | 'updated_at'>>>({});

// Define action types
const actionTypes = [
  { title: 'Send Notification', value: 'send_notification' },
  { title: 'Block Action', value: 'block_action' },
  { title: 'Log Event', value: 'log_event' },
  // Add more types as needed
];

// Watch for changes in props to populate form when updating
watch(
  () => dialog.value,
  (value) => {
    if (value) {
      actionInfo.value = {
        id: props.item?.id,
        name: props.item?.name,
        domain: props.item?.domain,
        rule_id: props.item?.rule_id,
        action_type: props.item?.action_type,
        description: props.item?.description,
        parameters: props.item?.parameters ?? {}
      };
    }

  },
  { immediate: true }
);

// Compute dialog title and save button text
const title = computed(() => (props.item?.id ? 'Edit Action' : 'Add Action'));
const saveButtonText = computed(() => (props.item?.id ? 'Update' : 'Save'));

// Save action (create or update)
const saveAction = async () => {
  let formStatus = await actionForm.value?.validate()
  if (!formStatus.valid) {
    return;
  }

  emit('save', { ...actionInfo.value })

  dialog.value = false
};
</script>

<style scoped>
.v-toolbar-title {
  flex: auto !important;
}
</style>