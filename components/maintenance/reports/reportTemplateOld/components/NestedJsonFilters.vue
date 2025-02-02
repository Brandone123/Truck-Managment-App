<template>
    <v-card>
        <v-card-title>Nested Data Filters</v-card-title>
        <v-card-text>
            <div v-for="(filter, index) in template.jsonFilters" :key="index" class="d-flex align-center mb-2">
                <v-card flat variant="outlined" class="flex-grow-1">
                    <v-card-text>
                        <v-checkbox v-model="filter.required" hide-details label="Required"
                            color="primary"></v-checkbox>
                        <v-row>
                            <v-col cols="3">
                                <v-select hide-details density="compact" variant="outlined" v-model="filter.column"
                                    :items="jsonTableSelectedColumns" item-title="title" item-value="value"
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
    getAllJsonTableColumns: {
        type: Function,
        required: true,
    },
    getJsonTableSelectedColumns: {
        type: Function,
        required: true,
    },
    jsonTableFilters: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['update:jsonFilters']);

// Operators for jsonFilters
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
    if (!Array.isArray(props.template.jsonFilters)) {
        emit('update:jsonFilters', [])
    }
    emit('update:jsonFilters', [
        ...props.template.jsonFilters,
        {
            // table: '',
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
    const newFilters = [...props.template.jsonFilters];
    newFilters.splice(index, 1);
    emit('update:jsonFilters', newFilters);
};


// const jsonTableAllColumns = computed(() => {
//     return props.getAllJsonTableColumns(props.template.masterTable, props.template.masterJsonTable?.name || '').map((item: any) => {
//         return { title: item.title, value: item.value.name }
//     })
// })

const jsonTableSelectedColumns = computed(() => {
    return props.getJsonTableSelectedColumns(props.template.masterTable, props.template.masterJsonTable?.name || '').map((item: any) => {
        return { title: item.title, value: item.value.name }
    })
})
</script>