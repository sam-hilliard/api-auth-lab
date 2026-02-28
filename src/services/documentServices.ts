import { pool } from '../db';
import { Document } from '../types/document';

export const getDocumentsByOrg = async (orgId: number) => {
    const result = await pool.query<Document>('SELECT * FROM documents WHERE org_id = $1', [orgId]);
    return result.rows[0];
}

export const getDocument = async (orgId: number, docId: number) => {   
    const result = await pool.query<Document>('SELECT * FROM documents WHERE org_id = $1 AND id = $2', [orgId, docId]);
    return result.rows[0];
}

export const createDocument = async (orgId: number, title: string, content: string, creatorId: number) => {
    const result = await pool.query<Document>(
        'INSERT INTO documents (org_id, title, content, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
        [orgId, title, content, creatorId]
    );

    return result.rows[0];
}

export const updateDocument = async (orgId: number, docId: number, title: string, content: string) => {
    const result = await pool.query<Document>(
        'UPDATE documents SET title = $1, content = $2 WHERE org_id = $3 AND id = $4 RETURNING *',
        [title, content, orgId, docId]
    );

    return result.rows[0];
}

export const deleteDocument = async (orgId: number, docId: number) => {
    const result = await pool.query('DELETE FROM documents WHERE org_id = $1 AND id = $2', [orgId, docId]);
    return result.rows[0] === 0;
}

export const isDocumentCreator = async (orgId: number, docId: number, userId: number) => {
    const result = await pool.query('SELECT created_by FROM documents WHERE org_id = $1 AND id = $2 AND created_by = $3', [orgId, docId, userId]);
    return result.rows[0] === 1;
}