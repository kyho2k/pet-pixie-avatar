import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Center } from '@react-three/drei';
import * as THREE from 'three';

interface RewardOption {
  id: string;
  price: number;
  title: string;
  items: string[];
  preview3D?: string;
}

interface RewardPreviewProps {
  selectedImage?: string;
  className?: string;
}

const MugModel = ({ texture }: { texture?: string }) => {
  return (
    <Center>
      <mesh>
        <cylinderGeometry args={[0.8, 0.9, 1.2, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Handle */}
      <mesh position={[1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.3, 0.1, 8, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Character image on mug */}
      {texture && (
        <mesh position={[0, 0, 0.91]}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial color="#ff6b9d" transparent opacity={0.8} />
        </mesh>
      )}
    </Center>
  );
};

const TShirtModel = ({ texture }: { texture?: string }) => {
  return (
    <Center>
      <mesh>
        <boxGeometry args={[2, 2.5, 0.1]} />
        <meshStandardMaterial color="#4a90e2" />
      </mesh>
      {/* Character design on t-shirt */}
      {texture && (
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[1.5, 1.5]} />
          <meshStandardMaterial color="#ff6b9d" transparent opacity={0.9} />
        </mesh>
      )}
    </Center>
  );
};

export const RewardPreview = ({ selectedImage, className = "" }: RewardPreviewProps) => {
  const [selectedReward, setSelectedReward] = useState<string>('basic');

  const rewardOptions: RewardOption[] = [
    {
      id: 'basic',
      price: 10000,
      title: '디지털 캐릭터 이미지',
      items: ['고해상도 PNG 파일', '웹용 이미지 파일'],
    },
    {
      id: 'mug',
      price: 30000,
      title: '머그컵 세트',
      items: ['디지털 이미지', '커스텀 머그컵 1개', '전용 포장박스'],
      preview3D: 'mug',
    },
    {
      id: 'premium',
      price: 70000,
      title: '프리미엄 굿즈 세트',
      items: ['디지털 이미지', '커스텀 티셔츠', '액자', '머그컵', '스티커 세트'],
      preview3D: 'tshirt',
    },
  ];

  const selectedOption = rewardOptions.find(option => option.id === selectedReward);

  const render3DPreview = () => {
    if (!selectedOption?.preview3D) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-tech-bg/30 rounded-lg">
          <div className="text-center">
            <div className="text-4xl mb-2">🎨</div>
            <p className="text-tech-foreground/70">디지털 이미지 미리보기</p>
          </div>
        </div>
      );
    }

    return (
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, 5, 5]} intensity={0.3} />
        
        <Environment preset="studio" />
        
        {selectedOption.preview3D === 'mug' && <MugModel texture={selectedImage} />}
        {selectedOption.preview3D === 'tshirt' && <TShirtModel texture={selectedImage} />}
        
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={8}
          autoRotate={true}
          autoRotateSpeed={1}
        />
      </Canvas>
    );
  };

  return (
    <Card className={`bg-tech-bg/50 border-tech-accent/20 ${className}`}>
      <div className="p-6">
        <h3 className="text-xl font-bold text-tech-foreground mb-6">
          💳 리워드 미리보기
        </h3>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Reward Options */}
          <div className="space-y-3">
            {rewardOptions.map((option) => (
              <Button
                key={option.id}
                onClick={() => setSelectedReward(option.id)}
                variant={selectedReward === option.id ? 'default' : 'outline'}
                className={`w-full p-4 h-auto justify-start ${
                  selectedReward === option.id
                    ? 'bg-tech-accent text-white'
                    : 'text-tech-foreground border-tech-accent/40 hover:bg-tech-accent/10'
                }`}
              >
                <div className="text-left">
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-semibold">{option.title}</span>
                    <span className="text-sm">₩{option.price.toLocaleString()}</span>
                  </div>
                  <div className="text-xs opacity-80">
                    {option.items.join(' + ')}
                  </div>
                </div>
              </Button>
            ))}
          </div>
          
          {/* 3D Preview */}
          <div className="aspect-square rounded-lg overflow-hidden bg-gradient-subtle">
            {render3DPreview()}
          </div>
        </div>
        
        {selectedOption && (
          <div className="mt-6 p-4 bg-tech-accent/10 rounded-lg">
            <h4 className="font-semibold text-tech-foreground mb-2">
              선택된 리워드: {selectedOption.title}
            </h4>
            <ul className="text-sm text-tech-foreground/80 space-y-1">
              {selectedOption.items.map((item, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-tech-accent rounded-full mr-2"></span>
                  {item}
                </li>
              ))}
            </ul>
            <Button 
              className="w-full mt-4 bg-gradient-primary hover:scale-105 transition-transform"
              size="lg"
            >
              ₩{selectedOption.price.toLocaleString()} 후원하기
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};