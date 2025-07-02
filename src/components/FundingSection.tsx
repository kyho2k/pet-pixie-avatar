import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface RewardTier {
  id: string;
  amount: number;
  title: string;
  description: string;
  items: string[];
  backers: number;
  limited?: boolean;
  discount?: string;
}

export const FundingSection = () => {
  const [selectedTier, setSelectedTier] = useState<string>('basic');

  const rewardTiers: RewardTier[] = [
    {
      id: 'basic',
      amount: 10000,
      title: 'AI 아바타 기본팩',
      description: '가장 인기 있는 기본 옵션',
      items: ['AI 아바타 이미지 4장', '고해상도 PNG 파일', '웹용 해상도 제공'],
      backers: 89,
    },
    {
      id: 'premium',
      amount: 30000,
      title: '프리미엄 굿즈팩',
      description: '아바타 + 실물 굿즈',
      items: ['AI 아바타 이미지 8장', '고해상도 PNG 파일', '커스텀 머그컵 1개', '스티커팩'],
      backers: 156,
      discount: '25% 할인',
    },
    {
      id: 'deluxe',
      amount: 70000,
      title: '럭셔리 컬렉션',
      description: '모든 굿즈 포함',
      items: ['AI 아바타 이미지 12장', '초고해상도 파일', '티셔츠 + 머그컵', '캔버스 액자', '폰케이스'],
      backers: 42,
      limited: true,
    },
  ];

  const fundingProgress = 80;
  const totalBackers = 287;
  const daysLeft = 15;
  const goalAmount = 10000000;
  const currentAmount = 8000000;

  const openFundingPage = (tierId: string) => {
    // Simulate opening crowdfunding platform
    window.open(`https://wadiz.kr/web/campaign/detail/123456?reward=${tierId}`, '_blank');
  };

  return (
    <section id="funding" className="py-20 bg-gradient-primary text-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            🚀 지금 펀딩에 참여하세요!
          </h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            얼리버드 특가로 AI 펫 아바타 서비스를 가장 먼저 경험해보세요. 
            한정된 리워드이니 서둘러주세요!
          </p>
        </div>

        {/* Funding Progress */}
        <Card className="mb-12 p-8 bg-white/10 backdrop-blur border-white/20 animate-scale-in">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">{fundingProgress}%</div>
              <div className="text-white/80">목표 달성률</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{totalBackers}</div>
              <div className="text-white/80">후원자 수</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{daysLeft}</div>
              <div className="text-white/80">남은 일수</div>
            </div>
          </div>
          
          <div className="mt-8">
            <div className="flex justify-between text-sm text-white/80 mb-2">
              <span>현재 {currentAmount.toLocaleString()}원</span>
              <span>목표 {goalAmount.toLocaleString()}원</span>
            </div>
            <Progress value={fundingProgress} className="h-4 bg-white/20" />
          </div>

          <div className="mt-6 text-center">
            <p className="text-white/90">
              🎉 목표 달성까지 <span className="font-bold text-yellow-300">{(goalAmount - currentAmount).toLocaleString()}원</span> 남았어요!
            </p>
          </div>
        </Card>

        {/* Reward Tiers */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {rewardTiers.map((tier, index) => (
            <Card 
              key={tier.id}
              className={`p-6 transition-all duration-300 cursor-pointer animate-slide-up ${
                selectedTier === tier.id
                  ? 'bg-white text-foreground ring-4 ring-yellow-300 scale-105'
                  : 'bg-white/10 backdrop-blur border-white/20 text-white hover:scale-105'
              }`}
              style={{animationDelay: `${index * 0.1}s`}}
              onClick={() => setSelectedTier(tier.id)}
            >
              {tier.limited && (
                <div className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold mb-4 inline-block">
                  🔥 한정판매
                </div>
              )}
              
              {tier.discount && (
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold mb-4 inline-block">
                  {tier.discount}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">{tier.title}</h3>
                  <p className={`text-sm ${selectedTier === tier.id ? 'text-muted-foreground' : 'text-white/80'}`}>
                    {tier.description}
                  </p>
                </div>

                <div className="text-3xl font-bold">
                  {tier.amount.toLocaleString()}원
                </div>

                <div className="space-y-2">
                  {tier.items.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <span className="text-green-400">✓</span>
                      <span className={`text-sm ${selectedTier === tier.id ? 'text-foreground' : 'text-white/90'}`}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                <div className={`text-sm ${selectedTier === tier.id ? 'text-muted-foreground' : 'text-white/80'}`}>
                  {tier.backers}명이 선택했어요
                </div>

                <Button 
                  onClick={() => openFundingPage(tier.id)}
                  className={`w-full ${
                    selectedTier === tier.id
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'bg-white text-primary hover:bg-white/90'
                  }`}
                >
                  이 리워드 선택하기
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Social Proof */}
        <Card className="p-6 bg-white/10 backdrop-blur border-white/20 animate-fade-in">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">후원자들의 실시간 후기</h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="space-y-2">
                <div className="font-semibold">김○○님</div>
                <div className="text-white/80">"우리 강아지가 기사가 되다니! 너무 귀여워요 ❤️"</div>
              </div>
              <div className="space-y-2">
                <div className="font-semibold">박○○님</div>
                <div className="text-white/80">"품질이 정말 좋네요. 머그컵 매일 써요!"</div>
              </div>
              <div className="space-y-2">
                <div className="font-semibold">이○○님</div>
                <div className="text-white/80">"친구들한테 자랑하느라 바빠요 😂"</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Final CTA */}
        <div className="text-center mt-12">
          <Button 
            onClick={() => openFundingPage(selectedTier)}
            size="lg"
            className="bg-white text-primary hover:bg-white/90 text-xl px-12 py-6 animate-pulse-glow"
          >
            🎁 지금 와디즈에서 펀딩 참여하기
          </Button>
          <p className="mt-4 text-white/80 text-sm">
            ⏰ 얼리버드 특가는 {daysLeft}일 후 종료됩니다
          </p>
        </div>
      </div>
    </section>
  );
};