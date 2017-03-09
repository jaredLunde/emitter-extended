import randStr from 'random-string'
import EventEmitter from 'events'
import ListenersMap from './ListenersMap'
import Listener from './Listener'
import EmitterEvent from './EmitterEvent'



/**
 * Thin wrapper for EventEmitter to enable more predictable event management
 * and a couple of extra features, namely `after` and `afterAny`.
 * @extends {EventEmitter}
 */
class Emitter extends EventEmitter {
  static CHANGE = 'change'
  _listenerIdIncr = 0

  constructor (id) {
    super()
    this._id = id || randStr({length: 6})
    this._listenersMap = new ListenersMap()
    this._delay = {}
    this._registered = new Set([Emitter.CHANGE])
    this.setMaxListeners(0)
  }

  /** Emitter only works with events that are explicitly defined using
    * this method. Event names should be provided in the lower case, though
    * you are not held to that behavior.)
    */
  register () {
    for (let x in arguments)
      this._registered.add(arguments[x])
  }

  _isRegistered (eventName) {
    if (!this._registered.has(eventName)) {
      throw Error(`Event name '${eventName}' is unregistered.` +
                  `You must register your events with the 'register()' ` +
                  `method.`)
    }
  }

  getByKey (key) {
    return this._listenersMap.get(key)
  }

  getByType (type) {
    return this._listenersMap.byType[type]
  }

  nextKey () {
    this._listenerIdIncr += 1
    return this._listenerIdIncr
  }

  on (eventName, listener) {
    this._isRegistered(eventName)
    let l = super.on(eventName, listener)
    const key = this.nextKey()
    this._listenersMap.add(key, eventName, listener)
    return new Listener(key, this, l)
  }

  onEach () {
    let args = Array.prototype.slice.call(arguments)
    let eventNames = args.slice(0, -1)
    let listener = args.slice(-1)[0]
    const keys = []
    for (let type of eventNames) {
      keys.push(this.on(type, listener))
    }
    return keys
  }

  once (eventName, listener) {
    this._isRegistered(eventName)
    const key = this.nextKey()
    const newListener = function () {
      listener(...arguments)
      this.offByKey(key)
    }.bind(this)
    super.on(eventName, newListener)
    this._listenersMap.add(key, eventName, newListener)
    return key
  }

  onAny (doWhat) {
    return this.on(Emitter.CHANGE, doWhat)
  }

  emit () {
    // EmitterEvents may be emitted without supplying the name with the
    // first argument since the event type is supplied in the EmitterEvent
    // class
    let args = Array.prototype.slice.call(arguments).slice(1)
    let eventName = null
    if (arguments[0] instanceof EmitterEvent) {
      eventName = arguments[0].type
    } else {
      eventName = arguments[0]
    }
    
    const event = new EmitterEvent(eventName, this)
    args.push(event)

    this._isRegistered(eventName)
    args.unshift(eventName)

    // Fires actual event
    let result = super.emit(...args)

    // Fires change event
    if (eventName !== Emitter.CHANGE)
      super.emit(...[Emitter.CHANGE, ...args.slice(1)])

    return result
  }

  _delListenerKey (key) {
    this._listenersMap.del(key)
    if (this._delay[key])
      delete this._delay[key]
  }

  removeListener (eventName, listener) {
    for (let key in this._listenersMap.byType[eventName]) {
      let _listener = this._listenersMap.byType[eventName][key]
      if (_listener === listener)
        this._delListenerKey(key)
    }

    return super.removeListener.call(this, eventName, listener)
  }

  /** Removes all listeners, or all listeners with @param eventName */
  removeAllListeners (eventName) {
    if (eventName !== void 0 && eventName !== null) {
      for (let key in this._listenersMap.byType[eventName])
        this._delListenerKey(key)
    } else {
      this._listenersMap = new ListenersMap()
      this._delay = {}
    }

    super.removeAllListeners(...arguments)
  }

  dispose () {
    this.removeAllListeners(...arguments)
  }

  /** Stops listening on the event name and listener provided. If a key is
    * provided, the event name and listener stored with the key will be removed.
    */
  off () {
    if (arguments.length === 1) {
      return this.offByKey(arguments[0].key)
    } else {
      return this.removeListener(...arguments)
    }
  }

  /** Stops listening on the event name and listener stored with the @param
    * key returned by the `on()` method.
    */
  offByKey (key) {
    let e = this._listenersMap.get(key)
    let listener = e.listener
    let eventName = e.type
    this._delListenerKey(key)
    return super.removeListener(eventName, listener)
  }

  /** Removes all listeners (optionally just those with a given name) */
  offAll () {
    return this.removeAllListeners(...arguments)
  }

  /** Fires once after @param n calls emits */
  after (n, eventName, listener) {
    this._isRegistered(eventName)
    const key = this.nextKey()
    this._delay[key] = 1;
    const newListener = function () {
      let cursor = this._delay[key]
      if (cursor === n) {
        listener(...arguments);
        this.offByKey(key);
      }
      this._delay[key] += 1
    }.bind(this)
    this._listenersMap.add(key, eventName, newListener)
    super.on(eventName, newListener)
    return key
  }

  /** Fires once after @param n change calls */
  afterAny (n, listener) {
    return this.after(n, Emitter.CHANGE, listener)
  }
}


export default Emitter
