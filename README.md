<img src="https://github.com/omilang/omi/raw/main/logo.png" alt="Omi Logo" width="300">

# Omi VS Code Extension

Syntax highlighting, file styling, autocomplete, and signature hints for [Omi Language](https://github.com/OmiLang/Omi).

## Built-in I/O support

The extension now suggests the updated output helpers:

```omi
print("hello")
println("world")
output(1, 2, "hello", 3)
reprint(42)
```

## Build from source

```
npm install
npm run build:vsix
```