<template>
  <v-dialog :modelValue="modelValue" fullscreen scrollable>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-card flat rounded-0 style="position:sticky;top:-16px;z-index:1;" class="mt-n4 mx-n6 px-2 pt-2">
          <v-tabs v-model="step" density="compact" center-active color="primary">
            <v-tab :value="1" density="compact">
              Design
            </v-tab>
            <v-tab :value="2" density="compact">
              Preview
            </v-tab>
          </v-tabs>
        </v-card>

        <!-- <v-form ref="form" v-model="formIsValid"  @submit.prevent="saveTemplate" class="mt-3" fast-fail> -->
        <v-window v-model="step" class="mt-3">

          <!-- Template Builder Tab -->
          <v-window-item :value="1">
            <v-form ref="form" v-model="formIsValid" @submit.prevent="saveTemplate">
              <v-row>
                <v-col cols="12">
                  <v-card>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-text-field density="compact" variant="outlined" v-model="localTemplate.name"
                            label="Template Name*" :rules="[validation.required]" />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-autocomplete density="compact" variant="outlined" v-model="localTemplate.group"
                            label="Template Group*" :items="templateGroups" item-title="title" item-value="value"
                            :rules="[validation.required]"></v-autocomplete>
                        </v-col>
                        <v-col cols="12">
                          <v-textarea density="compact" variant="outlined" v-model="localTemplate.description"
                            label="Template Description*" :rules="[validation.required]" />
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>

               
                <v-col cols="12">
                  <v-card>
                    <v-card-title>Master Table
                      <DisplayModal title="Master Table Selection"
                        texts="This dropdown allows you to select the main data table that the report will be built around. Choose the table that contains the primary data for your report." />
                    </v-card-title>

                    <v-card-text>
                      <v-row>
                        <v-col cols="12">
                          <v-autocomplete density="compact" variant="outlined" v-model="localTemplate.masterTable"
                            item-title="title" item-value="value" :items="tables" label="Select Master Table*"
                            :rules="[validation.required]" />
                        </v-col>
                        <v-col cols="12" class="pt-0">
                          <v-autocomplete density="compact" variant="outlined"
                            v-model="localTemplate.masterTableColumns"
                            :items="getAllTableColumns(localTemplate.masterTable)" label="Master Table Columns*"
                            multiple item-title="title" item-value="value" :rules="[validation.required]" clearable>
                            <template v-slot:prepend-item>
                              <v-list-item @click="toggle" style="padding: 0;" title="Select All">
                                <template v-slot:prepend>
                                  <v-checkbox-btn :color="selectSomeColumns ? 'indigo-darken-4' : undefined"
                                    :indeterminate="selectSomeColumns && !selectAllColumns"
                                    :model-value="selectAllColumns"></v-checkbox-btn>
                                </template>
                              </v-list-item>
                              <v-divider></v-divider>
                            </template>
                          </v-autocomplete>
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <v-expand-transition>
                      <div v-if="masterTableHasJsonData" class="ma-3 border border-opacity-50 rounded">
                        <v-divider></v-divider>
                        <v-card-title>Nested Data
                          <DisplayModal title="Nested Data Selection"
                            texts='Select the nested data source if your master table contains nested data. This allows you to further refine the data by choosing additional related tables and columns.' />
                        </v-card-title>
                        <v-card-text>
                          <v-row>
                            <v-col cols="12">
                              <v-autocomplete density="compact" variant="outlined"
                                v-model="localTemplate.masterJsonTable"
                                :items="getAllJsonTables(localTemplate.masterTable)" label="Data Source"
                                item-title="title" item-value="value" clearable>
                              </v-autocomplete>
                            </v-col>
                            <!-- <v-col cols="12">
                              <v-row>
                                <v-col cols="6" md="4">
                                  <v-select density="compact" variant="outlined" label="Action" :items="['select','count']"></v-select>
                                </v-col>
                                <v-col cols="6" md="4">
                                  <v-text-field density="compact" variant="outlined" label="Custom Separator"></v-text-field>
                                </v-col>
                                <v-col cols="6" md="4">

                                </v-col>
                              </v-row>
                            </v-col> -->
                            <v-col cols="12">
                              <v-autocomplete density="compact" variant="outlined"
                                v-model="localTemplate.masterJsonTableColumns"
                                :items="getAllJsonTableColumns(localTemplate.masterTable, localTemplate.masterJsonTable?.name || '')"
                                label="Columns" item-title="title" item-value="value" multiple clearable>
                              </v-autocomplete>
                            </v-col>

                            <!-- <v-col>
                              <v-row v-for="(column, i) in localTemplate.masterJsonTableColumns" :key="i"
                                v-if="column.isArray">
                                <v-col cols="12" md="4">
                                  <v-text-field density="compact" variant="outlined"
                                    v-model="localTemplate.masterJsonTableColumns[i].displayName"
                                    :label="column.displayName"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                  <v-select density="compact" variant="outlined" label="Operation"
                                    :items="['Select', 'Count']"></v-select>
                                </v-col>
                                <v-col cols="12" md="4">
                                  <v-text-field density="compact" variant="outlined" label="Separator"></v-text-field>
                                </v-col>
                              </v-row>
                            </v-col> -->
                          </v-row>
                        </v-card-text>
                      </div>
                    </v-expand-transition>

                    <v-expand-transition>
                      <ArrayDataSelection :template="localTemplate" :schema="schema"
                        v-if="masterTableHasArrayDataSelection" />
                    </v-expand-transition>
                  </v-card>
                </v-col>

                <!-- Related Tables -->
                <v-col cols="12">

                  <RelatedTables :tables="tables" :template="localTemplate" :getAllTableColumns="getAllTableColumns"
                    @update:relatedTables="(newTables) => localTemplate.relatedTables = newTables" />

                </v-col>

                <!-- Nested Data Related Tables -->
                <v-col cols="12">
                  <NestedJsonRelatedTables :tables="tables" :template="localTemplate"
                    :getAllTableColumns="getAllTableColumns" :getJsonTableSelectedColumns="getJsonTableSelectedColumns"
                    @update:masterJsonRelatedTables="(newTables) => localTemplate.masterJsonRelatedTables = newTables" />
                </v-col>



                <!-- Filters Component -->
                <v-col cols="12">
                  <Filters :template="localTemplate" :getTableSelectedColumns="getTableSelectedColumns"
                    :getUsedTables="getUsedTables"
                    @update:filters="(newFilters) => localTemplate.filters = newFilters" />
                </v-col>

                <!-- Nested JSON Filters -->
                <v-col cols="12" v-if="masterTableHasJsonData">
                  <NestedJsonFilters :template="localTemplate"
                    :getJsonTableSelectedColumns="getJsonTableSelectedColumns"
                    :getAllJsonTableColumns="getAllJsonTableColumns" :getUsedTables="getUsedTables"
                    @update:jsonFilters="(newFilters) => localTemplate.jsonFilters = newFilters" />
                </v-col>
              </v-row>
            </v-form>
          </v-window-item>

          <!-- Data Preview Tab -->
          <v-window-item :value="2">
            <v-row>
              <v-col cols="12" v-if="formIsValid">
                <TemplatePreview :selectedColumns="selectedColumns" @update:selectedColumns="selectedColumns = $event"
                  :template="localTemplate" :schema="schema" />
              </v-col>
              <v-col cols="12" v-else>
                <div class="d-flex justify-center">
                  <span>Some required fields are missing</span>
                </div>
              </v-col>
            </v-row>
          </v-window-item>
        </v-window>
        <!-- </v-form> -->
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn @click="closeDialog">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" type="submit" @click="saveTemplate">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import Filters from './components/Filters.vue'
import NestedJsonFilters from './components/NestedJsonFilters.vue'
import RelatedTables from './components/RelatedTables.vue'
import NestedJsonRelatedTables from './components/NestedJsonRelatedTables.vue'
import TemplatePreview from './components/TemplatePreview.vue'
import ArrayDataSelection from './components/ArrayDataSelection.vue';
import { useValidation } from '~/composables/formValidation';
import { useMaintenanceQueryBuilderSchema } from '@/data/reportSchemas/useMaintenanceQueryBuilderSchema.ts';
import type { Schema } from '~/types/shared/reportSchema.ts'
import type { ReportTemplate, NestedJsonTable } from '@/types/maintenance/reportTemplate';
import DisplayModal from './components/DisplayModal.vue';


