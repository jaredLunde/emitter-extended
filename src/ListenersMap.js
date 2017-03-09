class ListenersMap {
  byKey = {}
  byType = {}

  add (key, eventName, listener) {
    this.byKey[key] = {type: eventName, listener: listener}
    if (this.byType[eventName] !== void 0) {
      this.byType[eventName][key] = listener
    } else {
      this.byType[eventName] = {}
      this.byType[eventName][key] = listener
    }
  }

  get (key) {
    return this.byKey[key]
  }

  del (key) {
    let type = this.get(key).type
    delete this.byKey[key]
    delete this.byType[type][key]
  }
}


export default ListenersMap
