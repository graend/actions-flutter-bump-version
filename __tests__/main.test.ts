import {promises as fs} from 'fs'
import {
  incrementVersion,
  loadYaml,
  replaceVersionInfoAndSave,
  testBumpArgument
} from '../src/main'

import {afterAll, expect, test} from '@jest/globals'

const TEST_SOURCE_YAML = './__tests__/pubspec.yaml'
const TEST_NEW_YAML = './__tests__/pubspec_next.yaml'

test('load yaml', async () => {
  const data = await loadYaml(TEST_SOURCE_YAML)
  expect(data).toBeTruthy()
  expect(data.get('version') as string).toEqual('1.0.0+1')
})

test('increment yaml version', async () => {
  const yaml = await loadYaml(TEST_SOURCE_YAML)
  const data = await incrementVersion(yaml, 'patch')
  expect(data.major).toEqual(1)
  expect(data.minor).toEqual(0)
  expect(data.patch).toEqual(1)
  expect(data.build).toEqual(2)
})

test('save yaml file', async () => {
  const yaml = await loadYaml(TEST_SOURCE_YAML)
  const data = await incrementVersion(yaml, 'patch')
  await replaceVersionInfoAndSave(TEST_SOURCE_YAML, data, TEST_NEW_YAML)
  const next = await loadYaml(TEST_NEW_YAML)
  expect(next.get('version') as string).toEqual('1.0.1+2')
})

test('ensure bump argument', async () => {
  expect(testBumpArgument('major')).toBeTruthy
  expect(testBumpArgument('minor')).toBeTruthy
  expect(testBumpArgument('patch')).toBeTruthy
  expect(testBumpArgument('as')).toBeFalsy
})

afterAll(() => {
  fs.rm(TEST_NEW_YAML)
})
