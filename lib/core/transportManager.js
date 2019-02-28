"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom.iterable");

var _util = require("../utils/util");

var _transport = _interopRequireDefault(require("./transport"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TransportManager {
  constructor() {
    this.transportFiles = [];
    this.transportFragmentsFiles = [];
  }

  setFiles(transportFiles) {
    this.transportFiles = transportFiles;
  }

  setFragmentsFiles(transportFragmentsFiles) {
    this.transportFragmentsFiles = transportFragmentsFiles;
    this.transportFiles = this.resolveTransports();
  }

  resolveTransports() {
    let resolvedTransportFiles = this.transportFiles.map(this.resolveTransportByType.bind(this));
    let transportArray = (0, _util.flatArray)(resolvedTransportFiles);
    return transportArray.map(this.toTranportInstance.bind(this));
  }

  toTranportInstance(transport) {
    return new _transport.default(transport);
  }

  resolveTransportByType(transport) {
    switch (typeof transport) {
      case 'string':
        return this.resolveFragments(transport);
        break;

      case 'object':
        return transport;
    }
  }

  resolveFragments(fragmentName) {
    let transportFragmentFile = this.transportFragmentsFiles[fragmentName];
    if (!transportFragmentFile) throw new Error(`Not found fragment: ${fragmentName}`);
    return transportFragmentFile;
  }

  validateTransportFiles() {
    return this.transportFiles.map(this.validateTransport.bind(this)).every(a => a == true);
  }

  validateTransport(transport) {
    let errorParametersTransport = (0, _util.getMissingProperties)(transport, ['from', 'to']);
    let hasError = errorParametersTransport && errorParametersTransport.length > 0;
    if (hasError) return errorParametersTransport.forEach(error => (0, _util.logError)(`Not found parameter ${error}`));
    return hasError ? false : true;
  }

}

var _default = TransportManager;
exports.default = _default;