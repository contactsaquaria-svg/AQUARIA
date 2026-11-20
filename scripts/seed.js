/**
 * AQUARIA — Supabase Database Seeder
 *
 * Imports your local site-data.json into the Supabase `site_data` table.
 * Run once after setting up Supabase:
 *
 *   node scripts/seed.js
 *
 * Requires .env.local in the project root with:
 *   SUPABASE_URL=...
 *   SUPABASE_SERVICE_KEY=...
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const { SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌  Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

async function seed() {
  const dataPath = path.resolve(__dirname, '../data/site-data.json');

  if (!fs.existsSync(dataPath)) {
    console.error('❌  data/site-data.json not found.');
    process.exit(1);
  }

  const siteData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  console.log('📦  Seeding site_data table...');

  const { error } = await supabase
    .from('site_data')
    .upsert({ id: 1, data: siteData, updated_at: new Date().toISOString() });

  if (error) {
    console.error('❌  Seed failed:', error.message);
    process.exit(1);
  }

  console.log('✅  Supabase seeded successfully with site-data.json!');
  console.log(`    Products: ${(siteData.products || []).length}`);
  console.log(`    Orders:   ${(siteData.orders || []).length}`);
}

seed();
