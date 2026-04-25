import Image from 'next/image'
import { findClub } from '@/lib/clubs'

type Props = {
  /** Club name, short name, ID, or abbreviation — passed to findClub() */
  club: string
  /** Rendered size in pixels (square). Default: 40 */
  size?: number
  /** Extra className applied to the wrapping div */
  className?: string
  /** Show the club name below the logo */
  showName?: boolean
  /** If true, shows abbreviation below instead of shortName */
  useAbbr?: boolean
  /** If true, tells Next.js Image to preload (use for above-the-fold LCP images) */
  priority?: boolean
}

/**
 * ESPN CDN logo URL builder.
 * Format: https://a.espncdn.com/i/teamlogos/soccer/500/{espnId}.png
 */
const espnLogo = (id: number) => `https://a.espncdn.com/i/teamlogos/soccer/500/${id}.png`

/**
 * Comprehensive map of team name strings (as they appear in the DB) to ESPN CDN logos.
 * Covers La Liga MD33/34, Premier League MD33/34, UCL SF + QF teams.
 */
const ALL_TEAM_LOGOS: Record<string, string> = {
  // ── Premier League ──────────────────────────────────────────────────────────
  'Arsenal FC':                     espnLogo(359),
  'AFC Bournemouth':                espnLogo(349),
  'Aston Villa FC':                 espnLogo(362),
  'Brentford FC':                   espnLogo(337),
  "Brighton & Hove Albion FC":      espnLogo(331),
  'Burnley FC':                     espnLogo(379),
  'Chelsea FC':                     espnLogo(363),
  'Crystal Palace FC':              espnLogo(384),
  'Everton FC':                     espnLogo(368),
  'Fulham FC':                      espnLogo(370),
  'Liverpool FC':                   espnLogo(364),
  'Luton Town FC':                  espnLogo(388),
  'Manchester City FC':             espnLogo(382),
  'Manchester United FC':           espnLogo(360),
  'Newcastle United FC':            espnLogo(361),
  'Nottingham Forest FC':           espnLogo(393),
  'Sheffield United FC':            espnLogo(356),
  'Tottenham Hotspur FC':           espnLogo(367),
  'West Ham United FC':             espnLogo(371),
  'Wolverhampton Wanderers FC':     espnLogo(380),
  // PL short names (as used in DB match records)
  'Arsenal':                        espnLogo(359),
  'Bournemouth':                    espnLogo(349),
  'Aston Villa':                    espnLogo(362),
  'Brentford':                      espnLogo(337),
  'Brighton':                       espnLogo(331),
  "Brighton & Hove Albion":         espnLogo(331),
  'Burnley':                        espnLogo(379),
  'Chelsea':                        espnLogo(363),
  'Crystal Palace':                 espnLogo(384),
  'Everton':                        espnLogo(368),
  'Fulham':                         espnLogo(370),
  'Leeds United':                   espnLogo(357),
  'Liverpool':                      espnLogo(364),
  'Man City':                       espnLogo(382),
  'Manchester City':                espnLogo(382),
  'Man United':                     espnLogo(360),
  'Manchester United':              espnLogo(360),
  'Newcastle United':               espnLogo(361),
  'Nottm Forest':                   espnLogo(393),
  'Nottingham Forest':              espnLogo(393),
  'Sunderland':                     espnLogo(371),
  'Tottenham':                      espnLogo(367),
  'Tottenham Hotspur':              espnLogo(367),
  'West Ham':                       espnLogo(371),
  'West Ham United':                espnLogo(371),
  'Wolverhampton':                  espnLogo(380),
  'Wolverhampton Wanderers':        espnLogo(380),

  // ── La Liga ─────────────────────────────────────────────────────────────────
  'FC Barcelona':                   espnLogo(83),
  'Real Madrid CF':                 espnLogo(86),
  'Club Atletico de Madrid':        espnLogo(1068),
  'Athletic Club':                  espnLogo(93),
  'CA Osasuna':                     espnLogo(97),
  'Getafe CF':                      espnLogo(2922),
  'Girona FC':                      espnLogo(9812),
  'RC Celta de Vigo':               espnLogo(85),
  'RCD Mallorca':                   espnLogo(84),
  'Rayo Vallecano de Madrid':       espnLogo(101),
  'Real Betis Balompie':            espnLogo(244),
  'Real Sociedad de Futbol':        espnLogo(89),
  'Valencia CF':                    espnLogo(94),
  'Villarreal CF':                  espnLogo(102),
  'Sevilla FC':                     espnLogo(243),
  // La Liga short names (as used in DB match records)
  'Barcelona':                      espnLogo(83),
  'Real Madrid':                    espnLogo(86),
  'Athletic Bilbao':                espnLogo(93),
  'Athletic':                       espnLogo(93),
  'Osasuna':                        espnLogo(97),
  'Getafe':                         espnLogo(2922),
  'Girona':                         espnLogo(9812),
  'Celta Vigo':                     espnLogo(85),
  'Celta de Vigo':                  espnLogo(85),
  'Mallorca':                       espnLogo(84),
  'Rayo Vallecano':                 espnLogo(101),
  'Real Betis':                     espnLogo(244),
  'Real Sociedad':                  espnLogo(89),
  'Sevilla':                        espnLogo(243),
  'Valencia':                       espnLogo(94),
  'Villarreal':                     espnLogo(102),
  'Elche':                          espnLogo(9807),
  'Elche CF':                       espnLogo(9807),

  // ── UCL / Bundesliga / Ligue 1 ──────────────────────────────────────────────
  'PSG':                            espnLogo(160),
  'Paris Saint-Germain':            espnLogo(160),
  'Paris SG':                       espnLogo(160),
  'Bayern Munich':                  espnLogo(132),
  'FC Bayern Munich':               espnLogo(132),
  'Bayern':                         espnLogo(132),
  'Atletico Madrid':                espnLogo(1068),
  'Atletico de Madrid':             espnLogo(1068),
  'Atleti':                         espnLogo(1068),
  'Sporting CP':                    espnLogo(437),
  'Sporting':                       espnLogo(437),
  'Sporting Lisbon':                espnLogo(437),
  'Inter Milan':                    espnLogo(110),
  'Atalanta':                       espnLogo(104),
  'Porto':                          espnLogo(437),
  'Galatasaray':                    espnLogo(443),
  'LAFC':                           espnLogo(18924),
}

