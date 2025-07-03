import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import CountUp from 'react-countup';

interface CrowdfundingData {
  goalAmount: number;
  currentAmount: number;
  backerCount: number;
  daysRemaining: number;
  achievementRate: number;
  recentBackers: string[];
}

interface RewardTier {
  id: string;
  title: string;
  price: number;
  description: string;
  items: string[];
  backerCount: number;
  isPopular?: boolean;
}

export const CrowdfundingWidget = () => {
  const [fundingData, setFundingData] = useState<CrowdfundingData>({
    goalAmount: 50000000, // 5천만원
    currentAmount: 32740000, // 3천2백74만원
    backerCount: 1247,
    daysRemaining: 18,
    achievementRate: 0,
    recentBackers: ['김*진', '박*영', '이*수', '최*희', '정*민']
  });

  const rewardTiers: RewardTier[] = [
    {
      id: 'basic',
      title: '얼리버드 기본팩',
      price: 29000,
      description: 'AI 아바타 3장 + 디지털 파일',
      items: ['AI 아바타 3장', '고해상도 PNG 파일', '상업적 이용 가능'],
      backerCount: 487,
    },
    {
      id: 'premium',
      title: '프리미엄 굿즈팩',
      price: 59000,
      description: 'AI 아바타 + 굿즈 3종 세트',
      items: ['AI 아바타 5장', '커스텀 머그컵', '폰케이스', '스티커팩'],
      backerCount: 342,
      isPopular: true
    },
    {
      id: 'deluxe',
      title: '디럭스 콜렉션',
      price: 99000,
      description: '풀패키지 + 한정판 아트북',
      items: ['AI 아바타 10장', '굿즈 5종', '한정판 아트북', 'NFT 인증서'],
      backerCount: 156,
    }
  ];

  useEffect(() => {
    // Calculate achievement rate
    const rate = (fundingData.currentAmount / fundingData.goalAmount) * 100;
    setFundingData(prev => ({ ...prev, achievementRate: rate }));

    // Simulate real-time updates
    const interval = setInterval(() => {
      setFundingData(prev => ({
        ...prev,
        currentAmount: prev.currentAmount + Math.floor(Math.random() * 50000),
        backerCount: prev.backerCount + Math.floor(Math.random() * 3),
      }));
    }, 45000); // Update every 45 seconds

    return () => clearInterval(interval);
  }, [fundingData.goalAmount]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <section className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-primary text-white px-4 py-2 rounded-full mb-4">
            <span>🚀</span>
            <span className="font-semibold">크라우드펀딩 진행 중</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            AI Pet Avatar 서비스를
            <span className="text-primary"> 함께 만들어가요!</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            더 많은 스타일과 굿즈 옵션을 제공하기 위해 여러분의 지원이 필요해요
          </p>
        </div>

        {/* Main Funding Progress */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="p-8 bg-white shadow-card">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Progress Section */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-baseline space-x-2 mb-2">
                    <span className="text-3xl font-bold text-primary">
                      <CountUp
                        end={fundingData.achievementRate}
                        duration={2}
                        decimals={1}
                        suffix="%"
                      />
                    </span>
                    <span className="text-muted-foreground">달성</span>
                  </div>
                  
                  <Progress 
                    value={fundingData.achievementRate} 
                    className="h-4 bg-secondary"
                  />
                  
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>
                      <CountUp
                        end={fundingData.currentAmount}
                        duration={2}
                        separator=","
                        prefix="₩"
                      />
                    </span>
                    <span>{formatCurrency(fundingData.goalAmount)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      <CountUp
                        end={fundingData.backerCount}
                        duration={2}
                        separator=","
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">후원자</div>
                  </div>
                  
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {fundingData.daysRemaining}
                    </div>
                    <div className="text-sm text-muted-foreground">일 남음</div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">최근 후원자</h3>
                <div className="space-y-2">
                  {fundingData.recentBackers.map((backer, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 bg-muted/20 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {backer[0]}
                      </div>
                      <span className="text-sm">{backer}님이 후원했습니다</span>
                      <div className="ml-auto text-xs text-muted-foreground">
                        {Math.floor(Math.random() * 30 + 1)}분 전
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Reward Tiers */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">리워드 선택</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {rewardTiers.map((reward) => (
              <Card 
                key={reward.id} 
                className={`p-6 transition-all duration-300 hover:scale-105 hover:shadow-card ${
                  reward.isPopular ? 'ring-2 ring-primary bg-primary/5' : 'bg-white'
                }`}
              >
                {reward.isPopular && (
                  <div className="text-center mb-4">
                    <span className="inline-block bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                      ⭐ 인기
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-4">
                  <h4 className="font-bold text-lg mb-2">{reward.title}</h4>
                  <div className="text-2xl font-bold text-primary mb-2">
                    {formatCurrency(reward.price)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {reward.description}
                  </p>
                </div>

                <div className="space-y-2 mb-6">
                  {reward.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <span className="text-primary">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="text-center space-y-4">
                  <div className="text-sm text-muted-foreground">
                    {reward.backerCount}명이 선택
                  </div>
                  
                  <Button 
                    className={`w-full ${
                      reward.isPopular 
                        ? 'bg-gradient-primary' 
                        : 'bg-gradient-primary'
                    }`}
                    onClick={() => {
                      window.open('https://wadiz.kr', '_blank');
                    }}
                  >
                    {reward.isPopular ? '🔥 ' : ''}후원하기
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground text-sm mb-4">
            💝 더 많은 리워드와 상세 정보는 크라우드펀딩 페이지에서 확인하세요
          </p>
          <Button 
            variant="outline"
            size="lg"
            onClick={() => window.open('https://wadiz.kr', '_blank')}
            className="border-primary text-primary hover:bg-primary/10"
          >
            📱 와디즈에서 자세히 보기
          </Button>
        </div>
      </div>
    </section>
  );
};