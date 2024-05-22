import { IconReportAnalytics, IconLayoutDashboard, IconCalendarStats, IconAd2,IconHierarchy3,IconExchange, IconBlockquote, IconAdjustments, IconTable, IconAlarm, IconUsers } from '@tabler/icons-vue';

import type { navMenu } from '~/types/layout/NavMenuTypes';

function getrecruitingPermissions() {
    const auth = useAuthStore();
    //return auth.user?.employee?.role?.permissions?.recruiting?.permissions;
}

const recruitingNavbarMenu: navMenu[] = [
        {
            title: 'Dashboard',
            icon: IconLayoutDashboard,
            to: '/recruiting',
            //   show: getrecruitingPermissions()?.adminDashboard?.value || false,
            show: true
        },
        {
            title: 'Job Posting',
            icon: IconAd2,
            to: '/recruiting/job_posting',
            //    show: getrecruitingPermissions()?.employeeDashboard?.value || false,
            show: true
        },
        {
            title: 'Job Management',
            icon: IconUsers,
            to: '/recruiting/job_listings_management',
            //       show: getrecruitingPermissions()?.reports?.value || false,
            show: true
        },
        {
            title: 'Applications',
            icon: IconCalendarStats,
            to: '/recruiting/application_management',
            //     show: getrecruitingPermissions()?.adminTimeoffView?.value || false,
            show: true
        },
        {
            title: 'Interview Scheduling',
            icon: IconAlarm,
            to: '/recruiting/interview_scheduling',
            //      show: getrecruitingPermissions()?.employeeTimeoffView?.value || false,
            show: true

        },
        {
            title: 'Job Boards',
            icon: IconTable,
            to: '/recruiting/job_board_integration',
            //      show: getrecruitingPermissions()?.employeeTimeoffView?.value || false,
            show: true

        },
        {
            title: 'Reports',
            icon: IconReportAnalytics,
            to: '/recruiting/reports_analytics',
            //      show: getrecruitingPermissions()?.employeeTimeoffView?.value || false,
            show: true

        },
        {
            title: 'Form Builder',
            icon: IconBlockquote,
            to: '/recruiting/form_builder',
            //      show: getrecruitingPermissions()?.employeeTimeoffView?.value || false,
            show: true

        },
]

const recruitingSettingsMenu: navMenu[] = [
        {
            title: 'Company detail',
            icon: IconHierarchy3,
            to: 'compagny_detail'
        },
        {
            title: 'Email templates',
            icon: IconExchange,
            to: 'email_template'
        },
        {
            title: 'Notification',
            icon: IconAlarm,
            to: 'notification'
        },
        
]

export { recruitingNavbarMenu, recruitingSettingsMenu }