const test = require('ava')
const sinon = require('sinon')
const bounce = require('bounce')
const Boom = require('boom')
const to = require('./')

test('return a value when resolved', async (t) => {
  const testInput = 41
  const promise = Promise.resolve(testInput)

  const [err, data] = await to(promise)

  t.is(err, null)
  t.is(data, testInput)
})

test('return an error when rejected – matching: isSystem', async (t) => {
  const testError = new SyntaxError('foobar')
  const promise = Promise.reject(testError)

  const [err, data] = await to(promise)

  t.is(err, testError)
  t.is(data, undefined)
})

test('return default when rejected – non-matching: bounce.isSystem', async (t) => {
  const testError = new Error('foobar')
  const promise = Promise.reject(testError)
  const spy = sinon.spy(console, 'error')

  const [err, data] = await to(promise)

  t.is(err, null)
  t.is(data, undefined)
  t.truthy(spy.calledWith(testError))
  spy.restore()
})

test('return custom default when rejected – non-matching: bounce.isSystem', async (t) => {
  const testError = new Error('foobar')
  const promise = Promise.reject(testError)
  const spy = sinon.spy(console, 'error')

  const [err, data] = await to(promise, { defaults: [] })

  t.is(err, null)
  t.deepEqual(data, [])
  t.truthy(spy.calledWith(testError))
  spy.restore()
})

test('return an error when rejected – matching: isBoom', async (t) => {
  const testError = new Boom('foobar')
  const promise = Promise.reject(testError)

  const [err, data] = await to(promise, { is: bounce.isBoom })

  t.is(err, testError)
  t.is(data, undefined)
})

test('return default when rejected – non-matching: bounce.isBoom', async (t) => {
  const testError = new Error('foobar')
  const promise = Promise.reject(testError)
  const spy = sinon.spy(console, 'error')

  const [err, data] = await to(promise, { is: bounce.isBoom })

  t.is(err, null)
  t.is(data, undefined)
  t.truthy(spy.calledWith(testError))
  spy.restore()
})

test('return custom default when rejected – non-matching: bounce.isBoom', async (t) => {
  const testError = new Error('foobar')
  const promise = Promise.reject(testError)
  const spy = sinon.spy(console, 'error')

  const [err, data] = await to(promise, { defaults: [], is: bounce.isBoom })

  t.is(err, null)
  t.deepEqual(data, [])
  t.truthy(spy.calledWith(testError))
  spy.restore()
})

test('return default with custom log when rejected – non-matching: bounce.isSystem', async (t) => {
  const testObject = { error () {} }
  const testError = new Error('foobar')
  const promise = Promise.reject(testError)
  const spy = sinon.spy(testObject, 'error')

  const [err, data] = await to(promise, { log: testObject.error })

  t.is(err, null)
  t.is(data, undefined)
  t.truthy(spy.calledWith(testError))
  spy.restore()
})

test('do not log if disabled', async (t) => {
  const testError = new Error('foobar')
  const promise = Promise.reject(testError)
  const spy = sinon.spy(console, 'error')

  const [err, data] = await to(promise, { log: null })

  t.is(err, null)
  t.is(data, undefined)
  t.falsy(spy.calledOnce)
  spy.restore()
})
