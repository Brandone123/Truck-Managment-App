<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia'
import type { DailyDutyInfo, PositionInfo } from '@/types/employeeInformationAndOperation/position';

const dailyDutyStore = useDailyDutyStore()
const { dailyDutyList } = storeToRefs(dailyDutyStore)

const props = defineProps({
  // dailyDutyList: {
  //   type: Array as () => DailyDutyInfo[],
  //   required: true,
  //   default: []
  // },
  selectedPositionId: {
    type: Number,
    required: false,
    default: null
  }
});

const dutyHeaders = ref([
  { title: 'DUTY ID', key: 'id', class: "no-wrap" },
  { title: 'DESCRIPTION', key: 'description', class: "no-wrap" },
  { title: 'FREQUENCY', key: 'frequency', class: "no-wrap" },
  { title: 'ACTIONS', key: 'actions', class: "no-wrap" },
])

const editedDailyDuty = ref<PositionInfo>({})
const updatingDailyDuty = ref(false)
const dailyDutyDialog = ref(false)

const editDailyDuty = (dailyDuty: DailyDutyInfo) => {
  editedDailyDuty.value = Object.assign({}, dailyDuty)
  updatingDailyDuty.value = true
  dailyDutyDialog.value = true
}

const deleteDailyDuty = (dailyDuty: DailyDutyInfo) => {
  dailyDutyStore.deleteDuty(dailyDuty.id as number)
}

const updateDailyDutyDialog = (value: boolean) => {
  dailyDutyDialog.value = value
  editedDailyDuty.value = {}
  updatingDailyDuty.value = false
}

const filteredDailyDuties = computed(() => {
  if (props.selectedPositionId) {
    return dailyDutyList.value.filter((dailyDuty: DailyDutyInfo) => dailyDuty.position_id == props.selectedPositionId)
  }
  return dailyDutyList.value
})
</script>

<template>
  <div>
    <v-row no-gutters class="my-2">
      <v-spacer></v-spacer>
      <EmployeeInformationAndOperationSettingsPositionDailyDutyDialog :show="dailyDutyDialog"
        @update:show="updateDailyDutyDialog" :updating="updatingDailyDuty" :item="editedDailyDuty"
        :selectedPositionId="selectedPositionId" />
    </v-row>
    <v-data-table no-data-text="No Daily Duties Assigned" :headers="dutyHeaders" :items="filteredDailyDuties">
      <template v-slot:item.actions="{ item: positionDuty }">
        <v-icon color="primary" dense @click="editDailyDuty(positionDuty as DailyDutyInfo)">mdi-pencil</v-icon>
        <v-icon color="red" dense @click="deleteDailyDuty(positionDuty as DailyDutyInfo)">mdi-delete</v-icon>
      </template>

      <!-- hide footer -->
      <template #bottom></template>
    </v-data-table>
  </div>
</template>

<style scoped></style>