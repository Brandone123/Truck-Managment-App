import type { EmployeeInfo } from '@/types/store/employee'


export interface EmployeeCompensationInfo {
    id?: number | null | undefined;
    employee_id?: number | null | undefined;
    amount?: string | null | undefined;
    type?: string | null | undefined;
    effective_date?: string | null | undefined;
    end_date?: string | null | undefined;

    //relational model data
    employee?: EmployeeInfo | null;
}


