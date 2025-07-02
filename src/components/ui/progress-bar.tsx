import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  progress: number;
  status: 'starting' | 'processing' | 'succeeded' | 'failed';
  currentStep?: string;
  className?: string;
}

export const ProgressBar = ({ progress, status, currentStep, className }: ProgressBarProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'succeeded':
        return 'text-success';
      case 'failed':
        return 'text-destructive';
      case 'processing':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'succeeded':
        return '✅';
      case 'failed':
        return '❌';
      case 'processing':
        return '🎨';
      default:
        return '⏳';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'succeeded':
        return '변환 완료!';
      case 'failed':
        return '변환 실패';
      case 'processing':
        return currentStep || 'AI가 열심히 작업 중...';
      default:
        return '변환 시작 중...';
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div className={cn("flex items-center space-x-2", getStatusColor())}>
          <span className="text-lg">{getStatusIcon()}</span>
          <span className="font-medium">{getStatusText()}</span>
        </div>
        <span className="text-sm font-semibold text-primary">{Math.round(progress)}%</span>
      </div>
      
      <Progress 
        value={progress} 
        className="h-3 bg-secondary"
      />
      
      {currentStep && status === 'processing' && (
        <p className="text-xs text-muted-foreground">
          💡 팁: 고품질 결과를 위해 AI가 여러 단계로 처리합니다
        </p>
      )}
    </div>
  );
};