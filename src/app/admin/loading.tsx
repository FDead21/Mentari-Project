import PackageCardSkeleton from "@/components/PackageCardSkeleton";
import BackButton from '@/components/admin/BackButton';

export default function LoadingPackages() {
  return (
    <div className="container mx-auto p-8">
      <BackButton href="/" title="Home" />
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome, ...!</p>
        </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Create an array of 6 items to map over, showing 6 skeleton cards */}
        {Array.from({ length: 6 }).map((_, index) => (
          <PackageCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}