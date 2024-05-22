<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia'
import { useNetworkingStore } from '@/stores/marketing/networking'
import type { NetworkingInfo } from '@/types/marketing/networking';


const networkingStore = useNetworkingStore()
const {networkingList} = storeToRefs(networkingStore)


const emit = defineEmits(['editNetworking', 'deleteNetworking'])

const networkingHeaders = ref([
    { title: 'NETWORKING ID', key: 'id' ,class:"no-wrap" },
    { title: 'NETWORKING NAME', key: 'event_name' ,class:"no-wrap" },
    { title: 'DATE', key: 'date',class:"no-wrap"  },
    { title: 'LINK', key: 'link',class:"no-wrap"  },
    { title: 'DESCRIPTION', key: 'description',class:"no-wrap"  },
    { title: 'ACTIONS', key: 'actions',class:"no-wrap" },

])

const networkingDialog = ref(false)
const updatingNetworking = ref(false)


const defaultNetworking: Ref<NetworkingInfo> = ref({
    id: null,
    event_name: null,
    date: null,
    description: null,
    link: null,
});

const editedNetworking = ref(defaultNetworking.value)

const editNetworking = (networking: NetworkingInfo) => {
    editedNetworking.value = Object.assign({}, networking)
    updatingNetworking.value = true
    networkingDialog.value = true
}

const updateNetworkingDialog = (value: boolean) => {
    networkingDialog.value = value
    editedNetworking.value = defaultNetworking.value as NetworkingInfo
    updatingNetworking.value = false
}

const deleteNetworking = (id: number) => {
    networkingStore.deleteNetworking(id)
}

</script>
<template>
    <div>
      <div class="d-flex justify-space-between">
        <span class="text-primary text-h5">Industry Networking </span>
        <div>
            <MarketingNetworkingDialog :updating="updatingNetworking" @update:show="updateNetworkingDialog" 
            :show="networkingDialog" :item="editedNetworking" />
        </div>
      </div>
        
      <SharedUiCustomTable return-object show-select :headers="networkingHeaders" :items="networkingList">
          <template v-slot:item.actions="{ item }">
              <div>
              <v-icon color="primary" dense @click="editNetworking(item)">mdi-pencil</v-icon>
              <v-icon color="red" dense @click="deleteNetworking(item.id)">mdi-delete</v-icon>
              </div>
          </template>
          <template v-slot:item.link="{ item }">
              <div>
                <v-chip @click="item.link">
                    view link
                </v-chip>
              </div>
          </template>
      </SharedUiCustomTable>
    </div> 
</template>