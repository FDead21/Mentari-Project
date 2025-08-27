import PackageCardSkeleton from "@/components/PackageCardSkeleton";

export default function LoadingPackages() {
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">About Mentari Project</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create an array of 6 items to map over, showing 6 skeleton cards */}
        {Array.from({ length: 6 }).map((_, index) => (
          <PackageCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}