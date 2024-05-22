<template>
  <div>
    <div class="d-flex flex-wrap">
      <span class="v-card-title px-0 font-weight-bold text-primary">Certification Details</span>
    </div>
    <v-card>
      <v-card-text>
        <v-timeline>
          <v-timeline-item v-for="(cert,index) in certifications" :key="index" color="teal">
            <template #opposite>
              <span class="font-weight-bold text-primary">{{ formatDate(cert.issueDate)  }}</span>
            </template>
            <v-card outlined tile>
              <v-card-title>
                {{ cert.name }}
                <v-chip density="comfortable" v-if="cert.expiryDate && new Date(cert.expiryDate) < new Date()" color="red" class="ml-3">
                  Expired
                </v-chip>
                <v-chip density="comfortable" v-else-if="cert.expiryDate" color="green" class="ml-3">
                  Valid until {{ formatDate(cert.expiryDate)  }}
                </v-chip>
              </v-card-title>
              <v-card-subtitle>
                {{ cert.description }}
              </v-card-subtitle>
              <!-- Include download or view certificate action if necessary -->
              <v-card-actions>
                <v-btn color="primary" density="comfortable" variant="text" @click="downloadCertificate(cert.id)">
                  <v-icon>mdi-download</v-icon>
                  Download
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-card-text>

    </v-card>
  </div>

</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Certification {
  id: number;
  name: string;
  description: string;
  issueDate: string;
  expiryDate?: string;
}

const certifications = ref<Certification[]>([
  {
    id: 1,
    name: 'Basic Safety Training Certificate',
    description: 'Certifies the completion of basic safety training.',
    issueDate: '2023-01-01',
    expiryDate: '2024-01-01',
  },
  // Add more certifications as needed
]);

const formatDate = (value: string) => {
  // Formatting the date as you see fit
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return new Intl.DateTimeFormat('default', options).format(new Date(value));
};

const downloadCertificate = (certificationId: number) => {
  // Logic to download the certificate
  console.log(`Downloading certificate ${certificationId}`);
};
</script>