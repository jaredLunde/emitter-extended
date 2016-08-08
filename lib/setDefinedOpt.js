export default (obj, opt, throws) => {
  throws = throws !== void 0 ? throws : true
  for (let key in opt) {
    if (key.charAt(0) === '_' && throws) {
      throw new Error('Option `' + key + '` is private and cannot be changed')
    } else if (obj.hasOwnProperty(key)) {
      obj[key] = opt[key]
    } else if (throws) {
      throw new Error('Option `' + key + '` does not exist in `' + obj + '`')
    }
  }
}
