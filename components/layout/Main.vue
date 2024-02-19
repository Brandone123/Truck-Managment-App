<script setup lang="ts">
import { ref, computed } from 'vue';
import { dispatchSettingsMenu, dispatchNavbarMenu } from '@/data/layout/dispatchNavBarData';
import { maintenanceSettingsMenu, maintenanceNavbarMenu } from '@/data/layout/maintenanceNavBarData';
import { yardCheckSettingsMenu, yardCheckNavbarMenu } from '@/data/layout/yardCheckNavBarData';
import { safetyAndComplianceSettingsMenu, safetyAndComplianceNavbarMenu } from '@/data/layout/safetyAndComplianceNavBarData';
// import { attendanceSettingsMenu, attendanceNavbarMenu } from '@/data/layout/attendanceNavBarData';
import { useAttendanceSettingsMenu, useAttendanceNavbarMenu } from '@/composables/layout/attendanceNavBarData';
import { globalSettingsNavbarMenu } from '@/data/layout/settingsNavBarData';
import { IconMenu2, IconChevronLeft, IconChevronRight, IconSettings, IconBellRinging, IconMessage } from '@tabler/icons-vue';
import { useDisplay } from 'vuetify'
const { lgAndUp, mobile } = useDisplay()

const router = useRouter();
const route = useRoute();

var sDrawer = ref(true);
var rail = ref(true);

const currentModule = computed(() => {
    return route.path.split('/')[1]
})

const navMenuItems = computed(() => {
    switch (currentModule.value) {
        case 'dispatch':
            return dispatchNavbarMenu
        case 'maintenance':
            return maintenanceNavbarMenu
        case 'safety_and_compliance':
            return safetyAndComplianceNavbarMenu
        case 'yard_check':
            return yardCheckNavbarMenu
        case 'setup':
            return globalSettingsNavbarMenu
        case 'attendance':
            return useAttendanceNavbarMenu()
        default:
            return []
    }
})

const settingsMenuItems = computed(() => {
    switch (currentModule.value) {
        case 'dispatch':
            return dispatchSettingsMenu
        case 'maintenance':
            return maintenanceSettingsMenu
        case 'safety_and_compliance':
            return safetyAndComplianceSettingsMenu
        case 'yard_check':
            return yardCheckSettingsMenu
        case 'attendance':
            return useAttendanceSettingsMenu()
        default:
            return []
    }
})

const showSettingsMenu = computed(() => {
    return route.path.includes(`/${currentModule.value}/settings`) ? true : false
})

const isMobile = computed(() => {
    return mobile.value
})

onMounted(() => {
    if (isMobile.value) {
        // hide drawer when page loads on mobile devices
        sDrawer.value = false
    }
})

const navCols = computed(() => {
    if (isMobile.value) {
        return 12
    }
    else {
        return rail.value ? 12 : 8
    }
})

const moduleSettingsForMobile = computed(() => {
    return {
        children: settingsMenuItems.value.map((item: any) => {
            return {
                ...item,
                to: `/${currentModule.value}/settings/${item.to}`
            }
        }),
        title: 'Settings',
        icon: IconSettings
    }
})

const navDrawerWidth = computed(()=>{
    if(isMobile.value){
        return ''
    }
    return currentModule.value == 'setup' ? 280 : 200
})

const openSettingsListInitialItem = () => {
    if (settingsMenuItems.value[0]?.to) {
        router.push(`/${currentModule.value}/settings/${settingsMenuItems.value[0].to}`)
    }
}

watch(
    () => route.path,
    (path) => {
        if (path.includes(`/${currentModule.value}/settings`)) {
            rail.value = true
        }
    },
    { deep: true, immediate: true }
)

</script>

