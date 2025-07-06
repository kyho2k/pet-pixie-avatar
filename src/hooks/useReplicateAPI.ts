import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

interface GenerateRequest {
  imageUrl: string;
  styles: string[];
  customization?: {
    backgroundColor?: string;
    accessories?: string[];
  };
}

interface GenerateResponse {
  jobId: string;
  status: 'starting' | 'meshy_processing' | 'lightx_processing' | 'succeeded' | 'failed';
  phase: 'meshy' | 'lightx' | 'completed';
  progress?: number;
  meshyModel?: string; // GLB URL
  cartoonResults?: Array<{
    style: string;
    imageUrl: string;
    thumbnail: string;
  }>;
  error?: string;
}

interface JobStatus {
  id: string;
  status: 'starting' | 'meshy_processing' | 'lightx_processing' | 'succeeded' | 'failed';
  phase: 'meshy' | 'lightx' | 'completed';
  progress: number;
  meshyModel?: string;
  cartoonResults?: Array<{
    style: string;
    imageUrl: string;
    thumbnail: string;
  }>;
  error?: string;
  created_at: string;
  completed_at?: string;
}

// Simulate Meshy + LightX API pipeline
const simulateGenerate = async (request: GenerateRequest): Promise<GenerateResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    jobId: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    status: 'starting',
    phase: 'meshy',
    progress: 0
  };
};

// Simulate job status polling - Meshy + LightX pipeline
const simulateJobStatus = async (jobId: string): Promise<JobStatus> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock progressive status based on job age - 2-phase pipeline (Meshy + LightX)
  const createdTime = parseInt(jobId.split('_')[1]);
  const elapsed = Date.now() - createdTime;
  
  let status: JobStatus['status'] = 'starting';
  let phase: JobStatus['phase'] = 'meshy';
  let progress = 0;
  let meshyModel: string | undefined;
  let cartoonResults: Array<{style: string; imageUrl: string; thumbnail: string}> | undefined;
  
  if (elapsed > 65000) { // 65s - completed (Meshy 25s + LightX 40s)
    status = 'succeeded';
    phase = 'completed';
    progress = 100;
    meshyModel = '/api/placeholder/3d-model.glb';
    cartoonResults = [
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
    ];
  } else if (elapsed > 25000) { // 25-65s - LightX processing
    status = 'lightx_processing';
    phase = 'lightx';
    progress = 50 + Math.floor((elapsed - 25000) / 800); // 40s for LightX
    meshyModel = '/api/placeholder/3d-model.glb';
  } else if (elapsed > 5000) { // 5-25s - Meshy processing  
    status = 'meshy_processing';
    phase = 'meshy';
    progress = 10 + Math.floor((elapsed - 5000) / 500); // 20s for Meshy
  }
  
  return {
    id: jobId,
    status,
    phase,
    progress: Math.min(progress, 100),
    meshyModel,
    cartoonResults,
    created_at: new Date(createdTime).toISOString(),
    completed_at: status === 'succeeded' ? new Date().toISOString() : undefined
  };
};

export const useGenerateAvatar = () => {
  return useMutation({
    mutationFn: simulateGenerate,
    onSuccess: (data) => {
      toast.success('AI 아바타 생성을 시작했습니다! 🎨');
    },
    onError: (error) => {
      toast.error('생성 요청에 실패했습니다. 다시 시도해주세요.');
      console.error('Generate error:', error);
    }
  });
};

export const useJobStatus = (jobId: string | null, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['job-status', jobId],
    queryFn: () => simulateJobStatus(jobId!),
    enabled: enabled && !!jobId,
    refetchInterval: (query) => {
      // Stop polling if job is completed or failed
      if (query.state.data?.status === 'succeeded' || query.state.data?.status === 'failed') {
        return false;
      }
      return 2000; // Poll every 2 seconds
    },
    retry: 3,
    retryDelay: 1000
  });
};