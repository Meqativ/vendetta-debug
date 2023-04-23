import { hostname } from "os";
import repl from "repl";
import { WebSocketServer } from "ws";
import colors from "ansi-colors";
import { parseArgs } from "util";
/*const {
	cyan,
	red,
	yellow,
	bold: { magenta },
} = colors;*/
const COLORS = {
	client: {
		info: colors.cyan,
		error: colors.red,
		warning: colors.yellow,
	},
	debugger: {
		info: colors.magenta.bold,
		error: colors.red.bold,
	},
};
const args = parseArgs({
	strict: false,
	options: {
		silent: { type: "string" },
		port: { type: "string", default: "9090" },
	},
});

// Parse arguments
const silentLvl = Number(args?.values?.silent ?? 0);
if (Number.isNaN(silentLvl))
	throw new Error('The option "silent" should be a number.');
if (silentLvl > 2 || silentLvl < 0)
	throw new Error('The option "silent" should in range 0-2.');

const wssPort = Number(args?.values?.port ?? 9090);
if (Number.isNaN(wssPort))
	throw new Error('The option "port" should be a number.');

let isPrompting = false;

// Utility functions for more visually pleasing logs
// Get out of user input area first if prompt is currently being shown
const colorise = (data, source, color) => color(`[${source}] `) + data;
const safeLog = (data) => console.log((isPrompting ? "\n" : "") + data);

const discordColorise = (data) => {
	let { message, level } = JSON.parse(data);
	// Normal logs don't need extra colorization
	switch (level) {
		case 0: // Info
			message = COLORS.client.info(message);
			break;
		case 2: // Warning
			message = COLORS.client.warning(message);
			break;
		case 3: // Error
			message = COLORS.client.error(message);
			break;
	}
	return colorise(message, "Vendetta", COLORS.client.info);
};
const discordLog = (data) =>
	safeLog(silentLvl === 2 ? data : discordColorise(data));

const debuggerColorise = (data) =>
	colorise(data, "Debugger", COLORS.debugger.info);

const debuggerLog = (data) =>
	safeLog(silentLvl === 2 ? data : debuggerColorise(data));
const debuggerError = (err, isReturning) => {
	safeLog(colorise("Error", "Debugger", COLORS.debugger.error));
	if (isReturning) {
		return err;
	}
	console.error(err);
};

// Display welcome message and basic instructions
if (silentLvl < 1)
	console.log(
		"Welcome to the unofficial Vendetta debugger.\n" +
			"Press Ctrl+C to exit.\n" +
			"How to connect to the debugger: https://github.com/Meqativ/vendetta-debug/blob/master/README.md#connecting"
	);

// Create websocket server and REPL, and wait for connection
const wss = new WebSocketServer({ port: wssPort });
wss.on("listening", (ws) => {
	if (silentLvl < 2)
		debuggerLog(`Listening for connections on port ${wss.address().port}`);
});
wss.on("connection", (ws) => {
	if (silentLvl < 2)
		debuggerLog("Connected to Discord over websocket, starting debug session");

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
					ws.send(
						`const res=(0, eval)(${JSON.stringify(
							input
						)});let out=vendetta.metro.findByProps("inspect").inspect(res,{showHidden:true});if(out!=="undefined")console.log(out);res`
					); // Logs out the returned value
					finishCallback = cb;
				}
			} catch (e) {
				cb(e);
			}
		},
		writer: (data) => {
			return data instanceof Error
				? debuggerError(data, true)
				: discordColorise(data);
		},
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
