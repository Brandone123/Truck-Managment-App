export interface InterviewScheduleInfo {
    id: number | null;
    applicant_id: number[] | null;
    job_posting_id: number | null;
    interview_date: string | null;
    interviewers: string | null;
    interview_notes: string | null;
    interview_feedback: string | null;
    interview_status: string | null;
}