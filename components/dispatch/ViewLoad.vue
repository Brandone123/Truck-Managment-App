<template>
    <v-dialog v-model="dialog" fullscreen scrollable>
        <!-- <template v-slot:activator="{ props }">
            <v-btn color="primary" flat v-bind="props" class="text-none">
                <v-icon>mdi-plus</v-icon>
                Create New Load
            </v-btn>
        </template> -->
        <v-card class="grey-background">
            <v-toolbar color="primary" density="compact">
                <v-toolbar-title>{{ title }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <DispatchLoad />
                <v-btn icon @click="dialog = false" class="ml-5">
                    <v-icon>mdi-window-close</v-icon>
                </v-btn>
            </v-toolbar>
            <div id="mapContainer">

                <!-- map loading overlay -->

                <v-overlay id="loader" :model-value="true" contained class="align-center justify-center">
                    <v-progress-circular :size="70" :width="7" color="primary" indeterminate></v-progress-circular>
                </v-overlay>

                <!-- map container -->
                <div id="map"></div>

                <!-- zoom controls -->
                <div id="zoomControls" style="display:none !important;" class="d-flex flex-column mr-4 mb-4">
                    <v-btn density="compact" id="center">
                        <v-icon>mdi-crosshairs</v-icon>
                    </v-btn>
                    <v-btn density="compact" id="zoomIn" class="my-3">
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                    <v-btn density="compact" id="zoomOut">
                        <v-icon>mdi-minus</v-icon>
                    </v-btn>
                </div>

                <!-- eta display -->
                <span id="etaDisplay" class="etaDisplay text-h4 font-weight-bold mr-4 mt-4"
                    style="display:none !important">
                    ETA: 4hrs 30mins
                </span>

                <!-- load details  -->
                <div id="detailsDisplay" :style="{ width: showDetails ? '50%' : '100px' }"
                    style="height:100%;overflow:auto;" class="ml-4 mt-4">
                    <div class="d-flex justify-space-between" style="z-index:2;position:sticky;top:0px;right:0px;">
                        <v-btn @click="showDetails = !showDetails" density="compact" color="primary"
                            :icon="showDetails ? 'mdi-chevron-left' : 'mdi-chevron-right'"></v-btn>
                    </div>

                    <v-expand-x-transition>
                        <div v-if="showDetails">
                            <v-card class="mb-2">
                                <v-card-text>
                                    <div class="d-flex justify-space-between align-center">
                                        <span class="text-h5 font-weight-bold">Stops</span>
                                        <DispatchAddStop :show="stopDialog" @update:show="updateStopDialog"
                                            :updating="updatingStop" :item="editedStop" />
                                    </div>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-row>
                                                <v-col cols="12" md="4">
                                                    <div class="text-subtitle font-weight-bold">Current Driver</div>
                                                    <v-menu open-on-hover v-model="driverMenu"
                                                        :close-on-content-click="false" location="end">
                                                        <template v-slot:activator="{ props }">
                                                            <v-btn color="primary" variant="text" v-bind="props"
                                                                class="px-0 text-none text-body-1 font-weight-bold">
                                                                {{ loadInfo.current_driver?.name }}
                                                            </v-btn>
                                                        </template>
                                                        <v-card style="width: 400px;">
                                                            <v-card-text>
                                                                <v-row>
                                                                    <v-col cols="12" md="4">
                                                                        <v-avatar size="100">
                                                                            <v-img
                                                                                src="https://cdn.vuetifyjs.com/images/john.jpg"
                                                                                alt="John">
                                                                                <template v-slot:placeholder>
                                                                                    <div
                                                                                        class="d-flex align-center justify-center fill-height">
                                                                                        <v-progress-circular
                                                                                            color="grey-lighten-4"
                                                                                            indeterminate></v-progress-circular>
                                                                                    </div>
                                                                                </template>
                                                                            </v-img>
                                                                        </v-avatar>
                                                                    </v-col>
                                                                    <v-col cols="12" md="8">
                                                                        <div class="d-flex flex-column mt-3">
                                                                            <div class="text-subtitle font-weight-bold">
                                                                                Status
                                                                            </div>
                                                                            <div class="text-body-1 text-success">
                                                                                {{
                                                                                    loadInfo.current_driver?.samsara_status
                                                                                }}
                                                                            </div>
                                                                        </div>
                                                                    </v-col>
                                                                </v-row>
                                                            </v-card-text>
                                                        </v-card>
                                                    </v-menu>
                                                    <div class="text-caption">{{ loadInfo.current_driver?.phone }}</div>
                                                </v-col>
                                                <v-col cols="12" md="4">
                                                    <div class="text-subtitle font-weight-bold">Current Truck</div>
                                                    <v-menu open-on-hover v-model="truckMenu"
                                                        :close-on-content-click="false" location="end">
                                                        <template v-slot:activator="{ props }">
                                                            <v-btn color="primary" variant="text" v-bind="props"
                                                                class="px-0 text-none text-body-1 font-weight-bold">
                                                                {{ loadInfo.current_truck?.name }}
                                                            </v-btn>
                                                        </template>
                                                        <v-card style="width: 500px;">
                                                            <v-card-text>
                                                                <v-row>
                                                                    <v-col cols="12" md="4">
                                                                        <v-img max-width="200"
                                                                            src="https://www.sotrex.com/media/catalog/product/cache/1/thumbnail/225x/17f82f742ffe127f42dca9de82fb58b1/c/n/cn12egj_-_1_1.jpg"
                                                                            alt="John">
                                                                            <template v-slot:placeholder>
                                                                                <div
                                                                                    class="d-flex align-center justify-center fill-height">
                                                                                    <v-progress-circular
                                                                                        color="grey-lighten-4"
                                                                                        indeterminate></v-progress-circular>
                                                                                </div>
                                                                            </template>
                                                                        </v-img>
                                                                    </v-col>
                                                                    <v-col cols="12" md="8">
                                                                        <div class="d-flex flex-column">
                                                                            <p>
                                                                                <span
                                                                                    class="text-subtitle font-weight-bold mr-2">VIN
                                                                                    :</span>
                                                                                <span class="text-subtitle-1"
                                                                                    style="line-height: 1;">{{
                                                                                        loadInfo.current_truck?.vin
                                                                                    }}</span>
                                                                            </p>
                                                                            <p>
                                                                                <span
                                                                                    class="text-subtitle font-weight-bold mr-2">Model:</span>
                                                                                <span class="text-subtitle-1"
                                                                                    style="line-height: 1;">{{
                                                                                        loadInfo.current_truck?.model
                                                                                    }}</span>
                                                                            </p>
                                                                            <p>
                                                                                <span
                                                                                    class="text-subtitle font-weight-bold mr-2">Year
                                                                                    of Manufacture: </span>
                                                                                <span class="text-subtitle-1"
                                                                                    style="line-height: 1;">{{
                                                                                        loadInfo.current_truck?.year
                                                                                    }}</span>
                                                                            </p>
                                                                            <p>
                                                                                <span
                                                                                    class="text-subtitle font-weight-bold mr-2">Serial
                                                                                    Number:</span>
                                                                                <span class="text-subtitle-1"
                                                                                    style="line-height: 1;">{{
                                                                                        loadInfo.current_truck?.serial
                                                                                    }}</span>
                                                                            </p>
                                                                        </div>
                                                                    </v-col>
                                                                </v-row>
                                                            </v-card-text>
                                                        </v-card>
                                                    </v-menu>
                                                </v-col>
                                                <v-col cols="12" md="4">
                                                    <div class="text-subtitle font-weight-bold">Trailer</div>
                                                    <v-menu open-on-hover v-model="trailerMenu"
                                                        :close-on-content-click="false" location="end">
                                                        <template v-slot:activator="{ props }">
                                                            <v-btn color="primary" variant="text" v-bind="props"
                                                                class="px-0 text-none text-body-1 font-weight-bold">
                                                                {{ loadInfo.current_trailer?.name }}
                                                            </v-btn>
                                                        </template>
                                                        <v-card style="width: 500px;">
                                                            <v-card-text>
                                                                <v-row>
                                                                    <v-col cols="12" md="4">
                                                                        <v-img max-width="200"
                                                                            src="https://www.sotrex.com/media/catalog/product/cache/1/thumbnail/225x/17f82f742ffe127f42dca9de82fb58b1/c/n/cn12egj_-_1_1.jpg"
                                                                            alt="John">
                                                                            <template v-slot:placeholder>
                                                                                <div
                                                                                    class="d-flex align-center justify-center fill-height">
                                                                                    <v-progress-circular
                                                                                        color="grey-lighten-4"
                                                                                        indeterminate></v-progress-circular>
                                                                                </div>
                                                                            </template>
                                                                        </v-img>
                                                                    </v-col>
                                                                    <v-col cols="12" md="8">
                                                                        <div class="d-flex flex-column">
                                                                            <p>
                                                                                <span
                                                                                    class="text-subtitle font-weight-bold mr-2">VIN
                                                                                    :</span>
                                                                                <span class="text-subtitle-1"
                                                                                    style="line-height: 1;">{{
                                                                                        loadInfo.current_trailer?.vin
                                                                                    }}</span>
                                                                            </p>
                                                                            <p>
                                                                                <span
                                                                                    class="text-subtitle font-weight-bold mr-2">Model:</span>
                                                                                <span class="text-subtitle-1"
                                                                                    style="line-height: 1;">{{
                                                                                        loadInfo.current_trailer?.model
                                                                                    }}</span>
                                                                            </p>
                                                                            <p>
                                                                                <span
                                                                                    class="text-subtitle font-weight-bold mr-2">Year
                                                                                    of Manufacture: </span>
                                                                                <span class="text-subtitle-1"
                                                                                    style="line-height: 1;">{{
                                                                                        loadInfo.current_trailer?.year
                                                                                    }}</span>
                                                                            </p>
                                                                            <p>
                                                                                <span
                                                                                    class="text-subtitle font-weight-bold mr-2">Serial
                                                                                    Number:</span>
                                                                                <span class="text-subtitle-1"
                                                                                    style="line-height: 1;">{{
                                                                                        loadInfo.current_trailer?.serial
                                                                                    }}</span>
                                                                            </p>
                                                                        </div>
                                                                    </v-col>
                                                                </v-row>
                                                            </v-card-text>
                                                        </v-card>
                                                    </v-menu>
                                                </v-col>
                                            </v-row>
                                        </v-col>
                                        <v-col cols="12" v-if="Array.isArray(loadInfo.stops)">
                                            <div class="d-flex align-center" v-for="(stop, i) in loadInfo.stops"
                                                :key="i">
                                                <div class="d-flex" style="position:relative;">
                                                    <div style="position:relative;" class="d-flex justify-center mr-5">
                                                        <v-avatar style="z-index:2;" color="primary" size="small">
                                                            <span class="text-h6">{{ stop.sequence }}</span>
                                                        </v-avatar>
                                                        <div class="mb-n4" v-if="i < loadInfo.stops.length - 1"
                                                            style="position:absolute;top:0;bottom:0;width:2px; background-image: repeating-linear-gradient(to bottom, transparent, transparent 5px, rgb(var(--v-theme-primary)) 5px, rgb(var(--v-theme-primary)) 5px 10px);">
                                                        </div>
                                                    </div>
                                                    <div class="d-flex flex-wrap align-start" style="">
                                                        <v-card class="mb-5 mr-3" style="min-width:300px;">
                                                            <v-card-text>
                                                                <p class="text-body">City: {{ stop.location?.City }}</p>
                                                                <p class="text-body">State: {{ stop.location?.State }}
                                                                </p>
                                                                <p class="text-body">Address:
                                                                    {{ stop.location?.AddressLine }}
                                                                </p>
                                                                <p class="text-body">Date: {{ stop.earliest_date }}</p>
                                                                <p class="text-body">Time: {{ stop.earliest_time }} -
                                                                    {{ stop.latest_time }}</p>
                                                            </v-card-text>
                                                        </v-card>
                                                        <v-card flat class="mb-5"
                                                            style="min-width: 230px;flex-grow:1;display:inline-flex;overflow:visible;">
                                                            <v-expansion-panels dense>
                                                                <v-expansion-panel>
                                                                    <v-expansion-panel-title class="text-primary">
                                                                        EDI Messages
                                                                        <v-spacer></v-spacer>
                                                                        <DispatchCheckCallDialog :loadInfo="loadInfo"
                                                                            :stopInfo="stop" />
                                                                    </v-expansion-panel-title>
                                                                    <v-expansion-panel-text>
                                                                        <v-list>
                                                                            <v-list-item @click="" class="px-0"
                                                                                v-for="(message, index) in getEdiMessages(loadInfo, stop)"
                                                                                :key="'msg-' + index">
                                                                                <v-list-item-title>
                                                                                    {{ message.MessageType }}
                                                                                    <span class="text-caption">(Status:
                                                                                        {{ message.Status }})</span>
                                                                                </v-list-item-title>
                                                                                <v-list-item-subtitle
                                                                                    class="text-caption">
                                                                                    {{ toLocalDate(message.created_at)
                                                                                    }}
                                                                                </v-list-item-subtitle>
                                                                            </v-list-item>
                                                                        </v-list>
                                                                    </v-expansion-panel-text>
                                                                </v-expansion-panel>
                                                            </v-expansion-panels>
                                                        </v-card>
                                                    </div>
                                                </div>
                                            </div>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>

                            <v-card class="mb-2">
                                <v-card-text>
                                    <div class="d-flex justify-space-between align-center">
                                        <span class="text-h5 font-weight-bold">Commodites</span>
                                        <div>
                                            <DispatchAddCommodity :show="commodityDialog"
                                                @update:show="updateCommodityDialog" :updating="updatingCommodity"
                                                :item="editedCommodity" />
                                            <v-btn class="ml-3" density="compact" color="primary" variant="text"
                                                @click="showCommodityInfo = !showCommodityInfo" :icon='showCommodityInfo
                                                    ? "mdi-chevron-up" : "mdi-chevron-down"'></v-btn>
                                        </div>

                                    </div>
                                    <v-expand-y-transition>
                                        <div class="mt-3" v-if="showCommodityInfo">
                                            <v-list lines="two" density="compact">
                                                <v-list-item v-for="(item, i) in loadInfo.commodities" :key="i"
                                                    @click="editCommodity(item)">
                                                    <v-list-item-title class="text-primary font-weight-bold">{{
                                                        item.commodity != null ? getCommodityName(item.commodity) :
                                                            'Unknown'
                                                    }}</v-list-item-title>
                                                    <v-list-item-subtitle>{{ item.description }}description goes
                                                        here</v-list-item-subtitle>
                                                </v-list-item>
                                                <!-- <v-divider inset></v-divider> -->
                                            </v-list>
                                        </div>
                                    </v-expand-y-transition>

                                </v-card-text>
                            </v-card>

                            <v-card class="mb-2">
                                <v-card-text>
                                    <div class="d-flex justify-space-between align-center">
                                        <span class="text-h5 font-weight-bold">Telematics</span>
                                        <div>
                                            <DispatchVideoFeed />
                                            <v-btn class="ml-3" density="compact" color="primary" variant="text"
                                                @click="showTelematicsInfo = !showTelematicsInfo" :icon='showTelematicsInfo
                                                    ? "mdi-chevron-up" : "mdi-chevron-down"'></v-btn>
                                        </div>

                                    </div>
                                    <v-expand-y-transition>
                                        <div class="d-flex flex-column mt-3" v-if="showTelematicsInfo">
                                            <div class="d-flex mb-2">
                                                <span class="mr-2"><v-icon class="mr-2">mdi-speedometer</v-icon>Speed
                                                    :</span>
                                                <span class="font-weight-bold">98 km/h</span>
                                            </div>

                                            <div class="d-flex mb-2">
                                                <span class="mr-2"><v-icon
                                                        class="mr-2">mdi-thermometer-lines</v-icon>Engine
                                                    Temp
                                                    :</span>
                                                <span class="font-weight-bold">140 <sup>O</sup>C</span>
                                            </div>
                                        </div>
                                    </v-expand-y-transition>
                                </v-card-text>
                            </v-card>

                            <v-card class="mb-2">
                                <v-card-text>
                                    <div class="d-flex justify-space-between align-center">
                                        <span class="text-h5 font-weight-bold">Incidents on the route</span>
                                        <v-btn density="compact" color="primary" variant="text"
                                            @click="showIncidentInfo = !showIncidentInfo" :icon='showIncidentInfo
                                                ? "mdi-chevron-up" : "mdi-chevron-down"'></v-btn>
                                    </div>
                                    <v-expand-y-transition>
                                        <div class="d-flex flex-column mt-3" v-if="showIncidentInfo">
                                            <div class="d-flex flex-column mb-2">
                                                <div class="mr-2 text-h6 font-weight-bold"><v-icon class="mr-2"
                                                        size="12" color="red">mdi-circle-slice-8</v-icon>There is no
                                                    voltage at the
                                                    PSN
                                                    input
                                                </div>
                                                <div class="text-caption ml-5">21.2 KW Recorded at 00:44</div>
                                                <v-btn color="primary" density="comfortable" style="width: 200px;"
                                                    class="">More
                                                    Details</v-btn>
                                            </div>
                                        </div>
                                    </v-expand-y-transition>

                                </v-card-text>
                            </v-card>

                            <v-card class="mb-2">
                                <v-card-text>
                                    <div class="d-flex justify-space-between align-center">
                                        <span class="text-h5 font-weight-bold">Billing Info</span>
                                        <v-btn density="compact" color="primary" variant="text"
                                            @click="showBillingInfo = !showBillingInfo" :icon='showBillingInfo
                                                ? "mdi-chevron-up" : "mdi-chevron-down"'></v-btn>
                                    </div>
                                    <v-expand-y-transition>
                                        <div class="mt-3" v-if="showBillingInfo">
                                            <v-row>
                                                <v-col cols="12" class="pb-0">
                                                    <v-text-field v-model="loadInfo.bill" variant="outlined" flat
                                                        label="Bill" density="compact"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" class="pb-0">
                                                    <v-select v-model="loadInfo.bill_to_customer_id" variant="outlined"
                                                        flat label="Bill to"
                                                        :items='[{ id: 1, value: "client 1" }, { id: 2, value: "client 2" }]'
                                                        item-value="id" item-title="name" density="compact"></v-select>
                                                </v-col>
                                                <v-col cols="12" class="pb-0">
                                                    <v-text-field v-model="loadInfo.reference" variant="outlined" flat
                                                        label="Reference" density="compact"></v-text-field>
                                                </v-col>
                                            </v-row>
                                        </div>
                                    </v-expand-y-transition>

                                </v-card-text>
                            </v-card>

                            <v-card class="mb-2">
                                <v-card-text>
                                    <div class="d-flex justify-space-between align-center">
                                        <span class="text-h5 font-weight-bold">Billing Details</span>
                                        <v-btn density="compact" color="primary" variant="text"
                                            @click="showLoadInfo = !showLoadInfo" :icon='showLoadInfo
                                                ? "mdi-chevron-up" : "mdi-chevron-down"'></v-btn>
                                    </div>
                                    <v-expand-y-transition>
                                        <div class="mt-3" v-if="showLoadInfo">
                                            <v-row>
                                                <v-col cols="12" md="4" class="pb-0">
                                                    <v-text-field v-model="loadInfo.bill_miles" variant="outlined" flat
                                                        label="Bill miles" type="number"
                                                        density="compact"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" md="4" class="pb-0">
                                                    <v-text-field v-model="loadInfo.received" variant="outlined" flat
                                                        label="Received" type="date" density="compact"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" md="4" class="pb-0">
                                                    <v-text-field v-model="loadInfo.release" variant="outlined" flat
                                                        label="Release" type="date" density="compact"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" md="4" class="pb-0">
                                                    <v-select v-model="loadInfo.team" variant="outlined" flat
                                                        label="Team"
                                                        :items='[{ id: 1, name: "team1" }, { id: 2, name: "team2" }]'
                                                        item-value="id" item-title="name" density="compact"></v-select>
                                                </v-col>
                                                <v-col cols="12" md="4" class="pb-0">
                                                    <v-select v-model="loadInfo.type" variant="outlined" flat
                                                        label="Type"
                                                        :items='[{ id: 1, name: "type 1" }, { id: 2, name: "type 2" }]'
                                                        item-value="id" item-title="name" density="compact"></v-select>
                                                </v-col>
                                                <v-col cols="12" md="4" class="pb-0">
                                                    <v-select v-model="loadInfo.trailer" variant="outlined" flat
                                                        label="Trailer"
                                                        :items='[{ id: 1, name: "trailer 1" }, { id: 2, name: "trailer 2" }]'
                                                        item-value="id" item-title="name" density="compact"></v-select>
                                                </v-col>
                                                <v-col cols="12" md="4" class="pb-0">
                                                    <v-text-field v-model="loadInfo.temp" variant="outlined" flat
                                                        label="Temp" density="compact"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" md="4" class="pb-0">
                                                    <v-text-field v-model="loadInfo.seal_number" variant="outlined" flat
                                                        label="Seal No" density="compact"></v-text-field>
                                                </v-col>
                                                <v-col cols="6" md="4" class="pb-0">
                                                    <v-text-field v-model="loadInfo.pallets" variant="outlined" flat
                                                        label="Pallets" density="compact"></v-text-field>
                                                </v-col>
                                                <v-col cols="6" md="2" class="pb-0">
                                                    <v-checkbox v-model="loadInfo.exch" label="Exch" density="compact"
                                                        color="primary" hide-details></v-checkbox>
                                                </v-col>
                                                <v-col cols="6" md="6" class="pb-0">
                                                    <v-select v-model="loadInfo.salesman_id" variant="outlined" flat
                                                        label="Salesman"
                                                        :items='[{ id: 1, name: "salesman 1" }, { id: 2, name: "salesman 2" }]'
                                                        density="compact" item-value="id" item-title="name"></v-select>
                                                </v-col>
                                                <v-col cols="12" class="pb-0">
                                                    <v-textarea v-model="loadInfo.notes" variant="outlined" flat
                                                        label="Notes" density="compact"></v-textarea>
                                                </v-col>
                                            </v-row>
                                        </div>
                                    </v-expand-y-transition>
                                </v-card-text>
                            </v-card>

                            <v-card class="mb-2">
                                <v-card-text>
                                    <div class="d-flex justify-space-between align-center">
                                        <span class="text-h5 font-weight-bold">Activity Logs</span>
                                        <v-btn density="compact" color="primary" variant="text"
                                            @click="showLogs = !showLogs" :icon='showLogs
                                                ? "mdi-chevron-up" : "mdi-chevron-down"'></v-btn>
                                    </div>
                                    <v-expand-y-transition>
                                        <div class="mt-3" v-if="showLogs">

                                        </div>
                                    </v-expand-y-transition>
                                </v-card-text>
                            </v-card>
                        </div>
                    </v-expand-x-transition>
                </div>
            </div>


        </v-card>
    </v-dialog>
</template>


<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, computed, defineProps, defineEmits, toRefs, watch, onMounted } from 'vue'
import type { LoadInfo, StopInfo, CommodityInfo } from '~/types/dispatch/load'
import renderMap from '@/composables/renderMap'

