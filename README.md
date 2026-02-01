# Tree Command for Node.js

A cross-platform directory tree visualization tool with modern ES6 syntax, built with pure Node.js.

## Features

- ✅ **Modern ES6 Syntax** - uses latest JavaScript features and modules
- ✅ **Cross-platform** - works on Windows, macOS, and Linux
- ✅ **Pure JavaScript** - no external dependencies
- ✅ **Unicode and ASCII support** - beautiful tree rendering with fallback to ASCII
- ✅ **Error handling** - graceful handling of permission errors and invalid paths
- ✅ **Flexible depth control** - customizable recursion depth
- ✅ **Standard CLI syntax** - supports both short (`-f`) and long (`--files`) options

## Installation

### Method 1: Clone the repository
```bash
git clone https://github.com/supercat1337/tree-tool.git
cd tree-tool
```

### Method 2: Direct download
Download `tree.js` and run it with Node.js.

## Usage

### Basic Usage
```bash
# Show directory structure (folders only)
node tree.js

# Show specific directory
node tree.js C:/Projects
node tree.js ./src
```

### Command Line Options

| Option | Short | Description |
|--------|-------|-------------|
| `--files` | `-f` | Display files in each folder |
| `--ascii` | `-a` | Use ASCII characters instead of extended characters |
| `--output <file>` | `-o <file>` | Output results to specified file |
| `--help` | `-h` | Display help information |

### Examples

```bash
# Current directory (folders only)
node tree.js

# Show files in directory
node tree.js -f
node tree.js --files

# Use ASCII characters
node tree.js -a
node tree.js --ascii

# Output to file
node tree.js -o output.txt
node tree.js --output tree-structure.txt

# Show files with ASCII characters
node tree.js -f -a
node tree.js --files --ascii

# Specific path with all options
node tree.js C:\Projects\my-app -f -a -o tree.txt

# Help information
node tree.js -h
node tree.js --help

# Combine options
node tree.js ./src --files --output structure.txt
```

## API Usage

You can also use the tree function programmatically in your Node.js applications:

### ES6 Import Syntax
```javascript
import { tree } from './tree.js';

// Basic usage
tree('./src');

// With options
tree('./src', { showFiles: true, useAscii: false });

// Custom depth
tree('./src', { showFiles: true }, 2); // Max 2 levels deep
```

### CommonJS Syntax (if needed)
```javascript
const { tree } = require('./tree.js');

// Basic usage
tree('./src');
```

### Options Object

- `showFiles` (boolean): Whether to display files (default: `false`)
- `useAscii` (boolean): Use ASCII characters instead of Unicode (default: `false`)
- `maxDepth` (number): Maximum recursion depth (-1 for unlimited, default: `-1`)

## Output Examples

### Default Output (Unicode)
```
my-app/
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   └── Footer.js
│   ├── utils/
│   └── index.js
├── public/
├── package.json
└── README.md
```

### ASCII Output (`-a` parameter)
```
my-app/
|-- src/
|   |-- components/
|   |   |-- Header.js
|   |   +-- Footer.js
|   |-- utils/
|   +-- index.js
|-- public/
|-- package.json
+-- README.md
```

### File Output Example
```bash
# Save tree structure to file
node tree.js -f -a -o project-structure.txt
```

## Comparison with Windows tree

| Feature | Windows `tree` | This Tool |
|---------|----------------|-----------|
| Show files (`/f` / `-f`) | ✅ | ✅ |
| ASCII mode (`/a` / `-a`) | ✅ | ✅ |
| Output to file | ❌ | ✅ |
| Cross-platform | ❌ | ✅ |
| Custom depth | ❌ | ✅ (via API) |
| Error handling | Basic | Enhanced |
| Unicode support | Limited | Full |
| Modern CLI syntax | ❌ | ✅ |

## Error Handling

The tool gracefully handles common errors:

- **Path not found**: Shows clear error message
- **Permission denied**: Continues with accessible directories
- **Invalid parameters**: Shows help information
- **File write errors**: Handles output file creation issues

## Development

### Building and Testing
```bash
# Run with different test cases
node tree.js -f
node tree.js -a -o test.txt
node tree.js ./src --files --ascii
```

### File Structure
```
tree-tool/
├── tree.js          # Main application (ES6 modules)
├── README.md        # Documentation
└── package.json     # Project configuration (if any)
```

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by the Windows `tree` command
- Built with pure Node.js and ES6 for modern development
- Cross-platform testing on Windows, macOS, and Linux
- Uses Node.js built-in utilities for robust argument parsing

---

**Note**: This tool requires Node.js version 14.8.0 or higher for ES6 module support and the `node:util` parseArgs function.