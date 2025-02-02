<template>
    <v-menu location="bottom" max-height="400px" width="400px" location-strategy="connected"
        :close-on-content-click="true" class="rounded" open-on-hover>
        <template v-slot:activator="{ props }">
            <div>
                <v-avatar size="x-small" :color="avatarColor">
                    {{ initials }}
                </v-avatar>
                <span v-bind="props" class="text-secondary ml-1" style="cursor: pointer; border-bottom: 1px dotted;">
                    {{ technician?.full_name || 'N/A' }}
                </span>
            </div>
        </template>
        <v-card class="rounded-lg text-caption">
            <v-card-text>
                <v-list>
                    <v-list-item>
                        <v-avatar size="small" :color="avatarColor">
                            {{ initials }}
                        </v-avatar>
                        <span class="text-secondary ml-1">
                            {{ technician?.full_name || 'N/A' }}
                        </span>
                    </v-list-item>
                    <v-list-item class="mt-3">
                        <v-row>
                            <v-col cols="4">Email</v-col>
                            <v-col cols="8" v-if="technician?.email">{{ technician?.email }}</v-col>
                        </v-row>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item>
                        <v-row>
                            <v-col cols="4">Group</v-col>
                            <v-col cols="8" v-if="technician?.group">
                                {{ technician?.group }}</v-col>
                        </v-row>
                    </v-list-item>
                    <v-divider></v-divider>
                    <!-- <v-list-item>
                        <v-row>
                            <v-col cols="4">Classification</v-col>
                            <v-col cols="8">{{ technician?.classification }}</v-col>
                        </v-row>
                    </v-list-item>
                    <v-divider></v-divider> -->
                    <v-list-item>
                        <v-row>
                            <v-col cols="4">Phone</v-col>
                            <v-col cols="8">{{ technician?.mobile_phone }}</v-col>
                        </v-row>
                    </v-list-item>
                </v-list>
            </v-card-text>
        </v-card>
    </v-menu>
</template>


<script setup lang="ts">
import { storeToRefs } from 'pinia'

const props = defineProps({
    userId: {
        type: Number,
        required: true,
    }
})

const employeeStore = useEmployeeStore();
const employees = computed(() => employeeStore.employeeList)

const technician = computed(() => {
    return employees.value.find((technician: any) => technician.user_id == props.userId) || null
})


const initials = computed(() => {
    return technician.value?.full_name?.split(' ').map((word: any) => word.charAt(0).toUpperCase()).join('') || 'N/A'
})

const avatarColor = computed(() => {
    if (initials.value == 'N/A') {
        return 'grey'
    }

    const hue = initials.value?.split('').reduce((acc, char) => ((acc << 5) - acc) + char.charCodeAt(0), 0) % 360;
    return `hsl(${hue}, 80%, 70%)`;
})
</script>