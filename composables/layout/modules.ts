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
            name: 'Safety And Compliance',
            img: 'images/modules/safety_and_compliance.jpg',
            link: '/safety_and_compliance',
            // show: modulePermissions?.safetyAndCompliacne?.value || false
            show: true,
        },
        {
            name: 'Attendance',
            img: 'images/modules/attendance.jpg',
            link: '/attendance',
            show: modulePermissions?.attendance?.value as any || false
        },
    ]
    return menu.filter((item) => item.show);
}