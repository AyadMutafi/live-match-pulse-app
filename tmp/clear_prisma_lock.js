const fs = require('fs');
const path = 'node_modules/.prisma/client/query_engine-windows.dll.node';
try {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
    console.log('Successfully deleted the locked file.');
  } else {
    console.log('File does not exist at:', path);
  }
} catch (e) {
  console.error('CRITICAL: Delete failed. Still locked by another process:', e.message);
}
