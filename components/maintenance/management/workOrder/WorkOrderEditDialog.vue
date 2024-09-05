<template>
  <div>
    <IssueEditDialog :modelValue="issueEditDialog" :issue="selectedIssue"
      :vehicleId="(localWorkOrder.vehicle_id as number)" @update:modelValue="issueEditDialog = $event"
      @close="closeIssueEditDialog" @save="saveIssue" />

    <v-dialog :model-value="modelValue" @update:model-value="updateModelValue" fullscreen scrollable density="compact">
      <v-card class="grey-background">
        <v-toolbar color="primary" dark>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <div style="position:sticky; top:-15px; z-index: 2;" class="grey-background mx-n6 mt-n4">
            <v-stepper flat v-model="step">
              <v-stepper-header>
                <v-stepper-item color="primary" title="Work Order Info" :value="1"></v-stepper-item>
                <v-divider></v-divider>
                <v-stepper-item color="primary" title="Line Items" :value="2"></v-stepper-item>
                <v-divider></v-divider>
                <v-stepper-item color="primary" title="Photos/Documents" :value="3"></v-stepper-item>
              </v-stepper-header>
            </v-stepper>
          </div>
          <v-form ref="workOrderForm2">
            <v-window v-model="step">
              <v-window-item :value="1">
                <v-form ref="workOrderForm">
                  <v-row class="mt-1">
                    <v-col cols="12" md="6">
                      <v-row>
                        <v-col cols="12">
                          <v-card>
                            <v-card-title class="font-weight-bold">Details</v-card-title>
                            <v-card-text>
                              <v-row>
                                <v-col cols="12" sm="6">
                                  <v-autocomplete variant="outlined" flat density="compact" :items="assetList"
                                    v-model="localWorkOrder.vehicle_id" item-title="name" item-value="id"
                                    label="Select Vehicle" :rules="[validation.required]"></v-autocomplete>
                                </v-col>
                                <v-col cols="12" sm="6">
                                  <v-select variant="outlined" flat density="compact" v-model="localWorkOrder.status"
                                    :items="statuses" label="Status" item-value="value" item-title="title"
                                    :rules="[validation.required]"></v-select>
                                </v-col>
                                <v-col cols="12">
                                  <v-select variant="outlined" flat density="compact" v-model="localWorkOrder.priority"
                                    :items="repairPriorityClasses" item-value="value" item-title="title"
                                    label="Repair Priority Class" :rules="[validation.required]"
                                    hint="Repair Priority Class (VMRS Code Key 16) is a simple way to classify whether a service or repair was scheduled, non-scheduled, or an emergency."
                                    persistent-hint></v-select>
                                </v-col>

                                <!-- <v-col cols="12" sm="6">
                                  <v-text-field variant="outlined" flat density="compact"
                                    v-model="localWorkOrder.date_created" label="Issue Date"
                                    type="datetime-local"></v-text-field>
                                </v-col>

                                <v-col cols="12" sm="6">
                                  <v-autocomplete variant="outlined" flat density="compact" v-model="localWorkOrder.reported_by"
                                    label="IssuedBy" :items="operatorList" item-value="value"
                                    item-title="label"></v-autocomplete>
                                </v-col> -->

                                <v-col cols="12" sm="6">
                                  <v-text-field variant="outlined" flat density="compact"
                                    v-model="localWorkOrder.schedule_date" label="Expected Start Date"
                                    type="datetime-local"></v-text-field>
                                </v-col>

                                <v-col cols="12" sm="6">
                                  <v-text-field variant="outlined" flat density="compact"
                                    v-model="localWorkOrder.actual_start_date" label="Actual Start Date"
                                    type="datetime-local"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                  <v-text-field variant="outlined" flat density="compact"
                                    v-model="localWorkOrder.expected_completion_date" label="Expected Completion Date"
                                    type="datetime-local"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                  <v-text-field variant="outlined" flat density="compact"
                                    v-model="localWorkOrder.actual_completion_date" label="Actual Completion Date"
                                    type="datetime-local"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                  <v-select variant="outlined" flat density="compact"
                                    v-model="localWorkOrder.assigned_to" :items="technicians" item-value="user_id"
                                    item-title="full_name" clearable label="Assigned To"></v-select>
                                </v-col>
                                <v-col cols="12" sm="6">
                                  <v-text-field variant="outlined" flat density="compact"
                                    v-model="localWorkOrder.vendor" label="Vendor"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="4">
                                  <v-text-field variant="outlined" flat density="compact"
                                    v-model="localWorkOrder.invoice_number" label="Invoice Number"
                                    type="number"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="4">
                                  <v-text-field variant="outlined" flat density="compact"
                                    v-model="localWorkOrder.po_number" label="PO Number" type="number"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="4">
                                  <v-text-field variant="outlined" flat density="compact"
                                    v-model="localWorkOrder.odometer" label="Odometer" type="number"></v-text-field>
                                </v-col>
                              </v-row>
                            </v-card-text>
                          </v-card>
                        </v-col>
                      </v-row>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-card>
                        <v-card-title class="font-weight-bold">Custom Fields</v-card-title>
                        <v-card-text>
                          <v-row>

                            <v-col cols="12" sm="6">
                              <v-text-field variant="outlined" flat density="compact"
                                v-model="localWorkOrderCustomField.tire_dot_number"
                                label="Tire Dot Number"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <v-text-field variant="outlined" flat density="compact"
                                v-model="localWorkOrderCustomField.truck_number" label="Truck Number"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <v-text-field variant="outlined" flat density="compact"
                                v-model="localWorkOrderCustomField.trailer_number"
                                label="Trailer Number"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <v-select :items="['Yes', 'No']" variant="outlined" flat density="compact"
                                v-model="localWorkOrderCustomField.charge_back" label="Charge Back ?*"
                                :rules="[validation.required]"></v-select>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <v-select :items="['Yes', 'No']" variant="outlined" flat density="compact"
                                v-model="localWorkOrderCustomField.charge_back_issued"
                                label="Charge Back Issued ?"></v-select>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <v-text-field variant="outlined" flat density="compact"
                                v-model="localWorkOrderCustomField.charge_back_to"
                                label="Charge Back To"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <v-text-field variant="outlined" flat density="compact"
                                v-model="localWorkOrderCustomField.roadcall" label="Road Call ?"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <v-select :items="['Yes', 'No']" variant="outlined" flat density="compact"
                                v-model="localWorkOrderCustomField.afterhours_call" label="After Hours Call ?*"
                                :rules="[validation.required]"></v-select>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-col>

                    <v-col cols="12">
                      <v-card class="mt-2">
                        <div class="d-flex">
                          <v-card-title class="font-weight-bold">Issues</v-card-title>
                          <v-btn color="primary" @click="AddIssue" :disabled="!localWorkOrder.vehicle_id"
                            class="ml-auto mr-2 mt-3" style="cursor: pointer; font-size: small">
                            <v-icon>mdi-plus</v-icon>Add Issue
                          </v-btn>
                        </div>
                        <v-card-text>
                          <WorkOrderIssueList :selected="localWorkOrder.issue_ids"
                            :vehicleId="(localWorkOrder.vehicle_id as number)"
                            @onSelection="localWorkOrder.issue_ids = $event" :workOrderId="localWorkOrder.id || -1" />
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-form>
              </v-window-item>
              <v-window-item :value="2">
                <v-card-text>
                  <v-row>
                    <v-col cols="12">
                      <v-card>
                        <div style="position:sticky; z-index: 1;" class="mx-n3 mt-n1 px-5">
                          <v-tabs v-model="tab" center-active>
                            <v-tab value="tab-1" density="compact" color="primary" class="text-none">
                              Service Tasks <v-chip class="ml-2" v-if="localWorkOrder.line_items?.length">{{
                                localWorkOrder?.line_items?.length }}</v-chip>
                            </v-tab>
                            <v-tab value="tab-2" density="compact" color="primary" class="text-none">
                              Labor <v-chip class="ml-2" v-if="totalLaborCount">{{ totalLaborCount }}</v-chip>
                            </v-tab>
                            <v-tab value="tab-3" density="compact" color="primary" class="text-none">
                              Parts <v-chip class="ml-2" v-if="totalPartsCount">{{ totalPartsCount }}</v-chip>
                            </v-tab>
                          </v-tabs>
                        </div>
                        <v-card-text>
                          <v-window v-model="tab" style="overflow:visible;">
                            <v-window-item value="tab-1">
                              <v-col cols="12">
                                <v-autocomplete variant="outlined" flat density="compact" :items="serviceTaskList"
                                  item-title="name" item-value="id" v-model="localWorkOrderLineItem.service_task_id"
                                  label="Search Service Task" @update:modelValue="addServiceTask"></v-autocomplete>
                              </v-col>
                              <v-card-text>
                                <v-row class="mb-1" v-if="localWorkOrder.line_items">
                                  <v-col cols="12" sm="5"></v-col>
                                  <v-col cols="12" sm="2">Labor</v-col>
                                  <v-col cols="12" sm="2">Parts</v-col>
                                  <v-col cols="12" sm="2">SubTotal</v-col>
                                  <v-col cols="12" sm="1"></v-col>
                                </v-row>
                                <ServiceTaskItem class=" mt-2" v-for="(lineItem, i) in localWorkOrder.line_items"
                                  :key="i" :lineItem="lineItem" :getServiceTaskName="getServiceTaskName"
                                  :addLabor="addLabor" :addPart="addPart" :getTechnicianName="getTechnicianName"
                                  :getPartNumber="getPartNumber" :calculateSubtotalLabor="calculateSubtotalLabor"
                                  :editLabor="editLabor" :calculateSubtotalPart="calculateSubtotalPart"
                                  :editPart="editPart" @onPartInput="onPartItemInput(lineItem)"
                                  @onLaborInput="onLaborItemInput(lineItem)" @delete="deleteLineItem(i)" />
                              </v-card-text>
                            </v-window-item>
                            <v-window-item value="tab-2">
                             
                              <v-col cols="12">
                                <v-autocomplete variant="outlined" flat density="compact" :items="technicians"
                                  item-title="full_name" item-value="user_id" v-model="localWorkOrderLabor.user_id"
                                  label="Search For Technician"
                                  @update:modelValue="addLabor(localWorkOrderLabor.user_id)"></v-autocomplete>
                              </v-col>

                              <v-card-text>
                                <v-row class="mb-1" v-if="localWorkOrderLabor">
                                  <v-col cols="12" sm="5"></v-col>
                                  <v-col cols="12" sm="2">Hrs</v-col>
                                  <v-col cols="12" sm="2">Rate</v-col>
                                  <v-col cols="12" sm="2">SubTotal</v-col>
                                  <v-col cols="12" sm="1"></v-col>
                                </v-row>
                                <div v-for="(lineItem, i) in localWorkOrder.line_items" :key="i">
                                  <LaborItem class="mt-2" v-for="(laborItem, indexlabor) in lineItem.labor"
                                    :key="indexlabor" :laborItem="laborItem"
                                    :getLineItemServiceTasks="getLineItemServiceTasks"
                                    :getServiceTaskName="getServiceTaskName" :getTechnicianName="getTechnicianName"
                                    :calculateSubtotalLabor="calculateSubtotalLabor"
                                    @onEdit="editLabor(laborItem, indexlabor)" @onInput="onLaborItemInput(lineItem)" />
                                </div>
                              </v-card-text>
                            </v-window-item>
                            <v-window-item value="tab-3">
                              <!-- Work order part dropdown -->
                              <v-col cols="12">
                                <v-autocomplete variant="outlined" flat density="compact" :items="partSupplies"
                                  item-title="part_number" item-value="id" v-model="localWorkOrderPart.part_id"
                                  label="Search For Part" @update:modelValue="addPart(localWorkOrderPart.part_id)">
                                  <template v-slot:item="{ props, item }">
                                    <v-list-item v-bind="props" :title="item.raw.part_number" style="width:100%;">
                                      <template v-slot:prepend>
                                        <v-icon>mdi-package-variant-closed</v-icon>
                                      </template>
                                      <v-list-item-subtitle>
                                        <v-tooltip text="Manufacturer Part Number">
                                          <template v-slot:activator="{ props }">
                                            <span v-bind="props" style="font-size: 12px;border-bottom: 1px dotted;">{{
                                              item.raw.manufacturer_part_number
                                            }}</span>
                                          </template>
                                        </v-tooltip>
                                        <span class="mx-1">.</span>
                                        <span style="font-size: 12px;text-overflow:ellipsis;">{{
                                          item.raw.description }}</span>
                                      </v-list-item-subtitle>
                                      <template v-slot:append>
                                        <span class="text-caption text-grey">{{
                                          getTotalQuantity(item.raw.locations) }} </span>
                                      </template>

                                    </v-list-item>
                                  </template>
                                </v-autocomplete>
                              </v-col>
                              <!-- end of changess  -->

                              <v-card-text v-if="localWorkOrderPart">
                                <v-row>
                                  <v-col cols="12" sm="5"></v-col>
                                  <v-col cols="12" sm="2">Qty</v-col>
                                  <v-col cols="12" sm="2">Unit Cost</v-col>
                                  <v-col cols="12" sm="2">Subtotal</v-col>
                                  <v-col cols="12" sm="1"></v-col>
                                </v-row>
                                <div v-for="(lineItem, i) in localWorkOrder.line_items" :key="i">
                                  <PartItem class="mt-2" v-for="(partItem, indexPart) in lineItem.parts"
                                    :key="indexPart" :partItem="partItem" :getServiceTaskName="getServiceTaskName"
                                    :getPartNumber="getPartNumber" :calculateSubtotalPart="calculateSubtotalPart"
                                    :getSelectedPartLocations="getSelectedPartLocations"
                                    @onEdit="editPart(partItem, indexPart)" @onInput="onPartItemInput(lineItem)" />
                                </div>
                              </v-card-text>
                            </v-window-item>
                          </v-window>

                          <v-row class="mt-8 px-4">
                            <v-col cols="12" md="7">
                              <v-textarea label="Description" variant="outlined"
                                placeholder="Add notes or additional details"
                                v-model="localWorkOrder.description"></v-textarea>
                            </v-col>
                            <v-col cols="12" md="5">
                              <p class="font-weight-bold text-h5 mb-3">Cost Summary</p>
                              <div class="d-flex justify-space-between mb-5">
                                <span>Labor</span>
                                <span>${{ getWorkOrder.labor_subtotal || '0.00' }} </span>
                              </div>
                              <div class="d-flex justify-space-between mb-5">
                                <span>Parts</span>
                                <span>${{ getWorkOrder.parts_subtotal || '0.00' }} </span>
                              </div>
                              <div class="d-flex justify-space-between mb-5">
                                <span>Subtotal</span>
                                <span>${{ getWorkOrder.subtotal || '0.00' }}</span>
                              </div>
                              <v-row>
                                <v-col cols="4" class="pt-0 d-flex align-center">Warranty Credits</v-col>
                                <v-col cols="5" class="pt-0">
                                  <v-text-field density="compact" hide-details variant="outlined" type="number"
                                    v-model.number="localWorkOrder.warranty_credits_amount"
                                    @update:modelValue="onWarrantyCreditInput">
                                    <template v-slot:prepend>
                                      <v-select
                                        :items="[{ value: 'percentage', symbol: '%' }, { value: 'fixed', symbol: '$' }]"
                                        item-value="value" item-title="symbol" variant="plain" hide-details
                                        density="compact" v-model="localWorkOrder.warranty_credits_type"
                                        @update:modelValue="onWarrantyCreditInput">
                                        <template v-slot:item="{ props, item }">
                                          <v-list-item v-bind="props" title="">
                                            <v-list-item-title>
                                              <div class="d-flex justify-space-between">
                                                <span>{{ item.raw.value }} </span>
                                                <span class="ml-4">{{ item.raw.symbol }}</span>
                                              </div>
                                            </v-list-item-title>
                                          </v-list-item>
                                        </template>
                                      </v-select>
                                    </template>
                                  </v-text-field>
                                </v-col>
                                <v-col cols="3" class="pt-0 d-flex justify-end align-center">- ${{
                                  getWorkOrder.warranty_credits || '0.00' }}</v-col>
                              </v-row>
                              <v-row>
                                <v-col cols="4" class="pt-0 d-flex align-center">Discount</v-col>
                                <v-col cols="5" class="pt-0">
                                  <v-text-field density="compact" hide-details variant="outlined" type="number"
                                    v-model.number="localWorkOrder.discount_amount"
                                    @update:modelValue="onDiscountInput">
                                    <template v-slot:prepend>
                                      <v-select
                                        :items="[{ value: 'percentage', symbol: '%' }, { value: 'fixed', symbol: '$' }]"
                                        item-value="value" item-title="symbol" variant="plain" hide-details
                                        density="compact" v-model="localWorkOrder.discount_type"
                                        @update:modelValue="onDiscountInput">
                                        <template v-slot:item="{ props, item }">
                                          <v-list-item v-bind="props" title="">
                                            <v-list-item-title>
                                              <div class="d-flex justify-space-between">
                                                <span>{{ item.raw.value }} </span>
                                                <span class="ml-4">{{ item.raw.symbol }}</span>
                                              </div>
                                            </v-list-item-title>
                                          </v-list-item>
                                        </template>
                                      </v-select>
                                    </template>
                                  </v-text-field>
                                </v-col>
                                <v-col cols="3" class="pt-0 d-flex justify-end align-center">- ${{
                                  getWorkOrder.discount || '0.00' }}</v-col>
                              </v-row>
                              <v-row>
                                <v-col cols="4" class="pt-0 d-flex align-center">Tax</v-col>
                                <v-col cols="5" class="pt-0">
                                  <v-text-field density="compact" hide-details variant="outlined" type="number"
                                    v-model.number="localWorkOrder.tax_amount" @update:modelValue="onTaxInput" min="0">
                                    <template v-slot:prepend>
                                      <v-select
                                        :items="[{ value: 'percentage', symbol: '%' }, { value: 'fixed', symbol: '$' }]"
                                        item-value="value" item-title="symbol" variant="plain" hide-details
                                        density="compact" v-model="localWorkOrder.tax_type"
                                        @update:modelValue="onTaxInput">
                                        <template v-slot:item="{ props, item }">
                                          <v-list-item v-bind="props" title="">
                                            <v-list-item-title>
                                              <div class="d-flex justify-space-between">
                                                <span>{{ item.raw.value }} </span>
                                                <span class="ml-4">{{ item.raw.symbol }}</span>
                                              </div>
                                            </v-list-item-title>
                                          </v-list-item>
                                        </template>
                                      </v-select>
                                    </template>
                                  </v-text-field>
                                </v-col>
                                <v-col cols="3" class="pt-0 d-flex justify-end align-center">
                                  ${{ getWorkOrder.tax || '0.00' }}
                                </v-col>
                              </v-row>
                              <v-divider class="my-2"></v-divider>
                              <div class="d-flex justify-space-between mt-4 text-h5">
                                <span>Total</span>
                                <span>${{ getWorkOrder.total_cost || '0.00' }}</span>
                              </div>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>

                <!-- Add Labor Dialog -->
                <AddLaborDialog :modelValue="localWorkOrderLabor" :editing="isEditingLabor" :show="showAddLabor"
                  :calculateSubtotalLabor="calculateSubtotalLabor" @close="showAddLabor = false" @save="saveLabor"
                  @update="saveLaborUpdate" @delete="deleteLaborItem" />

                <!-- Add Part Dialog -->
                <AddPartDialog :modelValue="localWorkOrderPart" :editing="isEditingPart" :show="showAddPart"
                  :calculateSubtotalPart="calculateSubtotalPart" @close="showAddPart = false" @save="savePart"
                  @update="savePartUpdate" @delete="deletePartItem" />
              </v-window-item>
              <v-window-item :value="3">
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-card>
                        <v-card-title class="font-weight-bold d-flex">
                          Photos <span v-if="localWorkOrder.photos">({{ localWorkOrder.photos?.length
                            }})</span>
                          <v-spacer></v-spacer>
                          <v-btn color="primary" @click="addPhoto">
                            <v-icon>mdi-plus</v-icon>
                            <span class="ml-2" style="cursor: pointer;">Add Photos</span>
                          </v-btn>
                        </v-card-title>
                        <v-card-text>
                          <v-list v-if="localWorkOrder.photos?.length">
                            <template v-for="(photo, index) in localWorkOrder.photos" :key="index">
                              <v-list-item>
                                <v-list-item-title>{{ photo.name }}</v-list-item-title>
                                <template v-slot:append>
                                  <v-btn variant="text" size="small" color="error" icon="mdi-delete"
                                    @click.stop="removePhoto(index)">
                                  </v-btn>
                                </template>
                              </v-list-item>
                              <v-divider v-if="index + 1 < localWorkOrder.photos.length"></v-divider>
                            </template>
                          </v-list>
                          <input ref="fileInput" type="file" multiple accept="image/*"
                            @change="storeFile($event, 'photos')" style="display: none;" />
                        </v-card-text>
                      </v-card>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-card>
                        <v-card-title class="font-weight-bold d-flex">
                          Documents <span v-if="localWorkOrder.documents">({{
                            localWorkOrder.documents?.length
                          }})</span>
                          <v-spacer></v-spacer>
                          <v-btn color="primary" @click="addDocument">
                            <v-icon>mdi-plus</v-icon>
                            <span class="ml-2" style="cursor: pointer;">Add Documents</span>
                          </v-btn>
                        </v-card-title>
                        <v-card-text>
                          <v-list v-if="localWorkOrder.documents?.length">

                            <template v-for="(document, index) in localWorkOrder.documents" :key="index">
                              <v-list-item>
                                <v-list-item-title>{{ document.name }}</v-list-item-title>
                                <template v-slot:append>
                                  <v-btn variant="text" size="small" color="error" icon="mdi-delete"
                                    @click.stop="removeDocument(index)">
                                  </v-btn>
                                </template>
                              </v-list-item>
                              <v-divider v-if="index + 1 < localWorkOrder.documents.length"></v-divider>
                            </template>
                          </v-list>
                          <input ref="documentfile" type="file" multiple accept="application/pdf"
                            @change="storeFile($event, 'documents')" style="display: none;" />

                        </v-card-text>

                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-window-item>
            </v-window>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" variant="text" @click="closeDialog">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn v-if="step > 1" color="primary" @click="step -= 1"><v-icon>mdi-chevron-left</v-icon> Back</v-btn>
          <v-btn v-if="step < 3" color="primary" @click="nextWindow">Next<v-icon>mdi-chevron-right</v-icon> </v-btn>
          <v-btn v-if="step == 3" color="primary" @click="saveWorkOrder">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import type { PropType } from 'vue';
