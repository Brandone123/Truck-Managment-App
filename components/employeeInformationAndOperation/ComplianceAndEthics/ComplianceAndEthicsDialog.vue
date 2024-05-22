<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, computed, toRefs, watch, } from 'vue'
import type { Ref, PropType } from 'vue'
import type { ComplianceAndEthicsInfo } from '~/types/employeeInformationAndOperation/compliance_and_ethics';

const emit = defineEmits(['update:show', 'bulkActionSuccess'])

const complianceAndEthicsStore = useComplianceAndEthicsStore()

const departmentStore = useDepartmentStore()
const { departmentList } = storeToRefs(departmentStore)

const props = defineProps({
  item: {
    type: Object,
    required: false,
  },
  updating: {
    type: Boolean,
    default: false
  },
  show: {
    type: Boolean,
    default: false
  },
  bulkUpdating: {
    type: Boolean,
    default: false,
  },
  bulkUpdateIds: {
    type: Array<Number>,
    default: []
  },
});

const dialog = computed({
  get() {
    return props.show
  },
  set(newValue) {
    emit('update:show', newValue);
  }
})

const complianceAndEthicsForm: Ref<HTMLFormElement | null> = ref(null);
const complianceAndEthics = ref<ComplianceAndEthicsInfo>({})

const title = computed(() => {

  if (props.bulkUpdating) {
    return "Bulk Update"
  }

  return props.updating ? 'Compliance And Ethics Info' : 'Add Compliance And Ethics Info'
})

const saveButtonText = computed(() => {
  return (props.updating || props.bulkUpdating) ? 'Update' : 'Save'
})

const rules = computed(() => {
  return {
    required: (value: string) => !!value || 'Field is required',
  }
})

const save = async () => {
  if (complianceAndEthicsForm.value) {
    const formStatus = await complianceAndEthicsForm.value.validate()
    if (!formStatus.valid) {
      return
    }
    if (props.bulkUpdating && props.bulkUpdateIds.length) {

      // get all non null values from employee compensation
      let updateData = Object.fromEntries(
        Object.entries(complianceAndEthics.value).filter(([key, value]) => value !== null)
      )

      const { success, error } = await complianceAndEthicsStore.bulkUpdateComplianceAndEthics({ ids: props.bulkUpdateIds, data: updateData })
      if (success) {
        emit('bulkActionSuccess')
      }
    }
    else {
      if (props.updating) {
        complianceAndEthicsStore.updateComplianceAndEthics(complianceAndEthics.value);
      } else {
        complianceAndEthicsStore.createComplianceAndEthics(complianceAndEthics.value)
      }
    }
    dialog.value = false;
  }
};

const resetForm = () => {
  if (complianceAndEthicsForm.value) {
    (complianceAndEthicsForm.value as HTMLFormElement).reset(); // Reset the form
  }
  complianceAndEthics.value = {}
}


watch(dialog, (val) => {
  if (val && props.updating) {
    complianceAndEthics.value = props.item as ComplianceAndEthicsInfo
  } else {
    resetForm()
  }
})
</script>

<template>
  <v-dialog v-model="dialog" width="800px">
    <template v-slot:activator="{ props }">
      <v-btn density="comfortable" color="primary" flat v-bind="props" class="text-none">
        <v-icon>mdi-plus</v-icon>
        Add Compliance And Ethics
      </v-btn>
    </template>
    <v-card class="grey-background">
      <v-toolbar color="primary" :title="title" density="compact">
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-window-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form ref="complianceAndEthicsForm">
          <v-row>
            <v-col cols="12" class="pb-0">
              <v-autocomplete v-model="complianceAndEthics.department_id" :items="departmentList" variant="solo" flat
                label="Department" density="compact" :rules="bulkUpdating ? [] : [rules.required]"
                :placeholder="bulkUpdating ? 'Original' : ''" item-title="name"
                item-value="id"></v-autocomplete>
            </v-col>
            <v-col cols="12" md="8" class="pb-0">
              <v-text-field label="Title" v-model="complianceAndEthics.title" variant="solo" flat density="compact"
              :rules="bulkUpdating ? [] : [rules.required]"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-text-field>
            </v-col>
            <v-col cols="12" md="4" class="pb-0">
              <v-text-field type="date" clearable label="Last Reviewed" v-model="complianceAndEthics.last_reviewed"
                variant="solo" flat density="compact"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-text-field>
            </v-col>
            <v-col cols="12" class="pb-0">
              <v-textarea label="Description" v-model="complianceAndEthics.description" variant="solo" flat
                density="compact" :rules="bulkUpdating ? [] : [rules.required]"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="save">{{ saveButtonText }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
