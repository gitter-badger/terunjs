import { flatArray, getMissingProperties, logError} from '../utils/util'
import Transport from './transport'

class TransportManager{
  constructor(){
    this.transportFiles = []
    this.transportFragmentsFiles = [];
  }

  setFiles(transportFiles){
    this.transportFiles = transportFiles;
  }

  setFragmentsFiles(transportFragmentsFiles){
    this.transportFragmentsFiles = transportFragmentsFiles;
    this.transportFiles = this.resolveTransports();
  }

  resolveTransports(){
		let resolvedTransportFiles = this.transportFiles.map(this.resolveTransportByType.bind(this))
    let transportArray = flatArray(resolvedTransportFiles);

    return transportArray.map(this.toTranportInstance.bind(this))
	}

  toTranportInstance(transport){
    return new Transport(transport)
  }

  resolveTransportByType(transport){
    switch (typeof transport) {
      case 'string':
          return this.resolveFragments(transport);
        break;
      case 'object':
        return transport;
    }
  }

  resolveFragments(fragmentName){
    let transportFragmentFile = this.transportFragmentsFiles[fragmentName];

    if(!transportFragmentFile) throw new Error(`Not found fragment: ${fragmentName}`)

    return transportFragmentFile;
  }

  validateTransportFiles() {
		return this.transportFiles.map(this.validateTransport.bind(this)).every(a => a == true)
	}

  validateTransport(transport){
    let errorParametersTransport = getMissingProperties(transport, ['from', 'to']);
    let hasError = errorParametersTransport && errorParametersTransport.length > 0;
		if (hasError) return errorParametersTransport.forEach(error => logError(`Not found parameter ${error}`));
		return hasError ? false : true;
  }
}

export default TransportManager;
