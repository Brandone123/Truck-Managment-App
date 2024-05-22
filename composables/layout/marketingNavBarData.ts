import { IconReportAnalytics, IconLayoutDashboard, IconCalendarStats } from '@tabler/icons-vue';
import type { navMenu } from '~/types/layout/NavMenuTypes';

function getMarkettingPermissions() {
    const auth = useAuthStore();
    //return auth.user?.employee?.role?.permissions?.recruiting?.permissions;
}

export function useMarketingNavbarMenu() {

    const menu: navMenu[] = [
        {
            title: 'Dashboard',
            icon: IconLayoutDashboard,
            to: '/marketing',
            show: true
        },
        {
            title: 'Advertising',
            icon: IconLayoutDashboard,
            to: '/marketing/advertising',
            show: true
        },
        {
            title: 'Campaign',
            icon: IconReportAnalytics,
            to: '/marketing/campaign',
            show: true
        },
        {
            title: 'Competitive Analysis',
            icon: IconCalendarStats,
            to: '/marketing/competitive_analysis',
            show: true
        },
        {
            title: 'Customer Interactions',
            icon: IconCalendarStats,
            to: '/marketing/customer_interactions',
            show: true

        },
        {
            title: 'Customer Satisfaction',
            icon: IconCalendarStats,
            to: '/marketing/customer_satisfaction',
            show: true

        },
        {
            title: 'Industry Networking',
            icon: IconCalendarStats,
            to: '/marketing/industry_networking',
            show: true

        },
        {
            title: 'Lead Generation',
            icon: IconCalendarStats,
            to: '/marketing/lead_generation',
            show: true

        },
        {
            title: 'Marketing Materials',
            icon: IconCalendarStats,
            to: '/marketing/marketing_materials',
            show: true

        },
        {
            title: 'Peformance Matrices',
            icon: IconCalendarStats,
            to: '/marketing/performance_metrics',
            show: true

        },
    ];

    return menu.filter((item) => item.show);
}

export function useMarketingSettingsMenu() {
    const settings: navMenu[] = [
    ];

    return settings.filter((item) => item.show);
}
