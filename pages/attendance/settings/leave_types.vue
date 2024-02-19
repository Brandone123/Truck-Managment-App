<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
import type { LeaveTypeInfo } from '@/types/attendance/leave_type'
import  { useLeaveTypeStore } from '@/stores/settings/attendance/leave_type'

// const emit = defineEmits(['editItem'])

const leaveTypeStore = useLeaveTypeStore()
const { leaveTypeList } = storeToRefs(leaveTypeStore)

onMounted(() => {
    leaveTypeStore.fetchLeaveTypeList();
});

const timeoffHeaders = ref([
    { title: 'Name', key: 'name' },
    { title: 'Description', key: 'description', sortable: false },
    { title: 'Color', key: 'color' },
    { title: 'Actions', key: 'actions', sortable: false },
])

const editedLeaveType = ref<LeaveTypeInfo>({})
const updatingLeaveType = ref(false)
const leaveTypeDialog = ref(false)

const print = (selectedItems: any) => {
    console.log(selectedItems)
}

const editLeaveType= (leave_type: LeaveTypeInfo) => {
    editedLeaveType.value = Object.assign({}, leave_type)
    updatingLeaveType.value = true
    leaveTypeDialog.value = true
}

const deleteLeaveType= (leave_type_id: number) => {
    leaveTypeStore.deleteLeaveType(leave_type_id)
}

const updateleaveTypeDialog = (value: boolean) => {
    leaveTypeDialog.value = value
    editedLeaveType.value = {}
    updatingLeaveType.value = false
}
</script>
<template>
    <div>
        <AttendanceSettingsLeaveTypeDialog :show="leaveTypeDialog" @update:show="updateleaveTypeDialog"
                    :updating="updatingLeaveType" :item="editedLeaveType" />
    </div>
    <div>
    <SharedUiCustomTable return-object :headers="timeoffHeaders" :items="leaveTypeList">

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
                <v-icon color="primary" dense @click="editLeaveType(item)">mdi-pencil</v-icon>
                <v-icon color="red" dense @click="deleteLeaveType(item.id)">mdi-delete</v-icon>
            </div>
        </template>
        <template v-slot:item.color="{ item }">
            <v-chip density="compact" variant="flat" :color="item.color" style="width: 100%;">

            </v-chip>
        </template>
    </SharedUiCustomTable>
</div>
</template>

<style scoped ></style>