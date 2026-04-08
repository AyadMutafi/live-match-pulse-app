const fs = require('fs');

const dataRaw = fs.readFileSync('c:\\Users\\AyadMotafi\\OneDrive - Stellen Consulting\\Desktop\\Fans Sentiments\\live-match-pulse-app\\src\\lib\\season-matches.json', 'utf8');
const data = JSON.parse(dataRaw);
const targetClubs = [
  { name: 'Real Madrid', aliases: ['Real Madrid'] },
  { name: 'FC Barcelona', aliases: ['Barcelona', 'FC Barcelona'] },
  { name: 'Arsenal', aliases: ['Arsenal'] },
  { name: 'Chelsea', aliases: ['Chelsea'] },
  { name: 'Liverpool', aliases: ['Liverpool'] },
  { name: 'Manchester City', aliases: ['Manchester City', 'Man City'] },
  { name: 'Manchester United', aliases: ['Manchester United', 'Man United'] }
];

let md = '# 📅 Comprehensive Season Match List (2023-24)\n\n';
md += '> [!NOTE]\n> Below is a compiled and comprehensive list of all league matches for your core tracked clubs from the 2023-24 season. This provides a complete structural view of their performance across the entire campaign, extending beyond just the live matches tracked directly in the app.\n\n';

targetClubs.forEach(club => {
  md += `## 🛡️ ${club.name}\n\n`;
  md += `| Date | Matchweek | Home Team | Result | Away Team |\n`;
  md += `| --- | --- | --- | :---: | --- |\n`;
  
  const clubMatches = data.filter(m => 
    club.aliases.some(alias => m.homeTeam.includes(alias) || m.awayTeam.includes(alias))
  );
  
  clubMatches.forEach(m => {
    let result = '-';
    if (m.homeScore !== null && m.awayScore !== null) {
      result = `${m.homeScore} - ${m.awayScore}`;
    }
    
    // Bold the target club
    let home = m.homeTeam;
    let away = m.awayTeam;
    if (club.aliases.some(a => home.includes(a))) home = `**${home}**`;
    if (club.aliases.some(a => away.includes(a))) away = `**${away}**`;
    
    md += `| ${m.date} | ${m.round} | ${home} | **${result}** | ${away} |\n`;
  });
  
  md += `\n*Total matches tracked: ${clubMatches.length}*\n\n---\n\n`;
});

const artifactPath = 'C:\\Users\\AyadMotafi\\.gemini\\antigravity\\brain\\4b040c40-a04c-47fe-aa67-cb758c9f4c2a\\comprehensive_season_matches.md';
fs.writeFileSync(artifactPath, md);
console.log('Artifact complete.');
