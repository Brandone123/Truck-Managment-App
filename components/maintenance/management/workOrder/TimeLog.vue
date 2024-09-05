<template>
  <v-card>
    <div class="d-flex">
      <v-card-title class="font-weight-bold">Time Log</v-card-title>
      <v-btn @click="showAddDialog" color="primary" class="ml-auto ma-2 text-small">Add Progress</v-btn>
    </div>
    <v-card-text>
      <v-timeline class="custom-timeline overflow-y-scroll pa-0" density="compact" side="end" height="250">
        <v-timeline-item v-for="(log, index) in timeLogs" :key="index"
          :dot-color="log.status === 'Completed' ? 'green' : log.status === 'In Progress' ? 'orange' : 'grey'"
          size="large" fill-dot>
          <template v-slot:icon>
            <v-icon>{{ log.icon }}</v-icon>
          </template>
          <div class="d-flex justify-space-between align-center">
            <div>
              <span class="font-weight-bold mr-2">{{ getTechnicianName(log.user_id) }}</span><span class="text-caption">{{ log.message }}</span>
              <div class="text-primary mt-2">{{ getServiceTaskName(log.service_task_id) }}</div>
              <div v-if="log.status === 'Completed'" class="text-caption">Total Time: {{ log.total_time }} hr</div>
              <div v-else-if="log.start_time && log.end_time" class="text-caption">Duration: {{ getTemporaryTime(log.start_time, log.end_time) }}</div>
            </div>
            <div>
              <v-chip class="ml-auto" :color="getStatusColor(log.status)" text-color="white" small>
                {{ log.status }}
                <v-icon small class="ml-1" @click="editLog(index)">mdi-pencil</v-icon>
              </v-chip>
            </div>
           
          </div>
        </v-timeline-item>
      </v-timeline>
    </v-card-text>

    <v-dialog v-model="showDialog" persistent max-width="800px">
      <v-card class="grey-background">
        <v-toolbar color="primary" dark density="compact">
          <v-toolbar-title>{{ editMode ? 'Edit Progress' : 'Add Progress' }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="showDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form v-model="valid" ref="form">
            <v-row>
              <v-col cols="12" sm="6">
                <v-autocomplete variant="solo" flat density="compact" :items="technicians" item-title="full_name"
                  item-value="id" v-model="newLog.user_id" 
                  label="Search For Technician" required></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6">
                <v-autocomplete variant="solo" flat density="compact" :items="serviceTaskList"
                  item-title="name" item-value="id" v-model="newLog.service_task_id"
                  label="Search Service Task"></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field variant="solo" flat density="compact" v-model="newLog.start_time" label="Start Date" prepend-icon="mdi-calendar"
                type="datetime-local"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field variant="solo" flat density="compact" v-model="newLog.end_time" label="End Date" prepend-icon="mdi-calendar"
                type="datetime-local"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select variant="solo" flat density="compact" v-model="newLog.status" :items="['Pending', 'In Progress', 'Completed']" label="Status"
                required></v-select>
              </v-col>
              <v-col cols="12">
                <v-textarea variant="solo" flat density="compact" v-model="newLog.notes" 
                label="Note" :rows="3"></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" variant="text" @click="showDialog = false">Cancel</v-btn>
          <v-btn color="blue darken-1" variant="text" @click="saveLog">{{ editMode ? 'Update' : 'Add'}} </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import type { TimeLog } from '~/types/maintenance/workOrder';

const props = defineProps({
  timeLog: {
    type: Object as PropType<TimeLog>,
    required: true,
  },
});

const showDialog = ref(false);
const valid = ref(true);
const editMode = ref(false);
const editIndex = ref(-1);
const newLog = ref({
  user_id: null,
  service_task_id: null,
  start_time: '',
  end_time: '',
  notes: '',
  total_time: '',
  status: 'Pending',
});

const timeLogs = ref([
  {
    user_id: 1,
    notes: 'Pending Work',
    service_task_id: 1,
    start_time: '2023-01-01T08:00:00',
    end_time: null,
    status: 'Pending',
    icon: 'mdi-calendar',
    total_time: '',
  },
  {
    user_id: 1,
    notes: 'Issue Opened',
    service_task_id: 1,
    start_time: '2023-01-01T09:00:00',
    end_time: '2023-01-01T10:00:00',
    status: 'In Progress',
    icon: 'mdi-progress-clock',
    total_time: '',
  },
]);

const driverStore = useDriverStore();
const { driverList, loading: loadingDriverList } = storeToRefs(driverStore);

const techniciansStore = useTechniciansStore();
const {technicians} = storeToRefs(techniciansStore);

const serviceTaskStore = useServiceTaskStore();
const { serviceTaskList } = storeToRefs(serviceTaskStore);

const localTimeLog = ref<Partial<TimeLog>>(JSON.parse(JSON.stringify(props.timeLog || {})) as Partial<TimeLog>)

const layoutStore = useLayoutStore();

const showAddDialog = () => {
  showDialog.value = true
  newLog.value = {
    user_id: null,
    service_task_id: null,
    start_time: '',
    end_time: '',
    notes: '',
    total_time: '',
    status: 'Pending',
  }
}

onMounted(() => {
  // driverStore.fetchDriverList();
});

const saveLog = () => {
  if (valid.value) {
    const newLogEntry = {
      ...newLog.value,
      icon: newLog.value.status === 'Completed' ? 'mdi-check-circle-outline' : 'mdi-progress-clock',
    };

    // Calcul du total_time si la tâche est complétée
    if (newLogEntry.status === 'Completed' && newLogEntry.start_time && newLogEntry.end_time) {
      const startTime = new Date(newLogEntry.start_time).getTime();
      const endTime = new Date(newLogEntry.end_time).getTime();
      const totalTime = (endTime - startTime) / (1000 * 60 * 60); // Conversion en heures
      newLogEntry.total_time = totalTime.toFixed(2);
    }

    if (editMode.value) {
      timeLogs.value.splice(editIndex.value, 1, newLogEntry);
      editMode.value = false;
      editIndex.value = -1;
    } else {
      timeLogs.value.push(newLogEntry);

      if (props.timeLog && Array.isArray(props.timeLog)) {
        props.timeLog.push(newLogEntry);
      }

      props.timeLog = timeLogs.value.push(newLogEntry);

      console.log(props.timeLog)
    }

    resetForm();
    showDialog.value = false;
  }
};

const resetForm = () => {
  newLog.value = {
    user_id: null,
    service_task_id: null,
    start_time: '',
    end_time: '',
    notes: '',
    total_time: '',
    status: 'Pending',
  };
};

const getTechnicianName = (technicianId: any) => {
  const TechnicianName = technicians.value.find((tech) => tech.id === technicianId);
  return TechnicianName ? TechnicianName.full_name : '';
};

const getServiceTaskName = (serviceTaskId: number) => {
  return serviceTaskList.value.find(task => task.id == serviceTaskId)?.name;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'green';
    case 'In Progress':
      return 'orange';
    default:
      return 'grey';
  }
};

const getTemporaryTime = (startTime: string, endTime: string) => {
  if (endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diff = end.getTime() - start.getTime(); // Difference in milliseconds
    const hours = Math.floor(diff / (1000 * 60 * 60)); // Convert milliseconds to hours
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)); // Convert remaining milliseconds to minutes
    return `${hours} hr ${minutes} min`;
  } else {
    return '';
  }
};

const editLog = (index: number) => {
  const log = timeLogs.value[index];
  newLog.value = { ...log };
  editMode.value = true;
  editIndex.value = index;
  showDialog.value = true;
};
</script>

<style scoped>
.custom-timeline .v-timeline-item__icon {
  font-size: 1.5rem;
}

.overflow-y-scroll {
    overflow-y: auto;
}
</style>