<!-- components/policy/ConditionsDialog.vue -->

<template>
  <v-dialog v-model="dialog" max-width="800px" persistent scrollable>
    <v-card>
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="conditionForm" v-model="isValid">
          <v-row>
            <v-col cols="12">
              <v-autocomplete variant="outlined" flat density="compact" v-model="conditionInfo.rule_id"
                :items="rulesList" item-title="name" item-value="id" label="Rule*" :rules="[validation.required]"
                required :readonly="item?.id ? true : false" :hint="item?.id ? 'Selected rule cannot be changed' : ''"
                persistent-hint></v-autocomplete>
            </v-col>
            <v-col cols="12">
              <v-text-field variant="outlined" flat density="compact" v-model="conditionInfo.name"
                label="Condition Name*" :rules="[validation.required, uniqueConditionName]" required></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <!-- Domain Autocomplete -->
              <v-autocomplete variant="outlined" density="compact" v-model="conditionInfo.domain" :items="domainItems"
                item-title="text" item-value="value" label="Select Domain" clearable class="mb-4">
              </v-autocomplete>
            </v-col>

            <v-col cols="12" md="6">
              <!-- Table Autocomplete -->
              <v-autocomplete variant="outlined" density="compact" v-model="conditionInfo.table" :items="tableItems"
                item-title="text" item-value="value" label="Select Table" clearable class="mb-4"
                :disabled="!conditionInfo.domain">
              </v-autocomplete></v-col>

            <v-col cols="12" md="4">
              <v-autocomplete variant="outlined" density="compact" v-model="conditionInfo.field" :items="columnItems"
                item-title="text" item-value="value" label="Field*" clearable :disabled="!conditionInfo.table">
              </v-autocomplete>
            </v-col>
            <v-col cols="12" md="4">
              <v-select variant="outlined" flat density="compact" v-model="conditionInfo.operator" :items="operators"
                label="Operator*" :rules="[validation.required]" required></v-select>
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field variant="outlined" flat density="compact" v-model="conditionInfo.value" label="Value*"
                :rules="[validation.required]" required></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field variant="outlined" flat density="compact" v-model="conditionInfo.resource"
                label="Resource"></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn @click="dialog = false">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="saveCondition" :disabled="!isValid">
          {{ saveButtonText }}
        </v-btn>

      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { usePolicyStore } from '@/stores/policyStore';
import type { ConditionInfo, RuleInfo } from '@/types/store/policy';
import { useValidation } from '~/composables/formValidation';
import DomainSelector from './domainSelector.vue';
import { listDomains, listTables, listColumns } from '@/utils/databaseSchema'
import { storeToRefs } from 'pinia';

const validation = useValidation();

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  item: {
    type: Object as () => ConditionInfo | null,
    default: null,
  },
});

const policyStore = usePolicyStore();
const { conditions, rules: rulesList } = storeToRefs(policyStore);


const emit = defineEmits(['update:modelValue', 'save']);

const uniqueConditionName = (value: any) => {
  // Check if the condition name already exists in the list
  const isDuplicate = (conditions.value || []).some(
    (condition) => condition.name?.toLocaleLowerCase() === value?.toLocaleLowerCase() && condition.id != props.item?.id
  )

  return !isDuplicate ? true : 'Condition name already exists';
}

const dialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});

const conditionForm = ref<HTMLFormElement | null>(null);
const isValid = ref(false);

const dataLoaded = ref<boolean>(false);

const conditionInfo = ref<Partial<Omit<ConditionInfo, 'rule' | 'created_at' | 'updated_at'>>>({});

// Define operators
const operators = [
  { title: '<=', value: '<=' },
  { title: '>=', value: '>=' },
  { title: '==', value: '==' },
  { title: '!=', value: '!=' },
  { title: '<', value: '<' },
  { title: '>', value: '>' },
];

// Watch for changes in props to populate form when updating
watch(
  () => dialog.value,
  (value) => {
    if (value) {
      conditionInfo.value = {
        id: props.item?.id,
        rule_id: props.item?.rule_id,
        name: props.item?.name,
        domain: props.item?.domain,
        table: props.item?.table,
        field: props.item?.field,
        operator: props.item?.operator,
        value: props.item?.value,
        resource: props.item?.resource || '',
      };
      nextTick(() => {
        dataLoaded.value = true;
      })
    } else {
      dataLoaded.value = false
    }
  },
  { immediate: true }
);

// Compute dialog title and save button text
const title = computed(() => (props.item?.id ? 'Edit Condition' : 'Add Condition'));
const saveButtonText = computed(() => (props.item?.id ? 'Update' : 'Save'));

// Save condition (create or update)
const saveCondition = async () => {
  let formStatus = await conditionForm.value?.validate()
  if (!formStatus.valid) {
    return;
  }

  emit('save', { ...conditionInfo.value })
  dialog.value = false
};


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
  if (!conditionInfo.value.domain) return []
  const tables = listTables(conditionInfo.value.domain)
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
  if (!conditionInfo.value.domain || !conditionInfo.value.table) return []
  const cols = listColumns(conditionInfo.value.domain, conditionInfo.value.table)
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
watch(() => conditionInfo.value.domain, (newVal, oldVal) => {
  if (dataLoaded.value && newVal !== oldVal) {
    conditionInfo.value.table = undefined
    conditionInfo.value.field = undefined
  }
})

watch(() => conditionInfo.value.table, (newVal, oldVal) => {
  if (dataLoaded.value && newVal !== oldVal) {
    conditionInfo.value.field = undefined
  }
})

</script>

<style scoped>
.v-toolbar-title {
  flex: auto !important;
}
</style>