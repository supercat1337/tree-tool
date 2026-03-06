#!/usr/bin/env node

// @ts-check

import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';

/**
 * Determines if the current module is the main entry point (i.e., executed directly,
 * not imported by another module). Handles cases where the script is invoked via
 * a symbolic link (e.g., `npm link`).
 *
 * @returns {boolean} True if the module is the main script, false otherwise.
 */
function isMainModule() {
    // Path passed via command line (argv[1])
    let argvPath = process.argv[1];
    if (!argvPath) return false;

    // Convert to absolute path if relative, and normalize
    argvPath = path.resolve(argvPath);

    // Extract the filesystem path from import.meta.url (remove the 'file://' protocol)
    const modulePath = new URL(import.meta.url).pathname;

    // On Windows, URL.pathname returns a path like '/C:/...' – strip the leading slash
    const normalizedModulePath = process.platform === 'win32'
        ? modulePath.slice(1)  // remove the extra '/'
        : modulePath;

    // Resolve symbolic links for both paths to get the canonical real paths
    const realArgvPath = fs.realpathSync(argvPath);
    const realModulePath = fs.realpathSync(normalizedModulePath);

    return realArgvPath === realModulePath;
}

/**
 * Outputs text to either console or a file
 * @param {string} text - text to output
 * @param {string|null} outputFile - file path to output to, or null to output to console
 */
function output(text, outputFile) {
    if (outputFile) {
        fs.appendFileSync(outputFile, text + '\n');
    } else {
        console.log(text);
    }
}

/**
 * Analogue of Windows tree command
 * @param {string} dirPath - path to directory
 * @param {Object} options - options
 * @param {boolean} options.showFiles - show files (/f)
 * @param {boolean} options.useAscii - use ASCII characters (/a)
 * @param {string|null} options.outputFile - output file path
 * @param {number} maxDepth - maximum recursion depth
 */
