import { EnhancedProgressBar } from '@/components/EnhancedProgressBar';
import { ModelViewer3D } from '@/components/ModelViewer3D';

interface GenerationProgressProps {
  progress: number;
  currentStep: string;
  timeRemaining: number;
  phase: 'meshy' | 'render' | 'cartoon' | 'completed';
  meshyModel?: string;
}

export const GenerationProgress = ({
  progress,
  currentStep,
  timeRemaining,
  phase,
  meshyModel
}: GenerationProgressProps) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <EnhancedProgressBar
        progress={progress}
        currentStep={currentStep}
        timeRemaining={timeRemaining}
        className="animate-scale-in"
      />
      
      {/* Phase Indicators */}
      <div className="flex justify-center items-center space-x-8">
        <div className={`flex flex-col items-center p-4 rounded-lg transition-all ${
          phase === 'meshy' ? 'bg-tech-accent/20 text-tech-accent' : 
          progress > 50 ? 'bg-green-500/20 text-green-400' : 'bg-tech-bg/50 text-tech-foreground/50'
        }`}>
          <div className="text-2xl mb-2">🎲</div>
          <span className="text-sm font-medium">3D 모델링</span>
        </div>
        
        <div className={`flex flex-col items-center p-4 rounded-lg transition-all ${
          phase === 'render' ? 'bg-tech-accent/20 text-tech-accent' : 
          progress > 60 ? 'bg-green-500/20 text-green-400' : 'bg-tech-bg/50 text-tech-foreground/50'
        }`}>
          <div className="text-2xl mb-2">📷</div>
          <span className="text-sm font-medium">렌더링</span>
        </div>
        
        <div className={`flex flex-col items-center p-4 rounded-lg transition-all ${
          phase === 'cartoon' ? 'bg-tech-accent/20 text-tech-accent' : 
          progress >= 100 ? 'bg-green-500/20 text-green-400' : 'bg-tech-bg/50 text-tech-foreground/50'
        }`}>
          <div className="text-2xl mb-2">✨</div>
          <span className="text-sm font-medium">캐릭터화</span>
        </div>
      </div>

      {/* 3D Model Preview (available after meshy phase) */}
      {meshyModel && progress > 50 && (
        <div className="animate-fade-in">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-tech-foreground mb-2">
              🎉 3D 모델이 생성되었습니다!
            </h3>
            <p className="text-tech-foreground/70">
              마우스로 드래그하여 360도 회전해보세요
            </p>
          </div>
          <ModelViewer3D 
            modelUrl={meshyModel}
            className="max-w-md mx-auto"
          />
        </div>
      )}
    </div>
  );
};