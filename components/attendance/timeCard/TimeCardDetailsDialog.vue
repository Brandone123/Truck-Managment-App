<template>
  <v-dialog :model-value="modelValue" fullscreen scrollable>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>Work Order</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import { ref,defineProps } from 'vue';
  import moment from 'moment'
import type { AttendanceRecord } from '~/types/attendance/attendanceTypes';  

  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true,
    },
    attendanceTimeCard: {
      type: Object as PropType<Partial<AttendanceRecord>>,
      required: false,
    },
  });
</script>

<style scoped>
.title {
  font-weight: bold;
  color: #1984c5;
}

.custom-timeline :deep(.v-timeline--item__body) {
  width: 100%;
}

.side-button {
  height: 50px;
  cursor: pointer;
}

.side-button:hover {
  background-color: #eeeeee;
}

#side-panel {
  height: 100%;
  width: 50px;
  border-left: 1px solid grey;
}


.custom-tr :deep() td {
  border-bottom: transparent !important
}
</style>