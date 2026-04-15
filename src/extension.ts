import * as vscode from 'vscode';

const MODULE_IMPORTS = [
  { id: 'system', path: 'omi:system', alias: 'sys', description: 'OS interaction, environment variables, and process control.' },
  { id: 'files', path: 'omi:files', alias: 'fs', description: 'File and directory operations.' },
  { id: 'paths', path: 'omi:paths', alias: 'p', description: 'Path utility helpers.' },
  { id: 'time', path: 'omi:time', alias: 't', description: 'Time formatting, parsing, and timestamps.' },
  { id: 'math', path: 'omi:math', alias: 'm', description: 'Math functions and constants.' },
  { id: 'json', path: 'omi:json', alias: 'json', description: 'JSON parsing and file helpers.' },
  { id: 'http', path: 'omi:http', alias: 'http', description: 'HTTP requests and downloads.' },
  { id: 'txt', path: 'omi:txt', alias: 'txt', description: 'Text file read/write operations.' },
  { id: 'string', path: 'omi:string', alias: 'str', description: 'String manipulation utilities.' },
  { id: 'regex', path: 'omi:regex', alias: 'rx', description: 'Regular expression matching and replacement.' },
];

const USE_FLAGS = ['notypes', 'eval', 'debug', 'noecho', 'module'];

