<template>
    <div class="mt-n4">
        <div>
            <span class="text-primary text-h6">Attendance Punch Correction</span>
        </div>

        <v-row class="mt-5">
            <v-col cols="12" md="3">
                <v-card class="card-1 text-center">
                    <v-card-title class="justify-space-between">
                        <v-icon class="mr-2" color="#CE0053">mdi-calendar-clock</v-icon>
                        <span>Total Request</span>
                    </v-card-title>
                    <v-card-text>
                        <span class="font-weight-bold text-h6">{{ totalRequests }}</span>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="3">
                <v-card class="card-2 text-center">
                    <v-card-title class="justify-space-between">
                        <v-icon class="mr-2" color="#1867C0">mdi-timer-sand</v-icon>
                        <span>Pending Request</span>
                    </v-card-title>
                    <v-card-text>
                        <span class="font-weight-bold text-h6">{{ pendingRequests }}</span>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="3">
                <v-card class="card-3 text-center">
                    <v-card-title class="justify-space-between">
                        <v-icon class="mr-2" color="#424656">mdi-clock-outline</v-icon>
                        <span>Rejected Request</span>
                    </v-card-title>
                    <v-card-text>
                        <span class="font-weight-bold text-h6">{{ rejectedRequests }}</span>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="3">
                <v-card class="card-4 text-center">
                    <v-card-title class="justify-space-between">
                        <v-icon class="mr-2" color="#a4d0ee">mdi-account-clock</v-icon>
                        <span>Approved Request</span>
                    </v-card-title>
                    <v-card-text>
                        <span class="font-weight-bold text-h6">{{ approvedRequests }}</span>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <PunchEditDialog :modelValue="punchEditDialog" :punch="selectedPunch" @update:modelValue="punchEditDialog = $event"/>

        <SharedUiCustomTable :showFooterInHead="false" :headers="punchHeaders" :items="punchCorrections" :loading="loadingPunch">
            <template v-slot:item.actions="{ item }">
            <!-- <v-icon class="ml-2" color="primary" dense @click="viewDetails(item)">mdi-eye</v-icon> -->
            <v-icon class="ml-2" color="primary" dense @click="editPunch(item)">mdi-pencil</v-icon>
            <!-- <v-icon class="ml-2" color="red" dense @click="deletePunch(item.id)">mdi-delete</v-icon> -->
            </template>
            <template v-slot:item.status="{ item }">
            <v-chip density="compact" variant="flat" :color="getStatusClass(item)" size="small"
                style="text-transform: capitalize">
                {{ item.status }}
            </v-chip>
            </template>
            <template v-slot:item.user_id="{ item }">
                <div class="user-id-container">
                    <SharedTableTechnicianItem v-if="item.user_id" :userId="item.user_id" />
                    <span v-else>{{ getEmployeeName(item.user_id) }}</span>
                </div>
            </template>
        </SharedUiCustomTable>
      
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useAttendanceStore } from '@/stores/attendance/attendance';
import { storeToRefs } from 'pinia';
import type { AttendancePunchCorrection } from '~/types/attendance/attendanceTypes';
import PunchEditDialog from '~/components/attendance/PunchCorrection/PunchEditDialog.vue';

const attendanceStore = useAttendanceStore();
const { loadingPunch, punchCorrections } = storeToRefs(attendanceStore);

const punchEditDialog = ref(false);

const selectedPunch = ref<Partial<AttendancePunchCorrection>>({} as Partial<AttendancePunchCorrection>);

const employeeStore = useEmployeeStore()
const { employeeList } = storeToRefs(employeeStore)

const getEmployeeName = (user_id : number) =>{
    let employee = employeeList.value.find((employee: any) => employee.user_id == user_id)
    return employee ? `${employee.first_name} ${employee.last_name}` : 'N/A'
}

const punchHeaders = [
  { title: 'Employee', key: 'user_id' },
  { title: 'Attendance ID', key: 'attendance_id' },
  { title: 'Correction Type', key: 'correction_type' },
  { title: 'Original Time', key: 'original_time' },
  { title: 'Corrected Time', key: 'corrected_time' },
  { title: 'Reason', key: 'reason' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions' },
];

const getStatusClass = (item: any) => {
  const punchData = punchCorrections.value.find((punch: any) => punch.id === item.id);
  if (punchData?.status) {
    if (punchData?.status === "Rejected") {
      return 'error';
    } else if (punchData?.status === "Approved") {
      return 'primary';
    } else if (punchData?.status === "Pending") {
      return 'secondary'
    } else {
      return 'grey'
    }
  }
  return '';
}

const totalRequests = computed(() => {
  return punchCorrections.value.length;
});

const pendingRequests = computed(() => {
  return punchCorrections.value.filter(punch => punch.status === 'Pending').length;
});

const rejectedRequests = computed(() => {
  return punchCorrections.value.filter(punch => punch.status === 'Rejected').length;
});

const approvedRequests = computed(() => {
  return punchCorrections.value.filter(punch => punch.status === 'Approved').length;
});


const editPunch = (punch: any) => {
  selectedPunch.value = punch;
  punchEditDialog.value = true;
};

onMounted(() => {
    employeeStore.fetchEmployeeList()
    attendanceStore.fetchPunchCorrection()
})
</script>

<style scoped>
.card-1 {
    border-left: 8px solid #CE0053;
}

.card-2 {
    border-left: 8px solid #1867C0;
}

.card-3 {
    border-left: 8px solid #424656;
}

.card-4 {
    border-left: 8px solid #a4d0ee;
}

.user-id-container {
    display: flex;
    flex-grow: 1; /* Permet au conteneur de prendre plus de place disponible */
    justify-content: flex-start; /* Aligne le contenu à gauche */
    min-width: 150px; /* Ajustez le min-width selon vos besoins */
}
</style>