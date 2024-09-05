<template>
    <v-dialog v-model="dialog" scrollable width="800">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn color="secondary" v-bind="activatorProps" prepend-icon="mdi-cog" class="text-none">
                Filters
            </v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card>
                <v-toolbar color="primary" dark density="compact">
                    <v-toolbar-title>Filters</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog = !dialog">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text>
                    <!-- Master Table Filters -->
                    <div v-for="(filter, index) in localFilters" :key="index">
                        <div class="mb-2">
                            <span>{{ getColumnDisplayName(filter.column) }} :</span>
                            <v-tooltip text="Table Name">
                                <template v-slot:activator="{ props }">
                                    <v-chip color="primary" variant="tonal" v-bind="props" prepend-icon="mdi-table"
                                        class="mx-2">
                                        {{ getTableDisplayName(filter.column) }}
                                    </v-chip>
                                </template>
                            </v-tooltip>

                            <v-tooltip text="Filter Operation">
                                <template v-slot:activator="{ props }">
                                    <v-chip color="primary" variant="tonal" v-bind="props" prepend-icon="mdi-filter"
                                        class="mx-2">
                                        {{ getOperatorTitle(filter.operator) }}
                                    </v-chip>
                                </template>
                            </v-tooltip>
                        </div>

                        <v-row>
                            <template v-if="filter.operator === 'between'">
                                <v-col cols="12" md="6">
                                    <v-text-field hide-details density="compact" variant="outlined"
                                        v-model="filter.lowerBound" :type="filter.type" label="Lower Bound" dense
                                        clearable></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field hide-details density="compact" variant="outlined"
                                        v-model="filter.upperBound" :type="filter.type" label="Upper Bound" dense
                                        clearable></v-text-field>
                                </v-col>
                            </template>
                            <v-col v-if="filter.operator === 'in' || filter.operator === 'not in'" cols="12">
                                <v-text-field hide-details density="compact" variant="outlined"
                                    v-model="filter.arrayValues" label="Values (comma-separated)" persistent-hint dense
                                    clearable></v-text-field>
                            </v-col>
                            <v-col
                                v-if="filter.operator !== 'between' && filter.operator !== 'in' && filter.operator !== 'not in'"
                                cols="12">
                                <v-text-field hide-details density="compact" variant="outlined" v-model="filter.value"
                                    :type="filter.type" label="Value" dense clearable></v-text-field>
                            </v-col>
                        </v-row>
                        <v-divider class="my-3" v-if="index + 1 < localFilters.length"></v-divider>
                    </div>

                    <!-- Nested Json Table Data Filters -->
                    <div v-for="(filter, index) in localJsonFilters" :key="index">
                        <div class="mb-2">
                            <span>{{ getJsonColumnDisplayName(filter.column) }} :</span>
                            <v-tooltip text="Nested Data Table Name">
                                <template v-slot:activator="{ props }">
                                    <v-chip color="primary" variant="tonal" v-bind="props" prepend-icon="mdi-table"
                                        class="mx-2">
                                        {{ getJsonTableDisplayName(template.masterJsonTable?.name || '') }}
                                    </v-chip>
                                </template>
                            </v-tooltip>

                            <v-tooltip text="Filter Operation">
                                <template v-slot:activator="{ props }">
                                    <v-chip color="primary" variant="tonal" v-bind="props" prepend-icon="mdi-filter"
                                        class="mx-2">
                                        {{ getOperatorTitle(filter.operator) }}
                                    </v-chip>
                                </template>
                            </v-tooltip>
                        </div>

                        <v-row>
                            <template v-if="filter.operator === 'between'">
                                <v-col cols="12" md="6">
                                    <v-text-field hide-details density="compact" variant="outlined"
                                        v-model="filter.lowerBound" :type="filter.type" label="Lower Bound" dense
                                        clearable></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field hide-details density="compact" variant="outlined"
                                        v-model="filter.upperBound" :type="filter.type" label="Upper Bound" dense
                                        clearable></v-text-field>
                                </v-col>
                            </template>
                            <v-col v-if="filter.operator === 'in' || filter.operator === 'not in'" cols="12">
                                <v-text-field hide-details density="compact" variant="outlined"
                                    v-model="filter.arrayValues" label="Values (comma-separated)" persistent-hint dense
                                    clearable></v-text-field>
                            </v-col>
                            <v-col
                                v-if="filter.operator !== 'between' && filter.operator !== 'in' && filter.operator !== 'not in'"
                                cols="12">
                                <v-text-field hide-details density="compact" variant="outlined" v-model="filter.value"
                                    :type="filter.type" label="Value" dense clearable></v-text-field>
                            </v-col>
                        </v-row>
                        <v-divider class="my-3" v-if="index + 1 < localFilters.length"></v-divider>
                    </div>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" class="text-none" @click="applyFilters">Apply Filters</v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits, type PropType } from 'vue';
import type { Schema } from '~/types/shared/reportSchema'
import { useValidation } from '~/composables/formValidation';
import type { ReportTemplate, NestedJsonTable } from '@/types/maintenance/reportTemplate';

const validation = useValidation();

// Define props and emits
const props = defineProps({
    template: {
        type: Object as PropType<ReportTemplate>,
        required: true,
    },
    jsonFilters: {
        type: Array,
        default: () => [],
    },
    selectedColumns: {
        type: Array as () => Array<{ title: string; key: string }>,
        default: () => [],
    },
    schema: {
        type: Object as PropType<Schema>,
        required: true
    },
});

const emit = defineEmits(['applyFilters'])

const dialog = ref(false);
const localFilters = ref<any[]>([])
const localJsonFilters = ref<any[]>([])

watch(() => dialog.value, (newVal) => {
    if (newVal) {
        localFilters.value = JSON.parse(JSON.stringify(props.template.filters))   //could also use structuredClone(props.filters)
        localJsonFilters.value = JSON.parse(JSON.stringify(props.template.jsonFilters))
    }
})

const applyFilters = () => {
    emit("applyFilters", [localFilters.value, localJsonFilters.value])
    dialog.value = false
}

// Operators for filters
const filterOperators = [
    { title: 'Equals', value: '=' },
    { title: 'Not Equals', value: '!=' },
    { title: 'Greater Than', value: '>' },
    { title: 'Less Than', value: '<' },
    { title: 'Greater or Equal', value: '>=' },
    { title: 'Less or Equal', value: '<=' },
    { title: 'Between', value: 'between' },
    { title: 'In', value: 'in' },
    { title: 'Not In', value: 'not in' },
];

// Filter types
const filterTypes = [
    { title: 'DateTime', value: 'datetime-local' },
    { title: 'Date', value: 'date' },
    { title: 'Text', value: 'text' },
    { title: 'Number', value: 'number' },
];

const getOperatorTitle = (value: string) => {
    return filterOperators.find(item => item.value == value)?.title
}

// const getFilterTypeTitle = (value: string) => {
//     return filterTypes.find(item => item.value == value)?.title
// }

const getTableDisplayName = (value: string) => {
    return props.schema?.tables[value]?.displayName
}

const getJsonTableDisplayName = (jsonTableName: string) => {
    return props.schema?.tables?.[props.template.masterTable]?.jsonTables?.[jsonTableName]?.displayName
}

const getColumnDisplayName = (tableColumn: string) => {
    return props.selectedColumns.find(column => column.key == tableColumn)?.title
}

const getJsonColumnDisplayName = (tableColumn: string) => {
    let fullColumnName = `${props.template.masterJsonTable?.name}.${tableColumn}`
    return getColumnDisplayName(fullColumnName)
}

</script>