<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { useAdvertisingStore } from '@/stores/marketing/advertising';
import { ref, computed, watch } from 'vue';
import type { AdvertisingInfo } from '@/types/marketing/advertising';

const emit = defineEmits(['update:show', 'addAdvertising', 'editAdvertising']);

const props = defineProps({
    item: {
        type: Object as () => AdvertisingInfo,
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

const channelForm = ref(null);

const AdvertisingListStore = useAdvertisingStore();

const channelInfo = ref<AdvertisingInfo>({
  id: null,
  channel_name: null,
  description: null,
  api_key: null,
  api_secret: null,
})

// const channelInfo = ref(defaultChannel.value);

const title = computed(() => {
  return props.updating ? 'Advertising Channel Info' : 'Create Advertising Channel';
});

const saveButtonText = computed(() => {
  return props.updating ? 'update' : 'Add Advertising Channel';
});

const rules = {
  required: (value: string) => !!value || 'Field is required',
  number: (value: number) => !!value || 'Field is required'
};

const save = () => {
  if (props.updating) {
    AdvertisingListStore.updateChannel(channelInfo.value);
  } else {
    AdvertisingListStore.createChannel(channelInfo.value);
  }
  dialog.value = false;
};

const resetForm = () => {
  if (channelForm.value) {
    (channelForm.value as HTMLFormElement).reset(); // Reset the form
  }
};

watch(dialog, (val) => {
  if (val && props.updating) {
    channelInfo.value = Object.assign({}, props.item as AdvertisingInfo)
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
          New Channel
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
          <v-form ref="channelForm">
            <v-row class="my-4">
                <v-col cols="12" md="6" class="pb-0">
                    <v-text-field v-model="channelInfo.channel_name" label="Channel Name" variant="solo" flat density="compact" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="12" class="pb-0">
                    <v-textarea v-model="channelInfo.description" variant="solo" flat density="compact" label="Description" rows="4" required></v-textarea>
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
