<template>
  <v-menu v-model="dialog" location="bottom" max-height="400px" width="350px" location-strategy="connected"
    :close-on-content-click="true" open-on-hover class="rounded">
    <template v-slot:activator="{ props }">
      <span class="text-secondary ml-2" v-bind="props"
        style="cursor: pointer; border-bottom: 1px dotted; justify-content: center; align-items: center;text-align: center;">
        {{ item_failure?.id }}
      </span>
    </template>
    <v-row no-gutters>
      <v-col cols="12">
        <v-card class="rounded-lg">
          <v-card-text>
            <div>
              <v-row class="mt-2">
                <v-col cols="12" md="6">Stage</v-col>
                <v-col cols="12" md="6" v-if="item_failure?.stage">
                  <v-chip density="compact" variant="flat" class="text-capitalize"
                    :color="getItemFailureColor(item_failure?.stage)">
                    {{ item_failure?.stage }}
                  </v-chip>
                </v-col>
              </v-row>
              <v-divider class="my-2"></v-divider>
              <v-row>
                <v-col cols="12" md="6">Submission Date</v-col>
                <v-col cols="12" md="6">
                  {{ item_failure?.submission_date }}
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia';
import type { Failure } from '~/types/maintenance/failure';

const failureStore = useFailureStore();
const { failures } = storeToRefs(failureStore);

const props = defineProps({
  item_failure: {
    type: Object as PropType<Failure>,
    required: true,
  }
})

const dialog = ref(false);

// Function to determine color based on the failure stage
const getItemFailureColor = (stage: string) => {
  const stageLower = (stage || '').toLowerCase();
  switch (stageLower) {
    case 'needs action':
      return 'error';
    case 'open issue':
      return 'secondary';
    case 'acknowledged':
      return 'orange';
    case 'resolved':
      return 'primary';
    default:
      return 'default'; 
  }
}
</script>
