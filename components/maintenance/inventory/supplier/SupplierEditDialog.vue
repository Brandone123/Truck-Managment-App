<template>
  <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" fullscreen scrollable>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form ref="supplierForm">
          <v-row>
            <v-col cols="12" md="6">
              <v-card>
                <v-card-title class="text-primary">Details</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" class="pb-0">
                      <v-text-field variant="outlined" density="compact" label="Name" v-model="localSupplier.name"
                        :rules="[validation.required]"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" class="pb-0">
                      <SharedInputPhoneInput variant="outlined" flat density="compact" v-model="localSupplier.phone"
                        :country="localSupplier.country" label="Phone number" :rules="[validation.required]">
                      </SharedInputPhoneInput>
                    </v-col>
                    <v-col cols="12" sm="6" class="pb-0">
                      <v-text-field variant="outlined" density="compact" label="Website" v-model="localSupplier.website"
                        required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" class="pb-0">
                      <SharedInputCountryInput variant="outlined" flat density="compact" :items="countries"
                        item-value="iso2" item-title="name" v-model="localSupplier.country" label="Country"
                        :rules="[validation.required]" />
                    </v-col>
                    <v-col cols="12" sm="6" class="pb-0">
                      <SharedInputStateInput variant="outlined" flat density="compact" :items="states" item-value="iso2"
                        item-title="name" v-model="localSupplier.state" label="State" :country="localSupplier.country"
                        :rules="[validation.required]" />
                    </v-col>
                    <v-col cols="12" sm="6" class="pb-0">
                      <SharedInputCityInput variant="outlined" flat density="compact" :items="cities" item-value="iso2"
                        item-title="name" v-model="localSupplier.city" label="City" :rules="[validation.required]"
                        :country="localSupplier.country" :state="localSupplier.state" />
                    </v-col>
                    <v-col cols="12" sm="6" class="pb-0">
                      <v-text-field variant="outlined" density="compact" label="Zip/Postal Code"
                        v-model="localSupplier.zip" required></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-text-field variant="outlined" density="compact" label="Address" v-model="localSupplier.address"
                        required></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-text-field variant="outlined" density="compact" label="Address Line 2"
                        v-model="localSupplier.address_line2" required></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-textarea variant="outlined" density="compact" label="Notes"
                        v-model="localSupplier.notes"></v-textarea>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <v-card class="mt-2">
                <v-card-title class="text-primary">Watchers</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12">
                      <SharedInputEmployeeAutoCompleteInput v-model="localSupplier.watchers" color="blue-grey-lighten-2"
                        label="Add Watchers" chips closable-chips multiple density="compact" variant="outlined">
                      </SharedInputEmployeeAutoCompleteInput>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="6">
              <v-row>
                <v-col cols="12">
                  <v-card>
                    <v-card-title class="text-primary">Contact Person</v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" class="pb-0">
                          <v-text-field variant="outlined" density="compact" label="Contact Name"
                            v-model="localSupplier.contact_information.name"
                            :rules="[validation.required]"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0">
                          <SharedInputPhoneInput variant="outlined" flat density="compact"
                            v-model="localSupplier.contact_information.phone" :country="localSupplier.country"
                            label="Phone number" :rules="[validation.required]"></SharedInputPhoneInput>
                        </v-col>
                        <v-col cols="12" md="6" class="pb-0">
                          <v-text-field type="email" variant="outlined" density="compact" label="Email"
                            v-model="localSupplier.contact_information.email"
                            :rules="[validation.required, validation.email]"></v-text-field>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12">
                  <v-card>
                    <v-card-title class="text-primary">Classification</v-card-title>
                    <v-card-text>
                      <v-alert v-if="!validClassification" class="mb-3"
                        text="Atleast One Classification Category is Required" type="error"></v-alert>
                      <v-row>
                        <v-col cols="12" class="pb-0">
                          <v-checkbox hide-details color="primary" @click="localSupplier.classification.charging"
                            variant="outlined" density="compact" label="Charging"
                            v-model="localSupplier.classification.charging">
                          </v-checkbox>
                          <div class="ml-7 text-caption">Charging classification allows vendor to be listed on Charging
                            Entries</div>
                        </v-col>
                        <v-col cols="12" class="pb-0">
                          <v-checkbox hide-details color="primary" variant="outlined" density="compact" label="Fuel"
                            v-model="localSupplier.classification.fuel"></v-checkbox>
                          <div class="ml-7 text-caption">Fuel classification allows vendor to be listed on Fuel Entries
                          </div>
                        </v-col>
                        <v-col cols="12" class="pb-0">
                          <v-checkbox hide-details color="primary" variant="outlined" density="compact" label="Parts"
                            v-model="localSupplier.classification.parts"></v-checkbox>
                          <div class="ml-7 text-caption">Parts classification allows vendor to be listed on Parts and
                            Purchase
                            Orders</div>
                        </v-col>
                        <v-col cols="12" class="pb-0">
                          <v-checkbox hide-details color="primary" variant="outlined" density="compact" label="Service"
                            v-model="localSupplier.classification.service"></v-checkbox>
                          <div class="ml-7 text-caption">Service classification allows vendor to be listed on Service
                            Entries, Work
                            Orders, and Warranties</div>
                        </v-col>
                        <v-col hide-details cols="12" class="pb-0">
                          <v-checkbox color="primary" variant="outlined" density="compact" label="Vehicle"
                            v-model="localSupplier.classification.vehicle"></v-checkbox>
                          <div class="ml-7 text-caption">Vehicle classification allows vendor to be listed on Vehicle
                            Acquisitions
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="closeDialog">Cancel</v-btn>
        <v-btn color="primary" @click="saveSupplier">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import type { Supplier } from '@/types/maintenance/supplierTypes';
