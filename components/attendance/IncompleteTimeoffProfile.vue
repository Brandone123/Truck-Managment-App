<script setup lang="ts">
import { Title } from 'chart.js';
import { storeToRefs } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Ref } from 'vue'
import type { EmployeeInfo } from '~/types/store/employee';

const emit = defineEmits(['update:show',])

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    messageList:{
        type: Array,
        default: [],
        required: true
    }
});

const dialog = computed({
    get() {
        return props.show
    },
    set(newValue) {
        emit('update:show', newValue);
    }
})

</script>

<template>
    <v-dialog v-model="dialog" width="600px" scrollable>
        <v-card class="grey-background">
            <v-toolbar color="error" title="Incomplete Employee Profile" density="compact">
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false">
                    <v-icon>mdi-window-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text> 
                <ul>
                    <li v-for="(message,i) in messageList" :key="i">{{ message }}</li>
                </ul>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" variant="text" @click="dialog = false">
                    close
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
