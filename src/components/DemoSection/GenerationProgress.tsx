import { EnhancedProgressBar } from '@/components/EnhancedProgressBar';

interface GenerationProgressProps {
  progress: number;
  currentStep: string;
  timeRemaining: number;
}

export const GenerationProgress = ({
  progress,
  currentStep,
  timeRemaining
}: GenerationProgressProps) => {
  return (
    <div className="max-w-2xl mx-auto">
      <EnhancedProgressBar
        progress={progress}
        currentStep={currentStep}
        timeRemaining={timeRemaining}
        className="animate-scale-in"
      />
    </div>
  );
};