import { CALL_CONST } from '@repo/lib';
import { isUserValid } from '../utils/helper';
import { CallActivityHandlerPropsType } from '../types';

export const callActivityHandler = async ({
  type,
  ws,
  payload,
  clientMapping,
  callStatus,
}: CallActivityHandlerPropsType) => {
  const {
    USER_OFFLINE,
    CALL_REJECTED,
    USER_BUSY,
    CALL_ACCEPTED,
    INITIATE_CALL,
    CALL_ENDED,
    INCOMING_CALL,
    CALL_TIMEOUT,
    CALL_ERROR,
  } = CALL_CONST;
  if (type === INITIATE_CALL) {
    const { receiverPhoneNo } = payload;

    const { success: userValidStatus, message } =
      await isUserValid(receiverPhoneNo);

    if (userValidStatus) {
      const receiverClient = clientMapping.get(receiverPhoneNo);
      const receiverCallStatus = callStatus.get(receiverPhoneNo);

      if (!receiverClient) {
        ws.send(
          JSON.stringify({
            type: USER_OFFLINE,
            payload: { status: 'user_offline' },
          })
        );
      } else if (receiverCallStatus) {
        ws.send(
          JSON.stringify({
            type: USER_BUSY,
            payload: { status: 'user_busy' },
          })
        );
      } else if (!receiverCallStatus) {
        receiverClient.send(
          JSON.stringify({
            type: INCOMING_CALL,
            payload: {
              sender: ws.userContext?.phone,
            },
          })
        );
      }
    } else {
      if (message === 'invalid_user') {
        ws.send(
          JSON.stringify({
            type: CALL_REJECTED,
            payload: { status: 'invalid_user' },
          })
        );
      } else {
        ws.send(
          JSON.stringify({
            type: CALL_REJECTED,
            payload: { status: 'call_error' },
          })
        );
      }
    }
    return;
  } else if (type === CALL_ACCEPTED) {
    const { receiverPhoneNo } = payload;
    const receiverClient = clientMapping.get(receiverPhoneNo);
    if (receiverClient) {
      callStatus.set(ws.userContext?.phone!, 'inCall');
      callStatus.set(ws.userContext?.phone!, 'inCall');
      receiverClient.send(
        JSON.stringify({
          type: CALL_ACCEPTED,
          payload: {
            status: 'accepted',
          },
        })
      );
    }

    return;
  } else if (type === CALL_REJECTED) {
    const { receiverPhoneNo } = payload;
    const receiverClient = clientMapping.get(receiverPhoneNo);

    if (receiverClient) {
      receiverClient.send(
        JSON.stringify({
          type: CALL_REJECTED,
          payload: {
            status: 'rejected',
          },
        })
      );
    }

    return;
  } else if (type === CALL_TIMEOUT) {
    const { receiverPhoneNo } = payload;
    const receiverClient = clientMapping.get(receiverPhoneNo);

    if (receiverClient) {
      ws.send(
        JSON.stringify({
          type: CALL_REJECTED,
          payload: { status: 'call_error' },
        })
      );
    }
    return;
  } else if (type === CALL_ENDED) {
    const { receiverPhoneNo } = payload;
    const receiverClient = clientMapping.get(receiverPhoneNo);
    
    callStatus.delete(payload.receiverPhoneNo);
    callStatus.delete(ws.userContext?.phone!);
    if (receiverClient) {
      receiverClient.send(
        JSON.stringify({
          type: CALL_ENDED,
        })
      );
    }
    return;
  }
};
