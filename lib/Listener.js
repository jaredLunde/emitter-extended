class Listener {
  constructor (key, target) {
    this.key = key
    this.target = target
  }

  get () {
    return this.target.getByKey(this.key)
  }

  off () {
    return this.target.offByKey(this.key)
  }
}


export default Listener
