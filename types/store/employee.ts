import type { LeavePolicyInfo } from '../attendance/leave_policy';
import type { DepartmentInfo } from './department'
import type { RoleInfo } from './role'

export interface EmployeeInfo {
    id?: number | null;
    user_id?: number | null;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
    department_id?: number | null;
    department?: DepartmentInfo;
    address1?: string | null;
    address2?: string | null;
    city?: string | null;
    state?: string | null;
    hire_date?: string | null;
    termination_date?: string | null;
    zip?: number | null;
    cell_phone?: string | null;
    other_phone?: string | null;
    approver_id?: number | null;
    leave_policy_id?: number | null;
    role_id?: Object | null;

    //APPENDED DATA
    full_name?: string;

    user?: {
        id?: number | null;
        name?: string | null;
        email?: string | null;
        designation?: string | null;
      };

    //eloquent relationships
    role?: RoleInfo
    leave_policy?: LeavePolicyInfo 
}
