import { CALL_CONST } from '@repo/lib';
import { createOfferHandler } from './createOfferHandler';
import { createAnswerHandler } from './createAnswerHandler';
import { addIceCandidateHandler } from './addIceCandidateHandler';
import { callActivityHandler } from './callActivityHandler';
import { CallServicePropsType } from '../types';

export const callService = async ({
  ws,
  type,
  payload,
  clientMapping,
  callStatus,
}: CallServicePropsType) => {
  const {
    INITIATE_CALL,
    CALL_ACCEPTED,
    CALL_REJECTED,
    CREATE_OFFER,
    CREATE_ANSWER,
    ADD_ICE_CANDIDATE,
    CALL_ENDED,
    CALL_TIMEOUT,
  } = CALL_CONST;
  if (
    type === INITIATE_CALL ||
    type === CALL_ACCEPTED ||
    type === CALL_REJECTED ||
    type === CALL_ENDED ||
    type === CALL_TIMEOUT
  ) {
    await callActivityHandler({ type, ws, payload, clientMapping, callStatus });
  } else if (type === CREATE_OFFER) {
    await createOfferHandler({ ws, payload, clientMapping });
  } else if (type === CREATE_ANSWER) {
    await createAnswerHandler({ ws, payload, clientMapping });
  } else if (type === ADD_ICE_CANDIDATE) {
    await addIceCandidateHandler({ ws, payload, clientMapping });
  }
};
