import setOpt from './setOpt'


class EmitterEvent {
  constructor (eventName, optTarget, optData) {
    this.type = eventName
    this.target = optTarget
    setOpt(this, optData)
  }
}


export default EmitterEvent
