// @ts-check

import minimist from 'minimist';

/**
 * @param {string[]} argv
 */
export function parseCliArgs(argv) {
    const args = minimist(argv, {
        alias: {
            f: 'files',
            a: 'ascii',
            o: 'output',
            h: 'help',
            e: 'exclude',
            d: 'depth',
            p: 'pretty',
        },
        boolean: ['files', 'ascii', 'help', 'pretty'],
        string: ['output', 'exclude'],
        default: { depth: -1 },
    });

    const exclude = Array.isArray(args.exclude) ? args.exclude : args.exclude ? [args.exclude] : [];

    return {
        dirPath: args._[0] || '.',
        options: {
            showFiles: args.files,
            useAscii: args.ascii,
            outputFile: args.output,
            exclude,
            maxDepth: parseInt(args.depth, 10),
            pretty: args.pretty,
        },
    };
}
