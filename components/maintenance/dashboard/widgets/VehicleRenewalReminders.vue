<template>
    <!-- person of interest -->
    <v-card class="flex-card">
        <v-card-title>Vehicle Renewal Reminders</v-card-title>
        <v-card-text>
            <v-row class="fill-height align-center">
                <v-col cols="6" class="text-center">
                    <div class="overdue text-h4">{{ vehicleRenewal.overdue }} </div>
                    <div>Overdue</div>
                </v-col>
                <v-col cols="6" class="text-center">
                    <div class="due-soon text-h4">{{ vehicleRenewal.dueSoon }} </div>
                    <div>Due Soon</div>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
const vehicleRenewalstore = useMaintenanceDashboardStore();
const { vehicleRenewal } = storeToRefs(vehicleRenewalstore)


</script>

<style scoped>
.flex-card {
    display: flex;
    flex-direction: column;
    height: 218px;
}

.overdue {
    color: red;
    font-size: 24px;
}

.due-soon {
    color: orange;
    font-size: 24px;
}
</style>