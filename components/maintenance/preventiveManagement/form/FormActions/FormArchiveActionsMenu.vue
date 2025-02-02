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
      <v-list-item @click="$emit('viewHistory')">
        <v-list-item-title class="d-flex">
          <span class="flex-grow-1">View History</span>
          <v-icon>mdi-history</v-icon>
        </v-list-item-title>
      </v-list-item>
      <v-list-item @click="$emit('restore')">
        <v-list-item-title class="d-flex">
          <span class="flex-grow-1">Restore</span>
          <v-icon>mdi-restore</v-icon>
        </v-list-item-title>
      </v-list-item>
      <v-list-item @click="$emit('delete')">
        <v-list-item-title class="d-flex">
          <span class="flex-grow-1">Delete</span>
          <v-icon>mdi-bin</v-icon>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts" setup>
import { ref, mergeProps } from 'vue'

const props = defineProps({
  isHovering: {
    type: Boolean,
    required: false,
    default: false
  },
  disabled: {
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
  'viewHistory',
  'restore',
  'delete'
]);

const dialog = ref<boolean>(false)

</script>

<style scoped>
.custom-button {
  min-width: 0;
}
</style>