import { useValidation } from '~/composables/formValidation';
import type { WorkOrder, LineItem, CustomField, Labors, Parts } from '@/types/maintenance/workOrder';
import { useRouter } from 'vue-router';
// import TimeLog from './TimeLog.vue'
import type { Issues } from '@/types/maintenance/issue';
import IssueEditDialog from '@/components/maintenance/issue/issueManagement/IssueEditDialog.vue';
import WorkOrderIssueList from './WorkOrderIssueList.vue'
import AddLaborDialog from './components/AddLaborDialog.vue'
import AddPartDialog from './components/AddPartDialog.vue'
import ServiceTaskItem from './components/ServiceTaskItem.vue'
import LaborItem from './components/LaborItem.vue'
import PartItem from './components/PartItem.vue'
import { isArray } from 'chart.js/helpers';
import Photo from '../../preventiveManagement/form/FormBuilder/components/Photo.vue';
import type { RefSymbol } from '@vue/reactivity';


const router = useRouter();
const issueStore = useIssueStore();

const workOrderStore = useWorkOrderStore();

const layoutStore = useLayoutStore()

const mediaStore = useMediaStore();

const partsAndSuppliesStore = usePartsAndSuppliesStore();
const { partSupplies } = storeToRefs(partsAndSuppliesStore);

