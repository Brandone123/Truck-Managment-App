<template>
  <v-dialog v-model="dialog" width="600px">
    <template v-slot:activator="{ props }">
      <v-icon dense v-bind="props" color="secondary">mdi-alert-circle-outline</v-icon>
    </template>
    <v-card class="grey-background">
      <v-toolbar color="primary" dark density="compact">
        <v-toolbar-title><v-icon dark class="mr-2">mdi-alert</v-icon>{{ voidStatus ? 'Unvoid' : 'Void' }} Meter Entry</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <p v-if="voidStatus">This Operation will attempt to unvoid the selected meter entry</p>
        <p v-else>This Operation will attempt to void the selected meter entry</p>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" @click="closeDialog">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="confirm">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { defineEmits } from 'vue';

const props = defineProps({
  voidStatus: {
    type: Boolean,
    required: true
  }
})
const dialog = ref(false);

const emit = defineEmits(['confirmVoid', 'confirmUnVoid']);


const confirm = () => {
  closeDialog()
  if (props.voidStatus) emit('confirmUnVoid');
  else emit('confirmVoid');
};

const closeDialog = () => {
  dialog.value = false;
}
</script>

<style scoped></style>