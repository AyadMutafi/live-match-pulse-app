import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Users } from "lucide-react";
import { toast } from "sonner";

export function FanDataGenerator() {
  const [loading, setLoading] = useState(false);

  const generateFanData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-fan-data');
      
      if (error) throw error;
      
      toast.success(`Generated ${data.postsGenerated} fan posts for ${data.matchesProcessed} matches!`);
    } catch (error: any) {
      console.error('Error generating fan data:', error);
      toast.error('Failed to generate fan data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Generate Fan Reactions
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Generate realistic fan reactions and sentiment data for matches (Sept 15 - Oct 2)
          </p>
        </div>
        <Button onClick={generateFanData} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Data'
          )}
        </Button>
      </div>
    </Card>
  );
}