const getTotalQuantity = (locations: any) => {
  return locations.reduce((acc: number, location: any) => {
    acc += (location?.quantity || 0);
    return acc;
  }, 0);
}

const props = defineProps({
  modelValue: Boolean,
  workOrder: {
    type: Object as PropType<Partial<WorkOrder>>,
    required: true,
  },
  vehicleId: {
    type: Number,
    required: true,
  },
});

var tab = ref('tab-1');
const showAddLabor = ref(false)
const isEditingLabor = ref(false)
const editLaborIndex = ref(-1)

const showAddPart = ref(false)
const isEditingPart = ref(false)
const editPartIndex = ref(-1)

const issueEditDialog = ref(false);

const selectedIssue = ref<Partial<Issues>>({} as Partial<Issues>);


const fileInput = ref<HTMLInputElement | null>(null);

function addPhoto() {
  fileInput.value?.click();
}

async function storeFile(event: any, location: string) {
  const files = (event.target as HTMLFormElement).files as FileList;

  if (files.length === 0) {
    return;
  }

  const fileArray = Array.from(files);

  for (const file of fileArray) {
    const { data, error } = await mediaStore.uploadFile(file);
    if (data) {
      switch (location) {
        case 'photos':
          if (!isArray(localWorkOrder.value.photos)) {
            localWorkOrder.value.photos = [];
          }
          localWorkOrder.value.photos?.push(data)
          break;
        case 'documents':
          if (!isArray(localWorkOrder.value.documents)) {
            localWorkOrder.value.documents = [];
          }
          localWorkOrder.value.documents?.push(data)
      }
    }
  }

  //clear input value
  if (event.target) {
    (event.target as HTMLFormElement).value = null
  }
}


