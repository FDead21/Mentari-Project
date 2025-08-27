import PackageCardSkeleton from "@/components/PackageCardSkeleton";

export default function LoadingPackages() {
  return (
    <div className="container mx-auto px-6 py-8 max-w-lg">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <div>
        {Array.from({ length: 6 }).map((_, index) => (
          <PackageCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}