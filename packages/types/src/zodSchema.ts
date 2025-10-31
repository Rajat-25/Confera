import { z } from 'zod';

export const authHandlerSchema = z.object({
  jwtToken: z.string().min(10, 'JWT token is required'),
});

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\d{10}$/, 'Phone must be exactly 10 digits');

export const fullNameSchema = z
  .string()
  .trim()
  .min(2, 'Name must be at least 2 characters');

export const emailSchema = z.email('Invalid email address');

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

export const SendMsgSchema = z.object({
  conversationId: z.string().nullable(),
  receiverPhone: phoneSchema,
  text: z.string().min(1, 'text is required'),
});

export const PhoneSchema = z.object({
  phone: phoneSchema,
});

export const Call_GeneralSchema = z.object({
  receiverPhoneNo: phoneSchema,
});

export const chatSchema = z.object({
  contactId: z.string('Invalid contact id'),
});

export const connectSchema = z.object({
  type: z.string(),
  payload: z.object({
    jwtToken: z.string().min(10, 'JWT token is required'),
  }),
});

export const DeleteContactSchema = z.object({
  id: z.string().regex(/^c[^\s-]{8,}$/, 'Invalid id'),
});

export const CreateOfferSchema = z.object({
  sdp: z
    .object({
      type: z.string().min(1),
      sdp: z.string().min(1),
    })
    .nullable(),
  receiver: phoneSchema,
});
export const CreateAnswerSchema = z.object({
  sdp: z
    .object({
      type: z.string().min(1),
      sdp: z.string().min(1),
    })
    .nullable(),
  receiver: phoneSchema,
});

export const IceCandidateSchema = z.object({
  candidates: z.array(z.any()).default([]),
  receiver: phoneSchema,
});

export const UpdateConversationSchema = z.object({
  id: z.string(),
  lastMessage: z.string().nullable(),
  lastMessageAt: z.date().nullable(),
  lastMessageById: z.string().nullable(),
});

export const CreateChatSchema = z.object({
  text: z.string(),
  createdAt: z.date(),
  senderId: z.string(),
  conversationId: z.string(),
});

export const GetUserParamsSchema = z.object({
  userId: z.string().optional(),
  phone: z.string().optional(),
});

export const CreateConversationSchema = z.object({
  lastMessage: z.string(),
  lastMessageAt: z.date(),
  lastMessageById: z.string(),
  userId: z.string(),
  receiverUserId: z.string(),
});

export const UserIdSchema = z.string();

export const IsUserExistSchema = z.object({
  phone: z.string().min(1, 'Phone is required').optional(),
  email: z
    .email({
      pattern:
        /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i,
    })
    .optional(),
});

export type CreateConversationType = z.infer<typeof CreateConversationSchema>;

export type UserIdType = z.infer<typeof UserIdSchema>;

export type GetUserParamsType = z.infer<typeof GetUserParamsSchema>;

export type CreateChatPayloadPropsType = z.infer<typeof CreateChatSchema>;

export type connectSchemaType = z.infer<typeof connectSchema>;

export type PhonePayloadType = z.infer<typeof PhoneSchema>;

export type Call_GeneralPayloadType = z.infer<typeof Call_GeneralSchema>;

export type SendMsgPayloadType = z.infer<typeof SendMsgSchema>;

export type AuthHandlerPayloadType = z.infer<typeof authHandlerSchema>;

export type EditContactSchemaType = z.infer<typeof EditContactSchema>;

export type DeleteContactSchemaType = z.infer<typeof DeleteContactSchema>;

export type CreateOfferPayloadType = z.infer<typeof CreateOfferSchema>;

export type CreateAnswerPayloadType = z.infer<typeof CreateAnswerSchema>;

export type IceCandidatePayloadType = z.infer<typeof IceCandidateSchema>;

export type IsUserExistType = z.infer<typeof IsUserExistSchema>;
