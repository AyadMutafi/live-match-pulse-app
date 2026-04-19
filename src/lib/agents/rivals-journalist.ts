import { db } from '@/lib/db';

/**
 * Tool for the "Journalist Agent" to update the Rivals section analytical text.
 * Instead of generating text on the client-side, we allow agents to persist 
 * deep psychological analysis based on multi-source scraping.
 */
export async function updateRivalsAnalysis(matchId: string, analysisText: string) {
  try {
    const match = await db.match.findUnique({ where: { id: matchId } });
    if (!match) {
      throw new Error(`Match with ID ${matchId} not found.`);
    }

    // Store the analysis in psycheJSON
    // We can also store metadata like agentId and timestamp
    const existingPsyche = match.psycheJSON ? JSON.parse(match.psycheJSON) : {};
    
    const updatedPsyche = {
      ...existingPsyche,
      rivalsAnalysis: analysisText,
      lastAgentUpdate: new Date().toISOString(),
      agentRole: 'Journalist'
    };

    await db.match.update({
      where: { id: matchId },
      data: {
        psycheJSON: JSON.stringify(updatedPsyche),
        lastUpdated: new Date()
      }
    });

    return {
      success: true,
      matchId,
      message: 'Rivals analysis updated successfully by Journalist Agent.'
    };
  } catch (error: any) {
    console.error('[Journalist Tool Error]:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
