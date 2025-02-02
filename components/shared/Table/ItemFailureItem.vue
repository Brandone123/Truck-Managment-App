<template>
  <v-menu v-model="dialog" location="bottom" max-height="400px" width="350px" location-strategy="connected"
    :close-on-content-click="true" open-on-hover class="rounded">
    <template v-slot:activator="{ props }">
      <span class="text-secondary ml-2" v-bind="props"
        style="cursor: pointer; border-bottom: 1px dotted; justify-content: center; align-items: center;text-align: center;">
        {{ value }}
      </span>
    </template>
    <v-row no-gutters>
      <v-col cols="12">
        <v-card class="rounded-lg">
          <v-card-text>
            <div v-if="loading && !item_failure.id" class="text-center">
              <v-progress-circular model-value="20" indeterminate color="primary"></v-progress-circular>
            </div>
            <div v-else-if="showErrorMessage" class="text-center text-error">Error Loading Details</div>
            <div v-else-if="item_failure">
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
                <v-col cols="12" md="6">{{ item_failure?.submission_date }}</v-col>
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
  type: {
    type: String,
    required: false,
    default: 'id',
  },
  value: {
    type: [String, Number],
    required: false,
  }
})

const dialog = ref(false)

const item_failure = ref<Failure>({} as Failure)
const showErrorMessage = ref(false)
const loading = ref(false)

// const item_failure = computed(() => {
//   return failures.value.find((failure: Record<string, any>) => failure[props.type] == props.value)
// })

watch(() => dialog.value, (newVal) => {
  if (newVal) {
    getItemFailure()
  }
})

const getItemFailure = async () => {
  showErrorMessage.value = false
  loading.value = true;
  const { data, error } = await failureStore.getFailureById(props.value as number)
  loading.value = false;
  if (error.value) {
    showErrorMessage.value = true
  } else {
    item_failure.value = data.value as Failure
  }
}

const getItemFailureColor = (stage: any) => {
  switch ((stage || '').toLowerCase()) {
    case 'needs action':
      return 'error';
    case 'open issue':
      return 'secondary';
    case 'acknowledged':
      return 'orange';
    // case 'closed':
    //   return 'grey';
    case 'resolved':
      return 'primary';
  }
}

</script>