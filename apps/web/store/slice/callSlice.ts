import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  CallSliceStateType,
  CurrentCallContactType,
  InitiatedCallStatusType,
} from '@repo/types';

const initialState: CallSliceStateType = {
  callInitiatedBy: null,

  incomingCallState: false,
  caller: null,
  currentCallContact: null,

  callState: null,

  localOfferState: null,
  localAnswerState: null,

  remoteOfferState: null,
  remoteAnswerState: null,

  iceCandidateState: null,
};

const callSlice = createSlice({
  name: 'call_slice',
  initialState,
  reducers: {
    setCallInitiatedBy: (state, action: PayloadAction<string>) => {
      state.callInitiatedBy = action.payload;
    },
    setIncomingCallState: (state, action: PayloadAction<boolean>) => {
      state.incomingCallState = action.payload;
    },

    setCaller: (state, action: PayloadAction<string | null>) => {
      state.caller = action.payload;
    },

    setCallState: (state, action: PayloadAction<InitiatedCallStatusType>) => {
      state.callState = action.payload;
    },

    setCurrentCallContact: (
      state,
      action: PayloadAction<CurrentCallContactType>
    ) => {
      state.currentCallContact = action.payload;
    },

    setLocalAnswerState: (
      state,
      action: PayloadAction<RTCSessionDescription>
    ) => {},
    setLocalOfferState: (
      state,
      action: PayloadAction<RTCSessionDescription>
    ) => {},

    setRemoteOfferState: (
      state,
      action: PayloadAction<RTCSessionDescription>
    ) => {
      state.remoteOfferState = action.payload;
    },
    setRemoteAnswerState: (
      state,
      action: PayloadAction<RTCSessionDescription>
    ) => {
      state.remoteAnswerState = action.payload;
    },

    setIceCandidateState: (state, action: PayloadAction<RTCIceCandidate[]>) => {
      state.iceCandidateState = action.payload;
    },

    clearCallSliceState: (state) => {
      state.callInitiatedBy = null;

      state.incomingCallState = false;
      state.caller = null;
      state.currentCallContact = null;

      state.callState = null;

      state.localOfferState = null;
      state.localAnswerState = null;

      state.remoteOfferState = null;
      state.remoteAnswerState = null;

      state.iceCandidateState = null;
    },
  },
});

export const {
  setCallInitiatedBy,
  setCallState,
  setCaller,
  setCurrentCallContact,
  setIncomingCallState,
  setLocalOfferState,
  setLocalAnswerState,
  setRemoteOfferState,
  setRemoteAnswerState,
  setIceCandidateState,
  clearCallSliceState,
} = callSlice.actions;
export default callSlice;
