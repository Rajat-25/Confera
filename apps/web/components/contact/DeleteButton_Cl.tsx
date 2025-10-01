'use client';
import { DeleteContact } from '@/app/actions/contact';
import { Button } from '@repo/ui/button';
import { FiTrash2 } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const DeleteButton_Cl = ({ id }: { id: string }) => {
  const dispatch = useDispatch();
  const handleDelete = async () => {
    try {
      const res = await DeleteContact({ id });

      if (!res.success) {
        toast.error('Failed to delete contact');
        return;
      }

      toast.success('Contact deleted successfully');
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  return (
    <Button
      onClick={handleDelete}
      className='flex items-center  px-3 py-1.5 text-sm font-medium text-danger  rounded-lg hover:bg-red-700 hover:text-primary-text transition-all'
    >
      <FiTrash2 size={25} />
    </Button>
  );
};

export default DeleteButton_Cl;
