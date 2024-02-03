import { mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import './init.js';

import parsePageContent from './utils/parsePageContent.js';
import buildHtml from './utils/buildHtml.js';

const buildFolder = 'build';

const buildPath = join(process.cwd(), buildFolder);

const routePages = parsePageContent();

(async () => {
    for (const [route, page] of Object.entries(routePages)) {
        const pageContent = await buildHtml(page, routePages);

        const pageDirPath = join(buildPath, route);

        // create the directory if it doesn't exist
        if (!existsSync(pageDirPath)) mkdirSync(pageDirPath, { recursive: true });

        // write the page to the correct build folder
        writeFileSync(join(buildPath, route, 'index.html'), pageContent);
    }

    writeFileSync(join(buildPath, 'build-' + new Date().toISOString()), 'build complete!');
})();
