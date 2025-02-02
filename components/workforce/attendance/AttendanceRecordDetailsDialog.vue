<template>
  <v-dialog v-model="dialog" fullscreen scrollable>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>Attendance Record #{{ attendanceRecord.id }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-card style="position:sticky; top: 0px;">
              <v-card-title>Record Details</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="6">Employee</v-col>
                  <v-col cols="6">
                    <SharedTableDynamicTechnicianItem v-if="attendanceRecord.employee"
                      :technician="attendanceRecord.employee" />
                  </v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-row>
                  <v-col cols="6">Attendance Date:</v-col>
                  <v-col cols="6">{{ attendanceRecord.date ? formatDate(attendanceRecord.date) : ''
                    }}</v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-row>
                  <v-col cols="6">Clock In Time:</v-col>
                  <v-col cols="6">{{ attendanceRecord.clock_in_time ?
                    formatTime(attendanceRecord.clock_in_time) : '' }}</v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-row>
                  <v-col cols="6">Clock Out Time:</v-col>
                  <v-col cols="6">{{ attendanceRecord.clock_out_time ?
                    formatTime(attendanceRecord.clock_out_time) : '' }}</v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-row>
                  <v-col cols="6">Duration:</v-col>
                  <v-col cols="6">
                    {{ attendanceRecord.total_hours ?
                      formatTimeDuration(attendanceRecord.total_hours) : '' }}
                  </v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-row>
                  <v-col cols="6">Device ID:</v-col>
                  <v-col cols="6">{{ attendanceRecord.device_used }}</v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>Audit Log</v-card-title>
              <v-card-text>
                <v-timeline align="start" side="end">
                  <v-timeline-item v-for="(item, i) in attendanceRecord.audit_logs || []" size="small"
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
                        <div v-if="['Correction', 'Update'].includes(item.change_type)">
                          <div v-if="item.new_clock_in_time != item.original_clock_in_time">Clock In Time Updated From
                            {{ formatTime(item.original_clock_in_time) }} to {{ formatTime(item.new_clock_in_time as
                              string) }}</div>
                          <div v-else>Clock In Time Unchanged</div>
                          <div v-if="item.new_clock_out_time != item.original_clock_out_time">Clock Out Time Updated
                            From
                            {{ formatTime(item.original_clock_out_time as string) }} to
                            {{ formatTime(item.new_clock_out_time as string) }}
                          </div>
                          <div v-else>Clock Out Time Unchanged</div>
                        </div>

                        <div v-if="item.change_type == 'Clock In'">
                          <div v-if="item.new_clock_in_time != item.original_clock_in_time">Clocked In At
                            {{ formatTime(item.new_clock_in_time as string) }}</div>
                        </div>

                        <div v-if="item.change_type == 'Clock Out'">
                          <div v-if="item.new_clock_out_time != item.original_clock_out_time">Clocked Out At
                            {{ formatTime(item.new_clock_out_time as string) }}
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
import type { AttendanceRecord } from '@/types/workforce/attendanceRecord';
import moment from 'moment';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  attendanceRecord: {
    type: Object as PropType<Partial<AttendanceRecord>>,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const currentAttendanceRecord = ref<Partial<AttendanceRecord>>({ ...props.attendanceRecord });


const getAuditIcon = (action: string) => {
  switch (action) {
    case 'Creation':
      return 'mdi-account-clock';
    case 'Modification':
      return 'mdi-icon-modification';
    case 'Clock In':
      return 'mdi-clock-in';
    case 'Clock Out':
      return 'mdi-clock-out';
    case 'Correction':
    case 'Update':
      return 'mdi-clock-edit';
    default:
      return '';
  }
}
const formatDate = (dateString: string) => {
  return moment(dateString).format('dddd, MMM Do YYYY');
};

const formatTime = (timeString: string) => {
  return moment(timeString).format('hh:mm A')
};


const formatTimeDuration = (decimalHours: number) => {
  const duration = moment.duration(decimalHours, "hours");
  const hours = Math.floor(duration.asHours());
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  if (hours === 0 && minutes === 0) {
    return `${seconds}sec`;
  } else if (hours === 0) {
    return `${minutes}min`;
  } else if (minutes === 0) {
    return `${hours}hr`;
  }

  return `${hours}hr ${minutes}min`;
};

watch(
  () => props.attendanceRecord,
  (newRecord) => {
    currentAttendanceRecord.value = {
      ...newRecord,
      clock_in_time: newRecord.clock_in_time ? moment(newRecord.clock_in_time).local().format('HH:mm:ss') : '',
      clock_out_time: newRecord.clock_out_time ? moment(newRecord.clock_in_time).local().format('HH:mm:ss') : '',
    };
  }
);

</script>


<style scoped></style>