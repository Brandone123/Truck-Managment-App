export interface LeavePolicyInfo {
    id?: number;
    name?: string;
    description?: string;
    min_notice_period?: number;
    annual_leave_days?: number | null;
    effective_date?: String | null;
  }


export interface EmployeeLeavePolicyInfo  {
    policy_activated?: Boolean;
    policy_activation_date?: String;
    leave_period_start_date?: String | null;
    leave_period_end_date?: String | null;
    assigned?: number;
    used?: number;
    policy?: LeavePolicyInfo;
}