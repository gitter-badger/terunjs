class Transport{
  constructor({from, to, args = [], ...options}){
    this.from = from;
    this.to = to;
    this.args = args;
    this.options = options
  }

  transformArgsToPromptQuestion(){
    return this.args.map(arg => ({
      type: 'text',
      name: arg,
      message: arg
    }))
  }
}

export default Transport;