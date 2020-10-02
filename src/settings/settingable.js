const utils = require('../utils')

class Settingable {
  constructor() {}

  /**
   * set setting based on giving settings obj
   *
   * @param {Settings} settings
   * @param {Object} extend
   */
  setAll(settings, extend = {}) {
    Object.keys(this).forEach((k) => {
      if (extend[k] !== void 0) {
        return (this[k] = extend[k])
      }
      if (settings[k] !== void 0) {
        return (this[k] = utils.lang.cloneDeep(settings[k]))
      }
    })
  }
}

module.exports = Settingable
