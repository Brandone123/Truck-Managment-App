<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
import type { LeavePolicyInfo } from '@/types/attendance/leave_policy'
import { useLeavePolicyStore } from '@/stores/settings/attendance/leave_policy'

// const emit = defineEmits(['editItem'])

const leavePolicyStore = useLeavePolicyStore()
const { leavePolicyList } = storeToRefs(leavePolicyStore)

onMounted(() => {
    leavePolicyStore.fetchLeavePolicyList();
});

const leavePolicyHeaders = ref([
    { title: 'Name', value: 'name' },
    { title: 'Description', value: 'description' },
    { title: 'Min Notice Period', value: 'min_notice_period' },
    { title: 'Max Annual Leave Days', value: 'annual_leave_days' },
    { title: 'Effective Date', value: 'effective_date' },
    { title: 'Actions', value: 'actions' },
])

const editedLeavePolicy = ref<LeavePolicyInfo>({})
const updatingLeavePolicy = ref(false)
const leavePolicyDialog = ref(false)

const print = (selectedItems: any) => {
    console.log(selectedItems)
}

const editLeavePolicy = (leave_type: LeavePolicyInfo) => {
    editedLeavePolicy.value = Object.assign({}, leave_type)
    updatingLeavePolicy.value = true
    leavePolicyDialog.value = true
}

const deleteLeavePolicy = (leave_type_id: number) => {
    leavePolicyStore.deleteLeavePolicy(leave_type_id)
}

const updateleavePolicyDialog = (value: boolean) => {
    leavePolicyDialog.value = value
    editedLeavePolicy.value = {}
    updatingLeavePolicy.value = false
}
</script>
<template>
    <div>
        <AttendanceSettingsLeavePolicyDialog :show="leavePolicyDialog" @update:show="updateleavePolicyDialog"
            :updating="updatingLeavePolicy" :item="editedLeavePolicy" />
    </div>
    <div>
        <SharedUiCustomTable return-object :headers="leavePolicyHeaders" :items="leavePolicyList">

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
                    <v-icon color="primary" dense @click="editLeavePolicy(item)">mdi-pencil</v-icon>
                    <v-icon color="red" dense @click="deleteLeavePolicy(item.id)">mdi-delete</v-icon>
                </div>
            </template>
        </SharedUiCustomTable>
    </div>
</template>

<style scoped ></style>