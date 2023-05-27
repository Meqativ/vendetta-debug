# Options

## -h, --help
> Shows the help message. <br/>
> Optional dependencies are required for this

## --silent __level__ (0-2)
> Level of silency for the output. <br/>
> Default: 0
> `0`: none<br/>
> `1`: hides the welcome message <br/>
> `2`: hides logs from the debugger too <br/>
<details> 

<summary> Example </summary>

`node . --silent=1`

</details>

## --port __number__
> Default: 9090
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

## --client __option__
> Default: Vendetta<br/>

### Available options
|  option  |   name   | color |         send         |
| -------- | -------- | ----- | -------------------- |
| vendetta | Vendetta | cyan  | shows returned value |
| enmity   | Enmity   | blue  | shows returned value |
| none     | None     | gray  | raw                  |
<details> 

<summary> Example </summary>

`node . --client="enmity"`<br/>

</details>

## --clientColor __color__
> Color of the output prefix<br/>
> Default: cyan (inherit from client)

### Available colors
https://github.com/doowb/ansi-colors#available-styles

## --clientName __name__
> Name for the output prefix<br/>
> Default: Vendetta (inherit from client)

# Change defaults
You can change the default values of options by editing `defaults.json`.
> **Note**
> it applies everywhere
