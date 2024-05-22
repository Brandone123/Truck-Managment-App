<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia'
import { useMeetingUpdateStore } from '@/stores/meeting_update'
import type { MeetingUpdateInfo } from '@/types/meeting/meeting_update';


const meetingUpdateStore = useMeetingUpdateStore()
const meetingListStore = useMeetingStore();

const meetingUpdateList = computed(() =>{
    const store = useMeetingUpdateStore();
    return store.getMeetingUpdateList;
  })

onMounted(() => {
  meetingListStore.fetchMeetingList();
});

const emit = defineEmits(['editMeetingUpdate', 'deleteMeetingUpdate'])

const meetingUpdateHeaders = ref([
    { title: 'MEETING ID', key: 'meeting_id' ,class:"no-wrap" },
    { title: 'DEPARTMENT / TEAM ', key: 'department_team' ,class:"no-wrap" },
    { title: 'UPDATES DETAILS', key: 'update_details',class:"no-wrap"  },
    { title: 'DATE & TIME', key: 'timestamp',class:"no-wrap"  },
    { title: 'ACTIONS', key: 'actions',class:"no-wrap" },

])

const meetingUpdateDialog = ref(false)
const updatingMeetingUpdate = ref(false)


const defaultMeetingUpdate: Ref<MeetingUpdateInfo> = ref({
    id: null,
    meeting_id: null,
    department_team: null,
    update_details: null,
    timestamp: null,
});

const editedMeetingUpdate = ref(defaultMeetingUpdate.value)

const editMeetingUpdate = (meeting_blocker: MeetingUpdateInfo) => {
    editedMeetingUpdate.value = Object.assign({}, meeting_blocker)
    updatingMeetingUpdate.value = true
    meetingUpdateDialog.value = true
}

const updateMeetingUpdateDialog = (value: boolean) => {
    meetingUpdateDialog.value = value
    editedMeetingUpdate.value = defaultMeetingUpdate.value as MeetingUpdateInfo
    updatingMeetingUpdate.value = false
}

const deleteMeetingUpdate = (id: number) => {
    meetingUpdateStore.deleteMeetingUpdate(id)
}

</script>
<template>
    <div>
        <div class="d-flex justify-space-between">
                <span class="text-primary text-h5">Meeting Update </span>
                <div>
                    <MeetingUpdateDialog :updating="updatingMeetingUpdate" @update:show="updateMeetingUpdateDialog" 
                    :show="meetingUpdateDialog" :item="editedMeetingUpdate" />
                </div>
        </div>
        
            <SharedUiCustomTable return-object show-select :headers="meetingUpdateHeaders" :items="meetingUpdateList">
                <template v-slot:item.actions="{ item }">
                    <div>
                    <v-icon color="primary" dense @click="editMeetingUpdate(item)">mdi-pencil</v-icon>
                    <v-icon color="red" dense @click="deleteMeetingUpdate(item.id)">mdi-delete</v-icon>
                    </div>
                </template>
            </SharedUiCustomTable>
    </div> 
</template>


<style scoped >
</style>