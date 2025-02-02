<template>
  <v-dialog v-model="dialog" fullscreen scrollable>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>Time Correction Request Details</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">Employee</v-col>
                  <v-col cols="12" md="6">{{ correctionRequest.employee?.first_name }} {{
                    correctionRequest.employee?.last_name }}</v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-row>
                  <v-col cols="12" md="6">Attendance Date</v-col>
                  <v-col cols="12" md="6">
                    {{ moment(correctionRequest.attendance_record?.date).format('dddd, MMM Do YYYY') }}
                  </v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-row>
                  <v-col cols="12" md="6">Corection Requested At</v-col>
                  <v-col cols="12" md="6">{{ formatDate(correctionRequest.requested_at as string) }}</v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-row>
                  <v-col cols="12" md="6">Reason</v-col>
                  <v-col cols="12" md="6">{{ correctionRequest.reason }}</v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <v-card class="mt-2">
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-list>
                      <v-list-item class="px-0">
                        <v-list-item-title icon="mdi-calendar">Clock In Correction</v-list-item-title>
                        <v-list-item-subtitle> <b>From</b>
                          <span class="mx-2">{{ formatTime(correctionRequest.attendance_record?.clock_in_time) }}</span>
                          <b>To</b> <span class="ml-2">{{ formatTime(correctionRequest.corrected_clock_in_time)
                            }}</span></v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-list>
                      <v-list-item class="px-0">
                        <v-list-item-title icon="mdi-calendar">Clock Out Correction</v-list-item-title>
                        <v-list-item-subtitle> <b>From</b>
                          <span class="mx-2">{{ formatTime(correctionRequest.attendance_record?.clock_out_time)
                            }}</span>
                          <b>To</b> <span class="ml-2">{{ formatTime(correctionRequest.corrected_clock_out_time)
                            }}</span></v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-row>
                  <v-col cols="12" md="6">Status</v-col>
                  <v-col cols="12" md="6">{{ correctionRequest.status }}</v-col>
                </v-row>
                <v-divider class="my-3" v-if="correctionRequest.status == 'Denied'"></v-divider>
                <v-row v-if="correctionRequest.status == 'Denied'">
                  <v-col cols="12" md="6">Reason For Denial</v-col>
                  <v-col cols="12" md="6">{{ correctionRequest.denial_reason }}</v-col>
                </v-row>
                <v-divider class="my-3" v-if="correctionRequest.status != 'Pending'"></v-divider>
                <v-row v-if="correctionRequest.status != 'Pending'">
                  <v-col cols="12" md="6">Reviewed By</v-col>
                  <v-col cols="12" md="6">
                    <SharedTableDynamicTechnicianItem v-if="correctionRequest.reviewer"
                      :technician="correctionRequest.reviewer as EmployeeInfo" />
                  </v-col>
                </v-row>
                <v-divider class="my-3" v-if="correctionRequest.status != 'Pending'"></v-divider>
                <v-row v-if="correctionRequest.status != 'Pending'">
                  <v-col cols="12" md="6">Reviewed At</v-col>
                  <v-col cols="12" md="6">{{ formatDate(correctionRequest.reviewed_at as string) }}</v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>Audit Log</v-card-title>
              <v-card-text>
                <v-timeline align="start" side="end">
                  <v-timeline-item v-for="(item, i) in correctionRequest.audit_logs || []" size="small"
                    :icon="getAuditIcon(item.status)" dot-color="primary" fill-dot>
                    <template v-slot:opposite>
                      <div>
                        <span>{{ formatDate(item.created_at) }}</span>
                      </div>
                    </template>
                    <v-card class="elevation-2">
                      <v-card-title>
                        {{ item.status }}
                      </v-card-title>
                      <v-card-text>
                        <div v-if="['Approved', 'Denied'].includes(item.status)">
                          <div>
                            Reviewed By
                            <span class="d-inline-flex">
                              <SharedTableDynamicTechnicianItem class="d-inline-flex" v-if="item.reviewer"
                                :technician="item.reviewer" />
                            </span>

                          </div>

                          <v-list>
                            <v-list-item class="px-0" v-if="item.status == 'Denied'">
                              <v-list-item-subtitle>Reason For Denial</v-list-item-subtitle>
                              <v-list-item-title class="text-capitalize">{{ item.denial_reason }}</v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </div>

                        <div v-else>
                          <span v-if="item.requested_at">Request Created</span>
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
        <v-btn @click="dialog = false">Close</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" :disabled="correctionRequest.status == 'Approved'" @click="approveRequest"
          append-icon="mdi-check">Approve</v-btn>
        <v-btn color="orange" :disabled="correctionRequest.status == 'Denied'" @click="denyRequest"
          append-icon="mdi-window-close">Deny</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { PropType } from 'vue';
import type { TimeCorrectionRequest } from '@/types/workforce/attendanceRecord';
import moment from 'moment';
import { useValidation } from '~/composables/formValidation';
import type { EmployeeInfo } from '~/types/store/employee';

const validation = useValidation();


const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  correctionRequest: {
    type: Object as PropType<Partial<TimeCorrectionRequest>>,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'close', 'approveRequest', 'denyRequest']);

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const formatTime = (timeString: string | undefined) => {
  if (!timeString) return 'N/A';
  return moment(timeString).format('h:mm A')
};


// Native JavaScript function for formatting date and time
const formatDate = (dateString: string) => {
  if (!dateString) {
    return 'Invalid Date'
  }
  return moment(dateString).format('dddd, MMM Do YYYY, h:mm A')
};

const approveRequest = () => {
  dialog.value = false;
  emit('approveRequest');
}

const denyRequest = () => {
  dialog.value = false;
  emit('denyRequest')
}

const currentCorrectionRequest = ref<Partial<TimeCorrectionRequest>>({
  ...props.correctionRequest,
});


const getAuditIcon = (status: string) => {
  switch (status) {
    case 'Pending':
      return 'mdi-dots-horizontal';
    case 'Approved':
      return 'mdi-check';
    case 'Denied':
      return 'mdi-window-close';
    default:
      return '';
  }
}

watch(
  () => props.correctionRequest,
  (newRequest) => {
    currentCorrectionRequest.value = { ...newRequest };
  }
);
</script>

<style scoped>
.v-toolbar-title {
  flex: auto !important;
}

.v-text-field :deep(input[type="time"].v-field__input::-webkit-calendar-picker-indicator) {
  background: transparent;
  bottom: 0;
  color: transparent;
  cursor: pointer;
  height: auto;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: auto
}

.v-text-field :deep(input[type="date"].v-field__input::-webkit-calendar-picker-indicator) {
  background: transparent;
  bottom: 0;
  color: transparent;
  cursor: pointer;
  height: auto;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: auto
}
</style>