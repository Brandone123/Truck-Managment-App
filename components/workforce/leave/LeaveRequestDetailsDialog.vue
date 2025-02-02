<template>
  <v-dialog v-model="dialog" fullscreen scrollable>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>Leave Request #{{ leaveRequest.id }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-card style="position:sticky; top: 0px;">
              <v-card-title>Request Details</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="6">Employee</v-col>
                  <v-col cols="6">
                    <SharedTableDynamicTechnicianItem v-if="leaveRequest.employee"
                      :technician="leaveRequest.employee" />
                  </v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-row>
                  <v-col cols="6">Start Date:</v-col>
                  <v-col cols="6">{{ leaveRequest.start_date ? formatDate(leaveRequest.start_date) : ''
                    }}</v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>

                <v-row>
                  <v-col cols="6">End Date:</v-col>
                  <v-col cols="6">{{ leaveRequest.end_date ? formatDate(leaveRequest.end_date) : ''
                    }}</v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-row>
                  <v-col cols="6">Requested At</v-col>
                  <v-col cols="6">{{ leaveRequest.requested_at ? formatDate(leaveRequest.requested_at) : ''
                    }}</v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-row>
                  <v-col cols="6">Leave Type:</v-col>
                  <v-col cols="6">{{ leaveRequest.leave_type?.leave_type_name }}</v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-row>
                  <v-col cols="6">Reason for Leave:</v-col>
                  <v-col cols="6">{{ leaveRequest.reason }}</v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-row>
                  <v-col cols="6">Duration (in days):</v-col>
                  <v-col cols="6">
                    {{ leaveRequest.total_days }}
                  </v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-row>
                  <v-col cols="6">Approved By:</v-col>
                  <v-col cols="6">
                    <SharedTableDynamicTechnicianItem v-if="leaveRequest.approver"
                      :technician="leaveRequest.approver" />
                    <span v-else>N/A</span>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>Audit Log</v-card-title>
              <v-card-text>
                <v-timeline align="start" side="end">
                  <v-timeline-item v-for="(item, i) in leaveRequest.audit_logs || []" size="small"
                    :icon="getAuditIcon(item.change_type)" dot-color="primary" fill-dot>
                    <template v-slot:opposite>
                      <div>
                        <SharedTableDynamicTechnicianItem :technician="item.employee" />
                        <span>{{ formatDate(item.created_at) }}</span>
                      </div>
                    </template>
                    <v-card class="elevation-2">
                      <v-card-title>
                        {{ item.change_type }}
                      </v-card-title>
                      <v-card-text>
                        <!-- Check for Created Change Type -->
                        <div v-if="item.change_type === 'Created'">
                          <div>
                            Leave Request Created: Start Date - {{ formatDate(item.original_start_date) }},
                            End Date - {{ formatDate(item.original_end_date) }},
                            Total Days - {{ item.original_total_days }},
                            Status - {{ item.original_status }}
                          </div>
                        </div>

                        <!-- Check for Update Change Type -->
                        <div v-if="item.change_type === 'Update'">
                          <!-- Start Date Change -->
                          <div v-if="item.new_start_date !== item.original_start_date">
                            Start Date Updated From
                            {{ formatDate(item.original_start_date) }} to {{ formatDate(item.new_start_date) }}
                          </div>

                          <!-- End Date Change -->
                          <div v-if="item.new_end_date !== item.original_end_date">
                            End Date Updated From
                            {{ formatDate(item.original_end_date) }} to {{ formatDate(item.new_end_date) }}
                          </div>

                          <!-- Total Days Change -->
                          <div v-if="item.new_total_days !== item.original_total_days">
                            Total Days Updated From
                            {{ item.original_total_days }} to {{ item.new_total_days }}
                          </div>

                          <!-- Status Change -->
                          <div v-if="item.new_status !== item.original_status">
                            Status Updated From
                            {{ item.original_status }} to {{ item.new_status }}
                          </div>
                        </div>

                        <!-- Check for Deduction Change Type -->
                        <div v-if="item.change_type === 'Deduction'">
                          <div>
                            Deduction Applied: {{ item.deduction_days }} days deducted.
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
import type { LeaveRequest } from '~/types/workforce/leaveRecord';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  leaveRequest: {
    type: Object as PropType<Partial<LeaveRequest>>,
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
const currentLeaveRecord = ref<Partial<LeaveRequest>>({ ...props.leaveRequest });

// Function to determine audit log icons
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
  () => props.leaveRequest,
  (newRecord) => {
    currentLeaveRecord.value = { ...newRecord };
  }
);

</script>


<style scoped></style>