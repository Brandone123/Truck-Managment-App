
<template>
    <SharedUiCustomTable class="customTable" items-per-page="50" :sticky-top-offset="95"
      :show-footer-in-head="false" show-select :headers="tableHeaders" :items="records" :loading="loading">
  
      <template v-slot:item.actions="{ item }">
        <v-icon class="ml-2" color="primary" @click="$emit('view', item)">mdi-eye</v-icon>
        <v-icon class="ml-2" color="primary" @click="$emit('edit', item)">mdi-pencil</v-icon>
        <v-icon class="ml-2" color="red" @click="$emit('delete', item.id)">mdi-delete</v-icon>
      </template>
  
      <template v-slot:item.date="{ item }">
        <span>{{ item.date }}</span>
      </template>
  
      <template v-slot:item.clockInTime="{ item }">
        <span>{{  item.clockInTime }}</span>
      </template>
  
      <template v-slot:item.clockOutTime="{ item }">
        <span>{{ item.clockOutTime }}</span>
      </template>
  
      <template v-slot:item.clockInLocation="{ item }">
        <span>{{ item.clockInLocation }}</span>
      </template>
  
      <template v-slot:item.clockOutLocation="{ item }">
        <span>{{ item.clockOutLocation }}</span>
      </template>
  
      <template v-slot:item.regularHours="{ item }">
        <span>{{ item.regularHours }}</span>
      </template>
  
      <template v-slot:item.overtimeHours="{ item }">
        <span>{{ item.overtimeHours }}</span>
      </template>
  
      <template v-slot:item.totalHours="{ item }">
        <span>{{ item.totalHours }}</span>
      </template>
    </SharedUiCustomTable>
  </template>
  
  <script lang="ts" setup>
  import type { PropType, defineProps } from 'vue';
  import { useAttendanceStore } from '@/stores/attendance/attendance';
  import { storeToRefs } from 'pinia';

  const props = defineProps({
    records: {
      type: Array as PropType<any[]>,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  });
  const attendanceStore = useAttendanceStore();
  const { employeeDailyRecord } = storeToRefs(attendanceStore);


  const tableHeaders = [
    { title: 'Date', key: 'date' },
    { title: 'First Clock In', key: 'clockInTime' },
    { title: 'Last Clock Out', key: 'clockOutTime' },
    { title: 'Clock In Location', key: 'clockInLocation' },
    { title: 'Clock Out Location', key: 'clockOutLocation' },
    { title: 'Regular Hours', key: 'regularHours' },
    { title: 'Overtime Hours', key: 'overtimeHours' },
    { title: 'Total Hours', key: 'totalHours' },
    { title: 'Actions', key: 'actions', sortable: false },
  ];
  </script>
  