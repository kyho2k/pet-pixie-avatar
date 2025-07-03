import { useEffect, useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface SocketProgress {
  jobId: string;
  progress: number;
  status: 'starting' | 'processing' | 'succeeded' | 'failed';
  currentStep?: string;
  timeRemaining?: number;
}

export const useJobProgress = (jobId: string | null) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'starting' | 'processing' | 'succeeded' | 'failed'>('starting');
  const [currentStep, setCurrentStep] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState<number>(60);
  const [isConnected, setIsConnected] = useState(false);
  
  // Simulate WebSocket connection for demo
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const startSimulation = useCallback((jobId: string) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    startTimeRef.current = Date.now();
    setProgress(0);
    setStatus('starting');
    setCurrentStep('AI가 이미지를 분석하고 있어요...');
    setTimeRemaining(60);
    setIsConnected(true);

    const steps = [
      { minProgress: 0, maxProgress: 20, step: '펫 얼굴 인식 중...', duration: 8000 },
      { minProgress: 20, maxProgress: 40, step: 'AI 스타일 분석 중...', duration: 12000 },
      { minProgress: 40, maxProgress: 70, step: '판타지 아바타 생성 중...', duration: 20000 },
      { minProgress: 70, maxProgress: 90, step: '고품질 렌더링 중...', duration: 15000 },
      { minProgress: 90, maxProgress: 100, step: '최종 보정 중...', duration: 5000 }
    ];

    let currentStepIndex = 0;
    let currentStepStartTime = Date.now();

    intervalRef.current = setInterval(() => {
      if (!startTimeRef.current) return;

      const elapsed = Date.now() - startTimeRef.current;
      const totalDuration = 60000; // 60 seconds total
      
      // Calculate overall progress
      const overallProgress = Math.min((elapsed / totalDuration) * 100, 100);
      
      // Update current step based on progress
      const currentStep = steps[currentStepIndex];
      if (overallProgress >= currentStep.maxProgress && currentStepIndex < steps.length - 1) {
        currentStepIndex++;
        currentStepStartTime = Date.now();
      }
      
      setProgress(overallProgress);
      setCurrentStep(steps[currentStepIndex].step);
      setTimeRemaining(Math.max(0, Math.ceil((totalDuration - elapsed) / 1000)));

      if (overallProgress < 100) {
        setStatus('processing');
      } else {
        setStatus('succeeded');
        setCurrentStep('완성!');
        setIsConnected(false);
        
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        
        toast.success('아바타 생성이 완료되었습니다! 🎉');
      }
    }, 200); // Update every 200ms for smooth animation

    // Cleanup after 65 seconds (buffer time)
    setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsConnected(false);
    }, 65000);

  }, []);

  const stopSimulation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsConnected(false);
    startTimeRef.current = null;
  }, []);

  // Start simulation when jobId is provided
  useEffect(() => {
    if (jobId) {
      startSimulation(jobId);
    } else {
      stopSimulation();
    }

    return () => {
      stopSimulation();
    };
  }, [jobId, startSimulation, stopSimulation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSimulation();
    };
  }, [stopSimulation]);

  return {
    progress,
    status,
    currentStep,
    timeRemaining,
    isConnected
  };
};