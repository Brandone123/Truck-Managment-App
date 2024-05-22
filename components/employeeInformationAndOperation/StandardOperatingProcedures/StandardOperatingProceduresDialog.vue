<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, computed, toRefs, watch, } from 'vue'
import type { Ref, PropType } from 'vue'
import type { StandardOperatingProcedureInfo } from '~/types/employeeInformationAndOperation/standard_operating_procedure';

const emit = defineEmits(['update:show', 'bulkActionSuccess'])

const SOPStore = useSOPStore()

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
  bulkUpdating: {
    type: Boolean,
    default: false,
  },
  bulkUpdateIds: {
    type: Array<Number>,
    default: []
  },
  show: {
    type: Boolean,
    default: false
  }
});

const dialog = computed({
  get() {
    return props.show
  },
  set(newValue) {
    emit('update:show', newValue);
  }
})

const SOPForm: Ref<HTMLFormElement | null> = ref(null);
const SOP = ref<StandardOperatingProcedureInfo>({})

const title = computed(() => {
  if (props.bulkUpdating) {
    return "Bulk Update SOPs"
  }

  return props.updating ? 'SOP Info' : 'Add SOP'
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
  if (SOPForm.value) {
    const formStatus = await SOPForm.value.validate()
    if (!formStatus.valid) {
      return
    }
    if (props.bulkUpdating && props.bulkUpdateIds.length) {

      // get all non null values from sop
      let updateData = Object.fromEntries(
        Object.entries(SOP.value).filter(([key,value])=>value !== null)
      )

      const { success, error } = await SOPStore.bulkUpdateSOP({ ids: props.bulkUpdateIds, data: updateData })
      if (success) {
        emit('bulkActionSuccess')
      }
    }
    else {
      if (props.updating) {
        SOPStore.updateSOP(SOP.value);
      } else {
        SOPStore.createSOP(SOP.value)
      }
    }

    dialog.value = false;
  }
};

const resetForm = () => {
  if (SOPForm.value) {
    (SOPForm.value as HTMLFormElement).reset(); // Reset the form
  }
  SOP.value = {}
}


watch(dialog, (val) => {
  if (val && props.updating) {
    SOP.value = props.item as StandardOperatingProcedureInfo
  } else {
    resetForm()
  }
})
</script>

<template>
  <v-dialog v-model="dialog" scrollable width="800px">
    <template v-slot:activator="{ props }">
      <v-btn density="comfortable" color="primary" flat v-bind="props" class="text-none">
        <v-icon>mdi-plus</v-icon>
        Add SOP
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
        <v-form ref="SOPForm">
          <v-row>
            <v-col cols="12" class="pb-0">
              <v-autocomplete v-model="SOP.department_id" :items="departmentList" variant="solo" flat label="Department"
                density="compact" :rules="bulkUpdating ? [] : [rules.required]"
                :placeholder="bulkUpdating ? 'Original' : ''" item-title="name" item-value="id"></v-autocomplete>
            </v-col>
            <v-col cols="12" class="pb-0">
              <v-text-field label="Title" v-model="SOP.title" variant="solo" flat density="compact"
                :rules="bulkUpdating ? [] : [rules.required]"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-text-field>
            </v-col>
            <v-col cols="12" class="pb-0">
              <v-textarea label="Description" v-model="SOP.description" variant="solo" flat density="compact"
                :rules="bulkUpdating ? [] : [rules.required]"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-textarea>
            </v-col>
            <v-col cols="12" class="pb-0">
              <v-textarea label="Guidelines" v-model="SOP.guidelines" variant="solo" flat density="compact"
                :rules="bulkUpdating ? [] : [rules.required]"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-textarea>
            </v-col>
            <v-col cols="12" class="pb-0">
              <v-textarea label="Emergency Procedures" v-model="SOP.emergency_procedures" variant="solo" flat
                density="compact" :rules="bulkUpdating ? [] : [rules.required]"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-textarea>
            </v-col>
            <v-col cols="12" class="pb-0">
              <v-text-field label="Document Path" v-model="SOP.document_path" variant="solo" flat density="compact"
                :placeholder="bulkUpdating ? 'Original' : ''"></v-text-field>
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
