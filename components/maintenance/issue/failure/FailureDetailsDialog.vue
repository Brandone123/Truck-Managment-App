<template>
  <v-dialog :model-value="modelValue" @update:model-value="updateModelValue" fullscreen scrollable>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>Failure #{{ failure.id }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-row>
              <v-col cols="12">
                <v-card>
                  <v-card-title class="font-weight-bold">Failure Details</v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="6">Vehicle</v-col>
                      <v-col cols="12" md="6">
                        <v-menu location="bottom" max-height="400px" width="350px" location-strategy="connected"
                          :close-on-content-click="true" class="rounded" open-on-hover>
                          <template v-slot:activator="{ props }">
                            <div class="d-flex ">
                              <div class="rounded position-relative"
                                style="display: flex; justify-content: center; align-items: center; width: 28px; height: 28px; background-color: grey; color: white; text-align: center; position: relative;">
                                <span style="font-size:xx-small;" v-if="getVehicleName(failure.vehicle_id)?.type">{{
                                  getVehicleName(failure.vehicle_id)?.type.slice(0, 3).toUpperCase() }}</span>
                                <span v-else style="font-size:xx-small;">VHI</span>
                                <div v-if="getVehicleName(failure.vehicle_id)?.status"
                                  :class="`${'bg-' + getVehicleStatusColor(getVehicleName(failure.vehicle_id)?.status)}`"
                                  style="width: 10px; height: 10px; position: absolute; bottom: -2px; right: -2px; border-radius: 50%;">
                                </div>
                              </div>
                              <span class="ml-3">
                                <span v-bind="props" style="cursor: pointer; border-bottom: 1px dotted;">{{ getVehicleName(failure.vehicle_id)?.name }}</span>
                              </span>
                            </div>
                          </template>

                          <v-row no-gutters>
                            <v-col cols="12">
                              <v-card class="rounded-lg">
                                <v-card-text>
                                  <div class="mb-3">
                                    <div class="d-flex mb-3" style="align-items: center;">
                                      <div>
                                        <div class="rounded position-relative"
                                          style="display: flex; justify-content: center; align-items: center; width: 45px; height: 45px; background-color: grey; color: white; text-align: center; position: relative;">
                                          <span style="font-size: large;">{{
                                            getVehicleName(failure.vehicle_id)?.type.slice(0, 3).toUpperCase() }}</span>
                                        </div>
                                      </div>
                                      <div class="ml-2">
                                        <span class="text-secondary" v-bind="props">
                                          {{ getVehicleName(failure.vehicle_id)?.name }}
                                        </span>
                                      </div>
                                    </div>
                                    <v-row>
                                      <v-col cols="12" md="6">Status</v-col>
                                      <v-col cols="12" md="6" v-if="getVehicleName(failure.vehicle_id)?.status">
                                        <v-chip density="compact"
                                          :color="getVehicleStatusColor(getVehicleName(failure.vehicle_id)?.status)">
                                          {{ getVehicleName(failure.vehicle_id)?.status }}
                                        </v-chip>
                                      </v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">Operator</v-col>
                                      <v-col cols="12" md="6">{{ getVehicleName(failure.vehicle_id)?.odometer }}</v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">Type</v-col>
                                      <v-col cols="12" md="6">{{ getVehicleName(failure.vehicle_id)?.type }}</v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">Year Make Model</v-col>
                                      <v-col cols="12" md="6">
                                        {{ getVehicleName(failure.vehicle_id)?.year }}
                                        {{ getVehicleName(failure.vehicle_id)?.make }}
                                        {{ getVehicleName(failure.vehicle_id)?.model }}
                                      </v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">Group</v-col>
                                      <v-col cols="12" md="6" v-if="getVehicleName(failure.vehicle_id)?.dimensions">{{
                                        getVehicleName(failure.vehicle_id)?.dimensions.ground_clearance }}</v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">VIN/SN</v-col>
                                      <v-col cols="12" md="6">{{ getVehicleName(failure.vehicle_id)?.vin }}</v-col>
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
                      </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Submission Date</v-col>
                      <v-col cols="12" md="6">{{ failure.submission_date }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Inspection Form</v-col>
                      <v-col cols="12" md="6">{{ failure.inspection_form_id ? getFormName(failure.inspection_form_id) : 'N/A' }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Item Name</v-col>
                      <v-col cols="12" md="6">
                        <v-icon>mdi-file-document-outline</v-icon>
                        {{ failure.item_name ? failure.item_name : 'N/A' }}
                      </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Stage</v-col>
                      <v-col cols="12" md="6"><v-chip density="compact" :color="getStatusColor(failure.stage)">{{ failure.stage }}</v-chip></v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row v-if="failure.acknowledge_at">
                      <v-col cols="12" md="6">Acknowledged At</v-col>
                      <v-col cols="12" md="6">{{ failure.acknowledge_at ? failure.acknowledge_at : '' }}</v-col>
                    </v-row>
                    <v-divider v-if="failure.acknowledge_at" class="my-3"></v-divider>
                    <v-row v-if="failure.acknowledge_by">
                      <v-col cols="12" md="6">Acknowledge By</v-col>
                      <v-col cols="12" md="6">{{ failure.acknowledge_by ? failure.acknowledge_by : '' }}</v-col>
                    </v-row>
                    <v-divider v-if="failure.acknowledge_at" class="my-3"></v-divider>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title class="font-weight-bold">Comments</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-textarea class="mt-3" variant="outlined" flat density="compact" v-model="failure.item_comments"
                    label="Comment" readonly></v-textarea>
                  </v-col>
                </v-row>
                <v-row>
                  <template v-for="(item, i) in failure.item_photos">
                    <InspectionItem :item="item" />
                    <v-divider class="my-3" v-if="i + 1 < failure.item_photos.length"></v-divider>
                  </template>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
        <!-- <v-table>
          <tbody>
            <tr>
              <td>
                <div v-for="(photo, index) in failure.item_photos" :key="index">
                  <strong>Photo {{ index }}</strong>: 
                  <a :href="getPhotoUrl(photo)" target="_blank">{{ photo }}</a>
                </div>
              </td>
            </tr>
          </tbody>
        </v-table> -->
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="close">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { Failure } from '@/types/maintenance/failure';
import IssueEditDialog from '@/components/maintenance/issue/issueManagement/IssueEditDialog.vue';
import InspectionItem from '@/components/maintenance/preventiveManagement/inspection/components/InspectionItem.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  failure: {
    type: Object as PropType<Failure>,
    required: true,
  },
});