function removePhoto(index: number) {
  localWorkOrder.value.photos?.splice(index, 1);
}

const documentfile = ref<HTMLInputElement | null>(null);

function addDocument() {
  documentfile.value?.click();
}

function removeDocument(index: number) {
  localWorkOrder.value.documents?.splice(index, 1);
}

const getWorkOrderData = (workOrder: Partial<WorkOrder>) => {
  let newData = JSON.parse(JSON.stringify(workOrder)) || {}
  newData.issue_ids = newData.issues?.map((item: any) => item.id) || []
  return newData
}


const closeIssueEditDialog = () => {
  issueEditDialog.value = false;
};

const saveIssue = async (issue: any) => {
  if (issue.id) {
    await issueStore.updateIssue(issue);
  } else {
    await issueStore.createIssue(issue);
  }
  issueEditDialog.value = false;
}

const AddIssue = () => {
  if (!localWorkOrder.value.vehicle_id) {
    useLayoutStore().setStatusMessage('Select First A Vehicle', 'error')
  }
  selectedIssue.value = {} as Partial<Issues>;
  issueEditDialog.value = true;
}

const assetStore = useAssetStore();
const { assetList } = storeToRefs(assetStore);

// const techniciansStore = useTechniciansStore();
// const { technicians } = storeToRefs(techniciansStore)
const employeeStore = useEmployeeStore();
const technicians = computed(() => employeeStore.getTechnicianList)

