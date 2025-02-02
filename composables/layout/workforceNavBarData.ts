import { IconCalendarClock, IconReportAnalytics, IconLayoutDashboard, IconCalendarStats, IconMapPins, IconClipboardText, IconDoorExit, IconCalendar } from '@tabler/icons-vue';
import type { navMenu } from '~/types/layout/NavMenuTypes';

function getWorkforcePermissions() {
    const auth = useAuthStore();
    return auth.user?.employee?.role?.permissions?.workforce?.permissions;
}

export function useWorkforceNavbarMenu() {

    const menu: navMenu[] = [
        {
            title: 'Overview',
            icon: IconLayoutDashboard,
            to: '/workforce',
            show: true, // getAttendancePermissions()?.adminDashboard?.value || false,
        },    
        {
            title: 'Attendance Management',
            icon: IconCalendarClock,
            show: true,
            children: [

                {
                    title: 'Attendance Records',
                    icon: IconReportAnalytics,
                    to: '/workforce/AttendanceRecords'
                },
                {
                    title: 'Time Corrections',
                    icon: IconReportAnalytics,
                    to: '/workforce/TimeCorrectionRequests'
                },
                // {
                //     title: 'Policies',
                //     icon: IconReportAnalytics,
                //     to: '/workforce/Policies'
                // },

                // {
                //     title: 'Groups',
                //     icon: IconReportAnalytics,
                //     to: '/workforce/Groups'
                // },
                // {
                //     title: 'Geofence',
                //     icon: IconReportAnalytics,
                //     to: '/workforce/GeofenceZones'
                // },
            ]
        },

        {
            title: 'Leave Management',
            icon: IconDoorExit,
            show: true,
            children: [

                {
                    title: 'Leave Records',
                    icon: IconReportAnalytics,
                    to: '/workforce/LeaveManagementPage'
                },
                {
                    title: 'Leave Balance',
                    icon: IconReportAnalytics,
                    to: '/workforce/LeaveBalancespage'
                },
                {
                    title: 'Leave Types',
                    icon: IconReportAnalytics,
                    to: '/workforce/LeaveTypesPage'
                },

                {
                    title: 'Leave Accruals',
                    icon: IconReportAnalytics,
                    to: '/workforce/LeaveAccrualsPage'
                },
                // {
                //     title: 'Pollicy Assignment',
                //     icon: IconReportAnalytics,
                //     to: '/workforce/GeofenceZones'
                // },
            ]
        },
        {
            title: 'Schedule Management',
            icon: IconCalendar,
            show: true,
            children: [

                {
                    title: 'Schedule',
                    icon: IconReportAnalytics,
                    to: '/workforce/SchedulesPage'
                },
                {
                    title: 'Shifts',
                    icon: IconReportAnalytics,
                    to: '/workforce/ShiftsPage'
                },
            ]
        },
    ];

    return menu // menu.filter((item) => item.show);
}

export function useWorkforceSettingsMenu() {
    const settings: navMenu[] = [
        
    ];

    return settings // settings.filter((item) => item.show);
}