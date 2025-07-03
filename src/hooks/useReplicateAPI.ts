import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

interface GenerateRequest {
  imageUrl: string;
  prompt: string;
  num_outputs?: number;
}

interface GenerateResponse {
  jobId: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed';
  progress?: number;
  output?: string[];
  error?: string;
}

interface JobStatus {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed';
  progress: number;
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
    progress: 0
  };
};

// Simulate job status polling
const simulateJobStatus = async (jobId: string): Promise<JobStatus> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock progressive status based on job age
  const createdTime = parseInt(jobId.split('_')[1]);
  const elapsed = Date.now() - createdTime;
  
  let status: JobStatus['status'] = 'starting';
  let progress = 0;
  let output: string[] | undefined;
  
  if (elapsed > 60000) { // 1 minute - completed
    status = 'succeeded';
    progress = 100;
    output = [
      '/api/placeholder/400/400',
      '/api/placeholder/400/450', 
      '/api/placeholder/400/380'
    ];
  } else if (elapsed > 45000) { // 45s - final rendering
    status = 'processing';
    progress = 90 + Math.floor((elapsed - 45000) / 1500);
  } else if (elapsed > 30000) { // 30s - style application
    status = 'processing';
    progress = 70 + Math.floor((elapsed - 30000) / 750);
  } else if (elapsed > 15000) { // 15s - analysis
    status = 'processing';
    progress = 30 + Math.floor((elapsed - 15000) / 375);
  } else if (elapsed > 5000) { // 5s - starting
    status = 'processing';
    progress = 10 + Math.floor((elapsed - 5000) / 500);
  }
  
  return {
    id: jobId,
    status,
    progress: Math.min(progress, 100),
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