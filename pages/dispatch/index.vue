<script setup lang="ts">
/*Call Components*/
import SalesOverview from '@/components/dashboard/SalesOverview.vue';
import YearlyBreakup from '@/components/dashboard/YearlyBreakup.vue';
import MonthlyEarning from '@/components/dashboard/MonthlyEarnings.vue';
import RecentLoadEnRoute from '@/components/dashboard/RecentLoad.vue';
import LoadTable from '@/components/dashboard/LoadTable.vue';
import ProductCards from '@/components/dashboard/ProductCards.vue';
import DispatchQuickActions from '@/components/dashboard/DispatchQuickActions.vue';
import DispatchMetric from '@/components/dashboard/DispatchMetric.vue';
import ShipmentStats from '@/components/dashboard/ShipmentStats.vue';
</script>
<template>
    <v-row>
        <v-col cols="12">
            <v-row>
                <v-col cols="12" md="12">
                    <DispatchQuickActions />
                </v-col>
                <v-col cols="12" md="12">
                    <DispatchMetric />
                </v-col>
               
                <!-- Sales overview -->
                <!-- <v-col cols="12" lg="8">
                    <SalesOverview />
                </v-col> -->
                <!-- Yearly Breakup / Monthly Earnings -->
                <!-- <v-col cols="12" lg="4">
                    <div class="mb-6">
                        <YearlyBreakup />
                    </div>
                    <div>
                        <MonthlyEarning />
                    </div>
                </v-col> -->
                <v-col cols="12" sm="6" md="4">
                    <ShipmentStats />
                </v-col>
                 <!-- Product performence -->
                 <v-col cols="12" lg="8">
                    <LoadTable />
                </v-col>
                <!-- Recent transaction -->
                <v-col cols="12" lg="6">
                    <RecentLoadEnRoute />
                </v-col>
                
            </v-row>
        </v-col>
    </v-row>
</template>