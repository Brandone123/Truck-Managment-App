<template>
    <v-menu location="bottom" max-height="400px" width="350px" location-strategy="connected"
        :close-on-content-click="true" open-on-hover class="rounded">
        <template v-slot:activator="{ props }">
            <div class="d-flex" style="align-items: center;">
                <div>
                    <div class="rounded position-relative"
                        style="display: flex; justify-content: center; align-items: center; width: 28px; height: 28px; background-color: grey; color: white; text-align: center; position: relative;">
                        <span style="font-size:xx-small;" v-if="program?.program_name">{{
                            program?.program_name.slice(0, 3).toUpperCase() }}</span>
                        <span v-else style="font-size:xx-small;">PRO</span>
                    </div>
                </div>
                <div>
                    <span class="ml-2 text-secondary" @click="viewProgramDetails(program?.id)" v-bind="props"
                        style="cursor: pointer; border-bottom: 1px dotted; justify-content: center; align-items: center;text-align: center;">
                        {{ program?.program_name }}
                    </span>
                </div>
            </div>
        </template>
        <v-row no-gutters>
            <v-col cols="12">
                <v-card class="rounded-lg">
                    <v-card-text>
                        <div class="mb-3">
                            <div class="d-flex" style=" align-items: center;">
                                <div>
                                    <div class="rounded position-relative"
                                        style="display: flex; justify-content: center; align-items: center; width: 28px; height: 28px; background-color: grey; color: white; text-align: center; position: relative;">
                                        <span style="font-size:xx-small;">{{ program?.program_name.slice(0,
                                            3).toUpperCase() }}</span>
                                    </div>
                                </div>
                                <div class="ml-2">
                                    <span class="text-secondary" style="cursor: pointer; border-bottom: 1px dotted;">
                                        {{ program?.program_name }}
                                    </span>
                                </div>
                            </div>
                            <v-row class="mt-2">
                                <v-col cols="12" md="6">Primary Meter</v-col>
                                <v-col cols="12" md="6">{{ program?.primary_meter_utilization }}</v-col>
                            </v-row>
                            <v-divider class="my-2"></v-divider>
                            <v-row>
                                <v-col cols="12" md="6">Description</v-col>
                                <v-col cols="12" md="6">{{ program?.description || '---' }}</v-col>
                            </v-row>
                            <v-divider class="my-2"></v-divider>
                            <v-row>
                                <v-col cols="12" md="6">Vehicles</v-col>
                                <v-col cols="12" md="6">{{ program?.vehicles?.length || 0 }}</v-col>
                            </v-row>
                            <v-divider class="my-2"></v-divider>
                            <v-row>
                                <v-col cols="12" md="6">
                                    Program Schedule
                                    <v-card-subtitle>
                                        <em>(Service tasks)</em>
                                    </v-card-subtitle>
                                </v-col>
                                <v-col cols="12" md="6">{{ totalServiceTasks }}</v-col>
                            </v-row>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ServiceProgram } from '@/types/maintenance/ServiceProgram';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
    program: {
        type: Object as PropType<ServiceProgram>,
        default: () => ({}) as ServiceProgram,
        required: false,
    }
})

const totalServiceTasks = computed(() => {
    return props.program?.program_schedules?.reduce((total, schedule) => {
        return total + (schedule.service_tasks?.length || 0);
    }, 0) || 0;
});

const viewProgramDetails = (programId: any) => {
    router.push(`/maintenance/ServicePrograms/${programId}`)
}
</script>