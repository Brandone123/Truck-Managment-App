<template>
    <v-menu v-model="dialog" location="bottom" max-height="400px" width="400px" location-strategy="connected"
      :close-on-content-click="true" class="rounded" open-on-hover>
      <template v-slot:activator="{ props }">
        <div>
          <span v-bind="props" class="text-secondary ml-1" style="cursor: pointer; border-bottom: 1px dotted;">
            {{ application?.applicant?.first_name || 'N/A' }}
            {{ application?.applicant?.last_name || 'N/A' }}
          </span>
        </div>
      </template>
      <v-card class="rounded-lg text-caption">
        <v-card-text>
          <v-list>
            <v-list-item>
              <span class="text-secondary ml-1">
                {{ application?.applicant?.first_name || 'N/A' }}
                {{ application?.applicant?.last_name || 'N/A' }}
              </span>
            </v-list-item>
            <v-list-item class="mt-3">
              <v-row>
                <v-col cols="4">Email</v-col>
                <v-col cols="8" v-if="application?.applicant?.email">
                    {{ application?.applicant?.email }}
                </v-col>
              </v-row>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-row>
                <v-col cols="4">Job Title</v-col>
                <v-col cols="8" v-if="application?.job?.title">
                  {{ application?.job?.title }}</v-col>
              </v-row>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
                <v-row>
                    <v-col cols="4">Job Status</v-col>
                    <v-col cols="8" v-if="application?.job?.status">
                        {{ application?.job?.status }}
                    </v-col>
                </v-row>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-row>
                <v-col cols="4">Application Status</v-col>
                <v-col cols="8">{{ application?.status }}</v-col>
              </v-row>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-menu>
  </template>
  
  
  <script setup lang="ts">
  import type { PropType } from 'vue';
  import type { Application } from '@/types/recruiting/applicantApplication';

  
  const props = defineProps({
    application: {
      type: Object as PropType<Application>,
      default: {} as Partial<Application>
    }
  })
  
  const dialog = ref(false)
//   const initials = computed(() => {
//     return props.application?.full_name?.split(' ').map((word: any) => word.charAt(0).toUpperCase()).join('') || 'N/A'
//   })
  
//   const avatarColor = computed(() => {
//     if (initials.value == 'N/A') {
//       return 'grey'
//     }
  
//     const hue = initials.value?.split('').reduce((acc, char) => ((acc << 5) - acc) + char.charCodeAt(0), 0) % 360;
//     return `hsl(${hue}, 80%, 70%)`;
//   })
  
  </script>