// Map player names to their photo URLs
const PLAYER_IMAGES: Record<string, string> = {
  'Vinícius Jr': 'https://img.a.transfermarkt.technology/portrait/header/371998-1696348578.jpg',
  'Erling Haaland': 'https://img.a.transfermarkt.technology/portrait/header/418560-1696430472.jpg',
  'Mohamed Salah': 'https://img.a.transfermarkt.technology/portrait/header/148455-1696430740.jpg',
  'Jude Bellingham': 'https://img.a.transfermarkt.technology/portrait/header/581678-1693988793.jpg',
  'Bukayo Saka': 'https://img.a.transfermarkt.technology/portrait/header/627839-1693987250.jpg',
  'Kylian Mbappé': 'https://img.a.transfermarkt.technology/portrait/header/342229-1696430968.jpg',
  'Lamine Yamal': 'https://img.a.transfermarkt.technology/portrait/header/940884-1693988321.jpg',
  'Cole Palmer': 'https://img.a.transfermarkt.technology/portrait/header/746316-1696431228.jpg',
  'Phil Foden': 'https://img.a.transfermarkt.technology/portrait/header/351049-1696604618.jpg',
  'Rodri': 'https://img.a.transfermarkt.technology/portrait/header/357565-1696604033.jpg',
  'Declan Rice': 'https://img.a.transfermarkt.technology/portrait/header/357623-1693986732.jpg',
  'Bruno Fernandes': 'https://img.a.transfermarkt.technology/portrait/header/240306-1696604481.jpg',
  'Robert Lewandowski': 'https://img.a.transfermarkt.technology/portrait/header/38253-1696604706.jpg',
  'Luka Modrić': 'https://img.a.transfermarkt.technology/portrait/header/27992-1696604762.jpg',
}

export function getPlayerImage(name: string): string | undefined {
  return PLAYER_IMAGES[name]
}
