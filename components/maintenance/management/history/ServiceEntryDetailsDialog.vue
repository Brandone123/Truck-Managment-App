<template>
  <v-row>
    <v-col :cols="showSidePanel ? 12 : 6">
      <v-card>
        <v-card-title class="font-weight-bold">Details</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">Completion Date</v-col>
            <v-col cols="12" md="6">
              <span style="cursor: pointer; border-bottom: 1px dotted;">
                {{ new Date(serviceEntry.completed_at).toLocaleDateString('en-US') }}
                <v-tooltip activator="parent" location="top">
                  {{ getRelativeDateTime(serviceEntry.completed_at) }}
                </v-tooltip>
              </span>
            </v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col cols="12" md="6">Vehicle</v-col>
            <v-col cols="12" md="6">
              <SharedTableDynamicVehicleItem :vehicle="serviceEntry.vehicle" />
            </v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col cols="12" md="6">Vendor</v-col>

            <v-col cols="12" md="6">{{
              serviceEntry.vendor ? serviceEntry.vendor.name : "N/A"
            }}</v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col cols="12" md="6">Priority</v-col>
            <v-col cols="12" md="6">{{ serviceEntry.priority }}</v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col cols="12" md="6">Status</v-col>
            <v-col cols="12" md="6"><v-chip density="compact" variant="flat"
                :color="getStatusColor(serviceEntry.status)">{{ serviceEntry.status }}</v-chip></v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col cols="12" md="6">Actual Completion Date</v-col>
            <v-col cols="12" md="6">{{ serviceEntry.actual_completion_date }}</v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col cols="12" md="6">Reference</v-col>
            <v-col cols="12" md="6">{{ serviceEntry.reference }}</v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col cols="12" md="6">Odometer (mi)</v-col>
            <v-col cols="12" md="6">{{ serviceEntry.odometer }}</v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col cols="12" md="6">Description</v-col>
            <v-col cols="12" md="6">{{ serviceEntry.description }}</v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
        </v-card-text>
      </v-card>

      <v-card class="mt-5">
        <v-card-title class="font-weight-bold">Resolved Issues</v-card-title>
        <v-card-text>
          <span class="text-grey text-center" v-if="!serviceEntry.issues?.length">
            No issues to show. If this service entry resolves any issues, you can add them by editing the service
            entry.
          </span>
          <v-list v-else density="compact">
            <template v-for="(issue, i) in serviceEntry.issues" :key="i">
              <v-list-item color="primary">#{{ issue.id }}</v-list-item>
              <v-divider v-if="i + 1 < serviceEntry.issues.length"></v-divider>
            </template>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col>
      <v-card>
        <div class="d-flex">
          <v-card-title class="font-weight-bold">Line Items</v-card-title>
        </div>

        <v-card-text>
          <v-table>
            <thead>
              <tr>
                <th><strong>Service Task</strong></th>
                <th><strong>Labor</strong></th>
                <th><strong>Part</strong></th>
                <th><strong>Subtotal</strong></th>
              </tr>
            </thead>
            <tbody v-if="serviceEntry.line_items !== null">
              <template v-for="(task, index) in serviceEntry.line_items" :key="index">
                <tr>
                  <td>{{ task.service_task?.name }}</td>
                  <td>${{ task.labor_cost }}</td>
                  <td>${{ task.parts_cost }}</td>
                  <td>${{ task.subtotal }}</td>
                </tr>
              </template>
            </tbody>
          </v-table>
          <v-col cols="12">
            <v-table class="grey-background text-right ">
              <tbody>
                <tr class="text-h7">
                  <td><strong>SubTotal</strong>
                    <div style="font-size: smaller;">Labor</div>
                    <div style="font-size: smaller;">Part</div>
                  </td>
                  <td>
                    <strong>${{ serviceEntry?.subtotal }}</strong>
                    <div style="font-size: smaller;">${{ serviceEntry?.labor_subtotal }}</div>
                    <div style="font-size: smaller;">${{ serviceEntry?.parts_subtotal }}</div>
                  </td>
                </tr>

                <tr class="text-h7">
                  <td><strong>Tax({{ serviceEntry.tax_type == 'percentage' ? `${serviceEntry.tax_amount}%` :
                    'Fixed' }})</strong>
                  </td>
                  <td><strong>+${{ serviceEntry.tax }}</strong></td>
                </tr>
                <tr class="text-h7">
                  <td><strong>Warranty Credits({{ serviceEntry.warranty_credits_type == 'percentage' ?
                    `${serviceEntry.warranty_credits_amount}%` : 'Fixed' }})</strong></td>
                  <td><strong>-${{ serviceEntry.warranty_credits_amount }}</strong></td>
                </tr>
                <tr class="text-h7">
                  <td><strong>Discount({{ serviceEntry.discount_type == 'percentage' ?
                    `${serviceEntry.discount_amount}%`
                    :
                    'Fixed' }})</strong></td>
                  <td><strong>-${{ serviceEntry.discount_amount }}</strong></td>
                </tr>
                <tr class="text-h6">
                  <td><strong>Total Amount</strong></td>
                  <td><strong>${{ serviceEntry.total_cost }}</strong></td>
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
import { ref } from 'vue';
import type { PropType } from 'vue';
import type { ServiceHistory } from '@/types/maintenance/serviceHistory';
import moment from 'moment';

const props = defineProps({
  modelValue: Boolean,
  serviceEntry: {
    type: Object as PropType<ServiceHistory>,
    required: true,
  },
  showSidePanel: {
    type: Boolean,
    required: false,
    default: false
  }
});
const getRelativeDateTime = (dateString: any) => {
  return moment(dateString).from(moment());
}

const getStatusColor = (status: string) => {
  switch (status?.toLocaleLowerCase()) {
    case 'completed':
      return 'primary';
    case 'pending':
      return 'yellow';
    case 'in progress':
      return 'secondary';
    default:
      return '';
  }
};
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