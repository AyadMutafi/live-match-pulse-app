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
}

/**
 * ESPN CDN logo URL builder.
 * Format: https://a.espncdn.com/i/teamlogos/soccer/500/{espnId}.png
 */
const espnLogo = (id: number) => `https://a.espncdn.com/i/teamlogos/soccer/500/${id}.png`

/**
 * Comprehensive map of EVERY opponent team that appears in the
 * 2023-24 PL + La Liga dataset (openfootball) to their verified ESPN CDN logo.
 * Key = exact team name string as it appears in season-matches.json
 */
const ALL_TEAM_LOGOS: Record<string, string> = {
  // ── Premier League ───────────────────────────────
  'AFC Bournemouth':                espnLogo(349),
  'Arsenal FC':                     espnLogo(359),
  'Aston Villa FC':                 espnLogo(362),
  'Brentford FC':                   espnLogo(337),
  'Brighton & Hove Albion FC':      espnLogo(331),
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

  // ── La Liga ──────────────────────────────────────
  'Athletic Club':                  espnLogo(93),
  'CA Osasuna':                     espnLogo(97),
  'Club Atlético de Madrid':        espnLogo(1068),
  'Cádiz CF':                       espnLogo(9811),
  'Deportivo Alavés':               espnLogo(96),
  'FC Barcelona':                   espnLogo(83),
  'Getafe CF':                      espnLogo(2922),
  'Girona FC':                      espnLogo(9812),
  'Granada CF':                     espnLogo(9785),
  'RC Celta de Vigo':               espnLogo(85),
  'RCD Mallorca':                   espnLogo(84),
  'Rayo Vallecano de Madrid':       espnLogo(101),
  'Real Betis Balompié':            espnLogo(244),
  'Real Madrid CF':                 espnLogo(86),
  'Real Sociedad de Fútbol':        espnLogo(89),
  'Sevilla FC':                     espnLogo(243),
  'UD Almería':                     espnLogo(9797),
  'UD Las Palmas':                  espnLogo(9831),
  'Valencia CF':                    espnLogo(94),
  'Villarreal CF':                  espnLogo(102),
  'LAFC':                           espnLogo(18924),
  'Bayern Munich':                  espnLogo(132),
  'Atalanta':                       espnLogo(104),
  'Galatasaray':                    espnLogo(443),
  'PSG':                            espnLogo(160),
  'Paris Saint-Germain':            espnLogo(160),
  'Inter Milan':                    espnLogo(110),
  'Porto':                          espnLogo(437),
  'Newcastle United':               espnLogo(361),
  'Barcelona':                      espnLogo(83),
  'Real Madrid':                    espnLogo(86),
  'Liverpool':                      espnLogo(364),
  'Arsenal':                        espnLogo(359),
  'Chelsea':                        espnLogo(363),
  'Man City':                       espnLogo(382),
  'Manchester City':                espnLogo(382),
  'Man United':                     espnLogo(360),
  'Manchester United':              espnLogo(360),
  'Tottenham':                      espnLogo(367),
}

/**
 * Renders a club badge.
 * Priority: 1) Local /clubs/ PNG for core 7  2) ESPN CDN for all others  3) Emoji fallback
 */
export function ClubLogo({ club, size = 40, className = '', showName = false, useAbbr = false }: Props) {
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
