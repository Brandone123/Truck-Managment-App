<template>
    <v-dialog v-model="dialogYardSpace" scrollable width="800px">
      <template v-slot:activator="{ props }">
        <v-btn density="comfortable" color="primary" flat v-bind="props" class="text-none">
          <v-icon>mdi-plus</v-icon>
          Add Yard Space
        </v-btn>
      </template>
      <v-card class="grey-background">
        <v-toolbar color="primary" :title="title" density="compact">
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogYardSpace = false">
            <v-icon>mdi-window-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form ref="yardSpaceForm">
            <v-row class="my-4">
                <v-col cols="12" class="pb-0">
                <v-select v-model="yardSpaceInfo.yard_id" variant="solo" flat label="Select Yard"
                                :items='yardList' item-title="name" item-value="id" density="compact"  :rules="[rules.required]"></v-select>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                    <v-text-field v-model="yardSpaceInfo.space_number" variant="solo" type="number" flat label="Space Number" density="compact" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                    <v-select :items="Occupied" v-model="yardSpaceInfo.is_occupied" item-title="name" item-value="id" variant="solo" flat label="Is Occupied ?" density="compact" :rules="[rules.required]"></v-select>
                </v-col>
                <v-col cols="12" class="pb-0">
                    <v-select v-model="yardSpaceInfo.current_vehicle_id" variant="solo" flat label="Current Vehicule"
                                    :items='vehicleList' item-title="name" item-value="id" density="compact"></v-select>
                </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" variant="text" @click="dialogYardSpace = false">cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="save">{{ saveButtonText }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits } from 'vue';
  import { useYardStore } from '@/stores/yard';
  import { ref, computed, watch } from 'vue';
  import type { YardSpaceInfo } from '@/types/yard/yard_space';
  import { useVehicleStore } from '@/stores/vehicle'
  
  const emit = defineEmits(['updatespace:showyardspace', 'addYardSpace', 'editYardSpace']);
  
  const props = defineProps({
    itemspace: {
      type: Object,
      required: false,
    },
    updatingyardSpace: {
      type: Boolean,
      default: false,
    },
    showyardspace: {
      type: Boolean,
      default: false,
    },
  });
  
  const dialogYardSpace = computed({
    get() {
      return props.showyardspace;
    },
    set(newValue) {
      emit('updatespace:showyardspace', newValue);
    },
  });

  onMounted(() => {
    vehicleListStore.fetchVehicleList();
  })
  
  const yardSpaceForm = ref(null);
  
  const yardSpaceListStore = useYardSpaceStore();
  const yardListStore = useYardStore();
  const {yardList} = storeToRefs(yardListStore)

  const vehicleListStore = useVehicleStore();
  const {vehicleList} = storeToRefs(vehicleListStore)
  
  const defaultYardSpace =  ref <YardSpaceInfo>({
    id: null,
    yard_id: null,
    space_number: null,
    is_occupied: null,
    current_vehicle_id: null,
  })

  const yardSpaceInfo = ref(defaultYardSpace.value);
  
  const title = computed(() => {
    return props.updatingyardSpace ? 'Yard Space Info' : 'Create Yard Space';
  });
  
  const saveButtonText = computed(() => {
    return props.updatingyardSpace ? 'update' : 'Save';
  });
  
  const rules = {
    required: (value: string) => !!value || 'Field is required',
  };

  const Occupied = [
  { id: 1, value: "yes", name: "Yes" },
  { id: 2, value: "no", name: "No" },
];
  
  const save = () => {
    if (props.updatingyardSpace) {
      yardSpaceListStore.updateYardSpace(yardSpaceInfo.value);
    } else {
      yardSpaceListStore.createYardSpace(yardSpaceInfo.value);
    }
    dialogYardSpace.value = false;
  };
  
  const resetForm = () => {
    if (yardSpaceForm.value) {
      (yardSpaceForm.value as HTMLFormElement).reset(); // Reset the form
    }
  };
  
  watch(dialogYardSpace, (val) => {
    if (val && props.updatingyardSpace) {
        yardSpaceInfo.value = props.itemspace as YardSpaceInfo
    } else {
        resetForm()
    }
})
  </script>