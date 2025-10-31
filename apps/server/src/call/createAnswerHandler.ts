import { CALL_CONST } from '@repo/lib';
import { createAnswerPropsType, CreateAnswerSchema } from '@repo/types';

export const createAnswerHandler = async ({
  ws,
  payload,
  clientMapping,
  sendMsgToClient,
}: createAnswerPropsType) => {
  const { CREATE_ANSWER, CALL_ERROR } = CALL_CONST;

  const parsed = CreateAnswerSchema.safeParse(payload);

  if (!parsed.success) {
    sendMsgToClient({
      client: ws,
      type: CALL_ERROR,
      payload: {
        message: 'invalid payload',
      },
    });
    return;
  }
  
  const { sdp, receiver } = parsed.data;
  const receiverClient = clientMapping.get(receiver);

  if (receiverClient ) {
    sendMsgToClient({
      client: receiverClient,
      type: CREATE_ANSWER,
      payload: {
        sdp,
        sender: ws.userContext?.phone,
      },
    });
  } else {
    sendMsgToClient({
      client: ws,
      type: CALL_ERROR,
      payload: {
        message: 'Internal server error',
      },
    });
  }
};
