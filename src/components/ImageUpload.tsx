import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useNSFWFilter } from '@/hooks/useNSFWFilter';
import { toast } from 'sonner';
import { UploadArea } from './ImageUpload/UploadArea';
import { SelectedImagePreview } from './ImageUpload/SelectedImagePreview';
import { ImageTips } from './ImageUpload/ImageTips';

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
        <UploadArea
          isDragging={isDragging}
          isProcessing={isProcessing}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onUploadClick={handleUploadClick}
        />
      ) : (
        <SelectedImagePreview
          selectedImage={selectedImage}
          isGenerating={isGenerating}
          onReplace={handleReplaceClick}
          onRemove={handleRemoveClick}
        />
      )}

      <ImageTips />
    </div>
  );
};