interface SelectItem {
  value: string;
  text: string;
}

// Importing schema using the helper function
const schema: Schema = useMaintenanceQueryBuilderSchema();

const validation = useValidation();

const props = defineProps({
  modelValue: Boolean,
  templateGroups: Array,
  template: {
    type: Object as PropType<Partial<ReportTemplate>>

  }
});

const emit = defineEmits(['update:modelValue', 'save']);

const selectedColumns = ref<{ title: string, key: string, disabled: boolean }[]>([]);

const selectAllColumns = ref(false);
const selectSomeColumns = ref(false);

const step = ref(1);
const formIsValid = ref(false);

const groupToMasterTableMapping = {
  vehicles: 'maintenance_vehicles',
  inspections: 'maintenance_inspections',
  issues: 'maintenance_issues',
  work_orders: 'maintenance_work_orders',
  contacts: 'maintenance_profiles',
  parts: 'maintenance_parts',
  service: 'maintenance_service_histories',
};

const toggle = () => {
  const allColumns = getAllTableColumns(localTemplate.value.masterTable).map(item => item.value);
  selectAllColumns.value = !selectAllColumns.value;

  if (selectAllColumns.value) {
    localTemplate.value.masterTableColumns = allColumns; // Sélectionner tout
  } else {
    localTemplate.value.masterTableColumns = []; // Désélectionner tout
  }

  selectSomeColumns.value = localTemplate.value.masterTableColumns.length > 0 && localTemplate.value.masterTableColumns.length < allColumns.length;
};


