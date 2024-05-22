import type { EmployeeInfo } from '@/types/store/employee'


export interface EmployeeFeedbackInfo {
    id?: number | null | undefined;
    employee_id?: number | null | undefined;
    content?: string | null | undefined;
    resolved?: boolean | null | undefined;

    //relational model data
    employee?: EmployeeInfo | null;
}


