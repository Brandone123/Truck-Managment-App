export interface CustomerInteractionInfo {
    id: number | null;
    campaign_id: number | null;
    customer_id?: number | null;
    date?: string | null;
    interaction_type: string | null;
    interaction_details: string | null;
}