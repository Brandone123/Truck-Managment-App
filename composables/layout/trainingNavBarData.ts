import {
    IconLayoutDashboard,
    IconSchool,
    IconCalendarCheck,
    IconBook,
    IconPuzzle,
    IconUsers,
    IconQuestionMark,
    IconClipboardText,
    IconInfoCircle,
    IconChartLine
  } from '@tabler/icons-vue';
import type { navMenu } from '~/types/layout/NavMenuTypes';

function getTrainingPermissions() {
    const auth = useAuthStore();
    //return auth.user?.employee?.role?.permissions?.recruiting?.permissions;
}


export function useTrainingNavbarMenu() {
    const menu: navMenu[] = [
      {
        title: 'Dashboard',
        icon: IconLayoutDashboard,
        to: '/training',
        show: true
      },
      {
        title: 'Training Programs',
        icon: IconSchool, // Updated Icon
        to: '/training/TrainingProgram',
        show: true
      },
      {
        title: 'Training Plans',
        icon: IconCalendarCheck, // Updated Icon
        to: '/training/TrainingPlan',
        show: true
      },
      {
        title: 'Course Management',
        icon: IconBook, // Updated Icon
        to: '/training/CourseManagement',
        show: true
      },
      {
        title: 'Module Management',
        icon: IconPuzzle, // Updated Icon
        to: '/training/ModuleManagement',
        show: true
      },
      {
        title: 'Users Modules',
        icon: IconUsers, // Updated Icon
        to: '/training/ModuleUserSection',
        show: true
      },
      {
        title: 'Quiz & Assessment',
        icon: IconQuestionMark, // Updated Icon
        to: '/training/QuizManagement',
        show: true
      },
      {
        title: 'Training Assignment',
        icon: IconClipboardText, // Retained or consider IconTask
        to: '/training/TrainingAssignment',
        show: true
      },
      {
        title: 'Program Details',
        icon: IconInfoCircle, // Updated Icon
        to: '/training/program_details',
        show: true
      },
      {
        title: 'Assignments',
        icon: IconClipboardText, // Optional: IconTask
        to: '/training/assignments',
        show: true
      },
      {
        title: 'Progress Tracking',
        icon: IconChartLine, // Retained or consider IconTrendingUp
        to: '/training/progress_tracking',
        show: true
      },
    ];
  
    return menu.filter((item) => item.show);
  }

export function useTrainingSettingsMenu() {
    const settings: navMenu[] = [
    ];

    return settings.filter((item) => item.show);
}
