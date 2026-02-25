// © Edmund Wallner - Mercedes-Benz AG
// Reads version from the latest git tag and syncs it to all config files.
// Falls back to the existing package.json version if no git tags exist.

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function getVersionFromGit() {
  try {
    const tag = execSync('git describe --tags --abbrev=0', { encoding: 'utf-8' }).trim();
    // Strip leading "v" if present: "v1.2.3" → "1.2.3"
    return tag.replace(/^v/, '');
  } catch {
    return null;
  }
}

function getVersionFromPackageJson() {
  const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf-8'));
  return pkg.version;
}

function updatePackageJson(version) {
  const path = resolve(root, 'package.json');
  const pkg = JSON.parse(readFileSync(path, 'utf-8'));
  if (pkg.version === version) return false;
  pkg.version = version;
  writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n');
  return true;
}

function updateCargoToml(version) {
  const path = resolve(root, 'src-tauri', 'Cargo.toml');
  const content = readFileSync(path, 'utf-8');
  const updated = content.replace(
    /^version\s*=\s*"[^"]*"/m,
    `version = "${version}"`
  );
  if (content === updated) return false;
  writeFileSync(path, updated);
  return true;
}

function updateTauriConf(version) {
  const path = resolve(root, 'src-tauri', 'tauri.conf.json');
  const conf = JSON.parse(readFileSync(path, 'utf-8'));
  if (conf.version === version) return false;
  conf.version = version;
  writeFileSync(path, JSON.stringify(conf, null, 2) + '\n');
  return true;
}

const gitVersion = getVersionFromGit();
const version = gitVersion ?? getVersionFromPackageJson();

const changed = [
  updatePackageJson(version),
  updateCargoToml(version),
  updateTauriConf(version),
].filter(Boolean).length;

if (gitVersion) {
  console.log(`[sync-version] git tag → ${version} (${changed} file${changed !== 1 ? 's' : ''} updated)`);
} else {
  console.log(`[sync-version] no git tag found, keeping ${version}`);
}
