export default function PackageCardSkeleton() {
  return (
    <div className="border rounded-lg shadow-lg flex flex-col overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-200"></div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
        <div className="h-8 w-1/2 bg-gray-200 rounded my-2"></div>
        <div className="space-y-2 mt-4 flex-grow">
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
          <div className="h-4 w-full bg-gray-200 rounded"></div>
        </div>
        <div className="mt-6 h-10 w-full bg-gray-200 rounded-md"></div>
      </div>
    </div>
  );
}