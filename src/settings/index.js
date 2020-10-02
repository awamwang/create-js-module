const path = require('path')
const fs = require('fs').promises

const Settingable = require('./settingable.js')
const i18n = require('../i18n/index')
const utils = require('../utils')
const lintOptions = require('./modules/lint')
const testOptions = require('./modules/test')
const licenseOptions = require('./modules/license')
const templateOptions = require('./modules/template')
const DEFAULTS = require('./default')

const LOCAL_SETTINGS_PATH = path.resolve(
  path.join('.', 'create-nodejs-settings.json')
)
const SETTINGS_PATH = path.resolve(
  path.join(__dirname, '..', '..', 'create-nodejs-settings.json')
)

/**
 * A settings class
 * @class Settings
 */
class Settings extends Settingable {
  lintPkgs = lintOptions['normal'].pkgs
  testingPkgs = Object.keys(testOptions)
  licenses = Object.keys(licenseOptions)
  templates = Object.keys(templateOptions)
  settingsPath = null
  templatesPath = path.resolve(path.join(__dirname, '..', '..', 'templates'))
  licensesPath = path.resolve(
    path.join(__dirname, '..', '..', 'templates', 'licenses')
  )
  defaults = DEFAULTS
  githubAuth = {
    user: 'YOUR_USER',
    token: 'YOUR_TOKEN'
  }
  useYarn = false
  website = ''

  template = DEFAULTS.template
  description = DEFAULTS.description
  version = DEFAULTS.version
  license = DEFAULTS.license
  commitMessage = DEFAULTS.commitMessage

  i18n = i18n
  locale = 'en'

  constructor(settings = {}) {
    super()
    this.setAll(settings)
  }

  async getSettingsPath() {
    if (!this.settingsPath) {
      this.settingsPath = await fs
        .access(LOCAL_SETTINGS_PATH)
        .then(() => {
          console.log(i18n.__('msg.hasLocalSetting'), LOCAL_SETTINGS_PATH)
          return LOCAL_SETTINGS_PATH
        })
        .catch((e) => {
          console.log(i18n.__('msg.noLocalSetting'), SETTINGS_PATH)
          return SETTINGS_PATH
        })
    }
  }

  /**
   * Write the auth data json in the file
   * @method update
   * @param  {String} [property='all']        The property to be updated
   * @param  {String|Array|Object} [data='']  The value to be updated
   * @param  {String} filePath                The path of the file
   * @return {Promise}
   */
  update(property = 'all', value = '', filePath = this.settingsPath) {
    if (property !== 'all') {
      this[property] = value
    }
    // console.info('Update settings...', this)
    const json = JSON.stringify(this, null, 2)
    return fs.writeFile(filePath, json)
  }

  /**
   * Load the settings values from the settings file
   * @method load
   * @param {String}  [filePath=this.settingsPath] The path for the settings file
   * @param {Boolean} useDefault whether to use default settings
   */
  async load(filePath, useDefault) {
    if (!filePath) {
      await this.getSettingsPath()
      filePath = this.settingsPath
    }

    await fs.access(filePath)
    const json = await utils.files.readJsonFile(filePath)
    this.setAll({ ...json, ...(useDefault ? this.defaults : {}) }, { i18n })
    this.i18n.setLocale(this.locale)
    // console.log('load', this.settingsPath, json)
  }

  /**
   * Return the first user on the auth settings
   * @method firstUser
   * @return {Object|undefined}
   * TODO implement logic to allow multiple auth values
   */
  firstUser() {
    return this.githubAuth
  }

  /**
   * Find a user on the auth settings
   * @method findUser
   * @param  {String} user       The user to find
   * @return {Object|undefined}
   * TODO implement logic to allow multiple auth values
   */
  findUser(user) {
    return this.githubAuth.user === user ? this.githubAuth : undefined
  }

  /**
   * Get the Github token from the auth settings
   * @method getToken
   * @param  {String} user      The user owner of the token
   * @return {String|undefined} The github token or undefined if there is no token.
   * TODO implement logic to allow multiple auth values
   */
  getToken(user) {
    return this.githubAuth.user === user ? this.githubAuth.token : undefined
  }

  /**
   * Update the auth settings
   * @method updateToken
   * @param  {String} user    The user owner of the token
   * @param  {String} token   The token
   * @return {Promise}        Resolve with true in case the file gets updated
   * TODO implement logic to allow multiple auth values
   */
  async updateToken(user, token) {
    let currentToken = ''
    let userIndex

    currentToken = this.firstUser().token

    if (user) {
      // TODO consider the case for a new user data
      userIndex = this.githubAuth.findIndex((elem) => elem.user === user)
      currentToken = this.githubAuth[userIndex].token
    }

    if (currentToken === token) {
      return false
    }

    this.githubAuth[userIndex].token = token
    await this.update()

    return true
  }
}

/**
 * @module settings
 */
module.exports = new Settings()
