import { IconReportAnalytics, IconLayoutDashboard, IconCalendarStats } from '@tabler/icons-vue';
import type { navMenu } from '~/types/layout/NavMenuTypes';

function getSafetyPermissions() {
    const auth = useAuthStore();
    //return auth.user?.employee?.role?.permissions?.recruiting?.permissions;
}

export function useSafetyNavbarMenu() {

    const menu: navMenu[] = [
        {
            title: 'Dashboard',
            icon: IconLayoutDashboard,
            to: '/safety_and_compliance',
            show: true
        },
        {
            title: 'Regulatory Compliance',
            icon: IconLayoutDashboard,
            to: '/safety_and_compliance/regulatory_compliance',
            show: true
        },
        {
            title: 'Safety Protocol',
            icon: IconReportAnalytics,
            to: '/safety_and_compliance/safety_protocols',
            show: true
        },
        {
            title: 'Incident Reports',
            icon: IconCalendarStats,
            to: '/safety_and_compliance/incident_reporting',
            show: true
        },
        {
            title: 'Driver Qualifications',
            icon: IconCalendarStats,
            to: '/safety_and_compliance/driver_qualification_training',
            show: true

        },
        {
            title: 'Vehicle Inspections',
            icon: IconCalendarStats,
            to: '/safety_and_compliance/vehicle_inspections',
            show: true

        },
        {
            title: 'Compliance Document',
            icon: IconCalendarStats,
            to: '/safety_and_compliance/compliance_document',
            show: true

        },
        {
            title: 'Safety Meetings',
            icon: IconCalendarStats,
            to: '/safety_and_compliance/safety_meetings',
            show: true

        },
        {
            title: 'Risk Assessment',
            icon: IconCalendarStats,
            to: '/safety_and_compliance/risk_assessment_mitigation',
            show: true

        },
        {
            title: 'Reports',
            icon: IconCalendarStats,
            to: '/safety_and_compliance/reporting_analytics',
            show: true

        },
        
    ];

    return menu.filter((item) => item.show);
}

export function useSafetySettingsMenu() {
    const settings: navMenu[] = [
    ];

    return settings.filter((item) => item.show);
}
