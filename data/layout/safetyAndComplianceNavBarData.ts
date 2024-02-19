
import { IconLayoutDashboard} from '@tabler/icons-vue';
import type { navMenu } from '~/types/layout/NavMenuTypes';

const safetyAndComplianceNavbarMenu: navMenu[] = [
    {
        title: 'Dashboard',
        icon: IconLayoutDashboard,
        to: '/safety_and_compliance'
    },
];

const safetyAndComplianceSettingsMenu: navMenu[] = [
    {
        title: 'Coming Soon',
        icon: IconLayoutDashboard,
        to: ''
    },
];

export { safetyAndComplianceNavbarMenu, safetyAndComplianceSettingsMenu }
