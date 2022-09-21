#!/usr/bin/env node

const runCommand = command => {
  try {
    execSync(`${command}`, { stdio: 'inherit' })
  } catch (e) {
    console.log(`Failed to execute ${command}`)
    return false
  }
  return true
}
const repoName = process.argv[2]
const gitCheckoutCommand = `git clone --depth 1 https://github.com/xxx/react-ant-design-admin-auth-template ${repoName}`
const installDepsCommand = `cd ${repoName} && npm install`

console.log(`Cloning the repository with name ${repoName}`)
const checkedOut = runCommand(gitCheckoutCommand)
if (!checkedOut) process.exit(-1)

console.log('Congratulations! You are ready. Follow the follwing commands to start')
console.log(installDepsCommand)
