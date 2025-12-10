import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Target, BarChart3, Heart, ChevronRight, X } from "lucide-react";

interface WelcomeOnboardingProps {
  onComplete: () => void;
}

const steps = [
  {
    icon: Sparkles,
    title: "Welcome to Fan Pulse AI",
    description: "Your AI-powered companion for football insights, predictions, and fan engagement.",
    highlight: "Real-time sentiment analysis from millions of fans worldwide"
  },
  {
    icon: Target,
    title: "Smart Predictions",
    description: "Get AI-powered match predictions based on team form, fan sentiment, and historical data.",
    highlight: "Up to 85% prediction accuracy"
  },
  {
    icon: BarChart3,
    title: "Deep Analytics",
    description: "Explore team pulse ratings, player sentiment, and match analytics in one place.",
    highlight: "Multi-language sentiment from 6+ languages"
  },
  {
    icon: Heart,
    title: "Personalize Your Experience",
    description: "Set your favorite teams to get personalized updates and predictions.",
    highlight: "Never miss a match that matters to you"
  }
];

export function WelcomeOnboarding({ onComplete }: WelcomeOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const CurrentIcon = steps[currentStep].icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-background flex items-center justify-center p-4"
    >
      <Card className="w-full max-w-md p-6 relative overflow-hidden">
        {/* Skip button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSkip}
          className="absolute top-4 right-4 text-muted-foreground"
        >
          <X className="w-4 h-4 mr-1" />
          Skip
        </Button>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? "w-8 bg-primary"
                  : index < currentStep
                  ? "w-2 bg-primary/50"
                  : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            {/* Icon */}
            <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <CurrentIcon className="w-10 h-10 text-primary" />
            </div>

            {/* Content */}
            <h2 className="text-2xl font-bold mb-3">{steps[currentStep].title}</h2>
            <p className="text-muted-foreground mb-4">{steps[currentStep].description}</p>
            
            {/* Highlight badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              {steps[currentStep].highlight}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <Button onClick={handleNext} className="w-full" size="lg">
          {currentStep < steps.length - 1 ? (
            <>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </>
          ) : (
            "Get Started"
          )}
        </Button>
      </Card>
    </motion.div>
  );
}
