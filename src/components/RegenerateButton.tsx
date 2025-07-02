import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface RegenerateButtonProps {
  onRegenerate: () => Promise<void>;
  remainingCredits?: number;
  disabled?: boolean;
}

export const RegenerateButton = ({ 
  onRegenerate, 
  remainingCredits = 3,
  disabled = false 
}: RegenerateButtonProps) => {
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerate = async () => {
    if (remainingCredits <= 0) {
      toast.error('오늘의 생성 한도를 모두 사용했습니다!');
      return;
    }

    setIsRegenerating(true);
    try {
      await onRegenerate();
      toast.success('새로운 아바타를 생성 중입니다!');
    } catch (error) {
      toast.error('재생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsRegenerating(false);
    }
  };

  const getButtonText = () => {
    if (isRegenerating) return '생성 중...';
    if (remainingCredits <= 0) return '한도 초과';
    return '🎲 다시 생성하기';
  };

  const isButtonDisabled = disabled || isRegenerating || remainingCredits <= 0;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          disabled={isButtonDisabled}
          className="border-primary text-primary hover:bg-primary/10 transition-all duration-300"
        >
          {getButtonText()}
        </Button>
      </AlertDialogTrigger>
      
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center space-x-2">
            <span>🎲</span>
            <span>새로운 아바타 생성</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              같은 이미지로 다른 스타일의 아바타를 생성합니다.
            </p>
            <div className="bg-accent/20 p-3 rounded-lg">
              <p className="text-sm font-medium text-accent-foreground">
                💡 남은 생성 횟수: <span className="font-bold">{remainingCredits}회</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                매일 자정에 3회로 초기화됩니다
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="bg-gradient-primary"
          >
            {isRegenerating ? '생성 중...' : '생성하기'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};