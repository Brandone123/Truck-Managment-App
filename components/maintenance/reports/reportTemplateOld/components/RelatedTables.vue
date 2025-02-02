<template>
    <v-card>
        <v-card-title class="d-flex">
            Related Tables
            <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
            <div v-for="(table, index) in template.relatedTables " :key="index">
                <v-row>
                    <v-col cols="12">
                        <v-autocomplete density="compact" :rules="[validation.required]" variant="outlined"
                            v-model="table.name" :items="tables" item-title="title" item-value="value"
                            label="Related Table*"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-autocomplete density="compact" :rules="[validation.required]" variant="outlined"
                            v-model="table.bindColumn" :items="getAllTableColumns(table.name)" item-title="title"
                            item-value="value" label="Related Table Key*"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-autocomplete density="compact" :rules="[validation.required]" variant="outlined"
                            v-model="table.referenceColumn" :items="getAllTableColumns(template.masterTable)"
                            item-title="title" item-value="value" label="Master Table Key*"></v-autocomplete>
                    </v-col>
                    <v-col cols="12">
                        <v-autocomplete density="compact" :rules="[validation.required]" variant="outlined"
                            v-model="table.columns" :items="getAllTableColumns(table.name)" item-title="title"
                            item-value="value" label="Display Columns*" multiple>
                            <template v-slot:prepend-item>
                                <v-list-item @click="toggleColumns(table)" style="padding: 0;" title="Select All">
                                    <template v-slot:prepend>
                                        <v-checkbox-btn :color="likesSomeColumns1 ? 'indigo-darken-4' : undefined"
                                            :indeterminate="likesSomeColumns1 && !likesAllColumns1"
                                            :model-value="likesAllColumns1"></v-checkbox-btn>
                                    </template>
                                </v-list-item>
                                <v-divider></v-divider>
                            </template>
                        </v-autocomplete>
                    </v-col>
                </v-row>
                <v-btn @click="removeRelatedTable(index)">Remove</v-btn>
                <v-divider class="my-2"></v-divider>
            </div>
            <div class="d-flex justify-center">
                <v-btn color="primary" @click="addRelatedTable">Add Related Table</v-btn>
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue';
import { useValidation } from '~/composables/formValidation';

const validation = useValidation();


// Define props and emits
const props = defineProps({
    template: {
        type: Object,
        default: () => [],
    },
    getAllTableColumns: {
        type: Function,
        required: true,
    },
    tables: {
        type: Array,
        required: true,
    }

});

const emit = defineEmits(['update:relatedTables']);

const likesAllColumns1 = ref(false);
const likesSomeColumns1 = ref(false);

// Method to add a new filter
const addRelatedTable = () => {
    if (!Array.isArray(props.template.relatedTables)) {
        emit('update:relatedTables', [])
    }
    emit('update:relatedTables', [
        ...props.template.relatedTables,
        {
            name: '',
            bindColumn: '',
            referenceColumn: '',
            columns: []
        },
    ]);
};

const removeRelatedTable = (index: number) => {
    const newRelatedTables = [...props.template.relatedTables];
    newRelatedTables.splice(index, 1);
    emit('update:relatedTables', newRelatedTables);
};

const toggleColumns = (table: any) => {
    const allColumns = props.getAllTableColumns(table.name).map((item: any) => item.value);
    const currentColumns = table.columns;

    if (currentColumns.length === allColumns.length) {
        table.columns = []; // Désélectionner tout
    } else {
        table.columns = allColumns; // Sélectionner tout
    }

    likesSomeColumns1.value = table.columns.length > 0 && table.columns.length < allColumns.length;
};
</script>