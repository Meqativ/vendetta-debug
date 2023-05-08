export function generate(cmdlu) {
	return cmdlu([
		{
			header: "Vendetta Debugger",
			content:
				"A fork of @colin273/enmity-debugger, which is a remote debugger for Vendetta. This connects over a websocket to the Discord app with Vendetta installed and allows you to execute JavaScript in the Discord app from the command line. The REPL in this debugger is a slightly modified version of the default REPL in Node.js, including the same commands and some support for multi-line code snippets",
		},
		{
			header: "Options",
			optionList: [
				{
					name: "help",
					alias: "h",
					description: "Shows the text you're reading right now",
					type: Boolean,
				},
				{
					name: "silent",
					typeLabel: "{underline level} (int, 0-2)",
					type: String,
					description:
						"Level of silency for the output\n" +
						"0: none (default)\n" +
						"1: hides the welcome message\n" +
						"2: hides logs from the debugger",
				},
				{
					name: "port",
					typeLabel: "{underline port} (int, 1-65535)",
					type: Number,
					description: "Port on which to run the websocket",
				},
				{
					name: "onConnectedPath",
					typeLabel: "{underline file_path} (string)",
					type: String,
					description:
						"Path to the file with javascript code, that will be sent to the client on every connection",
				},
			],
		},
	]);
}
