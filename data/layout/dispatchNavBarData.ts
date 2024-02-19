
import {IconTemplate,IconMailFast,IconTruckLoading, IconLayoutDashboard, IconMapPins, IconRulerMeasure, IconPackage, IconTruck, IconRoute, IconFlagCog, IconSettings, IconMessage2Cog, IconUserOff } from '@tabler/icons-vue';
import type { navMenu } from '~/types/layout/NavMenuTypes';

const dispatchNavbarMenu: navMenu[] = [
    {
        title: 'Dashboard',
        icon: IconLayoutDashboard,
        to: '/dispatch'
    },
    {
        title: 'Load Boards',
        icon: IconTruckLoading,
        to: '/dispatch/load_boards'
    },
    {
        title: 'EDI',
        icon: IconMailFast,
        to: '/dispatch/edi'
    },
];

const dispatchSettingsMenu: navMenu[] = [
    {
        title: 'Templates',
        icon: IconTemplate,
        to: 'templates'
    },
    {
        title: 'Flags',
        icon: IconFlagCog,
        to: 'flags'
    },
    {
        title: 'Zones',
        icon: IconMapPins,
        to: 'zones'
    },
    {
        title: 'Rate Types',
        icon: IconRulerMeasure,
        to: 'rate_types'
    },
    {
        title: 'Loads',
        icon: IconPackage,
        to: 'loads'
    },
    {
        title: 'Trucks',
        icon: IconTruck,
        to: 'trucks'
    },
    {
        title: 'Trailers',
        icon: IconSettings,
        to: 'trailers'
    },
    {
        title: 'Carriers',
        icon: IconSettings,
        to: 'carriers'
    },
    {
        title: 'Commodities',
        icon: IconSettings,
        to: 'commodities'
    },
    {
        title: 'Messaging',
        icon: IconMessage2Cog,
        to: 'messaging'
    },
    {
        title: 'Off Duty Codes',
        icon: IconUserOff,
        to: 'off_duty_codes'
    },
    // {
    //     title: 'Dispatch Defaults',
    //     icon: IconRoute,
    //     to: 'dispatch_defaults'
    // },
];

export { dispatchNavbarMenu, dispatchSettingsMenu }
