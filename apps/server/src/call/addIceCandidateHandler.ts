import { CALL_CONST } from '@repo/lib';
import {
  AddIceCandidatePropsType,
  IceCandidateSchema,
} from '@repo/types';

export const addIceCandidateHandler = async ({
  ws,
  payload,
  clientMapping,
  sendMsgToClient,
}: AddIceCandidatePropsType) => {
  const { CALL_ERROR, ADD_ICE_CANDIDATE } = CALL_CONST;

  const parsed = IceCandidateSchema.safeParse(payload);

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

  const { candidates, receiver } = parsed.data;

  const receiverClient = clientMapping.get(receiver);

  if (receiverClient) {
    sendMsgToClient({
      client: receiverClient,
      type: ADD_ICE_CANDIDATE,
      payload: {
        candidates,
      },
    });
  } else {
    sendMsgToClient({
      client: ws,
      type: CALL_ERROR,
      payload: {
        message: 'Internal Server Error!',
      },
    });
  }
};
