import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Adding La Liga & Premier League matches...')

  // ═══════════════════════════════════════════════════════════════════════════
  // LA LIGA — Matchday 33 (Apr 21–22, 2026) + Matchday 34 upcoming (Apr 24–26)
  // ═══════════════════════════════════════════════════════════════════════════

  const laLigaMatches = [

    // ── MD33 RESULTS ──────────────────────────────────────────────────────────

    // Tue Apr 21
    {
      homeTeam: 'Athletic Club',   awayTeam: 'Osasuna',
      homeScore: 1,                awayScore: 0,
      status: 'finished',          league: 'La Liga',
      date: new Date('2026-04-21T20:00:00'),
      homeSentiment: 82, awaySentiment: 28,
      volatility: 0.35, momentum: 0.68, predictedScore: 78,
      psycheJSON: JSON.stringify({ postMatch: {
        outcome: ['Clean sheet 1-0 win for Athletic at San Mamés.', 'Athletic move into the European places with this vital win.'],
        performance: ['Berenguer\'s first-half header was clinical.', 'The Athletic press was relentless — Osasuna never got going.'],
        supporters: ['San Mamés erupted at the final whistle.', 'Fans chanting "Aupa Athletic" all night.'],
        media: ['"Athletic back in the race for Europe" — AS.', '"Magnificent pressing game" — Marca.']
      }})
    },
    {
      homeTeam: 'Mallorca',        awayTeam: 'Valencia',
      homeScore: 1,                awayScore: 1,
      status: 'finished',          league: 'La Liga',
      date: new Date('2026-04-21T20:00:00'),
      homeSentiment: 52, awaySentiment: 55,
      volatility: 0.44, momentum: 0.50, predictedScore: 62,
      psycheJSON: JSON.stringify({ postMatch: {
        outcome: ['Entertaining 1-1 draw at Son Moix.', 'A point each felt fair given how the match played out.'],
        performance: ['Muriqi scored then went off injured — a concern for Mallorca.', 'Pepelu equalised with a curled beauty for Valencia.'],
        supporters: ['Mixed applause from the home end — fans frustrated they didn\'t push for three.', 'Valencia fans pleased to extend their unbeaten run.'],
        media: ['"A fair draw in Mallorca" — Marca.', '"Valencia cling on for a useful point" — Super Deporte.']
      }})
    },
    {
      homeTeam: 'Girona',          awayTeam: 'Real Betis',
      homeScore: 2,                awayScore: 3,
      status: 'finished',          league: 'La Liga',
      date: new Date('2026-04-21T22:00:00'),
      homeSentiment: 38, awaySentiment: 79,
      volatility: 0.85, momentum: 0.74, predictedScore: 86,
      psycheJSON: JSON.stringify({ postMatch: {
        outcome: ['Thrilling comeback! Real Betis win 3-2 at Montilivi.', 'Girona led twice but Betis showed incredible character.'],
        performance: ['Isco was the creative genius behind all three Betis goals.', 'Girona\'s defensive line was too high — punished twice in the second half.'],
        supporters: ['Girona fans stunned by the late collapse.', 'Betis away fans celebrating wildly outside the ground.'],
        media: ['"Isco magic breaks Girona hearts" — Mundo Deportivo.', '"Betis fight back to keep European dream alive" — AS.']
      }})
    },
    {
      homeTeam: 'Real Madrid',     awayTeam: 'Alavés',
      homeScore: 2,                awayScore: 1,
      status: 'finished',          league: 'La Liga',
      date: new Date('2026-04-21T22:00:00'),
      homeSentiment: 84, awaySentiment: 32,
      volatility: 0.42, momentum: 0.71, predictedScore: 88,
      psycheJSON: JSON.stringify({ postMatch: {
        outcome: ['Real Madrid grind out a 2-1 win at the Bernabéu.', 'Alavés gave them a late scare but Madrid held on.'],
        performance: ['Mbappé opened the scoring with a powerful left-foot drive (30\').', 'Vinícius sealed it with a trademark run and finish (50\').', 'Toni Martínez pulled one back deep in injury time.'],
        supporters: ['Bernabéu was tense in the final minutes but erupted at the final whistle.', 'Fans relieved — Madrid stay second in La Liga.'],
        media: ['"Mbappé and Vinicius do the job — but Madrid need to be sharper" — Marca.', '"Alavés gave Madrid a scare" — AS.']
      }})
    },

    // Wed Apr 22
    {
      homeTeam: 'Elche',           awayTeam: 'Atlético Madrid',
      homeScore: 3,                awayScore: 2,
      status: 'finished',          league: 'La Liga',
      date: new Date('2026-04-22T20:00:00'),
      homeSentiment: 88, awaySentiment: 34,
      volatility: 0.91, momentum: 0.82, predictedScore: 90,
      psycheJSON: JSON.stringify({ postMatch: {
        outcome: ['SHOCK RESULT! Elche stun Atlético 3-2 at the Martínez Valero!', 'A devastating blow for Atlético\'s La Liga title challenge.'],
        performance: ['Elche were ruthless on the counter — three clinical finishes.', 'Atlético lacked urgency and were caught high up the pitch twice.'],
        supporters: ['Elche fans poured onto the pitch at full-time.', 'Atlético ultras were furious — a nightmare night.'],
        media: ['"Catastrophe for Atlético — La Liga title hopes take a huge hit" — AS.', '"Elche produce the shock of the season" — Marca.']
      }})
    },
    {
      homeTeam: 'Real Sociedad',   awayTeam: 'Getafe',
      homeScore: 0,                awayScore: 1,
      status: 'finished',          league: 'La Liga',
      date: new Date('2026-04-22T20:00:00'),
      homeSentiment: 28, awaySentiment: 76,
      volatility: 0.39, momentum: 0.65, predictedScore: 72,
      psycheJSON: JSON.stringify({ postMatch: {
        outcome: ['Getafe\'s famous defensive resilience pays off — 1-0 win in San Sebastián.', 'Real Sociedad left frustrated at home.'],
        performance: ['A single Greenwood goal separated the sides.', 'Getafe defended with discipline throughout.'],
        supporters: ['Real Sociedad fans whistled at full-time.', 'Small but passionate Getafe away following celebrated as if they\'d won the title.'],
        media: ['"Greenwood again!" — AS on the former Man United man\'s decisive goal.', '"Sociedad need to find their form" — El Diario Vasco.']
      }})
    },
    {
      homeTeam: 'Barcelona',       awayTeam: 'Celta Vigo',
      homeScore: 1,                awayScore: 0,
      status: 'finished',          league: 'La Liga',
      date: new Date('2026-04-22T22:00:00'),
      homeSentiment: 88, awaySentiment: 26,
      volatility: 0.28, momentum: 0.72, predictedScore: 90,
      psycheJSON: JSON.stringify({ postMatch: {
        outcome: ['Barcelona return to winning ways — a narrow but important 1-0 at Camp Nou.', 'Barça go to the top of La Liga with this result.'],
        performance: ['Lamine Yamal scored the only goal from the spot (40\') — composed and clinical.', 'Barcelona controlled possession but missed chances to put the game to bed.'],
        supporters: ['Camp Nou gave a standing ovation at full-time — relief and joy.', 'Fans chanting Lamine Yamal\'s name throughout the second half.'],
        media: ['"Yamal leads Barcelona back to the summit" — Mundo Deportivo.', '"Job done but Barça must be more clinical" — Sport.']
      }})
    },

    // ── MD34 UPCOMING — Apr 24–26 ─────────────────────────────────────────────

    {
      homeTeam: 'Real Betis',      awayTeam: 'Real Madrid',
      homeScore: 0,                awayScore: 0,
      status: 'upcoming',          league: 'La Liga',
      date: new Date('2026-04-24T22:00:00'),
      homeSentiment: 58, awaySentiment: 76,
      volatility: 0.62, momentum: 0.55, predictedScore: 0,
      psycheJSON: JSON.stringify({ preMatch: {
        preparation: ['Betis set up to frustrate on the counter — a similar approach to their Girona game.', 'Madrid will be without a key midfielder through suspension.'],
        atmosphere: ['Benito Villamarín expected to be packed and hostile.', 'Madrid fans flooding into Seville make the atmosphere electric.'],
        media: ['"Can Betis dent Madrid\'s title hopes?" — AS full preview.', '"Real Betis have nothing to lose" — Marca analysis.'],
        players: ['Mbappé is in devastating form — he\'s the man to watch.', 'Isco has been the standout player in La Liga this week.']
      }})
    },
    {
      homeTeam: 'Getafe',          awayTeam: 'Barcelona',
      homeScore: 0,                awayScore: 0,
      status: 'upcoming',          league: 'La Liga',
      date: new Date('2026-04-25T18:30:00'),
      homeSentiment: 42, awaySentiment: 82,
      volatility: 0.55, momentum: 0.70, predictedScore: 0,
      psycheJSON: JSON.stringify({ preMatch: {
        preparation: ['Getafe will pack the defence — Bordalás masterclass expected.', 'Barcelona need to break down a deep block and avoid the counter.'],
        atmosphere: ['Coliseum Alfonso Pérez will be full — Getafe fans love a fight.', 'Travelled Barça fans expect their side to handle the pressure.'],
        media: ['"The toughest trip in La Liga?" — Sport.', '"Lamine Yamal is the key — if he doesn\'t show up, nobody else will" — Mundo Deportivo.'],
        players: ['Yamal vs the Getafe wall — can he unlock them again?', 'Greenwood (Getafe) scored the winner Wednesday — watch him on the break.']
      }})
    },
    {
      homeTeam: 'Atlético Madrid',  awayTeam: 'Athletic Club',
      homeScore: 0,                 awayScore: 0,
      status: 'upcoming',           league: 'La Liga',
      date: new Date('2026-04-25T22:00:00'),
      homeSentiment: 55, awaySentiment: 60,
      volatility: 0.65, momentum: 0.52, predictedScore: 0,
      psycheJSON: JSON.stringify({ preMatch: {
        preparation: ['Simeone will demand an immediate response after the Elche disaster.', 'Athletic Bilbao confident after back-to-back wins.'],
        atmosphere: ['Metropolitano will be tense — Atlético fans demanding answers.', 'Athletic away fans known for passionate support.'],
        media: ['"Atlético\'s season at a crossroads" — Marca.', '"Simeone will not be happy — major changes expected" — AS.'],
        players: ['Griezmann must step up and lead the recovery.', 'Álvarez is Atlético\'s go-to in moments of pressure — can he deliver?']
      }})
    },
  ]

  // ═══════════════════════════════════════════════════════════════════════════
  // PREMIER LEAGUE — MD33 Results (Apr 18–20) + MD34 Upcoming (Apr 24–27)
  // ═══════════════════════════════════════════════════════════════════════════

  const plMatches = [

    // ── MD33 RESULTS ──────────────────────────────────────────────────────────

    // Sat Apr 18
    {
      homeTeam: 'Brentford',       awayTeam: 'Fulham',
      homeScore: 0,                awayScore: 0,
      status: 'finished',          league: 'Premier League',
      date: new Date('2026-04-18T12:30:00'),
      homeSentiment: 50, awaySentiment: 50,
      volatility: 0.22, momentum: 0.48, predictedScore: 58,
      psycheJSON: JSON.stringify({ postMatch: {
        outcome: ['A scrappy London derby ends goalless at the Gtech Community Stadium.', 'A point each in a match that had very few real moments of quality.'],
        performance: ['Both teams cancelled each other out — no shots on target in the second half.', 'Flekken (Brentford) and Leno (Fulham) were rarely troubled.'],
        supporters: ['Mixed reaction from both sets of fans — both wanted more.', 'Respectful handshakes on the pitch — it was that kind of match.'],
        media: ['"Forgettable London derby" — The Guardian.', '"Neither side deserved to win" — Sky Sports.']
      }})
    },
    {
      homeTeam: 'Leeds United',    awayTeam: 'Wolverhampton',
      homeScore: 3,                awayScore: 0,
      status: 'finished',          league: 'Premier League',
      date: new Date('2026-04-18T15:00:00'),
      homeSentiment: 88, awaySentiment: 18,
      volatility: 0.58, momentum: 0.82, predictedScore: 90,
      psycheJSON: JSON.stringify({ postMatch: {
        outcome: ['Leeds run riot — 3-0 against a hapless Wolves.', 'Elland Road celebrates as Leeds move further up the table.'],
        performance: ['Two goals in the first 20 minutes put the game to bed.', 'Wolves showed no fight — their season is effectively over.'],
        supporters: ['Elland Road was absolutely rocking — best atmosphere of the season.', 'Fans singing "Marching On Together" long into the evening.'],
        media: ['"Leeds are flying" — BBC Sport.', '"Wolves in disarray — changes needed in the summer" — The Athletic.']
      }})
    },
    {
      homeTeam: 'Newcastle United', awayTeam: 'Bournemouth',
      homeScore: 1,                 awayScore: 2,
      status: 'finished',           league: 'Premier League',
      date: new Date('2026-04-18T15:00:00'),
      homeSentiment: 32, awaySentiment: 82,
      volatility: 0.72, momentum: 0.70, predictedScore: 78,
      psycheJSON: JSON.stringify({ postMatch: {
        outcome: ['Shock at St James\' Park — Bournemouth win 2-1 against Newcastle.', 'Newcastle\'s hopes of European qualification take a big hit.'],
        performance: ['Evanilson was unplayable — scored and assisted.', 'Newcastle were listless — the Howe era under scrutiny.'],
        supporters: ['St James\' Park gave their side a warm farewell — but there\'ll be hard questions asked.', 'Bournemouth\'s travelling support went wild.'],
        media: ['"Newcastle crisis deepens" — Chronicle Live.', '"Bournemouth\'s best away day of the season" — Bournemouth Echo.']
      }})
    },
    {
      homeTeam: 'Tottenham',       awayTeam: 'Brighton',
      homeScore: 2,                awayScore: 2,
      status: 'finished',          league: 'Premier League',
      date: new Date('2026-04-18T15:00:00'),
      homeSentiment: 55, awaySentiment: 58,
      volatility: 0.68, momentum: 0.52, predictedScore: 72,
      psycheJSON: JSON.stringify({ postMatch: {
        outcome: ['Spurs and Brighton share a frantic 2-2 draw at the Tottenham Hotspur Stadium.', 'Late Brighton equaliser denied Spurs all three points.'],
        performance: ['Son scored twice in the first half — was superb.', 'Mitoma was Brighton\'s hero — his equaliser in the 88th minute was devastating for Spurs.'],
        supporters: ['Stunned silence at the Tottenham Hotspur Stadium after Mitoma\'s equaliser.', 'Brighton fans bouncing in the away end.'],
        media: ['"Son was outstanding but Spurs couldn\'t hold on" — Evening Standard.', '"Mitoma at the death ruins Spurs\' night" — The Guardian.']
      }})
    },
    {
      homeTeam: 'Chelsea',         awayTeam: 'Man United',
      homeScore: 0,                awayScore: 1,
      status: 'finished',          league: 'Premier League',
      date: new Date('2026-04-18T17:30:00'),
      homeSentiment: 22, awaySentiment: 84,
      volatility: 0.56, momentum: 0.72, predictedScore: 76,
      psycheJSON: JSON.stringify({ postMatch: {
        outcome: ['Man United\'s season gets a major boost — a 1-0 win at Stamford Bridge.', 'Chelsea continue their poor home form.'],
        performance: ['Zirkzee\'s clinical 67th-minute finish was the difference.', 'Chelsea had the ball but created nothing — a tactical nightmare for Maresca.'],
        supporters: ['Stamford Bridge booed at full-time — Chelsea fans furious with the performance.', 'Man United away end in wild celebration — a result that keeps their season alive.'],
        media: ['"Chelsea in crisis — where is the attacking quality?" — Sky Sports.', '"United grind out a priceless win at the Bridge" — Manchester Evening News.']
      }})
    },

    // Sun Apr 19
    {
      homeTeam: 'Aston Villa',     awayTeam: 'Sunderland',
      homeScore: 4,                awayScore: 3,
      status: 'finished',          league: 'Premier League',
      date: new Date('2026-04-19T14:00:00'),
      homeSentiment: 85, awaySentiment: 62,
      volatility: 0.95, momentum: 0.78, predictedScore: 91,
      psycheJSON: JSON.stringify({ postMatch: {
        outcome: ['Seven-goal thriller at Villa Park — Aston Villa edge Sunderland 4-3.', 'An incredible match that had everything — lead changes, red cards, and late drama.'],
        performance: ['Watkins scored twice and set up another.', 'Sunderland were brave — they never stopped fighting.'],
        supporters: ['Villa Park gave this game a World Cup atmosphere.', 'Home fans were nervous right to the end despite the scoreline.'],
        media: ['"Villa Park classics continue — what a match" — The Athletic.', '"Sunderland gave everything but it wasn\'t enough" — Sunderland Echo.']
      }})
    },
    {
      homeTeam: 'Everton',         awayTeam: 'Liverpool',
      homeScore: 1,                awayScore: 2,
      status: 'finished',          league: 'Premier League',
      date: new Date('2026-04-19T16:30:00'),
      homeSentiment: 36, awaySentiment: 88,
      volatility: 0.74, momentum: 0.76, predictedScore: 85,
      psycheJSON: JSON.stringify({ postMatch: {
        outcome: ['Merseyside Derby goes to Liverpool — a 2-1 win at Goodison Park.', 'Liverpool keep pace with Man City at the top of the table.'],
        performance: ['Salah scored a trademark goal against his old club in the 71st minute.', 'Liverpool were the better side throughout — Everton couldn\'t live with their high press.'],
        supporters: ['An electric derby atmosphere at Goodison — one of the last derbies at the old ground.', 'Liverpool fans delirious at the final whistle.'],
        media: ['"Salah haunts Everton again" — Liverpool Echo.', '"Liverpool keep the title race alive" — BBC Sport.']
      }})
    },
    {
      homeTeam: 'Nottm Forest',    awayTeam: 'Burnley',
      homeScore: 4,                awayScore: 1,
      status: 'finished',          league: 'Premier League',
      date: new Date('2026-04-19T14:00:00'),
      homeSentiment: 90, awaySentiment: 14,
      volatility: 0.48, momentum: 0.82, predictedScore: 88,
      psycheJSON: JSON.stringify({ postMatch: {
        outcome: ['Nottingham Forest put already-relegated Burnley to the sword — 4-1.', 'Forest move to within touching distance of European football.'],
        performance: ['Awoniyi scored a hat-trick in a devastating first-half display.', 'Burnley were already beaten before half-time.'],
        supporters: ['The City Ground was electric — a feel-good night for Nottingham.', 'Burnley fans left early — a demoralising end to a tough season.'],
        media: ['"Awoniyi hat-trick sends Forest flying" — BBC Sport.', '"Burnley\'s miserable season reaches new lows" — The Athletic.']
      }})
    },
    {
      homeTeam: 'Man City',        awayTeam: 'Arsenal',
      homeScore: 2,                awayScore: 1,
      status: 'finished',          league: 'Premier League',
      date: new Date('2026-04-19T16:30:00'),
      homeSentiment: 90, awaySentiment: 55,
      volatility: 0.82, momentum: 0.80, predictedScore: 92,
      psycheJSON: JSON.stringify({ postMatch: {
        outcome: ['Pep Guardiola\'s Manchester City deal a devastating blow to Arsenal\'s title hopes — 2-1 at the Etihad.', 'Man City go top on goal difference — the title race is on a knife-edge.'],
        performance: ['Haaland and De Bruyne were the difference — both oozing class.', 'Arsenal fought hard but were undone by a killer counterattack in the 68th minute.'],
        supporters: ['The Etihad was rocking — the City faithful know their side is peaking at the right time.', 'Arsenal fans are gutted — they were in it until the end but couldn\'t find the equaliser.'],
        media: ['"Haaland sends City top" — The Guardian.', '"Arsenal\'s title dream fades at the Etihad" — The Times.', '"The title race is City\'s to lose" — BBC Sport.']
      }})
    },

    // Mon Apr 20
    {
      homeTeam: 'Crystal Palace',  awayTeam: 'West Ham',
      homeScore: 0,                awayScore: 0,
      status: 'finished',          league: 'Premier League',
      date: new Date('2026-04-20T20:00:00'),
      homeSentiment: 48, awaySentiment: 46,
      volatility: 0.18, momentum: 0.44, predictedScore: 52,
      psycheJSON: JSON.stringify({ postMatch: {
        outcome: ['0-0 draw at Selhurst Park — neither side with enough to win.', 'A result that suits nobody in the mid-table scrap.'],
        performance: ['Both goalkeepers were the best players on the pitch.', 'A low-energy game that never truly got going.'],
        supporters: ['Home fans left in near silence.', 'West Ham fans fairly happy with a point on the road.'],
        media: ['"A match to forget" — The Independent.', '"Both sides lack the quality to push into the top half" — The Athletic.']
      }})
    },

    // Tue Apr 22
    {
      homeTeam: 'Burnley',         awayTeam: 'Man City',
      homeScore: 0,                awayScore: 1,
      status: 'finished',          league: 'Premier League',
      date: new Date('2026-04-22T20:00:00'),
      homeSentiment: 12, awaySentiment: 92,
      volatility: 0.22, momentum: 0.85, predictedScore: 92,
      psycheJSON: JSON.stringify({ postMatch: {
        outcome: ['Man City keep up the pressure — Haaland\'s early goal enough to win at Turf Moor.', 'City now top and relentlessly chasing the title.'],
        performance: ['Haaland pounced in the 5th minute — instinctive, ruthless.', 'City\'s professionalised the game and saw it out with ease.'],
        supporters: ['Burnley fans applauded their relegated side off the pitch with dignity.', 'City fans — the many who made the trip North — were delirious.'],
        media: ['"Haaland again — Man City are relentless" — Sky Sports.', '"Turf Moor bids farewell to the top flight" — The Athletic.']
      }})
    },

    // ── MD34 UPCOMING — Apr 24–27 ─────────────────────────────────────────────

    {
      homeTeam: 'Sunderland',      awayTeam: 'Nottm Forest',
      homeScore: 0,                awayScore: 0,
      status: 'upcoming',          league: 'Premier League',
      date: new Date('2026-04-24T20:00:00'),
      homeSentiment: 48, awaySentiment: 68,
      volatility: 0.42, momentum: 0.58, predictedScore: 0,
      psycheJSON: JSON.stringify({ preMatch: {
        preparation: ['Sunderland need to bounce back from the heavy Villa Park loss.', 'Forest riding high after thrashing Burnley — full of confidence.'],
        atmosphere: ['The Stadium of Light under the floodlights — always a great atmosphere.', 'Forest away fans expected in good numbers.'],
        media: ['"Sunderland must respond" — Sunderland Echo.', '"Forest can make it five wins from seven" — Nottingham Post.'],
        players: ['Awoniyi hat-trick hero — can he do it again?', 'Sunderland\'s Eliezer Mayenda needs to step up.']
      }})
    },
    {
      homeTeam: 'Fulham',          awayTeam: 'Aston Villa',
      homeScore: 0,                awayScore: 0,
      status: 'upcoming',          league: 'Premier League',
      date: new Date('2026-04-25T12:30:00'),
      homeSentiment: 52, awaySentiment: 72,
      volatility: 0.48, momentum: 0.58, predictedScore: 0,
      psycheJSON: JSON.stringify({ preMatch: {
        preparation: ['Fulham looking to build on the Brentford draw.', 'Villa in red-hot form after the 4-3 thriller.'],
        atmosphere: ['Craven Cottage on a Saturday lunchtime — a Premier League classic setting.', 'Villa will travel in numbers.'],
        media: ['"Fulham vs Villa — a clash of two sides with European ambitions" — Sky Sports.', '"Watkins is the man to watch" — The Athletic.'],
        players: ['Ollie Watkins in blistering four-goal form this week.', 'Raúl Jiménez leads the Fulham attack and needs a big game.']
      }})
    },
    {
      homeTeam: 'Liverpool',       awayTeam: 'Crystal Palace',
      homeScore: 0,                awayScore: 0,
      status: 'upcoming',          league: 'Premier League',
      date: new Date('2026-04-25T15:00:00'),
      homeSentiment: 80, awaySentiment: 38,
      volatility: 0.38, momentum: 0.72, predictedScore: 0,
      psycheJSON: JSON.stringify({ preMatch: {
        preparation: ['Liverpool need to win and hope Man City slip up.', 'Palace fighting for survival — every point matters.'],
        atmosphere: ['Anfield Saturday afternoon — electric as always.', 'Palace will have a small but vocal away following.'],
        media: ['"Salah must deliver again" — Liverpool Echo.', '"Palace need a miracle to survive" — Sky Sports.', '"The Anfield factor — can Palace cope?" — The Athletic.'],
        players: ['Mohamed Salah eyeing his 25th league goal of the season.', 'Eberechi Eze is Palace\'s only chance of an upset.']
      }})
    },
    {
      homeTeam: 'Arsenal',         awayTeam: 'Newcastle United',
      homeScore: 0,                awayScore: 0,
      status: 'upcoming',          league: 'Premier League',
      date: new Date('2026-04-25T17:30:00'),
      homeSentiment: 72, awaySentiment: 48,
      volatility: 0.55, momentum: 0.60, predictedScore: 0,
      psycheJSON: JSON.stringify({ preMatch: {
        preparation: ['Arsenal must win to keep title pressure on Man City. No room for error.', 'Newcastle desperate to get back to winning ways after the Bournemouth loss.'],
        atmosphere: ['The Emirates is fired up — Arsenal fans know this is a must-win.', 'Newcastle travelling support will be vocal — they always are.'],
        media: ['"Arsenal\'s title must win — Arteta doesn\'t need to say it but everyone knows" — The Guardian.', '"Newcastle must respond after the Bournemouth embarrassment" — Chronicle Live.'],
        players: ['Saka is the key — Arsenal need him at his electric best.', 'Isak will be a handful — he\'s been excellent all season for Newcastle.']
      }})
    },
    {
      homeTeam: 'Man United',      awayTeam: 'Brentford',
      homeScore: 0,                awayScore: 0,
      status: 'upcoming',          league: 'Premier League',
      date: new Date('2026-04-27T20:00:00'),
      homeSentiment: 62, awaySentiment: 55,
      volatility: 0.45, momentum: 0.58, predictedScore: 0,
      psycheJSON: JSON.stringify({ preMatch: {
        preparation: ['United riding high after the Chelsea win — confidence is returning.', 'Brentford are in good mid-table form.'],
        atmosphere: ['Old Trafford under the lights — a proper Monday night football feel.', 'Brentford away fans always bring noise to Old Trafford.'],
        media: ['"Can United build on the Chelsea win?" — Manchester Evening News.', '"Brentford have nothing to fear at Old Trafford" — The Athletic.'],
        players: ['Zirkzee was the match-winner last week — can he do it again?', 'Bryan Mbeumo will be Brentford\'s danger man.']
      }})
    },
  ]

  // Insert all matches
  let count = 0
  for (const match of [...laLigaMatches, ...plMatches]) {
    await prisma.match.create({ data: match })
    count++
  }

  console.log(`✅ Added ${count} matches (${laLigaMatches.length} La Liga + ${plMatches.length} Premier League)`)
}

main()
  .catch(err => { console.error(err); process.exit(1) })
  .finally(() => prisma.$disconnect())
