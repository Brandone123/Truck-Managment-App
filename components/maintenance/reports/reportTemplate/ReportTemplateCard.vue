<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card @click="$emit('click', template)" v-bind="props" :elevation="isHovering ? 16 : 2">
      <v-card-title>{{ template.name }}</v-card-title>
      <v-card-text>
        <p class="text-caption">{{ template.description }}</p>
        <div class="d-flex justify-space-between align-center" style="height:40px;">
          <div>
            <v-btn class="mr-2" variant="tonal" size="x-small" v-show="isHovering" @click.stop="$emit('edit', template)"
              icon><v-icon>mdi-pencil</v-icon></v-btn>
            <v-btn variant="tonal" size="x-small" v-show="isHovering" color="error"
              @click.stop="$emit('delete', template.id)" icon><v-icon>mdi-delete</v-icon></v-btn>
          </div>
          <v-chip density="compact">{{ getTemplateName(template.group) }}</v-chip>
        </div>
      </v-card-text>
    </v-card>
  </v-hover>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import { useReportTemplateStore } from '@/stores/maintenance/reportTemplateStore';
import type { ReportTemplate } from '@/types/maintenance/reportTemplate';

const props = defineProps({
  template: {
    type: Object as () => ReportTemplate,
    required: true,
  },
  templateGroups: {
    type: Array as () => Record<string, string>[],
    required: true
  }
});

const emit = defineEmits(['click', 'edit', 'delete']);

const getTemplateName = (value: string) => {
  return props.templateGroups?.find(template => template.value == value)?.title
}
</script>