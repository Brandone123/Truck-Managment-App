<template>
  <v-container>
    <v-row>
      <!-- Column 1: Table and Column Selection -->
      <v-col cols="4">
        <v-card>
          <v-card-title>Select Tables and Columns</v-card-title>
          <v-card-text>
            <v-form>
              <v-row v-for="(selectedTable, index) in selectedTables" :key="index" align="center">
                <v-col cols="8">
                  <v-select
                    v-model="selectedTable.table"
                    :items="availableTables"
                    item-title="displayName"
                    item-value="name"
                    label="Select Table"
                    dense
                    @change="updateColumns(index)"
                  ></v-select>
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="selectedTable.columns"
                    :items="getColumnsForTable(selectedTable.table)"
                    item-title="label"
                    item-value="value"
                    label="Select Columns"
                    multiple
                    dense
                  ></v-select>
                </v-col>
                <v-col cols="2">
                  <v-btn
                    @click="removeTable(index)"
                    icon
                    :disabled="isTableInUse(selectedTable.table)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-btn @click="addTable" icon>
                <v-icon>mdi-plus</v-icon>
                Add Table
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Column 2: Conditions Input -->
      <v-col cols="8">
        <v-card>
          <v-card-title>Conditions</v-card-title>
          <v-card-text>
            <v-btn @click="addCondition" icon>
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-row v-for="(condition, index) in conditions" :key="index" align="center">
              <v-col cols="3">
                <v-select
                  v-model="condition.leftTable"
                  :items="getUsedTables"
                  item-title="displayName"
                  item-value="name"
                  label="Left Table"
                  dense
                  @change="updateConditionColumns(index, 'left')"
                ></v-select>
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="condition.leftColumn"
                  :items="getColumnsForTable(condition.leftTable)"
                  item-title="label"
                  item-value="value"
                  label="Left Column"
                  dense
                ></v-select>
              </v-col>
              <v-col cols="2">
                <v-select
                  v-model="condition.operator"
                  :items="conditionOperators"
                  item-title="label"
                  item-value="value"
                  label="Operator"
                  dense
                ></v-select>
              </v-col>
              <v-col cols="2">
                <v-select
                  v-model="condition.valueType"
                  :items="valueTypes"
                  item-title="label"
                  item-value="value"
                  label="Value Type"
                  dense
                ></v-select>
              </v-col>
              <v-col cols="3" v-if="condition.valueType === 'static'">
                <v-text-field
                  v-model="condition.staticValue"
                  label="Static Value"
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="3" v-if="condition.valueType === 'column'">
                <v-select
                  v-model="condition.rightTable"
                  :items="getUsedTables"
                  item-title="displayName"
                  item-value="name"
                  label="Right Table"
                  dense
                  @change="updateConditionColumns(index, 'right')"
                ></v-select>
              </v-col>
              <v-col cols="3" v-if="condition.valueType === 'column'">
                <v-select
                  v-model="condition.rightColumn"
                  :items="getColumnsForTable(condition.rightTable)"
                  item-title="label"
                  item-value="value"
                  label="Right Column"
                  dense
                ></v-select>
              </v-col>
              <v-col cols="1">
                <v-btn @click="removeCondition(index)" icon>
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Column 3: Filters -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Filters</v-card-title>
          <v-card-text>
            <v-btn @click="addFilter" icon>
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-row v-for="(filter, index) in filters" :key="index" align="center">
              <v-col cols="2">
                <v-select
                  v-model="filter.table"
                  :items="getUsedTables"
                  item-title="displayName"
                  item-value="name"
                  label="Table"
                  dense
                  @change="updateFilterColumns(index)"
                ></v-select>
              </v-col>
              <v-col cols="2">
                <v-select
                  v-model="filter.column"
                  :items="getColumnsForTable(filter.table)"
                  item-title="label"
                  item-value="value"
                  label="Column"
                  dense
                ></v-select>
              </v-col>
              <v-col cols="2">
                <v-select
                  v-model="filter.type"
                  :items="filterTypes"
                  item-title="label"
                  item-value="value"
                  label="Type"
                  dense
                ></v-select>
              </v-col>
              <v-col cols="2">
                <v-select
                  v-model="filter.operator"
                  :items="filterOperators"
                  item-title="label"
                  item-value="value"
                  label="Operator"
                  dense
                ></v-select>
              </v-col>
              <v-col v-if="filter.operator === 'between'" cols="4">
                <v-text-field
                  v-model="filter.lowerBound"
                  :type="filter.type"
                  label="Lower Bound"
                  dense
                ></v-text-field>
                <v-text-field
                  v-model="filter.upperBound"
                  :type="filter.type"
                  label="Upper Bound"
                  dense
                ></v-text-field>
              </v-col>
              <v-col v-if="filter.operator === 'in' || filter.operator === 'not in'" cols="4">
                <v-text-field
                  v-model="filter.arrayValues"
                  label="Values (comma-separated)"
                  dense
                ></v-text-field>
              </v-col>
              <v-col v-if="filter.operator !== 'between' && filter.operator !== 'in' && filter.operator !== 'not in'" cols="4">
                <v-text-field
                  v-model="filter.value"
                  :type="filter.type"
                  label="Value"
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="1">
                <v-btn @click="removeFilter(index)" icon>
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Data Preview Section -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            Data Preview
            <v-spacer></v-spacer>
            <v-btn icon @click="refreshPreview">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="tableHeaders"
              :items="tableData"
              :items-per-page="5"
              class="elevation-1"
              dense
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>Modify Table Headers</v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-row>
                  <v-col v-for="(header, index) in tableHeaders" :key="index" cols="3">
                    <v-text-field
                      v-model="header.text"
                      label="Column Title"
                      dense
                    ></v-text-field>
                  </v-col>
                </v-row>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Button to Generate Report -->
    <v-btn class="mt-4" @click="generateReport">Generate Report</v-btn>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMaintenanceQueryBuilderSchema } from '@/data/reportSchemas/useMaintenanceQueryBuilderSchema';

