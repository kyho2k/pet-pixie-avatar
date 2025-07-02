import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
}

// Simplified 3D placeholder components for now
const ProductModel = ({ productType }: { productType: string }) => {
  const getModelIcon = () => {
    switch (productType) {
      case 'mug':
        return '☕';
      case 'tshirt':
        return '👕';
      case 'phonecase':
        return '📱';
      default:
        return '🎁';
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-tech rounded-lg">
      <div className="text-center text-tech-foreground">
        <div className="text-6xl mb-4 animate-float">{getModelIcon()}</div>
        <p className="text-lg font-semibold">3D 모델 뷰어</p>
        <p className="text-sm text-tech-foreground/60 mt-2">
          마우스로 회전하고 확대/축소 가능
        </p>
      </div>
    </div>
  );
};

export const ProductPreview = () => {
  const [selectedProduct, setSelectedProduct] = useState('mug');
  const [isARMode, setIsARMode] = useState(false);

  const products: Product[] = [
    {
      id: 'mug',
      name: '아바타 머그컵',
      price: '15,000원',
      description: '매일 사용하는 머그컵에 특별한 추억을'
    },
    {
      id: 'tshirt',
      name: '커스텀 티셔츠',
      price: '25,000원',
      description: '고품질 면소재에 생생한 프린팅'
    },
    {
      id: 'phonecase',
      name: '폰케이스',
      price: '18,000원',
      description: '다양한 기종 지원, 충격 보호 기능'
    }
  ];

  const renderModel = () => {
    return <ProductModel productType={selectedProduct} />;
  };

  const toggleAR = () => {
    if ('xr' in navigator) {
      setIsARMode(!isARMode);
    } else {
      alert('이 기기는 AR을 지원하지 않습니다');
    }
  };

  return (
    <section className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            🛍️ 내 펫 캐릭터 
            <span className="text-primary">굿즈</span>로 만나보기
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            생성된 아바타를 다양한 굿즈에 적용해보고, 
            3D로 미리 확인한 후 주문하세요.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* 3D Viewer */}
          <div className="space-y-6">
            <Card className="aspect-square p-6 bg-gradient-tech">
              {renderModel()}
            </Card>

            <div className="flex justify-center space-x-4">
              <Button 
                onClick={toggleAR}
                className="bg-tech-accent text-white hover:bg-tech-accent/80"
              >
                📱 AR로 보기
              </Button>
              <Button variant="outline">
                🔄 360° 회전
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              💡 마우스로 드래그하여 회전, 스크롤로 확대/축소
            </div>
          </div>

          {/* Product Selection */}
          <div className="space-y-6">
            <div className="grid gap-4">
              {products.map((product) => (
                <Card 
                  key={product.id}
                  className={`p-6 cursor-pointer transition-all duration-300 ${
                    selectedProduct === product.id
                      ? 'ring-2 ring-primary bg-primary/5'
                      : 'hover:shadow-card'
                  }`}
                  onClick={() => setSelectedProduct(product.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                      <p className="text-muted-foreground mb-3">{product.description}</p>
                      <div className="text-2xl font-bold text-primary">{product.price}</div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 ${
                      selectedProduct === product.id
                        ? 'bg-primary border-primary'
                        : 'border-muted'
                    }`}></div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              <Button 
                className="w-full bg-gradient-primary hover:scale-105 transition-transform text-lg py-6"
              >
                🛒 이 굿즈로 펀딩 참여하기
              </Button>
              
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="py-4">
                  📤 친구에게 공유
                </Button>
                <Button variant="outline" className="py-4">
                  💾 찜하기
                </Button>
              </div>
            </div>

            <Card className="p-4 bg-accent/10 border-accent">
              <div className="text-center">
                <div className="text-accent font-semibold mb-1">🎁 얼리버드 특가</div>
                <div className="text-sm text-muted-foreground">
                  지금 펀딩 참여 시 25% 할인된 가격으로 제공됩니다
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* AR Instructions */}
        {isARMode && (
          <Card className="mt-12 p-6 bg-tech-bg text-tech-foreground max-w-2xl mx-auto animate-scale-in">
            <div className="text-center space-y-4">
              <div className="text-4xl">📱</div>
              <h3 className="text-xl font-bold">AR 모드 활성화</h3>
              <p className="text-tech-foreground/80">
                제품을 배치할 평면을 카메라로 비춰보세요. 
                평면이 감지되면 제품을 터치하여 배치할 수 있습니다.
              </p>
              <Button 
                onClick={() => setIsARMode(false)}
                variant="outline"
                className="border-tech-accent text-tech-accent"
              >
                AR 모드 종료
              </Button>
            </div>
          </Card>
        )}
      </div>
    </section>
  );
};