const GLOBAL_ITEMS = [
  {
    label: 'print',
    insertText: 'print(${1:value})',
    detail: 'Built-in function',
    documentation: 'Prints a value without adding a newline.',
    signature: 'print(value<every>)',
    parameters: ['value<every>'],
  },
  {
    label: 'println',
    insertText: 'println(${1:value})',
    detail: 'Built-in function',
    documentation: 'Prints a value and ends with a newline by default. Optional second argument overrides the ending.',
    signature: 'println(value<every>, [end<every>])',
    parameters: ['value<every>', '[end<every>]'],
  },
  {
    label: 'output',
    insertText: 'output(${1:first}, ${2:second})',
    detail: 'Built-in function',
    documentation: 'Prints multiple values separated by spaces.',
    signature: 'output(...values<every>)',
    parameters: ['...values<every>'],
  },
  {
    label: 'reprint',
    insertText: 'reprint(${1:value})',
    detail: 'Built-in function',
    documentation: 'Returns the string form of a value without printing it.',
    signature: 'reprint(value<every>)',
    parameters: ['value<every>'],
  },
  {
    label: 'input',
    insertText: 'input()',
    detail: 'Built-in function',
    documentation: 'Reads user input as a string.',
    signature: 'input()',
    parameters: [],
  },
  {
    label: 'len',
    insertText: 'len(${1:value})',
    detail: 'Built-in function',
    documentation: 'Returns the length of a list, string, or dict-like value.',
    signature: 'len(value<every>)',
    parameters: ['value<every>'],
  },
  {
    label: 'range',
    insertText: 'range(${1:stop})',
    detail: 'Built-in function',
    documentation: 'Returns an array of integers. range(stop), range(start, stop), or range(start, stop, step).',
    signature: 'range(stop<int>) / range(start<int>, stop<int>) / range(start<int>, stop<int>, step<int>)',
    parameters: ['start<int>', 'stop<int>', '[step<int>]'],
  },
  {
    label: 'append',
    insertText: 'append(${1:list}, ${2:value})',
    detail: 'Built-in function',
    documentation: 'Appends a value to an array.',
    signature: 'append(list<array>, value<every>)',
    parameters: ['list<array>', 'value<every>'],
  },
  {
    label: 'pop',
    insertText: 'pop(${1:list}, ${2:index})',
    detail: 'Built-in function',
    documentation: 'Removes an element from an array by index.',
    signature: 'pop(list<array>, index<number>)',
    parameters: ['list<array>', 'index<number>'],
  },
  {
    label: 'extend',
    insertText: 'extend(${1:list}, ${2:other})',
    detail: 'Built-in function',
    documentation: 'Extends one array with another.',
    signature: 'extend(list<array>, other<array>)',
    parameters: ['list<array>', 'other<array>'],
  },
  {
    label: 'clear',
    insertText: 'clear()',
    detail: 'Built-in function',
    documentation: 'Clears the console output.',
    signature: 'clear()',
    parameters: [],
  },
  {
    label: 'eval',
    insertText: 'eval(${1:code})',
    detail: 'Built-in function',
    documentation: 'Evaluates Omi code dynamically. Requires `@use eval`.',
    signature: 'eval(code<string>)',
    parameters: ['code<string>'],
  },
  {
    label: 'is_number',
    insertText: 'is_number(${1:value})',
    detail: 'Type check',
    documentation: 'Checks whether the value is a number.',
    signature: 'is_number(value<every>)',
    parameters: ['value<every>'],
  },
  {
    label: 'is_int',
    insertText: 'is_int(${1:value})',
    detail: 'Type check',
    documentation: 'Checks whether the value is an integer.',
    signature: 'is_int(value<every>)',
    parameters: ['value<every>'],
  },
  {
    label: 'is_float',
    insertText: 'is_float(${1:value})',
    detail: 'Type check',
    documentation: 'Checks whether the value is a float.',
    signature: 'is_float(value<every>)',
    parameters: ['value<every>'],
  },
  {
    label: 'is_bool',
    insertText: 'is_bool(${1:value})',
    detail: 'Type check',
    documentation: 'Checks whether the value is a boolean.',
    signature: 'is_bool(value<every>)',
    parameters: ['value<every>'],
  },
  {
    label: 'is_string',
    insertText: 'is_string(${1:value})',
    detail: 'Type check',
    documentation: 'Checks whether the value is a string.',
    signature: 'is_string(value<every>)',
    parameters: ['value<every>'],
  },
  {
    label: 'is_array',
    insertText: 'is_array(${1:value})',
    detail: 'Type check',
    documentation: 'Checks whether the value is an array.',
    signature: 'is_array(value<every>)',
    parameters: ['value<every>'],
  },
  {
    label: 'is_dict',
    insertText: 'is_dict(${1:value})',
    detail: 'Type check',
    documentation: 'Checks whether the value is a dict.',
    signature: 'is_dict(value<every>)',
    parameters: ['value<every>'],
  },
  {
    label: 'is_function',
    insertText: 'is_function(${1:value})',
    detail: 'Type check',
    documentation: 'Checks whether the value is callable.',
    signature: 'is_function(value<every>)',
    parameters: ['value<every>'],
  },
  {
    label: 'is_null',
    insertText: 'is_null(${1:value})',
    detail: 'Type check',
    documentation: 'Checks whether the value is `null`. Returns `false` for `void`.',
    signature: 'is_null(value<every>)',
    parameters: ['value<every>'],
  },
  {
    label: 'typeof',
    insertText: 'typeof(${1:value})',
    detail: 'Built-in function',
    documentation: 'Returns the type name as a string: `"int"`, `"float"`, `"string"`, `"bool"`, `"array"`, `"dict"`, `"call"`, `"null"`, `"void"`.',
    signature: 'typeof(value<every>)',
    parameters: ['value<every>'],
  },
];

