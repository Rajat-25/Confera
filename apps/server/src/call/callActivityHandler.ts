import { CALL_CONST } from '@repo/lib';
import { Call_GeneralSchema, CallActivityHandlerPropsType } from '@repo/types';
import { isUserValid } from '../utils/helper';

export const callActivityHandler = async ({
  type,
  ws,
  payload,
  clientMapping,
  callStatus,
  sendMsgToClient,
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
    console.log('\n call state ...', callStatus);

    const parsed = Call_GeneralSchema.safeParse(payload);

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

    const { receiverPhoneNo } = parsed.data;

    const { success: userValidStatus, message } =
      await isUserValid(receiverPhoneNo);

    if (userValidStatus) {
      const receiverClient = clientMapping.get(receiverPhoneNo);
      const receiverCallStatus = callStatus.get(receiverPhoneNo);

      if (!receiverClient) {
        sendMsgToClient({
          client: ws,
          type: USER_OFFLINE,
          payload: { status: 'user_offline' },
        });
      } else if (receiverCallStatus) {
        sendMsgToClient({
          client: ws,
          type: USER_BUSY,
          payload: { status: 'user_busy' },
        });
      } else if (!receiverCallStatus) {
        sendMsgToClient({
          client: receiverClient,
          type: INCOMING_CALL,
          payload: {
            sender: ws.userContext?.phone,
          },
        });
      }
    } else {
      if (message === 'invalid_user') {
        sendMsgToClient({
          client: ws,
          type: CALL_REJECTED,
          payload: { status: 'invalid_user' },
        });
      } else {
        sendMsgToClient({
          client: ws,
          type: CALL_REJECTED,
          payload: { status: 'call_error' },
        });
      }
    }
  } else if (type === CALL_ACCEPTED) {
    const parsed = Call_GeneralSchema.safeParse(payload);

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

    const { receiverPhoneNo } = parsed.data;
    const receiverClient = clientMapping.get(receiverPhoneNo);
    if (receiverClient) {
      callStatus.set(ws.userContext?.phone!, 'inCall');
      callStatus.set(ws.userContext?.phone!, 'inCall');
      sendMsgToClient({
        client: receiverClient,
        type: CALL_ACCEPTED,
        payload: {
          status: 'accepted',
        },
      });
    }
  } else if (type === CALL_REJECTED) {
    const parsed = Call_GeneralSchema.safeParse(payload);

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

    const { receiverPhoneNo } = parsed.data;
    const receiverClient = clientMapping.get(receiverPhoneNo);

    if (receiverClient) {
      sendMsgToClient({
        client: receiverClient,
        type: CALL_REJECTED,
        payload: {
          status: 'rejected',
        },
      });
    }
  } else if (type === CALL_TIMEOUT) {
    const parsed = Call_GeneralSchema.safeParse(payload);

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
    const { receiverPhoneNo } = parsed.data;
    const receiverClient = clientMapping.get(receiverPhoneNo);

    if (receiverClient) {
      sendMsgToClient({
        client: receiverClient,
        type: CALL_REJECTED,
        payload: { status: 'call_error' },
      });
    }
  } else if (type === CALL_ENDED) {
    const parsed = Call_GeneralSchema.safeParse(payload);

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

    const { receiverPhoneNo } = parsed.data;
    const receiverClient = clientMapping.get(receiverPhoneNo);

    callStatus.delete(payload.receiverPhoneNo);
    callStatus.delete(ws.userContext?.phone!);
    if (receiverClient) {
      sendMsgToClient({
        client: receiverClient,
        type: CALL_ENDED,
        payload: { message: 'call_ended' },
      });
    }
  }
};
