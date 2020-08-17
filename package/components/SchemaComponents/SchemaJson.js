import React from "react";
import PropTypes from "prop-types";
import SchemaObject from "./SchemaObject";
import SchemaArray from "./SchemaArray";

import "./schemaJson.css";

export const mapping = (name, data, showEdit, showAdv) => {
  switch (data.type) {
    case "array":
      return (
        <SchemaArray
          prefix={name}
          data={data}
          showEdit={showEdit}
          showAdv={showAdv}
        />
      );
    case "object":
      let nameArray = [].concat(name, "properties");
      return (
        <SchemaObject
          prefix={nameArray}
          data={data}
          showEdit={showEdit}
          showAdv={showAdv}
        />
      );
    default:
      return null;
  }
};

const SchemaJson = (props) => {
  const item = mapping([], props.data, props.showEdit, props.showAdv);
  return <div className="schema-content">{item}</div>;
};

SchemaJson.contextTypes = {
  getOpenValue: PropTypes.func,
  Model: PropTypes.object,
  isMock: PropTypes.bool,
};

export default SchemaJson;