const MODULE_MEMBERS = {
  system: [
    { label: 'exec', insertText: 'exec(${1:command})', signature: 'exec(command<string>)', documentation: 'Runs a shell command and returns its output.' },
    { label: 'env', insertText: 'env(${1:name})', signature: 'env(name<string>)', documentation: 'Gets an environment variable value.' },
    { label: 'set_env', insertText: 'set_env(${1:name}, ${2:value})', signature: 'set_env(name<string>, value<string>)', documentation: 'Sets an environment variable.' },
    { label: 'platform', insertText: 'platform', signature: 'platform<string>', documentation: 'Constant with the OS name.', kind: vscode.CompletionItemKind.Constant },
    { label: 'username', insertText: 'username', signature: 'username<string>', documentation: 'Constant with the current username.', kind: vscode.CompletionItemKind.Constant },
    { label: 'cwd', insertText: 'cwd()', signature: 'cwd()', documentation: 'Returns the current working directory.' },
    { label: 'exit', insertText: 'exit(${1:0})', signature: 'exit([code<number>])', documentation: 'Exits the script. `code` is optional and defaults to `0`.' },
  ],
  files: [
    { label: 'cwd', insertText: 'cwd()', signature: 'cwd()', documentation: 'Returns the current working directory.' },
    { label: 'mkdir', insertText: 'mkdir(${1:path})', signature: 'mkdir(path<string>, [parents<bool|number>])', documentation: 'Creates a directory. `parents` is optional and defaults to `true`.' },
    { label: 'rm', insertText: 'rm(${1:path})', signature: 'rm(path<string>)', documentation: 'Removes a file.' },
    { label: 'rmdir', insertText: 'rmdir(${1:path})', signature: 'rmdir(path<string>)', documentation: 'Removes a directory recursively.' },
    { label: 'list', insertText: 'list()', signature: 'list([path<string>])', documentation: 'Lists directory entries. `path` is optional and defaults to `"."`.' },
    { label: 'cp', insertText: 'cp(${1:src}, ${2:dst})', signature: 'cp(src<string>, dst<string>)', documentation: 'Copies a file or directory.' },
    { label: 'mv', insertText: 'mv(${1:src}, ${2:dst})', signature: 'mv(src<string>, dst<string>)', documentation: 'Moves or renames a file or directory.' },
  ],
  paths: [
    { label: 'join', insertText: 'join(${1:["src", "file.omi"]})', signature: 'join(parts<list<string>>)', documentation: 'Joins a list of path parts into a single path.' },
    { label: 'abs', insertText: 'abs(${1:path})', signature: 'abs(path<string>)', documentation: 'Converts a path to an absolute path.' },
    { label: 'exists', insertText: 'exists(${1:path})', signature: 'exists(path<string>)', documentation: 'Checks whether a file or directory exists.' },
    { label: 'ext', insertText: 'ext(${1:path})', signature: 'ext(path<string>)', documentation: 'Returns the file extension.' },
    { label: 'name', insertText: 'name(${1:path})', signature: 'name(path<string>)', documentation: 'Returns the file name from a path.' },
  ],
  time: [
    { label: 'now', insertText: 'now()', signature: 'now()', documentation: 'Returns the current Unix timestamp.' },
    { label: 'format', insertText: 'format(${1:timestamp})', signature: 'format(timestamp<number>, [fmt<string>])', documentation: 'Formats a timestamp. `fmt` is optional.' },
    { label: 'parse', insertText: 'parse(${1:"2026-01-01 00:00:00"})', signature: 'parse(string<string>, [fmt<string>])', documentation: 'Parses a time string into a timestamp. `fmt` is optional.' },
    { label: 'sleep', insertText: 'sleep(${1:1})', signature: 'sleep(seconds<number>)', documentation: 'Pauses execution for the specified number of seconds.' },
    { label: 'timezone', insertText: 'timezone()', signature: 'timezone()', documentation: 'Returns the timezone offset in hours.' },
  ],
  math: [
    { label: 'abs', insertText: 'abs(${1:n})', signature: 'abs(n<number>)', documentation: 'Absolute value.' },
    { label: 'round', insertText: 'round(${1:n})', signature: 'round(n<number>)', documentation: 'Rounds to the nearest integer.' },
    { label: 'floor', insertText: 'floor(${1:n})', signature: 'floor(n<number>)', documentation: 'Rounds down.' },
    { label: 'ceil', insertText: 'ceil(${1:n})', signature: 'ceil(n<number>)', documentation: 'Rounds up.' },
    { label: 'sqrt', insertText: 'sqrt(${1:n})', signature: 'sqrt(n<number>)', documentation: 'Square root.' },
    { label: 'log', insertText: 'log(${1:n})', signature: 'log(n<number>, [base<number>])', documentation: 'Logarithm. `base` is optional; if omitted, the natural log is used.' },
    { label: 'exp', insertText: 'exp(${1:n})', signature: 'exp(n<number>)', documentation: 'Exponential function (`e^n`).' },
    { label: 'min', insertText: 'min(${1:list})', signature: 'min(lst<list<number>>)', documentation: 'Minimum value in a number list.' },
    { label: 'max', insertText: 'max(${1:list})', signature: 'max(lst<list<number>>)', documentation: 'Maximum value in a number list.' },
    { label: 'random', insertText: 'random()', signature: 'random()', documentation: 'Random float in `[0.0, 1.0)`.' },
    { label: 'randint', insertText: 'randint(${1:a}, ${2:b})', signature: 'randint(a<number>, b<number>)', documentation: 'Random integer in the inclusive range `[a, b]`.' },
    { label: 'randfloat', insertText: 'randfloat(${1:a}, ${2:b})', signature: 'randfloat(a<number>, b<number>, [digits<number>])', documentation: 'Random float; `digits` is optional.' },
    { label: 'choice', insertText: 'choice(${1:list})', signature: 'choice(lst<list>)', documentation: 'Returns a random item from a list.' },
    { label: 'pi', insertText: 'pi', signature: 'pi', documentation: 'Mathematical constant π.', kind: vscode.CompletionItemKind.Constant },
    { label: 'e', insertText: 'e', signature: 'e', documentation: 'Mathematical constant e.', kind: vscode.CompletionItemKind.Constant },
    { label: 'inf', insertText: 'inf', signature: 'inf', documentation: 'Infinity constant.', kind: vscode.CompletionItemKind.Constant },
  ],
  json: [
    { label: 'parse', insertText: 'parse(${1:text})', signature: 'parse(text<string>)', documentation: 'Parses a JSON string into an Omi value.' },
    { label: 'stringify', insertText: 'stringify(${1:value})', signature: 'stringify(value<every>, [indent<number>])', documentation: 'Serializes a value to JSON. `indent` is optional.' },
    { label: 'read', insertText: 'read(${1:path})', signature: 'read(path<string>)', documentation: 'Reads and parses a JSON file.' },
    { label: 'write', insertText: 'write(${1:path}, ${2:value})', signature: 'write(path<string>, value<every>, [indent<number>])', documentation: 'Writes a value to a JSON file. `indent` is optional.' },
    { label: 'append', insertText: 'append(${1:path}, ${2:value})', signature: 'append(path<string>, value<every>)', documentation: 'Appends a value to a JSON array file.' },
    { label: 'exists', insertText: 'exists(${1:path})', signature: 'exists(path<string>)', documentation: 'Checks whether a JSON file exists.' },
  ],
  http: [
    { label: 'get', insertText: 'get(${1:url})', signature: 'get(url<string>, [headers<dict>])', documentation: 'Sends a GET request. `headers` is optional.' },
    { label: 'post', insertText: 'post(${1:url})', signature: 'post(url<string>, [body<every>], [headers<dict>])', documentation: 'Sends a POST request with optional body and headers.' },
    { label: 'put', insertText: 'put(${1:url})', signature: 'put(url<string>, [body<every>], [headers<dict>])', documentation: 'Sends a PUT request with optional body and headers.' },
    { label: 'patch', insertText: 'patch(${1:url})', signature: 'patch(url<string>, [body<every>], [headers<dict>])', documentation: 'Sends a PATCH request with optional body and headers.' },
    { label: 'delete', insertText: 'delete(${1:url})', signature: 'delete(url<string>, [headers<dict>])', documentation: 'Sends a DELETE request. `headers` is optional.' },
    { label: 'request', insertText: 'request(${1:"GET"}, ${2:url})', signature: 'request(method<string>, url<string>, [body<every>], [headers<dict>])', documentation: 'Generic HTTP request.' },
    { label: 'download', insertText: 'download(${1:url}, ${2:path})', signature: 'download(url<string>, path<string>)', documentation: 'Downloads a file to disk.' },
    { label: 'upload', insertText: 'upload(${1:url}, ${2:path})', signature: 'upload(url<string>, path<string>, [field_name<string>])', documentation: 'Uploads a file. `field_name` is optional and defaults to `"file"`.' },
  ],
  txt: [
    { label: 'read', insertText: 'read(${1:path})', signature: 'read(path<string>, [encoding<string>])', documentation: 'Reads a text file and returns its contents as a string.' },
    { label: 'write', insertText: 'write(${1:path}, ${2:content})', signature: 'write(path<string>, content<string>, [encoding<string>])', documentation: 'Writes a string to a text file (overwrites).' },
    { label: 'append', insertText: 'append(${1:path}, ${2:content})', signature: 'append(path<string>, content<string>, [encoding<string>])', documentation: 'Appends a string to a text file.' },
    { label: 'lines', insertText: 'lines(${1:path})', signature: 'lines(path<string>, [encoding<string>])', documentation: 'Returns file lines as list<string> with newlines stripped.' },
    { label: 'write_lines', insertText: 'write_lines(${1:path}, ${2:lines})', signature: 'write_lines(path<string>, lines<list>, [encoding<string>])', documentation: 'Writes each list element as a line.' },
    { label: 'size', insertText: 'size(${1:path})', signature: 'size(path<string>)', documentation: 'Returns file size in bytes.' },
    { label: 'exists', insertText: 'exists(${1:path})', signature: 'exists(path<string>)', documentation: 'Returns true if the file exists.' },
    { label: 'backup', insertText: 'backup(${1:path})', signature: 'backup(path<string>)', documentation: 'Creates a timestamped .bak copy; returns the backup path.' },
  ],
  string: [
    { label: 'len', insertText: 'len(${1:str})', signature: 'len(str<string>)', documentation: 'Returns the number of characters.' },
    { label: 'slice', insertText: 'slice(${1:str}, ${2:start}, ${3:end})', signature: 'slice(str<string>, start<int>, end<int>)', documentation: 'Returns a substring from start (inclusive) to end (exclusive).' },
    { label: 'split', insertText: 'split(${1:str}, ${2:delimiter})', signature: 'split(str<string>, delimiter<string>)', documentation: 'Splits the string by delimiter, returns list<string>.' },
    { label: 'join', insertText: 'join(${1:list}, ${2:delimiter})', signature: 'join(list<list>, delimiter<string>)', documentation: 'Joins list elements with the delimiter.' },
    { label: 'replace', insertText: 'replace(${1:str}, ${2:old}, ${3:new})', signature: 'replace(str<string>, old<string>, new<string>, [count<int>])', documentation: 'Replaces occurrences of old with new. count is optional (default: all).' },
    { label: 'trim', insertText: 'trim(${1:str})', signature: 'trim(str<string>)', documentation: 'Strips leading and trailing whitespace.' },
    { label: 'trim_left', insertText: 'trim_left(${1:str})', signature: 'trim_left(str<string>)', documentation: 'Strips leading whitespace.' },
    { label: 'trim_right', insertText: 'trim_right(${1:str})', signature: 'trim_right(str<string>)', documentation: 'Strips trailing whitespace.' },
    { label: 'upper', insertText: 'upper(${1:str})', signature: 'upper(str<string>)', documentation: 'Converts to uppercase.' },
    { label: 'lower', insertText: 'lower(${1:str})', signature: 'lower(str<string>)', documentation: 'Converts to lowercase.' },
    { label: 'contains', insertText: 'contains(${1:str}, ${2:substring})', signature: 'contains(str<string>, substring<string>)', documentation: 'Returns true if the substring is found.' },
    { label: 'starts_with', insertText: 'starts_with(${1:str}, ${2:prefix})', signature: 'starts_with(str<string>, prefix<string>)', documentation: 'Returns true if str starts with prefix.' },
    { label: 'ends_with', insertText: 'ends_with(${1:str}, ${2:suffix})', signature: 'ends_with(str<string>, suffix<string>)', documentation: 'Returns true if str ends with suffix.' },
    { label: 'index_of', insertText: 'index_of(${1:str}, ${2:substring})', signature: 'index_of(str<string>, substring<string>)', documentation: 'Returns the index of the first match, or -1.' },
    { label: 'format', insertText: 'format(${1:template}, ${2:values})', signature: 'format(template<string>, values<list|dict>)', documentation: 'Replaces {} positionally (list) or {key} by name (dict).' },
    { label: 'repeat', insertText: 'repeat(${1:str}, ${2:count})', signature: 'repeat(str<string>, count<int>)', documentation: 'Repeats the string count times.' },
    { label: 'pad_left', insertText: 'pad_left(${1:str}, ${2:length})', signature: 'pad_left(str<string>, length<int>, [char<string>])', documentation: 'Right-justifies string in a field of given length. char is optional (default: space).' },
    { label: 'pad_right', insertText: 'pad_right(${1:str}, ${2:length})', signature: 'pad_right(str<string>, length<int>, [char<string>])', documentation: 'Left-justifies string in a field of given length. char is optional (default: space).' },
    { label: 'reverse', insertText: 'reverse(${1:str})', signature: 'reverse(str<string>)', documentation: 'Reverses the string.' },
  ],
  regex: [
    { label: 'test', insertText: 'test(${1:str}, ${2:pattern})', signature: 'test(str<string>, pattern<string>)', documentation: 'Returns true if the pattern matches anywhere in str.' },
    { label: 'match', insertText: 'match(${1:str}, ${2:pattern})', signature: 'match(str<string>, pattern<string>)', documentation: 'Returns the first match as a string, or null.' },
    { label: 'find_all', insertText: 'find_all(${1:str}, ${2:pattern})', signature: 'find_all(str<string>, pattern<string>)', documentation: 'Returns all non-overlapping matches as list<string>.' },
    { label: 'replace', insertText: 'replace(${1:str}, ${2:pattern}, ${3:replacement})', signature: 'replace(str<string>, pattern<string>, replacement<string>)', documentation: 'Replaces all pattern matches with replacement.' },
    { label: 'split', insertText: 'split(${1:str}, ${2:pattern})', signature: 'split(str<string>, pattern<string>)', documentation: 'Splits str by the pattern, returns list<string>.' },
  ],
};

