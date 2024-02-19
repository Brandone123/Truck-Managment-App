<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { defineProps, getCurrentInstance, defineEmits } from 'vue'
import { useTheme } from "vuetify";


interface filterItemOptionObject {
    value: String;
    text: String;
}

interface filterItem {
    title: String;  // display title the filter item
    value: String; // column being filtered
    items: filterItemOptionObject[] | string[];
    width?: String; //e.g. '150px'
}

const props = defineProps({
    headers: Array,
    items: {
        type: Array,
        default: []
    },
    filters: Array<filterItem>,
    dateSelectorKey: String,
});

const theme = useTheme();
const primary = theme.current.value.colors.primary;

//store selected filter values
const selectedFilterValues = ref<{ [key: string]: string | null }>({});


</script>

<template>
    <v-data-table :hover="true" :headers="(headers as Array<any>)"
        :items="(items as Array<any>)" density="compact">
        <template v-slot:loading>
            <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
        </template>
        <template v-slot:bottom>
        </template>

        <!--Default slots here -->
        <template v-for="(  _, slot) in $slots" v-slot:[slot]="slotProps">
            <slot :name="slot" v-bind="slotProps" v-if="slot"></slot>
        </template>
    </v-data-table>
</template> 


<style scoped>
.v-table.v-data-table :deep() td,
.v-table.v-data-table :deep() th {
    background-color: white !important;
}

.v-table.v-data-table,
.v-table.v-data-table :deep() tr {
    background-color: transparent !important;
    margin-bottom: 3px transparent !important;
}

/* .v-table.v-data-table :deep() tr th:first-child */
.v-table.v-data-table :deep() tr td:first-child {
    border-top-left-radius: 4px !important;
    border-bottom-left-radius: 4px !important;
}

/* .v-table.v-data-table :deep() tr th:last-child, */
.v-table.v-data-table :deep() tr td:last-child {
    border-top-right-radius: 4px !important;
    border-bottom-right-radius: 4px !important;
}

/* color for header line when not sticky */
.v-table.v-data-table:not(.sticky-active) :deep() thead tr th {
    /* border-bottom: 2px solid rgb(var(--v-theme-primary)) !important; */

    background-image: linear-gradient(to bottom, rgb(var(--v-theme-primary)) 2px, transparent 2px);
    background-position: bottom;
    background-size: 100% 2px;
    background-repeat: no-repeat;
}

/* color for header line when sticky  */
.v-table.v-data-table.sticky-active :deep() thead tr th {
    background-image: linear-gradient(to bottom, blue 2px, transparent 2px);
    background-position: bottom;
    background-size: 100% 2px;
    background-repeat: no-repeat;
}

</style>