const localTemplate = ref<ReportTemplate>(props.template as ReportTemplate);

const form = ref<HTMLFormElement | null>(null)

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    updateLocalTemplate()
  }
})

const updateLocalTemplate = () => {
  localTemplate.value = JSON.parse(JSON.stringify(props.template))
  selectedColumns.value = JSON.parse(JSON.stringify(props.template?.columnHeaders || []))
}

// used to facilitate watching two values simultaneously
const onEditTemplate = computed(() => {
  return [props.modelValue, localTemplate.value.masterTable]
})

watch(() => onEditTemplate.value, ([modelValue, masterTable], [oldModelValue, oldMasterTable]) => {
  if (Boolean(modelValue) && Boolean(oldModelValue) && Boolean(masterTable) && masterTable != oldMasterTable) {
    //onMasterTableSelection()
  }
}, { immediate: false })

const onMasterTableSelection = () => {
  localTemplate.value.masterTableColumns = []
  localTemplate.value.masterJsonTable = null
  localTemplate.value.masterJsonTableColumns = []
  localTemplate.value.relatedTables = localTemplate.value.relatedTables.map((table) => {
    return { ...table, bindColumns: null }
  })
  localTemplate.value.filters = []
}

// const tables = computed(() => reportTemplateStore.getFormattedTables)

const tables = computed(() => {
  return Object.keys(schema.tables).map((tableName) => ({
    value: tableName.toLowerCase(),
    title: schema.tables[tableName]?.displayName || tableName,
  }));
});

const title = computed(() => {
  return localTemplate.value.id ? 'Edit Report Template' : 'Create New Report Template'
})

const masterTableHasJsonData = computed(() => {
  return Boolean(schema.tables?.[localTemplate.value?.masterTable]?.jsonTables)
})

const masterTableHasArrayDataSelection = computed(() => {
  return Boolean(schema.tables?.[localTemplate.value?.masterTable]?.arrayDataSelection)
})

// const getAllTableColumns = (tableName: any) => {
//   if (tableName) {
//     const table = tables.value.find(t => t.table_name === tableName);
//     return table ? table.columns : []
//   }
//   return []
// };

// Get columns for a selected table
const getAllTableColumns = (tableName: string) => {
  const table = schema.tables[tableName];
  if (!table) return [];
  return Object.entries(table.columns).map(([colName, colDisplayName]) => ({
    title: colDisplayName,
    value: `${tableName}.${colName}`,
  }));
}

