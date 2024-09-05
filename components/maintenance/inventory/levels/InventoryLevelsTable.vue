<template>
  <div>
    <div style="position:sticky;top:100px;z-index:2;" class=" grey-background position-sticky">
      <v-tabs v-model="activeFilter" color="primary" density="compact">
        <v-tab value="all" class="text-none">All</v-tab>
        <v-tab value="PARTS ROOM" class="text-none">
          <span class="mr-1" style="width: 8px; height: 8px; border-radius: 50%;"></span> PARTS ROOM
          <v-chip density="compact" class="ml-1">{{ partRoomCount }}</v-chip></v-tab>

        <v-tab value="temp" class="text-none">
          <span class="mr-1" style="width: 8px; height: 8px; border-radius: 50%;"></span>temp
          <v-chip density="compact" class="ml-1">{{ tempCount }}</v-chip></v-tab>

        <v-tab value="TIRES" class="text-none"><span class="mr-1"
            style="width: 8px; height: 8px; border-radius: 50%;"></span>TIRES
          <v-chip density="compact" class="ml-1">{{ tiresCount }}</v-chip></v-tab>

        <v-tab value="OIL" class="text-none">
          <span class="mr-1" style="width: 8px; height: 8px; border-radius: 50%;"></span>OIL
          <v-chip density="compact" class="ml-1">{{ oilCount }}</v-chip></v-tab>

        <v-menu>
          <template v-slot:activator="{ props }">
            <div class="d-inline-flex align-center v-tab text-none" v-bind="props" style="cursor:pointer">
              More
              <v-icon>mdi-chevron-down</v-icon>
            </div>
          </template>
          <v-list>
            <v-list-item v-for="(tab, index) in additionalTabs" :key="index" @click="activeFilter = tab.value"
              color="primary" density="compact" class="text-none">
              <v-list-item-title class="d-inline-flex align-center">
                <div class="mr-1" style="width: 8px; height: 8px; border-radius: 50%;"></div>
                {{ tab.title }}
                <v-chip v-if="tab.count" class="ml-1" density="comfortable">{{ tab.count }}</v-chip>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-tabs>
      <v-divider></v-divider>
    </div>
    
    <div class="d-flex justify-start pa-5" style="position:sticky;top:135px;z-index:1;background-color:#EEEEEE;">
      <v-row>
        <v-col>
          <v-select v-model="selectedCategory" :items="uniqueCategories" label="Filter categories" density="compact" variant="outlined" style="width: 220px;"></v-select>
        </v-col>
        <v-col>
          <v-text-field v-model="selectedPartNumber" label="Filter part number" density="compact" variant="outlined" style="width: 220px;"></v-text-field>
        </v-col>
        <v-col>
          <v-text-field v-model="selectedManufacturer" label="Filter manufacturers" density="compact" variant="outlined" style="width: 220px;"></v-text-field>
        </v-col>
        <v-col>
          <v-btn-toggle v-model="selectedFilter" mandatory density="compact">
            <v-btn color="secondary" value="active" @click="filterBy('active')">Active</v-btn>
            <v-btn color="secondary" value="inactive" @click="filterBy('inactive')">Inactive</v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
    </div>
  <SharedUiCustomTable :show-footer-in-head="false" :headers="headers" :items="filteredInventory" :loading="loading">
    <template v-slot:item.part_id="{ item }">
      <v-row style="justify-content: center; " class="mt-1 mb-1">
        <v-col cols="12" sm="2">
          <div class="rounded position-relative mt-1"
            style="display: flex; justify-content: center; align-items: center; width: 45px; height: 45px; background-color: grey; color: white; text-align: center; position: relative;">
            <v-icon size="25">mdi-package-variant-closed</v-icon>
          </div>
        </v-col>
        <v-col cols="12" sm="10">
          <span style="font-size: small; color:grey">
            <strong class="text-secondary">{{ getPartNumber(item.part_id)?.part_number }}</strong>
            <div>{{ getPartNumber(item.part_id)?.description }}</div>
            <div>Category:<span class="text-secondary">{{ getPartNumber(item.part_id)?.category }} </span>
              {{ getPartNumber(item.part_id)?.manufacturer_part_number }}</div>
          </span>
        </v-col>
      </v-row>
    </template>
    <template v-slot:item.aisle="{ item }">
      <div v-if="item.active">
        <v-text-field hide-details single-line min="0" step="1" density="compact" variant="outlined"
          :rules="[(value: any) => value >= 0 || 'Wrong Entry']" v-model="item.aisle"></v-text-field>
      </div>
    </template>
    <template v-slot:item.row="{ item }">
      <div v-if="item.active">
        <v-text-field hide-details single-line min="0" step="1" density="compact" variant="outlined"
          :rules="[(value: any) => value >= 0 || 'Wrong Entry']" v-model="item.row"></v-text-field>
      </div>
    </template>
    <template v-slot:item.bin="{ item }">
      <div v-if="item.active">
        <v-text-field hide-details single-line min="0" step="1" density="compact" variant="outlined"
          :rules="[(value: any) => value >= 0 || 'Wrong Entry']" v-model="item.bin"></v-text-field>
      </div>
    </template>
    <template v-slot:item.quantity="{ item }">
      <div v-if="item.active" style="justify-content: center; align-items: center;" class="text-center">
        <span style="font-size:25px;" class="font-weight-bold">
          {{ item.quantity }}
        </span>
        <div style="border-bottom: 1px dotted;">{{ getRelativeDateTime(item.created_at) }}</div>
        <v-tooltip activator="parent" location="top">
          {{ new Date(item.created_at).toLocaleString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
          }) }}
        </v-tooltip>
      </div>
    </template>
    <template v-slot:item.active="{ item }">
      <button class="custom-switch" :class="{ 'active': item.active }" @click="item.active = !item.active">
        <span class="yes-no-text" :class="{ 'slide-out': item.active, 'slide-in': !item.active }">{{ item.active ?
          'Yes'
          : 'No' }}</span>
        <span class="empty-space" :class="{ 'slide-out': !item.active, 'slide-in': item.active }"></span>
      </button>
    </template>
    <template v-slot:item.new_quantity="{ item }">
      <div v-if="item.active" class="d-flex align-items-center text-center">
        <div class="border rounded d-flex">
          <v-checkbox density="compact" class="mt-3 ml-3" :value="true" v-model="item.selected" color="secondary"
            hide-details></v-checkbox>
          <v-text-field density="compact" variant="outlined" v-model="item.new_quantity" class="ml-5" hide-details
            single-line min="0" step="1" :disabled="!item.selected"
            :rules="[(value: any) => value >= 0 || 'Wrong Entry']"></v-text-field>
        </div>
      </div>
      <div v-else>
        <!-- Afficher la partie "Part" seulement -->
      </div>
      <v-tooltip activator="parent" location="top">
        <pre style="font-size: 0.8em; text-align: center; align-items: center;">Check this box to start tracking <br> inventory on this part at {{ getPartLocation(item.location_id) }}
        </pre>
      </v-tooltip>
    </template>
  </SharedUiCustomTable>

