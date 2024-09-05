<template>
  <v-dialog :model-value="modelValue" @update:model-value="updateModelValue" fullscreen scrollable>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>Issue #{{ issue.id }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text style="" class="pa-0">
        <div class="d-flex" style="height: calc(100vh - (48px + 60px))">
          <div class="flex-grow-1" style="overflow-y: auto;">
            <v-row no-gutters>
              <v-col :cols="showSidePanel ? 12 : 6" class="pa-3">
                <v-card>
                  <v-card-title class="font-weight-bold text-primary"> Details</v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="6">Issue </v-col>
                      <v-col cols="12" md="6">#{{ issue.id }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Status</v-col>
                      <v-col cols="12" md="6">
                        <v-chip class="text-capitalize"  v-if="typeof issue.status === 'string' && (issue.status !== '1' && issue.status !== '0')" density="compact" variant="flat"
                          :color="getStatusColor(issue.status as string)">{{ issue.status }}
                        </v-chip>
                        <span v-else></span>
                      </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Vehicle</v-col>
                      <v-col cols="12" md="6" class="text-secondary">
                        <v-menu location="bottom" max-height="400px" width="350px" location-strategy="connected"
                          :close-on-content-click="true" class="rounded" open-on-hover>
                          <template v-slot:activator="{ props }">
                            <div class="d-flex">
                              <div class="rounded position-relative"
                                style="display: flex; justify-content: center; align-items: center; width: 28px; height: 28px; background-color: grey; color: white; text-align: center; position: relative;">
                                <span style="font-size:xx-small;" v-if="getVehicleName(issue.asset_name)?.type">{{
                                  getVehicleName(issue.asset_name)?.type.slice(0, 3).toUpperCase() }}</span>
                                <span v-else style="font-size:xx-small;">VHI</span>
                                <div v-if="getVehicleName(issue.asset_name)?.status"
                                  :class="`${'bg-' + getVehicleStatusColor(getVehicleName(issue.asset_name)?.status)}`"
                                  style="width: 10px; height: 10px; position: absolute; bottom: -2px; right: -2px; border-radius: 50%;">
                                </div>
                              </div>
                              <span class="ml-2">
                                <span v-bind="props" style="cursor: pointer; border-bottom: 1px dotted;">{{
                                  issue.asset_name }}</span>
                              </span>
                            </div>
                          </template>

                          <v-row no-gutters>
                            <v-col cols="12">
                              <v-card class="rounded-lg">
                                <v-card-text>
                                  <div class="mb-3">
                                    <div class="d-flex mb-2"  style="align-items: center;">
                                      <div>
                                        <div class="rounded position-relative"
                                          style="display: flex; justify-content: center; align-items: center; width: 45px; height: 45px; background-color: grey; color: white; text-align: center; position: relative;">
                                          <span style="font-size: large;">{{
                                            getVehicleName(issue.asset_name)?.type.slice(0, 3).toUpperCase() }}</span>
                                        </div>
                                      </div>
                                      <div class="ml-2">
                                        <span class="text-secondary" v-bind="props"
                                          style="cursor: pointer; border-bottom: 1px dotted;">
                                          {{ issue.asset_name }}
                                        </span>
                                      </div>
                                    </div>
                                    <v-row>
                                      <v-col cols="12" md="6">Status</v-col>
                                      <v-col cols="12" md="6" v-if="getVehicleName(issue.asset_name)?.status">
                                        <v-chip density="compact"
                                          :color="getVehicleStatusColor(getVehicleName(issue.asset_name)?.status)">
                                          {{ getVehicleName(issue.asset_name)?.status }}
                                        </v-chip>
                                      </v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">Operator</v-col>
                                      <v-col cols="12" md="6">{{ getVehicleName(issue.asset_name)?.odometer }}</v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">Type</v-col>
                                      <v-col cols="12" md="6">{{ getVehicleName(issue.asset_name)?.type }}</v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">Year Make Model</v-col>
                                      <v-col cols="12" md="6">
                                        {{ getVehicleName(issue.asset_name)?.year }}
                                        {{ getVehicleName(issue.asset_name)?.make }}
                                        {{ getVehicleName(issue.asset_name)?.model }}
                                      </v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">Group</v-col>
                                      <v-col cols="12" md="6" v-if="getVehicleName(issue.asset_name)?.dimensions">{{
                                        getVehicleName(issue.asset_name)?.dimensions.ground_clearance }}</v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">VIN/SN</v-col>
                                      <v-col cols="12" md="6">{{ getVehicleName(issue.asset_name)?.vin }}</v-col>
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
                      <v-col cols="12" md="6">Summary</v-col>
                      <v-col cols="12" md="6">{{ issue.summary }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Reported Date</v-col>
                      <v-col cols="12" md="6">
                      <span style="cursor: pointer; border-bottom: 1px dotted; font-size: small">
                        {{formatReportedDate(issue.reported_date)}}
                        <v-tooltip activator="parent" location="top" location-strategy="connected">
                          {{ getRelativeDateTime(issue.reported_date) }}
                        </v-tooltip>
                      </span>
                    </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Reported By</v-col>
                      <v-col cols="12" md="6">
                        <v-menu v-if="issue.reported_by" 
                          location="bottom" max-height="400px" width="350px" location-strategy="connected"
                          :close-on-content-click="true" class="rounded" open-on-hover>
                          <template v-slot:activator="{ props }">
                            <v-chip variant="text" :prepend-avatar="getAvatarIcon(getTechnicianName(issue.reported_by)?.full_name)">
                              <span v-bind="props" class="text-secondary" style="cursor: pointer; border-bottom: 1px dotted;">{{ getTechnicianName(issue.reported_by)?.full_name ?
                                getTechnicianName(issue.reported_by)?.full_name : 'N/A' }}</span>
                            </v-chip>
                            <br>
                          </template>
                          <v-row no-gutters>
                            <v-col cols="12">
                              <v-card class="rounded-lg">
                                <v-card-text>
                                  <div class="mb-3">
                                    <v-chip class="mb-4" variant="text" :prepend-avatar="getAvatarIcon(getTechnicianName(issue.reported_by)?.full_name)">
                                      <span v-bind="props" class="text-secondary">{{ getTechnicianName(issue.reported_by)?.full_name ?
                                        getTechnicianName(issue.reported_by)?.full_name : 'N/A' }}</span>
                                    </v-chip>
                                    <v-row>
                                      <v-col cols="12" md="6">Email</v-col>
                                      <v-col cols="12" md="6" v-if="getTechnicianName(issue.reported_by)?.email">
                                        <span style="font-size: small">{{ getTechnicianName(issue.reported_by)?.email }}</span>
                                        
                                      </v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">Group</v-col>
                                      <v-col cols="12" md="6" v-if="getTechnicianName(issue.reported_by)?.group">
                                        {{ getTechnicianName(issue.reported_by)?.group }}</v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">Classification</v-col>
                                      <v-col cols="12" md="6">{{ getTechnicianName(issue.reported_by)?.classification }}</v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">Phone</v-col>
                                      <v-col cols="12" md="6">{{ getTechnicianName(issue.reported_by)?.mobile_phone }}</v-col>
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
                      <v-col cols="12" md="6">Odometer</v-col>
                      <v-col cols="12" md="6">{{ issue.meter ? issue.meter + issue.meter_unit : "N/A" }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Priority</v-col>
                      <v-col cols="12" md="6"><v-chip density="compact" v-if="issue.priority"
                          :color="getPriorityColor(issue.priority as string)">{{
                            issue.priority
                          }}</v-chip>
                      </v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Source</v-col>
                      <v-col cols="12" md="6">{{ issue.source ? issue.source : "N/A" }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Assigned To</v-col>
                      <v-col cols="12" md="6">
                        <v-menu v-for="(technicianId, index) in issue.assigned_to" :key="index" v-if="issue.assigned_to" 
                          location="bottom" max-height="400px" width="350px" location-strategy="connected"
                          :close-on-content-click="true" class="rounded" open-on-hover>
                          <template v-slot:activator="{ props }">
                            <v-chip variant="text" :prepend-avatar="getAvatarIcon(getTechnicianName(technicianId)?.full_name)">
                              <span v-bind="props" class="text-secondary" style="cursor: pointer; border-bottom: 1px dotted;">{{ getTechnicianName(technicianId)?.full_name ?
                                getTechnicianName(technicianId)?.full_name : 'N/A' }}</span>
                            </v-chip>
                            <br>
                          </template>
                          <v-row no-gutters>
                            <v-col cols="12">
                              <v-card class="rounded-lg">
                                <v-card-text>
                                  <div class="mb-3">
                                    <v-chip class="mb-4" variant="text" :prepend-avatar="getAvatarIcon(getTechnicianName(technicianId)?.full_name)">
                                      <span v-bind="props" class="text-secondary">{{ getTechnicianName(technicianId)?.full_name ?
                                        getTechnicianName(technicianId)?.full_name : 'N/A' }}</span>
                                    </v-chip>
                                    <v-row>
                                      <v-col cols="12" md="6">Email</v-col>
                                      <v-col cols="12" md="6" v-if="getTechnicianName(technicianId)?.email">
                                        <span style="font-size: small">{{ getTechnicianName(technicianId)?.email }}</span>
                                        
                                      </v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">Group</v-col>
                                      <v-col cols="12" md="6" v-if="getTechnicianName(technicianId)?.group">
                                        {{ getTechnicianName(technicianId)?.group }}</v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">Classification</v-col>
                                      <v-col cols="12" md="6">{{ getTechnicianName(technicianId)?.classification }}</v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">Phone</v-col>
                                      <v-col cols="12" md="6">{{ getTechnicianName(technicianId)?.mobile_phone }}</v-col>
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
                      <v-col cols="12" md="6">Due Date</v-col>
                      <v-col cols="12" md="6">{{ issue.due_date ? issue.due_date : "N/A" }}</v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="6">Due Odometer</v-col>
                      <v-col cols="12" md="6">{{ issue.due_meter ? issue.due_meter + '/' + issue.due_meter_unit :
                        'N/A' }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Decription</v-col>
                      <v-col cols="12" md="6">{{ issue.description ? issue.description : 'N/A' }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Watchers</v-col>
                      <v-col cols="12" md="6">
                        <v-menu location="bottom" max-height="310px" width="320px" location-strategy="connected"
                          :close-on-content-click="true" class="rounded" open-on-hover>
                          <template v-slot:activator="{ props }">
                            <div v-for="(watcherId, index) in issue.watchers" :key="index" v-if="issue.watchers">
                              <v-chip variant="text" :prepend-avatar="getAvatarIcon(getTechnicianName(watcherId)?.full_name)">
                                <span v-bind="props" class="text-secondary" style="cursor: pointer; border-bottom: 1px dotted;">{{ getTechnicianName(watcherId)?.full_name ?
                                  getTechnicianName(watcherId)?.full_name : 'N/A' }}</span>
                              </v-chip>
                              <br>
                            </div>
                          </template>
                          <v-row no-gutters>
                            <v-col cols="12">
                              <v-card class="rounded-lg">
                                <v-card-text>
                                  <div class="mb-3" v-for="(watcherId, index) in issue.watchers" :key="index" v-if="issue.watchers">
                                    <v-chip class="mb-4" variant="text" :prepend-avatar="getAvatarIcon(getTechnicianName(watcherId)?.full_name)">
                                      <span v-bind="props" class="text-secondary">{{ getTechnicianName(watcherId)?.full_name ?
                                        getTechnicianName(watcherId)?.full_name : 'N/A' }}</span>
                                    </v-chip>
                                    <v-row>
                                      <v-col cols="12" md="6">Email</v-col>
                                      <v-col cols="12" md="6" v-if="getTechnicianName(watcherId)?.email">
                                        <span style="font-size: small">{{ getTechnicianName(watcherId)?.email }}</span>
                                        
                                      </v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">Group</v-col>
                                      <v-col cols="12" md="6" v-if="getTechnicianName(watcherId)?.group">
                                        {{ getTechnicianName(watcherId)?.group }}</v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">Classification</v-col>
                                      <v-col cols="12" md="6">{{ getTechnicianName(watcherId)?.classification }}</v-col>
                                    </v-row>
                                    <v-divider class="my-2"></v-divider>
                                    <v-row>
                                      <v-col cols="12" md="6">Phone</v-col>
                                      <v-col cols="12" md="6">{{ getTechnicianName(watcherId)?.mobile_phone }}</v-col>
                                    </v-row>
                                  </div>
                                </v-card-text>
                              </v-card>
                            </v-col>
                          </v-row>
                        </v-menu>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col :cols="showSidePanel ? 12 : 6" class="pa-3">
                <v-card>
                  <v-card-title class="d-flex justify-space-between">
                    <span class="text-h7 font-weight-bold text-primary">Resolution Details</span>
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="6">Resolved Date</v-col>
                      <v-col cols="12" md="6">{{ issue.resolved_on ? issue.resolved_on : 'N/A' }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Resolved By</v-col>
                      <v-col cols="12" md="6">{{ issue.resolved_by ? issue.resolved_by : 'N/A' }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Note</v-col>
                      <v-col cols="12" md="6">N/A</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Time to Resolve</v-col>
                      <v-col cols="12" md="6">{{ issue.due_date ? issue.due_date : 'N/A' }}</v-col>
                    </v-row>
                    <v-divider class="my-3"></v-divider>
                    <v-row>
                      <v-col cols="12" md="6">Miles to Resolve</v-col>
                      <v-col cols="12" md="6">
                        {{ issue.resolved_meter_variance ? issue.resolved_meter_variance + '/'
                          + issue.resolved_meter_variance_unit : 'N/A' }}
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
                <v-card class="mt-3">
                  <v-card-title class="text-h7 font-weight-bold text-primary">Timeline</v-card-title>
                  <v-card-text>
                    <v-timeline class="custom-timeline" density="compact" side="end">
                      <v-timeline-item class="mb-12" dot-color="grey" size="large" fill-dot>
                        <template v-slot:icon>
                          <span>JL</span>
                        </template>
                        <span class="font-weight-bold mr-2">James New</span><span class="text-caption">added this issue
                          to a work order</span>
                        <div class="text-primary mt-2">Work Order #12345</div>
                      </v-timeline-item>


                      <v-timeline-item class="mb-12" dot-color="#e69120" size="small" fill-dot>
                        <template v-slot:icon>
                          <v-icon size="small">mdi-alert-outline</v-icon>
                        </template>
                        <div class="d-flex justify-space-between fill-width">
                          <span class="flex-grow-1">
                            <span class="font-weight-bold mr-2">Issue Opened</span><span class="text-caption">by Samara
                              DVIR</span>
                          </span>
                          <span class="text-caption">29d</span>
                        </div>
                      </v-timeline-item>
                    </v-timeline>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </div>
          <v-expand-x-transition>
            <div v-if="showSidePanel" style="height: calc(100vh - (48px + 60px));width:400px">
              <!-- Side Pannel Window Items -->
              <v-window v-model="currentStep" style="height: calc(100vh - (48px + 60px));">
                <!-- Message Window -->
                <v-window-item :value="1"
                  style="position:relative;overflow-y:auto;height: calc(100vh - (48px + 60px));">
                  <v-sheet flat class="d-flex flex-column fill-height">
                    <v-card-title>Comments</v-card-title>
                    <div class="flex-grow-1">
                      <div v-if="issue.comments">
                        <v-list>
                          <v-list-item v-for="(comment, index) in issue.comments" :key="index">
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
                      </div>
                      <div v-else class="text-center">No Comments Yet</div>
                    </div>
                    <div style="position:sticky; bottom: 0;" class="px-2">
                      <v-text-field v-model="newComment" @keydown.enter="saveComment" variant="outlined" placeholder="Add Comment"></v-text-field>
                    </div>
                  </v-sheet>
                </v-window-item>

                <!-- Photo Window -->
                <v-window-item :value="2"
                  style="position:relative;overflow-y:auto;height: calc(100vh - (48px + 60px));">
                  <v-sheet flat class="d-flex flex-column fill-height">
                    <v-card-title>Photos <span v-if="issue.photos">({{ issue.photos.length }})</span></v-card-title>
                    <div class="flex-grow-1">
                      <v-list v-if="issue.photos">
                        <!-- <v-list-subheader>New Photos ({{ issue.photos.length }})</v-list-subheader> -->

                        <template v-for="(photo, index) in issue.photos" :key="index">
                          <v-list-item class="d-flex align-items-center">
                            <v-img :src="photo.url" :alt="photo.name" class="mb-2" max-width="200"></v-img>
                            <v-list-item-title>{{ photo.name }}</v-list-item-title>
                            <!-- <v-btn text size="small" color="error" icon="mdi-delete" @click="removeNewPhoto(index)">
                            </v-btn> -->
                          </v-list-item>
                          <v-divider v-if="index + 1 < issue.photos.length"></v-divider>
                        </template>
                      </v-list>
                      <div class="text-center" v-else>No Images Found</div>
                    </div>
                    <div style="position:sticky; bottom: 0;" class="px-2">
                      <!-- <WorkOrderCamera @savephoto="SavePhotos"/> -->

                      <v-btn color="primary" class="mb-1">
                        <v-icon>mdi-plus</v-icon>
                        <span class="ml-2" style="cursor: pointer;" @click="addPhoto">Add Photos</span>
                      </v-btn>

                      <input ref="fileInput" type="file" multiple accept="image/*" @change="storeNewPhoto"
                        style="display: none;" />
                    </div>
                  </v-sheet>
                </v-window-item>

                <!-- Document Window -->
                <v-window-item :value="3"
                  style="position:relative;overflow-y:auto;height: calc(100vh - (48px + 60px));">
                  <v-sheet flat class="d-flex flex-column fill-height">
                    <v-card-title>Documents</v-card-title>
                    <div class="flex-grow-1">
                      <v-list v-if="issue.documents">
                        <v-list-subheader v-if="issue.documents.length > 0">New Documents ({{ issue.documents.length }})</v-list-subheader>

                        <template v-for="(document, index) in issue.documents" :key="index">
                          <v-list-item>
                            <v-list-item-title>
                              <a :href="document.url" target="_blank">{{ document.name }}</a>
                            </v-list-item-title>
                            <template v-slot:append>
                              <v-btn text size="small" color="error" icon="mdi-delete" @click="removeNewDocument(index)">
                              </v-btn>
                            </template>
                          </v-list-item>
                          <v-divider v-if="index + 1 < issue.documents.length"></v-divider>
                        </template>
                      </v-list>
                      <div v-else class="text-center">No Documents</div>
                    </div>
                    <div style="position:sticky; bottom: 0;" class="px-2">
                      <v-card-text>
                        <v-btn color="primary" class="mb-1" @click="addDocument">
                          <v-icon>mdi-plus</v-icon>
                          <span class="ml-2" style="cursor: pointer;">Add Documents</span>
                        </v-btn>

                        <input ref="documentfile" type="file" multiple accept="application/pdf, application/msword, application/vnd.ms-excel" @change="storeNewDocument" style="display: none;" />
                      </v-card-text>
                    </div>
                  </v-sheet>
                </v-window-item>
              </v-window>
            </div>
          </v-expand-x-transition>
          <v-sheet id="side-panel">
            <div class="d-flex flex-column">

              <!-- Toggle Show/Hide Side Bar -->
              <v-tooltip :text="showSidePanel ? 'Close Sidebar' : 'Open Sidebar'">
                <template v-slot:activator="{ props }">
                  <v-sheet v-bind="props" @click="toggleButtonPress"
                    class="d-flex justify-center align-center side-button">
                    <v-icon size="x-small">{{ showSidePanel ? 'mdi-arrow-expand-right' :
                      'mdi-arrow-expand-left' }}</v-icon>
                  </v-sheet>
                </template>
              </v-tooltip>

              <!-- Toggle Show Comments -->
              <v-tooltip text="Comments">
                <template v-slot:activator="{ props }">
                  <v-sheet @click="toggleSidePanel(1)" :color="currentStep == 1 ? 'primary' : ''" v-bind="props"
                    class="d-flex justify-center align-center side-button" style="height:50px">
                    <v-icon size="x-small">mdi-message-text</v-icon>
                  </v-sheet>
                </template>
              </v-tooltip>

              <v-tooltip text="Photos">
                <template v-slot:activator="{ props }">
                  <v-sheet @click="toggleSidePanel(2)" :color="currentStep == 2 ? 'primary' : ''" v-bind="props"
                    class="d-flex justify-center align-center side-button" style="height:50px">
                    <v-icon size="x-small">mdi-image</v-icon>
                  </v-sheet>

                </template>
              </v-tooltip>

              <v-tooltip text="Documents">
                <template v-slot:activator="{ props }">
                  <v-sheet @click="toggleSidePanel(3)" :color="currentStep == 3 ? 'primary' : ''" v-bind="props"
                    class="d-flex justify-center align-center side-button" style="height:50px">
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
        <v-btn v-if="(issue.status||'').toLowerCase()  !== 'resolved'" color="primary" @click="resolveIssue">Resolve Issue</v-btn>
        <v-btn color="primary" @click="createWork()">Create Work Order</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveFIle(issue.id as number)">Save File</v-btn>
        <v-btn color="primary" @click="close">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { Issues, ActivityLog } from '@/types/maintenance/issue';
import { useRouter } from 'vue-router';
import WorkOrderCamera from '@/components/maintenance/management/workOrder/components/WorkOrderCamera.vue';

const router = useRouter();

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  issue: {
    type: Object as PropType<Issues>,
    required: true,
    default: {} as Issues
  },
  vehicleId: {
    type: Number,
    required: true,
  },
});

const authStore = useAuthStore()

const showSidePanel = ref(false)
const currentStep = ref(0)
const lastStep = ref(0)

const emit = defineEmits(['update:modelValue', 'save']);

const showAddEntryDialog = ref(false);

const toggleButtonPress = () => {
  if (!showSidePanel) {
    currentStep.value = lastStep.value == 0 ? 1 : lastStep.value
  }
  else {
    lastStep.value = currentStep.value
    currentStep.value = 0
  }

  showSidePanel.value = !showSidePanel.value
}

const toggleSidePanel = (stepVal: number) => {
  // clicking on active button should close it
  if (currentStep.value == stepVal && showSidePanel.value) {
    lastStep.value = stepVal
    currentStep.value = 0
    showSidePanel.value = false
  }

  // clicking on another side panel button
  else {

    // if pannel was previously closed
    if (currentStep.value == 0) {
      lastStep.value = stepVal
    }
    lastStep.value = currentStep.value
    currentStep.value = stepVal
    showSidePanel.value = true
  }
}
const close = () => {
  emit('update:modelValue', false);
};

const updateModelValue = (value: boolean) => {
  emit('update:modelValue', value);
};
const issueStore = useIssueStore();

const assetStore = useAssetStore();
const { assetList } = storeToRefs(assetStore);

// const techniciansStore = useTechniciansStore();
// const technicians = computed(() => techniciansStore.technicians);
const employeeStore = useEmployeeStore();
const technicians = computed(() => employeeStore.getTechnicianList)

const getTechnicianName = (technicianId: any) => {
  const technicianName = technicians.value.find((technician) => technician.user_id === technicianId)
  return technicianName
}

const getVehicleName = (vehiclename: any) => {
  const vehicleName = assetList.value.find((vehicle) => vehicle.name === vehiclename)
  return vehicleName
}

const getVehicleStatusColor = (status: any) => {
  switch ((status||'').toLowerCase() ) {
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

const getRelativeDateTime = (dateString: any) =>{
  const now = new Date();
  const createdAt = new Date(dateString);
  const diff = now.getTime() - createdAt.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''}, ${months % 12} month${months % 12 > 1 ? 's' : ''} ago`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
  }
}

const localIssueActivityLog = ref<Partial<ActivityLog>>(JSON.parse(JSON.stringify(props.issue.activityLog || {})) as Partial<ActivityLog>)

const convertToWorkOrder = () => {
  // Implement the convert to work order logic
};

const newEntry = ref({
  date: '',
  description: '',
});

const showAddEntry = () => {
  localIssueActivityLog.value = {} as Partial<ActivityLog>;
  showAddEntryDialog.value = true;
};

const saveNewEntry = async () => {

  emit('save', { activityLog: localIssueActivityLog.value });
};

const resolveIssue = async () => {

  props.issue.status = 'resolved'
  emit('save', props.issue);
  close();
}

const createWork = () => {
  router.push({ path: '/maintenance/WorkOrders', query: {
    vehicleName: getVehicleName(props.issue.asset_name)?.name, 
    created_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
    status: 'Open',
    action: 'createWorkOrder'
  }})
}

const getStatusColor = (status: string) => {
  switch ((status || '').toLowerCase()) {
    case 'open':
      return 'primary';
    case 'in progress':
      return 'secondary';
    case 'closed':
      return 'cyan';
    case 'resolved':
      return 'green';
    default:
      return '';
  }
};

const getPriorityColor = (status: string) => {
  switch ((status || '').toLowerCase()) {
    case 'low':
      return 'grey';
    case 'medium':
      return 'orange';
    case 'high':
      return 'error';
    case 'no priority':
      return 'gray';
    default:
      return 'gray';
  }
}

const formatReportedDate = (date: any) => {
  const reportedDate = new Date(date);
  return `${reportedDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })} 
  ${reportedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
}

function getAvatarIcon(label: any) {
  const size = 50;
  const circleSize = 50;

  // Générer les initiales à partir du label
  const words = label.split(' ');
  const initials = words.map((word: any) => word.charAt(0).toUpperCase());

  // Créer un canvas et un contexte 2D
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return '';
  }

  // Générer une couleur unique et légère pour l'avatar
  const colorHash = label.split('').reduce((acc: number, char: string) => ((acc << 5) - acc) + char.charCodeAt(0), 0);
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
  ctx.fillText(initials.slice(0, 2).join(''), size / 2, size / 2);

  return canvas.toDataURL();
}

const auth = useAuthStore()

const comments = ref<{ id: number; text: string; date: string; user: string }[]>([]);
const newComment = ref('');

const saveComment = () => {
  if (newComment.value.trim() !== '') {
    comments.value.push({ id: comments.value.length + 1, text: newComment.value, date: new Date().toLocaleString(), user: (auth.user?.name as string) });
    props.issue.comments = comments.value
    newComment.value = '';
  }
};

const deleteComment = (index: number) => {
  props.issue.comments?.splice(index, 1);
};

const saveFIle = async (issueId: number) => {
  await issueStore.updateIssue({
    id: issueId,
    photos: props.issue.photos,
    documents: props.issue.documents,
    comments: props.issue.comments
  } as any);
  emit('update:modelValue', false);
};

const newPhotos = ref<{ name: string; url: string }[]>([]);

function SavePhotos(photo: { name: string, url: string }) {
  newPhotos.value.push(photo);
  props.issue.photos = newPhotos.value
}

const fileInput = ref<HTMLInputElement | null>(null);

function addPhoto() {
  if(fileInput.value){
     fileInput.value.click();
  }
}

function storeNewPhoto(event: any) {
  const files = event.target.files;

  for (let i = 0; i < files.length; i++) {
    newPhotos.value.push(files[i])
  }

  event.target.value = null;
}

function removePhoto(index: any) {
  props.issue.photos?.splice(index, 1);
}

function removeNewPhoto(index: number) {
  props.issue.photos?.splice(index, 1);
}

const documentfile = ref<HTMLInputElement | null>(null);
const newDocuments = ref<{ name: string, url: string }[]>([]);

function addDocument() {
  documentfile.value?.click();
}

function removeNewDocument(index: number) {
  props.issue.documents?.splice(index, 1);
}

function storeNewDocument(event: Event) {
  const files = (event.target as HTMLInputElement).files;
  if (files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      newDocuments.value.push({ name: file.name, url: url });
      props.issue.documents = newDocuments.value
    }
    (event.target as HTMLInputElement).value = '';
  }
}

watch(props.issue, (newVal, oldVal) => {
  localIssueActivityLog.value = newVal.activityLog || {} as ActivityLog
})

// onMounted(() => {
//   assetStore.fetchAssets()
// })
</script>
<style scoped>
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
</style>