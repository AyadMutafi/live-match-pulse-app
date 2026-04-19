import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.sentiment.deleteMany()
  await prisma.match.deleteMany()
  await prisma.player.deleteMany()

  // Create players with correct UCL data
  const players = await Promise.all([
    // FORWARDS
    prisma.player.create({ data: { name: 'Vinícius Júnior', team: 'Real Madrid', position: 'LW', sentiment: 94, tweets: 45000, aiConfidence: 95, form: '🔥🔥😍🔥🔥' } }),
    prisma.player.create({ data: { name: 'Eberechi Eze', team: 'Arsenal', position: 'CAM', sentiment: 88, tweets: 28000, aiConfidence: 92, form: '😍🔥🙂😍🔥' } }),
    prisma.player.create({ data: { name: 'Kylian Mbappé', team: 'Real Madrid', position: 'RW', sentiment: 78, tweets: 62000, aiConfidence: 90, form: '🙂😍🔥🙂😍' } }),
    prisma.player.create({ data: { name: 'Robert Lewandowski', team: 'Barcelona', position: 'ST', sentiment: 72, tweets: 35000, aiConfidence: 88, form: '🙂🙂😍😐🙂' } }),
    prisma.player.create({ data: { name: 'Mohamed Salah', team: 'Liverpool', position: 'RW', sentiment: 85, tweets: 58000, aiConfidence: 93, form: '🔥😍🔥😍🔥' } }),
    prisma.player.create({ data: { name: 'Lamine Yamal', team: 'Barcelona', position: 'RW', sentiment: 91, tweets: 31000, aiConfidence: 94, form: '🔥😍🔥😍🔥' } }),

    // MIDFIELDERS
    prisma.player.create({ data: { name: 'Jude Bellingham', team: 'Real Madrid', position: 'CM', sentiment: 92, tweets: 55000, aiConfidence: 96, form: '🔥😍🔥😍🔥' } }),
    prisma.player.create({ data: { name: 'Declan Rice', team: 'Arsenal', position: 'CM', sentiment: 84, tweets: 25000, aiConfidence: 89, form: '🔥🙂🔥🙂🔥' } }),
    prisma.player.create({ data: { name: 'Kevin De Bruyne', team: 'Man City', position: 'CAM', sentiment: 89, tweets: 41000, aiConfidence: 91, form: '🔥😍🙂🔥😍' } }),
    prisma.player.create({ data: { name: 'Pedri', team: 'Barcelona', position: 'CM', sentiment: 81, tweets: 22000, aiConfidence: 88, form: '🙂🔥🙂🔥🙂' } }),
    prisma.player.create({ data: { name: 'Rodri', team: 'Man City', position: 'CM', sentiment: 95, tweets: 38000, aiConfidence: 97, form: '🔥🔥🔥🔥🔥' } }),

    // DEFENDERS
    prisma.player.create({ data: { name: 'William Saliba', team: 'Arsenal', position: 'CB', sentiment: 87, tweets: 19000, aiConfidence: 91, form: '🔥🙂🔥🙂🔥' } }),
    prisma.player.create({ data: { name: 'Virgil van Dijk', team: 'Liverpool', position: 'CB', sentiment: 82, tweets: 28000, aiConfidence: 89, form: '🙂🔥🙂🔥🙂' } }),
    prisma.player.create({ data: { name: 'Antonio Rüdiger', team: 'Real Madrid', position: 'CB', sentiment: 85, tweets: 21000, aiConfidence: 90, form: '🔥🙂🔥🙂🔥' } }),
    prisma.player.create({ data: { name: 'Trent Alexander-Arnold', team: 'Real Madrid', position: 'RB', sentiment: 79, tweets: 32000, aiConfidence: 88, form: '🙂🔥🙂🙂🔥' } }),
    prisma.player.create({ data: { name: 'Alphonso Davies', team: 'Bayern Munich', position: 'LB', sentiment: 83, tweets: 18000, aiConfidence: 90, form: '🔥🙂🔥🙂🙂' } }),
    prisma.player.create({ data: { name: 'Rúben Dias', team: 'Man City', position: 'CB', sentiment: 86, tweets: 15000, aiConfidence: 92, form: '🔥🙂🔥🙂🔥' } }),

    // GOALKEEPERS
    prisma.player.create({ data: { name: 'Thibaut Courtois', team: 'Real Madrid', position: 'GK', sentiment: 90, tweets: 12000, aiConfidence: 94, form: '🔥😍🔥😍🔥' } }),
    prisma.player.create({ data: { name: 'Alisson Becker', team: 'Liverpool', position: 'GK', sentiment: 88, tweets: 11000, aiConfidence: 93, form: '🔥😍🔥🙂🔥' } }),
  ])

  // Create matches with correct UCL data
  const matches = await Promise.all([
    // Yesterday's results - April 14, 2026
    prisma.match.create({
      data: {
        homeTeam: 'Real Madrid',
        awayTeam: 'Bayern Munich',
        homeScore: 2,
        awayScore: 1,
        status: 'finished',
        league: 'Champions League',
        date: new Date('2026-04-14'),
        aggregateHome: 4,
        aggregateAway: 2,
        homeSentiment: 94,
        awaySentiment: 28,
        psycheJSON: JSON.stringify({
          postMatch: {
            outcome: ["Dominant 2-1 victory at the Bernabéu.", "Real Madrid advance to the next round 4-2 on aggregate."],
            performance: ["Vinícius was untouchable on the left wing.", "Modric controlled the tempo in the second half."],
            supporters: ["Euphoria at the final whistle.", "Fans singing 'Hala Madrid' for 15 minutes post-match."],
            media: ["'The Kings of Europe return' - Marca.", "Bayern's defensive lapses criticized by local press."]
          }
        })
      }
    }),
    prisma.match.create({
      data: {
        homeTeam: 'Arsenal',
        awayTeam: 'Porto',
        homeScore: 2,
        awayScore: 0,
        status: 'finished',
        league: 'Champions League',
        date: new Date('2026-04-14'),
        aggregateHome: 3,
        aggregateAway: 1,
        homeSentiment: 91,
        awaySentiment: 22,
        psycheJSON: JSON.stringify({
          postMatch: {
            outcome: ["Clean sheet 2-0 win for the Gunners.", "Progressing 3-1 on aggregate."],
            performance: ["Saka's dribbling drew 4 yellow cards.", "Odegaard's vision for the second goal was world-class."],
            supporters: ["The North London pulse is at an all-time high.", "Supporters praising the tactical discipline."],
            media: ["'Arteta's masterpiece' - The Guardian.", "Porto struggled to cope with the high press."]
          }
        })
      }
    }),
    prisma.match.create({
      data: {
        homeTeam: 'PSG',
        awayTeam: 'Inter Milan',
        homeScore: 3,
        awayScore: 0,
        status: 'finished',
        league: 'Champions League',
        date: new Date('2026-04-14'),
        aggregateHome: 4,
        aggregateAway: 0,
        homeSentiment: 96,
        awaySentiment: 12,
        psycheJSON: JSON.stringify({
          postMatch: {
            outcome: ["Total demolition with a 3-0 home win.", "Total control throughout both legs."],
            performance: ["Mbappé's hat-trick (real or simulated) dominated the pulse.", "The defense restricted Inter to only 1 shot on target."],
            supporters: ["Parc des Princes in pure celebration mode.", "Fan pulse indicates 'unbeatable' confidence levels."],
            media: ["'The PSG Juggernaut' - L'Equipe.", "Inter's defensive strategy was completely dismantled."]
          }
        })
      }
    }),
    // Today's matches - April 15, 2026
    prisma.match.create({
      data: {
        homeTeam: 'Barcelona',
        awayTeam: 'Newcastle United',
        homeScore: 0,
        awayScore: 0,
        status: 'upcoming',
        league: 'Champions League',
        date: new Date('2026-04-15T18:45:00'),
        aggregateHome: 1,
        aggregateAway: 1,
        homeSentiment: 68,
        awaySentiment: 55,
        psycheJSON: JSON.stringify({
          preMatch: {
            preparation: ["Xavi focusing on ball retention in the final 50m.", "Newcastle practicing low-block transitions."],
            atmosphere: ["Camp Nou expected to be a cauldron of noise.", "Travelling Magpies fans already spotted in the city center."],
            media: ["'A night for the history books' - Sport.", "Can Newcastle cause the ultimate upset?"],
            players: ["Lamine Yamal is the focus of all pre-match discussion.", "Isak's pace is identified as the main threat."]
          }
        })
      }
    }),
    prisma.match.create({
      data: {
        homeTeam: 'Liverpool',
        awayTeam: 'Galatasaray',
        homeScore: 0,
        awayScore: 0,
        status: 'upcoming',
        league: 'Champions League',
        date: new Date('2026-04-15T18:45:00'),
        aggregateHome: 0,
        aggregateAway: 1,
        homeSentiment: 72,
        awaySentiment: 65,
        psycheJSON: JSON.stringify({
          preMatch: {
            preparation: ["Heavy metal football drills at Kirkby.", "Galatasaray prepping for a defensive masterclass."],
            atmosphere: ["Anfield's lights are ready for another comeback story.", "Away fans expected to bring intense flares and noise."],
            media: ["'Liverpool's European Redemption' - Echo.", "The Lions of Istanbul look to defend their narrow lead."],
            players: ["Salah is eyeing a record-breaking night.", "Icardi remains a massive threat on the counter."]
          }
        })
      }
    }),
    prisma.match.create({
      data: {
        homeTeam: 'Tottenham',
        awayTeam: 'Atlético Madrid',
        homeScore: 0,
        awayScore: 0,
        status: 'upcoming',
        league: 'Champions League',
        date: new Date('2026-04-15T18:45:00'),
        aggregateHome: 2,
        aggregateAway: 5,
        homeSentiment: 35,
        awaySentiment: 78,
          psycheJSON: JSON.stringify({
          preMatch: {
            preparation: ["Spurs practicing set pieces to break the Simeone wall.", "Atleti focusing on game management and tactical fouls."],
            atmosphere: ["Optimism is low among Spurs fans but the stadium will be full.", "Atleti fans confident of a professional progression."],
            media: ["'MISSION IMPOSSIBLE?' - Daily Mail.", "Simeone's men are masters of the 3-goal lead."],
            players: ["Son needs a career-defining performance tonight.", "Griezmann is the puppet-master in this Atleti side."]
          }
        })
      }
    }),
    prisma.match.create({
      data: {
        homeTeam: 'Bayern Munich',
        awayTeam: 'Atalanta',
        homeScore: 0,
        awayScore: 0,
        status: 'upcoming',
        league: 'Champions League',
        date: new Date('2026-04-15T18:45:00'),
        aggregateHome: 6,
        aggregateAway: 1,
        homeSentiment: 88,
        awaySentiment: 25,
        psycheJSON: JSON.stringify({
          preMatch: {
            preparation: ["Bayern treating this as a high-intensity training session.", "Atalanta looking to save pride and play their natural game."],
            atmosphere: ["Allianz Arena in festive mood already.", "Small but passionate away contingent from Bergamo."],
            media: ["'Formalities in Munich' - Bild.", "Can Gasperini find any chinks in the Bavarian armor?"],
            players: ["Kane looks to extend his UCL goal tally.", "Lookman is the only one who can trouble their backline."]
          }
        })
      }
    })
  ])

  console.log('Seeded:', players.length, 'players and', matches.length, 'matches')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
