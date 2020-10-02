const utils = require('../utils')

/**
 * Create a github repository
 * @method create
 * @param  {String}  name               The name for the github project
 * @param  {Boolean} [isPrivate=false]  Defines is the project will be created
 * as private or public on github
 * @param  {String} [description='']    The description for the github project
 * @param  {String} [url='']            The url for the github project
 * @param  {Object} [github]
 * @param  {String} [github.user='']    The github user
 * @param  {String} [github.token='']   The github token
 * @return {String} data                The response from github or undefined in
 * case of error
 * @throws If the token is not present
 */
async function create({
  name,
  isPrivate = false,
  description = '',
  url = '',
  github = {
    user: '',
    token: ''
  }
}) {
  let data

  if (!github.token) {
    throw new Error('Token missing')
  }

  const project = {
    name,
    private: isPrivate,
    description,
    homepage: url
  }

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/vnd.github.v3+json',
    Authorization: `token ${github.token}`,
    'User-Agent': github.user
  }
  console.info(`Creating github repository ${name} ...`, project, headers)

  try {
    data = await utils.requests.postReq(
      project,
      'https://api.github.com/user/repos',
      headers
    )
    console.log(`Repository ${data.name} created`)
  } catch (e) {
    console.error('Repository not created: ', e.statusCode, e.data)
    throw e
  }

  return data
}

/**
 * Delete a github repository
 * @method deleteRepo
 * @param  {String} name    The name of the repository
 * @param  {String} user    The owner of the repository
 * @param  {String} token   The github token for the user
 * @return {json|undefined} In case of success will return the response from
 * github, in case of error will return undefined.
 * @throws If the token is not present
 */
async function deleteRepo(name, user, token) {
  let data

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/vnd.github.v3+json',
    Authorization: `token ${token}`,
    'User-Agent': user
  }

  if (!token) {
    throw new Error('Token missing')
  }

  console.info(`Deleting github repository ${name} ...`, headers)
  try {
    data = await utils.requests.deleteReq(
      null,
      `https://api.github.com/repos/${user}/${name}`,
      headers
    )
    console.log(`Repository ${name} deleted`)
  } catch (e) {
    console.error('Repository not deleted: ', e.statusCode, e.data, e.response)
    throw e
  }

  return data
}

// TODO include a method to handle the topics (will require to get the github user)

/**
 * A github api handler
 * @module githubHandler
 */
module.exports = {
  create,
  deleteRepo
}