import GoogleMap from '~/composables/googleMaps'

const emit = defineEmits(['update:show'])

const props = defineProps({
    item: {
        type: Object as () => LoadInfo,
        required: false,
    },
    updating: {
        type: Boolean,
        default: false
    },
    show: {
        type: Boolean,
        default: false
    }
});

const loadStore = useLoadStore()
const { truckTelematics } = storeToRefs(loadStore)

const commodityStore = useCommodityStore()

const { item, updating, show } = toRefs(props);

const mapInstance = ref<GoogleMap | null>(null)
const truckMarker = ref<google.maps.Marker | null>(null)

const showDetails = ref(true)
const showBillingInfo = ref(false)
const showLoadInfo = ref(false)
const showTelematicsInfo = ref(true)
const showIncidentInfo = ref(false)
const showCommodityInfo = ref(false)
const showLogs = ref(false)

const driverMenu = ref(false)
const truckMenu = ref(false)
const trailerMenu = ref(false)

const mounted = ref(false)

const telematicsRequestId = ref<NodeJS.Timeout | null>(null)


const defaultLoad = ref<LoadInfo>({} as LoadInfo)

const loadInfo = ref(defaultLoad.value)

const editedStop = ref({});
const stopDialog = ref(false)
const updatingStop = ref(false)

