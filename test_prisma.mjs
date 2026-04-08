import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
try {
  execSync('npx prisma validate', { encoding: 'utf-8' });
  writeFileSync('prisma_error_clean.txt', "SUCCESS");
} catch (e) {
  writeFileSync('prisma_error_clean.txt', (e.stderr || "") + "\\n---\\n" + (e.stdout || "") + "\\n---\\n" + (e.message || ""));
}