const serviceTaskStore = useServiceTaskStore();
const { serviceTaskList } = storeToRefs(serviceTaskStore);

const emit = defineEmits(['update:modelValue', 'close', 'save']);

const workOrderForm = ref<HTMLFormElement | null>(null)
const workOrderForm2 = ref<HTMLFormElement | null>(null)
const validation = useValidation();

const step = ref(1);

const localWorkOrder = ref<Partial<WorkOrder>>(getWorkOrderData(props.workOrder));

const localWorkOrderLineItem = ref<Partial<LineItem>>({});

const localWorkOrderLabor = ref<Partial<Labors>>({});

const localWorkOrderPart = ref<Partial<Parts>>({});

const localWorkOrderCustomField = ref<Partial<CustomField>>(JSON.parse(JSON.stringify(props.workOrder.custom_fields || {})));

const { modelValue, workOrder } = toRefs(props);


// const warranty = ref({
//   type: 'percentage',  // or 'fixed'
//   amount: 0,
// })

// const discount = ref({
//   type: 'percentage',  // or 'fixed'
//   amount: 0,
// })

// const tax = ref({
//   type: 'percentage',  // or 'fixed'
//   amount: 0,
// })


const getServiceTaskName = (serviceTaskId: number) => {
  const taskName = serviceTaskList.value.find(task => task.id == serviceTaskId)
  return taskName ? taskName.name : ''
}

const validateForm1 = async () => {
  let formStatus = await workOrderForm.value?.validate()
  return formStatus.valid ? true : false
}

const validateForm2 = async () => {
  let formStatus = await workOrderForm2.value?.validate()
  return formStatus.valid ? true : false
}

const nextWindow = async () => {
  let valid = false
  switch (step.value) {
    case 1:
      valid = await validateForm1()
      if (valid) {
        step.value = 2
      }
      break
    case 2:
      valid = await validateForm2()
      if (valid) {
        step.value = 3
      }
    default:
      //do nothing
      break;
  }
}

watch([modelValue, workOrder], ([newModelValue, newWorkOrder]) => {
  if (newModelValue === false) {
    resetForm();
  }

  if (newWorkOrder) {
    localWorkOrder.value = getWorkOrderData(newWorkOrder)
    localWorkOrderCustomField.value = localWorkOrder.value.custom_fields as Partial<CustomField> || {}
  }
})

// reset selected issues when vehicle id changes
watch(() => localWorkOrder.value.vehicle_id, (newVal) => {
  if (newVal != props.workOrder.vehicle_id) {
    localWorkOrder.value.issue_ids = []
  } else {
    localWorkOrder.value.issue_ids = localWorkOrder.value?.issues?.map(item => item.id) || []
  }
})

const resetForm = () => {
  nextTick(() => {
    localWorkOrder.value = {} as Partial<WorkOrder>
    step.value = 1
    tab.value = 'tab-1'
    localWorkOrder.value.documents = []
    localWorkOrder.value.photos = []
  })

}

const getLineItemServiceTasks = computed(() => {
  let serviceTaskIds = localWorkOrder.value.line_items?.map(item => item.service_task_id) || []
  return serviceTaskList.value.filter(serviceTask => serviceTaskIds.includes(serviceTask.id as number))
})

const title = computed(() => (localWorkOrder.value.id ? 'Edit Work Order' : 'Create Work Order'));

const statuses = computed(() => {
  let payload = [
    { title: 'Open', value: 'open' },
    { title: 'In Progress', value: 'in progress' },
    { title: 'Completed', value: 'completed' },
    { title: 'Draft', value: 'draft' }
  ]
  return payload
});

const repairPriorityClasses = [
  { title: 'Scheduled', value: 'scheduled' },
  { title: 'Non-Scheduled', value: 'non-sheduled' },
  { title: 'Emergency', value: 'emergency' }
]


const totalLaborCount = computed(() => {
  return localWorkOrder.value?.line_items?.reduce((acc, lineItem) => {
    acc += lineItem.labor?.length || 0
    return acc
  }, 0) || 0
})

const totalPartsCount = computed(() => {
  return localWorkOrder.value?.line_items?.reduce((acc, lineItem) => {
    acc += lineItem.parts?.length || 0
    return acc
  }, 0) || 0
})
const getTechnicianName = (user_id: any) => {
  const TechnicianName = technicians.value.find((tech) => tech.user_id === user_id)
  return TechnicianName ? TechnicianName.full_name : ''
}

const deleteLineItem = (index: number) => {
  localWorkOrder.value.line_items?.splice(index, 1)
  onDeleteLineItem()
}


