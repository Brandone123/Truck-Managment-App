<!-- components/accessControl/PermissionsDialog.vue -->

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
        <v-form ref="permissionForm" v-model="isValid">
          <v-row>
            <v-col cols="12">
              <v-text-field variant="outlined" flat density="compact" v-model="permissionInfo.permission_name"
                label="Permission Name*" :rules="[validation.required, uniquePermissionName]" required></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-autocomplete variant="outlined" flat density="compact" v-model="permissionInfo.action_id"
                :items="actions" item-title="name" item-value="id" label="Action*" required
                :readonly="item?.id ? true : false" :hint="item?.id ? 'Selected action cannot be changed' : ''"
                persistent-hint></v-autocomplete>
            </v-col>
            <v-col cols="12">
              <v-textarea variant="outlined" flat density="compact" v-model="permissionInfo.description"
                label="Description"></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn @click="dialog = false">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="savePermission" :disabled="!isValid">
          {{ saveButtonText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useAccessControlStore } from '@/stores/accessControlStore';
import type { PermissionInfo } from '@/types/store/accessControl';
import { useValidation } from '~/composables/formValidation';

const validation = useValidation();

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  item: {
    type: Object as () => PermissionInfo | null,
    default: null,
  },
});

const emit = defineEmits(['update:modelValue', 'save']);

const dialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});

const policyStore = usePolicyStore();
const { actions } = storeToRefs(policyStore);

const accessControlStore = useAccessControlStore();
const { permissions } = storeToRefs(accessControlStore);

const permissionForm = ref<HTMLFormElement | null>(null);
const isValid = ref(false);


const permissionInfo = ref<Partial<Omit<PermissionInfo, 'id' | 'roles' | 'groups' | 'created_at' | 'updated_at'>>>({});

const uniquePermissionName = (value: any) => {
  // Check if the role name already exists in the list
  const isDuplicate = (permissions.value || []).some(
    (permission) => permission.permission_name === value && permission.id != props.item?.id
  )

  return !isDuplicate ? true : 'Permission name already exists';
}


// Watch for changes in props to populate form when updating
watch(
  () => dialog.value,
  (value) => {
    if (value) {
      permissionInfo.value = {
        action_id: props.item?.action_id,
        permission_name: props.item?.permission_name,
        description: props.item?.description,
      };
    }
  },
  { immediate: true }
);

// Compute dialog title and save button text
const title = computed(() => (props.item?.id ? 'Edit Permission' : 'Add Permission'));
const saveButtonText = computed(() => (props.item?.id ? 'Update' : 'Save'));

// Save permission (create or update)
const savePermission = async () => {
  let formStatus = await permissionForm.value?.validate()
  if (!formStatus.valid) {
    return;
  }

  emit('save', { ...permissionInfo.value, id: props.item?.id })
  dialog.value = false
};

</script>

<style scoped>
.v-toolbar-title {
  flex: auto !important;
}
</style>