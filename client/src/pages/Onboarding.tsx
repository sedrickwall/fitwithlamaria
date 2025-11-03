import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import onboardingConfig from "@/config/onboarding.json";

// Import all available images
import image1 from "@assets/stock_images/pixabay_senior_woman_gym.jpg";
import image2 from "@assets/stock_images/pixabay_elderly_woman_gym_illustration.jpg";
import image3 from "@assets/stock_images/pexels_elderly_couple_yoga_stretching.jpg";

// Map filenames to imported images for easy configuration
const imageMap: Record<string, string> = {
  "pixabay_senior_woman_gym.jpg": image1,
  "pixabay_elderly_woman_gym_illustration.jpg": image2,
  "pexels_elderly_couple_yoga_stretching.jpg": image3,
};

const slides = onboardingConfig.slides.map((slide) => ({
  image: imageMap[slide.image] || '',
  title: slide.title,
  description: slide.description,
}));

export default function Onboarding() {
  const [, navigate] = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleGetStarted = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    navigate("/");
  };

  const nextSlide = () => {
    if (currentSlide === slides.length - 1) {
      handleGetStarted();
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex justify-end px-4 pt-4 pb-2 shrink-0">
        <button
          onClick={handleGetStarted}
          className="text-muted-foreground hover:text-foreground transition-colors text-base"
          data-testid="button-skip-onboarding"
        >
          Skip
        </button>
      </div>

      <div className="flex flex-col items-center gap-4 px-4 pb-6 max-w-2xl mx-auto w-full">
        <div className="w-full flex flex-col items-center gap-4">
          <div className="relative w-full max-w-xs h-[220px] sm:h-auto sm:aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              className="w-full h-full object-cover"
              data-testid={`image-onboarding-${currentSlide}`}
            />
            
            {currentSlide > 0 && (
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                data-testid="button-prev-slide"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
            )}
            
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors"
              data-testid="button-next-slide"
              aria-label={currentSlide === slides.length - 1 ? "Go to premium" : "Next slide"}
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold" data-testid={`text-title-${currentSlide}`}>
              {slides[currentSlide].title}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-lg mx-auto" data-testid={`text-description-${currentSlide}`}>
              {slides[currentSlide].description}
            </p>
          </div>

          <div className="flex gap-2">
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

          <div className="w-full max-w-md space-y-3">
            <p className="text-center text-muted-foreground text-sm">
              {currentSlide === slides.length - 1 
                ? "Ready to start your wellness journey?" 
                : "Swipe to learn more"}
            </p>

            {currentSlide === slides.length - 1 && (
              <Button
                onClick={handleGetStarted}
                className="w-full h-12 text-base rounded-full"
                data-testid="button-get-started"
              >
                Start Free
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