const getAllJsonTables = (tableName: string) => {
  const table = schema.tables[tableName];
  if (!table || !table.jsonTables) return [];
  return Object.entries(table.jsonTables)?.map(([tableName, tableData]) => ({
    title: (tableData as any).displayName,
    value: { name: tableName, inArray: (tableData as any).inArray, root: (tableData as any).root },
  }));
}

const getAllJsonTableColumns = (masterTable: string, jsonTable: string) => {
  const table = schema.tables?.[masterTable]?.jsonTables?.[jsonTable];
  if (!table) return [];
  return Object.entries(table.columns)?.map(([tableName, tableData]) => ({
    title: (tableData as any).displayName,
    value: tableData,
  }));
}

const getTableSelectedColumns = (tableName: string) => {
  const tableColumns = getAllTableColumns(tableName)

  if (localTemplate.value.masterTable == tableName) {
    return tableColumns.filter((column: any) => localTemplate.value.masterTableColumns?.includes(column.value))
  }
  else {
    let response: { title: string, value: string }[] = []
    localTemplate.value.relatedTables?.forEach((table: any) => {
      if (table.name == tableName) {
        response = tableColumns.filter((column: any) => table.columns.includes(column.value))
        return // break out of forEach loop
      }
    })
    return response
  }
}

const getJsonTableSelectedColumns = (masterTableName: string, jsonTableName: string) => {
  const jsonTableColumns = getAllJsonTableColumns(masterTableName, jsonTableName)
  return jsonTableColumns.filter((column: any) => {
    return localTemplate.value.masterJsonTableColumns?.some((masterColumn: any) => masterColumn.path == column.value.path)
  })
}

// Compute used tables
const getUsedTables = computed(() => {
  let usedColumns = []
  if (localTemplate.value.masterTable) {
    let displayName = schema?.tables[localTemplate.value.masterTable]?.displayName
    if (displayName) {
      usedColumns.push({
        value: localTemplate.value.masterTable,
        title: displayName
      })
    }
  }

  (localTemplate.value.relatedTables || []).forEach((selected) => {
    let displayName = schema?.tables[selected.name]?.displayName
    if (displayName) {
      usedColumns.push({
        value: selected.name,
        title: displayName
      })
    }
  })
  return usedColumns
})

const validateForm = async () => {
  let formStatus = await form.value?.validate()
  console.log(formStatus)
  return formStatus.valid
}
const saveTemplate = async () => {
  let formValid = validateForm()
  if (!formValid) {
    return
  }

  // await reportTemplateStore.createTemplate(localTemplate.value as ReportTemplate);
  let payload = JSON.parse(JSON.stringify(localTemplate.value))

  updateSelectedColumns()
  payload.columnHeaders = JSON.parse(JSON.stringify(selectedColumns.value))

  if (!masterTableHasJsonData.value) {
    payload.masterJsonTable = {} as NestedJsonTable
    payload.masterJsonTableColumns = []
    payload.masterJsonRelatedTables = []
    payload.jsonFilters = []
  }

  emit('save', payload);
  // nextTick(() => {
  //   closeDialog();
  // })

  // close the idalog only if the form is valid
  nextTick(async () => {
    const formValid = await validateForm();
    if (formValid) {
      closeDialog();
    } else {
      console.log('Form is invalid, dialog cannot be closed.');
    }
  });

};


const closeDialog = () => {
  localTemplate.value = {} as ReportTemplate;
  emit('update:modelValue', false);
};

// onMounted(() => {
//   reportTemplateStore.fetchTablesAndColumns();
// });

// watch(() => localTemplate.value.group, (newGroup) => {
//   if (newGroup && groupToMasterTableMapping[newGroup]) {
//     localTemplate.value.masterTable = groupToMasterTableMapping[newGroup];
//   }
// });


// Watch for changes to selectedTables and columns
// watch(
//   () => [
//     localTemplate.value.masterTable,
//     localTemplate.value.masterTableColumns,
//     localTemplate.value.relatedTables
//   ],
//   () => {
//     updateSelectedColumns();
//   },
//   { deep: true, immediate: true }
// );


watch(() => step.value, (newVal) => {
  if (newVal == 2) {
    updateSelectedColumns()
  }
})