const defaultCommodity = ref<CommodityInfo>({
    id: null,
    matrix: null,
    commodity: null,
    reference: null,
    description: null,
    notes: null,
    actual_weight: null,
    tarrif_weight: null,
    as_weight: null,
    pieces: null,
    space: null,
    seats: null,
    value: null,
    measure: null,
    length: null,
    width: null,
    height: null,
    volume: null,
    stackable: false,
    floor_board: false,
})

const editedCommodity = ref(defaultCommodity.value)

const commodityDialog = ref(false)
const updatingCommodity = ref(false)

const dialog = computed({
    get() {
        return props.show
    },
    set(newValue) {
        emit('update:show', newValue);
    }
})

const stopHeaders = ref([
    { title: 'Stop', key: 'stop', sortable: false },
    { title: 'No', key: 'stop_number' },
    { title: 'Av', key: 'available_from', sortable: false },
    { title: 'Thru', key: 'available_through', sortable: false },
    { title: 'From', key: 'time_from', sortable: false },
    { title: 'To', key: 'time_to', sortable: false },
    { title: 'Appt', key: 'appointment_required', sortable: false },
    { title: 'Appt Ref', key: 'appointment_reference', sortable: false },
    { title: 'Shipper', key: 'shipper', sortable: false },
    { title: 'Address', key: 'address', sortable: false },
    { title: 'City', key: 'city', sortable: false },
    { title: 'St', key: 'state', sortable: false },
    { title: 'Zip', key: 'zip', sortable: false },
    { title: 'Z', key: 'zone', sortable: false },
    { title: 'MI', key: 'mi', sortable: false },
    { title: 'Reference', key: 'reference', sortable: false },
])

