'use client';
import React from 'react';
import { FiEdit2 } from 'react-icons/fi';

import { Button } from '@repo/ui/button';
import { setEditingContact } from '@/store';
import { ContactType } from '@/types';
import { useDispatch } from 'react-redux';

const EditButton_CL = ({ item }: { item: ContactType }) => {
  const dispatch = useDispatch();
  return (
    <Button
      onClick={() => dispatch(setEditingContact(item))}
      className='flex items-center  px-3 py-1.5 text-sm font-medium text-secondary  rounded-lg hover:bg-blue-900 hover:text-primary-text transition-all '
    >
      <FiEdit2 size={25} />
    </Button>
  );
};

export default EditButton_CL;
