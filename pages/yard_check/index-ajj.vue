<script setup lang="ts">
</script>
<template>
    <v-container fluid>
        <v-row justify="center">
            <v-col cols="12" sm="6" md="3">
                <v-card flat>
                    <v-card-text>
                        <div class="font-weight-bold text-caption">Arrivals</div>
                        <div class="text-center font-weight-bold text-h4 my-3">
                            <span>212</span>
                            <span class="mx-1 text-grey">/</span>
                            <span>314</span>
                        </div>
                        <div class="text-center text-caption text-grey custom-small-text"> Driver Checkins Vs Expected
                            Arrivals</div>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="3">
                <v-card flat>
                    <v-card-text>
                        <div class="font-weight-bold text-caption">Departures</div>
                        <div class="text-center font-weight-bold text-h4 my-3">
                            <span>58</span>
                            <span class="mx-1 text-grey">/</span>
                            <span>176</span>
                        </div>
                        <div class="text-center text-caption text-grey custom-small-text"> Recorded Departures Vs Expected
                            to Depart</div>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="3">
                <v-card flat>
                    <v-card-text>
                        <div class="font-weight-bold text-caption">Turn Aways</div>
                        <div class="text-center font-weight-bold text-h4 my-3">
                            <span>14</span>
                        </div>
                        <div class="text-center text-caption text-grey custom-small-text">Shipments turned away at the gate
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="3">
                <v-card flat>
                    <v-card-text>
                        <div class="font-weight-bold text-caption">Waiting Time At The Gate</div>
                        <div class="text-center font-weight-bold text-h4 my-3">
                            <span>12 m</span>
                        </div>
                        <div class="text-center text-caption text-grey custom-small-text"> Average waiting time at the gate
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" sm="12" md="6">

                <v-col cols="12" class="px-0 ">
                    <v-card flat style="height:250px;">
                        <v-card-title>Test I title</v-card-title>
                        <v-card-text>Test 1</v-card-text>
                    </v-card>
                </v-col>

                <v-col cols="12"  class="px-0">
                    <v-card flat style="height: 150px;">
                        <v-card-text>Test 2</v-card-text>
                    </v-card>
                </v-col>
            </v-col>






            <v-col cols="12" sm="12" md="6">
                <v-col cols="12"  class="px-0">
                    <v-card flat style="height:110px;">
                        <v-card-text>Test</v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12"  class="px-0">
                    <v-card flat style="height: 150px;">
                        <v-card-text>Test</v-card-text>
                    </v-card>
                </v-col>
            </v-col>
        </v-row>
    </v-container>
</template>

<style>
.custom-small-text {
    font-size: 7px;
}
</style>