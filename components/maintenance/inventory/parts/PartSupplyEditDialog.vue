<template>
  <v-dialog :modelValue="modelValue" @update:modelValue="updateModelValue" scrollable fullscreen>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form ref="partSupplyForm">
          <v-row>
            <v-col cols="12" md="6">
              <v-card>
                <v-card-title>Details</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col class="pb-0" cols="12">
                      <v-text-field variant="outlined" flat density="compact" label="Part Number"
                        v-model="localPartSupply.part_number" :rules="[validation.required]"></v-text-field>
                    </v-col>
                    <!-- TODO This is to be done -->

                    <!-- <v-col class="pb-0" cols="12">
                      <v-row>
                        <v-col class="pb-0" cols="12" md="6">
                          <v-img :src="localPartSupply.photo"
                            v-if="typeof localPartSupply.photo == 'string' && localPartSupply.photo.length && !uploadPhoto.length"
                            :width="100" aspect-ratio="16/9">
                          </v-img>
                          <v-file-input v-model="uploadPhoto" placeholder="Select Photo"
                            :label="localPartSupply.photo ? 'Pick New Photo' : 'Pick A Photo'" prepend-icon="mdi-camera"
                            variant="outlined" density="compact"></v-file-input>
                        </v-col>

                        <v-col class="pb-0" cols="12" md="6">
                          <v-btn v-if="typeof localPartSupply.document == 'string' && localPartSupply.document.length  && !uploadDocument.length"
                            @click="openPartDocument" variant="text" density="compact" color="primary">View
                            Current Doument <v-icon>mdi-arrow-right</v-icon></v-btn>
                          <v-file-input v-model="uploadDocument" placeholder="Select Document"
                            :label="localPartSupply.document ? 'Upload New Document' : 'Upload Document'"
                            variant="outlined" density="compact"></v-file-input>
                        </v-col>
                      </v-row>
                    </v-col> -->

                    <v-col class="pb-0" cols="12" sm="6">
                      <v-select variant="outlined" flat density="compact" :items="partCategories"
                        label="Category" item-title="name" item-value="id" v-model="localPartSupply.category_id" required></v-select>
                    </v-col>
                    <v-col class="pb-0" cols="12" sm="6">
                      <v-select :items="partManufacturers" variant="outlined" flat density="compact" label="Manufacturer"
                        v-model="localPartSupply.manufacturer_id" item-title="name" item-value="id" required></v-select>
                    </v-col>
                    <v-col class="pb-0" cols="12" sm="6">
                      <v-text-field variant="outlined" flat density="compact" label="Manufacturer Part Number"
                        v-model="localPartSupply.manufacturer_part_number" type="number"></v-text-field>
                    </v-col>
                    <v-col class="pb-0" cols="12" sm="6">
                      <v-text-field variant="outlined" flat density="compact" label="Universal Product Code (UPC)"
                        v-model="localPartSupply.UPC">

                      </v-text-field>
                    </v-col>
                    <v-col class="pb-0" cols="12" sm="6">
                      <v-text-field variant="outlined" flat density="compact" label="Unit Cost"
                        v-model="localPartSupply.unit_cost" prepend-inner-icon="mdi-currency-usd"></v-text-field>
                    </v-col>
                    <v-col class="pb-0" cols="12" sm="6">
                      <v-select variant="outlined" flat density="compact"
                        :items="partMeasurementUnits" item-title="name" item-value="id"
                        label="Measurement Unit" v-model="localPartSupply.measurement_unit_id" required></v-select>
                    </v-col>
                    <v-col class="pb-0" cols="12">
                      <v-textarea variant="outlined" flat density="compact" label="Description"
                        v-model="localPartSupply.description" :rules="[validation.required]"></v-textarea>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-row>
                <v-col cols="12">
                  <v-card>
                    <v-card-title>Locations</v-card-title>
                    <v-card-text>
                      <p class="text-caption mb-2">Activate for any location to set Aisle/Row/Bin information and enable
                        inventory. Active parts can also be added to Purchase Orders. Locations are managed by Account
                        Owners or Administrators.</p>
                      <v-row>
                        <v-col cols="12">
                          <v-select density="compact" variant="outlined" v-model="addedLocation"
                            placeholder="Please Select" :items="partLocations" item-value="id" item-title="name"></v-select>
                        </v-col>
                        <v-col cols="12">

                          <template v-for="(item, i) in localPartSupply.locations" :key="i">
                            <div class="d-flex justify-space-between font-weight-bold mb-2">
                              <span>{{ getLocationName(item.location_id) }}</span>
                              <v-btn @click="removeLocation(i)" variant="tonal" icon color="red"
                                density="compact"><v-icon>mdi-window-close</v-icon></v-btn>
                            </div>
                            <v-row>
                              <v-col cols="12" md="4" class="pb-0">
                                <v-text-field variant="outlined" density="compact" v-model="item.aisle"
                                  label="Aisle"></v-text-field>
                              </v-col>
                              <v-col cols="12" md="4" class="pb-0">
                                <v-text-field variant="outlined" density="compact" v-model="item.row"
                                  label="Row"></v-text-field>
                              </v-col>
                              <v-col cols="12" md="4" class="pb-0">
                                <v-text-field variant="outlined" density="compact" v-model="item.bin"
                                  label="Bin"></v-text-field>
                              </v-col>
                              <v-col cols="12" md="4" class="pb-0">
                                <v-text-field variant="outlined" density="compact" v-model="item.quantity"
                                  label="Current Quantity" type="number"  :rules="[validation.required]"></v-text-field>
                              </v-col>
                              <v-col cols="12" md="4" class="pb-0">
                                <v-text-field variant="outlined" density="compact" v-model="item.quantity_PO"
                                  label="Quantity PO" type="number"></v-text-field>
                              </v-col>
                              <v-col cols="12" md="4" class="pb-0">
                                <v-text-field variant="outlined" density="compact" v-model="item.quantity_WO"
                                  label="Quantity WO" type="number"></v-text-field>
                              </v-col>
                            </v-row>
                            <v-divider v-if="i + 1 < (localPartSupply.locations || []).length" class="mb-2"></v-divider>
                          </template>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
                <!-- TODO  To be worked on later -->
                <!-- <v-col cols="12">
                  <v-card>
                    <v-card-title>Purchase History</v-card-title>
                    <v-card-text>
                      <v-row>
                        <v-col class="pb-0" cols="12">
                          <template v-for="(ven, i) in localPartSupply.purchase_history" :key="i">
                            <v-row :class="i > 0 ? 'mt-2' : ''">
                              <v-col class="pb-0" cols="12" md="4">
                                <v-text-field label="Vendor Name" v-model="ven.name" density="compact"
                                  variant="outlined">
                                  <template v-slot:prepend>
                                    <v-btn icon density="compact" variant="tonal" @click="removeVendor(i)"><v-icon
                                        color="red">mdi-delete</v-icon></v-btn>
                                  </template>
                                </v-text-field>
                              </v-col>
                              <v-col class="pb-0" cols="12" md="4">
                                <v-text-field label="Price ($)" v-model="ven.price" density="compact"
                                  variant="outlined"></v-text-field>
                              </v-col>
                              <v-col class="pb-0" cols="12" md="4">
                                <v-text-field label="Date Ordered" v-model="ven.date_ordered" density="compact"
                                  variant="outlined" type="date"></v-text-field>
                              </v-col>
                            </v-row>
                            <v-divider></v-divider>
                          </template>
                        </v-col>
                        <v-col class="pb-0" cols="12">
                          <v-btn class="text-none" color="primary" @click="addVendor"><v-icon>mdi-plus</v-icon>Add
                            Vendor</v-btn>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col> -->
              </v-row>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="closeDialog">Cancel</v-btn>
        <v-btn color="primary" @click="savePartSupply">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import type { PartSupply, Location } from '@/types/maintenance/partSupplyTypes';
