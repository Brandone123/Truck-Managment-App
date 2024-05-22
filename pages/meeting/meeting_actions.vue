<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia'
import { useMeetingActionStore } from '@/stores/meeting_action'
import type { MeetingActionInfo } from '@/types/meeting/meeting_action';


const meetingActionStore = useMeetingActionStore()
const meetingResolutionStore = useMeetingResolutionStore()
const {meetingResolutionList} = storeToRefs(meetingResolutionStore)

const meetingActionList = computed(() =>{
    const store = useMeetingActionStore();
    return store.getMeetingActionList;
  })

// onMounted(() => {
//     meetingActionStore.fetchMeetingActionList();
// });

const emit = defineEmits(['editMeetingAction', 'deleteMeetingAction'])

const getStatusColor = (status:any) => {
    switch (status) {
      case 'Completed':
        return 'text-green';
      case 'In Progress':
        return 'text-orange';
      case 'Open':
        return 'text-red';
    }
  };

const meetingActionHeaders = ref([
    { title: 'MEETING ACTION ID', key: 'id' ,class:"no-wrap" },
    { title: 'RESOLUTION DETAILS ', key: 'resolution_id' ,class:"no-wrap" },
    { title: 'ACTION DETAILS', key: 'action_details',class:"no-wrap"},
    { title: 'STATUS', key: 'status',class:"no-wrap"},
    { title: 'ASSIGNED TO', key: 'assigned_to',class:"no-wrap"  },
    { title: 'DUE DATE', key: 'due_date',class:"no-wrap"  },
    { title: 'DATE & TIME', key: 'timestamp',class:"no-wrap"  },
    { title: 'ACTIONS', key: 'actions',class:"no-wrap" },

])

const meetingActionDialog = ref(false)
const updatingMeetingAction = ref(false)

const getResolutionName = (resolutionId:any) => {
  const resolution = meetingResolutionList.value.find((res) => res.id === resolutionId);
  return resolution ? resolution.resolution_details : '';
};


const defaultMeetingAction: Ref<MeetingActionInfo> = ref({
    id: null,
    resolution_id: null,
    action_details: null,
    assigned_to: null,
    due_date: null,
    status: null,
    timestamp: null,
});

const editedMeetingAction = ref(defaultMeetingAction.value)

const editMeetingAction = (meeting_action: MeetingActionInfo) => {
    editedMeetingAction.value = Object.assign({}, meeting_action)
    updatingMeetingAction.value = true
    meetingActionDialog.value = true
}

const updateMeetingActionDialog = (value: boolean) => {
    meetingActionDialog.value = value
    editedMeetingAction.value = defaultMeetingAction.value as MeetingActionInfo
    updatingMeetingAction.value = false
}

const deleteMeetingAction = (id: number) => {
    meetingActionStore.deleteMeetingAction(id)
}

</script>
<template>
    <div>
        <div class="d-flex justify-space-between">
                <span class="text-primary text-h5">Meeting Action </span>
                <div>
                    <MeetingActionDialog :updating="updatingMeetingAction" @update:show="updateMeetingActionDialog" 
                    :show="meetingActionDialog" :item="editedMeetingAction" />
                </div>
        </div>
        
            <SharedUiCustomTable return-object show-select :headers="meetingActionHeaders" :items="meetingActionList">
                <template v-slot:item.actions="{ item }">
                    <div>
                    <v-icon color="primary" dense @click="editMeetingAction(item)">mdi-pencil</v-icon>
                    <v-icon color="red" dense @click="deleteMeetingAction(item.id)">mdi-delete</v-icon>
                    </div>
                </template>
                <template v-slot:item.status="{ item }">
                    <span :class="getStatusColor(item.status)">{{ item.status }}</span>
                </template>
                <template v-slot:item.resolution_id="{ item }">
                    <span>{{ getResolutionName(item.resolution_id) }}</span>
                </template>
            </SharedUiCustomTable>
    </div> 
</template>


<style scoped >
</style>