import type { DepartmentInfo } from '@/types/store/department'

export interface FrequentlyAskedQuestionInfo {
    id?: number | null | undefined;
    department_id?: number | null | undefined;
    question?: string | null | undefined;
    answer?: string | null | undefined;

    //related data
    department?: DepartmentInfo;
}



