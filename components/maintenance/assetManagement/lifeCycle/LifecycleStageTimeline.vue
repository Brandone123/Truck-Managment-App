<template>
  <div>
    <v-timeline align-top>
      <v-timeline-item v-for="(stage, index) in lifecycleStages" :key="index"
      :dot-color="getStageColor(stage.name)" :icon="getStageIcon(stage.name)" fill-dot small>
        <span :class="`${'text-' + getStageColor(stage.name)}`" >{{ stage.name }}</span> - {{ stage.start_date }} to {{ stage.end_date || 'Present' }}
        <p>{{ stage.description }}</p>
      </v-timeline-item>
    </v-timeline>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  asset: {
    type: Object,
    default: () => ({}),
  },
});

const lifecycleStages = computed(() => props.asset?.lifecycle_stages || []);

const getStageColor = (stageName: string) => {
  switch (stageName) {
    case 'Acquisition': return 'blue';
    case 'Active Service': return 'green';
    case 'Maintenance': return 'orange';
    case 'Decommissioning': return 'red';
    default: return 'grey';
  }
};

const getStageIcon = (stageName: string) => {
  switch (stageName) {
    case 'Acquisition': return 'mdi-truck';
    case 'Active Service': return 'mdi-wrench';
    case 'Maintenance': return 'mdi-wrench';
    case 'Decommissioning': return 'mdi-delete';
    default: return 'mdi-help-circle';
  }
};
</script>

<style scoped>
</style>
