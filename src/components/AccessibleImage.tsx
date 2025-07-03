import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, Share2, Heart, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface AccessibleImageProps {
  src: string;
  alt: string;
  title?: string;
  description?: string;
  onDownload?: () => void;
  onShare?: () => void;
  className?: string;
  showActions?: boolean;
}

export const AccessibleImage = ({
  src,
  alt,
  title,
  description,
  onDownload,
  onShare,
  className = "",
  showActions = true
}: AccessibleImageProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? '좋아요를 취소했습니다' : '좋아요를 눌렀습니다!');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('링크가 클립보드에 복사되었습니다!');
    } catch (error) {
      toast.error('링크 복사에 실패했습니다');
    }
  };

  if (hasError) {
    return (
      <Card className={`bg-muted/20 border-dashed border-muted ${className}`}>
        <div className="aspect-square flex flex-col items-center justify-center p-8 text-center">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
            <Eye className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-medium mb-2">이미지를 불러올 수 없습니다</p>
          <p className="text-sm text-muted-foreground/70">네트워크 연결을 확인해주세요</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`group overflow-hidden hover:shadow-lg transition-all duration-300 ${className}`}>
      <div className="relative">
        {/* Loading skeleton */}
        {isLoading && (
          <div className="aspect-square bg-muted animate-pulse" />
        )}
        
        {/* Main image */}
        <img
          src={src}
          alt={alt}
          title={title}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105 ${
            isLoading ? 'hidden' : 'block'
          }`}
          loading="lazy"
          role="img"
        />

        {/* Action overlay */}
        {showActions && !isLoading && (
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleLike}
                className="backdrop-blur-sm"
                aria-label={isLiked ? '좋아요 취소' : '좋아요'}
              >
                <Heart 
                  className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} 
                />
              </Button>
              
              {onDownload && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={onDownload}
                  className="backdrop-blur-sm"
                  aria-label="이미지 다운로드"
                >
                  <Download className="w-4 h-4" />
                </Button>
              )}
              
              <Button
                size="sm"
                variant="secondary"
                onClick={handleCopyLink}
                className="backdrop-blur-sm"
                aria-label="링크 복사"
              >
                <Copy className="w-4 h-4" />
              </Button>
              
              {onShare && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={onShare}
                  className="backdrop-blur-sm"
                  aria-label="공유하기"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* AI Generated badge */}
        <Badge 
          variant="secondary" 
          className="absolute top-2 left-2 bg-tech-accent/90 text-white backdrop-blur-sm"
        >
          🤖 AI 생성
        </Badge>
      </div>

      {/* Image details */}
      {(title || description) && (
        <div className="p-4">
          {title && (
            <h3 className="font-semibold text-sm mb-1" id={`image-title-${src.slice(-10)}`}>
              {title}
            </h3>
          )}
          {description && (
            <p 
              className="text-xs text-muted-foreground"
              id={`image-desc-${src.slice(-10)}`}
            >
              {description}
            </p>
          )}
        </div>
      )}
    </Card>
  );
};