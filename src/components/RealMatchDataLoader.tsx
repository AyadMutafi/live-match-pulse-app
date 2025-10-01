import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useFetchMatchesFromApi } from "@/hooks/useMatches";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export function RealMatchDataLoader() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fetchMatches = useFetchMatchesFromApi();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleFetchMatches = async () => {
    setLoading(true);
    setResult(null);

    try {
      const data = await fetchMatches();
      setResult(data);
      
      // Invalidate matches query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      
      toast({
        title: "Success!",
        description: data.message || "Matches loaded successfully",
      });
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch matches",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Load Real Match Data</CardTitle>
        <CardDescription>
          Fetch real football match data from the last 10 days and populate the database
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleFetchMatches}
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Fetching Matches...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Fetch Real Match Data
            </>
          )}
        </Button>

        {result && (
          <div className="mt-4 p-4 border rounded-lg bg-muted/50">
            {result.success ? (
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-green-700 dark:text-green-400">Success!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {result.message}
                  </p>
                  <div className="mt-2 text-sm">
                    <p>• Teams processed: {result.teamsProcessed}</p>
                    <p>• Matches inserted: {result.matchesInserted}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-red-700 dark:text-red-400">Error</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {result.error || "Failed to fetch matches"}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
