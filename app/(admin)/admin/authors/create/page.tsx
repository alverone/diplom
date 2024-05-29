import CreateAuthorForm from '@/components/admin/forms/CreateAuthorForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Додавання автора',
};

export default function Page() {
  return <CreateAuthorForm />;
}
