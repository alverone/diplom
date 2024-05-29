import CreatePublisherForm from '@/components/admin/forms/CreatePublisherForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Додавання автора',
};

export default function Page() {
  return <CreatePublisherForm />;
}
