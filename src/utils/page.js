import { readFileSync } from 'node:fs';
import path from 'node:path';
import * as marked from 'marked';

import { contentDir } from './dirs.js';
import buildError from './buildError.js';
import metaTypeDate from './metaTypeDate.js';

const metaTypes = Object.entries({
    typeDate: metaTypeDate,
});

/**
 * parseMeta
 * @param {RegExpMatchArray} metaMatch
 * @param {string} relativePath
 * @returns {Map}
 */
function parseMeta(metaMatch, relativePath) {
    const meta = new Map();

    if (metaMatch) {
        for (const line of metaMatch[0].split('\n')) {
            if (line === '---') continue;

            if (!line.includes(':')) {
                buildError(`Invalid meta on content page '${relativePath}'.`);
            }

            const [key, value] = line.split(/:(.*)/s, 2).map((k) => k.trim());

            meta.set(key, value);
            metaTypes.forEach(([prefix, callback]) => {
                if (value.startsWith(prefix + ' ')) {
                    meta.set(key, callback(value));
                }
            });
        }
    }

    return meta;
}

/**
 * build the url route from the relative path from contents directory
 */
function getUrlRoute(relativePath) {
    return (
        relativePath
            // remove content root (just in case)
            .replace(contentDir, '')
            // remove file ext
            .replace(/\.[a-z]+$/, '')
            // remove index file names
            .replace(/index+$/, '')
            // remove trailing slash
            .replace(/\/$/, '')
    );
}
/**
 * Page
 * @param {string} relativePath
 */
export default class Page {
    route = ''; // url path
    content = '';
    title = '';
    meta = new Map();

    constructor(relativePath) {
        this.relativePath = relativePath;

        // build the url route from the file path
        this.route = getUrlRoute(relativePath);

        // get the raw content
        const pageFileContent = readFileSync(path.join(contentDir, relativePath), 'utf-8');

        // get the meta data via regex Match
        const metaMatch = pageFileContent.match(RegExp('---.*?---', 's'));

        let content = '';

        let meta = new Map();

        if (metaMatch) {
            // remove meta from content
            content = pageFileContent.replace(metaMatch[0], '').trim();
            // set the parsed the meta data
            meta = parseMeta(metaMatch, relativePath);
        } else {
            content = pageFileContent;
        }

        if (relativePath.endsWith('.md')) {
            content = marked.parse(content.replace(/<br>/g, '<br>\n'));
        }

        if (relativePath.endsWith('.txt')) {
            content = content.replace(/\n/g, '<br>\n');
        }

        this.content = content;
        this.meta = meta;
    }
}
