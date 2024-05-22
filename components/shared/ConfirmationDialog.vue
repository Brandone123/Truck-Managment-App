<script setup lang="ts">
import { storeToRefs } from 'pinia';

const emit = defineEmits(['confirm', 'cancel', 'update:show'])

const layoutStore = useLayoutStore()

const { confirmDialog, confirmDialogMessage } = storeToRefs(layoutStore)

const confirmAction = (confirmValue: Boolean) => {
  layoutStore?.confirmAction(confirmValue)
}

</script>
<template>
  <v-dialog v-model="confirmDialog" width="500px">
    <v-card class="grey-background">
      <v-toolbar color="primary" title="Confirm Current Action" density="compact">
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card-text>
        {{ confirmDialogMessage }}
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" variant="text" @click="confirmAction(false)"> No</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="confirmAction(true)">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>