<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="updateModelValue"
    max-width="1000"
  >
    <v-card class="grey-background">
      <v-toolbar color="primary" density="compact">
        <v-toolbar-title class="text-center w-100">
          Clock In/Clock Out Time for ,
          {{
            record[0].clock_out
              ? moment(record[0].clock_out).format("MMM D YYYY")
              : record[0].clock_out_time
              ? moment(record[0].clock_out_time).format("MMM D YYYY")
              : ""
          }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-window-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-row justify="center">
          <template v-if="record && record.length > 0">
            <template v-for="(item, index) in record" :key="item.id">
              <v-card style="margin: 10px; width: 444px">
                <v-card-text>
                  <v-col>
                    <span
                      style="margin-bottom: 20px"
                      class="font-weight-semibold text-h6"
                      >Clock In #{{ index + 1 }}</span
                    >
                    <div class="my-2"></div>
                    <v-row>
                      <v-col cols="12" md="6">
                        <span
                          style="margin-bottom: 20px"
                          class="font-weight-medium text-medium"
                          >Time</span
                        >
                        <br />
                        <span>{{
                          item.clock_in
                            ? item.clock_in.toString().slice(11)
                            : item.clock_in_time
                            ? item.clock_in_time.toString().slice(11)
                            : ""
                        }}</span>
                      </v-col>
                      <v-col cols="12" md="6">
                        <span class="font-weight-medium text-medium"
                          >Location</span
                        >
                        <br />
                        <span>{{ "Montreal Ohio" }}</span>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-divider class="my-1"></v-divider>
                  <v-col>
                    <span class="font-weight-semibold text-h6"
                      >Clock Out #{{ index + 1 }}</span
                    ><br />
                    <div class="my-2"></div>
                    <v-row>
                      <v-col cols="12" md="6">
                        <span class="font-weight-medium text-medium">Time</span>
                        <br />
                        <span>
                          {{
                            item.clock_out
                              ? item.clock_out.toString().slice(11)
                              : item.clock_out_time
                              ? item.clock_out_time.toString().slice(11)
                              : ""
                          }}
                        </span>
                      </v-col>
                      <v-col cols="12" md="6">
                        <span class="font-weight-medium text-medium"
                          >Location</span
                        >
                        <br />
                        <span>{{ "Montreal Ohio" }}</span>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-divider class="my-1"></v-divider>
                  <v-col>
                    <v-row>
                      <v-col
                        class="font-weight-medium text-medium"
                        cols="12"
                        md="6"
                        >Total Hour Worked</v-col
                      >
                      <v-col
                        class="font-weight-bold text-medium text-primary"
                        cols="12"
                        md="6"
                      >
                        {{
                          item.total_hours
                            ? item.total_hours
                            : item.hours_worked
                            ? item.hours_worked
                            : 0
                        }}
                        hrs
                      </v-col>
                    </v-row>
                  </v-col>
                </v-card-text>
              </v-card>
            </template>
          </template>
          <template v-else>
            <p>No records available.</p>
          </template>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="justify-center">
        <v-btn @click="closeDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, watch } from "vue";
import { useAttendanceStore } from "@/stores/attendance/attendance";
import { storeToRefs } from "pinia";
import moment from "moment";
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  record: {
    type: Array,
    required: true,
  },
});

const attendanceStore = useAttendanceStore();
const { employeeDailyRecord, selectedDailyRecord, payPeriodAttendanceList } =
  storeToRefs(attendanceStore);
const selectedDay = ref("Clock In/Out Details");
watch(
  () => props.record,
  (newRecord) => {
    console.log("Record updated:", newRecord[0]);
  }
);
const emit = defineEmits(["update:modelValue"]);

const updateModelValue = (value: boolean) => {
  emit("update:modelValue", value);
};

const closeDialog = () => {
  emit("update:modelValue", false);
};
</script>

<style scoped>
.font-weight-medium {
  font-weight: 500 !important;
}
.sub-title {
  margin-bottom: 160px !important;
}

.text-medium {
  font-size: 18px !important;
  padding-top: 5px !important;
}
</style>
