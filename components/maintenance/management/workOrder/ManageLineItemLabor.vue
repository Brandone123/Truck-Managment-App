<template>
  <div>
    <div class="d-flex justify-end">
      <v-btn @click="addLabor" color="primary">Add Labor</v-btn>
      <LaborDialog v-model="showLaborDialog" :laborItem="selectedLaborItem"
        :currentServiceTask="selectedLineItem.service_task" @save="saveLabor" @delete="deleteLabor" />
    </div>


    <template v-for="(lineItem, i) in workOrder.line_items" :key="i">
      <v-card class="mt-3" v-if="lineItem.labor?.length">
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="5">{{ lineItem.service_task?.name }}</v-col>
            <v-col cols="12" sm="2">Hrs</v-col>
            <v-col cols="12" sm="2">Rate</v-col>
            <v-col cols="12" sm="2">SubTotal</v-col>
            <v-col cols="12" sm="1"></v-col>
          </v-row>
          <v-divider></v-divider>
        </v-card-text>
        <v-card-text>
          <LaborItem class="mt-2" v-for="(laborItem, index) in lineItem.labor" :key="index" :laborItem="laborItem"
            @onEdit="editLabor(lineItem, laborItem)" />
        </v-card-text>
      </v-card>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import type { PropType } from 'vue';
import { useValidation } from '~/composables/formValidation';
import type { WorkOrder, LineItem, Labor } from '@/types/maintenance/workOrder';
import type { ServiceTask } from '~/types/maintenance/serviceTaskTypes';
import LaborDialog from './components/LaborDialog.vue'
import LaborItem from './components/LaborItem.vue'

const props = defineProps({
  workOrder: {
    type: Object as PropType<Partial<WorkOrder>>,
    required: true,
  },
});

const layoutStore = useLayoutStore();

const workOrderStore = useWorkOrderStore();

const selectedLineItem = ref<Partial<LineItem>>({})

const selectedLaborItem = ref<Partial<Labor>>({});
const showLaborDialog = ref(false)

const addLabor = (lineItem: Partial<LineItem>) => {
  selectedLineItem.value = lineItem

  let payload = {
    service_task_id: lineItem.service_task_id,
  }

  // currentServiceTask.value = null //lineItem.service_task
  selectedLaborItem.value = JSON.parse(JSON.stringify(payload))
  showLaborDialog.value = true
}

const editLabor = (lineItem: Partial<LineItem>, labor: Partial<Labor>) => {
  selectedLineItem.value = JSON.parse(JSON.stringify(lineItem))
  selectedLaborItem.value = JSON.parse(JSON.stringify(labor))
  showLaborDialog.value = true
  // emit('editLabor', labor)
}

const saveLabor = async (labor: Partial<Labor>) => {
  if (labor.id) {
    await workOrderStore.updateLaborItem(props.workOrder.id as number, selectedLineItem.value.id as number, labor.id as number, labor)
  } else {
    await workOrderStore.addServiceTaskLaborItem(props.workOrder.id as number, labor.service_task_id as number, labor)
  }
  await workOrderStore.fetchWorkOrderById(props.workOrder.id as number)
}

const deleteLabor = async (labor: any) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog('Are you sure you want to delete this labor item ?')
  if (confirm) {
    showLaborDialog.value = false
    await workOrderStore.deleteLaborItem(props.workOrder.id as number, selectedLineItem.value.id as number, labor.id as number)
  }
  await workOrderStore.fetchWorkOrderById(props.workOrder.id as number)
}
</script>

<style scoped>
</style>