// Importing schema using the helper function
const schema = useMaintenanceQueryBuilderSchema();

// State to hold selected tables and columns
const selectedTables = ref<Array<{ table: string; columns: string[] }>>([
  { table: '', columns: [] },
]);

// State to manage dynamic conditions
const conditions = ref<
  Array<{
    leftTable: string;
    leftColumn: string;
    operator: string;
    valueType: string;
    staticValue: string;
    rightTable: string;
    rightColumn: string;
  }>
>([]);

// State to manage filters
const filters = ref<
  Array<{
    table: string;
    column: string;
    type: string;
    operator: string;
    value: string;
    lowerBound?: string;
    upperBound?: string;
    arrayValues?: string;
  }>
>([]);

// Sample table data and headers for preview
const tableData = ref<Array<Record<string, any>>>([
  { id: 1, name: 'John Doe', age: 28, date: '2024-01-15' },
  { id: 2, name: 'Jane Smith', age: 34, date: '2024-02-21' },
]);

const tableHeaders = ref<Array<{ text: string; value: string }>>([
  { text: 'ID', value: 'id' },
  { text: 'Name', value: 'name' },
  { text: 'Age', value: 'age' },
  { text: 'Date', value: 'date' },
]);

// Operators for conditions
const conditionOperators = [
  { label: '<', value: '<' },
  { label: '<=', value: '<=' },
  { label: '=', value: '=' },
  { label: '>=', value: '>=' },
  { label: '>', value: '>' },
];

// Operators for filters
const filterOperators = [
  { label: 'Equals', value: '=' },
  { label: 'Not Equals', value: '!=' },
  { label: 'Greater Than', value: '>' },
  { label: 'Less Than', value: '<' },
  { label: 'Greater or Equal', value: '>=' },
  { label: 'Less or Equal', value: '<=' },
  { label: 'Between', value: 'between' },
  { label: 'In', value: 'in' },
  { label: 'Not In', value: 'not in' },
];

