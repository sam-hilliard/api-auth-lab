import { z } from 'zod';

export const jwtPayloadSchema = z.object({
  id: z.number(),
  username: z.string(),
});

export const authSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type JwtPayload = z.infer<typeof jwtPayloadSchema>;
export type AuthSchema = z.infer<typeof authSchema>;