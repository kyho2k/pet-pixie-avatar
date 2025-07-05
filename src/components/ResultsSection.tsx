import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MasonryGallery } from '@/components/MasonryGallery';
import { ModelViewer3D } from '@/components/ModelViewer3D';
import { RewardPreview } from '@/components/RewardPreview';
import resultGalleryImage from '@/assets/result-gallery.jpg';

interface ResultImage {
  id: string;
  url: string;
  style: string;
  likes: number;
  width?: number;
  height?: number;
}

export const ResultsSection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const resultImages: ResultImage[] = [
    { id: '1', url: resultGalleryImage, style: '마법사 고양이', likes: 142, height: 300 },
    { id: '2', url: resultGalleryImage, style: '기사 강아지', likes: 89, height: 250 },
    { id: '3', url: resultGalleryImage, style: '요정 토끼', likes: 156, height: 320 },
    { id: '4', url: resultGalleryImage, style: '드래곤 햄스터', likes: 203, height: 280 },
    { id: '5', url: resultGalleryImage, style: '엘프 고양이', likes: 175, height: 290 },
    { id: '6', url: resultGalleryImage, style: '바이킹 강아지', likes: 134, height: 310 },
    { id: '7', url: resultGalleryImage, style: '닌자 토끼', likes: 198, height: 270 },
    { id: '8', url: resultGalleryImage, style: '해적 앵무새', likes: 221, height: 330 },
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

  const loadMoreImages = () => {
    setLoading(true);
    // 시뮬레이션 - 실제로는 API 호출
    setTimeout(() => {
      setLoading(false);
      // 더 이상 로드할 이미지가 없다고 가정
      setHasMore(false);
    }, 1500);
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

        {/* Masonry Gallery */}
        <div className="max-w-6xl mx-auto mb-12">
          <MasonryGallery
            images={resultImages}
            loading={loading}
            onLoadMore={loadMoreImages}
            hasMore={hasMore}
          />
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

        {/* Before/After Comparison - REMOVED per PRD */}
        {/* 기존 Before/After 슬라이더는 PRD에 따라 제거되었습니다 */}
        
        {/* 3D Model Viewer & Reward Preview */}
        <div className="mt-20 space-y-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">3D 모델 & 굿즈 미리보기</h3>
            <p className="text-muted-foreground">
              AI가 생성한 3D 모델을 확인하고, 다양한 굿즈 옵션을 미리 체험해보세요
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <ModelViewer3D 
              modelUrl="/demo-pet-model.glb"
              isLoading={false}
            />
            <RewardPreview 
              selectedImage={resultGalleryImage}
            />
          </div>
        </div>
      </div>
    </section>
  );
};