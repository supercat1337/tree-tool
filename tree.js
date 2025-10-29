// @ts-check

import fs from "fs";
import path from "path";


function getModuleFilename() {
    let scriptName = process.argv[1].replace(/\\/g, "/");
    if (!scriptName.endsWith(".js")) {
        scriptName += ".js";
    }

    if (!scriptName.startsWith("file:///")) {
        scriptName = "file:///" + scriptName;
    }

    return scriptName;
}

const scriptName = getModuleFilename();
const isMainModule = import.meta.url.endsWith(scriptName);

/**
 * Analogue of Windows tree command
 * @param {string} dirPath - path to directory
 * @param {Object} options - options
 * @param {boolean} options.showFiles - show files (/f)
 * @param {boolean} options.useAscii - use ASCII characters (/a)
 * @param {number} maxDepth - maximum recursion depth
 */
function tree(
    dirPath = ".",
    options = { showFiles: false, useAscii: false },
    maxDepth = -1
) {
    const { showFiles = false, useAscii = false } = options;

    // Symbols for tree drawing
    const symbols = useAscii ? {
        vertical: '|   ',
        branch: '|-- ',
        corner: '\\-- ',
        space: '    '
    } : {
        vertical: '│   ',
        branch: '├── ',
        corner: '└── ',
        space: '    '
    };

    /**
     * Recursive function for building tree
     * @param {string} currentPath - current path
     * @param {string} prefix - prefix for current level
     * @param {boolean} isLast - is current item last
     * @param {number} depth - current recursion depth
     * @returns {string} - string representation of tree
     */
    function buildTree(currentPath, prefix = "", isLast = true, depth = 0) {
        if (maxDepth !== -1 && depth > maxDepth) {
            return "";
        }

        try {
            const items = fs.readdirSync(currentPath);

            // Sort items: directories first, then files
            const sortedItems = items
                .filter((item) => {
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
                    return a.localeCompare(b, "en");
                });

            let result = "";

            // Process each item
            sortedItems.forEach((item, index) => {
                const itemPath = path.join(currentPath, item);
                const isDirectory = fs.statSync(itemPath).isDirectory();
                const isLastItem = index === sortedItems.length - 1;

                const connector = isLastItem ? symbols.corner : symbols.branch;

                // Current line
                result += prefix + connector + item + "\n";

                // Recursively process subdirectories
                if (isDirectory) {
                    const newPrefix =
                        prefix +
                        (isLastItem ? symbols.space : symbols.vertical);
                    result += buildTree(
                        itemPath,
                        newPrefix,
                        isLastItem,
                        depth + 1
                    );
                }
            });

            return result;
        } catch (error) {
            if (error instanceof Error) {
                console.error(
                    `Error reading path ${currentPath}: ${error.message}`
                );
            } else {
                console.error(
                    `Unknown error reading path ${currentPath}`,
                    error
                );
            }
        }

        return "";
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

    // Get absolute path and normalize it
    const absolutePath = path.resolve(dirPath);
    const drive = absolutePath.match(/^([A-Za-z]:)/)?.[1] || "";
    const displayPath = absolutePath.replace(/^[A-Za-z]:/, "");

    /*
    // Display header like Windows tree
    console.log(`${drive}\n${displayPath}\n`);
    */

    console.log(absolutePath.replace(/\\/g, "/"));

    const treeStructure = buildTree(absolutePath);
    console.log(treeStructure);
/*
    // Display statistics like Windows tree
    try {
        const allItems = fs.readdirSync(absolutePath);
        const dirs = allItems.filter((item) => {
            return fs.statSync(path.join(absolutePath, item)).isDirectory();
        });
        const files = allItems.filter((item) => {
            return fs.statSync(path.join(absolutePath, item)).isFile();
        });

        let statsText = "";
        if (showFiles) {
            statsText = `    ${dirs.length} directories, ${files.length} files`;
        } else {
            statsText = `    ${dirs.length} directories`;
        }

        console.log(statsText);
    } catch (error) {
        console.log(`    [Failed to get statistics]`);
    }
*/
}

/**
 * Parse command line arguments
 */
function parseArgs() {
    const args = process.argv.slice(2);
    let dirPath = ".";
    const options = {
        showFiles: false,
        useAscii: false,
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (arg.startsWith("/") || arg.startsWith("-")) {
            const option = arg.toLowerCase().replace(/[/-]/g, "");
            switch (option) {
                case "f":
                    options.showFiles = true;
                    break;
                case "a":
                    options.useAscii = true;
                    break;
                case "?":
                case "h":
                case "help":
                    showHelp();
                    process.exit(0);
                default:
                    console.error(`Unknown parameter: ${arg}`);
                    showHelp();
                    process.exit(1);
            }
        } else {
            // This is the path
            if (!dirPath || dirPath === ".") {
                dirPath = arg;
            }
        }
    }

    return { dirPath, options };
}

/**
 * Show help
 */
function showHelp() {
    console.log(`
Usage: node tree.js [<drive>:][<path>] [/f] [/a]

Parameters:
    [<drive>:][<path>]  Specifies drive and directory for tree display
    /f                  Displays files in each directory
    /a                  Uses ASCII characters instead of extended characters
    /? or /h           Displays this help

Examples:
    node tree.js                    # Current directory
    node tree.js C:\\Projects        # Specific directory
    node tree.js /f                 # Displays files
    node tree.js /a                 # Uses ASCII characters
    node tree.js C:\\Projects /f /a  # Combination of parameters
    `);
}

/**
 * Main function
 */
function main() {
    // If no arguments or help requested
    if (
        process.argv.length <= 2 ||
        process.argv.some((arg) =>
            ["/?", "/h", "-?", "-h", "--help"].includes(arg.toLowerCase())
        )
    ) {
        showHelp();
        return;
    }

    try {
        const { dirPath, options } = parseArgs();
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
if (isMainModule) {
    main();
}

export { tree, parseArgs };

