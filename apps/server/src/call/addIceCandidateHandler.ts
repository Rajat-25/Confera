import { CALL_CONST } from '@repo/lib';
import { AddIceCandidatePropsType } from '../types';

export const addIceCandidateHandler = async ({
  ws,
  payload,
  clientMapping,
}: AddIceCandidatePropsType) => {
  const { CALL_ERROR, ADD_ICE_CANDIDATE } = CALL_CONST;
  const { candidates, receiver } = payload;

  const receiverClient = clientMapping.get(receiver);

  if (receiverClient && receiverClient.readyState === WebSocket.OPEN) {
    receiverClient.send(
      JSON.stringify({
        type: ADD_ICE_CANDIDATE,
        payload: {
          candidates,
        },
      })
    );
    return;
  } else {
    ws.send(
      JSON.stringify({
        type: CALL_ERROR,
        payload: {
          message: 'Internal Server Error!',
        },
      })
    );
    return;
  }
};
