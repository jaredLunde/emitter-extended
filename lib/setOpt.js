import assign from 'object-assign'
import setDefinedOpt from './setDefinedOpt'


export default (obj, opt, optNames, throws) => {
  throws = throws !== void 0 ? throws : true
  if (optNames !== void 0 && optNames !== null) {
    const newObj = {}
    for (let name of optNames) {
      newObj[name] = undefined
    }
    setDefinedOpt(newObj, opt, throws)
    assign(obj, newObj)
  } else {
    assign(obj, opt)
  }
}
