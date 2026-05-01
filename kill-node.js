/**
 * Node.js Kill-Switch Utility
 * 
 * Run this script to forcefully terminate all running Node.js processes.
 * This is useful if zombie Next.js dev servers or background scrapers
 * are consuming excessive RAM (e.g., the 14GB memory leak).
 * 
 * Usage: node kill-node.js
 */

const { exec } = require('child_process');
const os = require('os');

console.log('⚠️ Initiating Node.js Kill-Switch...');

if (os.platform() === 'win32') {
  exec('taskkill /f /im node.exe', (err, stdout, stderr) => {
    if (err) {
      console.log('✅ No zombie Node processes found, or insufficient permissions.');
    } else {
      console.log('✅ All Node.js processes terminated successfully.');
      console.log(stdout);
    }
  });
} else {
  exec('killall -9 node', (err, stdout, stderr) => {
    if (err) {
      console.log('✅ No zombie Node processes found, or insufficient permissions.');
    } else {
      console.log('✅ All Node.js processes terminated successfully.');
      console.log(stdout);
    }
  });
}
