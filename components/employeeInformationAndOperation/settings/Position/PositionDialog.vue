<template>
  <v-dialog v-model="dialog" scrollable width="800px">
    <template v-slot:activator="{ props }">
      <v-btn density="comfortable" color="primary" flat v-bind="props" class="text-none">
        <v-icon>mdi-plus</v-icon>
        Add Position
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
        <v-form ref="positionForm">
          <v-row>
            <v-col cols="12" class="pb-0">
              <v-autocomplete v-model="positionInfo.department_id" :items="departmentList" variant="solo" flat label="Department" density="compact"
                :rules="[rules.required]" item-title="name" item-value="id" :readonly="true"></v-autocomplete>
            </v-col>
            <v-col cols="12" class="pb-0">
              <v-text-field v-model="positionInfo.title" variant="solo" flat label="Name" density="compact"
                :rules="[rules.required]"></v-text-field>
            </v-col>
            <v-col cols="12" class="pb-0">
              <v-textarea v-model="positionInfo.description" variant="solo" flat label="Description" density="compact"
                :rules="[rules.required]"></v-textarea>
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

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, computed, toRefs, watch } from 'vue'
import type { Ref, PropType } from 'vue'
import type { PositionInfo } from '@/types/employeeInformationAndOperation/position'

const emit = defineEmits(['update:show'])

const positionStore = usePositionStore()

const departmentStore = useDepartmentStore()
const {departmentList} = storeToRefs(departmentStore)

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
  selectedDepartmentId: {
    type: [Number, null] as PropType<number | null>, //type defined as number or null
    required: false,
    default: null
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

const positionForm = ref(null)
const positionInfo = ref<PositionInfo>({})

const title = computed(() => {
  return props.updating ? 'Position Info' : 'Create Position'
})

const saveButtonText = computed(() => {
  return props.updating ? 'Update' : 'Save'
})

const rules = computed(() => {
  return {
    required: (value: string) => !!value || 'Field is required',
  }
})

const save = () => {
  if (props.updating) {
    positionStore.updatePosition(positionInfo.value);
  } else {
    positionStore.createPosition(positionInfo.value);
  }

  dialog.value = false;
};

const resetForm = () => {
  if (positionForm.value) {
    (positionForm.value as HTMLFormElement).reset(); // Reset the form
  }
  positionInfo.value = {}
}

watch(dialog, (val) => {
  if (val && props.updating) {
    positionInfo.value = props.item as PositionInfo
  } else {
    resetForm()
    positionInfo.value.department_id = props.selectedDepartmentId
  }
})
</script>