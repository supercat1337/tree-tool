# Tree Command for Node.js

A cross-platform directory tree visualization tool compatible with Windows `tree` command syntax, built with pure Node.js.

## Features

- ✅ **Windows `tree` command compatibility** - supports `/f` and `/a` parameters
- ✅ **Cross-platform** - works on Windows, macOS, and Linux
- ✅ **Pure JavaScript** - no external dependencies
- ✅ **Unicode and ASCII support** - beautiful tree rendering with fallback to ASCII
- ✅ **Error handling** - graceful handling of permission errors and invalid paths
- ✅ **Flexible depth control** - customizable recursion depth

## Installation

### Method 1: Clone the repository
```bash
git clone https://github.com/supercat1337/tree-tool.git
cd node-tree-command
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

### Command Line Parameters

| Parameter | Description |
|-----------|-------------|
| `[drive:][path]` | Specify drive and directory to display |
| `/f` | Display files in each folder |
| `/a` | Use ASCII characters instead of extended characters |
| `/?` or `/h` | Display help information |

### Examples

```bash
# Current directory (folders only)
node tree.js

# Show files in directory
node tree.js /f

# Use ASCII characters
node tree.js /a

# Show files with ASCII characters
node tree.js /f /a

# Specific path with all options
node tree.js C:\Projects\my-app /f /a

# Help information
node tree.js /?
node tree.js /h
```

## API Usage

You can also use the tree function programmatically in your Node.js applications:

```javascript
const { tree } = require('./tree.js');

// Basic usage
tree('./src');

// With options
tree('./src', { showFiles: true, useAscii: false });

// Custom depth
tree('./src', { showFiles: true }, 2); // Max 2 levels deep
```

### Options

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

### ASCII Output (/a parameter)
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

## Comparison with Windows tree

| Feature | Windows `tree` | This Tool |
|---------|----------------|-----------|
| Show files (`/f`) | ✅ | ✅ |
| ASCII mode (`/a`) | ✅ | ✅ |
| Cross-platform | ❌ | ✅ |
| Custom depth | ❌ | ✅ (via API) |
| Error handling | Basic | Enhanced |
| Unicode support | Limited | Full |

## Error Handling

The tool gracefully handles common errors:

- **Path not found**: Shows clear error message
- **Permission denied**: Continues with accessible directories
- **Invalid parameters**: Shows help information

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

### Development
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by the Windows `tree` command
- Built with pure Node.js for maximum compatibility
- Cross-platform testing on Windows, macOS, and Linux
