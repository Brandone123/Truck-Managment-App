<template>
  <div>
    <v-row>
      <!-- Training Program Selector -->
      <v-col cols="12" md="4">
        <v-select variant="solo" v-model="selectedProgram" :items="programs" label="Select Program" item-title="name"
          item-value="id" return-object clearable density="compact"></v-select>
      </v-col>

      <!-- Employee/Driver Selector -->
      <v-col cols="12" md="4">
        <v-autocomplete variant="solo" v-model="selectedEmployee" :items="employees" label="Select Employee/Driver"
          item-title="name" item-value="id" return-object clearable multiple density="compact"></v-autocomplete>
      </v-col>

      <!-- Date Range Selector -->
      <v-col cols="12" md="4">
        <input density="compact" variant="solo" type="text" v-model="dateRange" id="dateRangePicker"
          @click="showDatePicker('dateRangePicker')" />
      </v-col>
    </v-row>
    <div class="d-flex justify-center">
      <v-btn color="primary" variant="outlined" density="compact" rouned @click="applyFilters">Apply Filters</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
const programs = ref([
  { id: 1, name: 'Safety Training' },
  { id: 2, name: 'Operational Excellence' },
  // Add more programs
]);

const employees = ref([
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  // Add more employees/drivers
]);

const selectedProgram = ref(null);
const selectedEmployee = ref([]);
const menu = ref(false);
// const dateRange = ref([new Date().toISOString().substr(0, 10), new Date().toISOString().substr(0, 10)]);

const dateRange = ref<string[]>([]);

const dateText = computed(() => {
  return `${dateRange.value[0]} to ${dateRange.value[1]}`;
});

const applyFilters = () => {
  console.log('Applying filters:', { selectedProgram, selectedEmployee, dateRange });
  // Implement the logic to filter the progress reports based on selected filters
};

const showDatePicker = (inputFieldId: string) => {

  $(`input[id="${inputFieldId}"]`).daterangepicker({
    opens: 'left'
  }, function(start:any, end:any, label:any) {
    console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
  })
}
</script>