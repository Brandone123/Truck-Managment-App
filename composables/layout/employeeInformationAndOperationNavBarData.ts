import { IconInfoHexagon,IconHierarchy3, IconUser,IconExchange, IconApple,IconStairsUp,IconCoin,IconCertificate, IconLayoutDashboard, IconUserCircle, IconHierarchy, IconStretching, IconKeyframes, IconBook, IconBuilding,} from '@tabler/icons-vue';
import type { navMenu } from '~/types/layout/NavMenuTypes';

function getEmployeeInformationAndOperationPermissions() {
    const auth = useAuthStore();
    return auth.user?.employee?.role?.permissions?.employeeInformationAndOperation?.permissions;
}

export function useEmployeeInformationAndOperationNavbarMenu() {

    const menu: navMenu[] = [
        // {
        //     title: 'Organizational Charts',
        //     icon: IconHierarchy3,
        //     to: '/employee_information_and_operation/organizational_charts',
        //     show: true // getEmployeeInformationAndOperationPermissions()?.organizationalCharts?.value || false,
        // },
        // {
        //     title: 'SOP\'s',
        //     icon: IconExchange,
        //     to: '/employee_information_and_operation/standard_operating_procedures',
        //     show: true // getEmployeeInformationAndOperationPermissions()?.standardOperatingProcedures?.value || false,
        // },
        // {
        //     title: 'Employment History',
        //     icon: IconUser,
        //     to: '/employee_information_and_operation/employment_history',
        //     show: true //getEmployeeInformationAndOperationPermissions()?.employmentHistory?.value || false,
        // },
        // {
        //     title: 'Compensation',
        //     icon: IconCoin,
        //     to: '/employee_information_and_operation/benefits_and_compensation',
        //     show: true // getEmployeeInformationAndOperationPermissions()?.benefitsAndCompensation?.value || false,
        // },
        // {
        //     title: 'Feedback',
        //     icon: IconApple,
        //     to: '/employee_information_and_operation/feedback_and_communication_channels',
        //     show: true // getEmployeeInformationAndOperationPermissions()?.feedbackAndCommunicationChannel?.value || false,
        // },
        // {
        //     title: 'Compliance & Ethics',
        //     icon: IconCertificate,
        //     to: '/employee_information_and_operation/compliance_and_ethics',
        //     show: true // getEmployeeInformationAndOperationPermissions()?.complianceAndEthics?.value || false,
        // },

        {
            title: 'Home',
            icon: IconLayoutDashboard,
            to: '/employee_information_and_operation/dashboard',
            show: true // getEmployeeInformationAndOperationPermissions()?.complianceAndEthics?.value || false,
        },

        {
            title: 'Profile',
            icon: IconUserCircle,
            to: '/employee_information_and_operation/ProfilePage',
            show: true // getEmployeeInformationAndOperationPermissions()?.complianceAndEthics?.value || false,
        },

        {
            title: 'Department Overview',
            icon: IconBuilding,
            to: '/employee_information_and_operation/DepartmentOverviewPage',
            show: true // getEmployeeInformationAndOperationPermissions()?.complianceAndEthics?.value || false,
        },
        {
            title: 'SOP and Duties',
            icon: IconBook,
            to: '/employee_information_and_operation/SOPPage',
            show: true // getEmployeeInformationAndOperationPermissions()?.complianceAndEthics?.value || false,
        },
        {
            title: 'Training & Development',
            icon: IconStretching,
            to: '/employee_information_and_operation/TrainingAndDevelopmentPage',
            show: true // getEmployeeInformationAndOperationPermissions()?.complianceAndEthics?.value || false,
        },
        {
            title: 'FAQ',
            icon: IconCertificate,
            to: '/employee_information_and_operation/DepartmentFAQPage',
            show: true // getEmployeeInformationAndOperationPermissions()?.complianceAndEthics?.value || false,
        },
        {
            title: 'Compliance & Ethics',
            icon: IconKeyframes,
            to: '/employee_information_and_operation/ComplianceAndEthicsPage',
            show: true // getEmployeeInformationAndOperationPermissions()?.complianceAndEthics?.value || false,
        },
    ];

    return menu.filter((item) => item.show);
}

export function useEmployeeInformationAndOperationSettingsMenu() {
    const settings: navMenu[] = [
        {
            title: 'Positions & Duties',
            icon: IconLayoutDashboard,
            to: 'positions_and_duties',
            show: true,//getAttendancePermissions()?.settings?.children?.positionsAndDuties?.value || false,
        },
        {
            title: 'Assign Positions',
            icon: IconLayoutDashboard,
            to: 'assign_positions',
            show: true,//getAttendancePermissions()?.settings?.children?.assignPositions?.value || false,
        },
        {
            title: 'Benefits',
            icon: IconLayoutDashboard,
            to: 'benefits',
            show: true,//getAttendancePermissions()?.settings?.children?.benefits?.value || false,
        },
        {
            title: 'Employee Benefits',
            icon: IconLayoutDashboard,
            to: 'employee_benefits',
            show: true,//getAttendancePermissions()?.settings?.children?.assignPositions?.value || false,
        },
    ];

    return settings.filter((item) => item.show);
}