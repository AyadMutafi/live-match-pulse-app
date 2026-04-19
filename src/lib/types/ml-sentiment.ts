export type EmotionCategory = 
  | 'JOY' 
  | 'ANGER' 
  | 'EXCITEMENT' 
  | 'DISAPPOINTMENT' 
  | 'ANXIETY' 
  | 'RELIEF';

export type EntityType = 'PLAYER' | 'TEAM' | 'MATCH' | 'LEAGUE';

/**
 * Core mathematical output vector from the predictive model.
 */
export interface SentimentVector {
  score: number;           // -100 to 100
  confidence: number;      // 0.0 to 1.0 (Softmax max probability usually)
  volatility: number;      // Rolling variance (σ²) across last N intervals
  momentum: number;        // Mathematical derivative (current - previous score)
  predictedScore: number;  // Time-series forecast output (t+1)
}

/**
 * Detailed Natural Language Processing extraction payload.
 */
export interface NLPBreakdown {
  primaryEmotion: EmotionCategory;
  secondaryEmotion?: EmotionCategory;
  topics: string[];
  keyPhrases: string[];
  hashtags: string[];
  aspectScores: Record<string, number>; // e.g., { "Tactics": -50, "Effort": 80 }
}

/**
 * Standardized input expected by the database save controller.
 */
export interface AIModelResponse {
  vector: SentimentVector;
  nlp: NLPBreakdown;
  metadata: {
    modelId: string;
    processingTimeMs: number;
    tokensUsed: number;
  };
}

/**
 * Z-Score Analysis Configuration for Anomaly Detection.
 * Determines when an Alert is triggered.
 */
export interface AnomalyConfig {
  stdDevMultiplier: number; // e.g., 2.0 (Trigger if score > 2σ from mean)
  minDataPoints: number;    // Ensure sample size is statistically significant
  momentumThreshold: number;// Trigger if rate of change is too steep
}

/**
 * Interface mapping to the Comparative Sentiment UI module.
 * Used for Head-to-Head analytics.
 */
export interface ComparativeAnalysis {
  entityAId: string;
  entityBId: string;
  correlationCoefficient: number; // Pearson correlation between two entities
  divergenceIndex: number;        // How far apart their momentum streams are
  historicalAdvantage: 'A' | 'B' | 'NEUTRAL';
}
