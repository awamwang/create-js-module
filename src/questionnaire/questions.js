const inquirer = require('inquirer')
const fs = require('fs')

const i = require('../i18n/index')
const utils = require('../utils')

/**
 * Run the prompts to get the details for the project
 * @method promptProjectDetails
 * @param  {Object} defaults
 * @param  {String} defaults.projectName    The default name for the project
 * @param  {String} defaults.version        The default version for the project
 * @param  {String} defaults.license        The default license for the project
 * @param  {String} defaults.gitUserName    The git username setup for the project
 * @param  {String} defaults.gitUserEmail   The git username setup for the project
 * @param  {String} defaults.template       The name for the default template
 * @param  {Array} licenses                 The list of options for licenses
 * @param  {Array} testingPkgs              The list of options for testingPkgs
 * @param  {Array} templates                The list of options for templates
 * @return {Promise}
 */
async function promptProjectDetails(
  defaults,
  licenses,
  testingPkgs,
  templates
) {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: i.__('qs.projectName'),
      default: defaults.projectName
    },

    {
      type: 'list',
      name: 'template',
      message: i.__('qs.templateType'),
      choices: templates,
      default: defaults.template
    },

    {
      type: 'input',
      name: 'description',
      message: i.__('qs.decription'),
      default: defaults.description
    },

    {
      type: 'input',
      name: 'version',
      message: i.__('qs.version'),
      default: defaults.version
    },

    {
      type: 'input',
      name: 'keywords',
      message: i.__('qs.keywords'),
      filter: (ans) => JSON.stringify(ans.split(',')),
      default: defaults.keywords
    },

    {
      type: 'list',
      name: 'license',
      message: i.__('qs.licenses'),
      choices: licenses,
      default: defaults.license
    },

    {
      type: 'input',
      name: 'author.name',
      message: i.__('qs.authorName'),
      default: defaults.gitUserName
    },

    {
      type: 'input',
      name: 'author.email',
      message: i.__('qs.authorEmail'),
      default: defaults.gitUserEmail
    },

    {
      type: 'input',
      name: 'author.url',
      message: i.__('qs.website'),
      default: defaults.website
    },

    {
      type: 'confirm',
      name: 'isPrivate',
      message: i.__('qs.private'),
      default: false
    },

    {
      type: 'input',
      name: 'projectURL',
      message: i.__('qs.projectURL')
    },

    {
      type: 'checkbox',
      name: 'testPackages',
      message: i.__('qs.testPackages'),
      choices: testingPkgs
    },

    {
      type: 'confirm',
      name: 'useGithub',
      message: i.__('qs.creatRepo')
    },

    {
      type: 'confirm',
      name: 'useYarn',
      message: i.__('qs.useYarn')
    }
  ])
}

/**
 * Run the prompts to get the details for the remote git
 * @method promptGitRemoteDetails
 * @return {Promise}
 */
async function promptGitRemoteDetails() {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'git.sshUrl',
      message: i.__('qs.repo.url')
    },

    {
      type: 'input',
      name: 'issueTracker',
      message: i.__('qs.repo.issue')
    }
  ])
}

/**
 * Run the prompts to geth the path for the auth file
 * @method promptSettingsFile
 * @param  {String} settingsPath  The default path for the settings file
 * @return {Promise}
 */
async function promptSettingsFile(settingsPath) {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'settingsPath',
      message: i.__('qs.settingFile'),
      default: settingsPath,
      validate: (ans) => {
        const path = utils.files.resolvePath(ans)
        if (path && fs.existsSync(path)) {
          return true
        }
        return 'You should introduce a real path for the create-nodejs-settings.json'
      }
    }
  ])
}

/**
 * Run the prompts to get the github user
 * @method promptGithubUser
 * @param  {String} user The current user on the auth file
 * @return {Promise}
 */
async function promptGithubUser(user) {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'github.user',
      message: i.__('qs.github.user'),
      default: user
    }
  ])
}

/**
 * Run the prompts to get the github token
 * @method promptAuthToken
 * @param  {String} user  The current github user on the auth file
 * @param  {String} token The current github user on the auth file
 * @return {Promise}
 */
async function promptAuthToken(user, token) {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'github.token',
      message: i.__('qs.github.token', user),
      default: token
    }
  ])
}

/**
 * Run the prompt to confirm if the user wants to update the token
 * @method promptUpdateToken
 * @return {Promise}
 */
async function promptUpdateToken() {
  return inquirer.prompt([
    {
      type: 'confirm',
      name: 'updateToken',
      message: i.__('qs.github.updateToken')
    }
  ])
}

/**
 * The questions for the questionnaire
 * @module questions
 */
module.exports = {
  promptProjectDetails,
  promptGitRemoteDetails,
  promptSettingsFile,
  promptAuthToken,
  promptUpdateToken,
  promptGithubUser
}