</div>
  <v-divider class="mt-3"></v-divider>
  <v-card-actions>
    <v-btn color="primary" @click="reloadPage">Cancel</v-btn>
    <v-spacer></v-spacer>
  <v-btn color="primary" @click="">Save</v-btn>
  </v-card-actions>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import { useInventoryStore } from '@/stores/maintenance/inventoryStore';
import type { InventoryItem } from '@/types/maintenance/inventoryTypes';
import type { filterItem } from '~/types/layout/table';
import { useRouter } from 'vue-router';

const partAndSupplyStore = usePartsAndSuppliesStore()
const { partSupplies } = storeToRefs(partAndSupplyStore)

const inventoryStore = useInventoryStore();
const { inventoryItems, loading } = storeToRefs(inventoryStore)

const partLocationStore = usePartLocationStore()
const { partLocations } = storeToRefs(partLocationStore)

const router = useRouter();

const reloadPage = () => {
  location.reload();
};

const props = defineProps({
  search: String,
  inventoryItems: {
    type: Array as PropType<InventoryItem[]>,
    required: true,
  },
});

const getPartNumber = (partId: number) => {
  return partSupplies.value?.find((part: any) => part.id == partId)
}

const getPartLocation = (partId: number) => {
  return partLocations.value.find((part: any) => part.id == partId)?.name
}

const emit = defineEmits(['save']);

const headers = [
  // { title: 'ID', key: 'id' },
  { title: 'Part', key: 'part_id' },
  // { title: 'Location', key: 'location_id' },
  { title: 'Aisle', key: 'aisle' },
  { title: 'Row', key: 'row' },
  { title: 'Bin', key: 'bin' },
  { title: 'Current Qty', key: 'quantity' },
  { title: 'New Qty', key: 'new_quantity' },
  { title: 'Active', key: 'active' },
  // { title: 'Actions', key: 'actions', sortable: false },
];

