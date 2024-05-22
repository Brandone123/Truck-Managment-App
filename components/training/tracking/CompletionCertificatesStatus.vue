<template>
  <div>
    <div class="d-flex flex-wrap justify-space-between">
      <span class="v-card-title px-0 font-weight-bold text-primary">Certificates of Completion</span>
    </div>
    
    <v-card>
      <v-card-text>
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-left">Employee/Driver</th>
              <th class="text-left">Training Program</th>
              <th class="text-left">Certificate Status</th>
              <th class="text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(record, index) in certificates" :key="index">
              <td>{{ record.name }}</td>
              <td>{{ record.program }}</td>
              <td>
                <v-chip density="compact" :color="record.status === 'Issued' ? 'green' : 'red'" dark>
                  {{ record.status }}
                </v-chip>
              </td>
              <td>
                <v-btn variant="outlined" small color="primary" density="compact" class="text-none" :disabled="record.status !== 'Issued'"
                  @click="downloadCertificate(record)">
                  <v-icon>mdi-download</v-icon>
                  Download
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Certificate {
  id: number;
  name: string;
  program : string;
  status: string;
}

const certificates = ref<Certificate[]>([
  {
    id: 1,
    name: 'John Doe',
    program: 'Safety Training',
    status: 'Issued',
  },
  {
    id: 2,
    name: 'Jane Smith',
    program: 'Operational Excellence',
    status: 'Pending',
  },
  // Add more certificate records as needed
]);

const downloadCertificate = (record : Certificate) => {
  console.log('Downloading certificate for:', record.name);
  // Implement the logic to download the certificate
  // This might involve calling an API to get the certificate file and then triggering a download on the client side.
};
</script>