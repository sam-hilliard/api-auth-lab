import { z } from 'zod';

export const documentParamsSchema = z.object({
  orgId: z.coerce.number().int().positive(),
  id: z.coerce.number().int().positive().optional(),
});

export const createDocumentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  content: z.string().min(1, 'Content is required'),
});

export const patchDocumentSchema = createDocumentSchema.partial();
