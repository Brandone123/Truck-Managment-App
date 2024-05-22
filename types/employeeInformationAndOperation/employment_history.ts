import type { EmployeeInfo } from '@/types/store/employee'
import type { PositionInfo } from './position'


export interface EmploymentHistoryInfo {
    id?: number | null | undefined;
    employee_id?: number | null | undefined;
    position_id?: number | null | undefined;
    start_date?: string | null | undefined;
    end_date?: string | null | undefined;
    reason_for_leaving?: string | null | undefined;

    //relational model data
    employee?: EmployeeInfo | null;
    position?: PositionInfo | null;
}