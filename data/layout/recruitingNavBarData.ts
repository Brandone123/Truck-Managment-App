
import { IconApple, IconLayoutDashboard} from '@tabler/icons-vue';
import type { navMenu } from '~/types/layout/NavMenuTypes';

const recruitingNavbarMenu: navMenu[] = [
    {
        title: 'Dashboard',
        icon: IconLayoutDashboard,
        to: '/recruiting'
    },

    {
        title:'Appointments',
        icon: IconApple,
        to: '/yard_check/appointments'
    },
];

const recruitingSettingsMenu: navMenu[] = [
    {
        title: 'Coming Soon',
        icon: IconLayoutDashboard,
        to: ''
    },
];

export { recruitingNavbarMenu, recruitingSettingsMenu }