const addServiceTask = () => {
  const selectedService = localWorkOrderLineItem.value.service_task_id;

  if (!selectedService) {
    return;
  }

  if (!localWorkOrder.value.line_items) {
    localWorkOrder.value.line_items = [];
  }

  const existingTaskIndex = localWorkOrder.value.line_items.findIndex(task => task.service_task_id === selectedService);

  if (existingTaskIndex === -1) {

    const newTask: LineItem = {
      service_task_id: selectedService,
      parts: [],
      part_cost: 0.00,
      labor: [],
      labor_cost: 0.00,
      subtotal: 0.00,
      notes: null
    };

    localWorkOrder.value.line_items.push(newTask);
  }

  //clear service task selection:
  localWorkOrderLineItem.value = {} as Partial<LineItem>
};

const getLaborRate = (userId: any) => {
  return technicians.value.find(technician => technician.user_id == userId)?.hourly_labour_rate || 0;
}

const addLabor = (user_id: any, serviceTaskId: number = undefined as any) => {
  localWorkOrderLabor.value = JSON.parse(JSON.stringify({} as Partial<Labors>))
  localWorkOrderLabor.value.user_id = user_id
  localWorkOrderLabor.value.rate = getLaborRate(user_id)
  localWorkOrderLabor.value.service_task_id = serviceTaskId
  localWorkOrderLabor.value.hrs = 1 //set default hours to 1
  localWorkOrderPart.value.subtotal = localWorkOrderLabor.value.rate * localWorkOrderLabor.value.hrs

  isEditingLabor.value = false
  showAddLabor.value = true
  editLaborIndex.value = -1
};

const editLabor = (labor: Labors, laborIndex: number) => {
  localWorkOrderLabor.value = JSON.parse(JSON.stringify(labor))
  isEditingLabor.value = true
  showAddLabor.value = true
  editLaborIndex.value = laborIndex
}

const getUnitCost = (partId: any) => {
  return partSupplies.value?.find((part: Parts) => (part.id as number) == partId)?.unit_cost || 0.00
}

const addPart = (partId: any, serviceTaskId: number = undefined as any) => {
  localWorkOrderPart.value = JSON.parse(JSON.stringify({} as Partial<Parts>))
  localWorkOrderPart.value.service_task_id = serviceTaskId
  localWorkOrderPart.value.part_id = partId
  localWorkOrderPart.value.unit_cost = getUnitCost(partId)
  localWorkOrderPart.value.qte = 0 //set default quantity to 0
  localWorkOrderPart.value.subtotal = 0.00
  isEditingPart.value = false
  showAddPart.value = true
  editPartIndex.value = -1
};

const editPart = (part: Parts, partIndex: number) => {
  localWorkOrderPart.value = JSON.parse(JSON.stringify(part))
  isEditingPart.value = true
  showAddPart.value = true
  editPartIndex.value = partIndex
}

const getPartNumber = (partId: number) => {
  return partSupplies.value?.find(part => part.id == partId)?.part_number
}

const calculateSubtotalLabor = (item: any) => {
  const time = item.hrs
  const cost = item.rate
  let total = 0

  if (!isNaN(time) && !isNaN(cost)) {
    total = parseFloat((time * cost).toFixed(2))
    item.subtotal = total
    localWorkOrderLineItem.value.labor_cost = total
  } else {
    item.subtotal = 0;
  }
};

const calculateSubtotalPart = (item: any) => {
  const quantity = item.qte
  const cost = item.unit_cost

  if (!isNaN(quantity) && !isNaN(cost)) {
    item.subtotal = quantity * cost
    localWorkOrderLineItem.value.part_cost = parseFloat((quantity * cost).toFixed(2))
  } else {
    item.subtotal = 0;
  }
};


const calculateAllPartsSubtotal = () => {
  const payload = localWorkOrder.value.line_items?.reduce((total, lineItem) => total + lineItem.part_cost, 0) || 0.00
  localWorkOrder.value.parts_subtotal = parseFloat(payload.toFixed(2))
}

const calculateAllLaborSubtotal = () => {
  const payload = localWorkOrder.value.line_items?.reduce((total, lineItem) => total + lineItem.labor_cost, 0) || 0.00;
  localWorkOrder.value.labor_subtotal = parseFloat(payload.toFixed(2))
}

const calculateAllSubtotal = () => {
  const payload = localWorkOrder.value.line_items?.reduce((total, lineItem) => total + lineItem.subtotal, 0) || 0.00;
  localWorkOrder.value.subtotal = parseFloat(payload.toFixed(2))
}

const calculateWarranty = () => {
  switch (localWorkOrder.value.warranty_credits_type) {
    case 'percentage':
      let payload = ((localWorkOrder.value.warranty_credits_amount || 0) * (localWorkOrder.value.subtotal || 0)) / 100;
      localWorkOrder.value.warranty_credits = parseFloat(payload.toFixed(2))
      break;
    case 'fixed':
      localWorkOrder.value.warranty_credits = localWorkOrder.value.warranty_credits_amount || 0
      break;
  }
}

const calculateDiscount = () => {
  switch (localWorkOrder.value.discount_type) {
    case 'percentage':
      let payload = ((localWorkOrder.value.discount_amount || 0) * (localWorkOrder.value.subtotal || 0)) / 100;
      localWorkOrder.value.discount = parseFloat(payload.toFixed(2))
      break;
    case 'fixed':
      localWorkOrder.value.discount = localWorkOrder.value.discount_amount || 0
      break;
  }
}

const calculateTax = () => {
  switch (localWorkOrder.value.tax_type) {
    case 'percentage':
      //formula: tax = subtotal - discount - warranty_credits
      let payload = ((localWorkOrder.value.tax_amount || 0) * ((localWorkOrder.value.subtotal || 0) - (localWorkOrder.value.discount || 0) - (localWorkOrder.value.warranty_credits || 0))) / 100;
      localWorkOrder.value.tax = parseFloat(payload.toFixed(2))
      break;
    case 'fixed':
      localWorkOrder.value.tax = localWorkOrder.value.tax_amount || 0
      break;
  }
}

const calculateWorkOrderCost = () => {
  let payload = (localWorkOrder.value.subtotal || 0) - (localWorkOrder.value.tax || 0) - (localWorkOrder.value.discount || 0)
  localWorkOrder.value.total_cost = parseFloat(payload.toFixed(2))
}


