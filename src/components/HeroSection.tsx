import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-before-after.jpg';

export const HeroSection = () => {
  const scrollToDemo = () => {
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen bg-gradient-hero flex items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-glow opacity-30 animate-pulse-glow"></div>
      
      <div className="container mx-auto px-6 py-20 pt-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                내 반려동물을 
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  판타지 주인공
                </span>
                으로!
              </h1>
              <p className="text-xl text-muted-foreground">
                AI 기술로 1분 만에 반려동물 사진을 마법같은 아바타로 변환해드립니다.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={scrollToDemo}
                className="bg-gradient-primary hover:scale-105 transition-transform shadow-glow text-lg px-8 py-4"
              >
                🎨 1분 만에 체험하기
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-primary text-primary hover:bg-primary/10 text-lg px-8 py-4"
              >
                📱 작품 갤러리 보기
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">1,247</div>
                <div className="text-sm text-muted-foreground">생성된 아바타</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">58초</div>
                <div className="text-sm text-muted-foreground">평균 생성시간</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">80%</div>
                <div className="text-sm text-muted-foreground">펀딩 달성률</div>
              </div>
            </div>
          </div>

          {/* Right content - Hero image */}
          <div className="relative animate-slide-up">
            <div className="relative rounded-2xl overflow-hidden shadow-card">
              <img 
                src={heroImage} 
                alt="Before and After AI transformation"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              
              {/* Before/After labels */}
              <div className="absolute top-4 left-4 bg-card/90 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold">
                Before
              </div>
              <div className="absolute top-4 right-4 bg-gradient-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                After ✨
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/20 rounded-full animate-float"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary/20 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
      </div>
    </section>
  );
};