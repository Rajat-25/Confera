'use client';
import { phoneSchema } from '@/utils';
import { urlPath } from '@repo/lib';
import { Button } from '@repo/ui/button';
import { FormEvent, useActionState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { AddUserPhoneNo } from '../actions/user';

import { signOut } from 'next-auth/react';

export default function AddContactForm() {
  const [formState, formAction] = useActionState(AddUserPhoneNo, null);

  useEffect(() => {
    if (!formState) return;
    const { success, message } = formState;
    if (success) {
      toast.success(message);
      signOut({ callbackUrl: urlPath.signin });
    } else {
      toast.error(message);
    }
  }, [formState]);

  const handleClientValidation = (e: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const phone = formData.get('phone')?.toString() || '';
    const { success } = phoneSchema.safeParse(phone);

    if (!success) {
      e.preventDefault();
      toast.error('Phone number must be exactly 10 digits and numeric');
    }
  };

  return (
    <div className='flex h-full  justify-center items-center  bg-primary-bg'>
      <form
        onSubmit={handleClientValidation}
        action={formAction}
        className='w-full hover:scale-105 transition-all duration-500 ease-in-out max-w-md bg-secondary-bg p-6 rounded-2xl shadow-lg'
      >
        <h2 className='text-2xl font-semibold text-white text-center mb-4'>
          Add Phone No.
        </h2>
        <div className='mb-4'>
          <label className='block text-gray-300 mb-2'>Phone No.</label>
          <input
            type='tel'
            name='phone'
            placeholder='Enter phone no.'
            className='w-full p-3 rounded-xl bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
        <Button
          type='submit'
          className='w-full bg-primary hover:bg-green-700 text-white font-medium py-2 px-4 rounded-xl transition'
        >
          Save
        </Button>
      </form>
      <ToastContainer autoClose={2000} />
    </div>
  );
}
