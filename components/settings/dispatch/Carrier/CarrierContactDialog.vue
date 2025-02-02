<template>
    <v-dialog :model-value="dialog" @update:model-value="updateDialog" scrollable fullscreen>
      <template v-slot:activator="{ props }">
        <v-btn density="comfortable" color="primary" flat v-bind="props" class="text-none">
          <v-icon>mdi-plus</v-icon>
          Add Carrier Contact
        </v-btn>
      </template>
      <v-card class="grey-background">
        <v-toolbar color="primary" dark>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form ref="contactForm">
            <v-row>
              <v-col cols="12" md="6">
                <v-card>
                  <v-card-title class="font-weight-bold">Contact Details</v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field variant="outlined" flat density="compact" v-model="contactInfo.contact_name" label="Contact Name" :rules="[rules.required]" required></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select variant="outlined" flat density="compact" v-model="contactInfo.carrier_id" :items="carrierList" item-title="name" item-value="id" label="Select Carrier"></v-select>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field variant="outlined" flat density="compact" v-model="contactInfo.email" label="Email" :rules="[rules.required]" required></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field variant="outlined" flat density="compact" v-model="contactInfo.department" label="Department"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field variant="outlined" flat density="compact" v-model="contactInfo.direct_line" label="Direct Line"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field variant="outlined" flat density="compact" v-model="contactInfo.direct_fax" label="Direct Fax"></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
  
              <v-col cols="12" md="6">
                <v-card>
                  <v-card-title class="font-weight-bold">Additional Information</v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field variant="outlined" flat density="compact" v-model="contactInfo.alt_phone_1" label="Alt Phone 1"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field variant="outlined" flat density="compact" v-model="contactInfo.alt_phone_2" label="Alt Phone 2"></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field variant="outlined" flat density="compact" v-model="contactInfo.extension" label="Extension"></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-textarea variant="outlined" flat density="compact" v-model="contactInfo.notes" label="Notes"></v-textarea>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" variant="text" @click="closeDialog">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="save">{{ saveButtonText }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import type { CarrierContacts } from '~/types/dispatch/carrier';
  import { useCarrierStore } from '~/stores/settings/dispatch/carrier';
  
  const emit = defineEmits(['update:show', 'addContact', 'editContact']);
  
  const props = defineProps({
    item: {
      type: Object,
      required: false,
    },
    updating: {
      type: Boolean,
      default: false,
    },
    show: {
      type: Boolean,
      default: false,
    },
  });
  
  const dialog = computed({
    get() {
      return props.show;
    },
    set(newValue) {
      emit('update:show', newValue);
    }
  });
  
  const contactForm = ref(null);
  const carrierListStore = useCarrierStore();
  const { carrierList } = storeToRefs(carrierListStore)
  
  const defaultContact = ref<CarrierContacts>({
    id: null,
    contact_name: '',
    department: '',
    direct_line: '',
    direct_fax: '',
    alt_phone_1: '',
    alt_phone_2: '',
    extension: '',
    email: '',
    notes: '',
    carrier_id: null
  });
  
  const contactInfo = ref(defaultContact.value);
  
  const title = computed(() => (props.updating ? 'Edit Carrier Contact' : 'Add Carrier Contact'));
  
  const saveButtonText = computed(() => (props.updating ? 'Update' : 'Save'));
  
  const rules = {
    required: (value: string) => !!value || 'Field is required',
  };
  
  const save = () => {
    if (props.updating) {
      carrierListStore.updateContact(contactInfo.value);
    } else {
      carrierListStore.createContact(contactInfo.value);
    }
    dialog.value = false;
  };
  
  const closeDialog = () => {
    dialog.value = false;
  };
  
  const updateDialog = (value: boolean) => {
    dialog.value = value;
  };
  
  const resetForm = () => {
    if (contactForm.value) {
      (contactForm.value as HTMLFormElement).reset();
    }
  };
  
  watch(dialog, (val) => {
    if (val && props.updating) {
      contactInfo.value = { ...props.item } as CarrierContacts;
    } else {
      contactInfo.value = { ...defaultContact.value };
      resetForm();
    }
  });
  </script>