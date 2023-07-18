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
            authorIcon: 'https://avatars.githubusercontent.com/u/57325593?v=4',
            gitCommit: await this.getGitCommit(),
            footer: 'Developed by Viktor Čierňava.'
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