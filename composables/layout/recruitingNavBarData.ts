import { IconCalendarPlus, IconBriefcase, IconFileText, IconReportAnalytics, IconLayoutDashboard, IconCalendarStats, IconAd2,IconHierarchy3,IconExchange, IconBlockquote, IconAdjustments, IconUserPlus, IconAlarm, IconUsers, IconBriefcaseFilled } from '@tabler/icons-vue';

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
            title: 'Job Management',
            icon: IconBriefcase,
            show: true,
            children: [
                
                {
                    title: 'Job Lists',
                    icon: IconReportAnalytics,
                    to: '/recruiting/jobManagement/JobManagementPage'
                },
                {
                    title: 'Job Postings',
                    icon: IconReportAnalytics,
                    to: '/recruiting/jobManagement/JobPostingManagementPage'
                },
                { 
                    title: 'Job Templates',
                    icon: IconReportAnalytics,
                    to: '/recruiting/jobManagement/JobTemplateManagementPage'
                },
                
                
            ]
        },
        {
            title: 'Application Management',
            icon: IconFileText,
            show: true,
            children: [
                
                {
                    title: 'Applicants',
                    icon: IconReportAnalytics,
                    to: '/recruiting/applicationManagement/Applicant'
                },
                {
                    title: 'Applications',
                    icon: IconReportAnalytics,
                    to: '/recruiting/applicationManagement/Applications'
                },
                { 
                    title: 'Application Forms',
                    icon: IconReportAnalytics,
                    to: '/recruiting/applicationManagement/ApplicationForms'
                },
                
                
            ]
        },
        {
            title: 'Onboarding Management',
            icon: IconUserPlus,
            show: true,
            children: [
                {
                    title: 'Tasks',
                    icon: IconReportAnalytics,
                    to: '/recruiting/onboardingManagement/OnboardingTasksPage'
                },
                
                {
                    title: 'Documents',
                    icon: IconReportAnalytics,
                    to: '/recruiting/onboardingManagement/RecruitingDocumentsPage'
                },
                {
                    title: 'Onboard Materials',
                    icon: IconReportAnalytics,
                    to: '/recruiting/onboardingManagement/OrientationMaterialsPage'
                },
                { 
                    title: 'Quizes',
                    icon: IconReportAnalytics,
                    to: '/recruiting/onboardingManagement/OrientationQuizzesPage'
                },
                { 
                    title: 'Schedules',
                    icon: IconReportAnalytics,
                    to: '/recruiting/onboardingManagement/OrientationSchedulesPage'
                },
                
                
            ]
        },
        {
            title: 'Reports',
            icon: IconReportAnalytics,
            to: '/recruiting/reports_analytics',
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
        {
            title: 'Task Category',
            icon: IconCalendarPlus,
            to: 'task_category'
    },
    {
        title: 'Job Category',
        icon: IconBriefcaseFilled,
        to: 'job_category'
    },
        
]

export { recruitingNavbarMenu, recruitingSettingsMenu }