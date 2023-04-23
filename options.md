# Options

## -h, --help
> Shows the help message. <br/>
> Optional dependencies are required for this

## --silent __level__ (0-2)
> Level of silency for the output. <br/>
> `0`: none (default) <br/>
> `1`: hides the welcome message <br/>
> `2`: hides logs from the debugger too <br/>
<details> 

<summary> Example </summary>

`node . --silent=1`

</details>

## --port __number__
> Port on which to run the websocket.
<details> 

<summary> Example </summary>

`node . --port=6969`

</details>

## --onConnectedPath __filePath__
> Path to the file with javascript code that will be sent to the client on every connection.
<details> 

<summary> Example </summary>

`node . --onConnectedPath="~/test.js"`<br/>
```js
// ~/test.js
console.log("hai")
```

</details>

# Change defaults
You can change the default values of options by editing `defaults.json`.
(Note: don't remove the quotes in the number options)
