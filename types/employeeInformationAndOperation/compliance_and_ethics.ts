import type { DepartmentInfo } from '@/types/store/department'


export interface ComplianceAndEthicsInfo {
    id?: number | null | undefined;
    department_id?: number | null | undefined;
    title?: number | null | undefined;
    description?: string | null | undefined;
    last_reviewed?: string | null | undefined; 

    //relational model data
    department?: DepartmentInfo | null;
}


