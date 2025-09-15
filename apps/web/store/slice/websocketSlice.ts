import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type WebsocketSliceStateTyep = {
  wsConnectionStatus: boolean;
};

const initialState: WebsocketSliceStateTyep = {
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
