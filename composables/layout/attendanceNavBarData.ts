import { IconCalendarClock, IconReportAnalytics, IconLayoutDashboard, IconCalendarStats, IconMapPins, IconClipboardText, IconDoorExit, IconCalendar } from '@tabler/icons-vue';
import type { navMenu } from '~/types/layout/NavMenuTypes';

function getMaintenanceManagementPermissions() {
    const auth = useAuthStore();
    return auth.user?.employee?.role?.permissions?.attendance?.permissions;
}

export function useAttendanceNavbarMenu() {

    const menu: navMenu[] = [
        {
            title: 'Overview',
            icon: IconLayoutDashboard,
            to: '/attendance/attendance_dashboard',
            show: true, // getAttendancePermissions()?.adminDashboard?.value || false,
        },
        // {
        //     title: 'Employee Dashboard',
        //     icon: IconLayoutDashboard,
        //     to: '/attendance/employee_dashboard',
        //     show: getAttendancePermissions()?.employeeDashboard?.value || false,
        // },
        {
            title: 'Reports',
            icon: IconReportAnalytics,
            to: '/attendance/reports',
           // show: getAttendancePermissions()?.reports?.value || false,
           show: true
        },
        {
            title: 'TimeOff Management',
            icon: IconCalendarStats,
            to: '/attendance/timeoff_requests',
           // show: getAttendancePermissions()?.adminTimeoffView?.value || false,
           show: true
        }, 

        {

            title: 'Time Card',
            icon: IconMapPins,
            to: '/attendance/attendance_timecard',
            show: true, // getAttendancePermissions()?.employeeTimeoffView?.value || false,
        },

        {

            title: 'Punch Corrections',
            icon: IconMapPins,
            to: '/attendance/punch_corrections',
            show: true, // getAttendancePermissions()?.employeeTimeoffView?.value || false,
        },
    ];

    return menu // menu.filter((item) => item.show);
}

export function useAttendanceSettingsMenu() {
    const settings: navMenu[] = [
        {
            title: 'Leave Policies',
            icon: IconLayoutDashboard,
            to: 'leave_policy',
            show: true, // getAttendancePermissions()?.settings?.children?.leavePolicies?.value || false,
        },
        {
            title: 'Approver List',
            icon: IconLayoutDashboard,
            to: 'leave_approvers',
            show: true, // getAttendancePermissions()?.settings?.children?.approverList?.value || false,
        },
        {
            title: 'Assigned Approvers',
            icon: IconLayoutDashboard,
            to: 'employee_leave_approver',
            show: true, // getAttendancePermissions()?.settings?.children?.assignApprover?.value || false,
        },
        {
            title: 'Assigned Policy',
            icon: IconLayoutDashboard,
            to: 'employee_leave_policy',
            show: true, // getAttendancePermissions()?.settings?.children?.assignPolicy?.value || false,
        },
        {
            title: 'Leave Types',
            icon: IconLayoutDashboard,
            to: 'leave_types',
            show: true, // getAttendancePermissions()?.settings?.children?.leaveTypes?.value || false,
        },
    ];

    return settings // settings.filter((item) => item.show);
}