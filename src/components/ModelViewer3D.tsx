import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Center, Html } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import * as THREE from 'three';

interface ModelViewer3DProps {
  modelUrl?: string;
  isLoading?: boolean;
  className?: string;
}

const PetModel = ({ url }: { url: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  // For demo purposes, create a simple pet-like shape
  return (
    <Center>
      <mesh ref={meshRef}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.6]} />
        <meshStandardMaterial color="#D2691E" />
      </mesh>
      {/* Ears */}
      <mesh position={[-0.3, 1.2, 0]}>
        <coneGeometry args={[0.2, 0.4]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0.3, 1.2, 0]}>
        <coneGeometry args={[0.2, 0.4]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
    </Center>
  );
};

const LoadingModel = () => (
  <Html center>
    <div className="text-center text-tech-foreground">
      <div className="animate-spin w-8 h-8 border-2 border-tech-accent border-t-transparent rounded-full mx-auto mb-2"></div>
      <p className="text-sm">3D 모델 로딩 중...</p>
    </div>
  </Html>
);

export const ModelViewer3D = ({ modelUrl, isLoading = false, className = "" }: ModelViewer3DProps) => {
  const [isARSupported, setIsARSupported] = useState(false);

  const handleARView = () => {
    if ('xr' in navigator) {
      // Check WebXR support
      navigator.xr?.isSessionSupported('immersive-ar').then((supported) => {
        if (supported) {
          toast.success('AR 모드로 전환합니다! 📱');
          // WebXR AR implementation would go here
        } else {
          // Fallback to model viewer
          toast.info('AR 모드가 지원되지 않습니다. 3D 뷰어를 사용해주세요.');
        }
      });
    } else {
      toast.info('AR 기능을 위해서는 모바일 브라우저를 사용해주세요.');
    }
  };

  return (
    <Card className={`bg-tech-bg/50 border-tech-accent/20 overflow-hidden ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-tech-foreground">
            🦴 3D 펫 모델
          </h3>
          <Button
            onClick={handleARView}
            className="bg-tech-accent/20 text-tech-accent hover:bg-tech-accent/30 border border-tech-accent/40"
            size="sm"
          >
            📱 AR로 보기
          </Button>
        </div>
        
        <div className="aspect-square rounded-lg overflow-hidden bg-gradient-subtle">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <Skeleton className="w-full h-full" />
            </div>
          ) : (
            <Canvas
              camera={{ position: [0, 0, 5], fov: 45 }}
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <spotLight position={[0, 10, 0]} intensity={0.3} />
              
              <Environment preset="studio" />
              
              {modelUrl ? (
                <PetModel url={modelUrl} />
              ) : (
                <LoadingModel />
              )}
              
              <OrbitControls
                enablePan={false}
                enableZoom={true}
                enableRotate={true}
                minDistance={2}
                maxDistance={10}
                autoRotate={true}
                autoRotateSpeed={0.5}
              />
            </Canvas>
          )}
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-tech-foreground/70 mb-2">
            마우스로 드래그하여 회전, 스크롤로 확대/축소
          </p>
          <div className="flex justify-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              className="text-tech-accent border-tech-accent/40"
            >
              💾 모델 다운로드
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-tech-accent border-tech-accent/40"
            >
              🔄 다른 각도
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};