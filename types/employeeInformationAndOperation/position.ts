import type { DepartmentInfo } from '@/types/store/department'

// daily duties associated with a position
export interface DailyDutyInfo {
    id?: number | null | undefined;
    position_id?: number | null | undefined;
    description?: string | null | undefined;  
    frequency?: string | null | undefined;
}

// departmental positions
export interface PositionInfo {
    id?: number | null | undefined;
    department_id?: number | null | undefined;
    title?: string | null | undefined;
    description?: string | null | undefined;

    //related data
    department?: DepartmentInfo;
    dailyDuties?:DailyDutyInfo[];
}



