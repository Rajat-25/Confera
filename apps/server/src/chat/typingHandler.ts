import { CHAT_CONST } from '@repo/lib';
import { PhoneSchema, TypingHandlerPropsType } from '@repo/types';

export const typingHandler = ({
  ws,
  clientMapping,
  payload,
  sendMsgToClient,
}: TypingHandlerPropsType) => {
  const { TYPING, CHAT_ERROR } = CHAT_CONST;
  const parsed = PhoneSchema.safeParse(payload);

  if (!parsed.success) {
    sendMsgToClient({
      client: ws,
      type: CHAT_ERROR,
      payload: { message: 'Invalid Payload' },
    });
    return;
  }

  const { phone } = parsed.data;

  const receiverClient = clientMapping.get(phone);
  if (receiverClient) {
    sendMsgToClient({
      client: receiverClient,
      type: TYPING,
      payload: {
        isTyping: true,
      },
    });
  }
};
