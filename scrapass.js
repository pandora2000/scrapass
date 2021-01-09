// 使い方: test/test.jsを見てね
const { fork } = require('child_process')
function main({ modulePath, exportedName, headless }) {
  return new Promise((resolve, reject) => {
    const worker = fork(
      `${__dirname}/worker.js`,
      [JSON.stringify({ modulePath, exportedName, headless })]
    )
    let message
    worker.on('message', mes => {
      message = mes
    })
    worker.on('exit', () => {
      if ('error' in message) {
        reject(message.error)
      } else {
        resolve(message.result)
      }
    })
  })
}
module.exports = main
