import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import resultGalleryImage from '@/assets/result-gallery.jpg';

interface ResultImage {
  id: string;
  url: string;
  style: string;
  likes: number;
}

export const ResultsSection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const resultImages: ResultImage[] = [
    { id: '1', url: resultGalleryImage, style: '마법사 고양이', likes: 142 },
    { id: '2', url: resultGalleryImage, style: '기사 강아지', likes: 89 },
    { id: '3', url: resultGalleryImage, style: '요정 토끼', likes: 156 },
    { id: '4', url: resultGalleryImage, style: '드래곤 햄스터', likes: 203 },
  ];

  const downloadImage = (imageId: string) => {
    // Simulate download
    console.log('Downloading image:', imageId);
  };

  const shareToSocial = (platform: string, imageId: string) => {
    // Simulate social sharing
    console.log(`Sharing to ${platform}:`, imageId);
  };

  const downloadCollage = () => {
    // Simulate collage download
    console.log('Downloading collage');
  };

  return (
    <section id="results" className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-gradient-primary text-white px-4 py-2 rounded-full mb-4">
            <span>🎉</span>
            <span className="font-semibold">완성!</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            당신의 펫이 
            <span className="text-primary">판타지 세계</span>의 주인공이 되었습니다!
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            AI가 생성한 멋진 아바타들을 확인하고, 친구들과 공유해보세요.
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
          {resultImages.map((image, index) => (
            <Card 
              key={image.id}
              className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-card animate-bounce-in overflow-hidden"
              style={{animationDelay: `${index * 0.2}s`}}
              onClick={() => setSelectedImage(image.id)}
            >
              <div className="relative">
                <img 
                  src={image.url} 
                  alt={image.style}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadImage(image.id);
                      }}
                      className="bg-white/20 backdrop-blur text-white hover:bg-white/30"
                    >
                      📱 저장
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        shareToSocial('instagram', image.id);
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
        </div>

        {/* Action buttons */}
        <div className="text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              onClick={downloadCollage}
              className="bg-gradient-primary hover:scale-105 transition-transform"
            >
              🖼️ 전체 콜라주 다운로드
            </Button>
            <Button 
              variant="outline"
              onClick={() => shareToSocial('instagram', 'all')}
              className="border-primary text-primary hover:bg-primary/10"
            >
              📸 인스타그램 공유
            </Button>
            <Button 
              variant="outline"
              onClick={() => shareToSocial('facebook', 'all')}
              className="border-primary text-primary hover:bg-primary/10"
            >
              📘 페이스북 공유
            </Button>
          </div>
          
          <p className="text-muted-foreground text-sm">
            💝 실제 서비스에서는 고해상도 PNG 파일로 제공됩니다
          </p>
        </div>

        {/* Before/After Comparison */}
        <div className="mt-20">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">변화 과정을 직접 확인해보세요</h3>
            <p className="text-muted-foreground">슬라이더를 좌우로 움직여 Before & After를 비교해보세요</p>
          </div>
          
          <Card className="max-w-4xl mx-auto p-8 animate-scale-in">
            <div className="relative aspect-video bg-gradient-tech rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-tech-foreground">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎭</div>
                  <p className="text-lg font-semibold">Before & After 슬라이더</p>
                  <p className="text-sm text-tech-foreground/60 mt-2">
                    실제 서비스에서는 인터랙티브 비교 도구가 제공됩니다
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};