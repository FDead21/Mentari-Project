import PackageCardSkeleton from "@/components/PackageCardSkeleton";

export default function LoadingPackages() {
  return (
    <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">What Our Clients Say</h1>
        <div className="space-y-8 max-w-3xl mx-auto">
        {/* Create an array of 6 items to map over, showing 6 skeleton cards */}
        {Array.from({ length: 6 }).map((_, index) => (
          <PackageCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}