import { useValidation } from '~/composables/formValidation'
import { usePartCategoryStore } from '@/stores/maintenance/partCategoryStore';
import { usePartManufacturerStore } from '@/stores/maintenance/partManufacturer';
import { usePartLocationStore } from '@/stores/maintenance/partLocationStore';
import { usePartMeasurementUnitstore } from '@/stores/maintenance/partMeasurementsUnits';


const props = defineProps({
  modelValue: Boolean,
  partSupply: {
    type: Object as PropType<Partial<PartSupply>>,
    required: true,
  },
});

const partLocationStore = usePartLocationStore()
const {partLocations} = storeToRefs(partLocationStore)

const partCategoryStore = usePartCategoryStore()
const { partCategories} = storeToRefs(partCategoryStore)

const partManufacturerStore = usePartManufacturerStore()
const { partManufacturers} = storeToRefs(partManufacturerStore)

const partMeasurementUnitStore = usePartMeasurementUnitstore()
const { partMeasurementUnits} = storeToRefs(partMeasurementUnitStore)


const validation = useValidation();
const emit = defineEmits(['update:modelValue', 'close', 'save']);
const partSupplyForm = ref<HTMLFormElement | null>(null)
const localPartSupply = ref<Partial<PartSupply>>(JSON.parse(JSON.stringify(props.partSupply || {})));

