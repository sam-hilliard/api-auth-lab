import { z } from 'zod';

export const orgParamsSchema = z.object({
  orgId: z.coerce.number(),
});

export const inviteUserBodySchema = z.object({
  username: z.string().min(1),
});

export const createOrgBodySchema = z.object({
  name: z.string().min(1),
});

export const deleteParamsSchema = orgParamsSchema.extend(inviteUserBodySchema);

export type OrgParams = z.infer<typeof orgParamsSchema>;
export type InviteUserBody = z.infer<typeof inviteUserBodySchema>;
export type CreateOrgBody = z.infer<typeof createOrgBodySchema>;
export type DeleteParams = z.infer<typeof deleteParamsSchema>;
