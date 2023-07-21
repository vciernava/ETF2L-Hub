import {name, version, author} from '../../package.json';
import {getLastCommit, Commit} from 'git-last-commit';

export default class Instance {
    constructor() {
    }

    public async getInstance(): Promise<{ app: string; version: string; author: string; authorIcon: string; gitCommit: Commit; footer: string; }> {
        return {
            app: name,
            version: version,
            author: author,
            authorIcon: 'https://cdn.discordapp.com/avatars/423828547447160833/12e18a848b28ff25a993d9e629362d01.png',
            gitCommit: await this.getGitCommit(),
            footer: 'Developed by rotzZik.'
        }
    }

    public getGitCommit() {
        return new Promise<Commit>((res, rej) => {
            getLastCommit((err: Error, commit: Commit) => {
                if (err) return rej(err);
                return res(commit);
            });
        });
    }
}