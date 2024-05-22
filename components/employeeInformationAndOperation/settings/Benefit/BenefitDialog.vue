<template>
  <v-dialog v-model="dialog" scrollable width="800px">
    <template v-slot:activator="{ props }">
      <v-btn density="comfortable" color="primary" flat v-bind="props" class="text-none">
        <v-icon>mdi-plus</v-icon>
        Add Benefit
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
        <v-form ref="benefitForm">
          <v-row>
            <v-col cols="12" class="pb-0">
              <v-text-field v-model="benefitInfo.name" variant="solo" flat label="Name" density="compact"
                :rules="[rules.required]"></v-text-field>
            </v-col>
            <v-col cols="12" class="pb-0">
              <v-textarea v-model="benefitInfo.description" variant="solo" flat label="Description" density="compact"
                :rules="[rules.required]"></v-textarea>
            </v-col>
            <v-col cols="12" class="pb-0">
              <v-textarea v-model="benefitInfo.eligibility_criteria" variant="solo" flat label="Eligibility Criteria"
                density="compact"></v-textarea>
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
import type { BenefitInfo } from '@/types/employeeInformationAndOperation/benefit'

const emit = defineEmits(['update:show', 'addBenefit', 'editBenefit'])

const benefitStore = useBenefitStore()

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

const benefitForm = ref(null)
const benefitInfo = ref<BenefitInfo>({})

const title = computed(() => {
  return props.updating ? 'BenefitInfo' : 'Create Benefit'
})

const saveButtonText = computed(() => {
  return props.updating ? 'update' : 'Save'
})

const rules = computed(() => {
  return {
    required: (value: string) => !!value || 'Field is required',
  }
})

const save = () => {
  if (props.updating) {
    benefitStore.updateBenefit(benefitInfo.value);
  } else {
    benefitStore.createBenefit(benefitInfo.value);
  }

  dialog.value = false;
};

const resetForm = () => {
  if (benefitForm.value) {
    (benefitForm.value as HTMLFormElement).reset(); // Reset the form
  }
  benefitInfo.value = {}
}

watch(dialog, (val) => {
  if (val && props.updating) {
    benefitInfo.value = props.item as BenefitInfo
  } else {
    resetForm()
  }
})
</script>