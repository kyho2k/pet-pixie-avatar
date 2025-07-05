import { Button } from '@/components/ui/button';
import { ImageUpload } from '@/components/ImageUpload';
import { StyleSelector } from '@/components/StyleSelector';

interface CustomImageSectionProps {
  uploadedImage: string;
  selectedStyles: string[];
  isGenerating: boolean;
  onImageSelect: (file: File, imageUrl: string) => void;
  onStylesChange: (styles: string[]) => void;
  onGenerate: () => void;
}

export const CustomImageSection = ({
  uploadedImage,
  selectedStyles,
  isGenerating,
  onImageSelect,
  onStylesChange,
  onGenerate
}: CustomImageSectionProps) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-tech-foreground mb-2">
          🐾 내 반려동물로 체험하기
        </h3>
        <p className="text-tech-foreground/70">
          직접 반려동물 사진을 업로드해서 AI 아바타를 만들어보세요
        </p>
      </div>
      
      <ImageUpload
        onImageSelect={onImageSelect}
        selectedImage={uploadedImage}
        isGenerating={isGenerating}
        className="mb-6"
      />
      
      <StyleSelector
        onStylesChange={onStylesChange}
        selectedStyles={selectedStyles}
        className="mb-6"
      />
      
      {uploadedImage && (
        <div className="text-center">
          <Button
            onClick={onGenerate}
            disabled={isGenerating}
            className="bg-gradient-primary hover:bg-gradient-primary/90 text-white px-8 py-3 text-lg"
            size="lg"
          >
            🎨 AI 아바타 생성하기
          </Button>
        </div>
      )}
    </div>
  );
};