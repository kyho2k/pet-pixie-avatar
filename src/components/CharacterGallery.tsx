import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface CharacterGalleryProps {
  characters: string[];
  styles: string[];
  className?: string;
}

export const CharacterGallery = ({ 
  characters = [], 
  styles = [],
  className = "" 
}: CharacterGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const getStyleName = (index: number) => {
    const styleNames = {
      'disney': '디즈니',
      'anime': '애니메이션', 
      'fantasy': '판타지',
      'cyberpunk': '사이버펑크',
      'watercolor': '수채화',
      'pixel': '픽셀아트'
    };
    
    const style = styles[index] || 'disney';
    return styleNames[style as keyof typeof styleNames] || style;
  };

  const getStyleEmoji = (index: number) => {
    const styleEmojis = {
      'disney': '🏰',
      'anime': '⚡', 
      'fantasy': '✨',
      'cyberpunk': '🤖',
      'watercolor': '🎨',
      'pixel': '🎮'
    };
    
    const style = styles[index] || 'disney';
    return styleEmojis[style as keyof typeof styleEmojis] || '🎭';
  };

  const handleDownload = (imageUrl: string, styleName: string) => {
    // Create download link
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `pet-character-${styleName.toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`${styleName} 스타일 캐릭터를 다운로드했습니다! 📥`);
  };

  const handleShare = (imageUrl: string, styleName: string) => {
    if (navigator.share) {
      navigator.share({
        title: `AI 펫 캐릭터 - ${styleName} 스타일`,
        text: 'AI로 생성한 우리 펫의 캐릭터를 확인해보세요!',
        url: imageUrl
      });
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(imageUrl);
      toast.success('이미지 링크가 복사되었습니다! 📋');
    }
  };

  if (characters.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h3 className="text-2xl font-bold text-tech-foreground mb-2">
          🎨 생성된 캐릭터
        </h3>
        <p className="text-tech-foreground/70">
          마음에 드는 스타일을 선택하고 다운로드하세요
        </p>
      </div>

      {/* Character Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {characters.map((imageUrl, index) => (
          <Card 
            key={index}
            className="bg-tech-bg/50 border-tech-accent/20 overflow-hidden hover:border-tech-accent/40 transition-all cursor-pointer group"
            onClick={() => setSelectedImage(imageUrl)}
          >
            <div className="aspect-square relative overflow-hidden">
              <img
                src={imageUrl}
                alt={`${getStyleName(index)} 스타일 캐릭터`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3">
                <Badge className="bg-tech-accent/90 text-white">
                  {getStyleEmoji(index)} {getStyleName(index)}
                </Badge>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="text-white text-lg font-medium">
                  크게 보기
                </div>
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  className="flex-1 bg-tech-accent hover:bg-tech-accent/80"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(imageUrl, getStyleName(index));
                  }}
                >
                  💾 다운로드
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex-1 border-tech-accent/40 text-tech-accent hover:bg-tech-accent/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare(imageUrl, getStyleName(index));
                  }}
                >
                  📤 공유
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal for enlarged view */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-2xl max-h-[90vh] relative">
            <img
              src={selectedImage}
              alt="확대된 캐릭터 이미지"
              className="w-full h-auto rounded-lg"
            />
            <Button
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
              size="sm"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};