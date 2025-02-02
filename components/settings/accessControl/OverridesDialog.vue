<!-- components/accessControl/OverridesDialog.vue -->

<template>
  <v-dialog v-model="dialog" max-width="600px" persistent scrollable>
    <v-card>
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="overrideForm" v-model="isValid">
          <v-row>
            <v-col cols="12">
              <!-- <v-select variant="outlined" flat density="compact" v-model="overrideInfo.user_id" :items="users"
                item-title="name" item-value="id" label="User*" :rules="[validation.required]" required></v-select> -->
              <SharedInputEmployeeAutoCompleteInput variant="outlined" flat density="compact"
                v-model="overrideInfo.user_id" label="User*" :rules="[validation.required]">
              </SharedInputEmployeeAutoCompleteInput>
            </v-col>
            <v-col cols="12">
              <v-select variant="outlined" flat density="compact" v-model="overrideInfo.override_type" item-title="text"
                item-value="value" :items="overrideTypes" label="Override Type*" :rules="[validation.required]"
                required></v-select>
            </v-col>
            <!-- <v-col cols="12"><SharedInputEmployeeAutoCompleteInput variant="outlined" flat density="compact"
                v-model="overrideInfo.granted_by" label="Granted By*" :rules="[validation.required]" :fetchData="false"
                :filters="{ isAdmin: true }">
              </SharedInputEmployeeAutoCompleteInput>
            </v-col> -->
            <v-col cols="12">
              <v-checkbox color="primary" variant="outlined" flat density="compact" v-model="overrideInfo.valid"
                label="Valid"></v-checkbox>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn @click="dialog = false">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveOverride" :disabled="!isValid">
          {{ saveButtonText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { useAccessControlStore } from '@/stores/accessControlStore';
import type { OverrideInfo } from '@/types/store/accessControl';
import { useValidation } from '~/composables/formValidation';

const validation = useValidation();

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  item: {
    type: Object as () => OverrideInfo | null,
    default: null,
  },
});

const emit = defineEmits(['update:modelValue']);

const dialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});

const accessControlStore = useAccessControlStore();

const overrideForm = ref(null);
const isValid = ref(false);

const overrideInfo = ref<Partial<Omit<OverrideInfo, 'user' | 'grantedBy' | 'created_at' | 'updated_at'>>>({});

// Define override types
const overrideTypes = [
  { text: 'Deny Dispatch', value: 'override_deny_dispatch' },
  { text: 'Allow Dispatch', value: 'override_allow_dispatch' },
];

// Watch for changes in props to populate form when updating
watch(
  () => dialog.value,
  (value) => {
    if (value) {
      overrideInfo.value = {
        id: props.item?.id,
        user_id: props.item?.user_id,
        override_type: props.item?.override_type,
        valid: props.item?.valid || true,
      };
    }

  },
  { immediate: true }
);

// Compute dialog title and save button text
const title = computed(() => (props.item?.id ? 'Edit Override' : 'Grant Override'));
const saveButtonText = computed(() => (props.item?.id ? 'Update' : 'Save'));

// Save override (create or update)
const saveOverride = () => {
  if (props.item?.id) {
    // Currently, overrides are only revoked, not edited. If editing is allowed, implement here.
    // For now, we'll assume overrides are only created or revoked.
    // You can extend this as needed.
  } else {
    accessControlStore.createOverride(overrideInfo.value as OverrideInfo);
  }
  dialog.value = false;
};
</script>

<style scoped>
.v-toolbar-title {
  flex: auto !important;
}
</style>