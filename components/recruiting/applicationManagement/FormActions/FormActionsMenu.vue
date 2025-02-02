<template>
  <v-menu v-model="dialog" v-if="variant == 'button' || (isHovering || dialog)">
    <template v-slot:activator="{ props: menu }">
      <v-btn :disabled="disabled" v-if="variant == 'button'" v-bind="menu" variant="outlined" class="custom-button"
        color="primary">
        <v-icon>mdi-dots-horizontal</v-icon>
      </v-btn>
      <v-hover v-else-if="variant == 'hover-button'" v-slot="{ isHovering, props: hover }">
        <v-btn :disabled="disabled" v-bind="mergeProps(menu, hover)" variant="outlined" class="custom-button">
          <v-icon density="compact" class="icon">mdi-dots-horizontal</v-icon>
        </v-btn>
      </v-hover>
    </template>

    <v-list width="250px" density="compact">
      <v-list-subheader class="pa-4 text-caption" v-if="currentVersion">Edit</v-list-subheader>
      <v-list-item @click="$emit('editElements')" v-if="currentVersion">
        <v-list-item-title class="d-flex">
          <span class="flex-grow-1">Application Items</span>
          <v-icon>mdi-format-list-bulleted</v-icon>
        </v-list-item-title>
      </v-list-item>
      <v-list-item @click="$emit('edit')" v-if="currentVersion">
        <v-list-item-title class="d-flex">
          <span class="flex-grow-1">Title And Job</span>
          <v-icon>mdi-pencil</v-icon>
        </v-list-item-title>
      </v-list-item>
      <v-list-item @click="$emit('startApplication')" v-if="currentVersion">
        <v-list-item-title class="d-flex">
          <span class="flex-grow-1">Start Application</span>
          <v-icon>mdi-plus</v-icon>
        </v-list-item-title>
      </v-list-item>
      <v-divider class="mx-1"></v-divider>
      <v-list-item @click="$emit('print')">
        <v-list-item-title class="d-flex">
          <span class="flex-grow-1">Print</span>
          <v-icon>mdi-printer</v-icon>
        </v-list-item-title>
      </v-list-item>
      <v-list-item @click="$emit('viewVersionDetails')" v-if="!currentVersion">
        <v-list-item-title class="d-flex">
          <span class="flex-grow-1">Go to Current Version</span>
          <v-icon>mdi-arrow-right</v-icon>
        </v-list-item-title>
      </v-list-item>
      <v-list-item @click="$emit('copy')" v-if="currentVersion">
        <v-list-item-title class="d-flex">
          <span class="flex-grow-1">Make A Copy</span>
          <v-icon>mdi-content-copy</v-icon>
        </v-list-item-title>
      </v-list-item>
      <v-list-item @click="$emit('viewHistory')">
        <v-list-item-title class="d-flex">
          <span class="flex-grow-1">View History</span>
          <v-icon>mdi-history</v-icon>
        </v-list-item-title>
      </v-list-item>
      <v-list-item @click="$emit('delete')" v-if="currentVersion">
        <v-list-item-title class="d-flex">
          <span class="flex-grow-1">Delete </span>
          <v-icon>mdi-delete</v-icon>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts" setup>
import { ref, mergeProps } from 'vue'

const props = defineProps({
  currentVersion: {
    type: Boolean,
    required: true,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false
  },
  isHovering: {
    type: Boolean,
    required: false,
    default: false
  },
  variant: {
    type: String,
    required: false,
    default: 'button'
  }
})

const emit = defineEmits([
  'editElements',
  'editWorkflows',
  'edit',
  'startApplication',
  'print',
  'viewVersionDetails',
  'copy',
  'viewHistory',
  'delete'
]);

const dialog = ref<boolean>(false)

</script>

<style scoped>
.custom-button {
  min-width: 0;
}
</style>