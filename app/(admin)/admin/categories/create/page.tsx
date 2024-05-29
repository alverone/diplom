import CreateCategoryForm from '@/components/admin/forms/CreateCategoryForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Додавання категорії',
};

export default function Page() {
  return <CreateCategoryForm />;
}