const commodityHeaders = ref([
    { title: 'Commodity', key: 'commodity', sortable: false },
    { title: 'Ref', key: 'commodity_ref' },
    { title: 'Desc', key: 'description', sortable: false },
    { title: 'Wgt', key: 'weight', sortable: false },
    { title: 'Pcs', key: 'pieces', sortable: false },
    { title: 'Spc', key: 'specification', sortable: false },
    { title: 'Notes', key: 'specification_notes', sortable: false },
    // { title: 'Accessorial', key: 'accessorial', sortable: false },
    // { title: 'Ref', key: 'accessorial_reference', sortable: false },
    // { title: 'Rate', key: 'rate', sortable: false },
    // { title: 'Units', key: 'units', sortable: false },
    // { title: 'Amt', key: 'amount', sortable: false },
    // { title: 'Pay', key: 'pay', sortable: false },
    // { title: 'App', key: 'app', sortable: false },
    // { title: 'Notes', key: 'app_notes', sortable: false },
])

const title = computed(() => {
    return (props.updating && loadInfo.value) ? `Load Info (Load #${loadInfo.value?.id}, Route #${loadInfo.value?.route_number})` : 'Book Load'
})

const saveButtonText = computed(() => {
    return props.updating ? 'update' : 'Save'
})

const getEdiMessages = (load: LoadInfo, stop: StopInfo) => {
    return load?.edi_communication?.filter((item: any) => item.stopSequenceNumber == stop?.sequence && !['990', '997'].includes(item.MessageType)) || []
}

const toLocalDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
}

const dispatchLoad = () => {
    console.log('dispatching load')
}

const Load = () => {
    console.log('dispatching load')
}

const editStop = (stop: object) => {
    editedStop.value = stop
    updatingStop.value = true
    stopDialog.value = true
}

const updateStopDialog = (value: boolean) => {
    stopDialog.value = value
    editedStop.value = {}
    updatingStop.value = false
}

const editCommodity = (commodity: CommodityInfo) => {
    editedCommodity.value = commodity
    updatingCommodity.value = true
    commodityDialog.value = true
}

const updateCommodityDialog = (value: boolean) => {
    commodityDialog.value = value
    editedCommodity.value = defaultCommodity.value
    updatingCommodity.value = false
}

const getCommodityName = (commodity_id: number) => {
    return commodityStore.getCommodityById(commodity_id)?.description
}

onMounted(() => {
    mounted.value = true
})



// this function is triggered in a watcher
const updateTruckPosition = () => {
    let truckData = truckTelematics.value?.diagnostics?.gps

    if (mapInstance.value && truckData) {
        if (truckMarker.value) {
            truckMarker.value.setMap(null)
        }

        const truckMarkerSVG = `<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 506.999 511.89">
                                    <path fill="#5d5cde" d="M505.023 485.928L263.083 6.415c-4.051-8.553-15.091-8.553-19.144 0L2.005 485.931c-7.858 15.66 8.874 31.685 24.438 23.909l227.066-120.826L480.576 509.84c15.687 7.867 32.2-8.374 24.447-23.912z"/>
                                </svg>`
        const TruckIcon  = {
            url: mapInstance.value.SvgToBase64Image(truckMarkerSVG),
            scaledSize: new google.maps.Size(30, 20)
        }

        truckMarker.value = new google.maps.Marker({
            position: { lat: truckData.latitude, lng: truckData.longitude },
            map: mapInstance.value?.map,
            icon: TruckIcon,
        });

        mapInstance.value.panTo({ lng: truckData.longitude, lat: truckData.latitude })
    
         // Add a tooltip to the truck marker
        const infowindow = new google.maps.InfoWindow({
            content: `Truck is heading`,
        });
        (truckMarker.value as google.maps.Marker).addListener('mouseover', () => infowindow.open(mapInstance.value?.map, truckMarker.value));
        (truckMarker.value as google.maps.Marker).addListener('mouseout', () => infowindow.close());
    }
}