const KEYWORD_SNIPPETS = [
  { label: 'var', snippet: 'var<${1:int}> ${2:name} = ${3:value}', detail: 'Omi variable snippet', documentation: 'Creates a typed variable declaration.' },
  { label: 'const', snippet: 'const<${1:int}> ${2:NAME} = ${3:value}', detail: 'Omi constant snippet', documentation: 'Creates a typed constant declaration. Cannot be reassigned.' },
  { label: 'var[]', snippet: 'var[${1:int}] ${2:name} = [${3}]', detail: 'Omi typed array snippet', documentation: 'Creates a typed array (restricts element types).' },
  { label: 'var[]()', snippet: 'var[${1:int}](${2:5}) ${3:name} = [${4}]', detail: 'Omi sized typed array snippet', documentation: 'Creates a typed array with a maximum element count.' },
  { label: 'type', snippet: 'type ${1:Name} = ${2:int | string}', detail: 'Omi type alias snippet', documentation: 'Creates a type alias.' },
  { label: 'enum', snippet: 'enum ${1:Name} = {\n  ${2:Variant},\n  ${3:Another(${4:T})}\n}', detail: 'Omi enum snippet', documentation: 'Creates a tagged union (ADT) with unit or payload variants.' },
  { label: 'trait', snippet: 'trait ${1:Name} = {\n  func<${2:void}> ${3:method}()\n}', detail: 'Omi trait snippet', documentation: 'Creates a structural interface for types.' },
  { label: 'if', snippet: 'if ${1:condition}:\n  $0\nend', detail: 'Omi keyword snippet', documentation: 'Creates an `if` block.' },
  { label: 'elif', snippet: 'elif ${1:condition}:\n  $0', detail: 'Omi keyword snippet', documentation: 'Creates an `elif` block.' },
  { label: 'else', snippet: 'else:\n  $0', detail: 'Omi keyword snippet', documentation: 'Creates an `else` block.' },
  { label: 'for', snippet: 'for ${1:i} = ${2:0} to ${3:10} step ${4:1}:\n  $0\nend', detail: 'Omi keyword snippet', documentation: 'Creates a `for` loop.' },
  { label: 'while', snippet: 'while ${1:condition}:\n  $0\nend', detail: 'Omi keyword snippet', documentation: 'Creates a `while` loop.' },
  { label: 'func', snippet: 'func<${1:return}> ${2:name}(${3:arg}):\n  $0\nend', detail: 'Omi function snippet', documentation: 'Creates a block function.' },
];

