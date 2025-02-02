<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { listDomains, listTables, listColumns } from '@/utils/databaseSchema'

// Reactive state for selected values
const selectedDomain = ref<string>('')
const selectedTable = ref<string>('')
const selectedColumn = ref<string>('')

/**
 * domainItems:
 *   - We get an array of domain names: ["shared", "maintenance", ...]
 *   - Convert each to { text: domainName, value: domainName } so that
 *     the 'text' is shown in the UI, and the 'value' is stored in selectedDomain.
 */
const domainItems = computed(() =>
    listDomains().map((domainName) => ({
        text: domainName,
        value: domainName,
    }))
)

/**
 * tableItems:
 *   - If no domain is selected, return empty array.
 *   - Otherwise, get the tables in that domain.
 *     We convert each Table to { text: displayedName, value: table.value }.
 */
const tableItems = computed(() => {
    if (!selectedDomain.value) return []
    const tables = listTables(selectedDomain.value)
    return tables.map((table) => ({
        text: table.displayedName,
        value: table.value,
    }))
})

/**
 * columnItems:
 *   - If no domain or table is selected, return empty array.
 *   - Otherwise, fetch columns in that table,
 *     converting each to { text: displayedName, value: column.value }.
 */
const columnItems = computed(() => {
    if (!selectedDomain.value || !selectedTable.value) return []
    const cols = listColumns(selectedDomain.value, selectedTable.value)
    return cols.map((col) => ({
        text: col.displayedName,
        value: col.value,
    }))
})

/**
 * Watchers to clear dependent selections:
 *  - If the user changes the Domain, clear Table & Column.
 *  - If the user changes the Table, clear Column.
 */
watch(selectedDomain, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        selectedTable.value = ''
        selectedColumn.value = ''
    }
})

watch(selectedTable, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        selectedColumn.value = ''
    }
})
</script>

<template>
    <card flat class="outlined">
        <!-- Domain Autocomplete -->
        <v-autocomplete variant="outlined" density="compact" v-model="selectedDomain" :items="domainItems" item-title="text" item-value="value"
            label="Select Domain" clearable class="mb-4">
        </v-autocomplete>

        <!-- Table Autocomplete -->
        <v-autocomplete variant="outlined" density="compact" v-model="selectedTable" :items="tableItems" item-title="text" item-value="value"
            label="Select Table" clearable class="mb-4" :disabled="!selectedDomain">
        </v-autocomplete>

        <!-- Column Autocomplete -->
        <v-autocomplete variant="outlined" density="compact" v-model="selectedColumn" :items="columnItems" item-title="text" item-value="value"
            label="Select Column" clearable class="mb-4" :disabled="!selectedTable">
        </v-autocomplete>

    </card>
</template>
