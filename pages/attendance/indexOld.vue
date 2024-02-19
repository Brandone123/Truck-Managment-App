<script setup lang="ts">
import { ref } from 'vue'

const headers = ref([
    { title: "name", key: "name", sortable: true },
    { title: "department", key: "department", sortable: false },
    { title: "status", key: "status", sortable: false, align: 'center' },
    { title: "Annual Leave", key: "annual_leave", sortable: false },
])

const employeeStatuses = ref([
    {
        id: 1,
        name: 'John Doe',
        status: 'On Leave',
        department: 'Marketting',
    },
    {
        id: 1,
        name: 'Jane Smith',
        status: 'Active',
        department: 'Marketting',
    },
])
</script>
<template>
    <v-row>
        <v-col cols="12" md="3">
            <v-card class="px-5 py-8">
                <div class="d-flex align-center">
                    <v-card color="deep-purple-lighten-5" class="mr-3">
                        <v-icon size="50" color="deep-purple">mdi-account-group-outline</v-icon>
                    </v-card>
                    <span>
                        <h2>47</h2>
                        <span>Total Employees</span>
                    </span>
                </div>
            </v-card>
        </v-col>
        <v-col cols="12" md="3">
            <v-card class="px-5 py-8">
                <div class="d-flex align-center">
                    <v-card color="green-lighten-5" class="mr-3" elevation="0">
                        <v-icon size="50" color="green">mdi-account-tie</v-icon>
                    </v-card>
                    <span>
                        <h2>47</h2>
                        <span>Active</span>
                    </span>
                </div>
            </v-card>
        </v-col>
        <v-col cols="12" md="3">
            <v-card class="px-5 py-8">
                <div class="d-flex align-center">
                    <v-card color="blue-lighten-5" class="mr-3" elevation="0">
                        <v-icon size="50" color="primary">mdi-umbrella-beach</v-icon>
                    </v-card>
                    <span>
                        <h2>47</h2>
                        <span>On Leave</span>
                    </span>
                </div>
            </v-card>
        </v-col>
        <v-col cols="12" md="3">
            <v-card class="px-5 py-8">
                <div class="d-flex align-center">
                    <v-card color="red-lighten-5" class=" mr-3" elevation="0">
                        <v-icon size="50" color="red-darken-2">mdi-timer-sand</v-icon>
                    </v-card>
                    <span>
                        <h2>47</h2>
                        <span>Pending Requests</span>
                    </span>
                </div>
            </v-card>
        </v-col>
        <v-col cols="12" md="6">
            <v-card>
                <v-card-title>
                    Employee Summary
                </v-card-title>
                <v-card-text>
                    <v-data-table density="compact" :headers="(headers as any)" :items="employeeStatuses">
                        <template v-slot:item.status="{ value }"><v-chip color="primary">{{ value }}</v-chip></template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>