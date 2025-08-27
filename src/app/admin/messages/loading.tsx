import PackageCardSkeleton from "@/components/PackageCardSkeleton";
import BackButton from '@/components/admin/BackButton';

export default function LoadingPackages() {
  return (
    <div className="container mx-auto p-8">
      <BackButton href="/admin" title="Dashboard" />
      <h1 className="text-3xl font-bold mb-8">Contact Form Messages</h1>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
        {/* Create an array of 6 items to map over, showing 6 skeleton cards */}
        {Array.from({ length: 6 }).map((_, index) => (
          <PackageCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}