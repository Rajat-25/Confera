import { CALL_CONST } from '@repo/lib';
import { CreateOfferPropsType, CreateOfferSchema } from '@repo/types';

export const createOfferHandler = async ({
  ws,
  payload,
  clientMapping,
  sendMsgToClient,
}: CreateOfferPropsType) => {
  const { CREATE_OFFER, CALL_ERROR } = CALL_CONST;

  const parsed = CreateOfferSchema.safeParse(payload);

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
  
  if (receiverClient) {
    sendMsgToClient({
      client: receiverClient,
      type: CREATE_OFFER,
      payload: {
        sdp,
      },
    });
  } else {
    sendMsgToClient({
      client: ws,
      type: CALL_ERROR,
      payload: {
        message: 'user is offline or busy',
      },
    });
  }
};
