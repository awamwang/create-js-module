const fs = require('fs').promises

const settings = require('../src/settings')

/**
 * Install function for the package, it set up all the settings details
 */
;(async () => {
  try {
    await settings.load(null, true)
  } catch (e) {
    settings.update()
  }
})()
