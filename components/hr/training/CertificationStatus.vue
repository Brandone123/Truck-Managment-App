<template>
    <div>

        <div class="d-flex justify-space-between">
            <span class="text-primary text-h6">Certified</span>
        </div>
        <v-progress-linear color="light-blue" height="10" :model-value="certifiedEmployees" striped>
            <template v-slot:default="{ value }">
                <strong>{{ Math.ceil(value) }}%</strong>
            </template>
        </v-progress-linear>

        <div class="d-flex justify-space-between">
            <span class="text-primary text-h6">Pending</span>
        </div>
        <v-progress-linear color="light-blue" height="10" :model-value="pendingEmployees" striped>
            <template v-slot:default="{ value }">
                <strong>{{ Math.ceil(value) }}%</strong>
            </template>
        </v-progress-linear>

        <div class="d-flex justify-space-between">
            <span class="text-primary text-h6">Not Certified</span>
        </div>
        <v-progress-linear color="light-blue" height="10" :model-value="notCertifiedEmployees" striped>
            <template v-slot:default="{ value }">
                <strong>{{ Math.ceil(value) }}%</strong>
            </template>
        </v-progress-linear>
    </div>

</template>

<script lang="ts" setup>
import { ref } from 'vue';

type CertificationStatus = 'certified' | 'pending' | 'not_certified';

interface Employee {
    id: number;
    name: string;
    certificationStatus: CertificationStatus;
}

const employees = ref<Employee[]>([
    {
        id: 1,
        name: 'John Doe',
        certificationStatus: 'pending',
    },
    {
        id: 2,
        name: 'Jane Smith',
        certificationStatus: 'certified',
    },
    {
        id: 3,
        name: 'Bob Johnson',
        certificationStatus: 'not_certified',
    },
]);

const certifiedEmployees = computed(() => employees.value.filter(employee => employee.certificationStatus === 'certified').length / employees.value.length * 100);
const pendingEmployees = computed(() => employees.value.filter(employee => employee.certificationStatus === 'pending').length / employees.value.length * 100);
const notCertifiedEmployees = computed(() => employees.value.filter(employee => employee.certificationStatus === 'not_certified').length / employees.value.length * 100);
</script>

<style scoped>
/* Add custom styles for the component here */
</style>