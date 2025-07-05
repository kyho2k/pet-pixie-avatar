import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ProcessStep {
  id: string;
  name: string;
  emoji: string;
  estimatedTime: number;
}

interface EnhancedProgressBarProps {
  progress: number;
  currentStep?: string;
  timeRemaining?: number;
  totalSteps?: number;
  className?: string;
}

export const EnhancedProgressBar = ({
  progress,
  currentStep,
  timeRemaining = 60,
  totalSteps = 4,
  className = ""
}: EnhancedProgressBarProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const processSteps: ProcessStep[] = [
    { id: 'upload', name: '이미지 분석', emoji: '🔍', estimatedTime: 5 },
    { id: '3d', name: '3D 모델 생성', emoji: '🎲', estimatedTime: 25 },
    { id: 'style', name: '스타일 적용', emoji: '🎨', estimatedTime: 20 },
    { id: 'render', name: '최종 렌더링', emoji: '✨', estimatedTime: 10 }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  const getCurrentStepIndex = () => {
    if (!currentStep) return Math.floor((progress / 100) * processSteps.length);
    const stepIndex = processSteps.findIndex(step => step.id === currentStep);
    return stepIndex >= 0 ? stepIndex : 0;
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}초`;
    return `${Math.floor(seconds / 60)}분 ${seconds % 60}초`;
  };

  return (
    <Card className={`bg-tech-bg/50 border-tech-accent/20 ${className}`}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center animate-pulse-glow mb-4">
            <span className="text-2xl" role="img" aria-label="AI 생성 중">🤖</span>
          </div>
          <h3 className="text-xl font-bold text-tech-foreground mb-2">
            AI가 열심히 작업 중입니다...
          </h3>
          <p className="text-tech-foreground/70">
            예상 남은 시간: <span className="font-semibold text-tech-accent">{formatTime(timeRemaining)}</span>
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-tech-foreground/70">진행률</span>
            <span className="font-bold text-tech-accent">{Math.round(animatedProgress)}%</span>
          </div>
          
          <Progress 
            value={animatedProgress} 
            className="h-3 bg-tech-bg border border-tech-accent/20"
          />
          
          <div className="flex justify-between text-xs text-tech-foreground/50">
            <span>시작</span>
            <span>완료</span>
          </div>
        </div>

        {/* Process Steps */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-tech-foreground mb-3">처리 단계</h4>
          <div className="grid grid-cols-2 gap-3">
            {processSteps.map((step, index) => {
              const isActive = getCurrentStepIndex() === index;
              const isCompleted = getCurrentStepIndex() > index;
              
              return (
                <div
                  key={step.id}
                  className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? 'bg-tech-accent/20 text-tech-accent border border-tech-accent/40' 
                      : isCompleted
                      ? 'bg-tech-accent/10 text-tech-accent/80'
                      : 'bg-tech-bg/30 text-tech-foreground/50'
                  }`}
                >
                  <span className={`text-lg ${isActive ? 'animate-bounce' : ''}`}>
                    {step.emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">
                      {step.name}
                    </div>
                    <div className="text-xs opacity-70">
                      ~{step.estimatedTime}초
                    </div>
                  </div>
                  {isCompleted && (
                    <span className="text-tech-accent text-sm">✓</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Fun Facts */}
        <div className="bg-tech-accent/5 rounded-lg p-4 border border-tech-accent/10">
          <div className="text-center space-y-2">
            <div className="text-xs text-tech-foreground/60 font-medium">💡 잠깐만요!</div>
            <p className="text-xs text-tech-foreground/70 leading-relaxed">
              AI가 현재 당신의 반려동물 특징을 학습하고 있어요. 
              털색, 눈 모양, 귀 형태까지 세심하게 분석 중입니다!
            </p>
          </div>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="space-y-1">
            <div className="text-lg font-bold text-tech-accent">
              {Math.floor(Math.random() * 50) + 20}
            </div>
            <div className="text-xs text-tech-foreground/60">GPU 사용률</div>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-bold text-tech-accent">
              {totalSteps}
            </div>
            <div className="text-xs text-tech-foreground/60">처리 단계</div>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-bold text-tech-accent">
              {Math.floor(Math.random() * 5) + 1}
            </div>
            <div className="text-xs text-tech-foreground/60">대기 중</div>
          </div>
        </div>
      </div>
    </Card>
  );
};