import type { DepartmentInfo } from '@/types/store/department'


export interface StandardOperatingProcedureInfo {
    id?: number | null | undefined;
    department_id?: number | null | undefined;
    title?: number | null | undefined;
    description?: string | null | undefined;
    guidelines?: string | null | undefined;
    emergency_procedures?: string | null | undefined;
    document_path?: string | null | undefined;

    //relational model data
    department?: DepartmentInfo | null;
}