function updateSelectedColumns() {
  const fixedNewColumns: Array<{ key: string; title: string, disabled: boolean, defaultTitle: string }> = [];

  // Add master table columns
  const masterColumns = schema?.tables?.[localTemplate.value.masterTable]?.columns || {};
  const masterTableName = schema?.tables?.[localTemplate.value.masterTable].displayName
  localTemplate.value?.masterTableColumns?.forEach((column: string) => {
    let columnName = column.split('.')[1]
    if (masterColumns[columnName]) {
      fixedNewColumns.push({
        key: column,
        title: masterColumns[columnName],
        disabled: false,
        defaultTitle: `${masterTableName} -> ${masterColumns[columnName]}`
      });
    }
  });

  // Add related table columns
  localTemplate.value?.relatedTables?.forEach((table: any) => {
    const relatedColumns = schema?.tables[table.name]?.columns || {};
    const relatedTableName = schema?.tables[table.name].displayName
    table.columns.forEach((column: string) => {
      let columnName = column.split('.')[1]
      if (relatedColumns[columnName]) {
        fixedNewColumns.push({
          key: column,
          title: relatedColumns[columnName],
          disabled: false,
          defaultTitle: `${relatedTableName} -> ${relatedColumns[columnName]}`
        })
      }
    });
  });


  //add json table columns
  if (Boolean(localTemplate.value.masterJsonTable)) {
    const masterJsonTableColumns = schema?.tables?.[localTemplate.value.masterTable]?.jsonTables?.[(localTemplate.value.masterJsonTable as NestedJsonTable).name]?.columns || {}
    const masterJsonTableName = schema?.tables?.[localTemplate.value.masterTable]?.jsonTables?.[(localTemplate.value.masterJsonTable as NestedJsonTable).name]?.displayName
    localTemplate.value?.masterJsonTableColumns?.forEach((column: Record<string, string>) => {
      if (masterJsonTableColumns[column.name]) {
        fixedNewColumns.push({
          key: column.alias,
          title: column.displayName,
          disabled: false,
          defaultTitle: `${masterJsonTableName} -> ${column.displayName}`
        });
      }
    });
  }

  // Add related json table columns
  localTemplate.value?.masterJsonRelatedTables?.forEach((table: any) => {
    const relatedColumns = schema?.tables[table.name]?.columns || {};
    const relatedTableName = schema?.tables[table.name]?.displayName
    table.columns.forEach((column: string) => {
      let columnName = column.split('.')[1]
      if (relatedColumns[columnName]) {
        fixedNewColumns.push({
          key: column,
          title: relatedColumns[columnName],
          disabled: false,
          defaultTitle: `${relatedTableName} -> ${relatedColumns[columnName]}`
        })
      }
    });
  });


  //add array data selection columns     
  localTemplate.value?.arrayDataSelection?.forEach((table: any) => {
    const column = schema?.tables[localTemplate.value.masterTable]?.arrayDataSelection?.[table.name];
    const tableName = schema?.tables[localTemplate.value.masterTable]?.displayName
    fixedNewColumns.push({
      key: column.alias,
      title: column.displayName,
      disabled: false,
      defaultTitle: `${tableName} -> ${column.displayName}`
    })
  });

  // Create a Set for quick lookup of keys in fixedNewColumns
  const validKeys = new Set(fixedNewColumns.map(item => item.key));
  // Filter out columns that were removed while maintaining the order of selected columns
  let updatedSelectedColumns = selectedColumns.value.filter(col => validKeys.has(col.key));
  // Select only columns that are not yet in updatedSelectedColumns
  const updatedKeys = new Set(updatedSelectedColumns.map(item => item.key))
  const newColumns = fixedNewColumns.filter((col) => !updatedKeys.has(col.key));

  // Add the new columns to the end of the updatedSelectedColumns array
  updatedSelectedColumns.push(...newColumns);

  //update defaultTitle for columns where it was not present before
  updatedSelectedColumns = updatedSelectedColumns.map((column)=>{
    return {
      ...column,
      defaultTitle: fixedNewColumns.find(col => col.key == column.key)?.defaultTitle
    }
  })

  // Update selectedColumns with the new array
  selectedColumns.value = [...updatedSelectedColumns];
}

</script>