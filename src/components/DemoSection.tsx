import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ProgressBar } from '@/components/ui/progress-bar';
import { RegenerateButton } from '@/components/RegenerateButton';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import samplePetsImage from '@/assets/sample-pets.jpg';

interface SamplePet {
  id: string;
  name: string;
  type: string;
  image: string;
}

export const DemoSection = () => {
  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [generationStatus, setGenerationStatus] = useState<'starting' | 'processing' | 'succeeded' | 'failed'>('starting');
  const [currentStep, setCurrentStep] = useState<string>('');
  const [remainingCredits, setRemainingCredits] = useState(3);
  const [showResults, setShowResults] = useState(false);

  const samplePets: SamplePet[] = [
    { id: '1', name: '골든리트리버', type: '강아지', image: samplePetsImage },
    { id: '2', name: '터키시앙고라', type: '고양이', image: samplePetsImage },
    { id: '3', name: '시베리안허스키', type: '강아지', image: samplePetsImage },
    { id: '4', name: '스코티시폴드', type: '고양이', image: samplePetsImage },
  ];

  const startDemo = (petId: string) => {
    if (remainingCredits <= 0) {
      toast.error('오늘의 체험 한도를 모두 사용했습니다! 내일 다시 시도해주세요.');
      return;
    }

    setSelectedPet(petId);
    setIsGenerating(true);
    setProgress(0);
    setTimeRemaining(60);
    setGenerationStatus('starting');
    setCurrentStep('이미지 분석 시작...');
    setShowResults(false);

    // 실제 API 호출 시뮬레이션 - 단계별 진행
    const steps = [
      { progress: 15, step: '펫 얼굴 인식 중...', delay: 800 },
      { progress: 35, step: 'AI 스타일 분석 중...', delay: 1200 },
      { progress: 55, step: '판타지 아바타 생성 중...', delay: 1500 },
      { progress: 75, step: '고품질 렌더링 중...', delay: 1000 },
      { progress: 95, step: '최종 보정 중...', delay: 700 },
      { progress: 100, step: '완성!', delay: 500 }
    ];
    
    setGenerationStatus('processing');
    
    let currentStepIndex = 0;
    const processStep = () => {
      if (currentStepIndex < steps.length) {
        const step = steps[currentStepIndex];
        setTimeout(() => {
          setProgress(step.progress);
          setCurrentStep(step.step);
          setTimeRemaining(prev => Math.max(0, prev - Math.ceil(step.delay / 1000)));
          
          if (step.progress === 100) {
            setGenerationStatus('succeeded');
            setIsGenerating(false);
            setShowResults(true);
            setRemainingCredits(prev => Math.max(0, prev - 1));
            toast.success('아바타 생성이 완료되었습니다! 🎉');
            
            // Navigate to results section
            setTimeout(() => {
              document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
            }, 1000);
          }
          
          currentStepIndex++;
          processStep();
        }, step.delay);
      }
    };
    
    processStep();
  };

  const handleRegenerate = async () => {
    if (selectedPet) {
      startDemo(selectedPet);
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
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {samplePets.map((pet, index) => (
              <Card 
                key={pet.id}
                className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-glow bg-tech-bg/50 border-tech-accent/20 animate-scale-in"
                style={{animationDelay: `${index * 0.1}s`}}
                onClick={() => startDemo(pet.id)}
              >
                <div className="p-4">
                  <div className="aspect-square rounded-lg overflow-hidden mb-4 relative">
                    <img 
                      src={pet.image} 
                      alt={pet.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-primary/0 group-hover:bg-gradient-primary/20 transition-all duration-300 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 text-white font-semibold text-lg transition-opacity duration-300">
                        체험하기 ✨
                      </span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-tech-foreground">{pet.name}</h3>
                  <p className="text-tech-foreground/60 text-sm">{pet.type}</p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 bg-tech-bg/50 border-tech-accent/20 animate-scale-in">
              <div className="text-center space-y-6">
                <div className="w-24 h-24 mx-auto bg-gradient-primary rounded-full flex items-center justify-center animate-pulse-glow">
                  <span className="text-2xl">🎨</span>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-tech-foreground mb-2">
                    AI가 열심히 그림 그리는 중...
                  </h3>
                  <p className="text-tech-foreground/80">
                    약 {timeRemaining}초 남음 • {Math.round(progress)}% 완료
                  </p>
                </div>

                <ProgressBar
                  progress={progress}
                  status={generationStatus}
                  currentStep={currentStep}
                  className="text-tech-foreground"
                />
                
                <div className="grid grid-cols-3 gap-4 text-sm text-tech-foreground/60">
                  <div className={progress > 20 ? 'text-tech-accent' : ''}>
                    📸 이미지 분석중
                  </div>
                  <div className={progress > 60 ? 'text-tech-accent' : ''}>
                    🎭 스타일 적용중
                  </div>
                  <div className={progress > 90 ? 'text-tech-accent' : ''}>
                    ✨ 마법 완성중
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Credit Warning & Regenerate Button */}
        {showResults && (
          <div className="text-center mt-8 space-y-4">
            <div className="inline-flex items-center space-x-4">
              <RegenerateButton
                onRegenerate={handleRegenerate}
                remainingCredits={remainingCredits}
                disabled={isGenerating}
              />
              <div className="text-tech-foreground/60 text-sm">
                남은 체험 횟수: <span className="font-bold text-tech-accent">{remainingCredits}회</span>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <p className="text-tech-foreground/60 text-sm">
            💡 실제 서비스에서는 고해상도 이미지 4-8장을 생성해드립니다
          </p>
        </div>
      </div>
    </section>
  );
};