<template>
    <!------Sidebar-------->
    <v-navigation-drawer color="primary" :rail="isMobile ? false : rail" :permanent="!isMobile" :temporary="isMobile" left
        elevation="0" class="leftSidebar" v-model="sDrawer" :width="navDrawerWidth">
        <!-- ---------------------------------------------- -->
        <!---Navigation -->
        <!-- ---------------------------------------------- -->
        <v-list density="compact" nav active-class="primary--darken-3" class="nav-list">
            <!---Menu Loop -->
            <template v-for="(item, i) in navMenuItems">
                <!---Item Sub Header -->
                <LayoutVerticalSidebarNavHeading :item="item" v-if="item.header && !rail" />

                <!---Item Group -->
                <LayoutVerticalSidebarNavGroup @click="rail = false" :rail="rail" :item="item" v-else-if="item.children" />

                <!---Single Item-->
                <LayoutVerticalSidebarNavItem @click="showSettingsMenu = false" :rail="rail" :item="item" v-else
                    class="leftPadding" />
                <!---End Single Item-->
            </template>

            <!-- settings display in menu component -->
            <LayoutVerticalSidebarNavGroup v-if="isMobile" :item="moduleSettingsForMobile" />
        </v-list>

        <template v-slot:append>
            <v-row>
                <v-col :cols="navCols"
                    :class="(rail && !isMobile) ? 'd-flex flex-column justify-center align-center' : 'd-flex justify-center'">
                    <v-tooltip :location="(rail || !isMobile) ? 'right' : 'top'" v-if="rail">
                        <template v-slot:activator="{ props }">
                            <v-btn small icon v-bind="props" variant="text" class="custom-hover-primary text-muted">
                                <IconMessage color="white" stroke-width="1.5" :size="22" />
                            </v-btn>
                        </template>
                        <span>Messages</span>
                    </v-tooltip>
                    <v-tooltip :location="(rail || !isMobile) ? 'right' : 'top'" v-if="rail">
                        <template v-slot:activator="{ props }">
                            <v-btn small icon v-bind="props" variant="text" class="custom-hover-primary text-muted">
                                <IconBellRinging color="white" stroke-width="1.5" ::size="22" />
                            </v-btn>
                        </template>
                        <span>Alerts</span>
                    </v-tooltip>
                    <v-tooltip :location="rail ? 'right' : 'top'" v-if="!isMobile">
                        <template v-slot:activator="{ props }">
                            <v-btn v-if="settingsMenuItems.length > 0" small icon v-bind="props" variant="text"
                                class="custom-hover-primary text-muted" @click="openSettingsListInitialItem()">
                                <IconSettings color="white" stroke-width="1.5" ::size="22" />
                            </v-btn>
                        </template>
                        <span>Settings</span>
                    </v-tooltip>

                </v-col>
                <v-col v-if="!isMobile" :cols="rail ? 12 : 4" class="d-flex justify-center">
                    <v-btn dark icon variant="text" class="custom-hover-primary text-muted" @click.stop="rail = !rail">
                        <IconChevronRight color="white" v-if="rail" stroke-width="1.5" :size="22" />
                        <IconChevronLeft color="white" v-else stroke-width="1.5" :size="22" />
                    </v-btn>
                </v-col>
            </v-row>
        </template>
    </v-navigation-drawer>


    <!------Header-------->
    <v-app-bar elevation="0" density="compact">
        <div class="d-flex align-center justify-space-between w-100">
            <div class="d-flex justify-center align-center">
                <v-btn class="ms-md-3 ms-sm-5 ms-3 text-muted" @click="sDrawer = !sDrawer" icon variant="flat" size="small">
                    <IconMenu2 :size="20" stroke-width="1.5" />
                </v-btn>
                <!-- Notification -->

                <!---Logo part -->
                <!-- <div class=""> -->
                <LayoutLogo />
                <!-- </div> -->
            </div>
            <div>
                <LayoutVerticalHeaderNotificationDD />
                <LayoutVerticalHeaderProfileDD />
            </div>
        </div>
    </v-app-bar>

    <!-- Nav Drawer For Settings -->
    <v-navigation-drawer permanent v-if="showSettingsMenu && !isMobile" v-model="sDrawer" width="200" class="nav-list">
        <v-divider></v-divider>
        <v-list density="compact" nav color="primary">
            <!---Menu Loop -->
            <template v-for="(item, i) in settingsMenuItems">
                <!---Item Sub Header -->
                <LayoutVerticalSidebarNavGroup :item="item" v-if="item.header" :key="item.title" />

                <!---Single Item-->
                <v-list-item v-else :to="`/${currentModule}/settings/${item.to}`" rounded class="mb-1"
                    :disabled="item.disabled" :target="item.type === 'external' ? '_blank' : ''">
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
            </template>
        </v-list>
    </v-navigation-drawer>
</template>

<style scoped>
.nav-list :deep() .v-list-item__prepend>.v-list-item__spacer {
    width: 10px !important;
}

.nav-list :deep() .v-list-group__items .v-list-item {
    padding-inline-start: var(--indent-padding) !important;
}
</style>
