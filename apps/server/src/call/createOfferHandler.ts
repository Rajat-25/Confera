import { CALL_CONST } from '@repo/lib';
import { CreateOfferPropsType } from '../types';

export const createOfferHandler = async ({
  ws,
  payload,
  clientMapping,
}: CreateOfferPropsType) => {
  const { CREATE_OFFER, CALL_ERROR } = CALL_CONST;
  const { sdp, receiver } = payload;
  const receiverClient = clientMapping.get(receiver);
  if (receiverClient && receiverClient.readyState === WebSocket.OPEN) {
    receiverClient.send(
      JSON.stringify({
        type: CREATE_OFFER,
        payload: {
          sdp,
        },
      })
    );
    return;
  } else {
    ws.send(
      JSON.stringify({
        type: CALL_ERROR,
        payload: {
          message: 'user is offline or busy',
        },
      })
    );
    return;
  }
};
