import { auth } from '@/auth';
import { urlPath } from '@repo/lib';
import { redirect } from 'next/navigation';
import { getUserPhoneNo } from '../actions/user';

export default async function ProtectedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug?: string };
}) {
  const pathname = params.slug ? `/protected/${params.slug}` : '/protected';

  const session = await auth();
  const { signin, addContact } = urlPath;

  if (!session || !session.user) {
    redirect(signin);
  }

  const { success, phone } = await getUserPhoneNo();

  if (!success || !phone) {
    redirect(addContact);
  }

  return <>{children}</>;
}
