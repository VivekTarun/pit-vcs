import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import { timeStamp } from 'console';

class Pit {
    constructor(repoPath = '.') {
        this.repoPath = path.join(repoPath, '.pit');
        this.objectPath = path.join(this.repoPath, 'objects'); // .pit/objects
        this.headPath = path.join(this.repoPath, 'HEAD'); // .Pit/HEAD
        this.indexPath = path.join(this.repoPath, 'index'); // Pit/index it is staging area.
        this.init();
    }

    async init() {
        await fs.mkdir(this.objectPath, {recursive: true});
        try {
            await fs.writeFile(this.headPath, '', {flag : 'wx'}); // wx : open for writing. fails if file
            await fs.writeFile(this.indexPath, JSON.stringify([]), {flag: 'wx'});
        } catch (error) {
            console.log("Already initialised the .pit folder");
        }
    }

    hashObject(content) {
        return crypto.createHash('sha1').update(content, 'utf-8').digest('hex');
    }

    async add(fileToBeAdded) {
        const fileData = await fs.readFile(fileToBeAdded, {encoding: 'utf-8'});
        const fileHash = await this.hashObject(fileData);
        console.log(fileHash);
        const newFileHashedObjectPath = path.join(this.objectPath, fileHash);
        await fs.writeFile(newFileHashedObjectPath, fileData);

        await this.updateStagingArea(fileToBeAdded, fileHash);
        console.log(`Added ${fileToBeAdded}`);
    }

    async updateStagingArea(FilePath, fileHash) {
        const index = JSON.parse(await fs.readFile(this.indexPath, {encoding: 'utf-8'}));
        index.push({path : FilePath, hash: fileHash}); // add the file to the index file

        await fs.writeFile(this.indexPath, JSON.stringify(index)); // write the updated index file

    }

    async commit(message) {
        const index = JSON.parse(await fs.readFile(this.indexPath, {encoding : 'utf-8'}));
        const parentCommit = await this.getCurrentHead();

        const commitData =  {
            timeStamp: new Date().toISOString,
            message,
            files : index,
            parent : parentCommit
        }

        const commitHash = this.hashObject(JSON.stringify(commitData));
        const commitPath = path.join(this.objectPath, commitHash);
        await fs.writeFile(commitPath, JSON.stringify(commitData));
        await fs.writeFile(this.headPath, commitHash); // update the Head to point to the new commit.
        await fs.writeFile(this.indexPath, JSON.stringify([])); // clear the staging area.
        console.log(`commit successfully created: ${commitHash}`);
    }

    async getCurrentHead() {
        try {
            return await fs.readFile(this.headPath, {encoding : 'utf-8'});
        } catch(error) {

        }
    }

}
(async () => {
    const pit = new Pit();
    await pit.add('sample.txt'); 
    await pit.commit('Initial commit');
})();
