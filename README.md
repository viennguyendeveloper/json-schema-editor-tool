# json-schema-editor-visual

The main package https://github.com/YMFE/json-schema-editor-visual is no longer maintain so I move it to the new place for improving and fixing bug!

A json-schema editor of high efficient and easy-to-use, base on React.

![avatar](json-schema-editor-visual.jpg)

## Usage

```
npm install json-schema-editor-tool
```

```js
const option = {};
import "antd/dist/antd.css";
require("json-schema-editor-tool/dist/main.css");
const schemaEditor = require("json-schema-editor-tool/dist/main.js");
const SchemaEditor = schemaEditor(option);

render(<SchemaEditor />, document.getElementById("root"));
```

## Option Object

| name | desc                                 | default |
| ---- | ------------------------------------ | ------- |
| `lg` | language, support `en_US` or `zh_CN` | en_US   |

## SchemaEditor Props

| name         | type     | default | desc               |
| ------------ | -------- | ------- | ------------------ |
| `data`       | string   | null    | the data of editor |
| `onChange`   | function | null    |
| `showEditor` | boolean  | false   |
