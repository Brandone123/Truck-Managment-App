import { IconReportAnalytics, IconLayoutDashboard, IconCalendarStats } from '@tabler/icons-vue';
import type { navMenu } from '~/types/layout/NavMenuTypes';

function getMeetingPermissions() {
    const auth = useAuthStore();
    //return auth.user?.employee?.role?.permissions?.recruiting?.permissions;
}

export function useMeetingNavbarMenu() {

    const menu: navMenu[] = [
        {
            title: 'Dashboard',
            icon: IconLayoutDashboard,
            to: '/meeting',
            show: true
        },
        {
            title: 'Shedule',
            icon: IconCalendarStats,
            to: '/meeting/meeting_schedule',
            show: true

        },
        {
            title: 'Details',
            icon: IconCalendarStats,
            to: '/meeting/meeting_details',
            show: true
        },
        {
            title: 'Updates',
            icon: IconCalendarStats,
            to: '/meeting/meeting_updates',
            show: true

        },
        {
            title: 'Resolutions',
            icon: IconCalendarStats,
            to: '/meeting/meeting_resolutions',
            show: true

        },
        {
            title: 'Actions',
            icon: IconLayoutDashboard,
            to: '/meeting/meeting_actions',
            show: true
        },
        {
            title: 'Blockers',
            icon: IconReportAnalytics,
            to: '/meeting/meeting_blockers',
            show: true
        },
        {
            title: 'History',
            icon: IconCalendarStats,
            to: '/meeting/meeting_history',
            show: true

        }, 
    ];

    return menu.filter((item) => item.show);
}

export function useMeetingSettingsMenu() {
    const settings: navMenu[] = [
    ];

    return settings.filter((item) => item.show);
}
