'use client';

import Link from 'next/link';

type ActionButtonsProps = {
  packageId: string;
  deletePackageAction: (formData: FormData) => void;
};

export default function ActionButtons({ packageId, deletePackageAction }: ActionButtonsProps) {
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this package?')) {
      const formData = new FormData();
      formData.append('packageId', packageId);
      deletePackageAction(formData);
    }
  };

  return (
    <div className="flex items-center justify-end space-x-2">
      <Link href={`/admin/packages/edit/${packageId}`} className="text-indigo-600 hover:text-indigo-900">
        Edit
      </Link>
      <button onClick={handleDelete} className="text-red-600 hover:text-red-900">
        Delete
      </button>
    </div>
  );
}