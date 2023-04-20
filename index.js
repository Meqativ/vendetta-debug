import { hostname } from "os";
import repl from "repl";
import { WebSocketServer } from "ws";
import colors from "ansi-colors";
import { parseArgs } from "util"
const { cyan, red, yellow, bold: { magenta } } = colors;

const silentLvl = process.argv[2]?.startsWith("shh") ? ((process.argv[2].slice(3).split('').every(c=>c==='h') && process.argv[2].slice(3).split('').length > 0) ? 2 : 1) : 0
const wssPort = 9090



let isPrompting = false;

// Utility functions for more visually pleasing logs
// Get out of user input area first if prompt is currently being shown
const colorize = (data, source, color) => color(`[${source}] `) + data;
const safeLog = (data) => console.log((isPrompting ? "\n" : "") + data);

const discordColorize = (data) => {
  let { message, level } = JSON.parse(data);
  // Normal logs don't need extra colorization
  switch (level) {
    case 0: // Info
      message = cyan(message);
      break;
    case 2: // Warning
      message = yellow(message);
      break;
    case 3: // Error
      message = red(message);
      break;
  }
  return colorize(message, "Vendetta", cyan);
};
const discordLog = (data) => safeLog((silentLvl === 2) ? data : discordColorize(data));

const debuggerColorize = (data) => colorize(data, "Debugger", magenta);
const debuggerLog = (data) => safeLog((silentLvl === 2) ? data : debuggerColorize(data));
const debuggerError = (err, isReturning) => {
  safeLog(colorize(red("Error"), "Debugger", red.bold));
  if (isReturning) {
    return err;
  }
  console.error(err);
}


// Display welcome message and basic instructions
if (silentLvl < 1) console.log(
		"Welcome to the unofficial Vendetta debugger.\n"+
		"Press Ctrl+C to exit.\n"+
		"How to connect to the debugger\n"+
	"	https://github.com/Meqativ/vendetta-debug/blob/master/README.md#connecting"
);

// Create websocket server and REPL, and wait for connection
const wss = new WebSocketServer({ port: wssPort });
wss.on("listening", (ws) => {
	if (silentLvl < 2) debuggerLog(`Listening for connections on port ${wss.address().port}`);
})
wss.on("connection", (ws) => {
  if (silentLvl < 2) debuggerLog("Connected to Discord over websocket, starting debug session");

  isPrompting = false; // REPL hasn't been created yet
  let finishCallback;
	
  // Handle logs returned from Discord client via the websocket
  ws.on("message", (data) => {
    try {
      if (finishCallback) {
        finishCallback(null, data);
        finishCallback = undefined;
      } else {
        discordLog(data);
      }
    } catch (e) {
      debuggerError(e, false);
    }
    isPrompting = true;
    rl.displayPrompt();
  });

  // Create the REPL
  const rl = repl.start({
    eval: (input, ctx, filename, cb) => {
      try {
        if (!input.trim()) {
          cb();
        } else {
          isPrompting = false;
					ws.send(`const res=(0, eval)(${JSON.stringify(input)});let out=vendetta.metro.findByProps("inspect").inspect(res,{showHidden:true});if(out!=="undefined")console.log(out);res`); // Logs out the returned value
					finishCallback = cb;
        }
      } catch (e) {
        cb(e);
      }
    },
    writer: (data) => {
      return (data instanceof Error) ? debuggerError(data, true) : discordColorize(data);
    }
  });

  isPrompting = true; // Now the REPL exists and is prompting the user for input
  
  rl.on("close", () => {
    if (silentLvl < 2) debuggerLog("Closing debugger, press Ctrl+C to exit");
  });

  ws.on("close", () => {
    if (silentLvl < 2) debuggerLog("Websocket has been closed");
    isPrompting = false;
    rl.close();
  });
});
