function getModulePermissions() {
    const auth = useAuthStore();
    return auth.user?.employee?.role?.permissions
}

export function useModuleMenu() {
    const modulePermissions = getModulePermissions();
    const menu = [
        {
            name: 'Dispatch',
            img: 'images/modules/dispatch.jpg',
            link: '/dispatch',
            // show: modulePermissions?.dispatch?.value || false
            show: true,
        },
        {
            name: 'Maintenance',
            img: 'images/modules/maintenance.jpg',
            link: '/maintenance',
            // show: modulePermissions?.attendance?.value || false
            show: true,
        },
        {
            name: 'Yard Check',
            img: 'images/modules/yard_check.jpg',
            link: '/yard_check',
            // show: modulePermissions?.yardCheck?.value || false
            show: true,
        },
        {
            name: 'Safety & Compliance',
            img: 'images/modules/safety_and_compliance.jpg',
            link: '/safety_and_compliance',
            // show: modulePermissions?.safetyAndCompliance?.value || false
            show: true,
        },
        {
            name: 'Workforce Management',
            img: 'images/modules/attendance.jpg',
            link: '/workforce',
            show: true, // modulePermissions?.maintenanceManagement?.value as any || false
        },
        {
            name: 'Employee Information And Operation',
            img: 'images/modules/employee_information_and_operation.jpg',
            link: '/employee_information_and_operation',
            show: true, //modulePermissions?.employeeInformationAndOperation?.value as any || false
        },
        {
            name: 'Recruiting',
            img: 'images/modules/recruiting.webp',
            link: '/recruiting',
            show: true, //modulePermissions?.employeeInformationAndOperation?.value as any || false
        },
        {
            name: 'Human Resouce',
            img: 'images/modules/hr.jpg',
            link: '/hr',
            show: true, //modulePermissions?.employeeInformationAndOperation?.value as any || false
        },
        {
            name: 'Marketing and Advertisement',
            img: 'images/modules/marketing.jpg',
            link: '/marketing',
            show: true, //modulePermissions?.employeeInformationAndOperation?.value as any || false
        },
        {
            name: 'Training',
            img: 'images/modules/training.jpg',
            link: '/training',
            show: true, //modulePermissions?.employeeInformationAndOperation?.value as any || false
        },
        {
            name: 'Meeting',
            img: 'images/modules/meeting.jpg',
            link: '/meeting',
            show: true, //modulePermissions?.employeeInformationAndOperation?.value as any || false
        },
        {
            name: 'Accounting',
            img: 'images/modules/accounting.jpg',
            link: '/accounting',
            show: true, //modulePermissions?.employeeInformationAndOperation?.value as any || false
        },

    ]
    return menu.filter((item) => item.show);
}