import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ContactSliceState,
  ContactType,
  MappedContactType,
  UserStatusPayloadType,
} from '@repo/types';

const initialState: ContactSliceState = {
  editingContact: null,
  userContacts: null,
  contactStatus: {},
  mappedContacts: {},
};

const ContactSlice = createSlice({
  name: 'contact_slice',
  initialState,
  reducers: {
    setEditingContact: (state, action: PayloadAction<ContactType>) => {
      state.editingContact = action.payload;
    },
    clearEditingContact: (state) => {
      state.editingContact = null;
    },
    updateContactStatus: (
      state,
      action: PayloadAction<UserStatusPayloadType>
    ) => {
      state.contactStatus[action.payload.statusOf] = action.payload.status;
    },
    setMappedContacts: (state, action: PayloadAction<MappedContactType>) => {
      state.mappedContacts = action.payload;
    },

    setUserContacts: (state, action: PayloadAction<ContactType[]>) => {
      state.userContacts = action.payload;
    },

    clearContactSliceState: (state) => {
      state.editingContact = null;
      state.userContacts = null;
      state.contactStatus = {};
      state.mappedContacts = {};
    },
  },
});

export const {
  setEditingContact,
  updateContactStatus,
  clearEditingContact,
  setUserContacts,
  setMappedContacts,
  clearContactSliceState
} = ContactSlice.actions;

export default ContactSlice;
