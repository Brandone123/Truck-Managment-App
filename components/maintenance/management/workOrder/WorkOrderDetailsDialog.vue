<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="updateModelValue"
    fullscreen
    scrollable
  >
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>Work Order #{{ workOrder.id }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="pa-0">
        <div class="d-flex" style="height: calc(100vh - (48px + 60px))">
          <div class="flex-grow-1" style="overflow-y: auto">
            <v-row no-gutters>
              <v-col :cols="showSidePanel ? 12 : 6" class="pa-3">
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
                        <v-menu
                          location="bottom"
                          max-height="400px"
                          width="350px"
                          location-strategy="connected"
                          :close-on-content-click="true"
                          class="rounded"
                          open-on-hover
                        >
                          <template v-slot:activator="{ props }">
                            <div class="d-flex">
                              <div
                                class="rounded position-relative"
                                style="
                                  display: flex;
                                  justify-content: center;
                                  align-items: center;
                                  width: 28px;
                                  height: 28px;
                                  background-color: grey;
                                  color: white;
                                  text-align: center;
                                  position: relative;
                                "
                              >
                                <span
                                  style="font-size: xx-small"
                                  v-if="
                                    getVehicleName(workOrder.vehicle_id)?.type
                                  "
                                  >{{
                                    getVehicleName(workOrder.vehicle_id)
                                      ?.type.slice(0, 3)
                                      .toUpperCase()
                                  }}</span
                                >
                                <span v-else style="font-size: xx-small"
                                  >VHI</span
                                >
                                <div
                                  v-if="
                                    getVehicleName(workOrder.vehicle_id)?.status
                                  "
                                  :class="`${
                                    'bg-' +
                                    getVehicleStatusColor(
                                      getVehicleName(workOrder.vehicle_id)
                                        ?.status
                                    )
                                  }`"
                                  style="
                                    width: 10px;
                                    height: 10px;
                                    position: absolute;
                                    bottom: -2px;
                                    right: -2px;
                                    border-radius: 50%;
                                  "
                                ></div>
                              </div>
                              <span class="ml-3">
                                <span
                                  v-bind="props"
                                  style="
                                    cursor: pointer;
                                    border-bottom: 1px dotted;
                                  "
                                  >{{
                                    getVehicleName(workOrder.vehicle_id)?.name
                                  }}</span
                                >
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
                                            getVehicleName(workOrder.vehicle_id)?.type.slice(0, 3).toUpperCase()
                                          }}</span>
                                        </div>
                                      </v-col>
                                      <v-col cols="4">
                                        <span
                                          class="text-secondary"
                                          v-bind="props"
                                        >
                                          {{
                                            getVehicleName(workOrder.vehicle_id)
                                              ?.name
                                          }}
                                        </span>
                                      </v-col>
                                    </v-row>
                                    <v-row>
                                      <v-col cols="12" md="6">Status</v-col>
                                      <v-col
                                        cols="12"
                                        md="6"
                                        v-if="
                                          getVehicleName(workOrder.vehicle_id)
                                            ?.status
                                        "
                                      >
                                        <v-chip
                                          density="compact"
                                          variant="flat"
                                          :color="
                                            getVehicleStatusColor(
                                              getVehicleName(
                                                workOrder.vehicle_id
                                              )?.status
                                            )
                                          "
                                        >
                                          {{
                                            getVehicleName(workOrder.vehicle_id)
                                              ?.status
                                          }}
                                        </v-chip>
                                      </v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">Operator</v-col>
                                      <v-col cols="12" md="6">{{
                                        getVehicleName(workOrder.vehicle_id)
                                          ?.odometer
                                      }}</v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">Type</v-col>
                                      <v-col cols="12" md="6">{{
                                        getVehicleName(workOrder.vehicle_id)
                                          ?.type
                                      }}</v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6"
                                        >Year Make Model</v-col
                                      >
                                      <v-col cols="12" md="6">
                                        {{
                                          getVehicleName(workOrder.vehicle_id)
                                            ?.year
                                        }}
                                        {{
                                          getVehicleName(workOrder.vehicle_id)
                                            ?.make
                                        }}
                                        {{
                                          getVehicleName(workOrder.vehicle_id)
                                            ?.model
                                        }}
                                      </v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">Group</v-col>
                                      <v-col
                                        cols="12"
                                        md="6"
                                        v-if="
                                          getVehicleName(workOrder.vehicle_id)
                                            ?.dimensions
                                        "
                                        >{{
                                          getVehicleName(workOrder.vehicle_id)
                                            ?.dimensions.ground_clearance
                                        }}</v-col
                                      >
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">VIN/SN</v-col>
                                      <v-col cols="12" md="6">{{
                                        getVehicleName(workOrder.vehicle_id)
                                          ?.vin
                                      }}</v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6"
                                        >Current Meter</v-col
                                      >
                                      <v-col cols="12" md="6">{{}}</v-col>
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
                      <v-col cols="12" md="6">Vendor</v-col>
                      <v-col cols="12" md="6">{{
                        workOrder.vendor ? workOrder.vendor : "N/A"
                      }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Status</v-col>
                      <v-col cols="12" md="6" class="text-capitalize">
                        <v-chip
                          density="compact"
                          variant="flat"
                          :color="getStatusColor(workOrder.status)"
                        >
                          {{ workOrder.status }}
                        </v-chip>
                      </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Assinged To</v-col>
                      <v-col cols="12" md="6">
                        <v-menu
                          v-if="workOrder.assigned_to"
                          location="bottom"
                          max-height="400px"
                          width="350px"
                          location-strategy="connected"
                          :close-on-content-click="true"
                          class="rounded"
                          open-on-hover
                        >
                          <template v-slot:activator="{ props }">
                            <v-chip
                              variant="text"
                              :prepend-avatar="
                                getAvatarIcon(
                                  getTechnicianName(workOrder.assigned_to)
                                    ?.full_name
                                )
                              "
                            >
                              <span
                                v-bind="props"
                                class="text-secondary"
                                style="
                                  cursor: pointer;
                                  border-bottom: 1px dotted;
                                "
                                >{{
                                  getTechnicianName(workOrder.assigned_to)
                                    ?.full_name
                                    ? getTechnicianName(workOrder.assigned_to)
                                        ?.full_name
                                    : "N/A"
                                }}</span
                              >
                            </v-chip>
                            <br />
                          </template>
                          <v-row no-gutters>
                            <v-col cols="12">
                              <v-card class="rounded-lg">
                                <v-card-text>
                                  <div class="mb-3">
                                    <v-chip
                                      class="mb-4"
                                      variant="text"
                                      :prepend-avatar="
                                        getAvatarIcon(
                                          getTechnicianName(
                                            workOrder.assigned_to
                                          )?.full_name
                                        )
                                      "
                                    >
                                      <span
                                        v-bind="props"
                                        class="text-secondary"
                                        >{{
                                          getTechnicianName(
                                            workOrder.assigned_to
                                          )?.full_name
                                            ? getTechnicianName(
                                                workOrder.assigned_to
                                              )?.full_name
                                            : "N/A"
                                        }}</span
                                      >
                                    </v-chip>
                                    <v-row>
                                      <v-col cols="12" md="6">Email</v-col>
                                      <v-col
                                        cols="12"
                                        md="6"
                                        v-if="
                                          getTechnicianName(
                                            workOrder.assigned_to
                                          )?.email
                                        "
                                      >
                                        <span style="font-size: small">{{
                                          getTechnicianName(
                                            workOrder.assigned_to
                                          )?.email
                                        }}</span>
                                      </v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">Group</v-col>
                                      <v-col
                                        cols="12"
                                        md="6"
                                        v-if="
                                          getTechnicianName(
                                            workOrder.assigned_to
                                          )?.group
                                        "
                                      >
                                        {{
                                          getTechnicianName(
                                            workOrder.assigned_to
                                          )?.group
                                        }}</v-col
                                      >
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6"
                                        >Classification</v-col
                                      >
                                      <v-col cols="12" md="6">{{
                                        getTechnicianName(workOrder.assigned_to)
                                          ?.classification
                                      }}</v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">Phone</v-col>
                                      <v-col cols="12" md="6">{{
                                        getTechnicianName(workOrder.assigned_to)
                                          ?.mobile_phone
                                      }}</v-col>
                                    </v-row>
                                  </div>
                                </v-card-text>
                              </v-card>
                            </v-col>
                          </v-row>
                        </v-menu>
                        <span v-else>N/A</span>
                      </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Repair Priority Class</v-col>
                      <v-col cols="12" md="6">
                        <v-chip
                          class="text-capitalize"
                          density="compact"
                          variant="flat"
                          :color="getPriorityColor(workOrder.priority as string)"
                          >{{ workOrder.priority }}</v-chip
                        >
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
                  <v-card-title class="font-weight-bold"
                    >Resolved Issues</v-card-title
                  >
                  <v-card-text>
                    <span
                      class="text-grey text-center"
                      v-if="!workOrder.issues"
                    >
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

              <v-col :cols="showSidePanel ? 12 : 6" class="pa-3">
                <!-- <v-card>
                <div class="d-flex">
                  <v-card-title class="font-weight-bold">Warranty Coverage</v-card-title>
                  <span style="cursor: pointer;" class="text-primary ml-auto mt-3 mr-2"><v-icon>mdi-plus</v-icon>View
                    All</span>
                </div>

                <v-card-text>
                  <v-row>
                    <v-col cols="12" sm="4">
                      <v-card class="pa-4">
                        <div>
                          <span>Active</span>
                        </div>
                        <span class="text-h6 text-primary">0</span>
                      </v-card>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-card class="pa-4">
                        <div>
                          <span>Expiring Soon</span>
                        </div>
                        <span class="text-h6 text-red">0</span>
                      </v-card>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-card class="pa-4">
                        <div>
                          <span>Total</span>
                        </div>
                        <span class="text-h6 text-green">0</span>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card> -->

                <v-card>
                  <v-card-title class="font-weight-bold">Timer</v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="6">Start Time</v-col>
                      <v-col cols="12" md="6"
                        >{{ workOrder.actual_start_date }}
                      </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">End Time</v-col>
                      <v-col cols="12" md="6"
                        >{{ workOrder.actual_completion_date }}
                      </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Duration</v-col>
                      <v-col cols="12" md="6">
                        {{
                          workOrder.actual_start_date &&
                          workOrder.actual_completion_date
                            ? getHoursDifference(
                                workOrder.actual_start_date,
                                workOrder.actual_completion_date
                              )
                            : ""
                        }}
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>

                <v-card class="mt-3">
                  <v-card-title class="font-weight-bold"
                    >Line Items</v-card-title
                  >
                  <v-card-text>
                    <v-col>
                      <v-row>
                        <v-col class="py-1" cols="3">Service Task</v-col>
                        <v-col class="py-1" cols="3">Labor</v-col>
                        <v-col class="py-1" cols="3">Parts</v-col>
                        <v-col class="py-1" cols="3">Subtotal</v-col>
                      </v-row>

                      <v-row v-if="workOrder.line_items">
                        <template
                          v-if="workOrder.line_items"
                          v-for="(lineItem, i) in workOrder.line_items"
                          :key="i"
                        >
                          <v-col class="py-1 grey-background" cols="3">
                            <ServiceTaskMenu
                              :serviceTaskId="lineItem.service_task_id"
                            />
                          </v-col>
                          <v-col class="py-1 grey-background" cols="3">
                            ${{ workOrder.labor_subtotal }}</v-col
                          >
                          <v-col class="py-1 grey-background" cols="3">
                            ${{ workOrder.parts_subtotal }}</v-col
                          >
                          <v-col class="py-1 grey-background" cols="3">
                            ${{ workOrder.subtotal }}</v-col
                          >

                          <v-col cols="12">
                            <v-row class="pl-5">
                              <span class="font-weight-bold">Labor </span
                              ><span
                                v-if="(lineItem.labor || []).length == 0"
                                class="text-caption"
                                >(No labor linked to this service task)</span
                              >
                            </v-row>
                            <v-row
                              class="pl-5"
                              v-if="lineItem.labor"
                              v-for="(laborDetail, index) in lineItem.labor"
                              :key="index"
                            >
                              <v-col cols="5" class="py-1">
                                <span class="text-caption">
                                  <span>
                                    <v-icon>mdi-account</v-icon>
                                    {{
                                      getTechnicianName(laborDetail.user_id)
                                        ?.full_name
                                    }}
                                  </span>
                                  <br />
                                  <span
                                    v-if="laborDetail.notes"
                                    class="text-caption"
                                  >
                                    <v-icon size="small"></v-icon>
                                    <span>{{ laborDetail.notes }} </span>
                                  </span>
                                </span>
                              </v-col>
                              <v-col cols="4" class="py-1 text-caption">
                                <div
                                  class="text-primary"
                                  v-if="
                                    Boolean(laborDetail?.start_time) &&
                                    !Boolean(laborDetail?.end_time) &&
                                    laborDetail.user_id
                                  "
                                >
                                  <span>In Progress</span> <br />
                                  <span>{{ laborDetail.start_time }}</span>
                                </div>
                                <div class="text-secondary" v-else>
                                  <div v-if="laborDetail.start_time && laborDetail.end_time">{{
                                    getTimeDifference(laborDetail.start_time, laborDetail.end_time) }}</div>
                                  <div>
                                    <v-icon class="mr-2" size="x-small"
                                      >mdi-timer</v-icon
                                    ><span
                                      >{{ laborDetail.hrs }}hrs x ${{
                                        laborDetail.rate
                                      }}</span
                                    >
                                  </div>
                                </div>
                              </v-col>
                              <v-col cols="3" class="py-1">
                                <span
                                  v-if="
                                    !(
                                      Boolean(laborDetail?.start_time) &&
                                      Boolean(laborDetail?.end_time) &&
                                      laborDetail.user_id
                                    )
                                  "
                                  >${{ laborDetail.subtotal }}</span
                                >
                              </v-col>
                            </v-row>

                            <v-row class="pl-5">
                              <span class="font-weight-bold">Parts </span
                              ><span
                                v-if="(lineItem.parts || []).length == 0"
                                class="text-caption"
                                >(No parts linked to this service task)</span
                              >
                            </v-row>

                            <v-row
                              class="pl-5"
                              v-if="lineItem.parts"
                              v-for="(partDetails, index) in lineItem.parts"
                              :key="index"
                            >
                              <v-col cols="5" class="py-1">
                                <div>
                                  {{ getPartNumber(partDetails.part_id) }}
                                </div>
                                <br />
                                <span
                                  v-if="partDetails.notes"
                                  class="text-caption"
                                >
                                  <v-icon size="small"></v-icon>
                                  <span>{{ partDetails.notes }} </span>
                                </span>
                              </v-col>
                              <v-col cols="4" class="py-1">
                                <span
                                  >{{ partDetails.qte }} x ${{
                                    partDetails.unit_cost
                                  }}</span
                                >
                              </v-col>
                              <v-col cols="3" class="py-1"
                                >${{ partDetails.subtotal }}</v-col
                              >
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
                              <strong>${{ workOrder.subtotal }}</strong>
                              <div style="font-size: smaller">
                                ${{ workOrder.labor_subtotal }}
                              </div>
                              <div style="font-size: smaller">
                                ${{ workOrder.parts_subtotal }}
                              </div>
                            </td>
                          </tr>
                          <tr class="text-h7">
                            <td>
                              <strong
                                >Tax({{
                                  workOrder.tax_type == "percentage"
                                    ? workOrder.tax_amount + "%"
                                    : "Fixed"
                                }})</strong
                              >
                            </td>
                            <td>
                              <strong>+${{ workOrder.tax || "0.00" }}</strong>
                            </td>
                          </tr>
                          <tr class="text-h7">
                            <td>
                              <strong
                                >Warranty Credits ({{
                                  workOrder.warranty_credits_type ==
                                  "percentage"
                                    ? workOrder.warranty_credits_amount + "%"
                                    : "fixed"
                                }})</strong
                              >
                            </td>
                            <td>
                              <strong
                                >-${{
                                  workOrder.warranty_credits || "0.00"
                                }}</strong
                              >
                            </td>
                          </tr>
                          <tr class="text-h7">
                            <td>
                              <strong
                                >Discount ({{
                                  workOrder.discount_type == "percentage"
                                    ? workOrder.discount_amount + "%"
                                    : "Fixed"
                                }})</strong
                              >
                            </td>
                            <td>
                              <strong
                                >-${{ workOrder.discount || "0.00" }}</strong
                              >
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
          </div>
          <v-expand-x-transition>
            <div
              v-if="showSidePanel"
              style="height: calc(100vh - (48px + 60px)); width: 400px"
            >
              <!-- Side Pannel Window Items -->
              <v-window
                v-model="currentStep"
                style="height: calc(100vh - (48px + 60px))"
              >
                <!-- Message Window -->
                <v-window-item
                  :value="1"
                  style="
                    position: relative;
                    overflow-y: auto;
                    height: calc(100vh - (48px + 60px));
                  "
                >
                  <v-sheet flat class="d-flex flex-column fill-height">
                    <v-card-title>Comments</v-card-title>
                    <div class="flex-grow-1">
                      <!-- <div v-if="localWorkOrder.comments">
                        <v-list>
                          <v-list-item v-for="(comment, index) in localWorkOrder.comments" :key="index">
                            <div class="d-flex align-center">
                              <div>
                                <span>
                                  <v-avatar size="30" class="rounded-bg bg-grey">
                                    <v-icon dark>mdi-account</v-icon>
                                  </v-avatar>
                                  {{ comment.user }}
                                </span>
                              </div>
                              <div class="ml-auto">
                                <span style="cursor: pointer;" @click="deleteComment(index)">
                                  <v-icon color="red">mdi-delete</v-icon>
                                </span>
                              </div>
                            </div>
                            <v-list-item-title>
                              <v-card-text>
                                <v-list-item-subtitle>{{ comment.date }}</v-list-item-subtitle>
                                <v-list-item-subtitle>
                                  <v-textarea :rows="2" v-model="comment.text" density="compact" variant="outlined" readonly>

                                  </v-textarea>
                                </v-list-item-subtitle>
                              </v-card-text>
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </div> -->
                      <div class="text-center">No Comments Yet</div>
                    </div>
                    <div style="position: sticky; bottom: 0" class="px-2">
                      <v-text-field
                        v-model="newComment"
                        @keydown.enter="saveComment"
                        variant="outlined"
                        placeholder="Add Comment"
                      ></v-text-field>
                    </div>
                  </v-sheet>
                </v-window-item>

                <!-- Photo Window -->
                <v-window-item
                  :value="2"
                  style="
                    position: relative;
                    overflow-y: auto;
                    height: calc(100vh - (48px + 60px));
                  "
                >
                  <v-sheet flat class="d-flex flex-column fill-height">
                    <v-card-title
                      >Photos
                      <span v-if="(workOrder.photos || []).length > 0"
                        >({{ (workOrder.photos || []).length }})</span
                      ></v-card-title
                    >
                    <div class="flex-grow-1" style="overflow-x: hidden">
                      <v-row v-if="(workOrder.photos || []).length > 0">
                        <v-col cols="6" v-for="(photo, index) in workOrder.photos" :key="index">
                          <v-card @click="showImage(index)">
                            <v-img class="mx-auto" :src="photo.src" aspect-ratio="1/1" :alt="photo.name">
                              <template v-slot:placeholder>
                                <div
                                  class="d-flex align-center justify-center fill-height"
                                >
                                  <v-progress-circular
                                    color="grey-lighten-4"
                                    indeterminate
                                  ></v-progress-circular>
                                </div>
                              </template>
                            </v-img>
                          </v-card>
                        </v-col>
                        <template> </template>
                      </v-row>
                      <div class="text-center" v-else>No Images Found</div>
                    </div>
                  </v-sheet>
                </v-window-item>
                <template>
                  <ImagePreview :images="workOrder?.photos?.map(photo => photo.src)" :initialIndex="selectedIndex"
                    :modelValue="ImagePreviewDialog" @update:modelValue="ImagePreviewDialog = $event" @close="closeImagePreview" />
                </template>

                <!-- Document Window -->
                <v-window-item
                  :value="3"
                  style="
                    position: relative;
                    overflow-y: auto;
                    height: calc(100vh - (48px + 60px));
                  "
                >
                  <v-sheet flat class="d-flex flex-column fill-height">
                    <v-card-title>Documents <span v-if="(workOrder.documents || []).length > 0">({{
                      (workOrder.documents || []).length
                    }})</span></v-card-title>
                    <div class="flex-grow-1">
                      <v-list v-if="(workOrder.documents || []).length > 0">
                        <template
                          v-for="(document, index) in workOrder.documents"
                          :key="index"
                        >
                          <v-list-item>
                            <a :href="document.src" target="_blank">{{
                              document.name
                            }}</a>
                          </v-list-item>
                          <v-divider
                            v-if="index + 1 < newDocuments.length"
                          ></v-divider>
                        </template>
                      </v-list>
                      <div v-else class="text-center">No Documents</div>
                    </div>
                  </v-sheet>
                </v-window-item>
              </v-window>
            </div>
          </v-expand-x-transition>
          <v-sheet id="side-panel">
            <div class="d-flex flex-column">
              <!-- Toggle Show/Hide Side Bar -->
              <v-tooltip
                :text="showSidePanel ? 'Close Sidebar' : 'Open Sidebar'"
              >
                <template v-slot:activator="{ props }">
                  <v-sheet
                    v-bind="props"
                    @click="toggleButtonPress"
                    class="d-flex justify-center align-center side-button"
                  >
                    <v-icon size="x-small">{{
                      showSidePanel
                        ? "mdi-arrow-expand-right"
                        : "mdi-arrow-expand-left"
                    }}</v-icon>
                  </v-sheet>
                </template>
              </v-tooltip>

              <!-- Toggle Show Comments -->
              <v-tooltip text="Comments">
                <template v-slot:activator="{ props }">
                  <v-sheet
                    @click="toggleSidePanel(1)"
                    :color="currentStep == 1 ? 'primary' : ''"
                    v-bind="props"
                    class="d-flex justify-center align-center side-button"
                    style="height: 50px"
                  >
                    <v-icon size="x-small">mdi-message-text</v-icon>
                  </v-sheet>
                </template>
              </v-tooltip>

              <v-tooltip text="Photos">
                <template v-slot:activator="{ props }">
                  <v-sheet
                    @click="toggleSidePanel(2)"
                    :color="currentStep == 2 ? 'primary' : ''"
                    v-bind="props"
                    class="d-flex justify-center align-center side-button"
                    style="height: 50px"
                  >
                    <v-icon size="x-small">mdi-image</v-icon>
                  </v-sheet>
                </template>
              </v-tooltip>

              <v-tooltip text="Documents">
                <template v-slot:activator="{ props }">
                  <v-sheet
                    @click="toggleSidePanel(3)"
                    :color="currentStep == 3 ? 'primary' : ''"
                    v-bind="props"
                    class="d-flex justify-center align-center side-button"
                    style="height: 50px"
                  >
                    <v-icon size="x-small">mdi-file</v-icon>
                  </v-sheet>
                </template>
              </v-tooltip>
            </div>
          </v-sheet>
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn
          v-if="workOrder.status !== 'Resolved'"
          color="primary"
          @click="resolveWorkOrder(workOrder.id as number)"
          >Resolve Work Order</v-btn
        >
        <v-spacer></v-spacer>
        <WorkOrderReport :workOrder="workOrder" ref="reportComponentRef" />
        <v-btn color="primary" @click="triggerGenerateReport">Generate Report</v-btn>
        <v-btn color="primary" @click="close">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, watch } from "vue";
import type { WorkOrder } from "@/types/maintenance/workOrder";
import IssueMenu from './components/WorkOrderTableIssueMenu.vue';
import ServiceTaskMenu from './components/WorkOrderTableServiceTaskMenu.vue';
import moment from 'moment'
import WorkOrderReport from './components/WorkOrderReport.vue';
import ImagePreview from '~/components/shared/ImagePreview.vue';
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  workOrder: {
    type: Object as PropType<Partial<WorkOrder>>,
    required: true,
  },
});

const partsAndSuppliesStore = usePartsAndSuppliesStore();
const { partSupplies } = storeToRefs(partsAndSuppliesStore);

const showSidePanel = ref(false);
const currentStep = ref(0);
const lastStep = ref(0);

const dialog = ref(false);
const reportComponentRef = ref(null);

const ImagePreviewDialog = ref(false);
const selectedIndex = ref(0);

const triggerGenerateReport = () => {
  if (reportComponentRef.value) {
    reportComponentRef.value.generateReport();
  }
};

const localWorkOrder = ref(JSON.parse(JSON.stringify(props.workOrder)));

const toggleButtonPress = () => {
  if (!showSidePanel) {
    currentStep.value = lastStep.value == 0 ? 1 : lastStep.value;
  } else {
    lastStep.value = currentStep.value;
    currentStep.value = 0;
  }

  showSidePanel.value = !showSidePanel.value;
};

const toggleSidePanel = (stepVal: number) => {
  // clicking on active button should close it
  if (currentStep.value == stepVal && showSidePanel.value) {
    lastStep.value = stepVal;
    currentStep.value = 0;
    showSidePanel.value = false;
  }

  // clicking on another side panel button
  else {
    // if pannel was previously closed
    if (currentStep.value == 0) {
      lastStep.value = stepVal;
    }
    lastStep.value = currentStep.value;
    currentStep.value = stepVal;
    showSidePanel.value = true;
  }
};

const documentfile = ref<HTMLInputElement | null>(null);
const newDocuments = ref<{ name: string; url: string }[]>([]);

function addDocument() {
  documentfile.value?.click();
}

function removeNewDocument(index: number) {
  localWorkOrder.value.documents?.splice(index, 1);
}

function removeDocument(index: number) {
  localWorkOrder.value.documents?.splice(index, 1);
}

function storeNewDocument(event: Event) {
  const files = (event.target as HTMLInputElement).files;
  if (files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      newDocuments.value.push({ name: file.name, url: url });
      // localWorkOrder.value.documents = newDocuments.value
    }
    (event.target as HTMLInputElement).value = "";
  }
}

const getTimeDifference = (start_time: string, end_time: string) => {
  const start = moment(start_time);
  const end = moment(end_time);
  const timeDiff = end.diff(start);
  return formatTimeDifference(timeDiff);
};

const formatTimeDifference = (timeDiff: number) => {
  const formattedTime = moment
    .utc(timeDiff)
    .format("HH [hrs] mm [min] ss [sec]");
  let result = formattedTime.replace(/\b0 [a-z]+\b/g, "");

  // Remove hours if they are 0
  if (result.startsWith("00 hrs")) {
    result = result.replace("00 hrs", "").trim();
  }

  // Remove minutes if they are 0
  if (result.startsWith("00 min")) {
    result = result.replace("00 min", "").trim();
  }

  return result;
};

function showImage(index: number) {
  selectedIndex.value = index;
  ImagePreviewDialog.value = true;
}

const closeImagePreview = () => {
  ImagePreviewDialog.value = false;
}

const workOrderStore = useWorkOrderStore();

const serviceTaskStore = useServiceTaskStore();
const { serviceTaskList } = storeToRefs(serviceTaskStore);

const issueStore = useIssueStore();
const { issueList } = storeToRefs(issueStore);

// const techniciansStore = useTechniciansStore();
// const { technicians } = storeToRefs(techniciansStore);
const employeeStore = useEmployeeStore();
const technicians = computed(() => employeeStore.getTechnicianList);

const assetStore = useAssetStore();
const { assetList } = storeToRefs(assetStore);

const getTechnicianName = (id: any) => {
  const technician = technicians.value.find(
    (technician: any) => technician.user_id == id
  );
  return technician;
};

const getVehicleName = (vehicleId: any) => {
  const vehicleName = assetList.value.find(
    (vehicle) => vehicle.id === vehicleId
  );
  return vehicleName;
};

const getServiceTaskName = (serviceTaskId: any) => {
  const taskName = serviceTaskList.value.find(
    (task) => task.id == serviceTaskId
  );
  return taskName ? taskName.name : "";
};

const getVehicleStatusColor = (status: any) => {
  switch (status || "") {
    case "active":
      return "primary";
    case "Out of Service":
      return "error";
    case "inactive":
      return "secondary";
    case "In Shop":
      return "brown";
    default:
      return "grey";
  }
};

function getAvatarIcon(label: any) {
  const size = 50;
  const circleSize = 50;

  // Générer les initiales à partir du label
  const words = label ? label.split(" ") : "";
  const initials = words
    ? words.map((word: any) => word.charAt(0).toUpperCase())
    : "";

  // Créer un canvas et un contexte 2D
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return "";
  }

  // Générer une couleur unique et légère pour l'avatar
  const colorHash = label ? label.split('').reduce((acc: number, char: string) => ((acc << 5) - acc) + char.charCodeAt(0), 0) : '72183';
  const hue = (colorHash % 360);
  const saturation = 80;
  const lightness = 70;
  const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  // Dessiner le fond avec la couleur légère
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, circleSize / 2, 0, 2 * Math.PI);
  ctx.fill();

  // Dessiner les initiales en blanc
  ctx.font = `${(circleSize * 0.6)}px Arial`;
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initials.length > 0 ? initials.slice(0, 2).join('') : '', size / 2, size / 2);

  return canvas.toDataURL();
}

const emit = defineEmits(["update:modelValue", "save"]);
const step = ref(0);

const close = () => {
  emit('update:modelValue', false);
  showSidePanel.value = false;
  currentStep.value = 0;
};

const updateModelValue = (value: boolean) => {
  emit("update:modelValue", value);
};

const comment = ref("");

const getHoursDifference = (startTime: string, endTime: string) => {
  const datetime1 = new Date(startTime);
  const datetime2 = new Date(endTime);

  const diffInMs = datetime2.getTime() - datetime1.getTime();

  const diffInHrs = (diffInMs / (1000 * 60 * 60)).toFixed(2);

  return `${diffInHrs} hr`;
};

const logLaborHours = () => {
  // Implement log labor hours logic
};

const pullParts = () => {
  // Implement pull parts logic
};

const auth = useAuthStore();

const addComment = () => {
  if (!props.workOrder.comments) {
    props.workOrder.comments = [];
  }
  props.workOrder.comments.push({
    date: new Date().toISOString(),
    description: comment.value,
  });
  comment.value = "";
};

const resolveWorkOrder = async (workOrderId: number) => {
  // if (workOrder.id) {

  // const issues = issueList.value.find((issue) => workOrder.vehicle_id === getVehicleName(props.workOrder.vehicle_id))
  // if (!issues) {
  //   return;
  // }
  // issues.status = 'Resolved'
  // let dateResolved = new Date().toISOString().substring(0, 10)
  // issues.resolved_by = auth.user?.id as number
  // issues.resolved_on = dateResolved.toString()
  // props.workOrder.status = 'Resolved'

  // close();
  // await issueStore.updateIssue(issues);
  await workOrderStore.updateWorkOrder({
    id: workOrderId,
    status: "completed",
  } as any);
  // }
};

const newPhotos = ref<{ name: string; url: string }[]>([]);

function SavePhotos(photo: { name: string; url: string }) {
  newPhotos.value.push(photo);
  props.workOrder.photos = newPhotos.value;
}

function removeNewPhoto(index: number) {
  localWorkOrder.value.photos?.splice(index, 1);
}

const fileInput = ref<HTMLInputElement | null>(null);
// const newPhotos = ref<File[]>([]);

function addPhoto() {
  if (fileInput.value) {
    fileInput.value.click();
  }
}

const storeNewPhoto = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      newPhotos.value.push({
        name: file.name,
        url: URL.createObjectURL(file),
      });
    }
  }
};

function removePhoto(index: any) {
  localWorkOrder.value.photos?.splice(index, 1);
}

const comments = ref<
  { id: number; text: string; date: string; user: string }[]
>([]);
const newComment = ref("");

const saveComment = () => {
  if (newComment.value.trim() !== "") {
    comments.value.push({
      id: comments.value.length + 1,
      text: newComment.value,
      date: new Date().toLocaleString(),
      user: auth.user?.name as string,
    });
    localWorkOrder.value.comments = comments.value;
    newComment.value = "";
  }
};

const deleteComment = (index: number) => {
  localWorkOrder.value.comments?.splice(index, 1);
};

const getPartNumber = (partId: number) => {
  return partSupplies.value?.find((part) => part.id == partId)?.part_number;
};

const saveFIle = async (workOrderId: number) => {
  await workOrderStore.updateWorkOrder({
    id: workOrderId,
    photos: newPhotos.value,
    documents: newDocuments.value,
    comments: localWorkOrder.value.comments,
  } as any);
  emit("update:modelValue", false);
};

const lineItemHeaders = [
  { text: "Item Name", value: "itemName" },
  { text: "Description", value: "description" },
  { text: "Quantity", value: "quantity" },
  { text: "Cost", value: "cost" },
  { text: "Actions", value: "actions", sortable: false },
];

const editLineItem = (item: any) => {
  // Implement edit line item logic
};

const deleteLineItem = (item: any) => {
  // Implement delete line item logic
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

watch(
  () => props.modelValue,
  (newValue) => {
    // techniciansStore.fetchTechnicians()
    // assetStore.fetchAssets()

    newDocuments.value = [];
    newPhotos.value = [];
  }
);
</script>

<style scoped>
.title {
  font-weight: bold;
  color: #1984c5;
}

.custom-timeline :deep(.v-timeline--item__body) {
  width: 100%;
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
  border-left: 1px solid grey;
}

.custom-tr :deep() td {
  border-bottom: transparent !important;
}
</style>
