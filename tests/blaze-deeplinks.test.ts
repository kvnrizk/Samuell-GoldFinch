import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

function read(path: string) {
  return readFileSync(join(process.cwd(), path), 'utf8');
}

const home = read('app/(site)/HomeClient.tsx');
const blaze = read('app/(site)/blaze/BlazeClient.tsx');

// Homepage Blaze card deep-link ids (?work=<blazeWorkId>).
const blazeWorkIds = [...home.matchAll(/blazeWorkId:\s*'([^']+)'/g)].map((m) => m[1]);

// The Blaze page ?work= allowlist that gates which selected-work tab opens.
const allowlistMatch = blaze.match(/\[([^\]]*)\]\s*\.includes\(requestedWork\)/);
const allowlist = allowlistMatch
  ? allowlistMatch[1].split(',').map((s) => s.trim().replace(/['"]/g, '')).filter(Boolean)
  : [];

describe('Blaze selected-work deep links', () => {
  it('every homepage Blaze card links to an allowed ?work= id', () => {
    expect(blazeWorkIds.length).toBeGreaterThan(0);
    expect(allowlist.length).toBeGreaterThan(0);
    for (const id of blazeWorkIds) {
      expect(allowlist).toContain(id);
    }
  });

  it('every allowed ?work= id maps to a real selectedWork item', () => {
    for (const id of allowlist) {
      expect(blaze).toContain(`id: '${id}'`);
    }
  });

  it('resolves the creative-direction/editorial mismatch', () => {
    expect(home).not.toContain("blazeWorkId: 'creative-direction'");
    expect(allowlist).toContain('editorial');
    expect(allowlist).not.toContain('creative-direction');
    expect(blaze).toContain("id: 'editorial'");
  });

  it('keeps the Embassy deep-link valid', () => {
    expect(blazeWorkIds).toContain('embassy');
    expect(allowlist).toContain('embassy');
    expect(blaze).toContain("id: 'embassy'");
  });

  it('does not reintroduce removed demo proof', () => {
    for (const src of [home, blaze]) {
      expect(src).not.toContain('Kate Zubok');
      expect(src).not.toContain('DJ Marco');
    }
  });
});
