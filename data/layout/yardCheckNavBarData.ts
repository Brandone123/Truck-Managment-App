
import { IconApple, IconLayoutDashboard} from '@tabler/icons-vue';
import type { navMenu } from '~/types/layout/NavMenuTypes';

const yardCheckNavbarMenu: navMenu[] = [
    {
        title: 'Dashboard',
        icon: IconLayoutDashboard,
        to: '/yard_check'
    },
    {
        title:'Appointments',
        icon: IconApple,
        to: '/yard_check/appointments'
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
