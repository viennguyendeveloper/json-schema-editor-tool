import React, { PureComponent } from "react";
import {
  Row,
  Col,
  Select,
  Checkbox,
  Icon,
  Input,
  message,
  Tooltip,
} from "antd";
import FieldInput from "./FieldInput";

const Option = Select.Option;
import _ from "underscore";
import PropTypes from "prop-types";
import { JSONPATH_JOIN_CHAR } from "../../utils.js";
import LocaleProvider from "../LocalProvider/index.js";
import MockSelect from "../MockSelect/index.js";
import { mapping } from "./SchemaJson";
import DropPlus from "./DropPlus";

class SchemaItem extends PureComponent {
  constructor(props, context) {
    super(props);
    this._tagPaddingLeftStyle = {};
    // this.num = 0
    this.Model = context.Model.schema;
  }

  componentWillMount() {
    const { prefix } = this.props;
    let length = prefix.filter((name) => name != "properties").length;
    this.__tagPaddingLeftStyle = {
      paddingLeft: `${20 * (length + 1)}px`,
    };
  }

  getPrefix() {
    return [].concat(this.props.prefix, this.props.name);
  }

  // 修改节点字段名
  handleChangeName = (e) => {
    const { data, prefix, name } = this.props;
    let value = e.target.value;

    if (data.properties[value] && typeof data.properties[value] === "object") {
      return message.error(`The field "${value}" already exists.`);
    }

    this.Model.changeNameAction({ value, prefix, name });
  };

