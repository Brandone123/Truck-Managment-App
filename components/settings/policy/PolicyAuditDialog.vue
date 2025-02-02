<template>
  <v-dialog v-model="dialog" fullscreen scrollable>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>Override #{{ policy.id }}</v-toolbar-title>
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
                  <v-timeline-item v-for="(item, i) in policy.audit_logs || []" size="small"
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
                        <!-- Check for Granted Action Type -->
                        <div v-if="item.action_type === 'Create'">
                          <div>
                           {{ item.description }}
                          </div>
                        </div>

                        <!-- Check for Update Action Type -->
                        <div v-if="item.action_type === 'Update' && item.update">
                          <div v-for="(change, field) in item.update" :key="field">
                            <div>
                              {{ field | capitalize }} Updated From {{ change.old_value || 'N/A' }} to {{
                              change.new_value || 'N/A' }}
                            </div>
                          </div>
                        </div>

                        <!-- Check for Other Action Types -->
                        <div v-else>
                          <div>
                            Action: {{ item.description || 'No additional details available.' }}
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
import { ref, computed, watch, onMounted } from 'vue';
import type { PropType } from 'vue';
import moment from 'moment';
import type { PolicyInfo } from '~/types/store/policy';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  policy: {
    type: Object as PropType<Partial<PolicyInfo>>,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

// Dialog for modal visibility
const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

// Current leave request record for tracking changes
const currentOverride = ref<Partial<PolicyInfo>>({ ...props.policy });

// Function to determine audit log icons
const getAuditIcon = (action: string) => {
  switch (action) {
    case 'Create':
      return 'mdi-plus-circle';
    case 'Update':
      return 'mdi-pencil-circle';
    case 'Delete':
      return 'mdi-minus-circle';
    default:
      return 'mdi-file';
  }
};

// Utility function to format dates
const formatDate = (dateString: string | null) => {
  return moment(dateString).format('dddd, MMM Do YYYY');
};


// Function to format audit changes for display
const formatAuditChange = (newValue: string | null, oldValue: string | null, field: string) => {
  if (newValue !== oldValue) {
    return `${field} Updated From ${oldValue || 'N/A'} to ${newValue || 'N/A'}`;
  }
  return null;
};

// Watch for leave request updates and reset the current record
watch(
  () => props.policy,
  (newRecord) => {
    currentOverride.value = { ...newRecord };
  }
);

</script>



<style scoped></style>