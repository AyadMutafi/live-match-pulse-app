import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNavigation } from "@/components/BottomNavigation";
import { MatchSentiments } from "@/components/MatchSentiments";
import { PlayerRatingsTab } from "@/components/PlayerRatingsTab";
import { TeamOfWeekTab } from "@/components/TeamOfWeekTab";

const Index = () => {
  const [activeTab, setActiveTab] = useState("sentiments");

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="max-w-lg mx-auto px-4 pt-4 pb-24">
        {activeTab === "sentiments" && <MatchSentiments />}
        {activeTab === "ratings" && <PlayerRatingsTab />}
        {activeTab === "totw" && <TeamOfWeekTab />}
      </div>
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
