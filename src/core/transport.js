class Transport{
  constructor({from, to, args = []}){
    this.from = from;
    this.to = to;
    this.args = args;
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