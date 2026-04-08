const path = require('path');
const fs = require('fs');

async function compileMatches() {
  const plUrl = 'https://raw.githubusercontent.com/openfootball/football.json/master/2023-24/en.1.json';
  const llUrl = 'https://raw.githubusercontent.com/openfootball/football.json/master/2023-24/es.1.json';
  
  const targetClubs = [
    'Real Madrid',
    'Barcelona',
    'Arsenal',
    'Chelsea',
    'Liverpool',
    'Manchester City',
    'Manchester United',
    'FC Barcelona',
    'Man City',
    'Man United'
  ];
  
  try {
    console.log('Fetching Premier League data...');
    const plRes = await fetch(plUrl);
    const plData = await plRes.json();
    
    console.log('Fetching La Liga data...');
    const llRes = await fetch(llUrl);
    const llData = await llRes.json();
    
    const allMatches = [];
    
    function processLeague(data, leagueName) {
      if (data && data.matches) {
        data.matches.forEach(match => {
          const homeTeam = match.team1;
          const awayTeam = match.team2;
          
          const isTargetMatch = targetClubs.some(c => homeTeam.includes(c) || awayTeam.includes(c));
          
          if (isTargetMatch && match.date) {
            // Shift date forward by exactly 2 years to 2025-26
            const origDate = new Date(match.date);
            origDate.setFullYear(origDate.getFullYear() + 2);
            const newDateStr = origDate.toISOString().split('T')[0];

            allMatches.push({
              date: newDateStr,
              originalDate: match.date,
              round: match.round,
              homeTeam: homeTeam,
              awayTeam: awayTeam,
              homeScore: match.score ? (match.score.ft ? match.score.ft[0] : null) : null,
              awayScore: match.score ? (match.score.ft ? match.score.ft[1] : null) : null,
              league: leagueName
            });
          }
        });
      }
    }
    
    processLeague(plData, 'Premier League');
    processLeague(llData, 'La Liga');

    allMatches.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const outputPath = path.join(__dirname, '../src/lib/season-matches.json');
    fs.writeFileSync(outputPath, JSON.stringify(allMatches, null, 2));
    
    console.log(`--- COMPLETE ---`);
    console.log(`Successfully compiled ${allMatches.length} core powerhouse matches into source.`);
    console.log(`Target: ${outputPath}`);
    
  } catch (err) {
    console.error('Error during match compilation:', err);
  }
}

compileMatches();
