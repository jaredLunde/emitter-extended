import {setOpt} from 'opt-setter'


class EmitterEvent {
  constructor (eventName, optTarget, optData) {
    this.type = eventName
    this.target = optTarget
    setOpt(this, optData)
  }
}


export default EmitterEvent
