<template>
      <div class="d-flex" style="align-items: center;">
        <div>
          <div class="rounded position-relative"
            style="display: flex; justify-content: center; align-items: center; width: 28px; height: 28px; background-color: grey; color: white; text-align: center; position: relative;">
            <span style="font-size:xx-small;" v-if="programName">{{
              programName.slice(0, 3).toUpperCase() }}</span>
            <span v-else style="font-size:xx-small;">PRO</span>
          </div>
        </div>
        <div>
          <span class="ml-1" v-bind="props" style="justify-content: center; align-items: center;text-align: center;">
            <span class="text-secondary fonr-weight-bold" v-bind="props" style="justify-content: center; align-items: center;text-align: center;">
              {{ programName }}
            </span>
          </span>
        </div>
      </div>
    </template>
 
 
 <script setup lang="ts"> 
 const props = defineProps({
   programName: {
     type: String,
     default: []
   }
 })
 
 </script>