import { IconReportAnalytics, IconLayoutDashboard, IconCalendarStats, IconScript, IconUsersGroup, IconCalendarClock, IconBellRinging, IconCurrencyDollar, IconChartLine, IconSwimming, IconReport, IconCreativeCommonsBy } from '@tabler/icons-vue';
import type { navMenu } from '~/types/layout/NavMenuTypes';

function getHrPermissions() {
    const auth = useAuthStore();
    //return auth.user?.employee?.role?.permissions?.recruiting?.permissions;
}

export function useHrNavbarMenu() {

    const menu: navMenu[] = [
        {
            title: 'Dashboard',
            icon: IconLayoutDashboard,
            to: '/hr',
            show: true
        },
        {
            title: 'Document Management',
            icon: IconScript,
            to: '/hr/document_management',
            show: true
        },
        {
            title: 'Employee Management',
            icon: IconUsersGroup,
            to: '/hr/employee_management',
            show: true
        },
        {
            title: 'Employee Relation',
            icon: IconCreativeCommonsBy,
            to: '/hr/employee_relation',
            show: true
        },
        {
            title: 'Incident Reporting',
            icon: IconReport,
            to: '/hr/incident_reporting',
            show: true

        },
        {
            title: 'Leave Management',
            icon: IconCalendarClock,
            to: '/hr/leave_management',
            show: true

        },
        {
            title: 'Notification Center',
            icon: IconBellRinging,
            to: '/hr/notification_center',
            show: true

        },
        {
            title: 'Payroll',
            icon: IconCurrencyDollar,
            to: '/hr/payroll',
            show: true

        },
        {
            title: 'Peformance Evaluation',
            icon: IconChartLine,
            to: '/hr/performance_evaluation',
            show: true

        },
        {
            title: 'Training',
            icon: IconSwimming,
            to: '/hr/training',
            show: true

        },
    ];

    return menu.filter((item) => item.show);
}

export function useHrSettingsMenu() {
    const settings: navMenu[] = [
    ];

    return settings.filter((item) => item.show);
}
