<template>
    <div>
        <div class="d-flex mb-3">
            <v-spacer></v-spacer>
            <DataPreviewFilters v-if="localTemplate.filters?.length || localTemplate.jsonFilters?.length"
                :template="localTemplate" :selectedColumns="selectedColumns" :schema="schema"
                @applyFilters="applyFilters" />
            <v-btn class="text-none ml-2" color="primary" @click="generateReport">
                <v-icon>mdi-refresh</v-icon>
                Refresh
            </v-btn>
        </div>

        <SharedUiCustomTable @update:options="optionsUpdated"
            :headers="tableHeaders" :items="reportData" :items-per-page="50" :multi-sort="true">
        </SharedUiCustomTable>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, type PropType, watch, defineEmits } from 'vue';
import { storeToRefs } from 'pinia';
import DataPreviewFilters from './DataPreviewFilters.vue'
import type { Schema } from '~/types/shared/reportSchema'
import type { ReportTemplate } from '~/types/maintenance/reportTemplate';

const reportTemplateStore = useReportTemplateStore()
const { reportData } = storeToRefs(reportTemplateStore)

// Define props
const props = defineProps({
    selectedColumns: {
        type: Array as () => Array<{ title: string; key: string, disabled: boolean }>,
        default: () => [],
    },
    template: {
        type: Object as PropType<ReportTemplate>,
        required: true,
    },
    schema: {
        type: Object as PropType<Schema>,
        required: true
    }
});

// Emit event for updates
const emit = defineEmits(['update:selectedColumns', 'update:sortBy']);

const localTemplate = ref<ReportTemplate>({} as ReportTemplate)

watch(() => props.template, () => {
    localTemplate.value = JSON.parse(JSON.stringify(props.template))
}, { deep: true, immediate: true })

// Initialize headers based on selected columns
const tableHeaders = computed(() => {
    return props.selectedColumns.filter(column => !column.disabled)
})

const applyFilters = ([filters, jsonFilters]: [any[], any[]]) => {
    localTemplate.value.filters = filters
    localTemplate.value.jsonFilters = jsonFilters
    generateReport()
}

// Method to generate report
const generateReport = async () => {
    let payload = JSON.parse(JSON.stringify(localTemplate.value))

    if (!Boolean(payload.masterJsonTable)) {
        delete payload.masterJsonTableColumns;
        delete payload.masterJsonTable
        delete payload.masterJsonRelatedTables
        delete payload.jsonFilters
    }

    if (!Boolean(payload.arrayDataSelection)) {
        delete payload.arrayDataSelection
    }

    ['jsonFilters', 'filters'].forEach(key => {
        payload[key] = payload[key]?.map((filter: any) => ({
            ...filter,
            value: filter.operator === 'between'
                ? [filter.lowerBound, filter.upperBound]
                : filter.operator === 'in' || filter.operator === 'not in'
                    ? filter.arrayValues?.split(',').map((val: string) => val.trim())
                    : filter.value,
        })).filter((filter: any) => {
            if (filter.operator == 'between') {
                return Boolean(filter.value[0]) && Boolean(filter.value[1])
            }
            return Boolean(filter.value)
        }) || [];
    })

    reportTemplateStore.generateReport(payload)

};


const optionsUpdated = (options : any) => {
    console.log(options)
  emit('update:sortBy',options.sortBy)
}
</script>

<style scoped>
h3 {
    margin-bottom: 10px;
}
</style>