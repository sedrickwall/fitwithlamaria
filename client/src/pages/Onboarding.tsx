import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import onboardingConfig from "@/config/onboarding.json";

// Dynamically import images based on config
const imageModules = import.meta.glob('@assets/stock_images/*.{jpg,jpeg,png}', { eager: true });

const slides = onboardingConfig.slides.map((slide) => {
  const imagePath = `@assets/stock_images/${slide.image}`;
  const imageModule = imageModules[`/attached_assets/stock_images/${slide.image}`] as { default: string };
  
  return {
    image: imageModule?.default || '',
    title: slide.title,
    description: slide.description,
  };
});

export default function Onboarding() {
  const [, navigate] = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSkip = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    navigate("/premium");
  };

  const handleChoosePlan = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    navigate("/premium");
  };

  const handleAlreadySubscriber = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    navigate("/");
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex justify-end p-6">
        <button
          onClick={handleSkip}
          className="text-muted-foreground hover:text-foreground transition-colors text-lg"
          data-testid="button-skip-onboarding"
        >
          Skip
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-between px-6 pb-12 max-w-2xl mx-auto w-full">
        <div className="w-full flex-1 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-md aspect-[3/4] mb-8 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              className="w-full h-full object-cover"
              data-testid={`image-onboarding-${currentSlide}`}
            />
            
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors"
              data-testid="button-prev-slide"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors"
              data-testid="button-next-slide"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          </div>

          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl md:text-5xl font-bold" data-testid={`text-title-${currentSlide}`}>
              {slides[currentSlide].title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto" data-testid={`text-description-${currentSlide}`}>
              {slides[currentSlide].description}
            </p>
          </div>

          <div className="flex gap-2 mb-8">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? "w-8 bg-foreground"
                    : "w-2 bg-muted-foreground/30"
                }`}
                data-testid={`button-dot-${index}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <div className="w-full max-w-md space-y-6">
            <p className="text-center text-muted-foreground">
              Save up to 59% <span className="text-foreground/70">with annual subscription</span>
            </p>

            <Button
              onClick={handleChoosePlan}
              className="w-full h-14 text-lg bg-[#8B7355] hover:bg-[#75614A] text-white rounded-full"
              data-testid="button-choose-plan"
            >
              Choose Your Plan
            </Button>

            <button
              onClick={handleAlreadySubscriber}
              className="w-full text-center text-muted-foreground hover:text-foreground transition-colors"
              data-testid="button-already-subscriber"
            >
              Already a subscriber?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