const DIRECTIVE_SNIPPETS = [
  { label: 'import', snippet: 'import "${1:path}" as ${2:alias}', detail: 'Omi directive snippet', documentation: 'Imports a module. Fill in the full path and alias manually.' },
  { label: 'use', snippet: 'use ${1:notypes}', detail: 'Omi directive snippet', documentation: 'Enables a language/runtime flag.' },
  { label: 'set', snippet: 'set ${1:NAME} as ${2:value}', detail: 'Omi directive snippet', documentation: 'Creates an alias or constant.' },
];

function createSnippetCompletion(label, snippet, detail, documentation) {
  const item = new vscode.CompletionItem(label, vscode.CompletionItemKind.Snippet);
  item.insertText = new vscode.SnippetString(snippet);
  item.detail = detail;
  item.documentation = new vscode.MarkdownString(documentation);
  return item;
}

function createFunctionCompletion(entry, prefix = '') {
  const kind = entry.kind || vscode.CompletionItemKind.Function;
  const item = new vscode.CompletionItem(entry.label, kind);
  item.insertText = entry.insertText ? new vscode.SnippetString(entry.insertText) : entry.label;
  item.detail = prefix ? `${prefix}${entry.signature}` : entry.signature || entry.detail || entry.label;
  item.documentation = new vscode.MarkdownString(entry.documentation || '');
  return item;
}

