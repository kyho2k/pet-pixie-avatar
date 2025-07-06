import { useEffect, useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface SocketProgress {
  jobId: string;
  progress: number;
  status: 'starting' | 'meshy_processing' | 'render_processing' | 'cartoon_processing' | 'succeeded' | 'failed';
  phase: 'meshy' | 'render' | 'cartoon' | 'completed';
  currentStep?: string;
  timeRemaining?: number;
  meshyModel?: string;
}

export const useJobProgress = (jobId: string | null) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'starting' | 'meshy_processing' | 'render_processing' | 'cartoon_processing' | 'succeeded' | 'failed'>('starting');
  const [phase, setPhase] = useState<'meshy' | 'render' | 'cartoon' | 'completed'>('meshy');
  const [currentStep, setCurrentStep] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState<number>(90);
  const [meshyModel, setMeshyModel] = useState<string>('');
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
    setPhase('meshy');
    setCurrentStep('AI가 3D 모델을 생성하고 있어요...');
    setTimeRemaining(90);
    setMeshyModel('');
    setIsConnected(true);

    // Updated 3-phase pipeline steps
    const steps: Array<{
      minProgress: number;
      maxProgress: number;
      step: string;
      duration: number;
      phase: 'meshy' | 'render' | 'cartoon';
    }> = [
      { minProgress: 0, maxProgress: 50, step: '3D 모델 생성 중... (Meshy AI)', duration: 50000, phase: 'meshy' },
      { minProgress: 50, maxProgress: 60, step: '다중 각도 렌더링 중...', duration: 10000, phase: 'render' },
      { minProgress: 60, maxProgress: 100, step: '캐릭터 스타일 적용 중... (LightX AI)', duration: 30000, phase: 'cartoon' }
    ];

    let currentStepIndex = 0;
    let currentStepStartTime = Date.now();

    intervalRef.current = setInterval(() => {
      if (!startTimeRef.current) return;

      const elapsed = Date.now() - startTimeRef.current;
      const totalDuration = 90000; // 90 seconds total
      
      // Calculate overall progress
      const overallProgress = Math.min((elapsed / totalDuration) * 100, 100);
      
      // Update current step and phase based on progress
      const currentStep = steps.find(step => 
        overallProgress >= step.minProgress && overallProgress < step.maxProgress
      ) || steps[steps.length - 1];
      
      setProgress(overallProgress);
      setCurrentStep(currentStep.step);
      setPhase(currentStep.phase);
      setTimeRemaining(Math.max(0, Math.ceil((totalDuration - elapsed) / 1000)));

      // Update status based on phase
      if (overallProgress < 50) {
        setStatus('meshy_processing');
      } else if (overallProgress < 60) {
        setStatus('render_processing');
        // 3D model becomes available
        if (!meshyModel) {
          setMeshyModel('/api/placeholder/3d-model.glb');
        }
      } else if (overallProgress < 100) {
        setStatus('cartoon_processing');
      } else {
        setStatus('succeeded');
        setPhase('completed');
        setCurrentStep('완성! 🎉');
        setIsConnected(false);
        
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        
        toast.success('3D 모델과 캐릭터가 생성되었습니다! 🎉');
      }
    }, 200); // Update every 200ms for smooth animation

    // Cleanup after 95 seconds (buffer time)
    setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsConnected(false);
    }, 95000);

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
    phase,
    currentStep,
    timeRemaining,
    meshyModel,
    isConnected
  };
};