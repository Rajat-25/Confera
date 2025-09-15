import { auth } from '@/auth';
import { urlPath } from '@/utils';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import { getUserPhoneNo } from '../actions/user';

export default async function Layout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  const { signin, dashboard } = urlPath;

  if (!session) {
    redirect(signin);
  }

  const { success, phone } = await getUserPhoneNo();

  if (success && phone) {
    redirect(dashboard);
  }

  return <>{children}</>;
}