const GENERAL_COMPLETIONS = [
  ...KEYWORD_SNIPPETS.map((entry) => createSnippetCompletion(entry.label, entry.snippet, entry.detail, entry.documentation)),
  ...GLOBAL_ITEMS.map((entry) => createFunctionCompletion(entry)),
  new vscode.CompletionItem('true', vscode.CompletionItemKind.Keyword),
  new vscode.CompletionItem('false', vscode.CompletionItemKind.Keyword),
  new vscode.CompletionItem('null', vscode.CompletionItemKind.Keyword),
  new vscode.CompletionItem('and', vscode.CompletionItemKind.Keyword),
  new vscode.CompletionItem('or', vscode.CompletionItemKind.Keyword),
  new vscode.CompletionItem('is', vscode.CompletionItemKind.Keyword),
  new vscode.CompletionItem('isnt', vscode.CompletionItemKind.Keyword),
  new vscode.CompletionItem('return', vscode.CompletionItemKind.Keyword),
  new vscode.CompletionItem('continue', vscode.CompletionItemKind.Keyword),
  new vscode.CompletionItem('break', vscode.CompletionItemKind.Keyword),
];

const DIRECTIVE_COMPLETIONS = DIRECTIVE_SNIPPETS.map((entry) =>
  createSnippetCompletion(entry.label, entry.snippet, entry.detail, entry.documentation)
);

