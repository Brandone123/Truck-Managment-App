<template>
      <v-row >
        <v-col :cols="showSidePanel ? 12 : 6">
          <v-card>
            <div class="d-flex">
              <span>
                <v-card-title class="text-h7 font-weight-bold text-primary">Details</v-card-title>
              </span>
            </div>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">Part Number</v-col>
                <v-col cols="12" md="6">{{ partDetail?.part_number ? partDetail?.part_number : '---' }}</v-col>
              </v-row>
              <v-divider class="my-3"></v-divider>
              <v-row>
                <v-col cols="12" md="6">Category</v-col>
                <v-col cols="12" md="6">{{ partDetail?.category_id ? getCategoryName(partDetail?.category_id) : '---'
                  }}</v-col>
              </v-row>
              <v-divider class="my-3"></v-divider>
              <v-row>
                <v-col cols="12" md="6">Manufacturer</v-col>
                <v-col cols="12" md="6">{{ partDetail?.manufacturer_id ?
                  getManufacturerName(partDetail?.manufacturer_id) : '---'
                  }}</v-col>
              </v-row>
              <v-divider class="my-3"></v-divider>
              <v-row>
                <v-col cols="12" md="6">Manufacturer Part Number</v-col>
                <v-col cols="12" md="6">{{ partDetail?.manufacturer_part_number ?
                  partDetail?.manufacturer_part_number : '---' }}</v-col>
              </v-row>
              <v-divider class="my-3"></v-divider>
              <v-row>
                <v-col cols="12" md="6">UPC</v-col>
                <v-col cols="12" md="6">{{ partDetail?.UPC ? partDetail?.UPC : '---' }}</v-col>
              </v-row>
              <v-divider class="my-3"></v-divider>
              <v-row>
                <v-col cols="12" md="6">Unit Cost</v-col>
                <v-col cols="12" md="6">{{ partDetail?.unit_cost ? '$' + partDetail?.unit_cost : '---'
                  }}</v-col>
              </v-row>
              <v-divider class="my-3"></v-divider>
              <v-row>
                <v-col cols="12" md="6">Measurement Unit</v-col>
                <v-col cols="12" md="6">{{ partDetail?.measurement_unit_id ?
                  getMeasurementUnitNameSymbol(partDetail?.measurement_unit_id) :
                  '---' }}</v-col>
              </v-row>
              <v-divider class="my-3"></v-divider>
              <v-row>
                <v-col cols="12" md="6">Description</v-col>
                <v-col cols="12" md="6">{{ partDetail?.description ? partDetail?.description : '---' }}</v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col :cols="showSidePanel ? 12 : 6">
          <v-card>
            <div class="d-flex">
              <span>
                <v-card-title class="text-h7 font-weight-bold text-primary">Locations</v-card-title>
              </span>
              <div class="ml-auto mr-1 mt-3">
                <v-btn color="primary" density="comfortable" variant="tonal" disabled>Manage</v-btn>
              </div>
            </div>
            <v-card-text>
              <div v-if="!partDetail?.locations?.length" class="text-center text-caption">No Assigned Locations</div>
              <div v-else class="rounded pa-2 mb-2" style="border: 1px solid silver;"
                v-for="(location, index) in partDetail?.locations">

                <div class="d-flex mt-1">
                  <div>
                    <span class="text-secondary font-weight-bold text-h6">{{
                      getLocationName(location.location_id) }}</span>
                  </div>
                  <div class="d-flex ml-auto">
                    <span class="rounded pa-1 watch" style="border: 1px solid silver;cursor: pointer;">
                      <v-icon style="font-size:medium">mdi-bell-outline</v-icon> Watch
                    </span>
                    <span class="clickable-block rounded d-flex align-center ml-2">
                      <span class="icon-container add-to-cart">
                        <v-icon style="font-size:medium" class="hover-add-to-cart">mdi-cart-plus</v-icon>
                      </span>
                      <span class="separator"></span>
                      <span class="icon-container show-options">
                        <v-icon style="font-size:medium" class="hover-show-options">mdi-dots-horizontal</v-icon>
                      </span>
                    </span>
                  </div>
                </div>

                <v-row class="mt-5">
                  <v-col cols="12" sm="3">
                    <span
                      style="cursor: pointer; border-bottom: 1px dotted; justify-content: center; align-items: center;text-align: center;">
                      Current Qte</span>
                    <div class="mt-2 font-weight-bold" style="font-size: 17px;">{{ location.quantity ?
                      location.quantity : '0' }}
                    </div>
                  </v-col>
                  <v-col cols="12" sm="3">
                    <span
                      style="cursor: pointer; border-bottom: 1px dotted; justify-content: center; align-items: center;text-align: center;">
                      Reoder Point</span>
                    <div class="mt-2 font-weight-bold" style="font-size: 17px;">{{ location.reorder_point ?
                      location.reorder_point : '---' }}</div>
                  </v-col>
                  <v-col cols="12" sm="3">
                    <span
                      style="cursor: pointer; border-bottom: 1px dotted; justify-content: center; align-items: center;text-align: center;">
                      Pending PO Qte</span>
                    <div class="mt-2 font-weight-bold" style="font-size: 17px;">{{ location.quantity_PO ?
                      location.quantity_PO :
                      'N/A' }}</div>
                  </v-col>
                  <v-col cols="12" sm="3">
                    <span
                      style="cursor: pointer; border-bottom: 1px dotted; justify-content: center; align-items: center;text-align: center;">
                      WO Current Qte</span>
                    <div class="mt-2 font-weight-bold" style="font-size: 17px;">{{ location.quantity_WO ?
                      location.quantity_WO :
                      'N/A' }}</div>
                  </v-col>
                </v-row>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

</template>

<script lang="ts" setup>
import { defineProps, ref} from "vue";
import type { Part } from "@/types/maintenance/part";
import { usePartCategoryStore } from '@/stores/maintenance/partCategoryStore';


const props = defineProps({
  partDetail: {
    type: Object as PropType<Partial<Part>>,
    required: true,
  },
  loading: {
    type: Boolean,
    required: false,
    default: false
  },
  showSidePanel: {
    type: Boolean,
    required: false,
    default: false
  }
});

const partLocationStore = usePartLocationStore()
const { partLocations } = storeToRefs(partLocationStore)


const partCategoryStore = usePartCategoryStore()
const { partCategories } = storeToRefs(partCategoryStore)

const partManufacturerStore = usePartManufacturerStore()
const { partManufacturers } = storeToRefs(partManufacturerStore)

const partMeasurementUnitStore = usePartMeasurementUnitstore()
const { partMeasurementUnits } = storeToRefs(partMeasurementUnitStore)
const getCategoryName = (categoryId: number) => {
  return partCategories.value.find(category => category.id == categoryId)?.name
}
const getManufacturerName = (manufacturerId: number) => {
  return partManufacturers.value.find(manufacturer => manufacturer.id == manufacturerId)?.name
}
const getMeasurementUnitNameSymbol = (unitId: number) => {
  const unit = partMeasurementUnits.value.find(unit => unit.id == unitId)
  return unit?.name + ` (${unit?.symbol})`
}

const getLocationName = (locationId: number) => {
  return partLocations.value?.find(location => location.id == locationId)?.name
}

</script>

<style scoped>
.title {
  font-weight: bold;
  color: #1984c5;
}


.side-button {
  height: 50px;
  cursor: pointer;
}

.side-button:hover {
  background-color: #eeeeee;
}

#side-panel {
  height: 100%;
  width: 50px;
  min-width: 50px;
  border-left: 1px solid grey;
}
</style>
