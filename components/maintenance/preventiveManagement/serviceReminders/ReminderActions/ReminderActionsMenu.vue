<template>
    <v-menu v-model="dialog" v-if="variant == 'button' || (isHovering || dialog)">
        <template v-slot:activator="{ props: menu }">
            <v-btn :disabled="disabled" v-if="variant == 'button'" v-bind="menu" class="custom-button"
                style="border: 1px solid silver; box-shadow: none; cursor: pointer;">
                <v-icon>mdi-dots-horizontal</v-icon>
            </v-btn>
            <v-hover v-else-if="variant == 'hover-button'" v-slot="{ isHovering, props: hover }">
                <v-btn :disabled="disabled" v-bind="mergeProps(menu, hover)" variant="outlined" class="custom-button"
                    style="box-shadow: none;">
                    <v-icon density="compact" class="icon">mdi-dots-horizontal</v-icon>
                </v-btn>
            </v-hover>
        </template>

        <v-list width="250px" density="compact">
            <v-list-item @click="$emit('snoozeReminder')">
                <v-list-item-title class="d-flex">
                    <span v-if="serviceReminder.notifications" class="flex-grow-1">Snooze Service Reminder</span>
                    <span v-else class="flex-grow-1">Remove Snooze</span>
                    <v-icon>mdi-timer-outline</v-icon>
                </v-list-item-title>
            </v-list-item>
            <!-- <v-list-item @click="$emit('sendNotification')">
                <v-list-item-title class="d-flex">
                    <span class="flex-grow-1">Send Notifications</span>
                    <v-icon>mdi-bell-outline</v-icon>
                </v-list-item-title>
            </v-list-item> -->
            <v-list-item @click="$emit('viewRecordHistory')">
                <v-list-item-title class="d-flex">
                    <span class="flex-grow-1">View Record History</span>
                    <v-icon>mdi-pencil</v-icon>
                </v-list-item-title>
            </v-list-item>
            <v-divider class="mx-1"></v-divider>
            <!-- <v-list-item @click="$emit('recalculateCompliance')">
                <v-list-item-title class="d-flex">
                    <span class="flex-grow-1">Recalculate Compliance</span>
                    <v-icon>mdi-plus</v-icon>
                </v-list-item-title>
            </v-list-item>
            <v-divider class="mx-1"></v-divider> -->
            <v-list-item @click="$emit('delete')"  v-if="!serviceReminder.program_id">
                <v-list-item-title class="d-flex">
                    <span class="flex-grow-1">Delete</span>
                    <v-icon>mdi-lock</v-icon>
                </v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
</template>


<script lang="ts" setup>
import { ref, mergeProps } from 'vue'
import type { ServiceReminder } from "~/types/maintenance/serviceReminders";

const props = defineProps({
    serviceReminder: {
        type: Object as PropType<Partial<ServiceReminder>>,
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
    'snoozeReminder',
    'sendNotification',
    'viewRecordHistory',
    'recalculateCompliance',
    'delete'
]);

const dialog = ref<boolean>(false)

</script>

<style scoped>
.custom-button {
    min-width: 0;
}
</style>