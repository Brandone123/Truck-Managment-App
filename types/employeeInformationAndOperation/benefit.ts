import type { EmployeeInfo } from '@/types/store/employee'

export interface BenefitInfo {
    id?: number | null | undefined;
    name?: string | null | undefined;
    description?: string | null | undefined;
    eligibility_criteria?: string | null | undefined;
}

export interface EmployeeBenefitInfo {
    id?: number | null | undefined;
    employee_id?: number | null | undefined;
    benefit_id?: number | null | undefined;
    start_date?: string | null | undefined;
    end_date?: string | null | undefined;

    //relational model data
    benefit?: BenefitInfo | null;
}

export interface AllEmployeeBenefitInfo extends EmployeeInfo {
    benefits: EmployeeBenefitInfo[];
}

