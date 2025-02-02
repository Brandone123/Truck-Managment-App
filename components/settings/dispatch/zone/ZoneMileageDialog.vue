<!-- src/components/dispatch/ZoneMileageDialog.vue -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useZoneMileageStore } from '@/stores/settings/dispatch/zoneMileageStore';
import { useLayoutStore } from '@/stores/useLayoutStore';
import type { DispatchZoneMileageInfo } from '@/types/dispatch/dispatchZoneMileage';
import type { DispatchZoneInfo } from '@/types/dispatch/dispatchZone';

const emit = defineEmits(['update:show']);

const zoneMileageStore = useZoneMileageStore();
const layoutStore = useLayoutStore();

const props = defineProps({
  item: Object as PropType<DispatchZoneMileageInfo>,
  updating: Boolean,
  show: Boolean,
  zoneList: Array as PropType<DispatchZoneInfo[]>,
});

const dialog = computed({
  get: () => props.show,
  set: (val: boolean) => emit('update:show', val),
});

const zoneMileageForm = ref(null);
const zoneMileage = ref<DispatchZoneMileageInfo>({});

const title = computed(() => (props.updating ? 'Update Zone Mileage' : 'Add Zone Mileage'));
const saveButtonText = computed(() => (props.updating ? 'Update' : 'Save'));

const rules = {
  required: (value: string) => !!value || 'Field is required',
  numeric: (value: string) => !isNaN(Number(value)) || 'Must be a number',
};

const save = async () => {
  if (zoneMileageForm.value) {
    const isValid = await zoneMileageForm.value.validate();
    if (!isValid) return;

    if (props.updating) {
      await zoneMileageStore.updateZoneMileage(zoneMileage.value);
    } else {
      await zoneMileageStore.createZoneMileage(zoneMileage.value);
    }
    dialog.value = false;
  }
};

const resetForm = () => {
  zoneMileageForm.value?.reset();
  zoneMileage.value = {};
};

watch(
  () => props.show,
  (val) => {
    if (val && props.updating) {
      zoneMileage.value = { ...props.item };
    } else {
      resetForm();
    }
  }
);
</script>

<template>
  <v-dialog v-model="dialog" width="600">
    <v-card>
      <v-toolbar color="primary">
        <span class="white--text">{{ title }}</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="zoneMileageForm">
          <v-select
            label="Origin Zone"
            v-model="zoneMileage.origin_zone_id"
            :items="props.zoneList"
            item-text="name"
            item-value="id"
            :rules="[rules.required]"
          ></v-select>
          <v-select
            label="Destination Zone"
            v-model="zoneMileage.destination_zone_id"
            :items="props.zoneList"
            item-text="name"
            item-value="id"
            :rules="[rules.required]"
          ></v-select>
          <v-text-field
            label="Mileage From"
            v-model="zoneMileage.mileage_from"
            :rules="[rules.required, rules.numeric]"
          ></v-text-field>
          <v-text-field
            label="Mileage To"
            v-model="zoneMileage.mileage_to"
            :rules="[rules.required, rules.numeric]"
          ></v-text-field>
          <v-text-field
            label="Rate Per Mile"
            v-model="zoneMileage.rate_per_mile"
            :rules="[rules.required, rules.numeric]"
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="save">{{ saveButtonText }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
