import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useNSFWFilter } from '@/hooks/useNSFWFilter';
import { toast } from 'sonner';
import { Upload, RefreshCw, X, ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (file: File, imageUrl: string) => void;
  selectedImage?: string;
  isGenerating?: boolean;
  className?: string;
}

export const ImageUpload = ({ 
  onImageSelect, 
  selectedImage, 
  isGenerating = false,
  className = "" 
}: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { checkImage, isLoading: isNSFWLoading } = useNSFWFilter();

  const handleFileSelect = useCallback(async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드 가능합니다');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('파일 크기는 5MB 이하여야 합니다');
      return;
    }

    setIsChecking(true);

    try {
      // NSFW check
      const nsfwResult = await checkImage(file);
      
      if (nsfwResult?.isNSFW) {
        toast.error(
          `부적절한 이미지가 감지되었습니다. (신뢰도: ${Math.round(nsfwResult.confidence * 100)}%)`
        );
        setIsChecking(false);
        return;
      }

      // Create preview URL
      const imageUrl = URL.createObjectURL(file);
      onImageSelect(file, imageUrl);
      
      toast.success('이미지가 업로드되었습니다! 🎉');
      
    } catch (error) {
      console.error('이미지 처리 오류:', error);
      toast.error('이미지 처리 중 오류가 발생했습니다');
    } finally {
      setIsChecking(false);
    }
  }, [checkImage, onImageSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleReplaceClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRemoveClick = useCallback(() => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }
    onImageSelect(new File([], ''), '');
  }, [selectedImage, onImageSelect]);

  const isProcessing = isChecking || isNSFWLoading;

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        aria-label="이미지 파일 선택"
      />

      {/* Upload Area or Selected Image */}
      {!selectedImage ? (
        <Card
          className={`border-2 border-dashed transition-all duration-300 cursor-pointer
            ${isDragging 
              ? 'border-tech-accent bg-tech-accent/10' 
              : 'border-tech-accent/40 hover:border-tech-accent/70'
            }
            ${isProcessing ? 'pointer-events-none opacity-60' : ''}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleUploadClick}
          role="button"
          tabIndex={0}
          aria-label="이미지 업로드 영역"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleUploadClick();
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
      ) : (
        <Card className="bg-tech-bg/50 border-tech-accent/20">
          <div className="p-4">
            <div className="aspect-square rounded-lg overflow-hidden mb-4 relative group">
              <img 
                src={selectedImage} 
                alt="업로드된 반려동물 사진"
                className="w-full h-full object-cover"
              />
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleReplaceClick}
                  disabled={isGenerating}
                  aria-label="이미지 교체"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  교체
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleRemoveClick}
                  disabled={isGenerating}
                  aria-label="이미지 제거"
                >
                  <X className="w-4 h-4 mr-2" />
                  제거
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-tech-foreground/80">
                <ImageIcon className="w-4 h-4" />
                <span>이미지 준비 완료</span>
              </div>
              
              <Button
                size="sm"
                variant="outline"
                onClick={handleReplaceClick}
                disabled={isGenerating}
                className="text-tech-accent border-tech-accent/40 hover:bg-tech-accent/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                다른 사진 선택
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Tips */}
      <div className="text-center text-xs text-tech-foreground/50 space-y-1">
        <p>💡 <strong>팁:</strong> 정면을 바라보는 얼굴이 잘 보이는 사진일수록 더 좋은 결과를 얻을 수 있어요</p>
        <p>🎨 다양한 각도와 표정의 사진으로 여러 번 시도해보세요!</p>
      </div>
    </div>
  );
};