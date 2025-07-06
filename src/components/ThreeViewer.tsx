import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Center } from '@react-three/drei';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface ThreeViewerProps {
  modelUrl?: string;
  meshyModel?: string;
  isLoading?: boolean;
  className?: string;
}

const PetModel3D = ({ url }: { url: string }) => {
  // For demo purposes, create a simple 3D pet model
  return (
    <Center>
      <group>
        {/* Body */}
        <mesh position={[0, -0.5, 0]}>
          <boxGeometry args={[1.2, 0.8, 0.8]} />
          <meshStandardMaterial color="#D2691E" />
        </mesh>
        
        {/* Head */}
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.6]} />
          <meshStandardMaterial color="#DEB887" />
        </mesh>
        
        {/* Ears */}
        <mesh position={[-0.3, 0.8, 0]} rotation={[0, 0, -0.3]}>
          <coneGeometry args={[0.15, 0.4]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0.3, 0.8, 0]} rotation={[0, 0, 0.3]}>
          <coneGeometry args={[0.15, 0.4]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        
        {/* Legs */}
        <mesh position={[-0.4, -0.9, 0.2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.4]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0.4, -0.9, 0.2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.4]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[-0.4, -0.9, -0.2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.4]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0.4, -0.9, -0.2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.4]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        
        {/* Tail */}
        <mesh position={[0, 0, -0.6]} rotation={[0.5, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.12, 0.5]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      </group>
    </Center>
  );
};

const LoadingModel = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center text-tech-foreground">
      <div className="animate-spin w-8 h-8 border-2 border-tech-accent border-t-transparent rounded-full mx-auto mb-2"></div>
      <p className="text-sm">3D 모델 로딩 중...</p>
    </div>
  </div>
);

export const ThreeViewer = ({ 
  modelUrl, 
  meshyModel,
  isLoading = false, 
  className = "" 
}: ThreeViewerProps) => {
  const model3DUrl = meshyModel || modelUrl;

  const handleARView = () => {
    toast.info('AR 기능은 곧 출시됩니다! 📱✨');
  };

  const handleDownload = () => {
    if (model3DUrl) {
      const link = document.createElement('a');
      link.href = model3DUrl;
      link.download = 'pet-3d-model.glb';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('3D 모델을 다운로드했습니다! 💾');
    }
  };

  return (
    <Card className={`bg-tech-bg/50 border-tech-accent/20 overflow-hidden ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-tech-foreground flex items-center space-x-2">
            <span>🎲</span>
            <span>3D 펫 모델</span>
          </h3>
          <div className="flex space-x-2">
            <Button
              onClick={handleARView}
              className="bg-tech-accent/20 text-tech-accent hover:bg-tech-accent/30 border border-tech-accent/40"
              size="sm"
            >
              📱 AR 보기
            </Button>
            {model3DUrl && (
              <Button
                onClick={handleDownload}
                variant="outline"
                size="sm"
                className="text-tech-accent border-tech-accent/40"
              >
                💾 다운로드
              </Button>
            )}
          </div>
        </div>
        
        <div className="aspect-square rounded-lg overflow-hidden bg-gradient-subtle">
          {isLoading ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <Canvas
              camera={{ position: [0, 0, 5], fov: 45 }}
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={0.4} />
              <directionalLight position={[10, 10, 5]} intensity={0.8} />
              <spotLight position={[0, 10, 0]} intensity={0.3} />
              
              <Environment preset="studio" />
              
              <Suspense fallback={<LoadingModel />}>
                {model3DUrl ? (
                  <PetModel3D url={model3DUrl} />
                ) : (
                  <LoadingModel />
                )}
              </Suspense>
              
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
          <p className="text-sm text-tech-foreground/70 mb-3">
            마우스로 드래그하여 회전, 스크롤로 확대/축소
          </p>
          <div className="flex justify-center text-xs text-tech-foreground/50">
            <span>🎯 실제 서비스에서는 GLB 파일을 지원합니다</span>
          </div>
        </div>
      </div>
    </Card>
  );
};