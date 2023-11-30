const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '../');

const { buildPage, getRoutes } = require('utils');

const buildFolder = 'build';

const deleteFolderRecursive = function (directoryPath) {
    if (fs.existsSync(directoryPath)) {
        fs.readdirSync(directoryPath).forEach((file) => {
            const curPath = path.join(directoryPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(directoryPath);
    }
};

const copyRecursiveSync = function (src, dest) {
    var exists = fs.existsSync(src);
    var stats = exists && fs.statSync(src);
    var isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest);
        fs.readdirSync(src).forEach((childItemName) => {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
};

const buildToPath = path.join(baseDir, buildFolder);

// 1. delete existing build folder

if (fs.existsSync(buildToPath)) {
    deleteFolderRecursive(buildToPath);
}

// 2. create the build folder

fs.mkdirSync(buildToPath);

// 3. copy static files to copy

copyRecursiveSync(path.join(baseDir, 'static'), buildToPath);

// 4. make pages and write to build folder

const routes = getRoutes();

for (const [route, filePath] of Object.entries(routes)) {
    const pageContent = buildPage(filePath, route);

    const pageDirPath = path.join(buildToPath, route);

    if (!fs.existsSync(pageDirPath)) fs.mkdirSync(pageDirPath, { recursive: true });

    const pageBuildPath = path.join(buildToPath, route, 'index.html');

    fs.writeFileSync(pageBuildPath, pageContent);
}
