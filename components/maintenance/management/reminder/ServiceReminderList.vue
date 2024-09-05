<template>
    <ServiceReminderDetailsDialog :modelValue="detailsDialog" :serviceReminder="selectedReminder" @update:modelValue="detailsDialog = $event" @close="closeDetailsDialog"/>
  
    <div>
      <div style="position:sticky;top:104px;z-index:1;" class="pt-1 grey-background position-sticky">
      <v-tabs v-model="activeFilter" color="primary" density="compact">
        <v-tab value="all" class="text-none">All</v-tab>
        <v-tab value="Overdue" class="text-none">
          <span class="mr-1 bg-orange" style="width: 8px; height: 8px; border-radius: 50%;"></span>Overdue
          <v-chip class="ml-1 bg-orange" density="comfortable">{{ overdueCount }}</v-chip></v-tab>
        <v-tab value="Completed" class="text-none">
          <span class="mr-1 bg-primary" style="width: 8px; height: 8px; border-radius: 50%;"></span>Completed
          <v-chip class="ml-1 bg-primary" density="comfortable">{{ completedCount }}</v-chip></v-tab>
        <v-tab value="Upcoming" class="text-none">
          <span class="mr-1 bg-pink" style="width: 8px; height: 8px; border-radius: 50%;"></span>Upcoming
          <v-chip class="ml-1 bg-pink" density="comfortable">{{ upcomingCount }}</v-chip></v-tab>
        <v-tab value="Due Soon" class="text-none">
          <span class="mr-1 bg-brown" style="width: 8px; height: 8px; border-radius: 50%;"></span>Due Soon
          <v-chip class="ml-1 bg-brown" density="comfortable">{{ dueSoonCount }}</v-chip></v-tab>
      </v-tabs>
    </div>

    <SharedUiCustomTable items-per-page="50" :sticky-top="true" :sticky-top-offset="95" :showFooterInHead="false" show-select v-model="selectedItems" :headers="tableHeaders" :items="filteredServiceReminder" :loading="loading">
      <template v-slot:item.actions="{ item }">
        <v-icon class="ml-2" color="primary" dense @click="$emit('view', item)">mdi-eye</v-icon>
        <v-icon class="ml-2" color="primary" dense @click="$emit('edit', item)">mdi-pencil</v-icon>
        <v-icon class="ml-2" color="red" dense @click="$emit('delete', item.id)">mdi-delete</v-icon>
      </template>
      <template v-slot:item.status="{ item }">
        <v-chip v-if="item.status" density="compact" variant="flat" :color="getStatusClass(item.status)" size="small">
          {{ item.status }}
        </v-chip>
        <span v-else>N/A</span>
      </template>
      <template v-slot:item.due_date="{ item }">
        <span v-if="item.due_date" style="cursor: pointer; border-bottom: 1px dotted;">
          {{ new Date(item.due_date).toLocaleDateString('en-US') }}
          <v-tooltip activator="parent" location="top">
            {{ getRelativeDateTime(item.due_date) }}
          </v-tooltip>
        </span>
        <span v-else>N/A</span>
      </template>
      <template v-slot:item.last_completed="{ item }">
        <span>
          {{ item.last_completed ? item.last_completed : 'N/A' }}
        </span>
      </template>
      <template v-slot:item.watchers="{ item }">
      <div v-if="item.watchers !== null">
        <span v-if="watchersList(item.watchers).length <= 2" style="cursor: pointer; font-size:small">
          {{ watchersList(item.watchers).join(' , ') }}
        </span>
        <span v-else style="cursor: pointer; font-size:small">
          {{ watchersList(item.watchers).slice(0, 2).join(' ; ') }} <strong class="text-primary"> + {{ watchersList(item.watchers).length - 2 }} more</strong>
        </span>
      </div>
      <div v-else>
        N/A
      </div>
    </template>
    <template v-slot:item.service_task="{ item }">
        <div v-if="item.service_task !== null">
          <span v-if="serviceTasksList(item.service_task).length <= 2" style="cursor: pointer; font-size: small">
            {{ serviceTasksList(item.service_task).join(' , ') }}
          </span>
          <span v-else style="cursor: pointer; font-size: small">
            {{ serviceTasksList(item.service_task).slice(0, 2).join(' , ') }} <strong class="text-primary"> + {{ serviceTasksList(item.service_task).length - 2 }} more</strong>
          </span>
        </div>
        <div v-else>
          N/A
        </div>
      </template>
      <template v-slot:bulkActions="{ selectedItems }">
        <v-btn color="primary" class="text-none mr-2" @click="print()">
          <v-icon>mdi-printer</v-icon> Print
        </v-btn>
        <v-btn color="primary" class="text-none mr-2">
          <v-icon>mdi-send</v-icon> Send
        </v-btn>
      </template>
      <template v-slot:item.vehicle_id="{ item }">
        <v-menu v-if="item.vehicle_id" location="bottom" max-height="400px" width="350px" location-strategy="connected" class="rounded" open-on-hover>
          <template v-slot:activator="{ props }">
            <div class="d-flex">
              <div>
                <div class="rounded position-relative"
                  style="display: flex; justify-content: center; align-items: center; width: 28px; height: 28px; background-color: grey; color: white; text-align: center; position: relative;">
                  <span style="font-size:xx-small;" v-if="getVehicleName(item.vehicle_id)?.type">{{
                    getVehicleName(item.vehicle_id)?.type.slice(0, 3).toUpperCase() }}</span>
                  <span v-else style="font-size:xx-small;">VHI</span>
                  <div v-if="getVehicleName(item.vehicle_id)?.status"
                    :class="`${'bg-' + getVehicleStatusColor(getVehicleName(item.vehicle_id)?.status)}`"
                    style="width: 10px; height: 10px; position: absolute; bottom: -2px; right: -2px; border-radius: 50%;">
                  </div>
                </div>
              </div>
              <div>
                <span class="text-secondary ml-2" v-bind="props"
                  style="cursor: pointer; border-bottom: 1px dotted; justify-content: center; align-items: center;text-align: center;">
                  {{ getVehicleName(item.vehicle_id)?.name }}
                </span>
              </div>
            </div>
          </template>
          <v-row no-gutters>
            <v-col cols="12">
              <v-card class="rounded-lg">
                <v-card-text>
                  <div class="mb-3">
                    <div class="d-flex mb-2" style="align-items: center;">
                      <div>
                        <div class="rounded position-relative"
                          style="display: flex; justify-content: center; align-items: center; width: 45px; height: 45px; background-color: grey; color: white; text-align: center; position: relative;">
                          <span style="font-size: large;">{{ getVehicleName(item.vehicle_id)?.type.slice(0, 3) }}</span>
                        </div>
                      </div>
                      <div class="ml-1">
                        <span class="text-secondary" v-bind="props">
                          {{ getVehicleName(item.vehicle_id)?.name }}
                        </span>
                      </div>
                    </div>
                    <v-row>
                      <v-col cols="12" md="6">Status</v-col>
                      <v-col cols="12" md="6" v-if="getVehicleName(item.vehicle_id)?.status">
                        <v-chip density="compact" class="text-capitalize"
                          :color="getVehicleStatusColor(getVehicleName(item.vehicle_id)?.status)">
                          {{ getVehicleName(item.vehicle_id)?.status }}
                        </v-chip>
                      </v-col>
                    </v-row>
                    <v-divider class="my-2"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Operator</v-col>
                      <v-col cols="12" md="6">{{ getVehicleName(item.vehicle_id)?.odometer }}</v-col>
                    </v-row>
                    <v-divider class="my-2"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Type</v-col>
                      <v-col cols="12" md="6">{{ getVehicleName(item.vehicle_id)?.type }}</v-col>
                    </v-row>
                    <v-divider class="my-2"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Year Make Model</v-col>
                      <v-col cols="12" md="6">
                        {{ getVehicleName(item.vehicle_id)?.year }}
                        {{ getVehicleName(item.vehicle_id)?.make }}
                        {{ getVehicleName(item.vehicle_id)?.model }}
                      </v-col>
                    </v-row>
                    <v-divider class="my-2"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Group</v-col>
                      <v-col cols="12" md="6" v-if="getVehicleName(item.vehicle_id)?.dimensions">{{
                        getVehicleName(item.vehicle_id)?.dimensions.ground_clearance }}</v-col>
                    </v-row>
                    <v-divider class="my-2"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">VIN/SN</v-col>
                      <v-col cols="12" md="6">{{ getVehicleName(item.vehicle_id)?.vin }}</v-col>
                    </v-row>
                    <v-divider class="my-2"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Current Meter</v-col>
                      <v-col cols="12" md="6">{{ }}</v-col>
                    </v-row>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-menu>
      </template>
    </SharedUiCustomTable>
    </div>
    
  </template>
  
  <script lang="ts" setup>
  import { defineProps, defineEmits, ref, computed } from 'vue';
  import { useServiceReminderStore } from '@/stores/maintenance/serviceReminders';
  import ServiceReminderDetailsDialog from './ServiceReminderDetailsDialog.vue';
  import type { ServiceReminder } from '@/types/maintenance/serviceReminders';
 
  const props = defineProps({
    loading: {
      type: Boolean,
      default: false,
    },
  });

  const serviceTaskStore = useServiceTaskStore();
  const { serviceTaskList } = storeToRefs(serviceTaskStore);

  const serviceReminderStore = useServiceReminderStore();
  const { serviceReminderList } = storeToRefs(serviceReminderStore);
  
  const getServiceName = (serviceId: any) => {
    const serviceName = serviceTaskList.value.find((service) => service.id === serviceId)
    return serviceName ? serviceName.name : '';
  }
  
  const emit = defineEmits(['view', 'edit', 'delete']);
  
  const tableHeaders = [
    { title: 'Vehicle', key: 'vehicle_id' },
    { title: 'Service Task', key: 'service_task' },
    { title: 'Due Date', key: 'due_date' },
    { title: 'Status', key: 'status' },
    { title: 'Last Completed', key: 'last_completed'},
    { title: 'Watchers', key: 'watchers' },
    { title: 'Actions', key: 'actions' },
  ];
  
  const getStatusClass = (item: any) => {
    if (item === 'Due Soon') {
      return 'brown';
    } else if (item === 'Overdue') {
      return 'orange';
    } else if (item === 'Completed') {
      return 'primary';
    } else if (item === 'Upcoming') {
      return 'pink';
    }
    return 'gray';
  }
  
  const selectedItems = ref([])
  
  const print = () => {
    if (selectedItems.value) {
      console.log('Print service reminders for:', selectedItems.value);
    }
  }

  const watchersList = (watchersString: string) => {
    return watchersString ? watchersString.split(',').map((watcher) => watcher.trim()) : [];
  };

  const serviceTasksList = (tasksString: string) => {
    return tasksString ? tasksString.split('|').map((task) => task.trim()) : [];
  };
    
  const detailsDialog = ref(false);
  const selectedReminder =  ref<Partial<ServiceReminder>>({} as Partial<ServiceReminder>);
  
  const closeDetailsDialog = () => {
    detailsDialog.value = false;
  };

  const assetStore = useAssetStore();
  const { assetList } = storeToRefs(assetStore);

  const getVehicleName = (vehicleId: number) => {
    const vehicleName = assetList.value.find((vehicle) => vehicle.id === vehicleId)
    return vehicleName
  }

  const getRelativeDateTime = (dateString: string) => {
    const now = new Date();
    const createdAt = new Date(dateString.replace(/\//g, '-'));
    const diff = now.getTime() - createdAt.getTime();

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}, ${months % 12} month${months % 12 > 1 ? 's' : ''} remaining`;
    } else if (months > 0) {
      return `${months} month${months > 1 ? 's' : ''} remaining`;
    } else {
      return `${days} day${days > 1 ? 's' : ''} remaining`;
    }
  };

const getVehicleStatusColor = (status: any) => {
  switch ((status || '').toLocaleLowerCase()) {
    case 'active':
      return 'primary';
    case 'Out of Service':
      return 'error';
    case 'inactive':
      return 'secondary';
    case 'In Shop':
      return 'brown';
    default:
      return 'grey';
  }
}


const activeFilter = ref<string>('all')

const filteredServiceReminder = computed(() => {
  if (activeFilter.value == 'all') {
    return serviceReminderList.value
  }
  return serviceReminderList.value.filter(item => item.status == activeFilter.value)
})

const upcomingCount = computed(() => {
  return serviceReminderList.value.filter(item => item.status == 'Upcoming')?.length || 0
})

const overdueCount = computed(() => {
  return serviceReminderList.value.filter(item => item.status == 'Overdue')?.length || 0
})

const completedCount = computed(() => {
  return serviceReminderList.value.filter(item => item.status == 'Completed')?.length || 0
})

const dueSoonCount = computed(() => {
  return serviceReminderList.value.filter(item => item.status == 'Due Soon')?.length || 0
})
  </script>
  
  <style scoped>
  </style>
  