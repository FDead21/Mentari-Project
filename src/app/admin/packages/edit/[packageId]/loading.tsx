import PackageCardSkeleton from "@/components/PackageCardSkeleton";
import BackButton from '@/components/admin/BackButton';


export default function LoadingPackages() {
    return (
        <div className="container mx-auto px-6 py-8">
            <BackButton href="/admin/packages" title="Manage Package" />
            <h1 className="text-3xl font-bold mb-8">Edit Package: ...</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {/* Create an array of 6 items to map over, showing 6 skeleton cards */}
                {Array.from({ length: 6 }).map((_, index) => (
                    <PackageCardSkeleton key={index} />
                ))}
            </div>
        </div>
    );
}