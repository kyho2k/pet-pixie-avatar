import { useEffect, useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface SocketProgress {
  jobId: string;
  progress: number;
  status: 'starting' | 'meshy_processing' | 'lightx_processing' | 'succeeded' | 'failed';
  phase: 'meshy' | 'lightx' | 'completed';
  currentStep?: string;
  timeRemaining?: number;
  meshyModel?: string;
  cartoonResults?: Array<{
    style: string;
    imageUrl: string;
    thumbnail: string;
  }>;
}

export const useJobProgress = (jobId: string | null) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'starting' | 'meshy_processing' | 'lightx_processing' | 'succeeded' | 'failed'>('starting');
  const [phase, setPhase] = useState<'meshy' | 'lightx' | 'completed'>('meshy');
  const [currentStep, setCurrentStep] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState<number>(65);
  const [meshyModel, setMeshyModel] = useState<string>('');
  const [cartoonResults, setCartoonResults] = useState<Array<{style: string; imageUrl: string; thumbnail: string}>>([]);
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
    setTimeRemaining(65);
    setMeshyModel('');
    setCartoonResults([]);
    setIsConnected(true);

    // Updated 2-phase pipeline steps (Meshy + LightX)
    const steps: Array<{
      minProgress: number;
      maxProgress: number;
      step: string;
      duration: number;
      phase: 'meshy' | 'lightx';
    }> = [
      { minProgress: 0, maxProgress: 50, step: '3D 모델 생성 중... (Meshy AI)', duration: 25000, phase: 'meshy' },
      { minProgress: 50, maxProgress: 100, step: '캐릭터 스타일 적용 중... (LightX AI)', duration: 40000, phase: 'lightx' }
    ];

    let currentStepIndex = 0;
    let currentStepStartTime = Date.now();

    intervalRef.current = setInterval(() => {
      if (!startTimeRef.current) return;

      const elapsed = Date.now() - startTimeRef.current;
      const totalDuration = 65000; // 65 seconds total (25s Meshy + 40s LightX)
      
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
      } else if (overallProgress < 100) {
        setStatus('lightx_processing');
        // 3D model becomes available
        if (!meshyModel) {
          setMeshyModel('/api/placeholder/3d-model.glb');
        }
      } else {
        setStatus('succeeded');
        setPhase('completed');
        setCurrentStep('완성! 🎉');
        setIsConnected(false);
        
        // Set cartoon results
        setCartoonResults([
          { 
            style: 'disney', 
            imageUrl: '/api/placeholder/400/400?style=disney',
            thumbnail: '/api/placeholder/200/200?style=disney'
          },
          { 
            style: 'anime', 
            imageUrl: '/api/placeholder/400/450?style=anime',
            thumbnail: '/api/placeholder/200/225?style=anime'
          },
          { 
            style: 'pixar', 
            imageUrl: '/api/placeholder/400/380?style=pixar',
            thumbnail: '/api/placeholder/200/190?style=pixar'
          }
        ]);
        
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        
        toast.success('3D 모델과 캐릭터가 생성되었습니다! 🎉');
      }
    }, 200); // Update every 200ms for smooth animation

    // Cleanup after 70 seconds (buffer time)
    setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsConnected(false);
    }, 70000);

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
    cartoonResults,
    isConnected
  };
};