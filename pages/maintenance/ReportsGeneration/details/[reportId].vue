<template>
    <div style="font-family:Arial, Helvetica, sans-serif;" class="mt-0">
        <v-card class="rounded-0 mx-n4" style="position:sticky;top:48px;z-index:1; margin-top: -16px;">
            <v-divider></v-divider>
            <div class="d-flex justify-space-between mt-4 mb-4" style="align-items: center;">
                <span>
                    <span style="cursor:pointer" class="text-primary text-h6"
                        @click="router.push('/maintenance/ReportsGeneration')">
                        <v-icon>mdi-chevron-left</v-icon> Reports</span>
                    <span class="text-ht text-grey"> / {{ template.name }}</span>
                </span>
                <div class="mr-5">
                    <v-row>
                        <!-- <span class="button watch" @click="">
                            <v-icon style="font-size:medium">mdi-content-save-outline</v-icon> Save
                        </span>

                        <span class="button watch ml-2 mr-2" @click="share">
                            <v-icon style="font-size:medium">mdi-share-variant-outline</v-icon> Share
                        </span> -->

                        <v-btn class="text-none" variant="outlined" density="comfortable" @click="exportToCSV">
                            Export CSV
                        </v-btn>

                        <!-- <span class="button watch" @click="print">
                            <v-icon style="font-size:medium">mdi-printer-outline</v-icon> Print
                        </span> -->
                    </v-row>
                </div>
            </div>
        </v-card>

        <ReportPreview class="mt-10" :selectedColumns="template?.columnHeaders" :template="template" :schema="schema"
            @update:sortBy="sortBy = $event" />
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeMount, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router';
import type { ReportTemplate } from '@/types/maintenance/reportTemplate';
import ReportPreview from '~/components/maintenance/reports/reportTemplate/components/ReportPreview.vue';
import { useMaintenanceQueryBuilderSchema } from '@/data/reportSchemas/useMaintenanceQueryBuilderSchema';
import type { Schema } from '~/types/shared/reportSchema'
import { convertToCSV, downloadCSVFile } from '~/composables/exportCSV';

// Importing schema using the helper function
const schema: Schema = useMaintenanceQueryBuilderSchema();

const reportTemplateStore = useReportTemplateStore()
const { templates, reportData } = storeToRefs(reportTemplateStore)

const router = useRouter();
const route = useRoute();
const sortBy = ref([]);

const template = computed(() => {
    return templates.value.find((template) => template.id == route.params.reportId as any) || {} as ReportTemplate
})


const customSort = (sortBy: any[], data: any[]) => {
    return JSON.parse(JSON.stringify(data)).sort((a: any, b: any) => {
        for (let i = 0; i < sortBy.length; i++) {
            const sortKey = sortBy[i].key;
            const sortDirection = sortBy[i].order == 'desc' ? -1 : 1;

            if (a[sortKey] > b[sortKey]) return sortDirection;
            if (a[sortKey] < b[sortKey]) return -sortDirection;
        }
        return 0;
    });
}

function exportToCSV() {
    let headers = template.value?.columnHeaders || []
    let sortedData = customSort(sortBy.value, reportData.value)
    const csvData = convertToCSV(sortedData, headers);
    let timestamp = new Date().toISOString()
    downloadCSVFile(csvData, `${template.value?.name}_${timestamp}` + '.csv');
}

onUnmounted(() => {
    reportTemplateStore.clearReportData()
})
</script>

<style scoped>
.button {
    border: 1px solid silver;
    cursor: pointer;
    padding: 0.2em 0.5em;
    border-radius: 5px;
    transition: background-color 0.3s;
    font-size: small;
}

.button:hover {
    background-color: #f0f0f0;
    /* Couleur de fond au survol */
}

.button:active {
    background-color: #d0d0d0;
    /* Couleur de fond au clic */
}
</style>