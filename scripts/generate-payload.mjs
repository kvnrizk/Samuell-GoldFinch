import { generateImportMap } from '../node_modules/payload/dist/bin/generateImportMap/index.js';
import { generateTypes } from '../node_modules/payload/dist/bin/generateTypes.js';
import config from '../payload.config.ts';

const command = process.argv[2] || 'all';
let payloadConfig = await config;
if (payloadConfig.default) {
  payloadConfig = await payloadConfig.default;
}

if (command === 'types' || command === 'all') {
  await generateTypes(payloadConfig);
}

if (command === 'importmap' || command === 'all') {
  await generateImportMap(payloadConfig, { force: true, log: true });
}
