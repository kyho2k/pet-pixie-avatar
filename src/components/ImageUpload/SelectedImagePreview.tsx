import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RefreshCw, X, ImageIcon } from 'lucide-react';

interface SelectedImagePreviewProps {
  selectedImage: string;
  isGenerating: boolean;
  onReplace: () => void;
  onRemove: () => void;
}

export const SelectedImagePreview = ({
  selectedImage,
  isGenerating,
  onReplace,
  onRemove
}: SelectedImagePreviewProps) => {
  return (
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
              onClick={onReplace}
              disabled={isGenerating}
              aria-label="이미지 교체"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              교체
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={onRemove}
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
            onClick={onReplace}
            disabled={isGenerating}
            className="text-tech-accent border-tech-accent/40 hover:bg-tech-accent/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            다른 사진 선택
          </Button>
        </div>
      </div>
    </Card>
  );
};