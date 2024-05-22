<template>
  <div class="d-flex justify-center">
      <v-btn  v-for="link in links" :key="link.text" :to="link.to" color="primary" density="comfortable" class="text-none mx-2">
        <v-icon class="mr-2">{{ link.icon }}</v-icon>
        {{ link.text }}
      </v-btn>
  </div>

</template>

<script setup lang="ts">
import { ref } from 'vue';

const links = ref([
  { icon: 'mdi-account-circle', text: 'My Profile', to: '/eio/profile' },
  { icon: 'mdi-office-building', text: 'Department Overview', to: '/eio/department' },
  { icon: 'mdi-book-open-page-variant', text: 'SOPs', to: '/eio/sops' },
  // { icon: 'mdi-school', text: 'Training & Development', to: '/eio/training' },
  // { icon: 'mdi-frequently-asked-questions', text: 'FAQs', to: '/eio/faqs' },
  // { icon: 'mdi-cash-multiple', text: 'Benefits & Compensation', to: '/eio/benefits' },
  // { icon: 'mdi-message-text-outline', text: 'Feedback', to: '/eio/feedback' },
  // { icon: 'mdi-gavel', text: 'Compliance & Ethics', to: '/eio/compliance' }
]);

</script>

<style scoped>
/* Style adjustments if needed */
</style>