const setTelematicsRequest = () => {
    // Start immediately and then run every 5 minutes
    telematicsRequestId.value = setTimeout(async () => {
        await loadStore.fetchTruckTelematics(loadInfo.value.current_truck_id as any)
        // await loadStore.fetchTruckTelematics(1194)

        // Start the repeating interval after the initial execution
        telematicsRequestId.value = setInterval(async () => {
            await loadStore.fetchTruckTelematics(loadInfo.value.current_truck_id as any)
            // await loadStore.fetchTruckTelematics(1194)
        }, 5 * 60 * 1000); //5 minutes = 5 * 60 seconds * 1000 milliseconds
    }, 0); // The delay is set to 0 to execute immediately
}

const clearTelematicsRequest = () => {
    if (telematicsRequestId.value) {
        clearInterval(telematicsRequestId.value);
        telematicsRequestId.value = null;
    }
}

watch(dialog, async (val) => {
    if (val) {
        showDetails.value = true
        if (props.updating) {
            loadInfo.value = props.item as LoadInfo
        }

        if (mounted.value) {
            nextTick(async () => {
                var mapLoader: HTMLElement | null = document.getElementById('loader');
                mapInstance.value = await renderMap(loadInfo.value, 'map', '')

                //get truck location updates
                setTelematicsRequest()

                //hide map loader once map is rendered
                if (mapLoader) {
                    mapLoader.style.display = "none"
                }

            })
        }

    } else {
        loadInfo.value = defaultLoad.value

        clearTelematicsRequest()
    }
})

watch(truckTelematics, (val) => {
    // if (val && val && val.id == loadInfo.value.current_truck_id) {
    //     updateTruckPosition()
    // }
    updateTruckPosition()
})

</script>

<style scoped>
.etaDisplay {
    color: #452c63;
    border: 2px solid #452c63;
    border-radius: 5px;
    background-color: rgba(255, 255, 255, .15);
    backdrop-filter: blur(5px);
}

#mapContainer {
    height: calc(100vh - 48px) !important;
    position: relative;
    overflow-y: auto !important;
}

#map {
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>
~/composables/googleMapsV0