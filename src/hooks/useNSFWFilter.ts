import { useState, useCallback } from 'react';
import * as nsfwjs from 'nsfwjs';
import { toast } from 'sonner';

interface NSFWResult {
  isNSFW: boolean;
  confidence: number;
  predictions: Array<{
    className: string;
    probability: number;
  }>;
}

export const useNSFWFilter = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState<nsfwjs.NSFWJS | null>(null);

  const loadModel = useCallback(async () => {
    if (model) return model;
    
    try {
      setIsLoading(true);
      const loadedModel = await nsfwjs.load();
      setModel(loadedModel);
      return loadedModel;
    } catch (error) {
      console.error('NSFW 모델 로딩 실패:', error);
      toast.error('NSFW 필터 로딩에 실패했습니다');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [model]);

  const checkImage = useCallback(async (file: File): Promise<NSFWResult | null> => {
    try {
      const nsfwModel = await loadModel();
      if (!nsfwModel) return null;

      // Create image element for prediction
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      return new Promise((resolve) => {
        img.onload = async () => {
          try {
            const predictions = await nsfwModel.classify(img);
            
            // Calculate NSFW probability (sum of Porn, Hentai, Sexy categories)
            const nsfwCategories = ['Porn', 'Hentai', 'Sexy'];
            const nsfwProbability = predictions
              .filter(p => nsfwCategories.includes(p.className))
              .reduce((sum, p) => sum + p.probability, 0);

            const isNSFW = nsfwProbability > 0.7; // 70% threshold
            
            URL.revokeObjectURL(objectUrl);
            
            resolve({
              isNSFW,
              confidence: nsfwProbability,
              predictions
            });
          } catch (error) {
            console.error('NSFW 체크 실패:', error);
            URL.revokeObjectURL(objectUrl);
            resolve(null);
          }
        };
        
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          resolve(null);
        };
        
        img.src = objectUrl;
      });
    } catch (error) {
      console.error('NSFW 체크 오류:', error);
      return null;
    }
  }, [loadModel]);

  return {
    checkImage,
    isLoading,
    loadModel
  };
};