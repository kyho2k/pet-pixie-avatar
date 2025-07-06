import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

interface GenerateRequest {
  imageUrl: string;
  styles: string[];
}

interface GenerateResponse {
  jobId: string;
  status: 'starting' | 'meshy_processing' | 'render_processing' | 'cartoon_processing' | 'succeeded' | 'failed';
  phase: 'meshy' | 'render' | 'cartoon' | 'completed';
  progress?: number;
  meshyModel?: string; // GLB URL
  output?: string[];
  error?: string;
}

interface JobStatus {
  id: string;
  status: 'starting' | 'meshy_processing' | 'render_processing' | 'cartoon_processing' | 'succeeded' | 'failed';
  phase: 'meshy' | 'render' | 'cartoon' | 'completed';
  progress: number;
  meshyModel?: string;
  output?: string[];
  error?: string;
  created_at: string;
  completed_at?: string;
}

// Simulate API call for demo
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

// Simulate job status polling
const simulateJobStatus = async (jobId: string): Promise<JobStatus> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock progressive status based on job age - 2-phase pipeline
  const createdTime = parseInt(jobId.split('_')[1]);
  const elapsed = Date.now() - createdTime;
  
  let status: JobStatus['status'] = 'starting';
  let phase: JobStatus['phase'] = 'meshy';
  let progress = 0;
  let meshyModel: string | undefined;
  let output: string[] | undefined;
  
  if (elapsed > 90000) { // 90s - completed
    status = 'succeeded';
    phase = 'completed';
    progress = 100;
    meshyModel = '/api/placeholder/3d-model.glb';
    output = [
      '/api/placeholder/400/400?style=disney',
      '/api/placeholder/400/450?style=anime', 
      '/api/placeholder/400/380?style=fantasy'
    ];
  } else if (elapsed > 60000) { // 60-90s - cartoon processing
    status = 'cartoon_processing';
    phase = 'cartoon';
    progress = 70 + Math.floor((elapsed - 60000) / 1000);
    meshyModel = '/api/placeholder/3d-model.glb';
  } else if (elapsed > 50000) { // 50-60s - render processing
    status = 'render_processing';
    phase = 'render';
    progress = 60 + Math.floor((elapsed - 50000) / 1000);
    meshyModel = '/api/placeholder/3d-model.glb';
  } else if (elapsed > 5000) { // 5-50s - meshy processing
    status = 'meshy_processing';
    phase = 'meshy';
    progress = 10 + Math.floor((elapsed - 5000) / 1125); // 45s for meshy
  }
  
  return {
    id: jobId,
    status,
    phase,
    progress: Math.min(progress, 100),
    meshyModel,
    output,
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