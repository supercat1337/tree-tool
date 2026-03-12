#!/usr/bin/env node
// @ts-check

import { parseCliArgs } from '../src/cli.js';
import { runTree } from '../src/index.js';

const { dirPath, options } = parseCliArgs(process.argv.slice(2));

if (process.argv.includes('-h') || process.argv.includes('--help')) {
    // You can move showHelp here
    process.exit(0);
}

runTree(dirPath, options).catch(err => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
});