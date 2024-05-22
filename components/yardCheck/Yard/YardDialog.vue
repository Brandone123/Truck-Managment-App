<template>
    <v-dialog v-model="dialog" scrollable width="800px">
      <template v-slot:activator="{ props }">
        <v-btn density="comfortable" color="primary" flat v-bind="props" class="text-none">
          <v-icon>mdi-plus</v-icon>
          Add Yard
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
          <v-form ref="yardForm">
            <v-row class="my-4">
                <v-col cols="12" md="6" class="pb-0">
                    <v-text-field v-model="yardInfo.name" variant="solo" flat label="Name" density="compact" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                    <v-text-field v-model="yardInfo.location" variant="solo" flat label="Location" density="compact" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                    <v-text-field v-model="yardInfo.capacity" variant="solo" flat type="number" label="Capacity" density="compact" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="12" class="pb-0">
                  <v-textarea v-model="yardInfo.geofence_polygon" variant="solo" flat label="Geofence Polygon" 
                  density="compact" rows="5"></v-textarea>
                </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" variant="text" @click="dialog = false">cancel</v-btn>
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
  import type { YardInfo } from '@/types/yard/yard';
  
  const emit = defineEmits(['update:show', 'addYard', 'editYard']);
  
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
  
  const yardForm = ref(null);
  
  const yardListStore = useYardStore();
  
  const defaultYard = ref<YardInfo>({
    id: null,
    name: null,
    location: null,
    capacity: null,
    geofence_polygon: null,
  })

  const yardInfo = ref(defaultYard.value);
  
  const title = computed(() => {
    return props.updating ? 'Yard Info' : 'Create Yard';
  });
  
  const saveButtonText = computed(() => {
    return props.updating ? 'update' : 'Save';
  });
  
  const rules = {
    required: (value: string) => !!value || 'Field is required',
  };

  const save = () => {
    if (props.updating) {
      yardListStore.updateYard(yardInfo.value);
    } else {
      yardListStore.createYard(yardInfo.value);
    }
    dialog.value = false;
  };
  
  const resetForm = () => {
    if (yardForm.value) {
      (yardForm.value as HTMLFormElement).reset(); // Reset the form
    }
  };
  
  watch(dialog, (val) => {
    if (val && props.updating) {
        yardInfo.value = props.item as YardInfo
    } else {
        resetForm()
    }
})
  </script>