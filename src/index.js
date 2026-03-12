// @ts-check

import fs from 'node:fs';
import path from 'node:path';
import { getSymbols } from './formatter.js';
import { buildTreeData } from './builder.js';

/**
 * Generates an array of line objects for the tree
 * @param {Object} node 
 * @param {import('./formatter.js').TreeSymbols} symbols 
 * @param {string} prefix 
 * @param {Array<{text: string, isIgnored: boolean}>} lines 
 */
function generateLines(node, symbols, prefix = '', lines = []) {
    const keys = Object.keys(node);

    keys.forEach((key, index) => {
        const isLast = index === keys.length - 1;
        const currentItem = node[key];
        const connector = isLast ? symbols.corner : symbols.branch;
        const slash = currentItem.isDir ? '/' : '';
        
        const text = `${prefix}${connector}${key}${slash}`;
        lines.push({ text, isIgnored: currentItem.ignored });

        if (currentItem.isDir && !currentItem.ignored) {
            const nextPrefix = prefix + (isLast ? symbols.space : symbols.vertical);
            generateLines(currentItem.children, symbols, nextPrefix, lines);
        }
    });
    return lines;
}

/**
 * Main execution function
 * @param {string} dirPath 
 * @param {import('./builder.js').TreeOptions} options 
 */
export async function runTree(dirPath, options) {
    const symbols = getSymbols(options.useAscii);
    const treeData = await buildTreeData(dirPath, options);
    
    const absolutePath = path.resolve(dirPath).replace(/\\/g, '/');
    const treeLines = generateLines(treeData, symbols);
    
    let outputText = `${absolutePath}\n`;

    if (options.pretty) {
        const maxLength = Math.max(...treeLines.map(l => l.text.length), 0);
        treeLines.forEach(line => {
            if (line.isIgnored) {
                const padding = ' '.repeat(maxLength - line.text.length + 2);
                outputText += `${line.text}${padding}# [ignored]\n`;
            } else {
                outputText += `${line.text}\n`;
            }
        });
    } else {
        treeLines.forEach(line => {
            const label = line.isIgnored ? ' # [ignored]' : '';
            outputText += `${line.text}${label}\n`;
        });
    }

    if (options.outputFile) {
        fs.writeFileSync(options.outputFile, outputText, 'utf8');
    } else {
        process.stdout.write(outputText);
    }
}