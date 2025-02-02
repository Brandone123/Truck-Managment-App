<template>
  <v-dialog v-model="dialog" scrollable max-width="600px">
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title>Version History</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="pa-0">
        <v-data-table :items="filteredList" :headers="headers" :show-footer-in-head="false" hover
          @click:row="handleRowClick">
          <template v-slot:item.created_at="{ item }">
            <span style="cursor: pointer; border-bottom: 1px dotted; font-size: small">
              {{ new Date(item.created_at).toLocaleDateString('en-US',
                { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) }}
            </span>
            <v-tooltip activator="parent" location="top">
              {{ getRelativeDateTime(item.created_at) }}
            </v-tooltip>
          </template>

          <template v-slot:item.version="{ item }">
            <span class="text-primary mr-3" style="cursor: pointer;border-bottom: 1px dotted;"
              @click="selectVersion(item.version, item.id as number)">{{
                item.version }}</span>
            <v-chip :color="item.id == currentVersionId ? 'primary' : ''">{{ item.id == currentVersionId ?
              'Current Version' : 'View Only' }}</v-chip>
          </template>
        </v-data-table>
      </v-card-text>

    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch, type PropType } from 'vue';
import type { QuizFormVersion} from '@/types/recruiting/onboardingOrientation';

import moment from 'moment'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  versions: {
    type: Array as PropType<QuizFormVersion[]>,
    required: true
  },
  currentVersionId: {
    type: Number,
    required: true,
  }
});

const emit = defineEmits(['update:modelValue', 'selection']);

const dialog = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})

const filteredList = computed(() => {
  return props.versions?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) || [];
})

const headers = ref([
  { title: 'Version', key: 'version', sortable: false },
  { title: 'Date', key: 'created_at', sortable: false }
])

const getRelativeDateTime = (date: any) => {
  return moment(date).calendar(); //fromNow();
}


const selectVersion = (version: any, version_id: number) => {
  if (version_id == props.currentVersionId) {
    emit('selection', undefined)
  } else {
    emit('selection', version);
  }
  dialog.value = false
}

const handleRowClick = (event: any, row: any) => {
  selectVersion(row.item?.version, row.item?.id)

  // custom class
  // const tr = event.target.parentNode;
  // tr.classList.add('highlight');
}
</script>