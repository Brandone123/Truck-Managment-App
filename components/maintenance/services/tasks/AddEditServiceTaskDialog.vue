<template>
  <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" scrollable fullscreen>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form ref="ServiceTaskForm">
          <v-row class="mt-1">
            <v-col cols="12" md="6">
              <v-row>
                <v-col cols="12">
                  <v-card>
                    <v-card-title class="font-weight-bold">Details</v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" sm="6">
                          <v-text-field v-model="localServiceTask.name" label="Name" variant="outlined" flat
                            density="compact" :rules="[validation.required]"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-select v-model="localServiceTask.sub_tasks" :items="serviceTaskList" item-title="name"
                            item-value="id" label="Sub Tasks" variant="outlined" flat density="compact"
                            required></v-select>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-select v-model="localServiceTask.categories"
                            :items="['Chassis', 'Driver Train', 'Electrical', 'Engine', 'Accessories', 'Heading & Refrigeration']"
                            label="Work Order Type" variant="outlined" flat density="compact" required></v-select>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field v-model="localServiceTask.expected_labor_hours" label="Expected Labor Hours(hr)"
                            type="number" variant="outlined" flat density="compact" required></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-textarea v-model="localServiceTask.description" label="Description" variant="outlined" flat
                            density="compact" required></v-textarea>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12" md="6">
              <v-card>
                <v-card-title class="font-weight-bold">Parts</v-card-title>
                <v-card-text>
                  <v-expansion-panels density="compact">
                    <v-expansion-panel elevation="0">
                      <v-expansion-panel-title class="title">Part Used</v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <v-card-text>
                          <div v-for="(part, index) in localServiceTask.parts" :key="index">
                            <v-row class="border rounded mt-2" :class="index > 0 ? 'mt-5' : ''">
                              <v-col cols="4">
                                <v-text-field v-model="part.part_location" label="Part Location" variant="outlined" flat
                                  density="compact"></v-text-field>
                              </v-col>
                              <v-col cols="4">
                                <v-text-field v-model="part.qte" label="Quantity" variant="outlined" flat
                                  density="compact" type="number"></v-text-field>
                              </v-col>
                              <v-col cols="4" class="justify-center text-center">
                                <v-btn dark color="red" class="text-none text-capitalize" @click="removeItem(index)">
                                  Remove Part <v-icon class="ml-1">mdi-minus</v-icon>
                                </v-btn>
                              </v-col>
                              <v-divider></v-divider>
                            </v-row>
                          </div>
                          <div>
                            <v-row class="justify-center mb-5 mt-5">
                              <v-btn @click="addPart" dark color="primary" class="text-none text-capitalize">
                                Add Part <v-icon class="ml-1">mdi-plus</v-icon>
                              </v-btn>
                            </v-row>
                          </div>
                        </v-card-text>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" variant="text" @click="closeDialog">cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="saveWorkOrder">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { defineProps, defineEmits } from 'vue';
import type { ServiceTask } from '~/types/maintenance/serviceTaskTypes';
import { useValidation } from '~/composables/formValidation';

const props = defineProps({
  modelValue: Boolean,
  serviceTask: {
    type: Object as PropType<Partial<ServiceTask>>,
    required: true,
  },
});

const serviceTaskStore = useServiceTaskStore();
const { serviceTaskList, loading: loadingWorkOrders } = storeToRefs(serviceTaskStore);

const ServiceTaskForm = ref<HTMLFormElement | null>(null)
const validation = useValidation();

const emit = defineEmits(['update:modelValue', 'save']);

const localServiceTask = ref<Partial<ServiceTask>>(JSON.parse(JSON.stringify(props.serviceTask || {})));

watch(
  () => props.serviceTask,
  (newWorkOrder) => {
    localServiceTask.value = { ...newWorkOrder };
  }
);

const title = computed(() => (props.serviceTask && props.serviceTask.id ? 'Edit Service Task' : 'Add Service Task'));

const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value);
};

const closeDialog = () => {
  emit('update:modelValue', false);
};

const addPart = () => {
  if (!localServiceTask.value.parts) {
    localServiceTask.value.parts = [];
  }
  localServiceTask.value.parts.push({ part_location: '', qte: 0 });
};

const removeItem = (index: number) => {
  if (!localServiceTask.value.parts) {
    localServiceTask.value.parts = [];
  }
  localServiceTask.value.parts.splice(index, 1);
};

const saveWorkOrder = () => {
  emit('save', localServiceTask.value);
  emit('update:modelValue', false);
};

</script>

<style scoped>
.title {
  font-weight: bold;
  color: #1984c5;
}
</style>