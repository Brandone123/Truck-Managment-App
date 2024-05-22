
import { IconApple, IconLayoutDashboard, IconMap, IconTruck } from '@tabler/icons-vue';
import type { navMenu } from '~/types/layout/NavMenuTypes';

const yardCheckNavbarMenu: navMenu[] = [
    {
        title: 'Dashboard',
        icon: IconLayoutDashboard,
        to: '/yard_check/overview'
    }, 
    {
        title:'Appointments',
        icon: IconApple,
        to: '/yard_check/appointments'
    },
    {
        title:'Yards',
        icon: IconMap,
        to: '/yard_check/yards'
    },
    {
        title:'Vehicles',
        icon: IconTruck,
        to: '/yard_check/vehicles'
    },
];

const yardCheckSettingsMenu: navMenu[] = [
    {
        title: 'Coming Soon',
        icon: IconLayoutDashboard,
        to: ''
    },
];

export { yardCheckNavbarMenu, yardCheckSettingsMenu }
