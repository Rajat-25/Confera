import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WebsocketSliceStateType } from '@repo/types';

const initialState: WebsocketSliceStateType = {
  wsConnectionStatus: false,
};

const WebsocketSlice = createSlice({
  name: 'websocket_Slice',
  initialState,
  reducers: {
    setWsConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.wsConnectionStatus = action.payload;
    },
  },
});

export const { setWsConnectionStatus } = WebsocketSlice.actions;
export default WebsocketSlice;
