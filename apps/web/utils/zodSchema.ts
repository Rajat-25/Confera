import { z } from 'zod';


export const fullNameSchema = z.string().trim().min(2, 'Name must be at least 2 characters');

export const emailSchema = z.email('Invalid email address');

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\d{10}$/, 'Phone must be exactly 10 digits');

export const contactSchema = z.object({
  fullName: fullNameSchema,
  email: emailSchema,
  phone: phoneSchema,
});

export const EditContactSchema = z.object({
  id: z.string().trim(),
  fullName: fullNameSchema,
  email: emailSchema,
  phone: phoneSchema,
});


export const DeleteContactSchema = z.object({
  id: z.string().regex(/^c[^\s-]{8,}$/, "Invalid id"),
});



export type EditContactSchemaType = z.infer<typeof EditContactSchema>;

export type DeleteContactSchemaType = z.infer<typeof DeleteContactSchema>;


