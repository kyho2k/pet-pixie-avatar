import { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface GalleryImage {
  id: string;
  url: string;
  style: string;
  likes: number;
  width?: number;
  height?: number;
}

interface MasonryGalleryProps {
  images: GalleryImage[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export const MasonryGallery = ({ 
  images, 
  loading = false, 
  onLoadMore,
  hasMore = false 
}: MasonryGalleryProps) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const breakpointColumns = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  const handleImageLoad = (imageId: string) => {
    setLoadedImages(prev => new Set([...prev, imageId]));
  };

  const downloadImage = async (image: GalleryImage) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pet-avatar-${image.style}-${image.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('이미지가 다운로드되었습니다!');
    } catch (error) {
      toast.error('다운로드에 실패했습니다.');
    }
  };

  const shareImage = async (image: GalleryImage) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `내 펫의 ${image.style} 아바타`,
          text: 'AI로 만든 우리 펫의 멋진 아바타를 확인해보세요!',
          url: window.location.href
        });
      } catch (error) {
        // 사용자가 취소한 경우는 무시
        if ((error as Error).name !== 'AbortError') {
          fallbackShare(image);
        }
      }
    } else {
      fallbackShare(image);
    }
  };

  const fallbackShare = (image: GalleryImage) => {
    const shareText = `내 펫의 ${image.style} 아바타 - AI Pet Avatar Service`;
    const shareUrl = window.location.href;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      toast.success('공유 링크가 클립보드에 복사되었습니다!');
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = `${shareText}\n${shareUrl}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success('공유 링크가 클립보드에 복사되었습니다!');
    }
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <Skeleton className="w-full h-48" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </Card>
      ))}
    </div>
  );

  if (loading && images.length === 0) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-8">
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex -ml-6 w-auto"
        columnClassName="pl-6 bg-clip-padding"
      >
        {images.map((image, index) => (
          <Card 
            key={image.id}
            className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-card animate-bounce-in overflow-hidden mb-6"
            style={{animationDelay: `${index * 0.1}s`}}
          >
            <div className="relative">
              {!loadedImages.has(image.id) && (
                <Skeleton className="absolute inset-0 w-full h-48" />
              )}
              
              <img 
                src={image.url} 
                alt={image.style}
                className={`w-full object-cover group-hover:scale-110 transition-transform duration-300 ${
                  loadedImages.has(image.id) ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ height: image.height ? `${image.height}px` : 'auto', minHeight: '200px' }}
                onLoad={() => handleImageLoad(image.id)}
                loading="lazy"
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                  <Button 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadImage(image);
                    }}
                    className="bg-white/20 backdrop-blur text-white hover:bg-white/30"
                  >
                    📱 저장
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      shareImage(image);
                    }}
                    className="bg-white/20 backdrop-blur text-white hover:bg-white/30"
                  >
                    📤 공유
                  </Button>
                </div>
              </div>

              {/* Heart icon and likes */}
              <div className="absolute top-2 right-2 bg-black/50 backdrop-blur text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                <span>❤️</span>
                <span>{image.likes}</span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-foreground">{image.style}</h3>
              <p className="text-muted-foreground text-sm">AI 생성 아바타</p>
            </div>
          </Card>
        ))}
      </Masonry>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center">
          <Button 
            onClick={onLoadMore}
            disabled={loading}
            className="bg-gradient-primary hover:scale-105 transition-transform"
          >
            {loading ? '로딩 중...' : '더 많은 결과 보기'}
          </Button>
        </div>
      )}

      {loading && images.length > 0 && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-muted-foreground">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
            <span>새로운 아바타 로딩 중...</span>
          </div>
        </div>
      )}
    </div>
  );
};