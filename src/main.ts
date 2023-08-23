import { debug, getInput, setFailed } from '@actions/core';
import { parse } from 'yaml';
const { promises: fs } = require('fs');


async function run(): Promise<void> {
  try {
    const bump: string = getInput('bump');
    debug(`Should bump ${bump}`);
    const pubspecLocation = `${process.env.GITHUB_WORKSPACE}/pubspec.yaml}`;
    debug(`READING ${pubspecLocation}`);
    const pubspec = await fs.readFile(`${pubspecLocation}`, 'utf8')
    debug(`Pubspec ${pubspec}`);

    const pubspecYaml = parse(pubspec);
    debug(`Pubspec parsed ${pubspecYaml}`);
    debug(new Date().toTimeString())

    
  } catch (error) {
    if (error instanceof Error) setFailed(error.message)
  }
}

run()
