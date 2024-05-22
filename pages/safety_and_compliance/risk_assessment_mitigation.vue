<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              Risk Assessment & Mitigation
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="openRiskDialog">Add Risk Assessment</v-btn>
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search risks..."
                single-line
                hide-details
              ></v-text-field>
              <v-data-table
                :headers="headers"
                :items="risks"
                :search="search"
                class="elevation-1"
              >
                <template v-slot:item.actions="{ item }">
                  <v-icon small class="mr-2" @click="editRisk(item)">
                    mdi-pencil
                  </v-icon>
                  <v-icon small @click="deleteRisk(item)">
                    mdi-delete
                  </v-icon>
                </template>
                <template v-slot:item.mitigationPlan="{ item }">
                  <v-chip
                    v-if="item.mitigationPlan"
                    color="green"
                    small
                  >
                    Defined
                  </v-chip>
                  <v-chip
                    v-else
                    color="red"
                    small
                  >
                    Not Defined
                  </v-chip>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <!-- Risk Dialog/Modal -->
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="text-h5">{{ dialogTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="currentRisk.date" label="Date"></v-text-field>
                  <v-text-field v-model="currentRisk.assessmentType" label="Assessment Type"></v-text-field>
                  <v-select
                    v-model="currentRisk.riskCategory"
                    :items="riskCategories"
                    label="Risk Category"
                    item-text="name"
                    item-value="value"
                  ></v-select>
                  <v-slider
                    v-model="currentRisk.riskLevel"
                    :max="10"
                    label="Risk Level"
                    thumb-label="always"
                  ></v-slider>
                  <v-textarea v-model="currentRisk.mitigationPlan" label="Mitigation Plan"></v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="saveRisk">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const risks = ref([
    // Sample data
    {
      id: 1,
      date: '2024-03-15',
      assessmentType: 'Routine Check',
      riskCategory: 'Vehicle Maintenance',
      riskLevel: 5,
      mitigationPlan: 'Regular service every 10,000 miles.',
    },
    // Additional risk assessments
  ]);
  
  const headers = ref([
    { text: 'Date', value: 'date' },
    { text: 'Assessment Type', value: 'assessmentType' },
    { text: 'Risk Category', value: 'riskCategory' },
    { text: 'Risk Level', value: 'riskLevel' },
    { text: 'Mitigation Plan', value: 'mitigationPlan', sortable: false },
    { text: 'Actions', value: 'actions', sortable: false },
  ]);
  
  const search = ref('');
  const dialog = ref(false);
  const dialogTitle = ref('');
  const currentRisk = ref({});
  const riskCategories = ref([
    { value: 'Vehicle Maintenance', name: 'Vehicle Maintenance' },
    { value: 'Driver Behavior', name: 'Driver Behavior' },
    // Add more categories as needed
  ]);
  
  const openRiskDialog = () => {
   
    dialog.value = true;
  dialogTitle.value = 'Add New Risk Assessment';
  currentRisk.value = { riskLevel: 5 }; // Default risk level for new entries
};

const editRisk = (item) => {
  currentRisk.value = { ...item };
  dialogTitle.value = 'Edit Risk Assessment';
  dialog.value = true;
};

const deleteRisk = (item) => {
  console.log('Deleting risk assessment', item);
  // Implement deletion logic here, typically involving an API call to remove the risk assessment from the backend
  // Refresh the list of risk assessments afterwards to reflect the changes
};

const saveRisk = () => {
  console.log('Saving risk assessment', currentRisk.value);
  // Implement save logic here, which might involve deciding whether you're adding a new risk or updating an existing one
  // This usually includes making an API call to save the currentRisk data to your backend
  // After saving, you should refresh the list of risk assessments to reflect the new or updated information
  closeDialog();
};

const closeDialog = () => {
  dialog.value = false;
};
</script>

<style scoped>
/* Add styles here if needed */
</style>
