<template>
  <v-dialog v-model="dialog" scrollable width="800px">
    <template v-slot:activator="{ props }">
      <v-btn density="comfortable" color="primary" flat v-bind="props" class="text-none">
        <v-icon>mdi-plus</v-icon>
        Add Pay Period
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
        <v-form ref="payPeriodForm" @submit.prevent="save">
          <v-row class="my-4">
            <v-col cols="12" md="6" class="pb-0">
              <v-text-field
                v-model="payPeriodInfo.start_date"
                variant="solo"
                flat
                label="Start Date"
                density="compact"
                type="date"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="pb-0">
              <v-text-field
                v-model="payPeriodInfo.end_date"
                variant="solo"
                flat
                label="End Date"
                density="compact"
                type="date"
                :rules="[rules.required, validEndDate]"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row v-if="!payPeriodInfo.increment_until">
            <v-col cols="12">
              <p>Do you want to increment this over a specific period?</p>
              <v-btn color="primary" @click="showIncrementField = true">
                Yes, specify period
              </v-btn>
            </v-col>
          </v-row>
          <v-row v-if="showIncrementField || payPeriodInfo.increment_until">
            <v-col cols="12" class="pb-0">
              <v-text-field
                v-model="payPeriodInfo.increment_until"
                variant="solo"
                flat
                label="Increment Until"
                density="compact"
                type="date"
                :rules="[rules.required]"
              ></v-text-field>
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
import { ref, computed, watch } from 'vue';
import type { PayPeriodInfo } from '@/types/attendance/pay_period';
import { usePayPeriodStore } from '@/stores/settings/attendance/pay_period';

const emit = defineEmits(['update:show', 'addPayPeriod', 'editPayPeriod']);

const payPeriodListStore = usePayPeriodStore();

const props = defineProps({
  item: {
    type: Object,
    required: false,
  },
  updating: {
    type: Boolean,
    default: false,
  },
  show: {
    type: Boolean,
    default: false,
  },
});

const dialog = computed({
  get() {
    return props.show;
  },
  set(newValue) {
    emit('update:show', newValue);
  },
});

const payPeriodForm = ref(null);
const payPeriodInfo = ref<PayPeriodInfo>({});
const showIncrementField = ref(false);

const title = computed(() => {
  return props.updating ? 'Edit Pay Period' : 'Create Pay Period';
});

const saveButtonText = computed(() => {
  return props.updating ? 'Update' : 'Save';
});

const rules = computed(() => ({
  required: (value: string) => !!value || 'Field is required',
}));

const validEndDate = (value: string) => {
  if (!value) return true;
  return new Date(value) > new Date(payPeriodInfo.value.start_date) || 'End date must be after start date';
};

const save = async () => {
  dialog.value = false;
  if (props.updating) {
    await payPeriodListStore.updatePayPeriod(payPeriodInfo.value);
  } else {
    await payPeriodListStore.createPayPeriod(payPeriodInfo.value);
  }
};

const resetForm = () => {
  if (payPeriodForm.value) {
    (payPeriodForm.value as HTMLFormElement).reset();
  }
  payPeriodInfo.value = {};
  showIncrementField.value = false;
};

watch(dialog, (val) => {
  if (val && props.updating) {
    payPeriodInfo.value = props.item as PayPeriodInfo;
  } else {
    resetForm();
  }
});
</script>