const path = require('path')

const { I18n } = require('i18n')

/**
 * create a new instance with it's configuration
 */
const i18n = new I18n({
  defaultLocale: 'en',
  autoReload: true,
  directory: path.join(__dirname, 'locales'),
  objectNotation: true,
  api: {
    __: 't',
    __n: 'tn'
  }

  // setting of log level DEBUG - default to require('debug')('i18n:debug')
  // logDebugFn: function (msg) {
  //   console.log('debug', msg)
  // }
})

module.exports = i18n
