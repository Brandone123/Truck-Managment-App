<template>
  <v-dialog :model-value="dialog" @update:model-value="updateDialog" scrollable fullscreen>
    <template v-slot:activator="{ props }">
      <v-btn density="comfortable" color="primary" flat v-bind="props" class="text-none">
        <v-icon>mdi-plus</v-icon>
        Add Carrier
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
        <v-form ref="carrierForm">
          <v-row>
            <v-col cols="12" md="6">
              <v-card>
                <v-card-title class="font-weight-bold">Carrier Information</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field variant="outlined" flat density="compact" v-model="carrierInfo.name" label="Name" :rules="[validation.required]"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field variant="outlined" flat density="compact" v-model="carrierInfo.email" label="Email" :rules="[validation.required]"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select variant="outlined" :items="['Type A', 'Type B', 'Type C']" flat density="compact" v-model="carrierInfo.carrier_type" label="Carrier Type"></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field variant="outlined" flat density="compact" v-model="carrierInfo.phone" label="Phone" :rules="[validation.required]"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea variant="outlined" flat density="compact" v-model="carrierInfo.notes" label="Notes"></v-textarea>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="6">
              <v-card>
                <v-card-title class="font-weight-bold">Address Details</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field variant="outlined" flat density="compact" v-model="carrierInfo.address_line_1" label="Address Line 1"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field variant="outlined" flat density="compact" v-model="carrierInfo.address_line_2" label="Address Line 2"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field variant="outlined" flat density="compact" v-model="carrierInfo.city" label="City"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field variant="outlined" flat density="compact" v-model="carrierInfo.state" label="State" :rules="[validation.required]"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field variant="outlined" flat density="compact" v-model="carrierInfo.zip_code" label="Zip Code"></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <v-card class="mt-5">
                <v-card-title class="font-weight-bold">Registration Details</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field variant="outlined" flat density="compact" v-model="carrierInfo.mc_number" label="MC Number"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field variant="outlined" flat density="compact" v-model="carrierInfo.dot_number" label="DOT Number"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field variant="outlined" flat density="compact" v-model="carrierInfo.fax" label="Fax"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select variant="outlined" :items="['Active', 'Inactive']" flat density="compact" v-model="carrierInfo.status" label="Status" :rules="[validation.required]"></v-select>
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
import type { CarrierInfo } from '~/types/dispatch/carrier';
import { useCarrierStore } from '~/stores/settings/dispatch/carrier';
import { useValidation } from '~/composables/formValidation';

const emit = defineEmits(['update:show', 'addCarrier', 'editCarrier']);

const validation = useValidation();

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

const carrierListStore = useCarrierStore();

const defaultCarrier = ref<CarrierInfo>({
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

const carrierInfo = ref(defaultCarrier.value);

const title = computed(() => (props.updating ? 'Edit Carrier' : 'Create Carrier'));

const saveButtonText = computed(() => (props.updating ? 'Update' : 'Save'));

const rules = {
  required: (value: string) => !!value || 'Field is required',
};

const carrierForm = ref<HTMLFormElement | null>(null)

const validateForm1 = async () => {
  let formStatus = await carrierForm.value?.validate()
  return formStatus.valid ? true : false
}

const save = async () => {
  // validate first window
  let validForm1 = await validateForm1()
  if (!validForm1) {
    return;
  }

  if (props.updating) {
    carrierListStore.updateCarrier(carrierInfo.value);
  } else {
    carrierListStore.createCarrier(carrierInfo.value);
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
  if (carrierForm.value) {
    (carrierForm.value as HTMLFormElement).reset();
  }
};

watch(dialog, (val) => {
  if (val && props.updating) {
    carrierInfo.value = props.item as CarrierInfo;
  } else {
    resetForm();
  }
});
</script>