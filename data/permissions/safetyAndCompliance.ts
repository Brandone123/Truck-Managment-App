import type { SafetyAndCompliancePermissionInfo, PermissionCRUDInfo } from "@/types/store/role"
const crudOperations: PermissionCRUDInfo = {
  create: { name: 'Create', value: false },
  update: { name: 'Update', value: false },
  delete: { name: 'Delete', value: false }
}

export const safetyAndCompliancePermissions: SafetyAndCompliancePermissionInfo = {
  // TODO: Append Page settings
  // adminDashboard: { name: 'Admin Dashboard', value: false },
  settings: {
    name: 'Settings',
    value: false,
    children: {
      // TODO: Append Settings Permissions
      //  leavePolicies: { name: 'Leave Policies', value: false, children: { ...crudOperations } },
    }
  }
}


