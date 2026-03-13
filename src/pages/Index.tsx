import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppHeader } from "@/components/AppHeader";
import { BottomNavigation } from "@/components/BottomNavigation";
import { MatchSentiments } from "@/components/MatchSentiments";
import { PlayerRatingsTab } from "@/components/PlayerRatingsTab";
import { HomeTab } from "@/components/HomeTab";
import { RivalryHub } from "@/components/RivalryHub";
import { MoreTab } from "@/components/MoreTab";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { SplashScreen } from "@/components/SplashScreen";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const ONBOARDING_KEY = "fanpulse_onboarded";
const FAVORITES_KEY = "fanpulse_favorites";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [favoriteClubs, setFavoriteClubs] = useState<string[]>([]);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const onboarded = localStorage.getItem(ONBOARDING_KEY);
    const saved = localStorage.getItem(FAVORITES_KEY);
    if (!onboarded) {
      setShowOnboarding(true);
    }
    if (saved) {
      setFavoriteClubs(JSON.parse(saved));
    }
    // Hide splash after 1.2s
    const timer = setTimeout(() => setShowSplash(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleOnboardingComplete = (clubs: string[]) => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(clubs));
    setFavoriteClubs(clubs);
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <SplashScreen visible={showSplash} />
      <AppHeader />
      <div className="max-w-lg mx-auto px-4 pt-4 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <ErrorBoundary fallbackMessage="Failed to load this section. Tap to retry.">
              {activeTab === "home" && (
                <HomeTab
                  favoriteClubs={favoriteClubs}
                  onNavigate={setActiveTab}
                />
              )}
              {activeTab === "sentiments" && <MatchSentiments />}
              {activeTab === "ratings" && <PlayerRatingsTab />}
              {activeTab === "rivals" && <RivalryHub />}
              {activeTab === "more" && <MoreTab />}
            </ErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </div>
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
