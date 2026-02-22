import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search, BarChart3, TrendingUp, TrendingDown, Minus,
  Clock, RefreshCw, Brain, Globe, Hash, Loader2
} from "lucide-react";
import { toast } from "sonner";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";

interface SentimentResult {
  total_posts: number;
  positive: number;
  negative: number;
  neutral: number;
  percentages: { positive: number; negative: number; neutral: number };
  summary: string;
  source: string;
  results?: Array<{ text: string; sentiment: string }>;
}

interface SearchHistory {
  id: string;
  keyword: string;
  language: string;
  total_posts: number;
  positive_count: number;
  negative_count: number;
  neutral_count: number;
  positive_pct: number;
  negative_pct: number;
  neutral_pct: number;
  summary: string;
  created_at: string;
}

const POPULAR_KEYWORDS = [
  "Champions League", "Premier League", "La Liga", "Bundesliga",
  "Real Madrid", "Barcelona", "Liverpool", "Bayern Munich",
  "Manchester City", "Arsenal", "PSG", "Juventus"
];

const SentimentTracker = () => {
  const [keyword, setKeyword] = useState("");
  const [language, setLanguage] = useState("all");
  const [limit, setLimit] = useState("25");
  const [result, setResult] = useState<SentimentResult | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("analyze-football-sentiment", {
        body: { keyword: keyword.trim(), language, limit: Number(limit) },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data as SentimentResult;
    },
    onSuccess: (data) => {
      setResult(data);
      toast.success(`Analyzed ${data.total_posts} posts for "${keyword}"`);
    },
    onError: (err: Error) => {
      if (err.message.includes("Rate limit")) {
        toast.error("Rate limited – please wait a moment and try again.");
      } else if (err.message.includes("credits")) {
        toast.error("AI credits exhausted. Please top up your workspace.");
      } else {
        toast.error(err.message || "Analysis failed");
      }
    },
  });

  const { data: history } = useQuery({
    queryKey: ["sentiment-history"],
    queryFn: async () => {
      const { data } = await supabase
        .from("sentiment_searches")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      return (data || []) as SearchHistory[];
    },
    refetchOnWindowFocus: false,
  });

  const handleAnalyze = () => {
    if (!keyword.trim()) {
      toast.warning("Enter a keyword to analyze");
      return;
    }
    mutation.mutate();
  };

  const handleRerun = (h: SearchHistory) => {
    setKeyword(h.keyword);
    setLanguage(h.language);
    setTimeout(() => mutation.mutate(), 100);
  };

  const chartData = result
    ? [
        { name: "Positive", value: result.positive, pct: result.percentages.positive },
        { name: "Neutral", value: result.neutral, pct: result.percentages.neutral },
        { name: "Negative", value: result.negative, pct: result.percentages.negative },
      ]
    : [];

  const COLORS = ["hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--destructive))"];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-16">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Brain className="w-7 h-7 text-primary" />
            European Football Sentiment Tracker
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            AI-powered real-time fan sentiment analysis across European football
          </p>
        </div>

        {/* Search Controls */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Enter Club, League, or Keyword..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                  className="h-11"
                />
              </div>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-full md:w-40">
                  <Globe className="w-4 h-4 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
              <Select value={limit} onValueChange={setLimit}>
                <SelectTrigger className="w-full md:w-32">
                  <Hash className="w-4 h-4 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 posts</SelectItem>
                  <SelectItem value="25">25 posts</SelectItem>
                  <SelectItem value="50">50 posts</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAnalyze} disabled={mutation.isPending} className="h-11 px-6">
                {mutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                {mutation.isPending ? "Analyzing..." : "Analyze Sentiment"}
              </Button>
            </div>

            {/* Quick keyword chips */}
            <div className="flex flex-wrap gap-2 mt-4">
              {POPULAR_KEYWORDS.map((kw) => (
                <Badge
                  key={kw}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/10 transition-colors"
                  onClick={() => { setKeyword(kw); }}
                >
                  {kw}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {mutation.isPending && (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-lg" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-24 rounded-lg" />
            </div>
          </div>
        )}

        {/* Results */}
        {result && !mutation.isPending && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-4 pb-4 text-center">
                  <BarChart3 className="w-6 h-6 mx-auto text-primary mb-1" />
                  <div className="text-2xl font-bold">{result.total_posts}</div>
                  <div className="text-xs text-muted-foreground">Total Analyzed</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-4 text-center">
                  <TrendingUp className="w-6 h-6 mx-auto text-[hsl(var(--success))] mb-1" />
                  <div className="text-2xl font-bold text-[hsl(var(--success))]">{result.positive}</div>
                  <div className="text-xs text-muted-foreground">Positive ({result.percentages.positive}%)</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-4 text-center">
                  <Minus className="w-6 h-6 mx-auto text-[hsl(var(--warning))] mb-1" />
                  <div className="text-2xl font-bold text-[hsl(var(--warning))]">{result.neutral}</div>
                  <div className="text-xs text-muted-foreground">Neutral ({result.percentages.neutral}%)</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-4 text-center">
                  <TrendingDown className="w-6 h-6 mx-auto text-destructive mb-1" />
                  <div className="text-2xl font-bold text-destructive">{result.negative}</div>
                  <div className="text-xs text-muted-foreground">Negative ({result.percentages.negative}%)</div>
                </CardContent>
              </Card>
            </div>

            {/* Chart + Summary */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Sentiment Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          background: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: 8,
                          color: "hsl(var(--foreground))",
                        }}
                        formatter={(value: number, _: string, props: any) => [
                          `${value} posts (${props.payload.pct}%)`,
                          "Count",
                        ]}
                      />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {chartData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>

                  {/* Progress bars */}
                  <div className="space-y-3 mt-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[hsl(var(--success))]">Positive</span>
                        <span>{result.percentages.positive}%</span>
                      </div>
                      <Progress value={result.percentages.positive} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[hsl(var(--warning))]">Neutral</span>
                        <span>{result.percentages.neutral}%</span>
                      </div>
                      <Progress value={result.percentages.neutral} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-destructive">Negative</span>
                        <span>{result.percentages.negative}%</span>
                      </div>
                      <Progress value={result.percentages.negative} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    AI Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">{result.summary}</p>
                  {result.source === "generated" && (
                    <Badge variant="outline" className="mt-3 text-xs">
                      ⚠️ Based on AI-generated representative posts (RSS unavailable)
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Individual Posts */}
            {result.results && result.results.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Classified Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {result.results.map((r, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
                        <Badge
                          variant={
                            r.sentiment === "Positive" ? "default" :
                            r.sentiment === "Negative" ? "destructive" : "secondary"
                          }
                          className="text-xs shrink-0 mt-0.5"
                        >
                          {r.sentiment}
                        </Badge>
                        <span className="text-sm text-foreground">{r.text}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Search History */}
        {history && history.length > 0 && (
          <Card className="mt-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                Recent Searches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {history.map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{h.keyword}</span>
                        <Badge variant="outline" className="text-xs">{h.language}</Badge>
                      </div>
                      <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="text-[hsl(var(--success))]">+{h.positive_count} ({h.positive_pct}%)</span>
                        <span className="text-[hsl(var(--warning))]">~{h.neutral_count} ({h.neutral_pct}%)</span>
                        <span className="text-destructive">-{h.negative_count} ({h.negative_pct}%)</span>
                        <span>• {new Date(h.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleRerun(h)}>
                      <RefreshCw className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SentimentTracker;
