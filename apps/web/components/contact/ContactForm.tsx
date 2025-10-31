'use client';

import { clearEditingContact, RootState } from '@/store';
import { contactSchema } from '@repo/types';
import { motion } from 'framer-motion';
import { ChangeEvent, useEffect, useState } from 'react';
import { FaEnvelope, FaPhone, FaUser } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AddContact, EditContact } from '../../app/actions/contact';
import InputField_CF from './InputField_ContactForm';

export default function ContactForm() {
  const dispatch = useDispatch();
  const { editingContact } = useSelector(
    (state: RootState) => state.contact_slice
  );

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });

  const isContactData = () => {
    console.log('inside isContactData func ....');

    if (!editingContact) return;
    setFormData({ ...editingContact, email: editingContact.email ?? '' });
  };

  useEffect(() => {
    console.log('\n isContactData effect running...');

    isContactData();
  }, [editingContact]);

  useEffect(() => {
    return () => {
      dispatch(clearEditingContact());
    };
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log('inside handleChange func ....');

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('inside handleSubmit func ....');

    e.preventDefault();

    const result = contactSchema.safeParse(formData);

    if (!result.success) {
      toast.error(result?.error?.issues[0]?.message);
      return;
    }

    try {
      if (editingContact) {
        await EditContact({ id: editingContact.id, ...result.data });
        setFormData({ fullName: '', email: '', phone: '' });
        dispatch(clearEditingContact());
        toast.success('Contact updated successfully');
      } else {
        await AddContact(result.data);
        setFormData({ fullName: '', email: '', phone: '' });

        toast.success('Contact saved successfully');
      }
    } catch (err) {
      toast.error('Failed to save contact');
      
      console.log('Error in handleSubmit ....', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className='flex items-center justify-center  rounded-2xl shadow-xl py-2'
    >
      <form onSubmit={handleSubmit} className='w-full max-w-md space-y-6'>
        <h3 className='text-2xl font-semibold text-white text-center'>
          {editingContact ? 'Edit' : 'Add'} Contact
        </h3>

        <InputField_CF
          icon={<FaUser className='text-gray-400' />}
          type='text'
          name='fullName'
          placeholder='Full Name'
          value={formData.fullName}
          onChange={handleChange}
        />

        <InputField_CF
          icon={<FaEnvelope className='text-gray-400' />}
          type='email'
          name='email'
          placeholder='Email'
          value={formData.email}
          onChange={handleChange}
        />

        <InputField_CF
          icon={<FaPhone className='text-gray-400 scale-x-[-1]' />}
          type='tel'
          name='phone'
          placeholder='Phone Number'
          value={formData.phone}
          onChange={handleChange}
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type='submit'
          className='w-full bg-primary-btn text-primary-text py-3 rounded-xl font-medium shadow-lg hover:bg-orange-600 transition'
        >
          Save Contact
        </motion.button>
      </form>
    </motion.div>
  );
}
