import { attendancePermissions } from './attendance'
import { dispatchPermissions } from './dispatch'
import { maintenancePermissions } from './maintenance'
import { yardCheckPermissions } from './yardCheck'
import { safetyAndCompliancePermissions } from './safetyAndCompliance'
import { employeeInformationAndOperationPermissions } from './employeeInformationAndOperation'

import type { RolePermissions } from '@/types/store/role'

export const userPermissions: RolePermissions = {
    attendance: {
        title: 'Attendance',
        value: false,
        permissions: attendancePermissions
    },
    dispatch: {
        title: 'Dispatch',
        value: false,
        permissions: dispatchPermissions
    },
    maintenance: {
        title: 'Maintenance',
        value: false,
        permissions: maintenancePermissions
    },
    yardCheck: {
        title: 'Yard Check',
        value: false,
        permissions: yardCheckPermissions
    },
    safetyAndCompliance: {
        title: 'Safety & Compliance',
        value: false,
        permissions: safetyAndCompliancePermissions
    },
    employeeInformationAndOperation: {
        title: 'Employee Information And Operation',
        value: false,
        permissions: employeeInformationAndOperationPermissions
    }
}