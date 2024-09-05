<template>
  <v-dialog :model-value="modelValue" @update:model-value="updateModelValue" fullscreen scrollable>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>Recall #{{ recall.id }}</v-toolbar-title>
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
                  <v-card-title class="font-weight-bold">Recall Details</v-card-title>
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
                                <span style="font-size:xx-small;" v-if="getVehicleName(recall.vehicle_id)?.type">{{
                                  getVehicleName(recall.vehicle_id)?.type.slice(0, 3).toUpperCase() }}</span>
                                <span v-else style="font-size:xx-small;">VHI</span>
                                <div v-if="getVehicleName(recall.vehicle_id)?.status"
                                  :class="`${'bg-' + getVehicleStatusColor(getVehicleName(recall.vehicle_id)?.status)}`"
                                  style="width: 10px; height: 10px; position: absolute; bottom: -2px; right: -2px; border-radius: 50%;">
                                </div>
                              </div>
                              <span class="ml-3">
                                <span v-bind="props" style="cursor: pointer; border-bottom: 1px dotted;">{{ getVehicleName(recall.vehicle_id)?.name }}</span>
                              </span>
                            </div>
                          </template>

                          <v-row no-gutters>
                            <v-col cols="12">
                              <v-card class="rounded-lg">
                                <v-card-text>
                                  <div class="mb-3">
                                    <v-row>
                                      <v-col cols="3">
                                        <div class="rounded position-relative"
                                          style="display: flex; justify-content: center; align-items: center; width: 45px; height: 45px; background-color: grey; color: white; text-align: center; position: relative;">
                                          <span style="font-size: large;">{{
                                            getVehicleName(recall.vehicle_id)?.type.slice(0, 3).toUpperCase() }}</span>
                                        </div>
                                      </v-col>
                                      <v-col cols="4">
                                        <span class="text-secondary" v-bind="props"
                                          style="cursor: pointer; border-bottom: 1px dotted;">
                                          {{ getVehicleName(recall.vehicle_id)?.name }}
                                        </span>
                                      </v-col>
                                    </v-row>
                                    <v-row>
                                      <v-col cols="12" md="6">Status</v-col>
                                      <v-col cols="12" md="6" v-if="getVehicleName(recall.vehicle_id)?.status">
                                        <v-chip density="compact"
                                          :color="getVehicleStatusColor(getVehicleName(recall.vehicle_id)?.status)">
                                          {{ getVehicleName(recall.vehicle_id)?.status }}
                                        </v-chip>
                                      </v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">Operator</v-col>
                                      <v-col cols="12" md="6">{{ getVehicleName(recall.vehicle_id)?.odometer }}</v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">Type</v-col>
                                      <v-col cols="12" md="6">{{ getVehicleName(recall.vehicle_id)?.type }}</v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">Year Make Model</v-col>
                                      <v-col cols="12" md="6">
                                        {{ getVehicleName(recall.vehicle_id)?.year }}
                                        {{ getVehicleName(recall.vehicle_id)?.make }}
                                        {{ getVehicleName(recall.vehicle_id)?.model }}
                                      </v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">Group</v-col>
                                      <v-col cols="12" md="6" v-if="getVehicleName(recall.vehicle_id)?.dimensions">{{
                                        getVehicleName(recall.vehicle_id)?.dimensions.ground_clearance }}</v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">VIN/SN</v-col>
                                      <v-col cols="12" md="6">{{ getVehicleName(recall.vehicle_id)?.vin }}</v-col>
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
                      <v-col cols="12" md="6">Date Imported</v-col>
                      <v-col cols="12" md="6">
                        <span style="cursor: pointer; border-bottom: 1px dotted;">
                          {{ recall.issued_date }}
                        </span>
                      </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Year Make Model</v-col>
                      <v-col cols="12" md="6">
                        {{ recall.recall_year }} 
                        {{ recall.recall_make }}
                        {{ recall.recall_model }}
                      </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">VIN/SN</v-col>
                      <v-col cols="12" md="6">{{ getVehicleName(recall.vehicle_id)?.vin }}</v-col>
                    </v-row>
                    <v-divider class="my-2"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Manufacturer Campaign Number</v-col>
                      <v-col cols="12" md="6">{{ recall.manufacturer_campaign_number ? recall.manufacturer_campaign_number : 'N/A'  }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">NHTSA Campaign Number</v-col>
                      <v-col cols="12" md="6">{{recall.NHTSA_campaign_number ? recall.NHTSA_campaign_number : 'N/A'}} </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Status</v-col>
                      <v-col cols="12" md="6"><v-chip density="compact" variant="flat" :color="getStatusColor(recall.status)">{{ recall.status.charAt(0).toUpperCase() + recall.status.slice(1) }}</v-chip></v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-card-text>
                      <v-row>
                          <v-textarea class="mt-3" variant="outlined" flat density="compact" v-model="recall.notes" label="Notes" readonly  :rows="3"></v-textarea>
                      </v-row>
                    </v-card-text>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-textarea class="mt-3" variant="outlined" flat density="compact" v-model="recall.summary" label="Summary" readonly  :rows="4"></v-textarea>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea class="mt-3" variant="outlined" flat density="compact" v-model="recall.safety_risk" label="Safety Risk" readonly  :rows="4"></v-textarea>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea class="mt-3" variant="outlined" flat density="compact" v-model="recall.remedy" label="Remedy" readonly  :rows="4"></v-textarea>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" @click="convertToIssue(recall.vehicle_id)">Create Issue</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="close">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { Recall } from '@/types/maintenance/recall';
import IssueEditDialog from '@/components/maintenance/issue/issueManagement/IssueEditDialog.vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  recall: {
    type: Object as PropType<Recall>,
    required: true,
  },
});

const router = useRouter();
const emit = defineEmits(['update:modelValue']);

const convertToIssue = (itemId: any) => {
  // Implement the convert to issue logic
  router.push({ path: '/maintenance/IssuesManagement', query: {
    vehicleName: getVehicleName(itemId)?.name, 
    reported_date: new Date().toISOString().slice(0, 10),
    action: 'createIssue'
  }})
};

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
  switch (status.toLocaleLowerCase()) {
    case 'Open':
      return 'secondary';
    case 'Needs Action':
      return 'error';
    case 'Resolved':
      return 'primary';
    case 'Acknowledged':
      return 'orange';
    case 'pending':
      return 'yellow';
    default:
      return 'grey'
  }
}

const getVehicleStatusColor = (status: any) => {
  switch (status) {
    case 'active':
      return 'primary';
    case 'Out of Service':
      return 'error';
    case 'inactive':
      return 'secondary';
    case 'In Shop':
      return 'brown';
    default:
      return 'grey';
  }
}

</script>
<style scoped>
.title {
  font-weight: bold;
  color: #1984c5;
}
</style>