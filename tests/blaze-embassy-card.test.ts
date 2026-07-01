import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const BLAZE_CLIENT = 'app/(site)/blaze/BlazeClient.tsx';
const HOME_CLIENT = 'app/(site)/HomeClient.tsx';
const HOME_CONTENT = 'app/(site)/home-content.ts';

function readProjectFile(path: string) {
  return readFileSync(join(process.cwd(), path), 'utf8');
}

describe('Embassy of Lebanon Blaze project card', () => {
  it('appears as a Blaze project card (not only a generic collaboration) with real Embassy media', () => {
    const source = readProjectFile(BLAZE_CLIENT);
    expect(source).toContain('Embassy of Lebanon');
    expect(source).toContain('embassyStatic');
    // Real Embassy assets from the repo, not unrelated media.
    expect(source).toContain('/assets/blaze/ambassy/');
  });

  it('appears in the homepage curated Blaze carousel with real Embassy media', () => {
    const home = readProjectFile(HOME_CLIENT);
    expect(home).toContain('Embassy of Lebanon');
    expect(home).toContain("blazeWorkId: 'embassy'");

    const content = readProjectFile(HOME_CONTENT);
    expect(content).toContain('embassy:');
    expect(content).toContain('/assets/blaze/ambassy/');
  });

  it('does not reintroduce previously removed demo/fake proof', () => {
    for (const path of [BLAZE_CLIENT, HOME_CLIENT]) {
      const source = readProjectFile(path);
      expect(source).not.toContain('Kate Zubok');
      expect(source).not.toContain('DJ Marco');
    }
  });
});
