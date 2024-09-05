<template>
  <v-dialog v-model="dialog" width="400px">
    <template v-slot:activator="{ props }">
      <v-btn color="primary" flat v-bind="props" class="text-none">
        <v-icon>mdi-plus</v-icon>
        Add Vehicle
      </v-btn>
    </template>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark>
        <v-toolbar-title>Add Vehicle</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form ref="serviceProgramForm">
          <v-row class="mt-4">
            <v-col cols="12">
              <v-autocomplete variant="solo" flat density="compact" :items="filteredAssetList" v-model="selectedVehicle"
                label="Vehicles" item-value="id" item-title="name">
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props" :subtitle="item.raw.name" :title="item.raw.id as number"></v-list-item>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" variant="text" @click="closeDialog">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="addVehicle()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';

const dialog = ref(false)

const assetStore = useAssetStore()
const { assetList } = storeToRefs(assetStore)

const props = defineProps({
  selection: {
    type: Array,
    required: false,
    default: () => { [] }
  }
})
const closeDialog = () => {
  dialog.value = false
}


const filteredAssetList = computed(() => {
  if (props.selection.length) {
    let selectedVehicleIds = props.selection.map(selection => selection.id)
    return assetList.value.filter((item) => !selectedVehicleIds.includes(item.id as number))
  }
  return assetList.value
})

const selectedVehicle = ref<number | null>(null)

const emit = defineEmits(['addVehicle']);

const addVehicle = () => {
  emit('addVehicle', selectedVehicle.value)
  closeDialog()
  resetForm()
}

// const closeDialog = () => {
//   emit('update:modelValue', false);
//   emit('close');
// };



const resetForm = () => {
  selectedVehicle.value = null
}
</script>