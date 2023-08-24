import { getInput, setFailed } from '@actions/core';
import { promises as fs } from 'fs';
import path from 'path'; // Import the 'path' module
import { Document, parse, stringify } from 'yaml';

type VersionInfo = {
  major: number
  minor: number
  patch: number
  build: number
}

async function run(): Promise<void> {
  try {
    const bumpMe: string = getInput('bump')
    const argOk = testBumpArgument(bumpMe)
    if (!argOk) {
      setFailed(
        'Invalid parameter supplied to bump, allowed values are major, minor, patch'
      )
    }

    const pubspecLocation = path.join(
      process.env.GITHUB_WORKSPACE!,
      'pubspec.yaml'
    )
    console.log(`Bumping ${bumpMe} from ${pubspecLocation}`)
    const yaml = await loadYaml(pubspecLocation)
    const nextVersion = await incrementVersion(yaml, bumpMe)
    await replaceVersionInfoAndSave(pubspecLocation, nextVersion)
  } catch (error) {
    if (error instanceof Error) setFailed(error.message)
  }
}

export const testBumpArgument = (arg: string): boolean => {
  return ['major', 'minor', 'patch'].includes(arg)
}

export const saveYaml = async (yaml: Document, path: string) => {
  await fs.writeFile(path, stringify(yaml))
}

export const incrementVersion = async (
  yaml: Document,
  bumpMe: string
): Promise<VersionInfo> => {
  const versionInfo = parseVersion(yaml.get('version') as string)
  
  const nextVersion = bump(bumpMe as keyof VersionInfo, versionInfo)
  console.log(`Bumping with ${bumpMe} from ${versionInfoToString(versionInfo)} to ${versionInfoToString(nextVersion)}`)
  return nextVersion
}

export const replaceVersionInfoAndSave = async (
  from: string,
  version: VersionInfo,
  to?: string
) => {
  const data = await fs.readFile(from, 'utf8')
  var result = data.replace(
    /version: [0-9]*\.[0-9]*\.[0-9]*\+[0-9]*/g,
    `version: ${versionInfoToString(version)}`
  )
  await fs.writeFile(to ? to : from, result)
}

export const loadYaml = async (path: string) => {
  const pubspec = await fs.readFile(`${path}`, 'utf8')
  const pubspecYaml = parse(pubspec)
  return new Document(pubspecYaml)
}

const parseVersion = (version: string): VersionInfo => {
  const d = version.split('+')
  const semver = d[0].split('.')
  const build = d[1]
  return {
    major: parseInt(semver[0]),
    minor: parseInt(semver[1]),
    patch: parseInt(semver[2]),
    build: parseInt(build)
  }
}

const bump = (key: keyof VersionInfo, version: VersionInfo): VersionInfo => {
  const next = { ...version };
  next[key] += 1;
  next.build += 1;
  return next;
}

const versionInfoToString = (version: VersionInfo): string => {
  return `${version.major}.${version.minor}.${version.patch}+${version.build}`
}

run()
