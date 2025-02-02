<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCarrierStore } from '@/stores/settings/dispatch/carrier';
import { storeToRefs } from 'pinia';
import type { filterItem } from '@/types/layout/table'

const carrierListStore = useCarrierStore();
const { carrierList, loading: carrierLoading } = storeToRefs(carrierListStore);

const layoutStore = useLayoutStore()

onMounted(() => {
  carrierListStore.fetchCarrierList();
});

const updatingCarrier = ref(false);
const carrierDialog = ref(false);

const carrierHeaders = ref([
  { title: 'CARRIER ID', key: 'id', class: "no-wrap" },
  { title: 'NAME', key: 'name', class: "no-wrap" },
  { title: 'TYPE', key: 'carrier_type', class: "no-wrap" },
  { title: 'ADDRESS LINE 1', key: 'address_line_1', class: "no-wrap" },
  { title: 'CITY', key: 'city', class: "no-wrap" },
  { title: 'STATUS', key: 'status', class: "no-wrap" },
  { title: 'STATE', key: 'state', class: "no-wrap" },
  { title: 'ZIP CODE', key: 'zip_code', class: "no-wrap" },
  { title: 'PHONE', key: 'phone', class: "no-wrap" },
  { title: 'EMAIL', key: 'email', class: "no-wrap" },
  { title: 'ACTIONS', key: 'actions', class: "no-wrap" },
]);

const defaultCarrier = ref({
  id: null,
  name: null,
  carrier_type: '',
  address_line_1: '',
  address_line_2: '',
  city: '',
  state: '',
  zip_code: '',
  mc_number: '',
  dot_number: '',
  phone: '',
  fax: '',
  email: '',
  status: '',
  notes: '',
});

const editedCarrier = ref(defaultCarrier.value);

const editCarrier = (carrier: any) => {
  editedCarrier.value = { ...carrier };
  updatingCarrier.value = true;
  carrierDialog.value = true;
};

const updateCarriersDialog = (value: any) => {
  carrierDialog.value = value;
  editedCarrier.value = defaultCarrier.value;
  updatingCarrier.value = false;
};

const carrierDetailsDialog = ref(false);
const selectedCarrier = ref(null);

const viewCarrierDetails = (carrier: any) => {
  selectedCarrier.value = carrier;
  carrierDetailsDialog.value = true;
};

const deleteCarrier = async (carrier_Id: any) => {
  const { confirm } = await layoutStore.showConfirmDialog("Are you sure you want to delete");

  if (confirm) {
    carrierListStore.deleteCarrier(carrier_Id);
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'primary'
    case 'Inactive':
      return 'secondary';
    default:
      return 'grey';
  }
}

// filter selection values for the displayed table
const filters = ref<filterItem[]>([
    {
        title: 'Select Status',
        key: 'status',
        items: [
            'Active',
            'Inactive'
        ],
        width: '300px'
    },
])
</script>

<template>
  <div>
    <div class="d-flex justify-space-between">
      <div></div>
      <SettingsDispatchCarrierDialog :show="carrierDialog"
          @update:show="updateCarriersDialog" :updating="updatingCarrier" :item="editedCarrier" />
      <SettingsDispatchCarrierDetailsDialog :model-value="carrierDetailsDialog" :carrier="selectedCarrier" @update:model-value="carrierDetailsDialog = $event" />
    </div>
    <div>
      <SharedUiCustomTable :filters="filters" :show-footer-in-head="false" ref="carrierTable" :loading="carrierLoading" show-select return-object :headers="carrierHeaders" :items="carrierList">
        <template v-slot:item.actions="{ item }">
          <div>
            <v-icon color="primary" dense @click="editCarrier(item)">mdi-pencil</v-icon>
            <v-icon color="secondary" dense @click="viewCarrierDetails(item)">mdi-eye</v-icon>
            <v-icon color="red" dense @click="deleteCarrier(item.id)">mdi-delete</v-icon>
          </div>
        </template>
        <template v-slot:item.status="{ item }">
          <v-chip variant="flat" density="compact" :color="getStatusColor(item.status)">{{item.status}}</v-chip>
        </template>
      </SharedUiCustomTable>
    </div>
  </div>
</template>