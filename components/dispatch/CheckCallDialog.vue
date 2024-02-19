<template>
    <v-dialog v-model="dialog"  width="800px">
        <template v-slot:activator="{ props }">
            <v-btn color="success" icon="mdi-send-circle" v-bind="props" variant="text"></v-btn>
        </template>
        <v-card class="grey-background">
            <v-toolbar color="primary" title="Send Check Call Message" density="compact">
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false">
                    <v-icon>mdi-window-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text>
                <v-row>
                    <v-col cols="12" md="6">
                        <v-select flat density="compact" hide-details label="Category" :items="['Arrival','Departure','In Transit']" variant="solo"></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field flat density="compact" hide-details label="Time" type="time" variant="solo"></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pt-0">
                        <v-textarea flat dennsity="compact" :v-model="message" hide-details label="Message" variant="solo"></v-textarea>
                    </v-col>
                </v-row>

            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" variant="text" @click="dialog = false">
                    Send
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLoadStore } from '@/stores/load'
import { useLoadTypeStore } from '@/stores/settings/dispatch/load_type'
import { ref, computed, defineProps, defineEmits, toRefs, watch } from 'vue'
// import { LoadInfo } from '@/types/store/load'

const dialog = ref(false)

const message = ref(null)
</script>