const onDeleteLineItem = () => {
  calculateAllPartsSubtotal()
  calculateAllLaborSubtotal()
  calculateAllSubtotal()
  calculateWarranty()
  calculateDiscount()
  calculateTax()
  calculateWorkOrderCost()
}

const onPartItemInput = (lineItem: LineItem) => {
  lineItem.part_cost = lineItem.parts.reduce((total: number, item: Parts) => total + item.subtotal, 0);
  lineItem.part_cost = parseFloat(lineItem.part_cost.toFixed(2))
  if (!lineItem.labor_cost) lineItem.labor_cost = 0
  lineItem.subtotal = parseFloat((lineItem.part_cost + lineItem.labor_cost).toFixed(2))
  calculateAllPartsSubtotal()
  calculateAllSubtotal()
  calculateWarranty()
  calculateDiscount()
  calculateTax()
  calculateWorkOrderCost()
}

const onLaborItemInput = (lineItem: LineItem) => {
  lineItem.labor_cost = lineItem.labor.reduce((total: number, item: Labors) => total + item.subtotal, 0);
  lineItem.labor_cost = parseFloat(lineItem.labor_cost.toFixed(2))
  if (!lineItem.part_cost) lineItem.part_cost = 0
  lineItem.subtotal = parseFloat((lineItem.part_cost + lineItem.labor_cost).toFixed(2))
  calculateAllLaborSubtotal()
  calculateAllSubtotal()
  calculateWarranty()
  calculateDiscount()
  calculateTax()
  calculateWorkOrderCost()
}


const onDiscountInput = () => {
  calculateDiscount()
  calculateTax()
  calculateWorkOrderCost()
}

const onWarrantyCreditInput = () => {
  calculateWarranty()
  calculateTax()
  calculateWorkOrderCost()
}

const onTaxInput = () => {
  calculateTax()
  calculateWorkOrderCost()
}

const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value);
};

const closeDialog = () => {
  emit('update:modelValue', false);
  emit('close');
};

const getSelectedPartLocations = (selectedPart: string) => {
  return partSupplies.value.find(part => part.part_number == selectedPart)?.locations || []
}


const saveLabor = (Labor: Labors) => {
  if (!localWorkOrder.value.line_items) {
    localWorkOrder.value.line_items = [];
  }

  const laborItem = Labor//{ ...localWorkOrderLabor.value };

  const lineItemIndex = localWorkOrder.value.line_items.findIndex(
    task => task.service_task_id === laborItem.service_task_id
  );

  if (lineItemIndex !== -1) {
    if (!localWorkOrder.value.line_items[lineItemIndex].labor) {
      localWorkOrder.value.line_items[lineItemIndex].labor = [];
    }
    localWorkOrder.value.line_items[lineItemIndex].labor.push(laborItem as Labors);
    localWorkOrder.value.line_items[lineItemIndex].labor_cost = calculateTotalCost(localWorkOrder.value.line_items[lineItemIndex].labor);
    localWorkOrder.value.line_items[lineItemIndex].subtotal = calculateGeneralSubtotal(localWorkOrder.value.line_items[lineItemIndex].labor_cost, localWorkOrder.value.line_items[lineItemIndex].part_cost);

    //update cost summary
    let currentLineItem = localWorkOrder.value.line_items[lineItemIndex]
    onLaborItemInput(currentLineItem)
  }
  // adding new labor item and new service task
  else {
    const newTask = {
      service_task_id: laborItem.service_task_id,
      labor_cost: laborItem.subtotal,
      subtotal: laborItem.subtotal,
      labor: [laborItem as Labors],
    };
    localWorkOrder.value.line_items.push(newTask as any);

    //update cost summary
    let currentLineItem = localWorkOrder.value.line_items[localWorkOrder.value.line_items.length - 1]
    onLaborItemInput(currentLineItem)
  }

  localWorkOrderLabor.value = JSON.parse(JSON.stringify({} as Partial<Labors>))
  showAddLabor.value = false;
  isEditingLabor.value = false;
  editLaborIndex.value = -1
};

const saveLaborUpdate = (Labor: Labors) => {
  if (!localWorkOrder.value.line_items) {
    localWorkOrder.value.line_items = [];
  }

  const laborItem = Labor

  const lineItemIndex = localWorkOrder.value.line_items?.findIndex(
    task => task.service_task_id === laborItem.service_task_id
  );

  if (lineItemIndex !== -1) {
    if (!localWorkOrder.value.line_items[lineItemIndex].labor) {
      localWorkOrder.value.line_items[lineItemIndex].labor = [];
    }
    localWorkOrder.value.line_items[lineItemIndex].labor[editLaborIndex.value] = laborItem
    localWorkOrder.value.line_items[lineItemIndex].labor_cost = calculateTotalCost(localWorkOrder.value.line_items[lineItemIndex].labor);
    localWorkOrder.value.line_items[lineItemIndex].subtotal = calculateGeneralSubtotal(localWorkOrder.value.line_items[lineItemIndex].labor_cost, localWorkOrder.value.line_items[lineItemIndex].part_cost);

    //update cost summary
    let currentLineItem = localWorkOrder.value.line_items[lineItemIndex]
    onLaborItemInput(currentLineItem)
  }

  localWorkOrderLabor.value = JSON.parse(JSON.stringify({} as Partial<Labors>))
  showAddLabor.value = false;
  isEditingLabor.value = false;
  editLaborIndex.value = -1
};


const areObjectsEqual = (obj1: any, obj2: any): boolean => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }

  return true;
}

const deleteLaborItem = async (laborItem: Labors) => {
  nextTick(() => {
    localWorkOrderLabor.value = JSON.parse(JSON.stringify({} as Partial<Labors>))
    showAddLabor.value = false;
    isEditingLabor.value = false;
    editLaborIndex.value = -1
  })

  const { confirm, cancel } = await layoutStore.showConfirmDialog("Are you sure you want to permanently delete this line item?")

  let lineItems = localWorkOrder.value.line_items

  if (confirm && lineItems?.length) {

    const lineItemIndex = lineItems.findIndex(
      task => task.service_task_id === laborItem.service_task_id
    );

    if (lineItemIndex > -1) {

      const laborItemIndex = lineItems[lineItemIndex]?.labor?.findIndex(
        (item: Labors) => areObjectsEqual(item, laborItem)
      )

      if (laborItemIndex > -1) {
        lineItems[lineItemIndex]?.labor?.splice(laborItemIndex, 1)
      }

      //update cost summary
      let currentLineItem = lineItems[lineItemIndex]
      onLaborItemInput(currentLineItem)
    }
  }
}

