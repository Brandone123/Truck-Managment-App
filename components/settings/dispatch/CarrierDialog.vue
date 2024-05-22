<template>
    <v-dialog v-model="dialog" scrollable width="800px">
      <template v-slot:activator="{ props }">
        <v-btn density="comfortable" color="primary" flat v-bind="props" class="text-none">
          <v-icon>mdi-plus</v-icon>
          Add Carrier
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
          <v-form ref="carrierForm">
            <v-row class="my-4">
              <v-col cols="12" md="6" class="pb-0">
                <v-text-field v-model="carrierInfo.name" variant="solo" flat label="Name" density="compact"  :rules="[rules.required]"></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="pb-0">
                <v-text-field v-model="carrierInfo.contact_email" variant="solo" flat label="Email" density="compact"  :rules="[rules.required]"></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" variant="text" @click="dialog = false">cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="save">{{saveButtonText}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { CarrierInfo } from '~/types/dispatch/carrier';
import { useCarrierStore } from '~/stores/settings/dispatch/carrier';

const emit = defineEmits(['update:show', 'addCarrier', 'editCarrier'])

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

const carrierForm = ref(null)
const carrierListStore = useCarrierStore()

const defaultCarrier = ref<CarrierInfo>({
    id: null,
    name: null,
    contact_email: null,
})

const carrierInfo = ref(defaultCarrier.value)

const title = computed(() => {
    return props.updating ? 'Carrier Info' : 'Create Carrier'
})

const saveButtonText = computed(() => {
    return props.updating ? 'update' : 'Save'
})

const rules = {
  required: (value: string) => !!value || 'Field is required',
};

const save = () => { 
  if (props.updating) {
    carrierListStore.updateCarrier(carrierInfo.value);
  } else {
    carrierListStore.createCarrier(carrierInfo.value);
  }
    dialog.value = false; 
};

const resetForm = () => {
    if (carrierForm.value) {
        (carrierForm.value as HTMLFormElement).reset(); // Reset the form
    }
}

watch(dialog, (val) => {
    if (val && props.updating) {
        carrierInfo.value = props.item as CarrierInfo
    } else {
        resetForm()
    }
})
</script>

<style scoped>
  .v-progress-circular {
    margin: 1rem;
  }
  
.overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.error-message {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px;
  background-color: red;
  color: white;
  font-weight: bold;
  border-radius: 5px;
}
</style>