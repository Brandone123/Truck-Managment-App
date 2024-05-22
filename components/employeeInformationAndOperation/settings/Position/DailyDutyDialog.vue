<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, computed, toRefs, watch } from 'vue'
import type { Ref, PropType } from 'vue'
import type { DailyDutyInfo } from '@/types/employeeInformationAndOperation/position'

const emit = defineEmits(['update:show'])

const positionStore = usePositionStore()
const {positionList} = storeToRefs(positionStore)

const dailyDutyStore = useDailyDutyStore()

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
  selectedPositionId: {
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

const dailyDutyForm = ref(null)
const dailyDutyInfo = ref<DailyDutyInfo>({})

const title = computed(() => {
  return props.updating ? 'Daily Duty Info' : 'Create Daily Duty'
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
    dailyDutyStore.updateDuty(dailyDutyInfo.value);
  } else {
    dailyDutyStore.createDuty(dailyDutyInfo.value);
  }

  dialog.value = false;
};

const resetForm = () => {
  if (dailyDutyForm.value) {
    (dailyDutyForm.value as HTMLFormElement).reset(); // Reset the form
  }
  dailyDutyInfo.value = {}
}

watch(dialog, (val) => {
  if (val && props.updating) {
    dailyDutyInfo.value = props.item as DailyDutyInfo
  } else {
    resetForm()
    dailyDutyInfo.value.position_id = props.selectedPositionId
  }
})
</script>

<template>
  <v-dialog v-model="dialog" scrollable width="800px">
    <template v-slot:activator="{ props }">
      <v-btn density="comfortable" color="primary" flat v-bind="props" class="text-none">
        <v-icon>mdi-plus</v-icon>
        Add Duty
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
        <v-form ref="dailyDutyForm">
          <v-row>
               <v-col cols="12" class="pb-0">
              <v-autocomplete v-model="dailyDutyInfo.position_id" :items="positionList" variant="solo" flat label="Position" density="compact"
                :rules="[rules.required]" item-title="title" item-value="id" :readonly="true"></v-autocomplete>
            </v-col>
            <v-col cols="12" class="pb-0">
              <v-textarea v-model="dailyDutyInfo.description" variant="solo" flat label="Description" density="compact"
                :rules="[rules.required]"></v-textarea>
            </v-col>
            <v-col cols="12" class="pb-0">
              <v-textarea v-model="dailyDutyInfo.frequency" variant="solo" flat label="Frequency" density="compact"
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
