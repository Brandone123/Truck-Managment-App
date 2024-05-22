<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia'
import { useMeetingBlockerStore } from '@/stores/meeting_blocker'
import type { MeetingBlockerInfo } from '@/types/meeting/meeting_blocker';


const meetingBlockerStore = useMeetingBlockerStore()

const meetingBlockerList = computed(() =>{
    const store = useMeetingBlockerStore();
    return store.getMeetingBlockerList;
  })

// onMounted(() => {
//     meetingBlockerStore.fetchMeetingBlockerList();
// });

const emit = defineEmits(['editMeetingBlocker', 'deleteMeetingBlocker'])

const meetingBlockerHeaders = ref([
    { title: 'MEETING BLOCKER ID', key: 'id' ,class:"no-wrap" },
    // { title: 'RESOLUTION ID ', key: 'resolution_id' ,class:"no-wrap" },
    { title: 'BLOCKER DETAILS', key: 'blocker_details',class:"no-wrap"  },
    { title: 'ASSIGNED TO', key: 'assigned_to',class:"no-wrap font-weight-bold"  },
    { title: 'RESOLUTION PLAN', key: 'resolution_plan',class:"no-wrap"  },
    { title: 'DATE & TIME', key: 'timestamp',class:"no-wrap"  },
    { title: 'ACTIONS', key: 'actions',class:"no-wrap" },

])

const meetingBlockerDialog = ref(false)
const updatingMeetingBlocker = ref(false)


const defaultMeetingBlocker: Ref<MeetingBlockerInfo> = ref({
    id: null,
    resolution_id: null,
    blocker_details: null,
    assigned_to: null,
    resolution_plan: null,
    timestamp: null,
});

const editedMeetingBlocker = ref(defaultMeetingBlocker.value)

const editMeetingBlocker = (meeting_blocker: MeetingBlockerInfo) => {
    editedMeetingBlocker.value = Object.assign({}, meeting_blocker)
    updatingMeetingBlocker.value = true
    meetingBlockerDialog.value = true
}

const updateMeetingBlockerDialog = (value: boolean) => {
    meetingBlockerDialog.value = value
    editedMeetingBlocker.value = defaultMeetingBlocker.value as MeetingBlockerInfo
    updatingMeetingBlocker.value = false
}

const deleteMeetingBlocker = (id: number) => {
    meetingBlockerStore.deleteMeetingBlocker(id)
}

</script>
<template>
    <div>
        <div class="d-flex justify-space-between">
                <span class="text-primary text-h5">Meeting Blocker </span>
                <div>
                    <MeetingBlockerDialog :updating="updatingMeetingBlocker" @update:show="updateMeetingBlockerDialog" 
                    :show="meetingBlockerDialog" :item="editedMeetingBlocker" />
                </div>
        </div>
        
            <SharedUiCustomTable return-object show-select :headers="meetingBlockerHeaders" :items="meetingBlockerList">
                <template v-slot:item.actions="{ item }">
                    <div>
                    <v-icon color="primary" dense @click="editMeetingBlocker(item)">mdi-pencil</v-icon>
                    <v-icon color="red" dense @click="deleteMeetingBlocker(item.id)">mdi-delete</v-icon>
                    </div>
                </template>
            </SharedUiCustomTable>
    </div> 
</template>


<style scoped >
</style>