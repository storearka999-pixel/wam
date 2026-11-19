import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const APPLY = process.argv.includes('--apply');
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, '..');
const dataDirectory = path.resolve(process.env.DATA_DIR || path.join(projectDirectory, 'data'));
const databaseFile = path.join(dataDirectory, 'db.json');

function migrate(db) {
  db.settings = db.settings && typeof db.settings === 'object' ? db.settings : {};
  if (!Array.isArray(db.settings.seoPages)) return { changed: false, counters: 0, pos: 0 };

  const pages = db.settings.seoPages;
  const originalPages = new Map(pages.map((page) => [page.id, { ...page }]));
  let changed = false;

  for (const page of pages) {
    if (!page.parentSeoPageId && (page.siteType || 'sales-counter') === 'pos') {
      page.siteType = 'sales-counter';
      delete page.parentSeoPageId;
      changed = true;
    } else if (!page.parentSeoPageId && !page.siteType) {
      page.siteType = 'sales-counter';
      changed = true;
    }
  }

  for (const page of pages) {
    const original = originalPages.get(page.id);
    if (!page.parentSeoPageId || !originalPages.has(page.parentSeoPageId)) continue;
    if ((original?.siteType || 'sales-counter') === 'sales-counter') {
      page.siteType = 'pos';
      changed = true;
    }
  }

  db.adminUsers = Array.isArray(db.adminUsers) ? db.adminUsers : [];
  for (const user of db.adminUsers) {
    if (String(user.role || '').toLocaleLowerCase('id-ID').replace(/[\s_-]+/g, ' ') === 'super admin') continue;
    const original = originalPages.get(user.assignedSeoPageId);
    if (!original) continue;
    if (!original.parentSeoPageId && (original.siteType || 'sales-counter') === 'pos') {
      if (user.role !== 'superadmin pos') {
        user.role = 'superadmin pos';
        changed = true;
      }
    } else if (original.parentSeoPageId && user.role !== 'admin') {
      user.role = 'admin';
      changed = true;
    }
  }

  return {
    changed,
    counters: pages.filter((page) => !page.parentSeoPageId && (page.siteType || 'sales-counter') === 'sales-counter').length,
    pos: pages.filter((page) => page.parentSeoPageId && page.siteType === 'pos').length,
  };
}

async function main() {
  let db;
  try {
    db = JSON.parse(await fs.readFile(databaseFile, 'utf-8'));
  } catch (error) {
    if (error.code === 'ENOENT') throw new Error(`Database tidak ditemukan: ${databaseFile}`);
    throw error;
  }

  const result = migrate(db);
  console.log(JSON.stringify({
    mode: APPLY ? 'APPLY' : 'DRY RUN',
    databaseFile,
    changed: result.changed,
    salesCounterCount: result.counters,
    posCount: result.pos,
  }, null, 2));

  if (!APPLY) {
    console.log('No files were changed. Re-run with --apply after backing up db.json.');
    return;
  }
  if (!result.changed) {
    console.log('No hierarchy changes were required.');
    return;
  }

  const backupFile = `${databaseFile}.sales-counter-migration-${new Date().toISOString().replace(/[:.]/g, '-')}.bak`;
  await fs.copyFile(databaseFile, backupFile);
  await fs.writeFile(databaseFile, `${JSON.stringify(db, null, 2)}\n`, 'utf-8');
  console.log(`Backup: ${backupFile}`);
  console.log('Migration applied.');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
