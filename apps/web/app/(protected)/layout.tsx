import { auth } from '@/auth';
import { urlPath } from '@repo/lib';
import { redirect } from 'next/navigation';
import { getUserPhoneNo } from '../actions/user';
import { ReactNode } from 'react';

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { signin, addContact } = urlPath;
  const session = await auth();

  if (!session || !session.user) {
    redirect(signin);
  }

  const { success, phone } = await getUserPhoneNo();

  if (!success || !phone) {
    redirect(addContact);
  }

  return <>{children}</>;
}