function tree(
    dirPath = '.',
    options = { showFiles: false, useAscii: false, outputFile: null },
    maxDepth = -1
) {
    const { showFiles = false, useAscii = false, outputFile = null } = options;

    // Symbols for tree drawing
    const symbols = useAscii
        ? {
              vertical: '|   ',
              branch: '|-- ',
              corner: '\\-- ',
              space: '    ',
          }
        : {
              vertical: '│   ',
              branch: '├── ',
              corner: '└── ',
              space: '    ',
          };

    /**
     * Recursive function for building tree
     * @param {string} currentPath - current path
     * @param {string} prefix - prefix for current level
     * @param {boolean} isLast - is current item last
     * @param {number} depth - current recursion depth
     * @returns {string} - string representation of tree
     */
    function buildTree(currentPath, prefix = '', isLast = true, depth = 0) {
        if (maxDepth !== -1 && depth > maxDepth) {
            return '';
        }

        try {
            const items = fs.readdirSync(currentPath);

            // Sort items: directories first, then files
            const sortedItems = items
                .filter(item => {
                    // If not showing files, filter only directories
                    if (!showFiles) {
                        const itemPath = path.join(currentPath, item);
                        return fs.statSync(itemPath).isDirectory();
                    }
                    return true;
                })
                .sort((a, b) => {
                    const aPath = path.join(currentPath, a);
                    const bPath = path.join(currentPath, b);
                    const aIsDir = fs.statSync(aPath).isDirectory();
                    const bIsDir = fs.statSync(bPath).isDirectory();

                    if (aIsDir && !bIsDir) return -1;
                    if (!aIsDir && bIsDir) return 1;
                    return a.localeCompare(b, 'en');
                });

            let result = '';

            // Process each item
            sortedItems.forEach((item, index) => {
                const itemPath = path.join(currentPath, item);
                const isDirectory = fs.statSync(itemPath).isDirectory();
                const isLastItem = index === sortedItems.length - 1;

                const connector = isLastItem ? symbols.corner : symbols.branch;

                // Current line
                result += prefix + connector + item + (isDirectory ? '/' : '') + '\n';

                // Recursively process subdirectories
                if (isDirectory) {
                    const newPrefix = prefix + (isLastItem ? symbols.space : symbols.vertical);
                    result += buildTree(itemPath, newPrefix, isLastItem, depth + 1);
                }
            });

            return result;
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error reading path ${currentPath}: ${error.message}`);
            } else {
                console.error(`Unknown error reading path ${currentPath}`, error);
            }
        }

        return '';
    }

    // Check if path exists
    if (!fs.existsSync(dirPath)) {
        console.error(`Path not found: ${dirPath}`);
        process.exit(1);
    }

    const stats = fs.statSync(dirPath);
    if (!stats.isDirectory()) {
        console.error(`Specified path is not a directory: ${dirPath}`);
        process.exit(1);
    }

    if (outputFile) {
        if (fs.existsSync(outputFile)) {
            fs.unlinkSync(outputFile);
        }
    }

    // Get absolute path and normalize it
    const absolutePath = path.resolve(dirPath);
    const drive = absolutePath.match(/^([A-Za-z]:)/)?.[1] || '';
    const displayPath = absolutePath.replace(/^[A-Za-z]:/, '');

    output(absolutePath.replace(/\\/g, '/'), outputFile);

    const treeStructure = buildTree(absolutePath);
    output(treeStructure, outputFile);
}

function parseCommandLineArgsWithUtil() {
    const { values, positionals } = parseArgs({
        args: process.argv.slice(2),
        options: {
            f: {
                type: 'boolean',
                short: 'f',
            },
            files: {
                type: 'boolean',
            },
            a: {
                type: 'boolean',
                short: 'a',
            },
            ascii: {
                type: 'boolean',
            },
            o: {
                type: 'string',
                short: 'o',
            },
            output: {
                type: 'string',
            },
            h: {
                type: 'boolean',
                short: 'h',
            },
            help: {
                type: 'boolean',
            },
        },
        allowPositionals: true,
    });

    if (values.h || values.help) {
        showHelp();
        process.exit(0);
    }

    const dirPath = positionals[0] || '.';

    const options = {
        showFiles: values.f || values.files || false,
        useAscii: values.a || values.ascii || false,
        outputFile: values.o || values.output || null,
    };

    return { dirPath, options };
}

/**
 * Show help
 */
/**
 * Displays help information with aligned columns.
 * Short and long option forms are shown on the same line.
 */
function showHelp() {
    const options = [
        { short: '-f', long: '--files', description: 'Displays files in each directory' },
        { short: '-a', long: '--ascii', description: 'Uses ASCII characters instead of extended characters' },
        { short: '-o', long: '--output <file>', description: 'Outputs to a file' },
        { short: '-h', long: '--help', description: 'Displays this help' },
    ];

    const examples = [
        { cmd: 'tree-tool', comment: 'Current directory' },
        { cmd: 'tree-tool C:\\\\Projects', comment: 'Specific directory' },
        { cmd: 'tree-tool -f, --files', comment: 'Displays files' },
        { cmd: 'tree-tool -a, --ascii', comment: 'Uses ASCII characters' },
        { cmd: 'tree-tool -o, --output output.txt', comment: 'Outputs to a file' },
        { cmd: 'tree-tool C:\\\\Projects -f -a', comment: 'Combination of parameters' },
        { cmd: 'tree-tool -h, --help', comment: 'Shows this help' },
    ];

    // Calculate maximum width for alignment
    const maxOptionLength = Math.max(
        ...options.map(opt => `  ${opt.short}, ${opt.long}`.length)
    );
    const maxExampleLength = Math.max(
        ...examples.map(ex => `  ${ex.cmd}`.length)
    );

    const lines = [
        'Usage: tree-tool [directory] [options]',
        '',
        'Parameters:',
        '  directory           Specifies directory for tree display (default: current directory)',
        '',
        'Options:',
    ];

    // Add options with aligned descriptions
    options.forEach(opt => {
        const left = `  ${opt.short}, ${opt.long}`;
        const padding = ' '.repeat(maxOptionLength - left.length + 2);
        lines.push(left + padding + opt.description);
    });

    lines.push('');
    lines.push('Examples:');

    // Add examples with aligned comments
    examples.forEach(ex => {
        const left = `  ${ex.cmd}`;
        const padding = ' '.repeat(maxExampleLength - left.length + 2);
        lines.push(left + padding + '# ' + ex.comment);
    });

    console.log(lines.join('\n'));
}

/**
 * Main function
 */
function main() {
    // If no arguments or help requested
    if (
        process.argv.length <= 2 ||
        process.argv.some(arg => ['/?', '/h', '-?', '-h', '--help'].includes(arg.toLowerCase()))
    ) {
        showHelp();
        return;
    }

    try {
        const { dirPath, options } = parseCommandLineArgsWithUtil();
        tree(dirPath, options);
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
        } else {
            console.error(`Unknown error`, error);
        }
        process.exit(1);
    }
}

// Call main function if script is called directly
if (isMainModule()) {
    main();
}

export { tree, parseArgs };
