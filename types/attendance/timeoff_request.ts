export interface TimeoffRequest {
    id?: number
    employee_id?: number
    attendance_leave_type_id?: number
    start_time?: string
    end_time?: string
    start_date?: string
    end_date?: string
    description?: string | null
    status?: string
    comment?: string | null
    paid?: boolean | null
}