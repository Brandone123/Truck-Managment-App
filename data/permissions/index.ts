import { attendancePermissions } from './attendance'
// import { dispatchPermissions } from './dispatch'
// import { maintenancePermissions } from './maintenance'
// import { yardCheckPermissions } from './yardCheck'
// import { safetyAndCompliancePermissions } from './safetyAndCompliance'

export const userPermissions = {
    attendance: {
        title: 'Attendance Module',
        value: false,
        permissions: attendancePermissions
    },
    // dispatch: {
    //     title: 'Dispatch Module',
    //     value: false,
    //     permissions: dispatchPermissions
    // },
    // maintenance: {
    //     title: 'Maintenance Module',
    //     value: false,
    //     permissions: maintenancePermissions
    // },
    // yardCheck: {
    //     title: 'Yard Check Module',
    //     value: false,
    //     permissions: yardCheckPermissions
    // },
    // safetyAndCompliance: {
    //     title: 'Safety And Compliance Module',
    //     value: false,
    //     permissions: safetyAndCompliancePermissions
    // }
}