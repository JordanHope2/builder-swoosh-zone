import { resolve } from 'path';

import { config } from 'dotenv';
import { startVitest } from 'vitest/node';

config({ path: resolve(process.cwd(), '.env.test') });

const vitest = await startVitest('test');

let failed = false;
if (vitest) {
    for (const testModule of vitest.state.getTestModules()) {
        if (!testModule.ok()) {
            failed = true;
            break;
        }
    }
}


if (failed) {
  process.exit(1);
}