// Filter types
const filterTypes = [
  { label: 'DateTime', value: 'datetime-local' },
  { label: 'Date', value: 'date' },
  { label: 'Text', value: 'text' },
  { label: 'Number', value: 'number' },
];

// Value types for conditions
const valueTypes = [
  { label: 'Static', value: 'static' },
  { label: 'Column', value: 'column' },
];

// Compute available tables
const availableTables = computed(() => {
  return Object.keys(schema.tables).map((tableName) => ({
    name: tableName.toLowerCase(),
    displayName: schema.tables[tableName]?.displayName || tableName,
  }));
});

// Compute used tables
const getUsedTables = computed(() => {
  return selectedTables.value.map((selected) => ({
    name: selected.table,
    displayName: schema.tables[selected.table]?.displayName || selected.table,
  }));
});

// Get columns for a selected table
const getColumnsForTable = (tableName: string) => {
  const table = schema.tables[tableName];
  if (!table) return [];
  return Object.entries(table.columns).map(([colName, colDisplayName]) => ({
    label: colDisplayName,
    value: colName.toLowerCase(),
  }));
};

// Method to add a new table
const addTable = () => {
  selectedTables.value.push({ table: '', columns: [] });
};

// Method to remove a table
const removeTable = (index: number) => {
  if (!isTableInUse(selectedTables.value[index].table)) {
    selectedTables.value.splice(index, 1);
  }
};

// Method to check if a table is in use by conditions or filters
const isTableInUse = (table: string) => {
  return conditions.value.some(
    (cond) => cond.leftTable === table || cond.rightTable === table
  ) || filters.value.some((filter) => filter.table === table);
};

// Method to update columns when a table is selected
const updateColumns = (index: number) => {
  selectedTables.value[index].columns = [];
};

// Method to add a new condition
const addCondition = () => {
  conditions.value.push({
    leftTable: '',
    leftColumn: '',
    operator: '=',
    valueType: 'static',
    staticValue: '',
    rightTable: '',
    rightColumn: '',
  });
};

// Method to remove a condition
const removeCondition = (index: number) => {
  conditions.value.splice(index, 1);
};

// Method to update condition columns when a table is changed
const updateConditionColumns = (index: number, side: 'left' | 'right') => {
  if (side === 'left') {
    conditions.value[index].leftColumn = '';
  } else {
    conditions.value[index].rightColumn = '';
  }
};

// Method to add a new filter
const addFilter = () => {
  filters.value.push({
    table: '',
    column: '',
    type: 'text',
    operator: '=',
    value: '',
  });
};

// Method to remove a filter
const removeFilter = (index: number) => {
  filters.value.splice(index, 1);
};

// Method to update filter columns when a table is changed
const updateFilterColumns = (index: number) => {
  filters.value[index].column = '';
};

// Method to refresh data preview
const refreshPreview = () => {
  // Simulate refreshing data based on the selected columns, conditions, and filters
  console.log('Refreshing data preview with selected options...');
};

// Method to generate report
const generateReport = () => {
  const payload = {
    columns: selectedTables.value.flatMap((table) =>
      table.columns.map((col) => `${table.table}.${col}`)
    ),
    conditions: conditions.value.map((cond) => ({
      leftTable: cond.leftTable,
      leftColumn: cond.leftColumn,
      operator: cond.operator,
      valueType: cond.valueType,
      value:
        cond.valueType === 'static'
          ? cond.staticValue
          : `${cond.rightTable}.${cond.rightColumn}`,
    })),
    filters: filters.value.map((filter) => ({
      table: filter.table,
      column: filter.column,
      type: filter.type,
      operator: filter.operator,
      value: filter.operator === 'between'
        ? [filter.lowerBound, filter.upperBound]
        : filter.operator === 'in' || filter.operator === 'not in'
        ? filter.arrayValues?.split(',').map((val) => val.trim())
        : filter.value,
    })),
  };

  // Fetch API call to the Laravel backend
  fetch('/generate-report', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Report generated:', data);
    })
    .catch((error) => {
      console.error('Error generating report:', error);
    });
};
</script>

<style scoped>
h3 {
  margin-bottom: 10px;
}
</style>
