<template>
    <div>
        <div class="d-flex justify-end">
            <v-btn density="comfortable" class="text-none" color="primary" @click="refreshReport">Refresh</v-btn>
        </div>
        <SharedUiCustomTable @update:options="optionsUpdated" :headers="tableHeaders" :items="reportData"
            :items-per-page="50" :multi-sort="true">
            <template v-slot:filters>
                <div class="d-inline-flex">
                    <template v-for="(filter, i) in filters" :key="i">
                        <v-text-field flat density="compact" class="mr-1" style="width:200px" hide-details
                            variant="solo" :label="filter.label" v-model="filter.value"
                            :type="filter.type"></v-text-field>
                    </template>
                </div>
            </template>
        </SharedUiCustomTable>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, type PropType, watch, defineEmits } from 'vue';
import { storeToRefs } from 'pinia';
import type { ReportTemplate } from '~/types/maintenance/reportTemplate';
import { useRouter, useRoute } from 'vue-router';

const reportTemplateStore = useReportTemplateStore()
const { reportData } = storeToRefs(reportTemplateStore)

const router = useRouter();
const route = useRoute();

// Define props
const props = defineProps({
    selectedColumns: {
        type: Array as () => Array<{ title: string; key: string }>,
        default: () => [],
    },
    template: {
        type: Object as PropType<ReportTemplate>,
        required: true,
    }
});

// Emit event for updates
const emit = defineEmits(['update:selectedColumns', 'update:sortBy']);

const localTemplate = ref<Record<string, any>>({})

const filters = ref<Record<string, any>>({})

const templateId = computed(() => {
    return route.params.reportId as string
})

watch(() => props.template, () => {
    localTemplate.value = JSON.parse(JSON.stringify(props.template))
}, { deep: true, immediate: true })

// Initialize headers based on selected columns
const tableHeaders = computed(() => {
    return props.selectedColumns
})

// watch(() => filters.value, () => {
//     const validFilters = filters.value.every((filter: any) => Boolean(filter.value));
//     if (validFilters) {
//         generateReport()
//     }
// }, { deep: true })


const refreshReport = () => {
    const validFilters = filters.value.every((filter: any) => Boolean(filter.value));
    if (validFilters) {
        generateReport()
    }
}

// Method to generate report
const generateReport = async () => {
    const mappedFilters = Object.fromEntries(
        filters.value.map((item: any) => [item.key, item.value])
    );

    let payload = {
        reportId: templateId.value,
        payload: mappedFilters
    }
    reportTemplateStore.generateReport(payload)
};


const optionsUpdated = (options: any) => {
    emit('update:sortBy', options.sortBy)
}

onMounted(() => {
    filters.value = props.template?.filters
    generateReport()
})
</script>

<style scoped>
h3 {
    margin-bottom: 10px;
}
</style>