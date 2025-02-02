<!-- components/accessControl/actionsDialog.vue -->

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
        <v-form ref="roleForm" v-model="isValid">
          <v-row>
            <v-col cols="12">
              <v-text-field variant="outlined" flat density="compact" v-model="roleInfo.name" label="Role Name*"
                :rules="[validation.required, uniqueRoleName]" required></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea variant="outlined" flat density="compact" v-model="roleInfo.description" label="Description*"
                :rules="[validation.required]" required></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn @click="dialog = false">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveRole" :disabled="!isValid">
          {{ saveButtonText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useAccessControlStore } from '@/stores/accessControlStore';
import type { RoleInfo } from '@/types/store/accessControl';
import { useValidation } from '~/composables/formValidation';
import { storeToRefs } from 'pinia';

const validation = useValidation();


const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  item: {
    type: Object as () => RoleInfo | null,
    default: null,
  },
});

const emit = defineEmits(['update:modelValue', 'save']);

const accessControlStore = useAccessControlStore();
const { roles } = storeToRefs(accessControlStore);


const uniqueRoleName = (value: any) => {
  // Check if the role name already exists in the list
  const isDuplicate = (roles.value || []).some(
    (role) => role.name === value && role.id != props.item?.id
  )

  return !isDuplicate ? true : 'Role name already exists';
}


const dialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});

const roleForm = ref<HTMLFormElement | null>(null);
const isValid = ref(false);

const roleInfo = ref<Partial<Omit<RoleInfo, 'permissions' | 'created_at' | 'updated_at'>>>({});

// Watch for changes in props to populate form when updating
watch(
  () => dialog.value,
  (value) => {
    if (value) {
      roleInfo.value = {
        id: props.item?.id,
        name: props.item?.name,
        description: props.item?.description,
      };
    }
  },
  { immediate: true }
);

// Compute dialog title and save button text
const title = computed(() => (props.item?.id ? 'Edit Role' : 'Add Role'));
const saveButtonText = computed(() => (props.item?.id ? 'Update' : 'Save'));

// Save role (create or update)
const saveRole = async () => {
  let formStatus = await roleForm.value?.validate()
  if (!formStatus.valid) {
    return;
  }

  emit('save', { ...roleInfo.value })
  dialog.value = false
};
</script>

<style scoped>
.v-toolbar-title {
  flex: auto !important;
}
</style>