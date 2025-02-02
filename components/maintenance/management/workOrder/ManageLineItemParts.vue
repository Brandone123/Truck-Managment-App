<template>
  <div>
    <div class="d-flex justify-end">
      <v-btn @click="addPart" color="primary">Add Part</v-btn>
      <PartDialog v-model="showPartDialog" :partItem="selectedPartItem"
        :currentServiceTask="selectedLineItem.service_task" :selectedPartLocations="selectedPartLocations"
        @save="savePart" @delete="deletePart" />
    </div>

    <template v-for="(lineItem, i) in workOrder.line_items" :key="i">
    <v-card class="mt-3" v-if="lineItem.parts?.length" >
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="5">{{ lineItem.service_task?.name }}</v-col>
          <v-col cols="12" sm="2">Qty</v-col>
          <v-col cols="12" sm="2">Unit Cost</v-col>
          <v-col cols="12" sm="2">Subtotal</v-col>
          <v-col cols="12" sm="1"></v-col>
        </v-row>
        <v-divider></v-divider>
      </v-card-text>
      <v-card-text>
            <PartItem class="mt-2" v-for="(partItem, index) in lineItem.parts" :key="index" :partItem="partItem"
              @onEdit="editPart(lineItem, partItem)" @:selectedPartLocations="selectedPartLocations" />
      </v-card-text>
    </v-card>
  </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import type { PropType } from 'vue';
import { useValidation } from '~/composables/formValidation';
import type { WorkOrder, LineItem, Part } from '@/types/maintenance/workOrder';
import type { ServiceTask } from '~/types/maintenance/serviceTaskTypes';
import PartDialog from './components/PartDialog.vue'
import PartItem from './components/PartItem.vue'
import type { Location } from '~/types/maintenance/partSupplyTypes';

const props = defineProps({
  workOrder: {
    type: Object as PropType<Partial<WorkOrder>>,
    required: true,
  },
});

const layoutStore = useLayoutStore();

const workOrderStore = useWorkOrderStore();

const selectedLineItem = ref<Partial<LineItem>>({})

const selectedPartItem = ref<Partial<Part>>({});
const showPartDialog = ref(false)

const selectedPartLocations = ref<Location[]>([])

const addPart = () => {
  selectedLineItem.value = {}

  let payload = {
    hourly_labor_rate: 0,
    hours: 0,
  }
  selectedPartLocations.value = []
  selectedPartItem.value = payload as Partial<Part>
  showPartDialog.value = true
};

const editPart = (lineItem: Partial<LineItem>, part: any) => {
  selectedLineItem.value = JSON.parse(JSON.stringify(lineItem))
  selectedPartItem.value = JSON.parse(JSON.stringify(part))
  selectedPartLocations.value = part.part?.locations ?? []
  showPartDialog.value = true
}

const savePart = async (part: Partial<Part>) => {
  if (part.id) {
    await workOrderStore.updatePartItem(props.workOrder.id as number, selectedLineItem.value.id as number, part.id as number, part)
  } else {
    console.log(part)
    await workOrderStore.addServiceTaskPartItem(props.workOrder.id as number, part.service_task_id as number, part)
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

<style scoped></style>