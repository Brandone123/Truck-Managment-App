<template>
  <v-row>
    <v-col :cols="showSidePanel ? 12 : 6">
      <v-card>
        <v-card-title class="font-weight-bold">Details</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">Date Created</v-col>
            <v-col cols="12" md="6">{{
              workOrder.created_at?.substring(0, 10)
            }}</v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col cols="12" md="6">Vehicle</v-col>
            <v-col cols="12" md="6">
              <SharedTableDynamicVehicleItem :vehicle="workOrder.vehicle" v-if="workOrder.vehicle" />
              <span v-else>N/A</span>
            </v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col cols="12" md="6">Vendor</v-col>
            <v-col cols="12" md="6">{{
              workOrder.vendor ? workOrder.vendor : "N/A"
            }}</v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col cols="12" md="6">Status</v-col>
            <v-col cols="12" md="6" class="text-capitalize">
              <v-chip density="compact" variant="flat" :color="getStatusColor(workOrder.status)">
                {{ workOrder.status }}
              </v-chip>
            </v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col cols="12" md="6">Assinged To</v-col>
            <v-col cols="12" md="6">
              <SharedTableDynamicTechnicianItem v-if="workOrder.assigned_to" :technician="workOrder.assigned_to_user" />
              <span v-else>N/A</span>
            </v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col cols="12" md="6">Repair Priority Class</v-col>
            <v-col cols="12" md="6">
              <v-chip class="text-capitalize" density="compact" variant="flat"
                :color="getPriorityColor(workOrder.priority as string)">{{ workOrder.priority }}</v-chip>
            </v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col cols="12" md="6">Operator</v-col>
            <v-col cols="12" md="6">{{
              workOrder.operator ? workOrder.operator : ""
            }}</v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col cols="12" md="6">Expected Completion Date</v-col>
            <v-col cols="12" md="6">{{
              workOrder.expected_completion_date
            }}</v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col cols="12" md="6">Actual Start Date</v-col>
            <v-col cols="12" md="6">{{
              workOrder.actual_start_date
            }}</v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col cols="12" md="6">Actual Completion Date</v-col>
            <v-col cols="12" md="6">{{
              workOrder.actual_completion_date
            }}</v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col cols="12" md="6">Invoice Number</v-col>
            <v-col cols="12" md="6">{{
              workOrder.invoice_number
            }}</v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col cols="12" md="6">PO Number</v-col>
            <v-col cols="12" md="6">{{ workOrder.po_number }}</v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col cols="12" md="6">Odometer</v-col>
            <v-col cols="12" md="6">{{ workOrder.odometer }}</v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card class="mt-5">
        <v-card-title class="font-weight-bold">Resolved Issues</v-card-title>
        <v-card-text>
          <span class="text-grey text-center" v-if="!workOrder.issues">
            No issues to show. If this work order resolves any issues,
            you can add them by editing the work order.
          </span>
          <div v-else>
            <div v-for="(issue, i) in workOrder.issues" class="mb-2">
              <!-- <span class="text-secondary" style="cursor: pointer; border-bottom: 1px dotted;"> #{{ issue.id}} . {{ issue.summary }}</span> -->
              <IssueMenu :issue="issue" :showSummary="true" />
              <br />
              <span>{{ issue.description }}</span>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col :cols="showSidePanel ? 12 : 6">
      <v-card>
        <v-card-title class="font-weight-bold">Timer</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">Start Time</v-col>
            <v-col cols="12" md="6">{{ workOrder.actual_start_date }}
            </v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col cols="12" md="6">End Time</v-col>
            <v-col cols="12" md="6">{{ workOrder.actual_completion_date }}
            </v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col cols="12" md="6">Duration</v-col>
            <v-col cols="12" md="6">
              {{ workOrder.actual_start_date && workOrder.actual_completion_date ? getHourssDifference(
                workOrder.actual_start_date,
                workOrder.actual_completion_date) : "" }}
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card class="mt-3">
        <v-card-title class="font-weight-bold">Line Items</v-card-title>
        <v-card-text>
          <v-col>
            <v-row>
              <v-col class="py-1" cols="3">Service Task</v-col>
              <v-col class="py-1" cols="3">Labor</v-col>
              <v-col class="py-1" cols="3">Parts</v-col>
              <v-col class="py-1" cols="3">Subtotal</v-col>
            </v-row>

            <v-row v-if="workOrder.line_items">
              <template v-if="workOrder.line_items" v-for="(lineItem, i) in workOrder.line_items" :key="i">
                <v-col class="py-1 grey-background" cols="3">
                  <SharedTableDynamicServiceTask :serviceTask="lineItem.service_task" />
                </v-col>
                <v-col class="py-1 grey-background" cols="3">
                  ${{ lineItem.labor_cost }}</v-col>
                <v-col class="py-1 grey-background" cols="3">
                  ${{ lineItem.parts_cost }}</v-col>
                <v-col class="py-1 grey-background" cols="3">
                  ${{ lineItem.subtotal }}</v-col>

                <v-col cols="12">
                  <v-row class="pl-5">
                    <span class="font-weight-bold">Labor </span><span v-if="(lineItem.labor || []).length == 0"
                      class="text-caption">(No labor linked to this
                      service task)</span>
                  </v-row>
                  <v-row class="pl-5" v-if="lineItem.labor" v-for="(laborDetail, index) in lineItem.labor" :key="index">
                    <v-col cols="5" class="py-1">
                      <span class="text-caption">
                        <span>
                          <v-icon>mdi-account</v-icon>
                          {{ laborDetail.technician_name }}
                        </span>
                        <br />
                        <span v-if="laborDetail.notes" class="text-caption">
                          <v-icon size="small"></v-icon>
                          <span>{{ laborDetail.notes }} </span>
                        </span>
                      </span>
                    </v-col>
                    <v-col cols="4" class="py-1 text-caption">
                      <div class="text-primary" v-if="Boolean(laborDetail?.start_time) && !Boolean(laborDetail?.end_time) &&
                        laborDetail.user_id">
                        <span>In Progress</span> <br />
                        <span>{{ laborDetail.start_time }}</span>
                      </div>
                      <div class="text-secondary" v-else>
                        <div>
                          <div>Started At: {{ laborDetail.start_time || 'N/A' }}</div>
                          <div>Ended At: {{ laborDetail.end_time || 'N/A' }}</div>
                          <div>Duration (hrs):
                            <span>{{ laborDetail.hours }} hrs</span>
                          </div>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="3" class="py-1">
                      <span v-if="(
                        Boolean(laborDetail?.hours) &&
                        laborDetail.user_id)">${{ laborDetail.subtotal }}</span>
                    </v-col>
                  </v-row>

                  <v-row class="pl-5">
                    <span class="font-weight-bold">Parts </span><span v-if="(lineItem.parts || []).length == 0"
                      class="text-caption">(No parts linked to this
                      service task)</span>
                  </v-row>

                  <v-row class="pl-5" v-if="lineItem.parts" v-for="(partDetails, index) in lineItem.parts" :key="index">
                    <v-col cols="5" class="py-1">
                      <div>
                        {{ partDetails.part?.part_number }}
                      </div>
                      <div class="text-caption">
                        {{ partDetails.part?.description }}
                      </div>
                      <br />
                      <span v-if="partDetails.notes" class="text-caption">
                        <v-icon size="small"></v-icon>
                        <span>{{ partDetails.notes }} </span>
                      </span>
                    </v-col>
                    <v-col cols="4" class="py-1">
                      <span>{{ partDetails.quantity }} x ${{
                        partDetails.unit_cost
                      }}</span>
                    </v-col>
                    <v-col cols="3" class="py-1">${{ partDetails.subtotal }}</v-col>
                  </v-row>
                </v-col>
              </template>
            </v-row>
          </v-col>

          <v-col cols="12">
            <v-table class="grey-background text-right">
              <tbody>
                <tr class="text-h7">
                  <td>
                    <strong>SubTotal</strong>
                    <div style="font-size: smaller">Labor</div>
                    <div style="font-size: smaller">Part</div>
                  </td>
                  <td>
                    <strong>${{ workOrder?.subtotal }}</strong>
                    <div style="font-size: smaller">
                      ${{ workOrder?.labor_subtotal }}
                    </div>
                    <div style="font-size: smaller">
                      ${{ workOrder?.parts_subtotal }}
                    </div>
                  </td>
                </tr>
                <tr class="text-h7">
                  <td>
                    <strong>Tax({{
                      workOrder.tax_type == "percentage" ? workOrder.tax_amount + "%" : "Fixed"
                    }})</strong>
                  </td>
                  <td>
                    <strong>+${{ workOrder.tax || "0.00" }}</strong>
                  </td>
                </tr>
                <tr class="text-h7">
                  <td>
                    <strong>Warranty Credits ({{ workOrder.warranty_credits_type == "percentage" ?
                      workOrder.warranty_credits_amount + "%" : "fixed"
                      }})</strong>
                  </td>
                  <td>
                    <strong>-${{
                      workOrder.warranty_credits || "0.00"
                    }}</strong>
                  </td>
                </tr>
                <tr class="text-h7">
                  <td>
                    <strong>Discount ({{
                      workOrder.discount_type == "percentage"
                        ? workOrder.discount_amount + "%"
                        : "Fixed"
                    }})</strong>
                  </td>
                  <td>
                    <strong>-${{ workOrder.discount || "0.00" }}</strong>
                  </td>
                </tr>
                <tr class="text-h6">
                  <td><strong>Total Amount</strong></td>
                  <td>
                    <strong>${{ workOrder.total_cost }}</strong>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-col>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>


