import React from 'react';

type InputField_CF_Props = {
  icon: React.ReactNode;
  type: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputField_CF = ({
  icon,
  type,
  name,
  placeholder,
  value,
  onChange,
}: InputField_CF_Props) => (
  <div className='relative'>
    <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none'>
      {icon}
    </div>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className='w-full pl-10 pr-4 py-3 rounded-xl bg-secondary-bg text-white focus:outline-none focus:ring-2 focus:ring-bg-primary'
    />
  </div>
);

export default InputField_CF;
