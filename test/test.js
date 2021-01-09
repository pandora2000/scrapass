const { strict: assert } = require('assert')
const scrapass = require('../scrapass')
function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
function scrape1({ timeout, driver }) {
  // return new Promise(async r => {
  //   await sleep(100000000)
  //   r('scrape1')
  // })
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
async function scrape7({ timeout, driver, argument }) {
  return argument
}
async function scrape8({ timeout, driver, argument }) {
  timeout(100)
  await sleep(100 * 1000)
  return 'scrape8'
}
async function scrape9({ timeout, driver }) {
  timeout(100, (resolve, reject) => {
    reject(new Error('scrape9'))
  })
  await sleep(100 * 1000)
  return 'scrape9n'
}
async function scrape10({ timeout, driver }) {
  throw new Error('scrape10')
}
async function main() {
  console.log('scrape1')
  const r1 = await scrapass({ modulePath: __filename, exportedName: 'scrape1', headless: false })
  assert.equal(r1, 'scrape1')
  console.log('scrape2')
  const r2 = await scrapass({ modulePath: __filename, exportedName: 'scrape2', headless: true })
  assert.equal(r2, 'scrape2')
  console.log('scrape3')
  let p3 = true
  try {
    await scrapass({ modulePath: __filename, exportedName: 'scrape3', headless: false })
    p3 = false
  } catch (e) {
    assert.equal(e, 'timeout')
  }
  assert(p3)
  console.log('scrape4')
  const r4 = await scrapass({ modulePath: `${__dirname}/scrape4`, headless: false })
  assert.equal(r4, 'scrape4')
  console.log('scrape5')
  const r5 = await scrapass({ modulePath: __filename, exportedName: 'scrape5', headless: false })
  assert.equal(r5, 'scrape5')
  console.log('scrape6')
  const r6 = await scrapass({ modulePath: __filename, exportedName: 'scrape6', headless: false })
  assert.equal(r6, 'scrape6')
  console.log('scrape7')
  const r7 = await scrapass({ modulePath: __filename, exportedName: 'scrape7', headless: false, argument: 'scrape7' })
  assert.equal(r7, 'scrape7')
  console.log('scrape8')
  let p8 = true
  try {
    await scrapass({ modulePath: __filename, exportedName: 'scrape8', headless: false })
    p8 = false
  } catch (e) {
    assert.equal(e, 'timeout')
  }
  assert(p8)
  console.log('scrape9')
  let p9 = true
  try {
    await scrapass({ modulePath: __filename, exportedName: 'scrape9', headless: false })
    p9 = false
  } catch (e) {
    assert.equal(e, 'scrape9')
  }
  assert(p9)
  console.log('scrape10')
  let p10 = true
  try {
    await scrapass({ modulePath: __filename, exportedName: 'scrape10', headless: false })
    p10 = false
  } catch (e) {
    assert.equal(e, 'scrape10')
  }
  assert(p10)
}
module.exports = { scrape1, scrape2, scrape3, scrape5, scrape6, scrape7, scrape8, scrape9, scrape10 }
if (require.main === module) {
  main()
}