const USE_FLAG_COMPLETIONS = USE_FLAGS.map((flag) => {
  const item = new vscode.CompletionItem(flag, vscode.CompletionItemKind.EnumMember);
  item.insertText = flag;
  item.detail = 'Omi @use flag';
  return item;
});

function getAliasMap(document) {
  const text = document.getText();
  const map = new Map();
  const regex = /@import\s+["']omi:([a-z]+)["']\s+as\s+([A-Za-z_][A-Za-z0-9_]*)/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    map.set(match[2], match[1]);
  }
  return map;
}

function getModuleMemberCompletions(moduleName) {
  const members = MODULE_MEMBERS[moduleName] || [];
  return members.map((entry) => createFunctionCompletion(entry, `${moduleName}.`));
}

function findCurrentCall(linePrefix) {
  let depth = 0;
  let inString = false;
  let quote = '';

  for (let i = linePrefix.length - 1; i >= 0; i -= 1) {
    const ch = linePrefix[i];
    const prev = linePrefix[i - 1];

    if (inString) {
      if (ch === quote && prev !== '\\') {
        inString = false;
      }
      continue;
    }

    if (ch === '"' || ch === "'") {
      inString = true;
      quote = ch;
      continue;
    }

    if (ch === ')') {
      depth += 1;
      continue;
    }

    if (ch === '(') {
      if (depth === 0) {
        let end = i;
        let start = i - 1;
        while (start >= 0 && /\s/.test(linePrefix[start])) {
          start -= 1;
        }
        end = start + 1;
        while (start >= 0 && /[A-Za-z0-9_.]/.test(linePrefix[start])) {
          start -= 1;
        }

        const callee = linePrefix.slice(start + 1, end);
        if (!callee) {
          return null;
        }

        return {
          callee,
          argsText: linePrefix.slice(i + 1),
        };
      }
      depth -= 1;
    }
  }

  return null;
}

