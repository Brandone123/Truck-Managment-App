import {
    IconLayoutDashboard,
    IconCalendarPlus,     // For "Schedule new"
    IconCalendarEvent,    // For "Schedule"
    IconNotebook,         // Possibly for "Meeting Management"
    IconClipboardList,    // For "Meeting Actions"
    IconChecks,           // For "Resolutions"
    IconHistory,          // For "History & Report"
  } from '@tabler/icons-vue';
  import type { navMenu } from '~/types/layout/NavMenuTypes';
  
  function getMeetingPermissions() {
    const auth = useAuthStore();
    // Example: Could check permissions if needed.
    // return auth.user?.employee?.role?.permissions?.recruiting?.permissions;
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
        title: 'Schedule New',
        icon: IconCalendarPlus,
        to: '/meeting/TestCalendarPage',
        show: true
      },
      {
        title: 'Schedule',
        icon: IconCalendarEvent,
        to: '/meeting/meeting_schedule',
        show: true
      },
      {
        title: 'Meeting Management',
        icon: IconNotebook,
        to: '/meeting/MeetingManagement',
        show: true
      },
      {
        title: 'Meeting Actions',
        icon: IconClipboardList,
        to: '/meeting/MeetingActions',
        show: true
      },
      {
        title: 'Resolutions',
        icon: IconChecks,
        to: '/meeting/meeting_resolutions',
        show: true
      },
      {
        title: 'History & Report',
        icon: IconHistory,
        to: '/meeting/meeting_history',
        show: true
      },
    ];
  
    return menu.filter((item) => item.show);
  }
  
  export function useMeetingSettingsMenu() {
    const settings: navMenu[] = [
      // Add any additional "Settings" items here.
    ];
  
    return settings.filter((item) => item.show);
  }
  