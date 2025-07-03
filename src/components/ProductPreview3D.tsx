import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture, Environment } from '@react-three/drei';
import { Suspense, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import * as THREE from 'three';

// Mug 3D Model Component
const MugModel = ({ texture }: { texture: THREE.Texture }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} rotation={[0, 0, 0]}>
      {/* Main mug body - cylinder */}
      <cylinderGeometry args={[0.8, 0.9, 1.8, 32]} />
      <meshStandardMaterial map={texture} />
      
      {/* Mug handle */}
      <mesh position={[1.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.3, 0.08, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </mesh>
  );
};

// T-Shirt 3D Model Component  
const TShirtModel = ({ texture }: { texture: THREE.Texture }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <group>
      {/* Main body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 2.5, 0.1]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      
      {/* Left sleeve */}
      <mesh position={[-1.3, 0.8, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.6, 1, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Right sleeve */}
      <mesh position={[1.3, 0.8, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.6, 1, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};

// Phone Case 3D Model Component
const PhoneCaseModel = ({ texture }: { texture: THREE.Texture }) => {
  return (
    <group>
      {/* Phone case back */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[1.2, 2.4, 0.08]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      
      {/* Screen area with texture */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.1, 2.2, 0.02]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      
      {/* Camera bump */}
      <mesh position={[-0.35, 0.8, 0.05]}>
        <cylinderGeometry args={[0.15, 0.15, 0.05, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  );
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <Skeleton className="w-48 h-48 rounded-lg" />
  </div>
);

interface ProductPreview3DProps {
  avatarImage?: string;
}

export const ProductPreview3D = ({ avatarImage = '/api/placeholder/400/400' }: ProductPreview3DProps) => {
  const [selectedProduct, setSelectedProduct] = useState<'mug' | 'tshirt' | 'phonecase'>('mug');
  const [isLoading, setIsLoading] = useState(true);

  const TexturedProduct = ({ productType }: { productType: string }) => {
    const texture = useTexture(avatarImage);
    
    // Configure texture
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.flipY = false;

    const renderProduct = () => {
      switch (productType) {
        case 'mug':
          return <MugModel texture={texture} />;
        case 'tshirt':
          return <TShirtModel texture={texture} />;
        case 'phonecase':
          return <PhoneCaseModel texture={texture} />;
        default:
          return <MugModel texture={texture} />;
      }
    };

    return (
      <group>
        {renderProduct()}
      </group>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">🎁 굿즈로 만나보세요</h3>
        <p className="text-muted-foreground">
          AI 아바타를 다양한 굿즈에 적용한 모습을 360도로 확인해보세요
        </p>
      </div>

      <Card className="overflow-hidden bg-white shadow-card">
        <Tabs value={selectedProduct} onValueChange={(value) => setSelectedProduct(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="mug" className="flex items-center space-x-2">
              <span>☕</span>
              <span>머그컵</span>
            </TabsTrigger>
            <TabsTrigger value="tshirt" className="flex items-center space-x-2">
              <span>👕</span>
              <span>티셔츠</span>
            </TabsTrigger>
            <TabsTrigger value="phonecase" className="flex items-center space-x-2">
              <span>📱</span>
              <span>폰케이스</span>
            </TabsTrigger>
          </TabsList>

          <div className="p-6">
            <div className="aspect-square bg-gradient-to-b from-muted/20 to-muted/50 rounded-lg overflow-hidden">
              {isLoading && <LoadingSpinner />}
              
              <Canvas
                camera={{ position: [3, 2, 5], fov: 50 }}
                onCreated={() => setIsLoading(false)}
                style={{ display: isLoading ? 'none' : 'block' }}
              >
                <Suspense fallback={null}>
                  {/* Lighting */}
                  <ambientLight intensity={0.6} />
                  <directionalLight position={[10, 10, 5]} intensity={1} />
                  <pointLight position={[-10, -10, -10]} intensity={0.3} />
                  
                  {/* Environment */}
                  <Environment preset="studio" />
                  
                  {/* 3D Product */}
                  <TexturedProduct productType={selectedProduct} />
                  
                  {/* Controls */}
                  <OrbitControls
                    enablePan={false}
                    enableZoom={true}
                    minDistance={2}
                    maxDistance={8}
                    autoRotate={true}
                    autoRotateSpeed={2}
                  />
                </Suspense>
              </Canvas>
            </div>

            <div className="mt-6 space-y-4">
              <TabsContent value="mug" className="mt-0">
                <div className="text-center space-y-2">
                  <h4 className="font-semibold">세라믹 머그컵</h4>
                  <p className="text-sm text-muted-foreground">
                    고품질 세라믹 소재 • 내열성 프린팅 • 식기세척기 사용 가능
                  </p>
                  <div className="text-lg font-bold text-primary">₩18,000</div>
                </div>
              </TabsContent>
              
              <TabsContent value="tshirt" className="mt-0">
                <div className="text-center space-y-2">
                  <h4 className="font-semibold">프리미엄 티셔츠</h4>
                  <p className="text-sm text-muted-foreground">
                    100% 코튼 소재 • DTG 프린팅 • S~XXL 사이즈
                  </p>
                  <div className="text-lg font-bold text-primary">₩25,000</div>
                </div>
              </TabsContent>
              
              <TabsContent value="phonecase" className="mt-0">
                <div className="text-center space-y-2">
                  <h4 className="font-semibold">하드 폰케이스</h4>
                  <p className="text-sm text-muted-foreground">
                    PC 소재 • 충격 보호 • iPhone/Galaxy 전 기종
                  </p>
                  <div className="text-lg font-bold text-primary">₩15,000</div>
                </div>
              </TabsContent>

              <div className="flex space-x-3">
                <Button className="flex-1 bg-gradient-primary">
                  🛒 장바구니 담기
                </Button>
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  📤 공유하기
                </Button>
              </div>
            </div>
          </div>
        </Tabs>
      </Card>

      <div className="text-center">
        <p className="text-muted-foreground text-sm">
          💡 클릭해서 드래그하면 360도 회전할 수 있어요!
        </p>
      </div>
    </div>
  );
};