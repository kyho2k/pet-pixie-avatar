import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import CountUp from 'react-countup';

interface ServiceMetrics {
  dailyGenerated: number;
  averageProcessTime: number;
  currentQueue: number;
  totalUsers: number;
}

export const ServiceMetrics = () => {
  const [metrics, setMetrics] = useState<ServiceMetrics>({
    dailyGenerated: 0,
    averageProcessTime: 0,
    currentQueue: 0,
    totalUsers: 0
  });

  const [isVisible, setIsVisible] = useState(false);

  // Simulate real-time metrics updates
  useEffect(() => {
    // Initial data load
    const loadInitialMetrics = () => {
      setMetrics({
        dailyGenerated: 247,
        averageProcessTime: 58,
        currentQueue: Math.floor(Math.random() * 5) + 1,
        totalUsers: 1847
      });
      setIsVisible(true);
    };

    loadInitialMetrics();

    // Update metrics every 30 seconds
    const interval = setInterval(() => {
      setMetrics(prev => ({
        dailyGenerated: prev.dailyGenerated + Math.floor(Math.random() * 3),
        averageProcessTime: 55 + Math.floor(Math.random() * 10), // 55-65 seconds
        currentQueue: Math.floor(Math.random() * 8),
        totalUsers: prev.totalUsers + Math.floor(Math.random() * 2)
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <section className="py-12 bg-tech-bg">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-tech-foreground mb-2">
            📊 실시간 서비스 현황
          </h3>
          <p className="text-tech-foreground/70">
            지금 이 순간에도 AI가 열심히 그림을 그리고 있어요!
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <Card className="p-6 bg-tech-bg/80 border-tech-accent/20 text-center group hover:scale-105 transition-transform duration-300">
            <div className="space-y-2">
              <div className="text-3xl font-mono font-bold text-tech-accent">
                <CountUp
                  end={metrics.dailyGenerated}
                  duration={2}
                  separator=","
                />
              </div>
              <div className="text-tech-foreground/80 text-sm font-medium">
                🎨 오늘 생성된 아바타
              </div>
              <div className="w-8 h-1 bg-tech-accent/50 mx-auto rounded-full">
                <div className="w-full h-full bg-tech-accent rounded-full animate-pulse"></div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-tech-bg/80 border-tech-accent/20 text-center group hover:scale-105 transition-transform duration-300">
            <div className="space-y-2">
              <div className="text-3xl font-mono font-bold text-tech-accent">
                <CountUp
                  end={metrics.averageProcessTime}
                  duration={2}
                  suffix="초"
                />
              </div>
              <div className="text-tech-foreground/80 text-sm font-medium">
                ⚡ 평균 처리 시간
              </div>
              <div className="w-8 h-1 bg-tech-accent/50 mx-auto rounded-full">
                <div className="w-2/3 h-full bg-tech-accent rounded-full"></div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-tech-bg/80 border-tech-accent/20 text-center group hover:scale-105 transition-transform duration-300">
            <div className="space-y-2">
              <div className="text-3xl font-mono font-bold text-tech-glow">
                <CountUp
                  end={metrics.currentQueue}
                  duration={1}
                  suffix="명"
                />
              </div>
              <div className="text-tech-foreground/80 text-sm font-medium">
                ⏳ 현재 대기 중
              </div>
              <div className="w-8 h-1 bg-tech-accent/50 mx-auto rounded-full">
                <div 
                  className="h-full bg-tech-glow rounded-full animate-pulse"
                  style={{ width: `${Math.max(20, (metrics.currentQueue / 10) * 100)}%` }}
                ></div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-tech-bg/80 border-tech-accent/20 text-center group hover:scale-105 transition-transform duration-300">
            <div className="space-y-2">
              <div className="text-3xl font-mono font-bold text-tech-accent">
                <CountUp
                  end={metrics.totalUsers}
                  duration={2}
                  separator=","
                  suffix="+"
                />
              </div>
              <div className="text-tech-foreground/80 text-sm font-medium">
                👥 누적 사용자
              </div>
              <div className="w-8 h-1 bg-tech-accent/50 mx-auto rounded-full">
                <div className="w-5/6 h-full bg-tech-accent rounded-full"></div>
              </div>
            </div>
          </Card>
        </div>

        <div className="text-center mt-8">
          <div className="inline-flex items-center space-x-2 bg-tech-accent/10 text-tech-accent px-4 py-2 rounded-full text-sm">
            <div className="w-2 h-2 bg-tech-accent rounded-full animate-pulse"></div>
            <span>실시간 업데이트 중</span>
          </div>
        </div>
      </div>
    </section>
  );
};