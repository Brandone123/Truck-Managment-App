export interface CustomerSatisfactionInfo {
    id: number | null;
    customer_id?: number | null;
    date?: string | null;
    feedback_type: string | null;
    feedback_details: string | null;
}