
import { IconLayoutDashboard } from '@tabler/icons-vue';
import type { navMenu } from '~/types/layout/NavMenuTypes';

const maintenanceNavbarMenu: navMenu[] = [
    {
        title: 'Dashboard',
        icon: IconLayoutDashboard,
        to: '/maintenance'
    },
];

const maintenanceSettingsMenu: navMenu[] = [
    {
        title: 'Coming Soon',
        icon: IconLayoutDashboard,
        to: ''
    },
];

export { maintenanceNavbarMenu, maintenanceSettingsMenu }
