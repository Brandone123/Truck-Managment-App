<template>
  <v-dialog :model-value="modelValue" @update:model-value="updateModelValue" fullscreen scrollable>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>Inspection Form Details</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-card flat rounded-0 style="position:sticky;top:-16px;z-index:1;" class="mt-n4 mx-n6 px-2 pt-2">
          <div class="d-flex align-center ">
            <span class="text-h6 mr-2">{{ form.name }}</span>
            <v-chip class="text-capitalize" density="comfortable">{{ form.status }}</v-chip>
          </div>
          <v-tabs density="compact" v-model="step" center-active color="primary">
            <v-tab :value="1" density="compact">
              Inspection Items
              <v-chip class="ml-1" density="compact">{{ formItemsLength }}</v-chip>
            </v-tab>
            <v-tab :value="2" density="compact">
              Workflows <v-chip class="ml-1" density="compact">{{ form.workflows.length }}</v-chip>
            </v-tab>
          </v-tabs>
        </v-card>
        <v-window v-model="step">
          <v-window-item :value="1" class="pa-2">
            <v-container style="max-width: 1000px;">
              <template v-for="(element, i) in form.elements">
                <div v-if="element.type == 'section'" class="my-2 flex-grow-1" :class="{ 'mt-4': i > 0 }">
                  <p class="text-h6 font-weight-bold">{{ element.label }}</p>
                </div>

                <v-card v-else class="mb-2 flex-grow-1">
                  <v-card-text class="pb-8">
                    <div class="d-flex justify-space-between mb-2 font-weight-bold">
                      <span>{{ element.label }} <span class="text-red" v-if="element.required">*</span></span>
                    </div>

                    <v-row>
                      <v-col class="pb-0" cols="12" md="6">Short Description</v-col>
                      <v-col class="pb-0" cols="12" md="6">{{ element.description || '___' }}</v-col>
                    </v-row>

                    <v-row v-if="element.type != 'signature'">
                      <v-col class="pb-0" cols="12" md="6">Instructions</v-col>
                      <v-col class="pb-0" cols="12" md="6">{{ element.instructions || '___' }}</v-col>
                    </v-row>

                    <v-row v-if="element.type == 'meter_entry'">
                      <v-col class="pb-0" cols="12" md="6">Require Secondary Meter</v-col>
                      <v-col class="pb-0" cols="12" md="6">{{ element.require_secondary_meter ? 'Yes' : 'No' }}</v-col>
                      <v-col class="pb-0" cols="12" md="6">Require Photo Verification</v-col>
                      <v-col class="pb-0" cols="12" md="6">{{ element.require_photo_verification ? 'Yes' : 'No'
                        }}</v-col>
                    </v-row>

                    <v-row v-if="element.type == 'number'">
                      <v-col class="pb-0" cols="12" md="6">Maximum</v-col>
                      <v-col class="pb-0" cols="12" md="6">{{ element.minimum_pass_range || '___' }}</v-col>
                      <v-col class="pb-0" cols="12" md="6">Maximum</v-col>
                      <v-col class="pb-0" cols="12" md="6">{{ element.maximum_pass_range || '___' }}</v-col>
                    </v-row>

                    <v-row v-if="element.type == 'pass_fail'">
                      <v-col class="pb-0" cols="12" md="6">Pass Label</v-col>
                      <v-col class="pb-0" cols="12" md="6">{{ element.pass_label }}</v-col>

                      <v-col class="pb-0" cols="12" md="6">Fail Label</v-col>
                      <v-col class="pb-0" cols="12" md="6">{{ element.fail_label }}</v-col>
                    </v-row>


                    <v-row v-if="!['free_text', 'signature', 'meter_entry'].includes(element.type)">
                      <v-col class="pb-0" cols="12" md="6">Require photo or comment for "Pass"</v-col>
                      <v-col class="pb-0" cols="12" md="6">{{ element.pass_require_photo_or_comment ? 'Yes' : 'No'
                        }}</v-col>

                      <v-col class="pb-0" cols="12" md="6">Require photo or comment for "Fail"</v-col>
                      <v-col class="pb-0" cols="12" md="6">{{ element.fail_require_photo_or_comment ? 'Yes' : 'No'
                        }}</v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </template>
            </v-container>
          </v-window-item>
          <v-window-item :value="2" class="pa-2">
            <v-container style="max-width: 1000px;">
              <v-card v-for="(workflow, i) in form.workflows" :key="i">
                <v-card-text>
                  <div class="mb-4">{{ workflow.active ? 'Enabled' : 'Disabled' }}</div>
                  <v-row>
                    <v-col cols="5">
                      <div class="mb-4">
                        <v-icon class="mr-4" color="grey">
                          {{ getTrigerIcon(workflow.trigger.selected) }}
                        </v-icon>
                        {{ getTriggerText(workflow.trigger.selected) }}
                      </div>
                      <div class="ml-10"><span class="text-grey">Description: </span> {{
                        workflow.description
                      }}</div>
                    </v-col>
                    <v-col cols="7">
                      <div class="d-flex">
                        <v-icon>mdi-arrow-right</v-icon>

                        <div class="ml-8 flex-grow-1">
                          <template v-for="(key, i) in activeActions(workflow.actions)" :key="i">
                            <div :class="{ 'mt-3': i > 0 }">
                              <v-icon color="grey" class="mr-3">{{ getActionIcon(key) }}</v-icon>
                              {{ getActionText(key) }}
                            </div>
                          </template>
                        </div>
                        <div class="d-inline-flex align-center">
                          <v-chip v-if="!workflow.active" class="mr-1" density="comfortable">
                            <v-icon class="mr-1">mdi-lock-outline</v-icon>Disabled
                          </v-chip>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-container>
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="close">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, watch, type PropType } from 'vue';
import type { InspectionForm } from '@/types/maintenance/inspectionForm';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  form: {
    type: Object as PropType<InspectionForm>,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const step = ref(1)

const close = () => {
  emit('update:modelValue', false);
};

const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value);
};

