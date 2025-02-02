<!-- components/accessControl/GroupsDialog.vue -->

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
        <v-form ref="groupForm" v-model="isValid">
          <v-row>
            <v-col cols="12">
              <v-text-field variant="outlined" flat density="compact" v-model="groupInfo.group_name" label="Group Name*"
                :rules="[validation.required, uniqueGroupName]" required></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea variant="outlined" flat density="compact" v-model="groupInfo.description" label="Description"
                hide-details></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn @click="dialog = false">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveGroup" :disabled="!isValid">
          {{ saveButtonText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { GroupInfo } from '@/types/store/accessControl';
import { useValidation } from '~/composables/formValidation';

const validation = useValidation();

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  item: {
    type: Object as () => GroupInfo | null,
    default: null,
  },
});

const emit = defineEmits(['update:modelValue', 'save']);

const accessControlStore = useAccessControlStore();
const { groups } = storeToRefs(accessControlStore);

const dialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});

const groupForm = ref<HTMLFormElement | null>(null);
const isValid = ref(false);

const groupInfo = ref<Partial<Omit<GroupInfo, 'permissions' | 'users' | 'created_at' | 'updated_at'>>>({});


const uniqueGroupName = (value: any) => {
  // Check if the role name already exists in the list
  const isDuplicate = (groups.value || []).some(
    (group) => group.group_name === value && group.id != props.item?.id
  )

  return !isDuplicate ? true : 'Group name already exists';
}


// Watch for changes in props to populate form when updating
watch(
  () => dialog.value,
  (value) => {
    if (value) {
      groupInfo.value = {
        id: props.item?.id,
        group_name: props.item?.group_name,
        description: props.item?.description,
      }
    }

  },
  { immediate: true }
);

// Compute dialog title and save button text
const title = computed(() => (props.item?.id ? 'Edit Group' : 'Add Group'));
const saveButtonText = computed(() => (props.item?.id ? 'Update' : 'Save'));

// Save group (create or update)
const saveGroup = async () => {
  let formStatus = await groupForm.value?.validate()
  if (!formStatus.valid) {
    return;
  }

  emit('save', { ...groupInfo.value })
  dialog.value = false
};

</script>

<style scoped></style>