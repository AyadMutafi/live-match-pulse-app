import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.sentiment.deleteMany()
  await prisma.agentActivity.deleteMany()
  await prisma.match.deleteMany()
  await prisma.player.deleteMany()
  await prisma.dataSource.deleteMany()

  // ─── PLAYERS ────────────────────────────────────────────────────────────────
  // UCL 2025-26 Semi-finalists: PSG, Bayern Munich, Arsenal, Atlético Madrid
  const players = await Promise.all([
    // ── FORWARDS ──
    prisma.player.create({ data: { name: 'Ousmane Dembélé', team: 'PSG', position: 'RW', sentiment: 93, tweets: 41000, aiConfidence: 94, form: '🔥😍🔥🔥😍', lastUpdated: new Date('2026-04-23') } }),
    prisma.player.create({ data: { name: 'Bradley Barcola', team: 'PSG', position: 'LW', sentiment: 88, tweets: 29000, aiConfidence: 91, form: '🔥😍🔥🙂🔥', lastUpdated: new Date('2026-04-23') } }),
    prisma.player.create({ data: { name: 'Harry Kane', team: 'Bayern Munich', position: 'ST', sentiment: 91, tweets: 52000, aiConfidence: 95, form: '🔥🔥😍🔥😍', lastUpdated: new Date('2026-04-23') } }),
    prisma.player.create({ data: { name: 'Leroy Sané', team: 'Bayern Munich', position: 'RW', sentiment: 82, tweets: 24000, aiConfidence: 88, form: '🙂🔥🔥😍🙂', lastUpdated: new Date('2026-04-23') } }),
    prisma.player.create({ data: { name: 'Bukayo Saka', team: 'Arsenal', position: 'RW', sentiment: 94, tweets: 58000, aiConfidence: 96, form: '🔥😍🔥😍🔥', lastUpdated: new Date('2026-04-23') } }),
    prisma.player.create({ data: { name: 'Leandro Trossard', team: 'Arsenal', position: 'LW', sentiment: 84, tweets: 21000, aiConfidence: 89, form: '🔥🙂🔥😍🔥', lastUpdated: new Date('2026-04-23') } }),
    prisma.player.create({ data: { name: 'Antoine Griezmann', team: 'Atlético Madrid', position: 'ST', sentiment: 87, tweets: 43000, aiConfidence: 92, form: '😍🔥😍🔥🙂', lastUpdated: new Date('2026-04-23') } }),
    prisma.player.create({ data: { name: 'Julián Álvarez', team: 'Atlético Madrid', position: 'CF', sentiment: 85, tweets: 37000, aiConfidence: 91, form: '🔥😍🔥🙂🔥', lastUpdated: new Date('2026-04-23') } }),

    // ── MIDFIELDERS ──
    prisma.player.create({ data: { name: 'Vitinha', team: 'PSG', position: 'CM', sentiment: 86, tweets: 18000, aiConfidence: 90, form: '🔥🙂🔥😍🔥', lastUpdated: new Date('2026-04-23') } }),
    prisma.player.create({ data: { name: 'Fabian Ruiz', team: 'PSG', position: 'CM', sentiment: 83, tweets: 16000, aiConfidence: 88, form: '🙂🔥🙂🔥😍', lastUpdated: new Date('2026-04-23') } }),
    prisma.player.create({ data: { name: 'Joshua Kimmich', team: 'Bayern Munich', position: 'CM', sentiment: 89, tweets: 34000, aiConfidence: 93, form: '🔥😍🔥🙂🔥', lastUpdated: new Date('2026-04-23') } }),
    prisma.player.create({ data: { name: 'Leon Goretzka', team: 'Bayern Munich', position: 'CM', sentiment: 78, tweets: 19000, aiConfidence: 85, form: '🙂🔥🙂🙂🔥', lastUpdated: new Date('2026-04-23') } }),
    prisma.player.create({ data: { name: 'Martin Ødegaard', team: 'Arsenal', position: 'CAM', sentiment: 92, tweets: 46000, aiConfidence: 94, form: '😍🔥😍🔥😍', lastUpdated: new Date('2026-04-23') } }),
    prisma.player.create({ data: { name: 'Declan Rice', team: 'Arsenal', position: 'CM', sentiment: 88, tweets: 31000, aiConfidence: 91, form: '🔥🙂🔥😍🔥', lastUpdated: new Date('2026-04-23') } }),
    prisma.player.create({ data: { name: 'Rodrigo De Paul', team: 'Atlético Madrid', position: 'CM', sentiment: 81, tweets: 20000, aiConfidence: 87, form: '🙂🔥🙂🔥🙂', lastUpdated: new Date('2026-04-23') } }),
    prisma.player.create({ data: { name: 'Koke', team: 'Atlético Madrid', position: 'CM', sentiment: 76, tweets: 14000, aiConfidence: 84, form: '😐🙂🔥🙂🙂', lastUpdated: new Date('2026-04-23') } }),

    // ── DEFENDERS ──
    prisma.player.create({ data: { name: 'Marquinhos', team: 'PSG', position: 'CB', sentiment: 85, tweets: 22000, aiConfidence: 91, form: '🔥🙂🔥🙂🔥', lastUpdated: new Date('2026-04-23') } }),
    prisma.player.create({ data: { name: 'Nuno Mendes', team: 'PSG', position: 'LB', sentiment: 80, tweets: 14000, aiConfidence: 88, form: '🙂🔥🙂🔥🙂', lastUpdated: new Date('2026-04-23') } }),
    prisma.player.create({ data: { name: 'Dayot Upamecano', team: 'Bayern Munich', position: 'CB', sentiment: 79, tweets: 17000, aiConfidence: 86, form: '🙂🔥🙂🙂🔥', lastUpdated: new Date('2026-04-23') } }),
    prisma.player.create({ data: { name: 'Alphonso Davies', team: 'Bayern Munich', position: 'LB', sentiment: 84, tweets: 25000, aiConfidence: 90, form: '🔥🙂🔥🙂😍', lastUpdated: new Date('2026-04-23') } }),
    prisma.player.create({ data: { name: 'William Saliba', team: 'Arsenal', position: 'CB', sentiment: 90, tweets: 28000, aiConfidence: 93, form: '🔥😍🔥🔥🙂', lastUpdated: new Date('2026-04-23') } }),
    prisma.player.create({ data: { name: 'Ben White', team: 'Arsenal', position: 'RB', sentiment: 83, tweets: 19000, aiConfidence: 89, form: '🙂🔥🙂🔥🔥', lastUpdated: new Date('2026-04-23') } }),
    prisma.player.create({ data: { name: 'José María Giménez', team: 'Atlético Madrid', position: 'CB', sentiment: 82, tweets: 16000, aiConfidence: 88, form: '🔥🙂🔥🙂🔥', lastUpdated: new Date('2026-04-23') } }),
    prisma.player.create({ data: { name: 'Marcos Llorente', team: 'Atlético Madrid', position: 'RB', sentiment: 78, tweets: 13000, aiConfidence: 85, form: '🙂🔥🙂🙂🔥', lastUpdated: new Date('2026-04-23') } }),

    // ── GOALKEEPERS ──
    prisma.player.create({ data: { name: 'Gianluigi Donnarumma', team: 'PSG', position: 'GK', sentiment: 87, tweets: 24000, aiConfidence: 92, form: '🔥😍🔥😍🔥', lastUpdated: new Date('2026-04-23') } }),
    prisma.player.create({ data: { name: 'Manuel Neuer', team: 'Bayern Munich', position: 'GK', sentiment: 85, tweets: 21000, aiConfidence: 91, form: '😍🔥🙂🔥😍', lastUpdated: new Date('2026-04-23') } }),
    prisma.player.create({ data: { name: 'David Raya', team: 'Arsenal', position: 'GK', sentiment: 89, tweets: 18000, aiConfidence: 93, form: '🔥😍🔥😍🔥', lastUpdated: new Date('2026-04-23') } }),
    prisma.player.create({ data: { name: 'Jan Oblak', team: 'Atlético Madrid', position: 'GK', sentiment: 88, tweets: 22000, aiConfidence: 94, form: '🔥🔥😍🔥😍', lastUpdated: new Date('2026-04-23') } }),
  ])

  // ─── MATCHES ─────────────────────────────────────────────────────────────────
  // UCL 2025-26 Quarter-finals (all finished) + Semi-finals (upcoming)
  const matches = await Promise.all([

    // ══ QF FIRST LEGS — Apr 7/8, 2026 ══

    // PSG 2-0 Liverpool (Apr 7)
    prisma.match.create({
      data: {
        homeTeam: 'PSG',
        awayTeam: 'Liverpool',
        homeScore: 2,
        awayScore: 0,
        status: 'finished',
        league: 'Champions League',
        date: new Date('2026-04-07T21:00:00'),
        aggregateHome: 2,
        aggregateAway: 0,
        homeSentiment: 96,
        awaySentiment: 24,
        volatility: 0.38,
        momentum: 0.82,
        predictedScore: 85,
        psycheJSON: JSON.stringify({
          postMatch: {
            outcome: ['Commanding 2-0 home victory at Parc des Princes.', 'PSG hold a significant advantage heading into the second leg.'],
            performance: ["Dembélé was lethal — two assists and constant trickery.", 'Donnarumma produced a 9-save masterclass to keep Liverpool scoreless.'],
            supporters: ['Parc des Princes was a wall of noise all night.', 'Fans chanting "On va gagner" deep into stoppage time.'],
            media: ["'PSG look unstoppable' — L'Equipe gave Dembélé a 9.5 rating.", "Liverpool's high line was ruthlessly exposed."]
          }
        })
      }
    }),

    // Real Madrid 1-2 Bayern (Apr 8)
    prisma.match.create({
      data: {
        homeTeam: 'Real Madrid',
        awayTeam: 'Bayern Munich',
        homeScore: 1,
        awayScore: 2,
        status: 'finished',
        league: 'Champions League',
        date: new Date('2026-04-08T21:00:00'),
        aggregateHome: 1,
        aggregateAway: 2,
        homeSentiment: 28,
        awaySentiment: 86,
        volatility: 0.72,
        momentum: 0.65,
        predictedScore: 78,
        psycheJSON: JSON.stringify({
          postMatch: {
            outcome: ['Shock result at the Bernabéu — Bayern take a 2-1 first-leg lead.', "Madrid leave it all to play for in Munich's return."],
            performance: ['Kane scored twice from the penalty spot.', "Vinícius was isolated all night — Madrid's build-up was stifled."],
            supporters: ['Stunned silence at the Bernabéu at full-time.', 'Fans quickly rallied, starting "¡Vamos Real!" chants regardless.'],
            media: ["'Crisis at the Bernabéu?' — Marca asked the big questions.", "'Bayern are back' — Bild declared across the back page."]
          }
        })
      }
    }),

    // Atlético Madrid 2-0 Barcelona (Apr 7)
    prisma.match.create({
      data: {
        homeTeam: 'Atlético Madrid',
        awayTeam: 'Barcelona',
        homeScore: 2,
        awayScore: 0,
        status: 'finished',
        league: 'Champions League',
        date: new Date('2026-04-07T21:00:00'),
        aggregateHome: 2,
        aggregateAway: 0,
        homeSentiment: 92,
        awaySentiment: 18,
        volatility: 0.55,
        momentum: 0.75,
        predictedScore: 88,
        psycheJSON: JSON.stringify({
          postMatch: {
            outcome: ['Simeone masterclass — Atlético stifle Barcelona 2-0 at the Metropolitano.', "Barça face a mountain in the Camp Nou return."],
            performance: ['Álvarez pounced on two defensive errors.', "Oblak barely had a save to make — Barcelona's attack was neutered."],
            supporters: ['The Metropolitano was ferocious. Police praised fan conduct.', "Colchoneros singing 'Atleti campeón' before the final whistle."],
            media: ["'Simeone does it again' — AS gave M.Ángel special edition front page.", "'Barcelona were a ghost of themselves' — Sport."]
          }
        })
      }
    }),

    // Arsenal 1-0 Sporting CP (Apr 8)
    prisma.match.create({
      data: {
        homeTeam: 'Arsenal',
        awayTeam: 'Sporting CP',
        homeScore: 1,
        awayScore: 0,
        status: 'finished',
        league: 'Champions League',
        date: new Date('2026-04-08T21:00:00'),
        aggregateHome: 1,
        aggregateAway: 0,
        homeSentiment: 86,
        awaySentiment: 42,
        volatility: 0.42,
        momentum: 0.61,
        predictedScore: 72,
        psycheJSON: JSON.stringify({
          postMatch: {
            outcome: ['Narrow but controlled 1-0 win for Arsenal at the Emirates.', "Saka's late winner gives Arsenal a slender lead to defend."],
            performance: ["Ødegaard's pressing game was relentless.", 'Raya produced crucial saves as Sporting grew into the game.'],
            supporters: ["The Emirates roared at Saka's winning goal.", 'Gunners supporters growing in confidence ahead of Lisbon.'],
            media: ["'Scrappy but effective' — The Guardian on Arsenal's UCL display.", "'Sporting made them work for it' — The Athletic."]
          }
        })
      }
    }),

    // ══ QF SECOND LEGS — Apr 14/15, 2026 ══

    // Liverpool 0-2 PSG (Apr 14) — PSG win 4-0 on agg
    prisma.match.create({
      data: {
        homeTeam: 'Liverpool',
        awayTeam: 'PSG',
        homeScore: 0,
        awayScore: 2,
        status: 'finished',
        league: 'Champions League',
        date: new Date('2026-04-14T21:00:00'),
        aggregateHome: 0,
        aggregateAway: 4,
        homeSentiment: 12,
        awaySentiment: 97,
        volatility: 0.21,
        momentum: 0.91,
        predictedScore: 95,
        psycheJSON: JSON.stringify({
          postMatch: {
            outcome: ['Complete annihilation — PSG win 4-0 on aggregate.', "Liverpool couldn't land a single punch across both legs."],
            performance: ['Barcola tore the Anfield crowd apart with two clinical finishes.', "Klopp's men created chances but Donnarumma was a wall."],
            supporters: ['Anfield fell eerily silent after the second goal.', "PSG's away fans celebrated as if they'd won the final."],
            media: ["'The French juggernaut rolls on' — BBC Sport.", "'Liverpool must rebuild their UCL mentality' — The Times."]
          }
        })
      }
    }),

    // Bayern 4-3 Real Madrid (Apr 15) — Bayern win 6-4 on agg
    prisma.match.create({
      data: {
        homeTeam: 'Bayern Munich',
        awayTeam: 'Real Madrid',
        homeScore: 4,
        awayScore: 3,
        status: 'finished',
        league: 'Champions League',
        date: new Date('2026-04-15T21:00:00'),
        aggregateHome: 6,
        aggregateAway: 4,
        homeSentiment: 89,
        awaySentiment: 72,
        volatility: 0.97,
        momentum: 0.78,
        predictedScore: 93,
        psycheJSON: JSON.stringify({
          postMatch: {
            outcome: ['Thriller! Bayern edge through 6-4 on aggregate in a seven-goal Allianz classic.', "Real Madrid fought to the end but Bayern's quality was decisive."],
            performance: ['Kane hat-trick in Munich. Vinícius scored a brace but it was not enough.', 'This will be remembered as one of the great UCL ties.'],
            supporters: ['Allianz Arena erupted at full-time — a night for the ages.', "Madridistas applauded their team off despite the elimination."],
            media: ["'Kane ends Madrid's European dream' — Daily Telegraph.", "'A UCL classic for the history books' — Marca, even in defeat."]
          }
        })
      }
    }),

    // Barcelona 2-1 Atlético Madrid (Apr 15) — Atlético win 3-2 on agg
    prisma.match.create({
      data: {
        homeTeam: 'Barcelona',
        awayTeam: 'Atlético Madrid',
        homeScore: 2,
        awayScore: 1,
        status: 'finished',
        league: 'Champions League',
        date: new Date('2026-04-15T21:00:00'),
        aggregateHome: 2,
        aggregateAway: 3,
        homeSentiment: 55,
        awaySentiment: 79,
        volatility: 0.81,
        momentum: 0.69,
        predictedScore: 88,
        psycheJSON: JSON.stringify({
          postMatch: {
            outcome: ['Barcelona win on the night 2-1 but Atlético advance 3-2 on aggregate.', "Lamine Yamal inspired a remarkable comeback but it came just too late."],
            performance: ["Yamal was electric — two goals and constant pressure.", "Oblak's single save was enough to seal Atlético's place in the semis."],
            supporters: ['Camp Nou created a breathless atmosphere for the comeback attempt.', "Colchoneros faithful celebrated wildly at the final whistle."],
            media: ["'So close, yet so far for Barça' — Mundo Deportivo.", "'Atlético heart — the Simeone way' — AS."]
          }
        })
      }
    }),

    // Arsenal 0-0 Sporting CP (Apr 15) — Arsenal win 1-0 on agg
    prisma.match.create({
      data: {
        homeTeam: 'Arsenal',
        awayTeam: 'Sporting CP',
        homeScore: 0,
        awayScore: 0,
        status: 'finished',
        league: 'Champions League',
        date: new Date('2026-04-15T21:00:00'),
        aggregateHome: 1,
        aggregateAway: 0,
        homeSentiment: 78,
        awaySentiment: 61,
        volatility: 0.29,
        momentum: 0.54,
        predictedScore: 71,
        psycheJSON: JSON.stringify({
          postMatch: {
            outcome: ['Arsenal hold firm 0-0 in Lisbon to advance 1-0 on aggregate.', "Disciplined defensive display from Arteta's men under relentless Sporting pressure."],
            performance: ["Raya was outstanding — his best UCL performance for Arsenal.", "Saliba and White were immense at the back. Arsenal barely broke a sweat in the final 20 minutes."],
            supporters: ['A nervous night for the Gunners faithful watching back home.', 'Relief and jubilation in equal measure among the away end in Lisbon.'],
            media: ["'Ugly but who cares — Arsenal are in the semis!' — The Athletic.", "'Raya sends Arsenal through' — Evening Standard."]
          }
        })
      }
    }),

    // ══ SEMI-FINALS — UPCOMING ══

    // PSG vs Bayern Munich — Apr 28, 2026 (SF First Leg)
    prisma.match.create({
      data: {
        homeTeam: 'PSG',
        awayTeam: 'Bayern Munich',
        homeScore: 0,
        awayScore: 0,
        status: 'upcoming',
        league: 'Champions League',
        date: new Date('2026-04-28T21:00:00'),
        aggregateHome: 0,
        aggregateAway: 0,
        homeSentiment: 71,
        awaySentiment: 68,
        volatility: 0.62,
        momentum: 0.55,
        predictedScore: 0,
        psycheJSON: JSON.stringify({
          preMatch: {
            preparation: ['PSG drilling tactical press triggers to suffocate Bayern in midfield.', "Kompany's Bayern focusing on Kane's movement to exploit PSG's high defensive line."],
            atmosphere: ['Parc des Princes preparing for its biggest night of the season.', "Bayern's red wave expected to fill the away section in Paris."],
            media: ["'The clash of Europe's giants' — L'Equipe goes full colour on the SF preview.", "'Can Kane be the hero again?' — Bild special edition."],
            players: ['Dembélé has been PSG\'s match-winner all tournament — can he repeat?', 'Kane is the UCL\'s top scorer this season with 11 goals. All eyes on him in Paris.']
          }
        })
      }
    }),

    // Atlético Madrid vs Arsenal — Apr 29, 2026 (SF First Leg)
    prisma.match.create({
      data: {
        homeTeam: 'Atlético Madrid',
        awayTeam: 'Arsenal',
        homeScore: 0,
        awayScore: 0,
        status: 'upcoming',
        league: 'Champions League',
        date: new Date('2026-04-29T21:00:00'),
        aggregateHome: 0,
        aggregateAway: 0,
        homeSentiment: 64,
        awaySentiment: 73,
        volatility: 0.58,
        momentum: 0.61,
        predictedScore: 0,
        psycheJSON: JSON.stringify({
          preMatch: {
            preparation: ['Simeone running intense set-piece drills — Atlético plan to stifle Arsenal in the first leg.', "Arteta's team focusing on pressing high and creating overloads on the flanks."],
            atmosphere: ['The Metropolitano will be an absolute fortress. 68,000 red-and-white faithful.', 'A small but vocal Arsenal away following is expected in Madrid.'],
            media: ["'The tactical chess match of the decade' — Marca previews the tactical battle.", "'Can Arsenal go all the way?' — BBC Sport full feature.", "'Oblak vs Raya — the goalkeeper battle that could decide the tie' — The Athletic."],
            players: ['Saka vs Llorente — the right-flank battle everyone is watching.', "Griezmann is Atlético's talisman. He loves the big occasion.", "Ødegaard needs a captain's performance — Arsenal need him badly at his best."]
          }
        })
      }
    }),

    // ══ SF SECOND LEGS — UPCOMING (shown as further fixtures) ══

    // Arsenal vs Atlético Madrid — May 5, 2026
    prisma.match.create({
      data: {
        homeTeam: 'Arsenal',
        awayTeam: 'Atlético Madrid',
        homeScore: 0,
        awayScore: 0,
        status: 'upcoming',
        league: 'Champions League',
        date: new Date('2026-05-05T21:00:00'),
        aggregateHome: 0,
        aggregateAway: 0,
        homeSentiment: 0,
        awaySentiment: 0,
        volatility: 0,
        momentum: 0,
        predictedScore: 0,
        psycheJSON: JSON.stringify({
          preMatch: {
            preparation: ['Second leg TBC — dependent on first leg result.'],
            atmosphere: ['The Emirates awaits — what a night this could be.'],
            media: ["'UCL SF Second Leg — Arsenal vs Atlético' — fixtures confirmed by UEFA."],
            players: ['Full team news and preview available after the April 29 first leg.']
          }
        })
      }
    }),

    // Bayern Munich vs PSG — May 6, 2026
    prisma.match.create({
      data: {
        homeTeam: 'Bayern Munich',
        awayTeam: 'PSG',
        homeScore: 0,
        awayScore: 0,
        status: 'upcoming',
        league: 'Champions League',
        date: new Date('2026-05-06T21:00:00'),
        aggregateHome: 0,
        aggregateAway: 0,
        homeSentiment: 0,
        awaySentiment: 0,
        volatility: 0,
        momentum: 0,
        predictedScore: 0,
        psycheJSON: JSON.stringify({
          preMatch: {
            preparation: ['Second leg TBC — dependent on first leg result.'],
            atmosphere: ['The Allianz Arena roars again — Munich prepares for a European classic.'],
            media: ["'UCL SF Second Leg — Bayern vs PSG' — fixtures confirmed by UEFA."],
            players: ['Full team news and preview available after the April 28 first leg.']
          }
        })
      }
    }),
  ])

  // ─── SENTIMENTS ──────────────────────────────────────────────────────────────
  // Seed recent community sentiment for key matches & players
  // (abbreviated — API will populate dynamically)

  // ─── DATA SOURCES ────────────────────────────────────────────────────────────
  await Promise.all([
    prisma.dataSource.create({ data: { name: 'Fabrizio Romano', type: 'twitter', url: 'https://twitter.com/FabrizioRomano', account: '@FabrizioRomano', isActive: true, clubId: null } }),
    prisma.dataSource.create({ data: { name: 'OptaJoe', type: 'twitter', url: 'https://twitter.com/OptaJoe', account: '@OptaJoe', isActive: true, clubId: null } }),
    prisma.dataSource.create({ data: { name: 'UCL Official', type: 'twitter', url: 'https://twitter.com/ChampionsLeague', account: '@ChampionsLeague', isActive: true, clubId: null } }),
    prisma.dataSource.create({ data: { name: 'PSG Official', type: 'twitter', url: 'https://twitter.com/PSG_English', account: '@PSG_English', isActive: true, clubId: 'psg' } }),
    prisma.dataSource.create({ data: { name: 'Arsenal Official', type: 'twitter', url: 'https://twitter.com/Arsenal', account: '@Arsenal', isActive: true, clubId: 'arsenal' } }),
    prisma.dataSource.create({ data: { name: 'Bayern Munich Official', type: 'twitter', url: 'https://twitter.com/FCBayernEN', account: '@FCBayernEN', isActive: true, clubId: 'bayern' } }),
    prisma.dataSource.create({ data: { name: 'Atletico Madrid Official', type: 'twitter', url: 'https://twitter.com/atletienglish', account: '@atletienglish', isActive: true, clubId: 'atletico' } }),
    prisma.dataSource.create({ data: { name: 'BBC Sport UCL', type: 'web', url: 'https://bbc.co.uk/sport/football/european/champions-league', isActive: true } }),
    prisma.dataSource.create({ data: { name: 'L\'Equipe', type: 'web', url: 'https://www.lequipe.fr/Football/Ligue-des-champions', isActive: true } }),
    prisma.dataSource.create({ data: { name: '#UCL', type: 'hashtag', url: 'https://twitter.com/hashtag/UCL', hashtag: '#UCL', isActive: true } }),
    prisma.dataSource.create({ data: { name: '#PSGBayern', type: 'hashtag', url: 'https://twitter.com/hashtag/PSGBayern', hashtag: '#PSGBayern', isActive: true } }),
    prisma.dataSource.create({ data: { name: '#AtletiArsenal', type: 'hashtag', url: 'https://twitter.com/hashtag/AtletiArsenal', hashtag: '#AtletiArsenal', isActive: true } }),
  ])

  // ─── AGENT ACTIVITY LOG ──────────────────────────────────────────────────────
  // Seed some realistic recent agent activity
  await Promise.all([
    prisma.agentActivity.create({ data: { agent: 'Scout', action: 'scrape_source', target: '@ChampionsLeague', status: 'success', message: 'Scraped 47 posts — UCL semi-final draw confirmed coverage', timestamp: new Date('2026-04-23T08:30:00') } }),
    prisma.agentActivity.create({ data: { agent: 'Scout', action: 'scrape_source', target: '@FabrizioRomano', status: 'success', message: 'Scraped 12 posts — Kane injury update (training normal), Dembélé fitness cleared', timestamp: new Date('2026-04-23T08:15:00') } }),
    prisma.agentActivity.create({ data: { agent: 'Scout', action: 'scrape_source', target: '#PSGBayern', status: 'success', message: 'Scraped 238 posts — fan sentiment trending positive for PSG home advantage', timestamp: new Date('2026-04-23T07:45:00') } }),
    prisma.agentActivity.create({ data: { agent: 'Scout', action: 'scrape_source', target: '#AtletiArsenal', status: 'success', message: 'Scraped 195 posts — Saka fitness rated "key storyline" by fans', timestamp: new Date('2026-04-23T07:30:00') } }),
    prisma.agentActivity.create({ data: { agent: 'Analyst', action: 'analyze_sentiment', target: 'PSG vs Bayern Munich', status: 'success', message: 'Sentiment scores updated. PSG 71%, Bayern 68%. High volatility pre-match.', timestamp: new Date('2026-04-23T08:00:00') } }),
    prisma.agentActivity.create({ data: { agent: 'Analyst', action: 'analyze_sentiment', target: 'Atlético Madrid vs Arsenal', status: 'success', message: 'Sentiment scores updated. Atlético 64%, Arsenal 73%. Arsenal fan optimism high.', timestamp: new Date('2026-04-23T08:05:00') } }),
    prisma.agentActivity.create({ data: { agent: 'Journalist', action: 'publish_intel', target: 'UCL Semi-Final Preview', status: 'success', message: 'Two SF preview reports published. Covers PSG-Bayern tactical edge & Atleti defensive setup.', timestamp: new Date('2026-04-23T09:00:00') } }),
  ])

  console.log(`✅ Seeded ${players.length} players and ${matches.length} matches`)
  console.log('🏆 UCL 2025-26: Semi-finalists — PSG, Bayern Munich, Arsenal, Atlético Madrid')
  console.log('📅 Today: April 23, 2026 | Next up: PSG vs Bayern (Apr 28), Atlético vs Arsenal (Apr 29)')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
