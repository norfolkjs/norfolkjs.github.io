import { existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import buildError from './buildError.js';
import Page from './page.js';

import { contentDir } from './dirs.js';

const isContent = (file) => file.match(/\.(html|md|txt)$/g);

/**
 * parseContentRecursive
 * @param {string} dir
 * @returns {Object.<string, Page>}
 */
function parseContentRecursive(dir) {
    const allFiles = readdirSync(dir) || [];

    let routes = {};

    for (const file of allFiles) {
        const filePath = path.join(dir, file);

        if (statSync(filePath).isDirectory()) {
            routes = { ...routes, ...parseContentRecursive(filePath) };
        }

        // file is not a content file skip it
        if (!isContent(file)) continue;

        const page = new Page(filePath.replace(contentDir, ''));

        routes[page.route] = page;
    }

    return routes;
}

/**
 * Parses the content directory and returns the parsed content.
 * @returns {Object.<string, Page>}
 */
export default function parsePageContent() {
    if (!existsSync(path.join(contentDir, 'index.html'))) {
        buildError(`Root page at 'contents/index.html' does not exist`);
    }

    return {
        '/': new Page('index.html'),
        ...parseContentRecursive(contentDir),
    };
}
