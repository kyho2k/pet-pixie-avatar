import { useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Upload } from 'lucide-react';

interface UploadAreaProps {
  isDragging: boolean;
  isProcessing: boolean;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onUploadClick: () => void;
}

export const UploadArea = ({
  isDragging,
  isProcessing,
  onDrop,
  onDragOver,
  onDragLeave,
  onUploadClick
}: UploadAreaProps) => {
  return (
    <Card
      className={`border-2 border-dashed transition-all duration-300 cursor-pointer
        ${isDragging 
          ? 'border-tech-accent bg-tech-accent/10' 
          : 'border-tech-accent/40 hover:border-tech-accent/70'
        }
        ${isProcessing ? 'pointer-events-none opacity-60' : ''}
      `}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={onUploadClick}
      role="button"
      tabIndex={0}
      aria-label="이미지 업로드 영역"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onUploadClick();
        }
      }}
    >
      <div className="p-8 text-center space-y-4">
        {isProcessing ? (
          <div className="space-y-4">
            <Skeleton className="w-16 h-16 rounded-full mx-auto" />
            <Skeleton className="h-4 w-48 mx-auto" />
            <Skeleton className="h-3 w-32 mx-auto" />
          </div>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto bg-tech-accent/10 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-tech-accent" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-tech-foreground mb-2">
                반려동물 사진을 업로드해주세요
              </h3>
              <p className="text-tech-foreground/60 text-sm">
                드래그하거나 클릭하여 이미지를 선택하세요
              </p>
            </div>
            
            <div className="text-xs text-tech-foreground/50 space-y-1">
              <p>JPG, PNG, WebP 형식 지원</p>
              <p>최대 5MB • 고해상도 권장</p>
              <p>🛡️ AI가 부적절한 이미지를 자동 차단합니다</p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};