<template>
    <div>
        <div class="d-flex mb-3">
            <v-spacer></v-spacer>
            <span class="mr-2">
                <HeaderManagement :selectedColumns="selectedColumns" class=""
                    @update:selectedColumns="emit('update:selectedColumns', $event)" />
            </span>

            <DataPreviewFilters v-if="localTemplate.filters?.length || localTemplate.jsonFilters?.length"
                :template="localTemplate" :selectedColumns="selectedColumns" :schema="schema"
                @applyFilters="applyFilters" />
            <v-btn class="text-none ml-2" color="primary" @click="generateReport">
                <v-icon>mdi-refresh</v-icon>
                Refresh
            </v-btn>
        </div>
        <v-card>
            <v-card-text>
                <!-- <v-data-table :headers="tableHeaders" :items="sampleData" :items-per-page="10">
                    <template v-for="header in tableHeaders"
                        v-slot:[`header.${header.key}`]="{ column, getSortIcon, toggleSort }">
                        <div @click.stop="">
                            <v-text-field style="min-width:40px;" v-model="header.title" class="custom-text"
                                density="compact" variant="outlined" :placeholder="header.key" hide-details>
                                <template v-slot:append>
                                    <v-icon class="v-data-table-header__sort-icon" :icon="getSortIcon(column)"
                                        @click="toggleSort(column)" />
                                </template>
</v-text-field>
</div>
</template>
</v-data-table> -->
                <v-data-table :headers="tableHeaders" :items="sampleData" :items-per-page="10">
                </v-data-table>
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, type PropType, watch, defineEmits } from 'vue';
import DataPreviewFilters from './DataPreviewFilters.vue'
import HeaderManagement from './DataPreviewHeaderManagement.vue'
import type { Schema } from '~/types/shared/reportSchema'
import type { ReportTemplate } from '~/types/maintenance/reportTemplate';

const reportTemplateStore = useReportTemplateStore()

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
const emit = defineEmits(['update:selectedColumns']);

const localTemplate = ref<ReportTemplate>({} as ReportTemplate)

watch(() => props.template, () => {
    localTemplate.value = JSON.parse(JSON.stringify(props.template))
}, { deep: true, immediate: true })

const sampleData = ref<any[]>([])

const applyFilters = ([filters, jsonFilters]: [any[], any[]]) => {
    localTemplate.value.filters = filters
    localTemplate.value.jsonFilters = jsonFilters
    generateReport()
}

const tableHeaders = computed(() => {
    return props.selectedColumns?.filter(column => !column.disabled) || []
})

// Method to generate report
const generateReport = async () => {
    // const payload = {
    //   masterTable: 
    //     columns: selectedTables.value.flatMap((table) =>
    //         table.columns.map((col) => `${table.table}.${col}`)
    //     ),
    //     conditions: conditions.value.map((cond) => ({
    //         leftTable: cond.leftTable,
    //         leftColumn: cond.leftColumn,
    //         operator: cond.operator,
    //         valueType: cond.valueType,
    //         // value:
    //         //     cond.valueType === 'static'
    //         //         ? cond.staticValue
    //         //         : `${cond.rightTable}.${cond.rightColumn}`,
    //         value: cond.valueType === 'static' ? cond.staticValue : undefined,
    //         rightTable: cond.valueType === 'column' ? cond.rightTable : undefined,
    //         rightColumn: cond.valueType === 'column' ? cond.rightColumn : undefined
    //     })),
    //     filters: filters.value.map((filter) => ({
    //         table: filter.table,
    //         column: filter.column,
    //         type: filter.type,
    //         operator: filter.operator,
    //         value: filter.operator === 'between'
    //             ? [filter.lowerBound, filter.upperBound]
    //             : filter.operator === 'in' || filter.operator === 'not in'
    //                 ? filter.arrayValues?.split(',').map((val) => val.trim())
    //                 : filter.value,
    //     })),
    // };

    // Fetch API call to the Laravel backend
    // fetch('report-templates/generate-report', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(payload),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log('Report generated:', data);
    //   })
    //   .catch((error) => {
    //     console.error('Error generating report:', error);
    //   });


    let payload = JSON.parse(JSON.stringify(localTemplate.value))

    if (!Boolean(payload.masterJsonTable)) {
        delete payload.masterJsonTableColumns;
        delete payload.masterJsonTable
        delete payload.masterJsonRelatedTables
        delete payload.jsonFilters
    }

    if(!Boolean(payload.arrayDataSelection)){
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

    let { data } = await reportTemplateStore.generateReportSample(payload)

    if (data) {
        sampleData.value = data as any[]
    } else {
        sampleData.value = []
    }
};


</script>

<style scoped>
h3 {
    margin-bottom: 10px;
}
</style>