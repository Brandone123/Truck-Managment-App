<template>
  <v-container>
    <div class="d-flex justify-space-between mb-4">
      <span class="text-primary text-h5">Compliance And Ethics</span>
    </div>
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between mb-4">
          <span class="text-primary text-h6">Overview</span>
        </div>
        <v-card>
          <v-card-text>
            <p>
              Our company is committed to operating with integrity and in full compliance with all applicable laws,
              regulations, and ethical standards. This section provides an overview of our compliance policies, ethical
              guidelines, and the resources available to all employees.
            </p>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <div class="d-flex justify-space-between mb-4">
          <span class="text-primary text-h6">Compliance Guideline</span>
        </div>
        <v-expansion-panels>
          <v-expansion-panel v-for="(guideline, index) in complianceGuidelines" :key="index">
            <v-expansion-panel-title>{{ guideline.title }}</v-expansion-panel-title>
            <v-expansion-panel-text class="pa-2" v-html="guideline.description"></v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>

      <v-col cols="12">
        <div class="d-flex justify-space-between mb-4">
          <span class="text-primary text-h6">Reporting Violations</span>
        </div>
        <v-card>
          <v-card-text>
            <p>
              If you observe behavior or activities that you believe violates our compliance policies or ethical
              standards, we encourage you to report it. Here are the ways you can report:
            </p>
            <v-list dense>
              <v-list-item v-for="(channel, index) in reportingChannels" :key="index">
                <template v-slot:prepend>
                  <v-icon>{{ channel.icon }}</v-icon>
                </template>
                <v-list-item-title>{{ channel.method }}</v-list-item-title>
                <v-list-item-subtitle>{{ channel.detail }}</v-list-item-subtitle>
                <v-divider class="mt-4" v-if="index < reportingChannels.length -1"></v-divider>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

const complianceGuidelines = ref([
  {
    id: 1,
    title: 'Data Protection and Privacy',
    description: 'Ensuring the privacy and security of company and customer data is paramount. <a href="#">Learn more</a>.'
  },
  {
    id: 2,
    title: 'Workplace Safety',
    description: 'Maintaining a safe work environment is a responsibility of all employees. <a href="#">See safety guidelines</a>.'
  },
  // Add more guidelines as needed
]);

const reportingChannels = ref([
  { id: 1, method: 'Direct Report', detail: 'Report directly to your supervisor or department head.', icon: 'mdi-account-tie' },
  { id: 2, method: 'Compliance Hotline', detail: 'Call our confidential compliance hotline at 1-800-XXX-XXXX.', icon: 'mdi-phone' },
  // Add more reporting channels as needed
]);
</script>