function countActiveParameter(argsText) {
  let depth = 0;
  let inString = false;
  let quote = '';
  let commas = 0;

  for (let i = 0; i < argsText.length; i += 1) {
    const ch = argsText[i];
    const prev = argsText[i - 1];

    if (inString) {
      if (ch === quote && prev !== '\\') {
        inString = false;
      }
      continue;
    }

    if (ch === '"' || ch === "'") {
      inString = true;
      quote = ch;
      continue;
    }

    if ('([{'.includes(ch)) {
      depth += 1;
      continue;
    }

    if (')]}'.includes(ch)) {
      depth = Math.max(0, depth - 1);
      continue;
    }

    if (ch === ',' && depth === 0) {
      commas += 1;
    }
  }

  return commas;
}

function getSignatureEntry(callee, document) {
  if (callee.includes('.')) {
    const [alias, member] = callee.split('.');
    const aliasMap = getAliasMap(document);
    const moduleName = aliasMap.get(alias) || (MODULE_MEMBERS[alias] ? alias : null);
    if (!moduleName) {
      return null;
    }
    return (MODULE_MEMBERS[moduleName] || []).find((entry) => entry.label === member) || null;
  }

  return GLOBAL_ITEMS.find((entry) => entry.label === callee) || null;
}

function provideCompletionItems(document, position) {
  const linePrefix = document.lineAt(position).text.slice(0, position.character);

  if (/(^|\s)@[A-Za-z_]*$/u.test(linePrefix)) {
    return DIRECTIVE_COMPLETIONS;
  }

  if (/@use\s+[A-Za-z_]*$/u.test(linePrefix)) {
    return USE_FLAG_COMPLETIONS;
  }

  if (/@import\s*$/u.test(linePrefix) || /@import\s+["'][^"']*$/u.test(linePrefix)) {
    return [];
  }

  const moduleAccessMatch = linePrefix.match(/([A-Za-z_][A-Za-z0-9_]*)\.([A-Za-z0-9_]*)$/u);
  if (moduleAccessMatch) {
    const alias = moduleAccessMatch[1];
    const aliasMap = getAliasMap(document);
    const moduleName = aliasMap.get(alias) || (MODULE_MEMBERS[alias] ? alias : null);
    if (moduleName) {
      return getModuleMemberCompletions(moduleName);
    }
  }

  return GENERAL_COMPLETIONS;
}

function provideSignatureHelp(document, position) {
  const linePrefix = document.lineAt(position).text.slice(0, position.character);
  const call = findCurrentCall(linePrefix);
  if (!call) {
    return null;
  }

  const entry = getSignatureEntry(call.callee, document);
  if (!entry || !entry.signature) {
    return null;
  }

  const signatureHelp = new vscode.SignatureHelp();
  const signature = new vscode.SignatureInformation(
    entry.signature,
    new vscode.MarkdownString(entry.documentation || '')
  );

  signature.parameters = (entry.parameters || []).map(
    (parameter) => new vscode.ParameterInformation(parameter)
  );

  signatureHelp.signatures = [signature];
  signatureHelp.activeSignature = 0;
  signatureHelp.activeParameter = Math.min(
    countActiveParameter(call.argsText),
    Math.max(0, signature.parameters.length - 1)
  );

  return signatureHelp;
}

export function activate(context: vscode.ExtensionContext) {
  const completionProvider = vscode.languages.registerCompletionItemProvider(
    { language: 'omi' },
    {
      provideCompletionItems,
    },
    '.',
    '@'
  );

  const signatureProvider = vscode.languages.registerSignatureHelpProvider(
    { language: 'omi' },
    {
      provideSignatureHelp,
    },
    '(',
    ','
  );

  context.subscriptions.push(completionProvider, signatureProvider);
}

export function deactivate() {}
