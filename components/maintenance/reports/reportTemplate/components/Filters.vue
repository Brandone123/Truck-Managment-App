<template>
    <v-card>
        <v-card-title>Filters</v-card-title>
        <v-card-text>
            <div v-for="(filter, index) in template.filters" :key="index" class="d-flex align-center mb-2">
                <v-card flat variant="outlined" class="flex-grow-1">
                    <v-card-text>
                        <v-checkbox v-model="filter.required" hide-details label="Required"
                            color="primary"></v-checkbox>
                        <v-row>
                            <v-col cols="3">
                                <v-select hide-details density="compact" variant="outlined" v-model="filter.table"
                                    :items="getUsedTables" item-title="title" item-value="value" label="Table*" dense
                                    @change="updateFilterColumns(index)"></v-select>
                            </v-col>
                            <v-col cols="3">
                                <v-select hide-details density="compact" variant="outlined" v-model="filter.column"
                                    :items="getTableSelectedColumns(filter.table)" item-title="title" item-value="value"
                                    label="Column*" dense></v-select>
                            </v-col>
                            <v-col cols="3">
                                <v-select hide-details density="compact" variant="outlined" v-model="filter.type"
                                    :items="filterTypes" item-title="title" item-value="value" label="Type"
                                    dense></v-select>
                            </v-col>
                            <v-col cols="3">
                                <v-select hide-details density="compact" variant="outlined" v-model="filter.operator"
                                    :items="filterOperators" item-title="title" item-value="value" label="Operator"
                                    dense></v-select>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
                <v-tooltip text="Delete Filter">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" variant="text" @click="removeFilter(index)" icon color="error"
                            class="ml-1">
                            <v-icon>mdi-minus</v-icon>
                        </v-btn>
                    </template>
                </v-tooltip>
            </div>

            <div class="d-flex justify-center mt-3">
                <v-btn @click="addFilter" color="primary">
                    <v-icon>mdi-plus</v-icon>
                    Add Filter
                </v-btn>
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue';

// Define props and emits
const props = defineProps({
    template: {
        type: Object,
        default: () => [],
    },
    getUsedTables: {
        type: Array,
        required: true,
        default: () => [],
    },
    getTableSelectedColumns: {
        type: Function,
        required: true,
    },
    jsonTableFilters: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['update:filters']);

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

// Method to add a new filter
const addFilter = () => {
    if(!Array.isArray(props.template.filters)){
        emit('update:filters', [])
    }
    emit('update:filters', [
        ...props.template.filters,
        {
            table: '',
            column: '',
            type: 'text',
            operator: '=',
            required: true,
            // value: '',
        },
    ]);
};

// Method to remove a filter
const removeFilter = (index: number) => {
    const newFilters = [...props.template.filters];
    newFilters.splice(index, 1);
    emit('update:filters', newFilters);
};

// Method to update filter columns when a table is changed
const updateFilterColumns = (index: number) => {
    const newFilters = [...props.template.filters];
    newFilters[index].column = '';
    emit('update:filters', newFilters);
};
</script>