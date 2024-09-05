<template>
    <div>
      <div class="d-flex justify-space-between mb-16">
        <span class="text-primary text-h5">Equipment Management</span>
        <v-btn color="primary" @click="openAddEquipmentDialog">Add Equipment</v-btn>
      </div>
  
      <v-row>
        <v-col cols="12">
          <EquipmentTable :equipmentList="equipmentList" @view="viewEquipment" @edit="editEquipment" @delete="deleteEquipment" />
        </v-col>
      </v-row>
  
      <EquipmentDetailsDialog :modelValue="detailsDialog" :equipment="selectedEquipment" @update:modelValue="detailsDialog = $event" />
      <EquipmentEditDialog :modelValue="editDialog" :equipment="selectedEquipment" @update:modelValue="editDialog = $event" @save="saveEquipment" />
      <DeleteEquipmentDialog :modelValue="deleteDialog" @confirm="confirmDeleteEquipment" />
  
      <v-row>
        <v-col cols="12" md="6">
          <v-card class="mb-4">
            <v-card-title>Equipment Status Overview</v-card-title>
            <v-card-text>
              <apexchart type="pie" height="350" :options="equipmentStatusOptions" :series="equipmentStatusSeries" />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card class="mb-4">
            <v-card-title>Equipment Type Distribution</v-card-title>
            <v-card-text>
              <apexchart type="pie" height="350" :options="equipmentTypeOptions" :series="equipmentTypeSeries" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import EquipmentTable from '@/components/maintenance/equipment/management/EquipmentTable.vue';
  import EquipmentDetailsDialog from '@/components/maintenance/equipment/management/EquipmentDetailsDialog.vue';
  import EquipmentEditDialog from '@/components/maintenance/equipment/management/EquipmentEditDialog.vue';
  import DeleteEquipmentDialog from '@/components/maintenance/equipment/management/DeleteEquipmentDialog.vue';
  import { useEquipmentStore } from '@/stores/maintenance/EquipmentStore';
  import 'apexcharts/dist/apexcharts.css';
  
  const equipmentStore = useEquipmentStore();
  
  const { equipmentList, loading, equipmentStatusChart, equipmentTypeChart } = storeToRefs(equipmentStore);
  
  const search = ref('');
  const detailsDialog = ref(false);
  const editDialog = ref(false);
  const deleteDialog = ref(false);
  const selectedEquipment = ref(null);
  
  const openAddEquipmentDialog = () => {
    selectedEquipment.value = null;
    editDialog.value = true;
  };
  
  const viewEquipment = (equipment) => {
    selectedEquipment.value = equipment;
    detailsDialog.value = true;
  };
  
  const editEquipment = (equipment) => {
    selectedEquipment.value = equipment;
    editDialog.value = true;
  };
  
  const deleteEquipment = (equipment) => {
    selectedEquipment.value = equipment;
    deleteDialog.value = true;
  };
  
  const saveEquipment = (equipment) => {
    if (equipment.id) {
      equipmentStore.updateEquipment(equipment);
    } else {
      equipmentStore.createEquipment(equipment);
    }
    editDialog.value = false;
  };
  
  const confirmDeleteEquipment = () => {
    if (selectedEquipment.value) {
      equipmentStore.deleteEquipment(selectedEquipment.value.id);
    }
    deleteDialog.value = false;
  };
  
  const equipmentStatusOptions = computed(() => ({
    chart: {
      type: 'pie',
    },
    labels: equipmentStatusChart.value.labels,
  }));
  
  const equipmentStatusSeries = computed(() => equipmentStatusChart.value.series);
  
  const equipmentTypeOptions = computed(() => ({
    chart: {
      type: 'pie',
    },
    xaxis: {
      categories: equipmentTypeChart.value.labels,
    },
  }));
  
  const equipmentTypeSeries = computed(() => equipmentTypeChart.value.series);
  
  onMounted(() => {
    equipmentStore.fetchEquipment();
    equipmentStore.fetchEquipmentCharts();
  });
  </script>
  