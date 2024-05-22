import { IconStretching, IconLayoutDashboard, IconCalendarStats,IconListDetails,IconListCheck,IconChecklist,IconClipboardText, IconChartLine} from '@tabler/icons-vue';
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
            icon: IconStretching,
            to: '/training/training_program',
            show: true
        },
        {
            title: 'Program Details',
            icon: IconListDetails,
            to: '/training/program_details',
            show: true
        },
        {
            title: 'Module Details',
            icon: IconListCheck,
            to: '/training/module_details',
            show: true
        },
        {
            title: 'Quiz & Assesment',
            icon: IconChecklist,
            to: '/training/quiz',
            show: true

        },
        {
            title: 'Assignments',
            icon: IconClipboardText,
            to: '/training/assignments',
            show: true

        },
        {
            title: 'Progress Tracking',
            icon: IconChartLine,
            to: '/training/progress_tracking',
            show: true

        },
        {
            title: 'Feedback',
            icon: IconCalendarStats,
            to: '/training/feedback',
            show: true

        },
        {
            title: 'Administrative',
            icon: IconCalendarStats,
            to: '/training/administrative',
            show: true

        },
        {
            title: 'Quiz Creation',
            icon: IconCalendarStats,
            to: '/training/quiz_creation',
            show: true

        },
        {
            title: 'Material Creation',
            icon: IconCalendarStats,
            to: '/training/material_creation',
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
