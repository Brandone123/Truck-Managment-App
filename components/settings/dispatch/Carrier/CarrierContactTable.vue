<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useCarrierStore } from '@/stores/settings/dispatch/carrier';
import type { CarrierContacts } from '~/types/dispatch/carrier';
import { storeToRefs } from 'pinia';
import type { filterItem } from '@/types/layout/table';

const carrierListStore = useCarrierStore();
const { contactList, carrierList, loading: contactLoading } = storeToRefs(carrierListStore);

const layoutStore = useLayoutStore();

onMounted(() => {
  carrierListStore.fetchContactList();
});

const updatingContact = ref(false);
const contactDialog = ref(false);
const contactEditDialog = ref(false);
const selectedContact = ref(null);

const contactHeaders = ref([
  { title: 'ID', key: 'id', class: 'no-wrap' },
  { title: 'Carrier ID', key: 'carrier_id', class: 'no-wrap' },
  { title: 'Contact Name', key: 'contact_name', class: 'no-wrap' },
  { title: 'Department', key: 'department', class: 'no-wrap' },
  { title: 'Direct Line', key: 'direct_line', class: 'no-wrap' },
  { title: 'Direct Fax', key: 'direct_fax', class: 'no-wrap' },
  { title: 'Alt Phone 1', key: 'alt_phone_1', class: 'no-wrap' },
  { title: 'Alt Phone 2', key: 'alt_phone_2', class: 'no-wrap' },
  { title: 'Extension', key: 'extension', class: 'no-wrap' },
  { title: 'Email', key: 'email', class: 'no-wrap' },
  { title: 'Notes', key: 'notes', class: 'no-wrap' },
  { title: 'Actions', key: 'actions', class: 'no-wrap' },
]);

const defaultContact = ref({
  id: null,
  carrier_id: '',
  contact_name: '',
  department: '',
  direct_line: '',
  direct_fax: '',
  alt_phone_1: '',
  alt_phone_2: '',
  extension: '',
  email: '',
  notes: '',
});

const editedContact = ref(defaultContact.value);

const editContact = (contact: any) => {
  editedContact.value = Object.assign({}, contact);
  updatingContact.value = true;
  contactDialog.value = true;
};

const viewContactDetails = (contact: any) => {
  selectedContact.value = contact;
  contactEditDialog.value = true;
};

const updateContactsDialog = (value: any) => {
  contactDialog.value = value;
  editedContact.value = defaultContact.value;
  updatingContact.value = false;
};

const deleteContact = async (contact_Id: any) => {
  const { confirm } = await layoutStore.showConfirmDialog("Are you sure you want to delete");

  if (confirm) {
    carrierListStore.deleteContact(contact_Id);
  }
};

const getCarrierName = (carrier_id: any) => {
  const carrierName = carrierList.value.find((carrier) => carrier.id == carrier_id);
  return carrierName ? carrierName.name : null;
};

// Filter
const selectedCarrier = ref(null);

const filters = ref<filterItem[]>([
  {
    title: 'Select Carrier',
    key: 'carrier_id',
    items: carrierList.value.map(carrier => ({ value: carrier.id, text: carrier.name })) as any[] || [],
    width: '300px',
  },
]);

// List of filtered contacts
const filteredContactList = computed(() => {
  if (!selectedCarrier.value) {
    return contactList.value;
  }
  return contactList.value.filter(contact => contact.carrier_id === selectedCarrier.value);
});
</script>

<template>
  <div>
    <div class="d-flex justify-space-between">
      <div></div>
      <SettingsDispatchCarrierContactDialog :show="contactDialog"
          @update:show="updateContactsDialog" :updating="updatingContact" :item="editedContact" />
      <SettingsDispatchCarrierContactDetailsDialog :model-value="contactEditDialog" :contact="selectedContact" 
        :carriers="carrierList" @update:model-value="contactEditDialog = $event" />
    </div>
    <div>
      <SharedUiCustomTable :filters="filters" :show-footer-in-head="false"  ref="contactTable" :loading="contactLoading" 
        show-select return-object :headers="contactHeaders" :items="filteredContactList">
        <template v-slot:item.actions="{ item }">
          <div>
            <v-icon color="primary" dense @click="editContact(item)">mdi-pencil</v-icon>
            <v-icon color="secondary" dense @click="viewContactDetails(item)">mdi-eye</v-icon>
            <v-icon color="red" dense @click="deleteContact(item.id)">mdi-delete</v-icon>
          </div>
        </template>
        <template v-slot:item.carrier_id="{ item }">
          <span>{{ getCarrierName(item.carrier_id) }}</span>
        </template>
      </SharedUiCustomTable>
    </div>
  </div>
</template>