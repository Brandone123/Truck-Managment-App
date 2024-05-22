import type { AttendancePermissionInfo, PermissionCRUDInfo } from "@/types/store/role"

const crudOperations: PermissionCRUDInfo = {
  create: { name: 'Create', value: false },
  update: { name: 'Update', value: false },
  delete: { name: 'Delete', value: false }
}

export const attendancePermissions: AttendancePermissionInfo = {
  adminDashboard: { name: 'Admin Dashboard', value: false },
  employeeDashboard: { name: 'Employee Dashboard', value: false },
  reports: { name: 'Reports', value: false },
  adminTimeoffView: { name: 'Admin Time-off View', value: false },
  employeeTimeoffView: { name: 'Employee Time-off View', value: false },
  settings: {
    name: 'Settings',
    value: false,
    children: {
      leavePolicies: { name: 'Leave Policies', value: false, children: { ...crudOperations } },
      assignPolicy: { name: 'Assign Policy', value: false, children: { ...crudOperations } },
      approverList: { name: 'Approver List', value: false, children: { ...crudOperations } },
      assignApprover: { name: 'Assign Approver', value: false, children: { ...crudOperations } },
      leaveTypes: { name: 'Leave Types', value: false, children: { ...crudOperations } },
    }
  }
}


