import path from 'node:path';
import * as marked from 'marked';

import { contentDir } from './dirs.js';
import buildError from './buildError.js';
import fileRead, { fileExists } from './fileRead.js';

/**
 * parseMeta
 * @param {RegExpMatchArray} metaMatch
 * @param {string} relativePath
 * @returns {Record<string, any>}
 */
function parseMeta(metaMatch, relativePath) {
    const meta = {};

    if (metaMatch) {
        for (const line of metaMatch[0].split('\n')) {
            if (line === '---') continue;

            if (!line.includes(':')) {
                buildError(`Invalid meta on content page '${relativePath}'.`);
            }

            const [key, value] = line.split(/:(.*)/s, 2).map((k) => k.trim());

            meta[key] = value;
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
 * @typedef {{
 * route: string,
 * content: string,
 * title: string,
 * meta: Record<string, any>,
 * expressionGenerator: string | null
 * template: string | null
 * }} Page
 */

/**
 * Page
 * @param {string} relativePath
 * @returns {Page}
 */
export default function page(relativePath) {
    const details = {
        route: '', // url path
        content: '',
        title: '',
        meta: {},
        expressionGenerator: null,
        template: null,
    };

    if (!relativePath) return;

    details.relativePath = relativePath;

    // build the url route from the file path
    details.route = getUrlRoute(relativePath);

    // get the raw content
    const pagePath = path.join(contentDir, relativePath);
    const pageFileContents = fileRead(pagePath);

    const expressionGeneratorPath = pagePath.substring(0, pagePath.lastIndexOf('.')) + '.js';
    if (fileExists(expressionGeneratorPath)) {
        // we will run this when we build the page
        details.expressionGenerator = expressionGeneratorPath;
    }

    // get the meta data via regex Match
    const metaMatch = pageFileContents.match(RegExp('---.*?---', 's'));

    let meta = {};
    let content = '';

    if (metaMatch) {
        // remove meta from content
        content = pageFileContents.replace(metaMatch[0], '').trim();
        // set the parsed the meta data
        meta = parseMeta(metaMatch, relativePath);
    } else {
        content = pageFileContents;
    }

    meta.route = details.route;

    if (relativePath.endsWith('.md')) {
        content = marked.parse(content.replace(/<br>/g, '<br>\n'));
    }

    if (relativePath.endsWith('.txt')) {
        content = content.replace(/\n/g, '<br>\n');
    }

    if (meta.template) details.template = meta.template;
    details.content = content;
    details.meta = meta;

    return details;
}
