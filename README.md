# Vendetta Debugger

A fork of @colin273/enmity-debugger, which is a (relatively) simple remote debugger for [Vendetta](https://github.com/vendetta-mod). This connects over a websocket to the Discord app with Vendetta installed and allows you to execute JavaScript in the Discord app from the command line. The REPL in this debugger is a slightly modified version of the [default REPL in Node.js](https://nodejs.org/api/repl.html), including the same commands and some support for multi-line code snippets.

## Installing

To install this debugger and its dependencies, run the following commands in the terminal:

```bash
git clone https://github.com/Meqativ/vendetta-debug && cd vendetta-debug
pnpm i
```

(The dependencies are minimal, by the way. The only third-party modules this debugger needs are `ws` for the websocket server and `ansi-colors` to make the console output look prettier. Neither of those have any dependencies of their own.)

## Running

To start the debugger, run this command from inside the `vendetta-debug` folder:

```bash
node .
```

## Connecting

tbd

## Quitting

Once you have finished debugging and closed the debugger REPL, press `Ctrl+C` on your keyboard to quit the CLI.
