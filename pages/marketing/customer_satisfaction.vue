<template>
  <div>
    <div class="d-flex justify-space-between">
      <span class="text-primary text-h5">Customer Satisfaction</span>
    </div>

    <div class="mt-16">
      <v-row>
        <v-col cols="12" md="4">
          <v-card>
            <v-card-text>
              <v-card-title>{{ ButtonText }}</v-card-title>
              <v-form ref="surveyForm">
                <v-row class="my-4">
                  <v-col cols="12" md="6" class="pb-0">
                    <v-autocomplete v-model="surveyInfo.customer_id" :items="customerList" item-value="id" item-title="name" label="Customer Name" flat density="compact" :rules="[rules.required]"></v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="6" class="pb-0">
                    <v-text-field type="date" v-model="surveyInfo.date" label="Date" flat density="compact" :rules="[rules.required]"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" class="pb-0">
                    <v-select v-model="surveyInfo.feedback_type" :items="['Complaint', 'Suggestion']" label="Feedback Type" flat density="compact" :rules="[rules.required]"></v-select>
                  </v-col>
                  <v-col cols="12" class="pb-0">
                    <v-textarea v-model="surveyInfo.feedback_details" flat density="compact" label="Feedback Details" rows="3" required></v-textarea>
                  </v-col>

                </v-row>
              </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" variant="text" @click="save">
                {{ saveButtonText }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col cols="12" md="8">
          <v-card>
            <v-card-text>
              <v-card-title>Feedback List</v-card-title>
              <div>
                <v-data-table :headers="surveyheaders" :items="feedbackList" :loading="loadingCustomer" class="elevation-1">
                  <template v-slot:item.actions="{ item }">
                    <div>
                      <v-icon class="ml-4" dense color="green" @click="editFeedback(item)">mdi-pencil</v-icon>
                      <v-icon class="ml-4" color="red" dense @click="deletefeedback(item.id)">mdi-delete</v-icon>
                    </div>
                  </template>
                  <template v-slot:item.customer_id="{ item }">
                    {{ getCustomerName(item.customer_id) }}
                  </template>
                </v-data-table>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, defineEmits } from 'vue';
import type { CustomerSatisfactionInfo } from '@/types/marketing/customer_satisfaction';
import { useCustomerSatisfactionStore } from '~/stores/marketing/customer_satisfaction';

const customerSatisfactionStores = useCustomerSatisfactionStore();
const { feedbackList, createFeedback, updateFeedback, deleteFeedback } = customerSatisfactionStores;

const customerStore = useCustomerStore();
const {customerList, loading: loadingCustomer} = storeToRefs(customerStore)

onMounted(() =>{
  customerStore.fetchCustomerList()
})

const rules = {
  required: (value: string) => !!value || 'Field is required'
};

const updatingFeedback = ref(false);

const getCustomerName = (customerId: any) => {
  const customer = customerList.value.find((customer) => customer.id === customerId);
  return customer ? customer.name : '';
};

const saveButtonText = computed(() => {
  return updatingFeedback.value ? 'Update' : 'Add Feedback';
});

const ButtonText = computed(() => {
  return updatingFeedback.value ? 'Update Feedback' : 'Add Feedback';
});

const surveyInfo = ref<CustomerSatisfactionInfo>({
  id: null,
  customer_id: null,
  date: null,
  feedback_type: null,
  feedback_details: null,
});

const editFeedback = (feedback: CustomerSatisfactionInfo) => {
  surveyInfo.value = { ...feedback };
  updatingFeedback.value = true;
};

const deletefeedback = (id: any) => {
  deleteFeedback(id);
};

const save = () => {
  if (updatingFeedback.value) {
    updateFeedback(surveyInfo.value);
  } else {
    createFeedback(surveyInfo.value);
  }
  resetForm();
};

const resetForm = () => {
  surveyInfo.value = {
    id: null,
    customer_id: null,
    date: null,
    feedback_type: null,
    feedback_details: null,
  };
  updatingFeedback.value = false;
};

const surveyheaders = ref([
  { title: 'CUSTOMER NAME', key: 'customer_id', class: 'no-wrap' },
  { title: 'DATE', key: 'date', class: 'no-wrap' },
  { title: 'FEEDBACK TYPE', key: 'feedback_type', class: 'no-wrap' },
  { title: 'FEEDBACK DETAILS', key: 'feedback_details', class: 'no-wrap' },
  { title: 'Actions', key: 'actions', sortable: false, class: 'no-wrap' },
]);

const emit = defineEmits(['editFeedback', 'deletefeedback']);
</script>