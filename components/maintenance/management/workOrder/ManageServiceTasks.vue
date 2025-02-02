<template>
  <div>
    <div class="d-flex justify-end">
      <v-btn @click="addLineItem" color="primary">Add Line Item</v-btn>
      <LineItemDialog :lineItem="selectedLineItem" :alreadySelectedTasks="alreadySelectedTasks" v-model="lineItemDialog" @save="saveLineItem" />
    </div>

    <v-card class="mt-3">
      <v-card-text>
        <v-row class="mb-1" v-if="workOrder.line_items">
          <v-col cols="12" sm="5"></v-col>
          <v-col cols="12" sm="2">Labor</v-col>
          <v-col cols="12" sm="2">Part</v-col>
          <v-col cols="12" sm="2">SubTotal</v-col>
          <v-col cols="12" sm="1"></v-col>
        </v-row>
        <ServiceTaskItem class=" mt-2" v-for="(lineItem, i) in workOrder.line_items" :key="i" :lineItem="lineItem"
          @edit="editLineItem(lineItem)" @delete="deleteLineItem(lineItem.id as number)" @addLabor="addLabor(lineItem)"
          @addPart="addPart(lineItem)" @editLabor="editLabor(lineItem, $event)"
          @editPart="editPart(lineItem, $event)" />
      </v-card-text>
    </v-card>

    <!-- Add Labor Dialog -->
    <LaborDialog v-model="showLaborDialog" :laborItem="selectedLaborItem"
      :currentServiceTask="selectedLineItem.service_task" @save="saveLabor" @delete="deleteLabor"
      :addingToLineItem="true" />

    <!-- Add Part Dialog -->
    <PartDialog v-model="showPartDialog" :partItem="selectedPartItem"
      :currentServiceTask="selectedLineItem.service_task" :selectedPartLocations="selectedPartLocations"
      @save="savePart" @delete="deletePart" :addingToLineItem="true" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { PropType } from 'vue';
import type { WorkOrder, LineItem, CustomField, Labor, Part } from '@/types/maintenance/workOrder';
import ServiceTaskItem from './components/ServiceTaskItem.vue';
import LineItemDialog from './components/LineItemDialog.vue'
import LaborDialog from './components/LaborDialog.vue'
import PartDialog from './components/PartDialog.vue'
import type { Location } from '~/types/maintenance/partSupplyTypes';

const props = defineProps({
  workOrder: {
    type: Object as PropType<Partial<WorkOrder>>,
    required: true,
  },
  loading: {
    type: Boolean,
    required: false,
    default: false
  }
});


const emit = defineEmits(['addPart', 'editPart', 'addLabor', 'editLabor']);

const layoutStore = useLayoutStore();

const workOrderStore = useWorkOrderStore();

const selectedLineItem = ref<Partial<LineItem>>({})
const lineItemDialog = ref(false)

const selectedLaborItem = ref<Partial<Labor>>({})
const showLaborDialog = ref(false)

const selectedPartItem = ref<Partial<Part>>({});
const selectedPartLocations = ref<Location[]>([])
const showPartDialog = ref(false)

// const currentServiceTask = ref<Partial<ServiceTask>>({})

const addLineItem = () => {
  selectedLineItem.value = {}
  lineItemDialog.value = true
}

const editLineItem = (LineItem: LineItem) => {
  selectedLineItem.value = JSON.parse(JSON.stringify(LineItem))
  lineItemDialog.value = true
}

const alreadySelectedTasks = computed(()=>{
  return props.workOrder?.line_items?.map(line_item => line_item.service_task_id) ?? []
})

const deleteLineItem = async (id: number) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog('Are you sure you want to delete this line item ?')
  if (confirm) {
    await workOrderStore.deleteLineItem(props.workOrder.id as number, id)
  }
  await workOrderStore.fetchWorkOrderById(props.workOrder.id as number)
}

const saveLineItem = async (LineItem: Partial<LineItem>) => {
  if (LineItem.id) {
    await workOrderStore.updateLineItem(props.workOrder.id as number, LineItem.id, LineItem)
  } else {
    await workOrderStore.addLineItem(props.workOrder.id as number, LineItem)
  }
  await workOrderStore.fetchWorkOrderById(props.workOrder.id as number)
}

const addLabor = (lineItem: Partial<LineItem>) => {
  selectedLineItem.value = lineItem

  let payload = {
    service_task_id: lineItem.service_task_id,
  }

  // currentServiceTask.value = null //lineItem.service_task
  selectedLaborItem.value = JSON.parse(JSON.stringify(payload))
  showLaborDialog.value = true

  // emit('addLabor', payload)
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
    await workOrderStore.addLaborItem(props.workOrder.id as number, selectedLineItem.value.id as number, labor)
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

const addPart = (lineItem: Partial<LineItem>) => {
  selectedLineItem.value = JSON.parse(JSON.stringify(lineItem))
  selectedPartLocations.value = []

  let payload = {
    service_task_id: lineItem.service_task_id,
    hourly_labor_rate: 0,
    hours: 0,
  }

  selectedPartItem.value = payload
  showPartDialog.value = true
  // emit('addPart', payload)
};

const editPart = (lineItem: Partial<LineItem>, part: Partial<Part>) => {
  selectedLineItem.value = JSON.parse(JSON.stringify(lineItem))
  selectedPartItem.value = JSON.parse(JSON.stringify(part))
  selectedPartLocations.value = part.part?.locations ?? []
  showPartDialog.value = true
  // emit('editPart', part)
}

const savePart = async (part: Partial<Part>) => {
  if (part.id) {
    await workOrderStore.updatePartItem(props.workOrder.id as number, selectedLineItem.value.id as number, part.id as number, part)
  } else {
    await workOrderStore.addPartItem(props.workOrder.id as number, selectedLineItem.value.id as number, part)
  }
  await workOrderStore.fetchWorkOrderById(props.workOrder.id as number)
}

const deletePart = async (part: any) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog('Are you sure you want to delete this part item ?')
  if (confirm) {
    showPartDialog.value = false
    await workOrderStore.deletePartItem(props.workOrder.id as number, selectedLineItem.value.id as number, part.id as number)
  }
  await workOrderStore.fetchWorkOrderById(props.workOrder.id as number)
}
</script>

<style scoped>
.title {
  font-weight: bold;
  color: #1984c5;
}

.trigger-btn {
  transition: transform 0.3s ease;
}

.trigger-btn.rotated {
  transform: rotate(90deg);
}

.service-task-column {
  width: 40%;
}

.service-task-head {
  width: 20%;
}

.icon-container {
  position: relative;
  display: inline-block;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background-color: transparent;
  transition: background-color 0.3s ease;
}

.icon-container:hover .overlay {
  background-color: rgba(0, 0, 0, 0.1);
}

.progress-bar-container {
  width: 100%;
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 4px;
  margin-top: 10px;
}

.progress-bar {
  height: 100%;
  background-color: #4caf50;
  border-radius: 4px;
  transition: width 0.3s ease-in-out;
}
</style>