<script lang="ts">
import { ref, computed } from 'vue';
import type { YardInfo } from '~/types/yard/yard';
import type { YardSpaceInfo } from '~/types/yard/yard_space';

export default {
  props: {
    yard: {
      type: Object,
      required: true,
    },
  },

  setup(props) {
    
    const { yard } = props;

    const dialog = ref(false);

    const title = computed(() => {
      return 'Yard Info';
    });

    const yardDetailHeaders = ref([
        { title: 'YARD ID', key: 'id' ,class:"no-wrap" },
        { title: 'NAME ', key: 'name' ,class:"no-wrap" },
        { title: 'LOCATION', key: 'location',class:"no-wrap"  },
        { title: 'CAPACITY', key: 'capacity',class:"no-wrap"  },
        // { title: 'SHAPE TYPE', key: 'geofence_polygon?.type',class:"no-wrap"  },
        // { title: 'COORDINATE', key: 'geofence_polygon?.coordinates',class:"no-wrap"  },
        { title: 'ACTIONS', key: 'actions',class:"no-wrap" },

    ])

    const yardSpaceHeaders = ref([
        { title: 'YARD SPACE ID', key: 'id' ,class:"no-wrap" },
        { title: 'SPACE NUMBER ', key: 'space_number' ,class:"no-wrap" },
        { title: 'OCCUPATION', key: 'is_occupied',class:"no-wrap"  },
        { title: 'CURRENT VEHICULE ID', key: 'current_vehicle_id',class:"no-wrap"  },
        { title: 'ACTIONS', key: 'actions',class:"no-wrap" },

    ])

    const yardSpaceStore = useYardSpaceStore()
    
    const { yardSpaceList, loading } = storeToRefs(yardSpaceStore)

    const fetchYardSpaces = () => {
      yardSpaceStore.getYardSpaces(yard.id);
    };

    const FilteredYardSpace =  computed(() => {
      return yardSpaceList.value.filter((yardSpace) => yardSpace.yard_id == yard.id)
    })

    const defaultYardSpace = ref<YardSpaceInfo>({
        id: null,
        yard_id: null,
        space_number: null,
        is_occupied: null,
        current_vehicle_id: null,
    });

    const editedYardSpace = ref(defaultYardSpace.value)

    const yardSpaceDialog = ref(false)
    const updatingYardSpace = ref(false)

    const editYardSpace = (yard_space: YardSpaceInfo) => {
      editedYardSpace.value = Object.assign({}, yard_space)
      updatingYardSpace.value = true
      yardSpaceDialog.value = true
    }

    const deleteYardSpace = (id: number) => {
        yardSpaceStore.deleteYard(id)
    }

    const updateyardspaceDialog = (value: boolean) => {
        yardSpaceDialog.value = value
        editedYardSpace.value = defaultYardSpace.value as YardSpaceInfo
        updatingYardSpace.value = false
    }

    onMounted(() => {
      fetchYardSpaces();
    });

    return {
      yard,
      dialog,
      title,
      yardDetailHeaders,
      yardSpaceHeaders,
      FilteredYardSpace,
      loading,
      editYardSpace,
      deleteYardSpace,
      editedYardSpace,
      yardSpaceDialog,
      updatingYardSpace,
      updateyardspaceDialog,
      yardSpaceList,
      fetchYardSpaces
    };
  },
};
</script>

<template>
  <v-dialog v-model="dialog" fullscreen scrollable>
    <template v-slot:activator="{ props }">
      <v-btn variant="text" color="primary" class="text-none px-1" v-bind="props"  @click="fetchYardSpaces">
        <span class="mr-2">
          {{ yard.id }}
        </span>
      </v-btn>
    </template>

    <v-card class="grey-background">
      <v-toolbar color="primary" :title="title" density="compact">
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-window-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card class="px-3 py-3 mt-5">
        <section>
          <div>
            <strong class="ml-5">Yard ID:</strong> {{ yard.id }}
            <strong class="ml-5">Name:</strong> {{ yard.name }}
            <strong class="ml-5">Location:</strong> {{ yard.location }}
            <strong class="ml-5">Capacity:</strong> {{ yard.capacity }}
          </div>
        </section>
      </v-card>
      <div class="text-right mt-3 justify-space-between">
        <YardCheckYardSpaceDialog :showyardspace="yardSpaceDialog" @updatespace:showyardspace="updateyardspaceDialog"
                    :updatingyardSpace="updatingYardSpace" :itemspace="editedYardSpace" />
      </div>
      <v-card>
        <SharedUiCustomTable return-object show-select :headers="yardSpaceHeaders"
            :items="FilteredYardSpace" :loading="loading">
            <template v-slot:item.actions="{ item }">
                <div>
                    <v-icon color="primary" dense @click="editYardSpace(item)">mdi-pencil</v-icon>
                    <v-icon color="red" dense @click="deleteYardSpace(item.id)">mdi-delete</v-icon>
                </div>
            </template>
            <template v-slot:item.id="{ item }">
                <YardCheckYardSpaceDetail :yard_space="item" />
            </template>
        </SharedUiCustomTable>
      </v-card>
    </v-card>
  </v-dialog>
</template>