  // 修改备注信息
  handleChangeDesc = (e) => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, "description");
    let value = e.target.value;
    this.Model.changeValueAction({ key, value });
  };

  // 修改mock 信息
  handleChangeMock = (e) => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, `mock`);
    let value = e ? { mock: e } : "";
    this.Model.changeValueAction({ key, value });
  };

  handleChangeTitle = (e) => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, `title`);
    let value = e.target.value;
    this.Model.changeValueAction({ key, value });
  };

  // 修改数据类型
  handleChangeType = (e) => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, "type");
    this.Model.changeTypeAction({ key, value: e });
  };

  // 删除节点
  handleDeleteItem = () => {
    const { prefix, name } = this.props;
    let nameArray = this.getPrefix();
    this.Model.deleteItemAction({ key: nameArray });
    this.Model.enableRequireAction({ prefix, name, required: false });
  };
  /*
  展示备注编辑弹窗
  editorName: 弹窗名称 ['description', 'mock']
  type: 如果当前字段是object || array showEdit 不可用
  */
  handleShowEdit = (editorName, type) => {
    const { data, name, showEdit } = this.props;

    showEdit(
      this.getPrefix(),
      editorName,
      data.properties[name][editorName],
      type
    );
  };

  // 展示高级设置弹窗
  handleShowAdv = () => {
    const { data, name, showAdv } = this.props;
    showAdv(this.getPrefix(), data.properties[name]);
  };

  //  增加子节点
  handleAddField = () => {
    const { prefix, name } = this.props;
    this.Model.addFieldAction({ prefix, name });
  };

  // 控制三角形按钮
  handleClickIcon = () => {
    let prefix = this.getPrefix();
    // 数据存储在 properties.xxx.properties 下
    let keyArr = [].concat(prefix, "properties");
    this.Model.setOpenValueAction({ key: keyArr });
  };

  // 修改是否必须
  handleEnableRequire = (e) => {
    const { prefix, name } = this.props;
    let required = e.target.checked;
    // this.enableRequire(this.props.prefix, this.props.name, e.target.checked);
    this.Model.enableRequireAction({ prefix, name, required });
  };

  render() {
    let { name, data, prefix, showEdit, showAdv } = this.props;
    let value = data.properties[name];
    let prefixArray = [].concat(prefix, name);

    let prefixStr = prefix.join(JSONPATH_JOIN_CHAR);
    let prefixArrayStr = []
      .concat(prefixArray, "properties")
      .join(JSONPATH_JOIN_CHAR);
    let show = this.context.getOpenValue([prefixStr]);
    let showIcon = this.context.getOpenValue([prefixArrayStr]);
    return show ? (
      <div>
        <Row type="flex" justify="space-around" align="middle">
          <Col
            span={8}
            className="col-item name-item col-item-name"
            style={this.__tagPaddingLeftStyle}
          >
            <Row type="flex" justify="space-around" align="middle">
              <Col span={2} className="down-style-col">
                {value.type === "object" ? (
                  <span className="down-style" onClick={this.handleClickIcon}>
                    {showIcon ? (
                      <Icon className="icon-object" type="caret-down" />
                    ) : (
                      <Icon className="icon-object" type="caret-right" />
                    )}
                  </span>
                ) : null}
              </Col>
              <Col span={22}>
                <FieldInput
                  addonAfter={
                    <Tooltip placement="top" title={LocaleProvider("required")}>
                      <Checkbox
                        onChange={this.handleEnableRequire}
                        checked={
                          _.isUndefined(data.required)
                            ? false
                            : data.required.indexOf(name) != -1
                        }
                      />
                    </Tooltip>
                  }
                  onChange={this.handleChangeName}
                  value={name}
                />
              </Col>
            </Row>
          </Col>

          <Col span={3} className="col-item col-item-type">
            <Select
              className="type-select-style"
              onChange={this.handleChangeType}
              value={value.$ref || value.type}
            >
              {this.context.schemaType.map((item, index) => {
                return (
                  <Option
                    value={typeof item === "object" ? item.value : item}
                    key={index}
                  >
                    {typeof item === "object" ? item.label : item}
                  </Option>
                );
              })}
            </Select>
          </Col>

          {this.context.isMock && (
            <Col span={3} className="col-item col-item-mock">
              <MockSelect
                schema={value}
                showEdit={() => this.handleShowEdit("mock", value.type)}
                onChange={this.handleChangeMock}
              />
            </Col>
          )}

          <Col
            span={this.context.isMock ? 4 : 5}
            className="col-item col-item-mock"
          >
            <Input
              addonAfter={
                <Icon
                  type="edit"
                  onClick={() => this.handleShowEdit("title")}
                />
              }
              placeholder={LocaleProvider("title")}
              value={value.title}
              onChange={this.handleChangeTitle}
            />
          </Col>

          <Col
            span={this.context.isMock ? 4 : 5}
            className="col-item col-item-desc"
          >
            <Input
              addonAfter={
                <Icon
                  type="edit"
                  onClick={() => this.handleShowEdit("description")}
                />
              }
              placeholder={LocaleProvider("description")}
              value={value.description}
              onChange={this.handleChangeDesc}
            />
          </Col>

          <Col
            span={this.context.isMock ? 2 : 3}
            className="col-item col-item-setting"
          >
            {!value.$ref && (
              <span className="adv-set" onClick={this.handleShowAdv}>
                <Tooltip placement="top" title={LocaleProvider("adv_setting")}>
                  <Icon type="setting" />
                </Tooltip>
              </span>
            )}
            <span className="delete-item" onClick={this.handleDeleteItem}>
              <Icon type="close" className="close" />
            </span>
            {value.type === "object" ? (
              <DropPlus prefix={prefix} name={name} />
            ) : (
              <span onClick={this.handleAddField}>
                <Tooltip
                  placement="top"
                  title={LocaleProvider("add_sibling_node")}
                >
                  <Icon type="plus" className="plus" />
                </Tooltip>
              </span>
            )}
          </Col>
        </Row>
        <div className="option-formStyle">
          {mapping(prefixArray, value, showEdit, showAdv)}
        </div>
      </div>
    ) : null;
  }
}

SchemaItem.contextTypes = {
  getOpenValue: PropTypes.func,
  Model: PropTypes.object,
  isMock: PropTypes.bool,
  schemaType: PropTypes.array,
};

export default SchemaItem;
