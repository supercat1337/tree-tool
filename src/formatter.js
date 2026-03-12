// @ts-check

/**
 * @typedef {Object} TreeSymbols
 * @property {string} vertical - Vertical line symbol
 * @property {string} branch - Branch symbol (T-shape)
 * @property {string} corner - Corner symbol (L-shape)
 * @property {string} space - Indentation space
 */

/**
 * Returns a set of symbols for tree rendering
 * @param {boolean} useAscii - Whether to use ASCII characters
 * @returns {TreeSymbols}
 */
export const getSymbols = useAscii => {
    return useAscii
        ? { vertical: '|   ', branch: '|-- ', corner: '\\-- ', space: '    ' }
        : { vertical: '│   ', branch: '├── ', corner: '└── ', space: '    ' };
};
