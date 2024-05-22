
import { IconKey,IconTruckDelivery,IconShieldCheckeredFilled,IconCarGarage,IconRotateRectangle,IconSettings,IconTruck, IconBuilding, IconUser, IconUserCog} from '@tabler/icons-vue';
import type { navMenu } from '~/types/layout/NavMenuTypes';
import { dispatchSettingsMenu } from '~/data/layout/dispatchNavBarData';
import { maintenanceSettingsMenu } from '~/data/layout/maintenanceNavBarData';
import { yardCheckSettingsMenu } from '~/data/layout/yardCheckNavBarData';
import { safetyAndComplianceSettingsMenu } from '~/data/layout/safetyAndComplianceNavBarData';

const globalSettingsNavbarMenu: navMenu[] = [
    {
        title: 'Dispatch',
        icon: IconTruckDelivery,
        children: dispatchSettingsMenu.map(item => { return {...item,to:`/setup/dispatch/${item.to}`}})
    },
    {
        title: 'Maintenance',
        icon: IconRotateRectangle,
        children: maintenanceSettingsMenu.map(item => { return {...item,to:`/setup/maintenance/${item.to}`}})
    },
    {
        title: 'Yard Check',
        icon: IconCarGarage,
        children: yardCheckSettingsMenu.map(item => { return {...item,to:`/setup/yard_check/${item.to}`}})
    },
    {
        title: 'Safety & Compliance',
        icon: IconShieldCheckeredFilled,
        children: safetyAndComplianceSettingsMenu.map(item => { return {...item,to:`/setup/safety_and_compliance/${item.to}`}})
    },
    // {
    //     title: 'Trucks',
    //     icon: IconTruck,
    //     to: '/setup/trucks'
    // },

    {
        title: 'Departments',
        icon: IconBuilding,
        to: '/setup/departments'
    },
    {
        title: 'Account Management',
        icon: IconCarGarage,
        children: [
            {
                title: 'Employe Profiles',
                icon: IconUser,
                to: '/setup/employees'
            },
            {
                title: 'Driver Profiles',
                icon: IconTruck,
                to: '/setup/drivers'
            },
            {
                title: 'Carriers',
                icon: IconSettings,
                to: '/setup/dispatch/carriers'
            },
            {
                title: 'Roles',
                icon: IconKey,
                to: '/setup/roles'
            },
            // {
            //     title: 'Login Credentials',
            //     icon: IconUserCog,
            //     to: '/setup/roles'
            // }
        ]
    },

];
export { globalSettingsNavbarMenu }
