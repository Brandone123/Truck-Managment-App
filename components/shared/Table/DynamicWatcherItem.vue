<template>
    <v-menu location="bottom" max-height="310px" width="320px" location-strategy="connected"
           :close-on-content-click="true" class="rounded" open-on-hover>
           <template v-slot:activator="{ props }">
            <div v-if="watchers" v-bind="props" class="mr-2" style="cursor: pointer; border-bottom: 1px dotted;">
              {{ watchers ? (watchers.length === 1 ? '1 watcher' : watchers.length + ' watchers') : '' }}
            </div>
           </template>
           <v-row no-gutters>
             <v-col cols="12">
               <v-card class="rounded-lg">
                 <v-card-text>
                   <div class="mb-3">
                     <div v-if="!isWatching">
                       <div class="font-weight-bold text-h6">Not Watching</div>
                       <span>
                         You're not watching this record, so you will not receive any <b class="text-secondary">Watched
                           Notifications</b> .
                       </span>
                       <div class="mt-4 mb-4">
                         <span class="rounded pa-1 watch" style="border: 1px solid silver;cursor: pointer;">
                           <v-icon style="font-size:medium">mdi-bell-outline</v-icon> Watch
                         </span>
                       </div>
                     </div>
                     <v-divider v-if="!isWatching" class="my-2"></v-divider>
                     <span class="text-grey mt-3 mb-4">
                       {{ watchers ? (watchers.length === 1 ? 'WATCHER: 1' : ' WATCHERS: ' +
                         watchers.length) : ''
                       }}
                     </span>
                     <template v-if="watchers">
                        <div v-for="(watcher, index) in watchers" :key="index">
                       <SharedTableDynamicTechnicianItem :technician="(watcher as EmployeeInfo)" />
                    </div>
                </template>
                <span v-else>N/A</span>
                   </div>
                 </v-card-text>
               </v-card>
             </v-col>
           </v-row>
         </v-menu>
 </template>
 
 
 <script setup lang="ts">
 import type { PropType } from 'vue';
 import type { EmployeeInfo } from '~/types/store/employee';
 
 const props = defineProps({
   watchers: {
     type: Array as PropType<EmployeeInfo[]>,
     default: []
   }
 })
 const authStore = useAuthStore()

 const isWatching = computed(() =>{
  return props.watchers.some((watcher) => watcher.user_id == authStore.user?.id )
 })

 
 </script>