import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface UserQuota {
  daily: {
    limit: number;
    used: number;
    remaining: number;
  };
  monthly: {
    limit: number;
    used: number;
    remaining: number;
  };
  lastReset: Date;
}

export const useUserQuota = () => {
  const [quota, setQuota] = useState<UserQuota>({
    daily: { limit: 3, used: 0, remaining: 3 },
    monthly: { limit: 50, used: 0, remaining: 50 },
    lastReset: new Date()
  });

  const [isLoading, setIsLoading] = useState(false);

  // Load quota from localStorage on mount
  useEffect(() => {
    const savedQuota = localStorage.getItem('userQuota');
    if (savedQuota) {
      try {
        const parsed = JSON.parse(savedQuota);
        const lastReset = new Date(parsed.lastReset);
        const now = new Date();
        
        // Reset daily quota if it's a new day
        if (now.toDateString() !== lastReset.toDateString()) {
          setQuota(prev => ({
            ...parsed,
            daily: { ...prev.daily, used: 0, remaining: prev.daily.limit },
            lastReset: now
          }));
        } else {
          setQuota({ ...parsed, lastReset });
        }
      } catch (error) {
        console.error('Failed to parse saved quota:', error);
      }
    }
  }, []);

  // Save quota to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userQuota', JSON.stringify(quota));
  }, [quota]);

  const checkQuota = (type: 'daily' | 'monthly' = 'daily'): boolean => {
    const currentQuota = quota[type];
    
    if (currentQuota.remaining <= 0) {
      const resetTime = type === 'daily' ? '내일 자정' : '다음 달';
      toast.error(
        `${type === 'daily' ? '일일' : '월간'} 사용 한도를 모두 사용했습니다. ${resetTime}에 초기화됩니다.`,
        {
          duration: 5000,
          action: {
            label: '프리미엄 플랜 보기',
            onClick: () => {
              // Navigate to pricing page
              window.scrollTo({ top: 0, behavior: 'smooth' });
              toast.info('프리미엄 플랜으로 업그레이드하면 무제한으로 사용할 수 있어요! 🚀');
            }
          }
        }
      );
      return false;
    }

    // Warning when quota is low
    if (currentQuota.remaining <= 1) {
      toast.warning(
        `${type === 'daily' ? '오늘' : '이번 달'} 남은 사용 횟수: ${currentQuota.remaining}회`,
        {
          duration: 3000
        }
      );
    }

    return true;
  };

  const consumeQuota = (amount: number = 1): boolean => {
    if (!checkQuota('daily')) return false;
    
    setQuota(prev => ({
      ...prev,
      daily: {
        ...prev.daily,
        used: prev.daily.used + amount,
        remaining: Math.max(0, prev.daily.remaining - amount)
      },
      monthly: {
        ...prev.monthly,
        used: prev.monthly.used + amount,
        remaining: Math.max(0, prev.monthly.remaining - amount)
      }
    }));

    // Success message with remaining count
    const remainingAfter = quota.daily.remaining - amount;
    if (remainingAfter > 0) {
      toast.success(
        `AI 아바타 생성을 시작했습니다! 오늘 ${remainingAfter}회 더 사용 가능해요. 🎨`,
        { duration: 3000 }
      );
    } else {
      toast.success(
        'AI 아바타 생성을 시작했습니다! 오늘 사용 한도를 모두 사용했어요. 🎨',
        { duration: 4000 }
      );
    }

    return true;
  };

  const resetDailyQuota = () => {
    setQuota(prev => ({
      ...prev,
      daily: { ...prev.daily, used: 0, remaining: prev.daily.limit },
      lastReset: new Date()
    }));
  };

  const upgradeQuota = (newDailyLimit: number, newMonthlyLimit: number) => {
    setQuota(prev => ({
      ...prev,
      daily: { ...prev.daily, limit: newDailyLimit, remaining: newDailyLimit - prev.daily.used },
      monthly: { ...prev.monthly, limit: newMonthlyLimit, remaining: newMonthlyLimit - prev.monthly.used }
    }));
    
    toast.success('플랜이 업그레이드되었습니다! 🎉');
  };

  return {
    quota,
    isLoading,
    checkQuota,
    consumeQuota,
    resetDailyQuota,
    upgradeQuota
  };
};