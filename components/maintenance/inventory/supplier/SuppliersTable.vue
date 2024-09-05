<template>
  <div>
    <div style="position:sticky;top:104px;z-index:1;" class="pt-1 grey-background position-sticky">
      <v-tabs v-model="activeFilter" color="primary" density="compact">
        <v-tab value="all" class="text-none">All</v-tab>
        <v-tab value="charging" class="text-none">
           Charging
          <v-chip density="compact" class="ml-1">{{ chargingCount }}</v-chip>
        </v-tab>
        <v-tab value="fuel" class="text-none">
           Fuel
          <v-chip density="compact" class="ml-1">{{ fuelCount }}</v-chip>
        </v-tab>
        <v-tab value="parts" class="text-none">
          Parts
          <v-chip density="compact" class="ml-1">{{ partsCount }}</v-chip>
        </v-tab>
        <v-tab value="service" class="text-none">
          Service
          <v-chip density="compact" class="ml-1">{{ serviceCount }}</v-chip>
        </v-tab>
        <v-tab value="vehicle" class="text-none">
          Vehicle
          <v-chip density="compact" class="ml-1">{{ vehicleCount }}</v-chip>
        </v-tab>
      </v-tabs>
    </div>

    <SharedUiCustomTable show-select :show-footer-in-head="false" :headers="headers" :items="filteredSuppliers" :loading="loading">
      <template v-slot:item.actions="{ item }">
        <v-icon class="ml-2" color="primary" dense @click="$emit('view', item)">mdi-eye</v-icon>
        <v-icon class="ml-2" color="primary" dense @click="$emit('edit', item)">mdi-pencil</v-icon>
        <v-icon class="ml-2" color="red" dense @click="$emit('delete', item)">mdi-delete</v-icon>
      </template>
      <template v-slot:item.website="{ item }">
        <span class="text-secondary" style="cursor:pointer" v-if="item.website">
          {{ item.website.length > 40 ? item.website.slice(0, 40) + '...' : item.website }}
        </span>
        <span v-else>Not Provided</span>
      </template>
      <template v-slot:item.address="{ item }">
        {{ item.address ? item.address : "N/A"  }}
      </template>
      <template v-slot:item.phone="{ item }">
        {{ item.phone ? item.phone : "N/A"  }}
      </template>
      <template v-slot:item.contact_information="{ item }">
        <div v-if="item.contact_information?.name">
          <span>{{ item.contact_information?.name }}</span>
          <div class="text-secondary"> {{ item.contact_information?.email }}</div>
        </div>
        <span v-else>N/A</span>
      </template>
      <template v-slot:item.watchers="{ item }">
        <div class="d-flex align-center">
          <div class="mr-2" style="cursor: pointer; border-bottom: 1px dotted;">
            {{ item.watchers ? (item.watchers.length === 1 ? '1 watcher' : item.watchers.length + ' watchers') : '' }}
          </div>
          <v-tooltip bottom>
            <!-- <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on" class="watchers-tooltip-trigger">
              </span>
            </template> -->
            <v-card>
              <v-card-title>Watchers</v-card-title>
              <v-card-text>
                <ul>
                  <li>{{ item.watchers ? item.watchers.length : 'No' }}</li>
                </ul>
              </v-card-text>
            </v-card>
          </v-tooltip>
        </div>
      </template>
    </SharedUiCustomTable>
  </div>
   
  </template>
  
  <script lang="ts" setup>
  import { defineProps, defineEmits } from 'vue';
  import { useSuppliersStore } from '@/stores/maintenance/suppliersStore';
  import type { Supplier } from '@/types/maintenance/supplierTypes';
  
  const emit = defineEmits(['view', 'edit', 'delete']);
  
  const suppliersStore = useSuppliersStore();
  const suppliers = computed(() => suppliersStore.suppliers);
  const loading = computed(() => suppliersStore.loading);
  
  const headers = [
    // { title: 'ID', key: 'id' },
    { title: 'Name', key: 'name' },
    { title: 'Address', key: 'address' },
    { title: 'Phone', key: 'phone' },
    { title: 'Website', key: 'website' },
    // { title: 'Location', key: 'location' },
    { title: 'Contact', key: 'contact_information' },
    { title: 'Watchers', key: 'watchers' },
    { title: 'Actions', key: 'actions', sortable: false },
  ];

  const activeFilter = ref<string>('all');

const filteredSuppliers = computed(() => {
  if (activeFilter.value === 'all') {
    return suppliers.value;
  }
  return suppliers.value.filter((item) => item.classification[activeFilter.value] === true);
});

const chargingCount = computed(() => suppliers.value.filter((item) => item.classification.charging).length);
const fuelCount = computed(() => suppliers.value.filter((item) => item.classification.fuel).length);
const partsCount = computed(() => suppliers.value.filter((item) => item.classification.parts).length);
const serviceCount = computed(() => suppliers.value.filter((item) => item.classification.service).length);
const vehicleCount = computed(() => suppliers.value.filter((item) => item.classification.vehicle).length);
  
</script>
  