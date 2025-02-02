<template>
  <v-dialog v-model="dialog" fullscreen scrollable>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>Override #{{ override.id }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title>Audit Log</v-card-title>
              <v-card-text>
                <v-timeline align="start" side="end">
                  <v-timeline-item v-for="(item, i) in override.audit_logs || []" size="small"
                    :icon="getAuditIcon(item.action_type)" dot-color="primary" fill-dot>
                    <template v-slot:opposite>
                      <div>
                        <SharedTableDynamicTechnicianItem :technician="item.employee" />
                        <span>{{ formatDate(item.created_at) }}</span>
                      </div>
                    </template>
                    <v-card class="elevation-2">
                      <v-card-title>
                        {{ item.action_type }}
                      </v-card-title>
                      <v-card-text>
                        <div>
                          <div>Description: {{ item.description }}</div>
                          <div v-if="(item.original_data?.valid === null || item.original_data?.valid === true)  && item.new_data === null">
                            Action: Override Granted.
                          </div>
                          <div v-if="item.original_data?.valid === null && item.new_data?.valid === true">
                            Action: Updated from Granted to Activated
                          </div>
                          <div v-else-if="item.original_data?.valid === true && item.new_data?.valid === false">
                            Action: Updated from Activated to Revoked
                          </div>
                          <div v-else-if="item.original_data?.valid === false && item.new_data?.valid === true">
                            Action: Updated from Revoked to Activated
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-timeline-item>
                </v-timeline>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { PropType } from 'vue';
import moment from 'moment';
import type { OverrideInfo } from '~/types/store/accessControl';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  override: {
    type: Object as PropType<Partial<OverrideInfo>>,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const currentOverride = ref<Partial<OverrideInfo>>({ ...props.override });

const getAuditIcon = (action: string) => {
  switch (action) {
    case 'Created':
      return 'mdi-plus-circle';
    case 'Update':
      return 'mdi-pencil-circle';
    case 'Deduction':
      return 'mdi-minus-circle';
    default:
      return 'mdi-file';
  }
};

const formatDate = (dateString: string | null) => {
  return moment(dateString).format('dddd, MMM Do YYYY');
};

watch(
  () => props.override,
  (newRecord) => {
    currentOverride.value = { ...newRecord };
  }
);
</script>

<style scoped></style>