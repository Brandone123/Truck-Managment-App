<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { useNetworkingStore } from '@/stores/marketing/networking';
import { ref, computed, watch } from 'vue';
import type { NetworkingInfo } from '@/types/marketing/networking';

const emit = defineEmits(['update:show', 'addNetworking', 'editNetworking']);

const props = defineProps({
    item: {
        type: Object as () => NetworkingInfo,
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
});

const dialog = computed({
  get() {
    return props.show;
  },
  set(newValue) {
    emit('update:show', newValue);
  },
});

const networkingForm = ref(null);

const NetworkingListStore = useNetworkingStore();

const defaultNetworking = ref<NetworkingInfo>({
  id: null,
  event_name: null,
  date: null,
  link: null,
  description: null,
})

const networkingInfo = ref(defaultNetworking.value);

const title = computed(() => {
  return props.updating ? 'Networking Info' : 'Create Networking';
});

const saveButtonText = computed(() => {
  return props.updating ? 'update' : 'Add Networking';
});

const rules = {
  required: (value: string) => !!value || 'Field is required',
};

const save = () => {
  if (props.updating) {
    NetworkingListStore.updateNetworking(networkingInfo.value);
  } else {
    NetworkingListStore.createNetworking(networkingInfo.value);
  }
  dialog.value = false;
};

const resetForm = () => {
  if (networkingForm.value) {
    (networkingForm.value as HTMLFormElement).reset(); // Reset the form
  }
};

watch(dialog, (val) => {
  if (val && props.updating) {
    networkingInfo.value = Object.assign({}, props.item as NetworkingInfo)
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
          Add Networking
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
          <v-form ref="networkingForm">
            <v-row class="my-4">
                <v-col cols="12" md="6" class="pb-0">
                    <v-text-field v-model="networkingInfo.event_name" label="Networking Name" variant="solo" flat density="compact" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="pb-0">
                    <v-text-field type="date" v-model="networkingInfo.date"  label="Type" variant="solo" flat density="compact" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="12" class="pb-0">
                    <v-text-field v-model="networkingInfo.link" variant="solo" flat density="compact" label="Link" filled></v-text-field>                
                </v-col>
                <v-col cols="12" class="pb-0">
                    <v-textarea v-model="networkingInfo.description" variant="solo" flat density="compact" label="Description" rows="4" required></v-textarea>
                </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" variant="text" @click="save">
                {{ saveButtonText }}
            </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
