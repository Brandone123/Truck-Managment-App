<template>
  <v-dialog :model-value="modelValue" @update:model-value="updateModelValue" fullscreen
    scrollable>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form ref="reminderForm" class="mt-5">
          <v-row class="mt-1">
            <v-col cols="12" md="6">
              <v-row>
                <v-col cols="12">
                  <v-card>
                    <v-card-title class="font-weight-bold">Details</v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" sm="6">
                          <v-select variant="outlined" flat density="compact" :items="assetList"
                                v-model="localReminder.vehicle_id" item-title="name" item-value="id"
                                label="Select Vehicle" :rules="[validation.required]">
                          </v-select>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-select variant="outlined" flat density="compact" v-model="localReminder.task_id"
                          :items="serviceTaskList" item-title="name" item-value="id" label="Search Service Task" :rules="[validation.required]"></v-select>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field variant="outlined" flat density="compact" v-model="localReminder.due_date" label="Due Date"
                            type="date" :rules="[validation.required]"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-select :items="['Due Soon', 'Overdue', 'Completed', 'Upcoming']" variant="outlined" flat density="compact"
                            v-model="localReminder.status" label="Status" required></v-select>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12" md="6">
              <v-card>
                <v-card-title class="font-weight-bold">Schedule Preview</v-card-title>
                <v-card-text>

                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" variant="text" @click="closeDialog">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="saveReminder">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import type { PropType } from 'vue';
import type { ServiceReminder } from '@/types/maintenance/serviceReminders';
 import { useValidation } from '~/composables/formValidation';

const props = defineProps({
  modelValue: Boolean,
  serviceReminder: {
    type: Object as PropType<Partial<ServiceReminder>>,
    required: true,
  },
});

const validation = useValidation();
const serviceTaskStore = useServiceTaskStore();
const { serviceTaskList } = storeToRefs(serviceTaskStore);

const assetStore = useAssetStore();
const { assetList } = storeToRefs(assetStore);

const emit = defineEmits(['update:model-value', 'close', 'save']);
const reminderForm = ref<HTMLFormElement | null>(null)

const localReminder = ref<Partial<ServiceReminder>>(JSON.parse(JSON.stringify(props.serviceReminder || {})));

watch(
  () => props.serviceReminder,
  (newServiceReminder) => {
    localReminder.value = { ...newServiceReminder };
  }
);

const title = computed(() => (props.serviceReminder && props.serviceReminder.id ? 'Edit Reminder' : 'Create Reminder'));

const saveReminder = async () => {
  const formStatus = await reminderForm.value?.validate() || false

  if (!formStatus.valid) {
    return
  }

  emit('save', localReminder.value);
  emit('update:model-value', false);
  emit('close');
};

const updateModelValue = (value: boolean) => {
  emit('update:model-value', value);
};

const closeDialog = () => {
  emit('update:model-value', false);
  emit('close');
};

onMounted(() => {
  serviceTaskStore.fetchServiceTasks()
  assetStore.fetchAssets()
  serviceTaskStore.fetchServiceTasks()
})

</script>

<style scoped></style>