const getRelativeDateTime = (dateString: any) => {
  const now = new Date();
  const createdAt = new Date(dateString);
  const diff = now.getTime() - createdAt.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''}, ${months % 12} month${months % 12 > 1 ? 's' : ''} ago`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
  }
}

const selectedFilter = ref('active');

    const selectedCategory = ref('');
    const selectedPartNumber = ref('');
    const selectedManufacturer = ref('');

    const filteredInventory = computed(() => {
      return props.inventoryItems.filter(item => {
        // Filtrage par statut (active/inactive)
        switch (selectedFilter.value) {
          case 'active':
            return item.active;
          case 'inactive':
            return !item.active;
          default:
            return true;
        }
      }).filter(item => {
        // Filtrage par emplacement
        if (activeFilter.value == 'all') {
          return true;
        }
        return getPartLocation(item.location_id) === activeFilter.value;
      }).filter(item => {
        // Filtrage par catégorie
        if (selectedCategory.value === '') {
          return true;
        }
        return getPartNumber(item.part_id as number)?.category === selectedCategory.value;
      }).filter(item => {
        // Filtrage par numéro de pièce
        if (selectedPartNumber.value === '') {
          return true;
        }
        return getPartNumber(item.part_id as number)?.part_number.toLowerCase().includes(selectedPartNumber.value.toLowerCase());
      }).filter(item => {
        // Filtrage par fabricant
        if (selectedManufacturer.value === '') {
          return true;
        }
        return getPartNumber(item.part_id as number)?.manufacturer?.toLowerCase().includes(selectedManufacturer.value.toLowerCase());
      });
    });

    // Récupérer les catégories uniques
    const uniqueCategories = computed(() => {
      return Array.from(new Set(props.inventoryItems.map(item => getPartNumber(item.part_id as number)?.category)));
    });

const filterBy = (filter: any) => {
  selectedFilter.value = filter;
};

const activeFilter = ref<string>('all')

// const filteredInventory = computed(() => {
//   if (activeFilter.value == 'all') {
//     return props.inventoryItems
//   }
//   return props.inventoryItems.filter(item => getPartLocation(item.location_id) == activeFilter.value)
// })

const partRoomCount = computed(() => {
  return props.inventoryItems?.filter(item => getPartLocation(item.location_id) == 'PARTS ROOM')?.length || 0
})

const shopSupplyCount = computed(() => {
  return props.inventoryItems?.filter(item => getPartLocation(item.location_id) == 'SHOP SUPPLY')?.length || 0
})

const tiresCount = computed(() => {
  return props.inventoryItems?.filter(item => getPartLocation(item.location_id) == 'TIRES')?.length || 0
})

const flintCount = computed(() => {
  return props.inventoryItems?.filter(item => getPartLocation(item.location_id) == 'FLINT PARTS ROOM')?.length || 0
})

const greyServiceCount = computed(() => {
  return props.inventoryItems?.filter(item => getPartLocation(item.location_id) == 'GREY SERVICE VAN')?.length || 0
})

const whiteServiceCount = computed(() => {
  return props.inventoryItems?.filter(item => getPartLocation(item.location_id) == 'WHITE SERVICE VAN')?.length || 0
})

const oilCount = computed(() => {
  return props.inventoryItems?.filter(item => getPartLocation(item.location_id) == 'OIL')?.length || 0
})

const tempCount = computed(() => {
  return props.inventoryItems?.filter(item => getPartLocation(item.location_id) == 'temp')?.length || 0
})

const additionalTabs = [
  { value: 'GREY SERVICE VAN', title: 'GREY SERVICE VAN', color: 'secondary', count: greyServiceCount },
  { value: 'WHITE SERVICE VAN', title: 'WHITE SERVICE VAN', color: 'orange', count: whiteServiceCount },
  { value: 'FLINT PARTS ROOM', title: 'FLINT PARTS ROOM', color: 'brown', count: flintCount },
  { value: 'SHOP SUPPLY', title: 'SHOP SUPPLY', color: 'yellow', count: shopSupplyCount },
]

const saveInventoryItem = async () => {
  const modifiedItems = props.inventoryItems.filter((item) => {
    return item.id !== null && item !== inventoryItems.value.find((original) => original.id === item.id);
  });
  emit('save', modifiedItems);
};

</script>
<style scoped>
.custom-switch {
  background-color: #f2f2f2;
  border: none;
  padding: 8px 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  position: relative;
  overflow: hidden;
}

.custom-switch.active {
  background-color: rgb(61, 128, 160);
  color: white;
}

.yes-no-text {
  display: inline-block;
  width: 50px;
  text-align: left;
  transition: transform 0.3s ease;
}

.custom-switch.active .yes-no-text {
  transform: translateX(50%);
}

.v-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 2px;
  border: 1px solid;
}

.v-checkbox .v-icon {
  color: #1976d2;
  font-size: 16px;
}

.v-text-field {
  width: 50px;
}
</style>