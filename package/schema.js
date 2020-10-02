module.exports = handleSchema;

function handleType(schema) {
  if (
    !schema.type &&
    schema.properties &&
    typeof schema.properties === "object"
  ) {
    schema.type = "object";
  }
}

function handleSchema(schema, formatName) {
  if (schema && schema.$ref) {
    // do nothing with $ref option
  } else if (schema && !schema.type && !schema.properties) {
    schema.type = "string";
  }
  handleType(schema);
  if (schema.type === "object") {
    if (!schema.properties) schema.properties = {};
    handleObject(schema.properties, formatName);
  } else if (schema.type === "array") {
    if (!schema.items) schema.items = { type: "string" };
    handleSchema(schema.items, formatName);
  } else {
    return schema;
  }
}

function handleObject(properties, formatName) {
  for (var key in properties) {
    if (typeof formatName === "function") {
      var newKey = formatName(key);
      if (newKey && newKey !== key) {
        properties[newKey] = properties[key];
        delete properties[key];
        key = newKey;
      }
    }

    handleType(properties[key]);
    if (properties[key].type === "array" || properties[key].type === "object")
      handleSchema(properties[key], formatName);
  }
}