import { useValidation } from '~/composables/formValidation';

const props = defineProps({
  modelValue: Boolean,
  supplier: {
    type: Object as any,
    default: () => ({
      id: null,
      name: '',
      location: '',
      parts_supplied: '',
      phone: '',
      website: '',
      address: '',
      address_line2: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      contact_information: {
        name: '',
        email: '',
        phone: '',
      },
      classification: {},
      notes: '',
      watchers: []
    })
  },
});

const validation = useValidation();
const emit = defineEmits(['update:modelValue', 'close', 'save']);
const supplierForm = ref<HTMLFormElement | null>(null)

const localSupplier = ref(JSON.parse(JSON.stringify({ ...props.supplier })));

const title = computed(() => (props.supplier && props.supplier.id ? 'Edit Supplier' : 'Add Supplier'));

const countryStore = useCountriesStore();
const { countries, states, cities } = storeToRefs(countryStore);

watch(
  () => props.supplier,
  (newSupplier) => {
    localSupplier.value = JSON.parse(JSON.stringify(newSupplier));
  }
);

watch(
  () => props.supplier.classification,
  (newVal) => {
    localSupplier.value.classification = { ...newVal };
  },
  { deep: true } // This ensures Vue watches deeply nested changes
);


watch(
  () => localSupplier.value.country,
  (newCountry) => {
    if (newCountry) {
      if (!props.supplier.country || props.supplier.country !== newCountry) {
        localSupplier.value.state = undefined;
        localSupplier.value.city = undefined;
      }
    }
  }
);

watch(
  () => localSupplier.value.state,
  (newState) => {
    if (newState) {
      if (!props.supplier.country || props.supplier.country !== newState) {
        localSupplier.value.city = undefined;
      }
    }
  }
);

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      if (localSupplier.value && localSupplier.value.earliest_date_time) {
        localSupplier.value = { ...props.supplier };
      } else {
        localSupplier.value = {
          ...props.supplier,
          country: "US",
          contact_phone: "+1",
        };
      }
    }
  }
);
const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value);
};

const closeDialog = () => {
  emit('update:modelValue', false);
  emit('close');
};

const validClassification = computed(() => {
  return Object.keys(localSupplier.value?.classification)?.some(key => localSupplier.value?.classification[key] === true) ?? false
})
const saveSupplier = async () => {
  const formStatus = await supplierForm.value?.validate() || false

  if (!formStatus.valid) {
    return
  }

  if (!validClassification.value) {
    useLayoutStore().setStatusMessage('At least one classification is Required', 'error')
    return
  }

  emit('save', localSupplier.value);
  emit('update:modelValue', false);
  emit('close');
};
</script>