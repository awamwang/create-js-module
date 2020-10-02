const fs = require('fs').promises
const path = require('path')
const os = require('os')

/**
 * Resolve a path even if is using shell specific for home
 * @method resolvePath
 * @param  {String} originalPath The path to resolve
 * @return {String}              The resolved path
 */
function resolvePath(originalPath) {
  let finalPath = ''

  if (os.platform() !== 'win32') {
    finalPath = originalPath.replace('~', os.homedir())
  }

  finalPath = path.resolve(finalPath)

  return finalPath
}

/**
 * Read a file and translate to json
 * @method readJsonFile
 * @param  {String} file The path to the file
 * @return {Promise}     The json object from the file
 * @throws if the file can not be processed as json
 */
async function readJsonFile(file) {
  let json

  const fileContent = await fs.readFile(resolvePath(file), 'utf8')
  try {
    json = JSON.parse(fileContent)
  } catch (e) {
    throw e
  }

  return json
}

/**
 * Copy a folder recursively
 * @method copyDirRecursive
 * @param  {String} [currentPath='./']   The folder path to copy
 * @param  {String} [destPath='../new']  The destination path
 * @return {Promise}
 */
async function copyDirRecursive(currentPath = './', destPath = '../new') {
  let dest = resolvePath(destPath)
  const current = resolvePath(currentPath)

  // Create the dest folder
  try {
    await fs.access(dest)
  } catch (e) {
    await fs.mkdir(dest, { recursive: true })
    // console.log(`Folder ${dest} created`, current)
  }

  // Read files in folder
  const files = await fs.readdir(current)

  for (const file of files) {
    const src = resolvePath(path.join(current, file))
    dest = resolvePath(path.join(destPath, file))

    const srcObj = await fs.lstat(src)
    if (srcObj.isDirectory()) {
      // Recursive copy for folders
      await copyDirRecursive(src, dest)
    } else {
      // Copy file
      await fs.copyFile(src, dest)
      // console.log(`File ${file} copied`);
    }
  }

  console.info(`Folder ${dest} copied`)
}

/**
 * Delete a directory recursively
 * @method deleteDirRecursive
 * @param  {String} folderPath The path of the folder to be deleted
 * @return {Promise}
 */
async function deleteDirRecursive(folderPath) {
  const dirPath = resolvePath(folderPath)

  try {
    await fs.access(dirPath)
  } catch (e) {
    console.error(`Folder ${dirPath} not deleted: Not found`)
    return
  }

  const files = await fs.readdir(dirPath)

  for (const file of files) {
    const curPath = resolvePath(path.join(dirPath, file))

    const srcObj = await fs.lstat(curPath)
    if (srcObj.isDirectory()) {
      await deleteDirRecursive(curPath)
    } else {
      // delete file
      await fs.unlink(curPath)
    }
  }

  await fs.rmdir(dirPath)
  // console.info(`Folder ${dirPath} deleted`)
}

/**
 * Utilities for file system
 * @module utils.files
 */
module.exports = {
  copyDirRecursive,
  deleteDirRecursive,
  resolvePath,
  readJsonFile
}
