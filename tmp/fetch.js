fetch('http://localhost:3000/api/matches').then(res=>res.json()).then(data=>{data.map(d=>console.log(d.homeTeam, 'vs', d.awayTeam))})
