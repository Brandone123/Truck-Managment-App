<template>
  <div class="container">
    <div class="d-flex justify-space-between">
      <span class="text-primary text-h5">Customer Interactions Page </span>
    </div>
    <v-row class="mt-14">
      <v-col cols="4">
        <v-card>
          <v-card-title>
            <span class="title">Filter by Campaign</span>
          </v-card-title>
          <v-card-text>
            <v-autocomplete v-model="selectedCampaign" outlined dense 
                  :items="campaignList" item-title="campaign_name" item-value="id" label="All Campaigns">
            </v-autocomplete>
          </v-card-text>

          <v-card-title>
            <span class="title">Filter type of Interaction</span>
          </v-card-title>
          <v-card-text>
            <div class="interaction-filters">
              <v-btn v-for="(type, index) in interactionTypes" :key="type" outlined class="interaction-filter"
                :class="{'active': selectedInteractionType === type}" @click="selectInteractionType(type)">
                {{ type }}
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="8">
        <v-card>
          <v-card class="px-5 py-5 mr-5 ml-5 mb-5 mt-5 elevation-5 gray-background rounded-xl">
              <v-card-text>
                <div v-if="filteredInteractions.length === 0" class="text-center py-4">
                No interactions found
              </div>
              <div class="conversation">
                <div v-for="(interaction, index) in filteredInteractions" :key="index" class="message-container">
                 
                  <span class="message-sender">{{ getCustomerName(interaction.customer_id) }}</span>
                  <div :class="['user-message', 'message', {'message-sent': index === sentMessageIndex} ]">
                    <div class="message-content">
                      {{ interaction.interaction_details }}
                    </div>
                    <div class="message-info">
                      <span class="message-timestamp">{{ interaction.date }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="text-input">
                <v-textarea v-model="messageInput" append-icon="mdi-send" dense outlined label="Type your message" 
                  rows="1" auto-grow density="compact" @click:append="sendMessage"></v-textarea>
              </div>
            </v-card-text>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {useCustomerInteractionStore} from '@/stores/marketing/customer_interaction'
import {useCustomerStore} from '@/stores/customer'
import type { CustomerInteractionInfo } from '~/types/marketing/customer_interaction';


const interactionListStore = useCustomerInteractionStore()
const {interactionList} = storeToRefs(interactionListStore)

const marketingCampaignListStore = useMarketingCampaignStore()
const {campaignList} = storeToRefs(marketingCampaignListStore)

const customerListStore = useCustomerStore()
const {customerList} = storeToRefs(customerListStore) 

onMounted(() => {
  customerListStore.fetchCustomerList()
})

const selectedCampaign = ref();
const selectedInteractionType = ref();

const interactionTypes = ref(['Call', 'Meeting', 'Chat', 'Email'])


const filteredInteractions = computed(() => {
  return interactionList.value.filter((interaction: CustomerInteractionInfo) => {
    let response = true;
    if (selectedInteractionType.value !== null) {
      response = response && interaction.interaction_type === selectedInteractionType.value;
    }
    if (selectedCampaign.value !== null) {
      response = response && interaction.campaign_id === selectedCampaign.value;
    }
    return response;
  });
});

const getCustomerName = (customerId: any) => {
  const customer = customerList.value.find(customer => customer.id === customerId);
  return customer ? customer.name : '';
};

const messageInput = ref('');
const auth = useAuthStore();
const sentMessageIndex = ref(-1);


const getCurrentTimestamp = () => {
  const now = new Date();
  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months start at 0, so we add 1
  const year = now.getFullYear();

  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

const sendMessage = () => {
  if (messageInput.value) {
    // Create a new interaction with the user's message
    const newInteraction = {
      id: null,
      campaign_id: selectedCampaign.value,
      interaction_details: messageInput.value,
      customer_id: auth.user?.id, // Customer ID (if known)
      interaction_type: selectedInteractionType.value, // Type of interaction (in this case, a chat)
      date: getCurrentTimestamp(), // Current date and time
    };

    // Add the new interaction to the list of interactions
    interactionListStore.createInteraction(newInteraction);

    sentMessageIndex.value = filteredInteractions.value.length - 1;

    // Reset text input area
    messageInput.value = '';
  }
};

const selectInteractionType = (type:any) => {
  if (selectedInteractionType === type) {
    // If the interaction type is already selected, deselect it.
    selectedInteractionType.value = null;
  } else {
    // Otherwise, select the new interaction type
    selectedInteractionType.value = type;
  }
};

</script>

<style>
.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
}

.conversation {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.message-container {
  /* display: flex; */
  justify-content: flex-start;
  margin-bottom: 16px;
}

.message {
  /* display: inline-block; */
  max-width: 70%;
  border-radius: 20px;
  padding: 8px 12px;
  color: #fff;
}

.user-message {
  background-color: #81aaf7;
  align-self: flex-end;
}

.message-content {
  margin-bottom: 4px;
}

.message-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  opacity: 0.7;
}

.message-timestamp {
  margin-right: 15px;
}

.message-sender {
  color:darkgrey;
}

.message-sent {
  background-color: #d07bfb;
}

.text-input {
  display: flex;
  align-items: center;
  border-top: 1px solid #ccc;
  padding: 8px;
}
.text-input v-textarea {
  flex-grow: 1;
  margin-right: 8px;
}


.interaction-filters {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.interaction-filter {
  margin-right: 8px;
  margin-bottom: 8px;
  text-transform: capitalize;
}

.interaction-filter.active {
  background-color: #3f51b5;
  color: #fff;
}
</style>