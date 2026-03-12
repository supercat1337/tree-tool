# @supercat1337/tree-tool

A powerful, cross-platform directory tree visualization tool for Node.js. While inspired by the classic Windows `tree` command, this utility is enhanced with Glob support, smart formatting, and modern CLI features.

## 🚀 Features

- ✅ **Modern & Fast** - Built with ESM and powered by `fast-glob`.
- ✅ **Glob Exclusions** - Hide complex paths like `**/node_modules/**` or `dist/*.log`.
- ✅ **Pretty Alignment** - Use `--pretty` to align `# [ignored]` comments for professional documentation.
- ✅ **Cross-platform** - Native support for Windows, macOS, and Linux.
- ✅ **Clean JSDoc** - Fully typed source code for better maintainability.

## 📦 Comparison with Windows `tree`

| Feature             | Windows `tree` | `@supercat1337/tree-tool`     |
| ------------------- | -------------- | ----------------------------- |
| Glob Patterns       | ❌             | ✅ (via `fast-glob`)          |
| Multiple Exclusions | ❌             | ✅ (Multiple `-e` flags)      |
| Pretty Alignment    | ❌             | ✅ (Flag `--pretty`)          |
| Unicode support     | Limited        | ✅ Full (with ASCII fallback) |
| Built with          | Binary         | ✅ Node.js / ESM              |

## 🛠 Installation

```bash
npm install @supercat1337/tree-tool

```

## ⌨️ Usage

### Basic commands

```bash
# Basic tree (directories only)
tree-tool .

# Show files and include hidden dot-files
tree-tool -f

```

### Advanced Filtering (Glob)

You can exclude multiple patterns simultaneously. Always wrap globs in quotes:

```bash
tree-tool -f -e "node_modules/**" -e ".git/**" -e "coverage/**"

```

### Documentation Mode (Pretty)

The `--pretty` (or `-p`) flag aligns labels after a `#` sign, making it perfect for your project's `README.md`:

```bash
tree-tool -f -p -e "node_modules/**" -e ".git/**" -o result.txt

```

_Example output:_

```text
/your/project/path
├── src/
│   ├── builder.js
│   └── index.js
├── node_modules/     # [ignored]
├── .git/             # [ignored]
└── package.json

```

## ⚙️ CLI Options

| Option      | Short | Description                                |
| ----------- | ----- | ------------------------------------------ |
| `--files`   | `-f`  | Display files in the tree                  |
| `--exclude` | `-e`  | Glob pattern to exclude (multiple allowed) |
| `--pretty`  | `-p`  | Align `# [ignored]` comments               |
| `--depth`   | `-d`  | Maximum recursion depth (default: -1)      |
| `--ascii`   | `-a`  | Use ASCII symbols instead of Unicode       |
| `--output`  | `-o`  | Save tree output to a file                 |
| `--help`    | `-h`  | Show this help message                     |

## 🏗 Project Structure

```text
tree-tool/
├── bin/
│   └── tree-tool.js   # CLI Entry point
├── src/
│   ├── builder.js     # Glob & Logic
│   ├── cli.js         # Argument parsing
│   ├── formatter.js   # Tree symbols
│   └── index.js       # Orchestrator & Rendering
└── package.json

```

## License

MIT
