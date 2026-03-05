#!/usr/bin/env node
/**
 * Usage:
 *   node scripts/import-voters.js <csv-file> <admin-username> <admin-password> [api-url]
 *
 * Example:
 *   node scripts/import-voters.js voters.csv admin secret123
 *   node scripts/import-voters.js voters.csv admin secret123 http://localhost:4000/api
 */

const fs = require('fs');

const [,, csvFile, adminUser, adminPass, apiUrl = 'http://localhost:4000/api'] = process.argv;

if (!csvFile || !adminUser || !adminPass) {
  console.error('Usage: node scripts/import-voters.js <csv-file> <admin-username> <admin-password> [api-url]');
  process.exit(1);
}

function parseCsv(filePath) {
  const lines = fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  const headers = lines[0].split(',').map(h => h.trim());

  return lines.slice(1).map((line, i) => {
    const values = line.split(',').map(v => v.trim());
    if (values.length !== headers.length) {
      console.warn(`  Warning: line ${i + 2} has ${values.length} fields, expected ${headers.length} — skipping`);
      return null;
    }
    return Object.fromEntries(headers.map((h, idx) => [h, values[idx]]));
  }).filter(Boolean);
}

async function login() {
  const res = await fetch(`${apiUrl}/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: adminUser, password: adminPass }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Login failed (${res.status}): ${err.message || res.statusText}`);
  }
  const { token } = await res.json();
  return token;
}

async function bulkRegister(token, users) {
  const res = await fetch(`${apiUrl}/user/bulkRegister`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(users),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`bulkRegister failed (${res.status}): ${JSON.stringify(body)}`);
  }
  return body;
}

async function main() {
  console.log(`Reading: ${csvFile}`);
  const users = parseCsv(csvFile);
  console.log(`Parsed ${users.length} user(s)`);

  console.log(`Logging in as "${adminUser}"...`);
  const token = await login();
  console.log('Authenticated.');

  console.log('Sending to /user/bulkRegister...');
  const result = await bulkRegister(token, users);
  console.log('Done:', result);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
