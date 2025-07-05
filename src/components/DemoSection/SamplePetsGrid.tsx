import { Card } from '@/components/ui/card';
import samplePetsImage from '@/assets/sample-pets.jpg';

interface SamplePet {
  id: string;
  name: string;
  type: string;
  image: string;
}

interface SamplePetsGridProps {
  onPetSelect: (petId: string) => void;
}

export const SamplePetsGrid = ({ onPetSelect }: SamplePetsGridProps) => {
  const samplePets: SamplePet[] = [
    { id: '1', name: '골든리트리버', type: '강아지', image: samplePetsImage },
    { id: '2', name: '터키시앙고라', type: '고양이', image: samplePetsImage },
    { id: '3', name: '시베리안허스키', type: '강아지', image: samplePetsImage },
    { id: '4', name: '스코티시폴드', type: '고양이', image: samplePetsImage },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
      {samplePets.map((pet, index) => (
        <Card 
          key={pet.id}
          className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-glow bg-tech-bg/50 border-tech-accent/20 animate-scale-in"
          style={{animationDelay: `${index * 0.1}s`}}
          onClick={() => onPetSelect(pet.id)}
          role="button"
          tabIndex={0}
          aria-label={`${pet.name} 샘플로 체험하기`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onPetSelect(pet.id);
            }
          }}
        >
          <div className="p-4">
            <div className="aspect-square rounded-lg overflow-hidden mb-4 relative">
              <img 
                src={pet.image} 
                alt={pet.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-primary/0 group-hover:bg-gradient-primary/20 transition-all duration-300 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 text-white font-semibold text-lg transition-opacity duration-300">
                  체험하기 ✨
                </span>
              </div>
            </div>
            <h3 className="font-semibold text-tech-foreground">{pet.name}</h3>
            <p className="text-tech-foreground/60 text-sm">{pet.type}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};