require('geckodriver')
const { Builder } = require('selenium-webdriver')
const Xvfb = require('xvfb')
const xvfb = new Xvfb()
function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
async function quit ({ driver, headless }) {
  if (driver) {
    await driver.quit()
  }
  if (headless) {
    xvfb.stopSync()
  }
}
function timeout (ms, funcOnTimeout, { driver, headless, resolve, reject }) {
  let inTime = false
  const retFunc = () => {
    inTime = true
  }
  sleep(ms).then(async () => {
    if (!inTime) {
      if (funcOnTimeout) {
        try {
          await funcOnTimeout(resolve, reject)
        } catch (e) {
          reject(e)
        }
      }
      reject(new Error('timeout'))
    }
  })
  return retFunc
}
function main () {
  const { modulePath, exportedName, headless, argument } = JSON.parse(process.argv[2])
  const mod = require(modulePath)
  let func
  if (exportedName) {
    func = mod[exportedName]
  } else {
    func = mod
  }
  let driver
  return new Promise(async (resolve, reject) => {
    if (headless) {
      xvfb.startSync()
    }
    driver = await new Builder().forBrowser('firefox').build()
    const to = (ms, funcOnTimeout) => {
      return timeout(ms, funcOnTimeout, { driver, headless, resolve, reject })
    }
    try {
      const res = await func({ driver, timeout: to, argument })
      resolve(res)
    } catch (e) {
      reject(e)
    }
  }).then(r => {
    return { result: r }
  }, e => {
    return { error: e.message }
  }).then(async r => {
    await quit({ driver, headless })
    process.send(r)
    while (true) {
      await sleep(10000 * 1000)
    }
  })
}
main()