const title = computed(() => (props.partSupply && props.partSupply.id ? 'Edit Part/Supply' : 'Add Part/Supply'));

const uploadPhoto = ref([]);
const uploadDocument = ref([]);

const addedLocation = ref<number | null>(null);

watch(addedLocation, (newValue, oldValue) => {
  if (newValue == null) return

  if (localPartSupply.value.locations == null) localPartSupply.value.locations = []

  if (!localPartSupply.value.locations.some((item: Location) => item.location_id == addedLocation.value)) {
    localPartSupply.value.locations.push({
      location_id: addedLocation.value as number,
      aisle: null,
      row: null,
      bin: null,
      quantity: null,
      quantity_PO: null,
      quantity_WO: null,
      // reorder_point: null,
    })
  }
  addedLocation.value = null
})

const getLocationName = (locationId: number) =>{
  return partLocations.value?.find(location => location.id == locationId)?.name
}

const removeLocation = (index: number) => {
  if (localPartSupply.value.locations == null) localPartSupply.value.locations = []
  localPartSupply.value.locations.splice(index, 1)
}

watch(
  () => props.partSupply,
  (newPartSupply) => {
    localPartSupply.value = { ...newPartSupply };
  }
);

const openPartDocument = () => {
  window.open(localPartSupply.value.document, '_blank');
}

const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value);
};

const closeDialog = () => {
  emit('update:modelValue', false);
  emit('close');
  reset()
};

const savePartSupply = async () => {
  const formStatus = await partSupplyForm.value?.validate() || false

  if (!formStatus.valid) {
    return
  }

  // if (uploadDocument.value.length) localPartSupply.value.document = uploadDocument.value[0]
  // if (uploadPhoto.value.length) localPartSupply.value.photo = uploadPhoto.value[0]
  
  let payload = JSON.parse(JSON.stringify(localPartSupply.value))

  //Step necessary if submitting as form data
  payload.locations = localPartSupply.value.locations ? JSON.stringify(localPartSupply.value.locations.map((location) => {
    return {
      location_id: location.location_id,
      aisle: location.aisle,
      row: location.row,
      bin: location.bin,
      quantity: location.quantity,
      quantity_PO: location.quantity_PO,
      quantity_WO: location.quantity_WO,
    }
  })) as any : null
  // payload.purchase_history = localPartSupply.value.purchase_history ? JSON.stringify(localPartSupply.value.purchase_history) as any : null
  
  emit('save', payload);
  emit('update:modelValue', false);
  emit('close');
  reset()
};

const reset = () => {
  uploadPhoto.value = []
  uploadDocument.value = []
}

const addVendor = () => {
  if (!localPartSupply.value.purchase_history) {
    localPartSupply.value.purchase_history = []
  }
  localPartSupply.value.purchase_history.push({ name: '', price: 0, date_ordered: '' })
}

const removeVendor = (index: number) => {
  localPartSupply.value.purchase_history?.splice(index, 1)
}
</script>