import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ContactSliceState,
  ContactType,
  Status,
  UserStatusPayloadType,
} from '@repo/types';

const initialState: ContactSliceState = {
  editingContact: null,
  userContacts: null,
  contactStatus: {},
};

const ContactSlice = createSlice({
  name: 'contact_slice',
  initialState,
  reducers: {
    updateContactStatus: (
      state,
      action: PayloadAction<UserStatusPayloadType>
    ) => {
      state.contactStatus[action.payload.statusOf] = action.payload.status;
    },
    setUserContacts: (state, action: PayloadAction<ContactType[]>) => {
      state.userContacts = action.payload;
    },
    setEditingContact: (state, action: PayloadAction<ContactType>) => {
      state.editingContact = action.payload;
    },
    clearEditingContact: (state) => {
      state.editingContact = null;
    },
  },
});

export const {
  setEditingContact,
  updateContactStatus,
  clearEditingContact,
  setUserContacts,
} = ContactSlice.actions;

export default ContactSlice;
