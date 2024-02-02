import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import url from 'node:url';

import './init.js';
import buildHtml from './utils/buildHtml.js';
import parsePageContent from './utils/parsePageContent.js';
import { baseDir } from './utils/dirs.js';

const port = process.env.PORT;
const host = process.env.HOST;

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

function response404(response, page404) {
    let chunk = page404 ? buildHtml(page404) : '404 - not found';

    response.writeHead(404, { 'Content-Type': 'text/html' });
    response.end(chunk);
}

(() => {
    // Create a server
    http.createServer(async (request, response) => {
        const routePages = parsePageContent();

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
                response404(response, routePages['/404']);
            }

            // we are asynchronously getting the file stop the listener
            return;
        }

        const page = routePages[urlPath];

        // page route exists for url build it on the fly
        if (page) {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(buildHtml(page, routePages));
            return;
        }

        response404(response, routePages['/404']);
    }).listen(port, () => {
        console.info(`\x1b[32m%s\x1b[0m`, `Server is running at http://${host}:${port}`);
    });
})();
