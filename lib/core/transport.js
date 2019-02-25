"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom.iterable");

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

class Transport {
  constructor(_ref) {
    let from = _ref.from,
        to = _ref.to,
        _ref$args = _ref.args,
        args = _ref$args === void 0 ? [] : _ref$args,
        options = _objectWithoutProperties(_ref, ["from", "to", "args"]);

    this.from = from;
    this.to = to;
    this.args = args;
    this.options = options;
  }

  transformArgsToPromptQuestion() {
    return this.args.map(arg => ({
      type: 'text',
      name: arg,
      message: arg
    }));
  }

}

var _default = Transport;
exports.default = _default;