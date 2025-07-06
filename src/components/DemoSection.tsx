import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CustomImageSection } from './DemoSection/CustomImageSection';
import { SamplePetsGrid } from './DemoSection/SamplePetsGrid';
import { GenerationProgress } from './DemoSection/GenerationProgress';
import { GenerationControls } from './DemoSection/GenerationControls';
import { useGenerateAvatar, useJobStatus } from '@/hooks/useReplicateAPI';
import { useJobProgress } from '@/hooks/useWebSocket';
import { useUserQuota } from '@/hooks/useUserQuota';
import { toast } from 'sonner';
import samplePetsImage from '@/assets/sample-pets.jpg';


export const DemoSection = () => {
  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['disney']);
  
  // API hooks
  const generateMutation = useGenerateAvatar();
  const { data: jobStatus } = useJobStatus(currentJobId, !!currentJobId);
  const { quota, checkQuota, consumeQuota } = useUserQuota();
  
  // WebSocket progress hook
  const { 
    progress, 
    status: generationStatus, 
    phase,
    currentStep, 
    timeRemaining,
    meshyModel,
    isConnected 
  } = useJobProgress(currentJobId);
  
  const isGenerating = isConnected || generateMutation.isPending;
  const showResults = generationStatus === 'succeeded';

  const samplePets = [
    { id: '1', name: '골든리트리버', type: '강아지' },
    { id: '2', name: '터키시앙고라', type: '고양이' },
    { id: '3', name: '시베리안허스키', type: '강아지' },
    { id: '4', name: '스코티시폴드', type: '고양이' },
  ];

  const handleImageSelect = (file: File, imageUrl: string) => {
    setUploadedFile(file);
    setUploadedImage(imageUrl);
  };

  const startDemo = async (petId: string) => {
    if (!checkQuota()) {
      return;
    }

    setSelectedPet(petId);
    
    try {
      // Generate avatar using API
      const result = await generateMutation.mutateAsync({
        imageUrl: samplePetsImage,
        styles: selectedStyles
      });
      
      // Set job ID to start progress tracking
      setCurrentJobId(result.jobId);
      consumeQuota();
      
      // Navigate to results after completion
      if (result.status === 'succeeded') {
        setTimeout(() => {
          document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
        }, 1000);
      }
      
    } catch (error) {
      toast.error('아바타 생성에 실패했습니다. 다시 시도해주세요.');
      console.error('Generation error:', error);
    }
  };

  const startCustomGeneration = async () => {
    if (!uploadedFile || !uploadedImage) {
      toast.error('먼저 반려동물 사진을 업로드해주세요');
      return;
    }
    
    if (!checkQuota()) {
      return;
    }

    try {
      // Generate avatar using uploaded image
      const result = await generateMutation.mutateAsync({
        imageUrl: uploadedImage,
        styles: selectedStyles
      });
      
      setCurrentJobId(result.jobId);
      consumeQuota();
      
      // Navigate to results after completion
      if (result.status === 'succeeded') {
        setTimeout(() => {
          document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
        }, 1000);
      }
      
    } catch (error) {
      toast.error('아바타 생성에 실패했습니다. 다시 시도해주세요.');
      console.error('Generation error:', error);
    }
  };

  const handleRegenerate = async () => {
    if (selectedPet) {
      // Reset current job
      setCurrentJobId(null);
      await startDemo(selectedPet);
    } else if (uploadedFile) {
      setCurrentJobId(null);
      await startCustomGeneration();
    }
  };

  return (
    <section id="demo" className="py-20 bg-tech-bg text-tech-foreground">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            ⚡ 1분 만에 
            <span className="text-tech-accent">AI 마법</span> 체험하기
          </h2>
          <p className="text-tech-foreground/80 text-lg max-w-2xl mx-auto">
            샘플 이미지로 AI 변환 과정을 실시간으로 확인해보세요. 
            실제 서비스와 동일한 속도와 품질을 제공합니다.
          </p>
        </div>

        {!isGenerating ? (
          <div className="space-y-12">
            {/* Custom Image Upload Section */}
            <CustomImageSection
              uploadedImage={uploadedImage}
              selectedStyles={selectedStyles}
              isGenerating={isGenerating}
              onImageSelect={handleImageSelect}
              onStylesChange={setSelectedStyles}
              onGenerate={startCustomGeneration}
            />

            {/* Divider */}
            <div className="flex items-center max-w-4xl mx-auto">
              <div className="flex-1 h-px bg-tech-accent/20"></div>
              <span className="px-4 text-tech-foreground/60 text-sm">또는 샘플로 빠르게 체험</span>
              <div className="flex-1 h-px bg-tech-accent/20"></div>
            </div>

            {/* Sample Pets Section */}
            <SamplePetsGrid onPetSelect={startDemo} />
          </div>
        ) : (
          <GenerationProgress
            progress={progress}
            currentStep={currentStep}
            timeRemaining={timeRemaining}
            phase={phase}
            meshyModel={meshyModel}
          />
        )}

        {/* Credit Warning & Regenerate Button */}
        {showResults && (
          <GenerationControls
            onRegenerate={handleRegenerate}
            remainingCredits={quota.daily.remaining}
            disabled={isGenerating}
          />
        )}

        <div className="text-center mt-12">
          <p className="text-tech-foreground/60 text-sm">
            💡 실제 서비스: 3D 모델 → 다중 스타일 캐릭터 (디즈니, 애니메이션 등) 생성
          </p>
        </div>
      </div>
    </section>
  );
};