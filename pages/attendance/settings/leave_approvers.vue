<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
import type { LeaveApproverInfo } from '@/types/attendance/leave_approver'
import { useLeaveApproverStore } from '@/stores/settings/attendance/leave_approver'

// const emit = defineEmits(['editItem'])

const leaveApproverStore = useLeaveApproverStore()
const { leaveApproverList } = storeToRefs(leaveApproverStore)

const employeeStore = useEmployeeStore()

onMounted(() => {
    employeeStore.fetchEmployeeList()
    leaveApproverStore.fetchLeaveApproverList();
});

const leaveApproverHeaders = ref([
    { title: 'Name', value: 'full_name' },
    { title: 'Email', value: 'email' },
    { title: 'Actions', value: 'actions' },
])

const editedLeaveApprover = ref<LeaveApproverInfo>({})
const updatingLeaveApprover = ref(false)
const leaveApproverDialog = ref(false)

const print = (selectedItems: any) => {
    console.log(selectedItems)
}

const editLeaveApprover = (leave_type: LeaveApproverInfo) => {
    editedLeaveApprover.value = Object.assign({}, leave_type)
    updatingLeaveApprover.value = true
    leaveApproverDialog.value = true
}

const deleteLeaveApprover = (leave_type_id: number) => {
    leaveApproverStore.deleteLeaveApprover(leave_type_id)
}

const updateleaveApproverDialog = (value: boolean) => {
    leaveApproverDialog.value = value
    editedLeaveApprover.value = {}
    updatingLeaveApprover.value = false
}
</script>
<template>
    <div>
        <AttendanceSettingsLeaveApproverDialog :show="leaveApproverDialog" @update:show="updateleaveApproverDialog"
            :updating="updatingLeaveApprover" :item="editedLeaveApprover" />
    </div>
    <div>
        <SharedUiCustomTable return-object :headers="leaveApproverHeaders" :items="leaveApproverList">

            <!-- <template v-slot:item.id="{ item }">
            <v-btn color="primary" variant="text" @click="editLoad(item)">{{ item.id }}</v-btn>
        </template> -->
            <!-- Slot to capture bulk actions -->
            <template v-slot:bulkActions="{ selectedItems }" class="mr-2">
                <v-btn color="primary" class="text-none mr-2" @click="print(selectedItems)">
                    <v-icon>mdi-printer</v-icon> Print
                </v-btn>
            </template>

            <template v-slot:item.actions="{ item }">
                <div>
                    <!-- <v-icon color="primary" dense @click="editLeaveApprover(item)">mdi-pencil</v-icon> -->
                    <v-icon color="red" dense @click="deleteLeaveApprover(item.id)">mdi-delete</v-icon>
                </div>
            </template>
        </SharedUiCustomTable>
    </div>
</template>

<style scoped ></style>