const itemHeaders = [
  { title: 'Item Name', key: 'name' },
  { title: 'Description', key: 'description' },
  { title: 'Pass/Fail Criteria', key: 'passFailCriteria' },
  // { title: 'Actions', key: 'actions', sortable: false },
];

const formItemsLength = computed(() => {
  return props.form.elements.filter(item => item.type != 'section')?.length || 0
})

const activeActions = (actions: any) => {
  let result = [];
  if (actions.change_vehicle_status.active) {
    result.push('change_vehicle_status')
  }
  if (actions.send_an_email.active) {
    result.push('send_an_email')
  }
  if (actions.create_an_issue.active) {
    result.push('create_an_issue')
  }
  return result
}

const getTrigerIcon = (trigger: string) => {
  switch (trigger) {
    case 'item_pass':
      return 'mdi-check-circle-outline'
    case 'item_fail':
      return 'mdi-close-circle-outline'
    case 'form_submitted':
      return 'mdi-clipboard-check-outline'
  }
}

const getTriggerText = (trigger: string) => {
  switch (trigger) {
    case 'item_pass':
      return 'If an item passes'
    case 'item_fail':
      return 'If an item fails'
    case 'form_submitted':
      return 'If form is submitted'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'primary';
    case 'Draft':
      return 'green';
    default:
      return '';
  }
};

const getActionIcon = (action: string) => {
  switch (action) {
    case 'change_vehicle_status':
      return 'mdi-car'
    case 'send_an_email':
      return 'mdi-email-outline'
    case 'create_an_issue':
      return 'mdi-alert-outline'
  }
}

const getActionText = (action: string) => {
  switch (action) {
    case 'change_vehicle_status':
      return 'Change vehicle status'
    case 'send_an_email':
      return 'Send an email'
    case 'create_an_issue':
      return 'Create an issue'
  }
}

watch(
  () => props.modelValue,
  (newModalValue) => {
    if (newModalValue == false) {
      step.value = 1
    }
  }
)
</script>