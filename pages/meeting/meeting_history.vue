<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia'
import { useMeetingStore } from '@/stores/meeting'
import type { MeetingInfo } from '@/types/meeting/meeting';
import jsPDF from 'jspdf';
import 'jspdf-autotable'


const meetingStore = useMeetingStore()
const { meetingList, loading } = storeToRefs(meetingStore)

const meetingUpdateStore = useMeetingUpdateStore()
const { meetingUpdateList } = storeToRefs(meetingUpdateStore)

const meetingResolutionStore = useMeetingResolutionStore()
const { meetingResolutionList } = storeToRefs(meetingResolutionStore)

const meetingActionStore = useMeetingActionStore()
const { meetingActionList } = storeToRefs(meetingActionStore)

const meetingBlockerStore = useMeetingBlockerStore()
const { meetingBlockerList } = storeToRefs(meetingBlockerStore)

onMounted(() => {
    meetingStore.fetchMeetingList();
});

const meetingHeaders = ref([
    { title: 'MEETING ID', key: 'id' ,class:"no-wrap" },
    { title: 'TITLE ', key: 'title' ,class:"no-wrap" },
    { title: 'DATE AND TIME', key: 'date_and_time',class:"no-wrap" },
    { title: 'ORGANIZER', key: 'organizer',class:"no-wrap"  },
    { title: 'MEETING UPDATE', key: 'update_details',class:"no-wrap"  },
    { title: 'ACTIONS DETAILS', key: 'action_details',class:"no-wrap"  },
    { title: 'ACTIONS STATUS', key: 'action_status',class:"no-wrap"  },
    { title: 'BLOCKER DETAILS', key: 'blocker_details',class:"no-wrap"  },
    { title: 'BLOCKER RESOLUTION', key: 'resolution_plan',class:"no-wrap"  },
    { title: 'ACTIONS', key: 'actions',class:"no-wrap" },

])

const meetingDialog = ref(false)
const updatingMeeting = ref(false)


const defaultMeeting: Ref<MeetingInfo> = ref({
    id: null,
    title: null,
    date_and_time: null,
    duration: null,
    organizer: null,
    agenda: null,
});

const editedMeeting = ref(defaultMeeting.value)

const viewMeeting = (meeting: MeetingInfo) => {
    editedMeeting.value = Object.assign({}, meeting)
    meetingDialog.value = true
}

const updateMeetingDialog = (value: boolean) => {
    meetingDialog.value = value
    editedMeeting.value = defaultMeeting.value as MeetingInfo
    updatingMeeting.value = false
}

const deleteMeeting = (id: number) => {
    meetingStore.deleteMeeting(id)
}

function getMeetingUpdate(meetingId:any) {
    const updateMeeting = meetingUpdateList.value.find((action) =>  action.meeting_id === meetingId )
    return updateMeeting ? updateMeeting.update_details : '';
}

function getMeetingActionDetail(meetingId:any) {
    const resolution = meetingResolutionList.value.find((resolution) => resolution.meeting_id === meetingId)
    const action = meetingActionList.value.find((action) => action.resolution_id === resolution?.id)
    return action ? action.action_details : '';
}

function getMeetingActionStatus(meetingId:any) {
    const resolution = meetingResolutionList.value.find((resolution) => resolution.meeting_id === meetingId)
    const action = meetingActionList.value.find((action) => action.resolution_id === resolution?.id)
    return action ? action.status : '';
}

function getMeetingBlockerDetail(meetingId:any) {
    const resolution = meetingResolutionList.value.find((resolution) => resolution.meeting_id === meetingId)
    const blocker = meetingBlockerList.value.find((blocker) => blocker.resolution_id === resolution?.id)
    return blocker ? blocker.blocker_details : '';
}

function getMeetingResolutionPlan(meetingId:any) {
    const resolution = meetingResolutionList.value.find((resolution) => resolution.meeting_id === meetingId)
    const blocker = meetingBlockerList.value.find((blocker) => blocker.resolution_id === resolution?.id)
    return blocker ? blocker.resolution_plan : '';
}

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

  const pdfDataUri = ref('')

  const downloadPDF = () => {
    const link = document.createElement('a');
    link.href = pdfDataUri.value;
    link.download = 'meeting_report.pdf';
    link.target = '_blank';
    link.click();
};