const inspectionFormStore = useInspectionFormStore();
const { forms } = storeToRefs(inspectionFormStore);

const getFormName = (formId: any) => {
  const formName = forms.value.find((form) => form.id === formId)
  return formName ? formName.name : ''
}

const emit = defineEmits(['update:modelValue']);

const close = () => {
  emit('update:modelValue', false);
};

const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value);
};
const assetStore = useAssetStore();
const { assetList } = storeToRefs(assetStore);

const getVehicleName = (vehicleId: any) =>{
  const vehicleName = assetList.value.find((vehicle) => vehicle.id === vehicleId)
  return vehicleName
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open issue':
      return 'primary';
    case 'acknowledged':
      return 'secondary';
    case 'needs action':
      return 'red';
    case 'resolved':
      return 'green'
  }
};

const getVehicleStatusColor = (status: any) => {
  switch ((status || '')) {
    case 'active':
      return 'primary';
    case 'out of service':
      return 'error';
    case 'inactive':
      return 'secondary';
    case 'in shop':
      return 'brown';
    default:
      return 'grey';
  }
}

const store = useIssueStore();

const getPhotoUrl = (photo: any) => {
  // Implémentez la logique pour récupérer l'URL de la photo à partir du JSON
  return photo;
};
</script>

<style scoped>
.title {
  font-weight: bold;
  color: #1984c5;
}
</style>