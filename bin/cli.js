#! /usr/bin/env node
const childProcess = require('child_process')

const runCommand = command => {
  try {
    childProcess.exec(`${command}`, { stdio: [0, 1, 2], })
  } catch (e) {
    console.log(`Failed to execute ${command}`)
    return false
  }
  return true
}
const repoName = process.argv[2]
const gitCheckoutCommand = `git clone --depth 1 https://github.com/intheblackworld/admin-frontend-starter-kit.git test-project`
const installDepsCommand = `cd ${repoName} && npm install && npm run serve`

console.log(`Cloning the repository with name ${repoName}`)
const checkedOut = runCommand(gitCheckoutCommand)
if (!checkedOut) process.exit(-1)

console.log('Congratulations! You are ready. Follow the follwing commands to start')
console.log(installDepsCommand)
