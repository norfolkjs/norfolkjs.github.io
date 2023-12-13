import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

import { buildPage, getRoutes } from '#utils';

const port = process.env.PORT;
const host = process.env.HOST;

const baseDir = path.join(__dirname, '../');

const routes = getRoutes();

function getContentType(filePath) {
    const ext = path.parse(filePath).ext.substr(1);

    const contentType =
        {
            html: 'text/html',
            css: 'text/css',
            js: 'application/javascript',
            jgp: 'image/jpeg',
            png: 'image/png',
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            gif: 'image/gif',
            json: 'application/json',
            xml: 'application/xml',
            ico: 'image/x-icon',
        }[ext] || 'text/plain';

    return contentType;
}

const fileExists = (filePath) => fs.existsSync(filePath) && fs.lstatSync(filePath).isFile();

async function response404(response, pathname) {
    let chunk = '404 - not found';

    if (routes['/404']) chunk = await buildPage(routes['/404'], pathname);

    response.writeHead(404, { 'Content-Type': 'text/html' });
    response.end(chunk);
}

// Create a server
http.createServer(async (request, response) => {
    const { pathname: urlPath } = url.parse(request.url, true);

    let staticFilePath = path.join(baseDir, 'static', urlPath);

    // static file exists for url
    if (fileExists(staticFilePath)) {
        try {
            const data = fs.readFileSync(staticFilePath);
            response.writeHead(200, { 'Content-Type': getContentType(staticFilePath) });
            response.end(data);
            return;
        } catch (err) {
            console.error(err);
            await response404(response, urlPath);
        }

        // we are asynchronously getting the file stop the listener
        return;
    }

    const routeFilePath = routes[urlPath];

    // page route exists for url
    if (routeFilePath) {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(await buildPage(routeFilePath, urlPath));
        return;
    }

    response404(response, urlPath);
}).listen(port, () => {
    console.info(`\x1b[32m%s\x1b[0m`, `Server is running at http://${host}:${port}`);
});
