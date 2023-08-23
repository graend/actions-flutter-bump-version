import { debug, getInput, setFailed } from '@actions/core';
import { promises as fs } from 'fs';
import path from 'path'; // Import the 'path' module
import { parse } from 'yaml';


async function run(): Promise<void> {
  try {
    const bump: string = getInput('bump');
    debug(`Should bump ${bump}`);
    console.log(`Should bump ${bump}`);
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
    
    
  } catch (error) {
    if (error instanceof Error) setFailed(error.message)
  }
}

run()
