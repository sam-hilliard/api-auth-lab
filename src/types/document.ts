export interface Document {
    id: number;
    org_id: number;
    filename: string;
    content: string;
    created_by: number;
    created_at: Date;
    updated_at: Date;
}