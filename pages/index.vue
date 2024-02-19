<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { dispatchNavbarMenu } from '@/data/layout/dispatchNavBarData';
import { maintenanceNavbarMenu } from '@/data/layout/maintenanceNavBarData';
import { yardCheckNavbarMenu } from '@/data/layout/yardCheckNavBarData';
import { safetyAndComplianceNavbarMenu } from '@/data/layout/safetyAndComplianceNavBarData';
import { useAttendanceNavbarMenu } from '@/composables/layout/attendanceNavBarData';
import { globalSettingsNavbarMenu } from '@/data/layout/settingsNavBarData';

import { IconSettings } from '@tabler/icons-vue';

import { useModuleMenu } from '@/composables/layout/modules';

const router = useRouter();
const modules = useModuleMenu()

definePageMeta({
    layout: 'blank-app-bar',
})


const entryPage = (module : any) => {
    switch (module.name.toLowerCase()) {
        case 'dispatch':
            return dispatchNavbarMenu[0].to
        case 'maintenance':
            return maintenanceNavbarMenu[0].to
        case 'safety and compliance':
            return safetyAndComplianceNavbarMenu[0].to
        case 'attendance':
            return useAttendanceNavbarMenu()[0].to
        case 'yard check':
            return yardCheckNavbarMenu[0]?.to 
        default:
            return module.link
    }
}

</script>
<template>
    <v-container class="fill-height d-flex justify-center align-center">
        <v-row no-gutters justify="start" class="align-center">
            <v-col cols="12" class="px-2">
                <div class="d-flex justify-end">
                    <v-btn icon @click="router.push('/setup')" color="transparent" variant="flat" size="small">
                        <v-icon>
                            <IconSettings :size="40" stroke-width="1.5" />
                        </v-icon>
                    </v-btn>
                </div>
                <v-divider class="my-2"></v-divider>
            </v-col>
            <v-col cols="12" md="6" lg="4" xl="2" v-for="(module, i) in modules" :key="i">
                <v-hover v-slot="{ isHovering, props }">
                    <v-card @click="router.push(`${entryPage(module)}`)" :elevation="isHovering ? 12 : 2" class="ma-2"
                        :class="{ 'on-hover': isHovering }" v-bind="props">
                        <v-img :src="module.img" height="200px" cover>
                            <v-card-title class="text-h6 text-white d-flex flex-column">
                                <p class="mt-4">
                                    {{ module.name }}
                                </p>
                            </v-card-title>
                        </v-img>
                    </v-card>
                </v-hover>
            </v-col>
        </v-row>
    </v-container>
</template>