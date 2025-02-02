<template>
    <SharedUiServerTable :showFooterInHead="false" :headers="serviceTaskHeaders" :items="getMatchingSchedules"
        :loading="loadingDetail" @hoveredRow="hoveredRowSchedule = $event;">
        <template v-slot:item.intervals="{ item }">
            Every {{ item.time_interval }} {{ item.time_interval_duration }} or {{
                item.primary_meter_interval }} miles
        </template>
        <template v-slot:item.name="{ item }">
            {{ item.taskNames }}
        </template>
        <template v-slot:item.actions="{ item, index }">
            <SharedTableActionMenu :hoveredRow="hoveredRowSchedule" :index="index">
                <v-list-item @click="editSchedule(item)" append-icon="mdi-pencil">Edit</v-list-item>
                <v-list-item @click="deleteSchedule(item)" append-icon="mdi-delete">Delete</v-list-item>
            </SharedTableActionMenu>
        </template>
    </SharedUiServerTable>
</template>

<script lang="ts" setup>
import { ref} from 'vue';
import type { ServiceProgramSchedule } from '@/types/maintenance/ServiceProgram';

const props = defineProps({
    getMatchingSchedules: {
        type: Array as PropType<any>,
        required: true,
    },
    loadingDetail: {
        type: Boolean,
        default: false,
    },
    currentProgram:{
        type:Object as any,
        required:true
    },
});
const serviceProgramStore = useServiceProgramStore();
const layoutStore = useLayoutStore();
const hoveredRowSchedule = ref<number | null>(null)
const selectedTask = ref<Partial<ServiceProgramSchedule>>({});
const scheduledialog = ref(false);
const isEditing = ref(false);

const editSchedule = (item: any) => {
    selectedTask.value = { ...item, service_tasks: item.service_tasks.map((task: any) => task.id) };
    isEditing.value = true;
    scheduledialog.value = true;
};
const deleteSchedule = async (item: any) => {
    const { confirm } = await layoutStore.showConfirmDialog("Proceed to delete this service task ?");
    if (confirm) {
        await serviceProgramStore.deleteServiceProgramSchedule(item.program_id, item.id);
        serviceProgramStore.fetchProgramId(props.currentProgram.value as number);
    }
};

const serviceTaskHeaders = [
    { title: 'Intervals', key: 'intervals' },
    { title: 'Service Task', key: 'name' },
    { title: '', key: 'actions', sortable: false, minWidth: '50', align: 'end' },
];

</script>