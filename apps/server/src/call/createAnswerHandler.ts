import { CALL_CONST } from '@repo/lib';
import { createAnswerPropsType } from '../types';

export const createAnswerHandler = async ({
  ws,
  payload,
  clientMapping,
}: createAnswerPropsType) => {
  const { sdp, receiver } = payload;
  const receiverClient = clientMapping.get(receiver);

  const { CREATE_ANSWER, CALL_ERROR } = CALL_CONST;

  if (receiverClient && receiverClient.readyState === WebSocket.OPEN) {
    receiverClient.send(
      JSON.stringify({
        type: CREATE_ANSWER,
        payload: {
          sdp,
          sender: ws.userContext?.phone,
        },
      })
    );
  } else {
    ws.send(
      JSON.stringify({
        type: CALL_ERROR,
        payload: {
          message: 'Internal server error',
        },
      })
    );
  }
};
