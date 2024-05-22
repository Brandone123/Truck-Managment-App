<template>
  <div class="d-flex justify-space-between">
    <span class="text-primary text-h5">Advertising Channel Page</span>
    <div>
        <MarketingAdvertisingDialog :updating="updatingAdvertising" @update:show="updateAdvertisingDialog" 
        :show="advertisingDialog" :item="editedChannel" />
    </div>
  </div>

  <SharedUiCustomTable return-object show-select :loading="laodingChannel" :headers="chanelHeaders" :items="channelList">
      <template v-slot:item.actions="{ item }">
          <div>
          <v-icon color="primary" dense @click="editChannel(item)">mdi-pencil</v-icon>
          <v-icon color="red" dense @click="deleteChannel(item.id)">mdi-delete</v-icon>
          </div>
      </template>
      <template v-slot:item.api="{ item }">
        <v-btn dense color="#00B5D1" @click="openCredentialsDialog(item.id)" class="publish-btn">API Credentials</v-btn>
      </template>
  </SharedUiCustomTable>

  <v-dialog v-model="dialogVisible" max-width="500px">
      <v-card>
        <v-toolbar color="primary" title="API Credentials" density="compact">
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogVisible = false">
            <v-icon>mdi-window-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form ref="channelForm">
            <v-text-field v-model="api_key" label="API Key"></v-text-field>
            <v-text-field v-model="api_secret" label="API Secret"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="saveCredentials">Save</v-btn>
          <v-btn color="red" variant="text" @click="dialogVisible = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type {AdvertisingInfo} from '@/types/marketing/advertising'

const advertisingChannelStore = useAdvertisingStore();
const {channelList, loading: laodingChannel } = storeToRefs(advertisingChannelStore)

const advertisingDialog = ref(false)
const updatingAdvertising = ref(false)

const layoutStore = useLayoutStore()

onMounted(() => {
  advertisingChannelStore.fetchChannelList();
})

const chanelHeaders = ref([
    { title: 'CHANEL ID', key: 'id' ,class:"no-wrap" },
    { title: 'CHANEL NAME ', key: 'channel_name' ,class:"no-wrap" },
    { title: 'DESCRIPTION', key: 'description',class:"no-wrap"},
    { title: 'ACTIONS', key: 'actions',class:"no-wrap" },
    { title: 'API MANAGMENT', key: 'api',class:"no-wrap" },
])

const dialogVisible = ref(false)

const channelForm = ref(null);

const api_key = ref('')
const api_secret= ref('')
const idChannel = ref()
const channel_name = ref("")
const description = ref("")

const defaultAdvertising: Ref<AdvertisingInfo> = ref({
  id: null,
  channel_name: null,
  description: null,
  api_key: null,
  api_secret: null,
});

const editedChannel = ref(defaultAdvertising.value)

const editChannel = (advertising: AdvertisingInfo) => {
    editedChannel.value = Object.assign({}, advertising)
    updatingAdvertising.value = true
    advertisingDialog.value = true
}

const openCredentialsDialog = (id: number) => {
  const advertising = channelList.value.find((item) => item.id === id);
  if (advertising) {
    channel_name.value = advertising.channel_name !== null ? advertising.channel_name : '';
    description.value = advertising.description !== null ? advertising.description : '';
    api_key.value = advertising.api_key !== null ? advertising.api_key : '';
    api_secret.value = advertising.api_secret !== null ? advertising.api_secret : '';
    idChannel.value = advertising.id !== null ? advertising.id : '';
    dialogVisible.value = true;
  }
};

const saveCredentials = () => {
  const updatedItem = {
    id: idChannel.value !== '' ? idChannel.value : editedChannel.value.id,
    channel_name:  channel_name.value ,
    description:  description.value ,
  };

  advertisingChannelStore.updateChannel({...updatedItem,  api_key:  api_key.value, api_secret: api_secret.value});
  dialogVisible.value = false;
};

const deleteChannel = async (id: number) => {
  const { confirm, cancel } = await layoutStore.showConfirmDialog("Are you sure you want to delete")

  if (confirm) {
    advertisingChannelStore.deleteChannel(id)
  }
}

const updateAdvertisingDialog = (value: boolean) => {
    advertisingDialog.value = value
    editedChannel.value = defaultAdvertising.value as AdvertisingInfo
    updatingAdvertising.value = false
}

const resetForm = () => {
  if (channelForm.value) {
    (channelForm.value as HTMLFormElement).reset(); // Reset the form
  }
};

watch(dialogVisible, (val) => {
  if (val) {
    editedChannel.value = { ...defaultAdvertising.value };
  } else {
    resetForm();
  }
});

</script>

<style scoped>
.channel-card {
  transition: transform 0.2s;
}
.channel-card:hover {
  transform: translateY(-5px);
}
</style>