<template>
  <!-- <TireAddDialog v-model="tireDialog" :selectedPosition="selectedPosition ?? undefined" :configuration="configuration"
    :tirePlacement="tirePlacement" @save="installTire" /> -->

  <v-row>
    <v-col :cols="showSidePanel ? 12 : 6">
      <v-card style="overflow-y:auto;">
        <v-card-title class="text-h7 font-weight-bold text-primary d-flex justify-space-between align-center">
          <span>Axle Configuration</span>
          <v-btn variant="text" density="compact" class="text-none" @click="axleConfigDialog = true"
            color="primary">Edit</v-btn>
        </v-card-title>
        <AxleConfigSelectionDialog v-model="axleConfigDialog" :configuration="configuration"
          @update:configuration="updateConfiguration" />

        <v-card-text>
          <div id="tireContainer" style="max-width:70%;margin:0 auto;"></div>
          <div v-if="!selectedAsset.axle_configuration?.tireLayout?.length" class="d-flex text-center">Axle
            configuration not setup</div>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col :cols="showSidePanel ? 12 : 6">
      <v-card style="overflow-y:auto;">
        <div class=" px-3 pt-3 d-flex justify-space-between">
          <span class="text-h6 font-weight-bold text-primary">Installed Tires
          </span>
          <span>
            <!-- <v-menu offset-y close-on-content-click>
              <template v-slot:activator="{ props }">
                <v-btn color="primary" v-bind="props" class="custom-button" variant="outlined" density="comfortable">
                  <v-icon>mdi-dots-horizontal</v-icon>
                </v-btn>
              </template>
<v-list density="compact">
  <v-list-item @click="" append-icon="mdi-tire">Rotate</v-list-item>
  <v-list-item @click="removeAllTires" append-icon="mdi-delete">Remove All</v-list-item>
</v-list>
</v-menu> -->

            <!-- <v-btn :disabled="!selectedAsset?.axle_configuration?.tireLayout" density="comfortable" variant="outlined"
              class="text-primary ml-2" @click="addAxle()">
              <v-icon>mdi-plus</v-icon>Add
            </v-btn> -->
          </span>
        </div>
        <template v-if="selectedAsset.tires" v-for="(tire, i) in selectedAsset.tires ?? []" :key="i">
          <InstalledTire :tire="tire" />
          <v-divider v-if="i < selectedAsset.tires.length - 1"></v-divider>
        </template>
        <div v-else class="pa-4" style="font-size:small; color:grey; text-align: center;">
          <span><v-icon size="150">mdi-tire</v-icon></span>
          <p>There are no tires installed on this vehicle yet.</p>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, defineProps, onBeforeMount } from 'vue';
import TireAddDialog from './TireAddDialog.vue'
import AxleConfigSelectionDialog from './AxleConfigSelectionDialog.vue';
import { storeToRefs } from 'pinia';
import type { Tire, TireInstallation } from '~/types/maintenance/tireTypes';
import TireLayoutManager from '~/utils/tireManager';
import InstalledTire from './components/InstalledTire.vue';
import { useTheme } from 'vuetify'

const vTheme = useTheme()
const primaryColor = vTheme.current.value.colors.primary

const props = defineProps({
  showSidePanel: {
    type: Boolean,
    required: false,
    default: false
  }

});

const layoutStore = useLayoutStore()
const tireStore = useTireStore()

const tireLayoutManager = ref<any>(null)

const assetStore = useAssetStore()
const { selectedAsset } = storeToRefs(assetStore)


const tireDialog = ref(false);
const selectedPosition = ref<string | null>(null);

const configuration = computed({
  get() {
    return selectedAsset.value?.axle_configuration //?? { tireLayout: '', axles: {} }
  },
  set(val) {
    assetStore.updateAsset({ id: selectedAsset.value.id, axle_configuration: val })
    assetStore.fetchAssetById(selectedAsset.value.id as number)
  }
})

const tirePlacement = computed(() => {
  let tires: Record<string, any> = {}
  if (selectedAsset.value?.tires?.length) {
    selectedAsset.value?.tires.forEach((tire: any) => {
      tires[tire.current_installation?.position] = { tirePressure: tire.current_installation?.pressure, threadDepth: tire.current_installation?.tread_depth }
    })
  }
  return tires
})

const axleConfigDialog = ref<boolean>(false)

const installTire = async (tire: any) => {
  let payload = { ...tire } as any
  if (payload.installation) {
    payload.installation.vehicle_id = selectedAsset.value.id
    payload.vehicle_id = selectedAsset.value.id
  }

  tireStore.createTire(payload as Tire)
  assetStore.fetchAssetById(selectedAsset.value.id as number)
}

const updateConfiguration = (value: Record<string, any>) => {
  //save configuration
  configuration.value = value as any
}

const removeAllTires = async () => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog(
    "Proceed to remove all tires from vehicle ?"
  );

  if (confirm) {
    // emit('delete', id)
  }
}
const setTireLayout = () => {
  if (tireLayoutManager.value) {
    tireLayoutManager.value?.updateConfig({
      containerId: 'tireContainer',
      tireLayout: configuration.value!.tireLayout as any,
      defaultColor: primaryColor,
      tirePlacement: tirePlacement.value,
      axleConfiguration: configuration.value!.axles as any || {},
      onZoneClick: (zoneId: string) => {
        // addAxle(zoneId)
      },
      onAxleUpdate: (axleId: string, data: string) => {
      },
      onTireClick(zoneId: string, data: any) {
        // addAxle(zoneId, data)
      }
    })
  } else {
    tireLayoutManager.value = new TireLayoutManager({
      containerId: 'tireContainer',
      tireLayout: configuration.value?.tireLayout as any,
      defaultColor: primaryColor,
      tirePlacement: tirePlacement.value,
      axleConfiguration: configuration.value!.axles as any || {},
      onZoneClick: (zoneId: string) => {
        // addAxle(zoneId)
      },
      onAxleUpdate: (axleId: string, data: string) => {
      },
      onTireClick(zoneId: string, data: any) {
        // addAxle(zoneId, data)
      }
    })
  }
}
watch(() => configuration.value, (newVal) => {
  if (newVal?.tireLayout?.length) {
    setTireLayout()
  }
}, { deep: true })

onMounted(() => {
  if (configuration.value?.tireLayout?.length) {
    setTireLayout()
  }
})



const addAxle = (axlePosition: any = null, axleData: any = {}) => {
  selectedPosition.value = axlePosition
  tireDialog.value = true;
};

onBeforeUnmount(() => {
  if (tireLayoutManager.value) {
    tireLayoutManager.value.clear()
    tireLayoutManager.value = null;
  }
})

</script>

<style scoped>
.axle-configuration {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.axle {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 8px;
  position: relative;
}

.axle-icon-container {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.axle-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 80px;
  background-color: #1867C0;
  border-radius: 5%;
  padding-right: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.axle-icon:hover {
  background-color: #d0d0d0;
}

.axle-connector {
  position: relative;
  bottom: -20px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.connector-line {
  width: 100%;
  height: 10px;
  margin-top: 35px;
  background-color: #c0c0c0;
}

/* Optional styling */
.custom-button {
  min-width: 0;
  width: 20px;
}
</style>