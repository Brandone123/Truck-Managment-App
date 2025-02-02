<template>
      <div>
        <div class="d-flex justify-end">
          <v-btn @click="addLineItem" color="primary">Add LineItem</v-btn>
          <LineItemDialog :lineItem="selectedLineItem" v-model="lineItemDialog" @save="saveLineItem" />
        </div>
    
        <v-card class="mt-3">
          <v-card-text>
            <v-row class="mb-1" v-if="serviceHistory.line_items">
              <v-col cols="12" sm="5"></v-col>
              <v-col cols="12" sm="2">Labor</v-col>
              <v-col cols="12" sm="2">Part</v-col>
              <v-col cols="12" sm="2">SubTotal</v-col>
              <v-col cols="12" sm="1"></v-col>
            </v-row>
            <ServiceTaskItem class=" mt-2" v-for="(lineItem, i) in serviceHistory.line_items" :key="i" :lineItem="lineItem"
              @edit="editLineItem(lineItem)" @delete="deleteLineItem(lineItem.id as number)" />
          </v-card-text>
        </v-card>
        </div>
        
</template>

<script lang="ts" setup>
import { defineEmits, ref } from 'vue';
import type { PropType } from 'vue';
import type { ServiceHistory, LineItem } from '@/types/maintenance/serviceHistory';
import ServiceTaskItem from './components/HistoryServiceTaskItem.vue';
import LineItemDialog from './components/LineItemDialog.vue'

const props = defineProps({
  serviceHistory: {
    type: Object as PropType<Partial<ServiceHistory>>,
    required: true,
  },
  loading: {
    type: Boolean,
    required: false,
    default: false
  },
  showSidePanel: {
    type: Boolean,
    required: false,
    default: false
  }
});


const emit = defineEmits(['addPart', 'editPart', 'addLabor', 'editLabor']);

const layoutStore = useLayoutStore();

const serviceHistoryStore = useServiceHistoryStore();

const selectedLineItem = ref<Partial<LineItem>>({})
const lineItemDialog = ref(false)

const addLineItem = () => {
  selectedLineItem.value = {}
  lineItemDialog.value = true
}

const editLineItem = (LineItem: LineItem) => {
  selectedLineItem.value = JSON.parse(JSON.stringify(LineItem))
  lineItemDialog.value = true
}

const deleteLineItem = async (id: number) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog('Are you sure you want to delete this line item ?')
  if (confirm) {
    serviceHistoryStore.deleteLineItem(props.serviceHistory.id as number, id)
  }
}

const saveLineItem = async (LineItem: Partial<LineItem>) => {
  console.log("+======== \n", LineItem);
  if (LineItem.id) {
    await serviceHistoryStore.updateLineItem(props.serviceHistory.id as number, LineItem.id, LineItem)
  } else {
    await serviceHistoryStore.addLineItem(props.serviceHistory.id as number, LineItem)
  }
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