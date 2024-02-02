import { mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parsePageContent, copyRecursiveSync, buildHtml } from '#utils';
import './init';

const buildFolder = 'build';

const __dirname = dirname(fileURLToPath(import.meta.url));

const baseDir = join(__dirname, '../');

const buildPath = join(baseDir, buildFolder);

// 1. delete existing build folder

// done in bash command

// 2. create the build folder

mkdirSync(buildPath);
// todo: do this in a bash command

// 3. copy static files to copy

copyRecursiveSync(join(baseDir, 'static'), buildPath);
// todo: do this in a bash command

// 4. make pages and write to build folder

const routePages = parsePageContent();

for (const [route, page] of Object.entries(routePages)) {
    const pageContent = buildHtml(page, routePages);

    const pageDirPath = join(buildPath, route);

    // create the directory if it doesn't exist
    if (!existsSync(pageDirPath)) mkdirSync(pageDirPath, { recursive: true });

    // write the page to the correct build folder
    writeFileSync(join(buildPath, route, 'index.html'), pageContent);
}

writeFileSync(join(buildPath, 'build-' + new Date().toISOString()), 'build complete!');