const generateReport = () => {
  try {
    let data = filteredMeetings.value;

    let tableData = data.map((item) => {
      return [
        item.id,
        item.title,
        item.date_and_time,
        item.organizer,
        getMeetingUpdate(item.id),
        getMeetingActionDetail(item.id),
        getMeetingActionStatus(item.id),
        getMeetingBlockerDetail(item.id),
        getMeetingResolutionPlan(item.id),
      ];
    });

    const tableHeaders = [
      'Meeting Id',
      'Title',
      'Date & Time',
      'Organizer',
      'Meeting Update',
      'Action Detail',
      'Action Status',
      'Blocker Detail',
      'Resolution Plan',
    ];

    const doc = new jsPDF('landscape'); // Creates a new PDF document in landscape mode

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    let currentY = 10;
    doc.text('Moonstar Express', doc.internal.pageSize.getWidth() / 2, currentY, { align: 'center' });

    currentY += 10;
    doc.setFontSize(15);
    doc.text('Meeting Request Report', doc.internal.pageSize.getWidth() / 2, currentY, { align: 'center' });

    currentY += 15;
    doc.setFontSize(12);

    (doc as any).autoTable({
      startY: currentY,
      head: [tableHeaders],
      body: tableData,
    });

    pdfDataUri.value = doc.output('datauristring');

    downloadPDF();
  } catch (error) {
    console.error(error);
  }
};

const filteredMeetings = computed(() => {
    const currentDate = new Date();
    return meetingList.value
      .slice()
      .sort((a, b) => {
        const [dateA, timeA] = (a.date_and_time || '').split(' ');
        const [dateB, timeB] = (b.date_and_time || '').split(' ');

        const dateTimeA = new Date(`${dateA}T${timeA}`);
        const dateTimeB = new Date(`${dateB}T${timeB}`);

        return dateTimeA.getTime() - dateTimeB.getTime();
      })
      .filter((meeting) => {
        const [date, time] = (meeting.date_and_time || '').split(' ');
        const dateTime = new Date(`${date}T${time}`);
        return dateTime < currentDate;
      })
  });

</script>
<template>
    <div>
        <div class="d-flex justify-space-between">
                <span class="text-primary text-h5">Meeting History </span>
                <div>
                    <v-col class="px-0">
                        <v-btn color="primary" density="compact" @click="generateReport">Download Meeting
                            Report</v-btn>
                    </v-col>
                </div>
        </div>
        
            <SharedUiCustomTable return-object show-select :headers="meetingHeaders" :items="filteredMeetings" :loading="loading">
                <template v-slot:item.actions="{ item }">
                    <div>
                    <v-icon color="primary" dense @click="viewMeeting(item)">mdi-eye</v-icon>
                    <v-icon color="red" dense @click="deleteMeeting(item.id)">mdi-delete</v-icon>
                    </div>
                </template>
                <template v-slot:item.update_details="{ item }" v-if="getMeetingUpdate.length > 0">
                    <span>
                        {{ getMeetingUpdate(item.id) }}
                    </span>
                </template>
                <template v-slot:item.action_details="{ item }" v-if="getMeetingActionDetail.length > 0">
                    <span style="color:darkslateblue;">
                        {{ getMeetingActionDetail(item.id) }}
                    </span>
                </template>
                <template v-slot:item.action_status="{ item }" v-if="getMeetingActionStatus.length > 0">
                    <v-chip v-if="getMeetingActionStatus(item.id)" :class="getStatusColor(getMeetingActionStatus(item.id))">
                        {{ getMeetingActionStatus(item.id) }}
                    </v-chip>
                </template>
                <template v-slot:item.blocker_details="{ item }" v-if="getMeetingBlockerDetail.length > 0">
                    <span>
                        {{ getMeetingBlockerDetail(item.id) }}
                    </span>
                </template>
                <template v-slot:item.resolution_plan="{ item }" v-if="getMeetingResolutionPlan.length > 0">
                    <span style="color:steelblue;">
                        {{ getMeetingResolutionPlan(item.id) }}
                    </span>
                </template>
            </SharedUiCustomTable>
    </div> 
</template>


<style scoped >
</style>