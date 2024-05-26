import { Metadata } from 'next';
import LoginPageComponent from './LoginPageComponent';

export const metadata: Metadata = {
  title: 'Авторизація',
};

export default function Page({
  searchParams,
}: {
  searchParams: { fromAdmin?: boolean | null };
}) {
  const isFromAdmin = Boolean(searchParams.fromAdmin);

  return <LoginPageComponent fromAdmin={isFromAdmin} />;
}