<script lang="ts" setup>
import { defineProps, defineEmits} from "vue";
import type { WorkOrder } from "@/types/maintenance/workOrder";
import IssueMenu from './components/WorkOrderTableIssueMenu.vue';
import moment from 'moment'
const props = defineProps({
  workOrder: {
    type: Object as PropType<Partial<WorkOrder>>,
    required: true,
  },
  loading: {
    type: Boolean,
    required: false,
    default: false
  },
  loadingComments: {
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




const formatTimeDifference = (timeDiff: number) => {
  const formattedTime = moment
    .utc(timeDiff)
    .format("HH [hrs] mm [min] ss [sec]");
  let result = formattedTime.replace(/\b0 [a-z]+\b/g, "");

  // Remove hourss if they are 0
  if (result.startsWith("00 hrs")) {
    result = result.replace("00 hrs", "").trim();
  }

  // Remove minutes if they are 0
  if (result.startsWith("00 min")) {
    result = result.replace("00 min", "").trim();
  }

  return result;
};



const workOrderStore = useWorkOrderStore();

const emit = defineEmits(["update:modelValue", "save", 'edit', 'fetchComments']);

const getHourssDifference = (startTime: string, endTime: string) => {
  const datetime1 = new Date(startTime);
  const datetime2 = new Date(endTime);

  const diffInMs = datetime2.getTime() - datetime1.getTime();

  const diffInHrs = (diffInMs / (1000 * 60 * 60)).toFixed(2);

  return `${diffInHrs} hr`;
};

const auth = useAuthStore();

const addComment = (payload: any) => {
  workOrderStore.addComment(props.workOrder.id as number, payload)
};




const getStatusColor = (status: any) => {
  switch ((status || "").toLocaleLowerCase()) {
    case "completed":
      return "primary";
    case "pending":
      return "yellow";
    case "open":
      return "secondary";
    case "draft":
      return "grey";
    default:
      return "gray";
  }
};

const getPriorityColor = (status: string) => {
  switch ((status || "").toLocaleLowerCase()) {
    case "scheduled":
      return "green";
    case "non-scheduled":
      return "secondary";
    case "emergency":
      return "alert";
  }
};

</script>

<style scoped></style>
