const { fork } = require('child_process')
const killTree = require('tree-kill')
const { promisify } = require('util')
function main({ modulePath, exportedName, headless, argument }) {
  return new Promise((resolve, reject) => {
    const worker = fork(
      `${__dirname}/worker.js`,
      [JSON.stringify({ modulePath, exportedName, headless, argument })]
    )
    worker.on('message', async message => {
      await promisify(killTree)(worker.pid, 'SIGTERM')
      if ('error' in message) {
        reject(message.error)
      } else {
        resolve(message.result)
      }
    })
  })
}
module.exports = main
