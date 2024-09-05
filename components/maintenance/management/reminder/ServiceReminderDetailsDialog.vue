<template>
  <v-dialog :model-value="modelValue" @update:model-value="updateModelValue" fullscreen
    scrollable>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark>
        <v-toolbar-title>Service Reminder ${{ serviceReminder.id }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-row>
              <v-col cols="12">
                <v-card>
                  <v-card-title class="font-weight-bold">Details</v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="6">Service Task</v-col>
                      <v-col cols="12" md="6">{{ getServiceName(serviceReminder.task_id) }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Due Date</v-col>
                      <v-col cols="12" md="6">{{ serviceReminder.due_date }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Status</v-col>
                      <v-col cols="12" md="6"><v-chip :color="getStatusColor(serviceReminder.status)">{{ serviceReminder.status }}</v-chip></v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <!-- <v-expansion-panels>
          <v-expansion-panel elevation="0">
            <v-expansion-panel-title class="title"> Comments</v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-table v-if="serviceReminder.comments !== null && serviceReminder.comments.length > 0">
                <thead>
                  <tr>
                    <th><strong>Date</strong></th>
                    <th><strong>Decription</strong></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(comment, index) in serviceReminder.comments" :key="index">
                    <td>{{ comment.date }}</td>
                    <td>{{ comment.text }}</td>
                  </tr>
                </tbody>
              </v-table>
              <v-table v-else>
                <tbody>
                  <tr>
                    <td>
                      <div class="text-center font-weight-bold text-title">No Comments</div>
                    </td>
                  </tr>
                </tbody>
              </v-table>
              <v-form>
                <v-textarea v-model="newComment" label="Add Comment"></v-textarea>
                <v-btn color="primary" @click="addComment">Add Comment</v-btn>
              </v-form>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels> -->

      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn small @click="closeDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import type { PropType } from 'vue';
import type { ServiceReminder } from '@/types/maintenance/serviceReminders';

const props = defineProps({
  modelValue: Boolean,
  serviceReminder: {
    type: Object as PropType<ServiceReminder>,
    required: true,
  },
});

const emit = defineEmits(['update:model-value', 'close']);
const serviceTaskStore = useServiceTaskStore();
const { serviceTaskList } = storeToRefs(serviceTaskStore);

const getServiceName = (serviceId: any) => {
  const serviceName = serviceTaskList.value.find((service) => service.id === serviceId)
  return serviceName ? serviceName.name : '';
}

const newComment = ref('');

watch(
  () => props.serviceReminder,
  (newServiceReminder) => {
    newComment.value = '';
  }
);

const updateModelValue = (value: boolean) => {
  emit('update:model-value', value);
};

const closeDialog = () => {
  emit('update:model-value', false);
  emit('close');
};

// const addComment = () => {
//   if (newComment.value) {
//     props.serviceReminder.comments.push({ id: Date.now(), text: newComment.value, date: new Date().toISOString() });
//     newComment.value = '';
//   }
// };

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Due Soon':
      return 'secondary';
    case 'Overdue':
      return 'red';
    case 'Completed':
      return 'primary';
    default:
      return '';
  }
};
</script>

<style scoped>
.title {
  font-weight: bold;
  color: #1984c5;
}
</style>