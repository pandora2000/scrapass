// メリット: driverのquit、xvfbの前後処理を自動でやってくれる。timeout処理を行え、timeoutによって残るゾンビプロミスが、適切に削除される（別プロセスで実行しプロセスごと終わるため）
const { strict: assert } = require('assert')
const scrapass = require('../scrapass')
function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
function scrape1({ timeout, driver }) {
  return 'scrape1'
}
function scrape2({ timeout, driver }) {
  return 'scrape2'
}
async function scrape3({ timeout, driver }) {
  timeout(100, () => {})
  await sleep(100 * 1000)
  return 'scrape3'
}
async function scrape5({ timeout, driver }) {
  const notifyInTime = timeout(100, () => {})
  notifyInTime()
  await sleep(1000)
  return 'scrape5'
}
async function scrape6({ timeout, driver }) {
  timeout(100, resolve => {
    resolve('scrape6')
  })
  await sleep(100 * 1000)
  return 'scrape6n'
}
async function main() {
  console.log('scrape1')
  const r1 = await scrapass({ modulePath: __filename, exportedName: 'scrape1', headless: true })
  assert.equal(r1, 'scrape1')
  console.log('scrape2')
  const r2 = await scrapass({ modulePath: __filename, exportedName: 'scrape2', headless: false })
  assert.equal(r2, 'scrape2')
  console.log('scrape3')
  let p = true
  try {
    await scrapass({ modulePath: __filename, exportedName: 'scrape3', headless: false })
    p = false
  } catch (e) {
    assert.equal(e, 'timeout')
  }
  assert(p)
  console.log('scrape4')
  const r4 = await scrapass({ modulePath: `${__dirname}/scrape4`, headless: false })
  assert.equal(r4, 'scrape4')
  console.log('scrape5')
  const r5 = await scrapass({ modulePath: __filename, exportedName: 'scrape5', headless: false })
  assert.equal(r5, 'scrape5')
  console.log('scrape6')
  const r6 = await scrapass({ modulePath: __filename, exportedName: 'scrape6', headless: false })
  assert.equal(r6, 'scrape6')
}
module.exports = { scrape1, scrape2, scrape3, scrape5, scrape6 }
if (require.main === module) {
  main()
}
