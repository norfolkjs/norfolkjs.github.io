import {
    existsSync,
    readdirSync,
    lstatSync,
    unlinkSync,
    rmdirSync,
    statSync,
    mkdirSync,
    copyFileSync,
    writeFileSync,
} from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPage, getRoutes } from '#utils';

const buildFolder = 'build';

const __dirname = dirname(fileURLToPath(import.meta.url));

const baseDir = join(__dirname, '../');

const buildToPath = join(baseDir, buildFolder);

const deleteFolderRecursive = function (directoryPath) {
    if (existsSync(directoryPath)) {
        readdirSync(directoryPath).forEach((file) => {
            const curPath = join(directoryPath, file);
            if (lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                unlinkSync(curPath);
            }
        });
        rmdirSync(directoryPath);
    }
};

const copyRecursiveSync = function (src, dest) {
    var exists = existsSync(src);
    var stats = exists && statSync(src);
    var isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        if (!existsSync(dest)) mkdirSync(dest);
        readdirSync(src).forEach((childItemName) => {
            copyRecursiveSync(join(src, childItemName), join(dest, childItemName));
        });
    } else {
        copyFileSync(src, dest);
    }
};

// 1. delete existing build folder

if (existsSync(buildToPath)) {
    deleteFolderRecursive(buildToPath);
}

// 2. create the build folder

mkdirSync(buildToPath);

// 3. copy static files to copy

copyRecursiveSync(join(baseDir, 'static'), buildToPath);

// 4. make pages and write to build folder

const routes = getRoutes();

for (const [route, filePath] of Object.entries(routes)) {
    const pageContent = await buildPage(filePath, route);

    const pageDirPath = join(buildToPath, route);

    if (!existsSync(pageDirPath)) mkdirSync(pageDirPath, { recursive: true });

    const pageBuildPath = join(buildToPath, route, 'index.html');

    writeFileSync(pageBuildPath, pageContent);
}
