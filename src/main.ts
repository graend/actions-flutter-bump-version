import { debug, getInput, setFailed } from '@actions/core';
import { promises as fs } from 'fs';
import path from 'path'; // Import the 'path' module
import { parse } from 'yaml';

type VersionInfo = {
  major: number;
  minor: number;
  patch: number;
  build: number;
};

type ObjectKey = keyof typeof VersionInfo;

async function run(): Promise<void> {
  try {
    const bumpMe: string = getInput('bump');
    debug(`Should bump ${bumpMe}`);
    console.log(`Should bump ${bumpMe}`);
    const pubspecLocation = path.join(process.env.GITHUB_WORKSPACE!, 'pubspec.yaml');
    debug(`READING ${pubspecLocation}`);
    console.log(`READING ${pubspecLocation}`);
    const pubspec = await fs.readFile(`${pubspecLocation}`, 'utf8')
    debug(`Pubspec ${pubspec}`);

    const pubspecYaml = parse(pubspec);
    debug(`Pubspec parsed ${pubspecYaml}`);
    console.log(`Pubspec parsed ${pubspecYaml}`);
    debug(new Date().toTimeString())
    debug(`Pubspec version ${pubspecYaml.version}`);
    console.log(`Pubspec version ${pubspecYaml.version}`);
    
    const currentVersion = pubspecYaml.version;

    const parsedVersionInfo = parseVersion(currentVersion);
    console.log(`parsedVersionInfo ${JSON.stringify(parsedVersionInfo)}`);

    const newVersionInfo = bump(bumpMe as keyof VersionInfo, parsedVersionInfo);
    console.log(`newVersionInfo ${JSON.stringify(newVersionInfo)}`);

  } catch (error) {
    if (error instanceof Error) setFailed(error.message)
  }
}

const parseVersion =(version: string) :VersionInfo => {
  const d = version.split('+');
  const semver = d[0].split('.');
  const build = d[1];
  return {
    major: parseInt(semver[0]),
    minor: parseInt(semver[1]),
    patch: parseInt(semver[2]),
    build: parseInt(build)
  }
}

const bump = (key: keyof VersionInfo, version: VersionInfo) :VersionInfo => {
  version[key] += 1;
  version.build += 1;
  return version;
}

run()
