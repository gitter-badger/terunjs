"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class Transport {
  constructor({
    from,
    to,
    args = []
  }) {
    this.from = from;
    this.to = to;
    this.args = args;
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