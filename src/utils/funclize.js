export default (prototype) => {
  return (value, ...args) => prototype.apply(value, args)
}
