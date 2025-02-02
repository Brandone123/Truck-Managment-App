<template>
  <v-menu v-model="dialog" v-if="variant == 'button' || (isHovering || dialog)">
    <template v-slot:activator="{ props: menu }">
      <v-btn :disabled="disabled" v-if="variant == 'button'" v-bind="menu" variant="outlined" color="white"
        style="width: 110px;" class="d-flex custom-button bg-primary">
        <v-icon class="bg-primary">mdi-check-circle-outline</v-icon>
        <span class="text-none">Resolve</span>
        <v-icon>mdi-chevron-down</v-icon>
      </v-btn>
      <v-hover v-else-if="variant == 'hover-button'" v-slot="{ isHovering, props: hover }">
        <v-btn :disabled="disabled" v-bind="mergeProps(menu, hover)" variant="outlined" class="custom-button">
          <v-icon density="compact" class="icon">mdi-dots-horizontal</v-icon>
        </v-btn>
      </v-hover>
    </template>
    <v-list density="compact">
      <v-list-item @click=" emit('addToServiceHistory')">
        <v-list-item-title class="d-flex">
          <span class="flex-grow-1">Add to Service History</span>
          <v-icon>mdi-format-float-right</v-icon>
        </v-list-item-title>
      </v-list-item>
      <v-list-item @click="$emit('addToWorkOrder')">
        <v-list-item-title class="d-flex">
          <span class="flex-grow-1">Add to Work Order</span>
          <v-icon>mdi-format-float-right</v-icon>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts" setup>
import { ref, mergeProps } from 'vue'

const props = defineProps({
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
  'addToServiceHistory',
  'addToWorkOrder',
]);

const dialog = ref<boolean>(false)

</script>

<style scoped>
.custom-button {
  min-width: 0;
}
</style>