/**
 * Renders a club badge.
 * Priority: 1) Local /clubs/ PNG for core clubs  2) ESPN CDN for all others  3) Emoji fallback
 */
export function ClubLogo({ club, size = 40, className = '', showName = false, useAbbr = false, priority = false }: Props) {
  const found = findClub(club)
  const externalUrl = ALL_TEAM_LOGOS[club]

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      {found ? (
        /* Core club — local PNG */
        <div
          className="relative rounded-full overflow-hidden flex items-center justify-center"
          style={{ width: size, height: size, background: 'transparent', flexShrink: 0 }}
        >
          <Image
            src={found.logo}
            alt={found.name}
            width={size}
            height={size}
            style={{ objectFit: 'contain', width: '100%', height: '100%' }}
            unoptimized
            priority={priority}
          />
        </div>
      ) : externalUrl ? (
        /* Opponent club — ESPN CDN via <img> to bypass Next.js domain config */
        <div
          className="relative rounded-full overflow-hidden flex items-center justify-center"
          style={{ width: size, height: size, flexShrink: 0, background: 'white' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={externalUrl}
            alt={club}
            width={size}
            height={size}
            style={{ objectFit: 'contain', width: '85%', height: '85%' }}
            loading="lazy"
          />
        </div>
      ) : (
        /* Unknown — emoji fallback */
        <div
          className="flex items-center justify-center rounded-full bg-muted border border-border"
          style={{ width: size, height: size, fontSize: size * 0.55, flexShrink: 0 }}
        >
          ⚽
        </div>
      )}

      {showName && found && (
        <span
          className="font-black text-foreground text-center leading-tight"
          style={{ fontSize: Math.max(9, size * 0.28) + 'px' }}
        >
          {useAbbr ? found.abbr : found.shortName}
        </span>
      )}
    </div>
  )
}
