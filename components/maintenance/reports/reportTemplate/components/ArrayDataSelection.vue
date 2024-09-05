<template>
    <div class="ma-3 border border-opacity-50 rounded">
        <v-divider></v-divider>
        <v-card-title>Array Data Selection</v-card-title>
        <v-card-text>
            <v-row>
                <v-col cols="12">
                    <v-autocomplete density="compact" variant="outlined" v-model="template.arrayDataSelection"
                        item-title="title" item-value="value" :items="getAllArrayDataColumns" label="Select Columns"
                        multiple />
                </v-col>
            </v-row>
            <template v-for="(column, i) in template.arrayDataSelection || []" :key="i">
                <v-row>
                    <v-col cols="12" md="2">
                        <v-select variant="outlined" label="Return Entries*" item-title="title" item-value="value"
                            v-model="template.arrayDataSelection[i].distinctValues"
                            :items="[{ title: 'Distinct', value: true }, { title: 'All', value: false }]"
                            density="compact"></v-select>
                    </v-col>
                    <v-col cols="12" md="2">
                        <v-text-field density="compact" variant="outlined"
                            v-model="template.arrayDataSelection[i].displayName" label="Column*" readonly
                            hint="readonly"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2">
                        <v-select v-model="template.arrayDataSelection[i].operation" density="compact"
                            variant="outlined" label="Operation*" :items="getOperations(column)"
                            :rules="[validation.required]"></v-select>
                    </v-col>
                    <v-col cols="12" md="2" v-if="template.arrayDataSelection[i].operation == 'select'">
                        <v-text-field density="compact" variant="outlined" label="Separator"
                            v-model="template.arrayDataSelection[i].defaultSeparator" placeholder="/"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2" v-if="template.arrayDataSelection[i].operation == 'count'">
                        <v-select density="compact" variant="outlined" item-title="title" item-value="value"
                            label="Custom Labels*" v-model="template.arrayDataSelection[i].customLabels"
                            :items="[{ title: 'Yes', value: true }, { title: 'No', value: false }]"></v-select>
                    </v-col>
                    <v-col cols="12" md="2"
                        v-if="template.arrayDataSelection[i].operation == 'count' && template.arrayDataSelection[i].customLabels">
                        <v-text-field density="compact" variant="outlined" label="Count = 0 Label"
                            v-model="template.arrayDataSelection[i].itemsUnavailableLabel"
                            placeholder="No"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="2"
                        v-if="template.arrayDataSelection[i].operation == 'count' && template.arrayDataSelection[i].customLabels">
                        <v-text-field density="compact" variant="outlined" label="Count >= 1 Label"
                            v-model="template.arrayDataSelection[i].itemsAvailableLabel"
                            placeholder="Yes"></v-text-field>
                    </v-col>
                    <v-divider></v-divider>
                </v-row>
            </template>

        </v-card-text>
    </div>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import type { Schema } from '~/types/shared/reportSchema'
import type { ReportTemplate } from '~/types/maintenance/reportTemplate';
import { useValidation } from '~/composables/formValidation';

const validation = useValidation();

const props = defineProps({
    template: {
        type: Object as PropType<ReportTemplate>,
        required: true,
    },
    schema: {
        type: Object as PropType<Schema>,
        required: true
    }
})


const getAllArrayDataColumns = computed(() => {
    const arrayData = props.schema.tables?.[props.template.masterTable]?.arrayDataSelection
    if (!arrayData) return [];
    return Object.entries(arrayData)?.map(([arrayKey, arrayDataValue]) => ({
        title: (arrayDataValue as any).displayName,
        value: arrayDataValue,
    }));
})

const getOperations = (columns: Record<string, any>) => {
    let options = []
    if (columns.isSelectable) {
        options.push({ value: 'select', title: 'Select' })
    }
    if (columns.isCountable) {
        options.push({ value: 'count', title: 'Count' })
    }
    return options
}
</script>