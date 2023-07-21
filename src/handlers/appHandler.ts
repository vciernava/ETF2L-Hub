import {name, version, author} from '../../package.json';
import {getLastCommit, Commit} from 'git-last-commit';
import fs from 'fs';
import path from 'path';

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

    
    readLangFile(locale: string): JSON {
        const langFilePath = path.join(__dirname, `../lang/${locale}.json`);
        const fallbackFilePath = path.join(__dirname, '../lang/en-US.json');

        try {
            return JSON.parse(fs.readFileSync(langFilePath, 'utf8'));
        } catch (err) {
            console.error(`Error loading language file for locale "${locale}":`, err);
            try {
                return JSON.parse(fs.readFileSync(fallbackFilePath, 'utf8'));
            } catch (error) {
                console.error('Error loading fallback language file:', error);
                return JSON.parse("{}");
            }
        }
    }
    
    public getLangFiles(locale: string) {
        const lang = this.readLangFile(locale);
        return lang;
    }
}