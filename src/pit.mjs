#!/usr/bin/env node


// above line is called as shebang -> hash bang is shebang.

import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import { diffLines } from 'diff';
import chalk from 'chalk';
import {Command} from 'commander';

const program = new Command();

class Pit {
    constructor(repoPath = '.') { 
        this.repoPath = path.join(repoPath, '../pit');
        this.objectPath = path.join(this.repoPath, 'objects'); // .pit/objects
        this.headPath = path.join(this.repoPath, 'HEAD'); // .Pit/HEAD
        this.indexPath = path.join(this.repoPath, 'index'); // Pit/index it is staging area.
        this.init();
    }

    async init() {
        await fs.mkdir(this.objectPath, { recursive: true });
        try {
            await fs.writeFile(this.headPath, '', { flag: 'wx' }); // wx : open for writing. fails if file
            await fs.writeFile(this.indexPath, JSON.stringify([]), { flag: 'wx' });
        } catch (error) {
            console.log("Already initialised the .pit folder");
        }
    }

    hashObject(content) {
        return crypto.createHash('sha1').update(content, 'utf-8').digest('hex');
    }

    async add(fileToBeAdded) {
        const fileData = await fs.readFile(fileToBeAdded, { encoding: 'utf-8' });
        const fileHash = await this.hashObject(fileData);
        console.log(fileHash);
        const newFileHashedObjectPath = path.join(this.objectPath, fileHash);
        await fs.writeFile(newFileHashedObjectPath, fileData);

        await this.updateStagingArea(fileToBeAdded, fileHash);
        console.log(`Added ${fileToBeAdded}`);
    }

    async updateStagingArea(filePath, fileHash) {
        const index = JSON.parse(await fs.readFile(this.indexPath, { encoding: 'utf-8' }));
        index.push({ path: filePath, hash: fileHash }); // add the file to the index file

        await fs.writeFile(this.indexPath, JSON.stringify(index)); // write the updated index file
    }

    async commit(message) {
        const index = JSON.parse(await fs.readFile(this.indexPath, { encoding: 'utf-8' }));
        const parentCommit = await this.getCurrentHead();

        const commitData = {
            timeStamp: new Date().toISOString(),
            message,
            files: index,
            parent: parentCommit
        };

        const commitHash = this.hashObject(JSON.stringify(commitData));
        const commitPath = path.join(this.objectPath, commitHash);
        await fs.writeFile(commitPath, JSON.stringify(commitData));
        await fs.writeFile(this.headPath, commitHash); // update the Head to point to the new commit.
        await fs.writeFile(this.indexPath, JSON.stringify([])); // clear the staging area.
        console.log(`commit successfully created: ${commitHash}`);
    }

    async getCurrentHead() {
        try {
            return await fs.readFile(this.headPath, { encoding: 'utf-8' });
        } catch (error) {
            return null;
        }
    }

    async log() {
        let currentCommitHash = await this.getCurrentHead();
        while (currentCommitHash) {
            const commitData = JSON.parse(await fs.readFile(path.join(this.objectPath, currentCommitHash), { encoding: 'utf-8' }));
            console.log('-------------------------------');
            console.log(`commit : ${currentCommitHash} \nDate: ${commitData.timeStamp}\n\n${commitData.message}\n\n`);
            currentCommitHash = commitData.parent;
        }
    }

    async showCommitDiff(commitHash) {
        const commitData = JSON.parse(await this.getCommitData(commitHash));
        if (!commitData) {
            console.log("commit not found");
            return;
        }
        console.log("Changes in the last commit are:");

        for (const file of commitData.files) {
            console.log(`File: ${file.path}`);
            const fileContent = await this.getFileContent(file.hash);

            if (commitData.parent) {
                const parentCommitData = JSON.parse(await this.getCommitData(commitData.parent));
                const parentFileContent = await this.getParentFileContent(parentCommitData, file.path);

                if (parentFileContent !== undefined) {
                    console.log(`\nDiff:`);
                    const diff = diffLines(parentFileContent, fileContent);

                    diff.forEach(part => {
                        if (part.added) {
                            process.stdout.write("++" + chalk.green(part.value));
                        } else if (part.removed) {
                            process.stdout.write("--" + chalk.red(part.value));
                        } else {
                            process.stdout.write(chalk.gray(part.value));
                        }
                    });
                    console.log(); // new line;
                } else {
                    console.log("New file in this commit");
                }
            } else {
                console.log("First commit");
            }
        }
    }

    async getParentFileContent(parentCommitData, filePath) {
        const parentFile = parentCommitData.files.find(file => file.path === filePath);
        if (parentFile) {
            return await this.getFileContent(parentFile.hash);
        }
    }

    async getCommitData(commitHash) {
        const commitPath = path.join(this.objectPath, commitHash);
        try {
            return await fs.readFile(commitPath, { encoding: 'utf-8' });
        } catch (error) {
            console.log("Failed to read the commit data", error);
            return null;
        }
    }

    async getFileContent(fileHash) {
        const objectPath = path.join(this.objectPath, fileHash);
        return fs.readFile(objectPath, { encoding: 'utf-8' });
    }
}

// (async () => {
//     const pit = new Pit();
//     // await pit.add('sample.txt');
//     // await pit.commit('second commit');
//     // await pit.log();

//     await pit.showCommitDiff('your_commit_hash_here'); // Replace 'your_commit_hash_here' with an actual commit hash
// })();


program.command('init').action(async () =>{
    const pit = new Pit();
});

program.command('add <file>').action(async (file) => {
    const pit = new Pit();
    await pit.add(file);
});

program.command('commit <message>').action(async (message) => {
    const pit = new Pit();
    await pit.commit(message);
});

program.command('log').action(async () => {
    const pit = new Pit();
    await pit.log();
});

program.command('show <commitHash>').action(async (commitHash) => {
    const pit = new Pit();
    await pit.showCommitDiff(commitHash);
});

// console.log(process.argv);
program.parse(process.argv);
