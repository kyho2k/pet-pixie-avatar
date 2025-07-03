import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export const ImageGenerationSkeleton = () => (
  <Card className="p-6 space-y-4">
    <div className="flex items-center space-x-4">
      <Skeleton className="w-12 h-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <Skeleton className="h-2 w-full rounded-full" />
    <div className="grid grid-cols-3 gap-2">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-full" />
    </div>
  </Card>
);

export const ImageGallerySkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="space-y-2">
        <Skeleton className="aspect-square w-full rounded-lg" />
        <div className="space-y-1">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

export const ProductPreviewSkeleton = () => (
  <Card className="p-6 space-y-4">
    <div className="space-y-2">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
    </div>
    
    <div className="grid grid-cols-3 gap-2">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
    
    <Skeleton className="aspect-square w-full rounded-lg" />
    
    <div className="space-y-2">
      <Skeleton className="h-5 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-6 w-1/4" />
    </div>
    
    <div className="flex space-x-2">
      <Skeleton className="h-10 flex-1" />
      <Skeleton className="h-10 w-16" />
    </div>
  </Card>
);

export const ServiceMetricsSkeleton = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: 4 }).map((_, index) => (
      <Card key={index} className="p-6 text-center space-y-2">
        <Skeleton className="h-8 w-16 mx-auto" />
        <Skeleton className="h-4 w-3/4 mx-auto" />
        <Skeleton className="h-1 w-8 mx-auto rounded-full" />
      </Card>
    ))}
  </div>
);

export const CrowdfundingSkeleton = () => (
  <Card className="p-8 space-y-6">
    <div className="grid md:grid-cols-2 gap-8">
      {/* Progress Section */}
      <div className="space-y-4">
        <div className="flex items-baseline space-x-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-5 w-12" />
        </div>
        <Skeleton className="h-4 w-full rounded-full" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 text-center space-y-2">
            <Skeleton className="h-6 w-12 mx-auto" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </Card>
          <Card className="p-4 text-center space-y-2">
            <Skeleton className="h-6 w-8 mx-auto" />
            <Skeleton className="h-3 w-12 mx-auto" />
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-24" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-3 p-2">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-3 w-12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </Card>
);

export const ProgressBarSkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-4 w-16" />
    </div>
    <Skeleton className="h-3 w-full rounded-full" />
    <Skeleton className="h-4 w-48" />
  </div>
);

export const BeforeAfterSkeleton = () => (
  <Card className="p-6 space-y-4">
    <div className="text-center space-y-2">
      <Skeleton className="h-6 w-32 mx-auto" />
      <Skeleton className="h-4 w-48 mx-auto" />
    </div>
    
    <div className="relative">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Skeleton className="w-8 h-16 rounded-full" />
      </div>
    </div>
    
    <div className="flex justify-between text-sm">
      <Skeleton className="h-4 w-12" />
      <Skeleton className="h-4 w-16" />
    </div>
  </Card>
);