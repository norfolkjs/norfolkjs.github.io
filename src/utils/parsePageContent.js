import { existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import buildError from './buildError.js';
import Page from './page.js';

import { contentDir } from './dirs.js';

const isContent = (file) => file.match(/\.(html|md|txt)$/g);

/**
 * @typedef {import('src/utils/page.js').Page} Page
 */

/**
 * parseContentRecursive
 * @param {string} dir
 * @returns {Record<string, Page>}
 */
function parseContentRecursive(dir) {
    const allFiles = readdirSync(dir) || [];

    let pageRoutes = {};

    for (const file of allFiles) {
        const filePath = path.join(dir, file);

        if (statSync(filePath).isDirectory()) {
            pageRoutes = { ...pageRoutes, ...parseContentRecursive(filePath) };
        }

        // file is not a content file skip it
        if (!isContent(file)) continue;
        const page = Page(filePath.replace(contentDir, ''));

        pageRoutes[page.route] = page;
    }

    return pageRoutes;
}

/**
 * Parses the content directory and returns the parsed content.
 * @returns {Record<string, Page>}
 */
export default function parsePageContent() {
    if (!existsSync(path.join(contentDir, 'index.html'))) {
        buildError(`Root page at 'contents/index.html' does not exist`);
    }

    return {
        '/': Page('index.html'),
        ...parseContentRecursive(contentDir),
    };
}
