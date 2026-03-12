// @ts-check

import fg from 'fast-glob';
import isGlobMatch from 'picomatch';

/**
 * @typedef {Object} TreeOptions
 * @property {boolean} showFiles - Include files in the tree
 * @property {boolean} useAscii - Use ASCII symbols
 * @property {string[]} exclude - Glob patterns to exclude
 * @property {number} maxDepth - Maximum recursion depth
 * @property {string|null} outputFile - Path to save output
 * @property {boolean} pretty - Align ignore comments
 */

/**
 * Checks if a path matches any of the exclude patterns
 * @param {string} path - Path to check
 * @param {string[]} patterns - Glob patterns
 * @returns {boolean}
 */
const isExcluded = (path, patterns) => {
    if (!patterns.length) return false;
    return isGlobMatch.isMatch(path, patterns);
};

/**
 * Builds the directory structure data
 * @param {string} dirPath
 * @param {TreeOptions} options
 * @returns {Promise<Object>}
 */
export async function buildTreeData(dirPath, options) {
    const { showFiles, exclude, maxDepth } = options;

    const entries = await fg(['**/*'], {
        cwd: dirPath,
        onlyDirectories: false,
        deep: maxDepth > 0 ? maxDepth : undefined,
        objectMode: true,
        dot: true,
    });

    const tree = {};

    for (const entry of entries) {
        const parts = entry.path.split('/');
        let current = tree;
        let cumulativePath = '';

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            cumulativePath = cumulativePath ? `${cumulativePath}/${part}` : part;

            const isEntryDir = entry.dirent.isDirectory() || i < parts.length - 1;
            const ignored = isExcluded(cumulativePath, exclude);

            if (!current[part]) {
                if (!isEntryDir && !showFiles) continue;

                current[part] = {
                    name: part,
                    isDir: isEntryDir,
                    ignored: ignored,
                    children: {},
                };
            }

            if (current[part].ignored) break;
            current = current[part].children;
        }
    }

    return tree;
}
