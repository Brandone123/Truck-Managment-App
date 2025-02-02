<template>
    <div class="flex-grow-1" style="overflow-y: auto; position: relative; height: 100vh;">
        <v-row no-gutters>
            <v-col cols="12" md="6" class="pa-2">
                <v-card>
                  <v-card-title class="font-weight-bold">Recall Details</v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="6">Vehicle</v-col>
                      <v-col cols="12" md="6">
                        <SharedTableDynamicVehicleItem :vehicle="recall.vehicle" v-if="recall.vehicle_id" />
                        <span v-else>N/A</span>
                      </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Date Imported</v-col>
                      <v-col cols="12" md="6">
                        <!-- <span style="cursor: pointer; border-bottom: 1px dotted;">
                          {{ recall.issued_date }}
                        </span> -->
                        <span style="cursor: pointer; border-bottom: 1px dotted; font-size: small">
                              {{ recall.issued_date }}
                              <v-tooltip activator="parent" location="top" location-strategy="connected">
                                  {{ getRelativeDateTime(recall.issued_date) }}
                              </v-tooltip>
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
                      <v-col cols="12" md="6">Manufacturer</v-col>
                      <v-col cols="12" md="6">{{ recall.manufacturer ? recall.manufacturer : 'N/A'  }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">NHTSA Campaign Number</v-col>
                      <v-col cols="12" md="6">{{recall.nhtsa_campaign_number ? recall.nhtsa_campaign_number : 'N/A'}} </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Status</v-col>
                      <v-col cols="12" md="6"><v-chip density="compact" variant="flat" :color="getStatusColor(recall.status)">{{ recall.status?.charAt(0).toUpperCase() + recall.status?.slice(1) }}</v-chip></v-col>
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
            <v-col cols="12" md="6" class="pa-2">
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
            <v-col cols="12" md="6" class="pa-2">
                <v-card>
                    <v-card-title class="font-weight-bold">Other Details</v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" md="6">Issues</v-col>
                            <v-col cols="12" md="6">
                                <span v-if="recall.issue" @click="viewIssue(recall.issue_id as number)" 
                                    style="cursor: pointer; border-bottom: 1px dotted;">
                                    <IssueMenu :issue="recall.issue" />
                                </span>
                                <span v-else>N/A</span>
                            </v-col>
                        </v-row>
                        <v-divider class="my-3"></v-divider>
                        <v-row>
                            <v-col cols="12" md="6">Work Orders</v-col>
                            <v-col cols="12" md="6">
                              <span class="text-secondary" v-if="(recall.issue?.work_order_id as number)"
                                    style="cursor: pointer; border-bottom: 1px dotted;" @click="viewWorkOrder(recall.issue?.work_order_id as number)">
                                    #{{ (recall.issue?.work_order_id as number) }}
                                </span>
                                <span v-else>N/A</span>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts" setup>
import type { Recall } from '@/types/maintenance/recall';
import { useRouter } from 'vue-router';
import IssueMenu from '@/components/maintenance/management/workOrder/components/WorkOrderTableIssueMenu.vue';
import moment from 'moment'


const router = useRouter();

const props = defineProps({
    recall: {
        type: Object as PropType<Recall>,
        required: true,
    },
    loadingDetails: {
        type: Boolean
    }
});

const getStatusColor = (status: string) => {
  switch ((status || '').toLocaleLowerCase()) {
    case 'open':
      return 'secondary';
    case 'needs action':
      return 'error';
    case 'resolved_issue':
    case 'resolved':
      return 'primary';
    case 'acknowledged':
      return 'orange';
    case 'pending':
      return 'yellow';
    default:
      return 'grey'
  }
}

const getRelativeDateTime = (dateString: any) => {
  return moment(dateString).from(moment());
}

const viewIssue = (issueId: number) => {
    router.push(`/maintenance/IssuesManagement/${issueId}`)
};

const viewWorkOrder = (workOrderId: number) => {
    router.push(`/maintenance/WorkOrders/${workOrderId}`)
};


const assetStore = useAssetStore();
const { assetList } = storeToRefs(assetStore);

const getVehicleName = (vehicleId: any) => {
    const vehicleName = assetList.value.find((vehicle) => vehicle.id === vehicleId);
    return vehicleName;
}
</script>

<style scoped>
.title {
    font-weight: bold;
    color: #1984c5;
}

.spinner-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>