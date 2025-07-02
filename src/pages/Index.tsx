import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { DemoSection } from '@/components/DemoSection';
import { ResultsSection } from '@/components/ResultsSection';
import { ProductPreview } from '@/components/ProductPreview';
import { FundingSection } from '@/components/FundingSection';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <DemoSection />
        <ResultsSection />
        <ProductPreview />
        <FundingSection />
      </main>
      
      {/* Footer */}
      <footer className="bg-tech-bg text-tech-foreground py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🐾</span>
                </div>
                <span className="font-bold text-xl">AI Pet Avatar</span>
              </div>
              <p className="text-tech-foreground/80 text-sm">
                AI 기술로 반려동물을 판타지 캐릭터로 변환하는 서비스입니다.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">서비스 정보</h4>
              <div className="space-y-2 text-sm text-tech-foreground/80">
                <p>📧 hello@aipetavatar.com</p>
                <p>📱 카카오톡: @aipetavatar</p>
                <p>🔗 와디즈 펀딩 페이지</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">법적 고지</h4>
              <div className="space-y-2 text-sm text-tech-foreground/80">
                <p>개인정보처리방침</p>
                <p>이용약관</p>
                <p className="text-xs">
                  ⚠️ 모든 아바타 이미지는 AI에 의해 생성되었습니다
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-tech-foreground/20 mt-8 pt-8 text-center text-sm text-tech-foreground/60">
            <p>© 2025 AI Pet Avatar Service. Powered by Replicate AI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