const savePart = (Part: Parts) => {
  if (!localWorkOrder.value.line_items) {
    localWorkOrder.value.line_items = [];
  }

  const partItem = Part //{ ...localWorkOrderPart.value };

  const lineItemIndex = localWorkOrder.value.line_items.findIndex(
    task => task.service_task_id === partItem.service_task_id
  );

  // creating new part
  if (lineItemIndex !== -1) {
    if (!localWorkOrder.value.line_items[lineItemIndex].parts) {
      localWorkOrder.value.line_items[lineItemIndex].parts = [];
    }
    localWorkOrder.value.line_items[lineItemIndex].parts.push(partItem as Parts);
    localWorkOrder.value.line_items[lineItemIndex].part_cost = calculateTotalCost(localWorkOrder.value.line_items[lineItemIndex].parts);

    //update cost summary
    let currentLineItem = localWorkOrder.value.line_items[lineItemIndex]
    onPartItemInput(currentLineItem)

  } else {
    const newTask = {
      // ...localWorkOrder.value.line_items,
      service_task_id: partItem.service_task_id,
      part_cost: partItem.subtotal,
      subtotal: partItem.subtotal,
      parts: [partItem as Parts],
    };
    localWorkOrder.value.line_items.push(newTask as any);

    //update cost summary
    let currentLineItem = localWorkOrder.value.line_items[localWorkOrder.value.line_items.length - 1]
    onPartItemInput(currentLineItem)
  }


  localWorkOrderPart.value = JSON.parse(JSON.stringify({} as Partial<Parts>))
  showAddPart.value = false;
  isEditingPart.value = false;
  editPartIndex.value = -1
};

const deletePartItem = async (partItem: Parts) => {
  nextTick(() => {
    localWorkOrderPart.value = JSON.parse(JSON.stringify({} as Partial<Parts>))
    showAddPart.value = false;
    isEditingPart.value = false;
    editPartIndex.value = -1
  })

  const { confirm, cancel } = await layoutStore.showConfirmDialog("Are you sure you want to permanently delete this line item?")

  let lineItems = localWorkOrder.value.line_items

  if (confirm && lineItems?.length) {

    const lineItemIndex = lineItems.findIndex(
      task => task.service_task_id === partItem.service_task_id
    );

    if (lineItemIndex > -1) {

      const laborItemIndex = lineItems[lineItemIndex]?.parts?.findIndex(
        (item: Parts) => areObjectsEqual(item, partItem)
      )

      if (laborItemIndex > -1) {
        lineItems[lineItemIndex]?.parts?.splice(laborItemIndex, 1)
      }

      //update cost summary
      let currentLineItem = lineItems[lineItemIndex]
      onPartItemInput(currentLineItem)
    }
  }
}

const savePartUpdate = (Part: Parts) => {
  if (!localWorkOrder.value.line_items) {
    localWorkOrder.value.line_items = [];
  }

  const partItem = Part
  const lineItemIndex = localWorkOrder.value.line_items.findIndex(
    task => task.service_task_id === partItem.service_task_id
  );

  if (lineItemIndex !== -1) {
    localWorkOrder.value.line_items[lineItemIndex].parts[editPartIndex.value] = partItem
    localWorkOrder.value.line_items[lineItemIndex].part_cost = calculateTotalCost(localWorkOrder.value.line_items[lineItemIndex].parts);

    //update cost summary
    let currentLineItem = localWorkOrder.value.line_items[lineItemIndex]
    onPartItemInput(currentLineItem)
  }

  localWorkOrderPart.value = JSON.parse(JSON.stringify({} as Partial<Parts>))
  showAddPart.value = false;
  isEditingPart.value = false;
  editPartIndex.value = -1
};

const calculateTotalCost = (items: Array<{ subtotal: any }>) => {
  return parseFloat(items.reduce((total, item) => {
    return total + item.subtotal;
  }, 0).toFixed(2))
};

const calculateGeneralSubtotal = (laborCost: number, partCost: number) => {
  return parseFloat((laborCost + partCost).toFixed(2))
};

const saveWorkOrder = async () => {
  // validate first window
  let validForm1 = await validateForm1()
  if (!validForm1) {
    step.value = 1
    return;
  }

  // validate second window
  let validForm2 = await validateForm2()
  if (!validForm2) {
    return
  }

  let payload = JSON.parse(JSON.stringify({ ...localWorkOrder.value, custom_fields: localWorkOrderCustomField.value }))


  emit('save', payload);
  emit('update:modelValue', false);
  emit('close');
};



// const updateTimeLog = async (data: any) => {
//   if (!localWorkOrder.value?.id) {
//     return
//   }
//   let payload = data
//   payload.id = localWorkOrder.value.id
//   await workOrderStore.updateWorkOrder(payload)
// }

// onMounted(() => {
//   assetStore.fetchAssets();
//   techniciansStore.fetchTechnicians();
//   serviceTaskStore.fetchServiceTasks()
// })

const getWorkOrder = computed(() => {
  return localWorkOrder.value
})

const getVehicleName = (vehiclename: any) => {
  const vehicleName = assetList.value.find((vehicle) => vehicle.name === vehiclename)
  return vehicleName ? vehicleName.name : ''
}

watch(() => props.modelValue, (newValue) => {
  if (router.currentRoute.value.path === '/maintenance/IssuesManagement') {
    localWorkOrder.value.vehicle_id = parseInt(getVehicleName(props.vehicleId) as string)
  }
})

</script>

<style scoped>
.title {
  font-weight: bold;
  color: #1984c5;
}

.trigger-btn {
  transition: transform 0.3s ease;
}

.trigger-btn.rotated {
  transform: rotate(90deg);
}

.service-task-column {
  width: 40%;
}

.service-task-head {
  width: 20%;
}

.icon-container {
  position: relative;
  display: inline-block;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background-color: transparent;
  transition: background-color 0.3s ease;
}

.icon-container:hover .overlay {
  background-color: rgba(0, 0, 0, 0.1);
}

.progress-bar-container {
  width: 100%;
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 4px;
  margin-top: 10px;
}

.progress-bar {
  height: 100%;
  background-color: #4caf50;
  border-radius: 4px;
  transition: width 0.3s ease-in-out;
}
</style>