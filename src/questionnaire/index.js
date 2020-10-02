const questions = require('./questions')

/**
 * Runs the full questionnaire for the configuration of the project
 * @method run
 * @param  {Defaults} defaults The defaults object
 * @param  {Settings} settings The settings object
 * @return {Object}            An object with all the answers
 */
async function run(defaults, settings) {
  let remoteAnswers
  let authFileAnswers
  let userAnswers
  let tokenAnswers
  let updateAnswers = {
    updateToken: false
  }

  const github = {}
  let currentAuthUser
  let currentToken

  const answers = await questions.promptProjectDetails(
    { ...defaults, ...settings },
    settings.licenses,
    settings.testingPkgs,
    settings.templates
  )

  if (!answers.useGithub) {
    remoteAnswers = await questions.promptGitRemoteDetails()
    answers.hasRemote = !!remoteAnswers.git.url
  } else {
    authFileAnswers = await questions.promptSettingsFile(settings.settingsPath)
    const { settingsPath } = authFileAnswers

    currentAuthUser = await settings.firstUser()

    userAnswers = await questions.promptGithubUser(currentAuthUser.user)

    currentToken = await settings.getToken(userAnswers.github.user)

    tokenAnswers = await questions.promptAuthToken(
      userAnswers.github.user,
      currentToken
    )

    github.user = userAnswers.github.user
    github.token = tokenAnswers.github.token

    if (github.user !== currentAuthUser.user || github.token !== currentToken) {
      updateAnswers = await questions.promptUpdateToken()
    }

    if (updateAnswers.updateToken) {
      settings.updateToken(github.user, github.token, settings.settingsPath)
    }

    if (!currentToken) {
      answers.useGithub = false
    }
  }

  Object.assign(answers, remoteAnswers, authFileAnswers, { github })

  settings.setAll({
    ...answers,
    website: answers.author.url
  })
  settings.update()

  return answers
}

/**
 * The questionnaire for the project
 * @module questionnaire
 */
module.exports = {
  run
}
