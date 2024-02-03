import http from 'node:http';
import path from 'node:path';
import url from 'node:url';

import './init.js';
import fileRead from './utils/fileRead.js';
import buildHtml from './utils/buildHtml.js';
import parsePageContent from './utils/parsePageContent.js';
import { baseDir } from './utils/dirs.js';

const port = process.env.PORT;
const host = process.env.HOST;

function getContentType(filePath) {
    const ext = path.parse(filePath).ext.substring(1);

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

let lastReload = '';

const res404 = async () => ({
    chunk: await buildHtml({ meta: null, content: '404 - not found :(' }),
    statusCode: 404,
    headers: { 'Content-Type': 'text/html' },
});

const res500 = (error) => ({
    chunk: fileRead(path.join(baseDir, 'src/500.html')).replace('<!-- message -->', error.errorMessage),
    statusCode: 500,
    headers: { 'Content-Type': 'text/html' },
});

(async () => {
    lastReload = new Date().toISOString();

    // Create a server
    http.createServer(async (request, response) => {
        const { pathname: urlPath } = url.parse(request.url, true);

        if (urlPath === '/dev/reload') {
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ lastReload }));
            return;
        }

        const res = await (async () => {
            try {
                const staticFilePath = path.join(baseDir, 'static', urlPath);
                const staticChunk = fileRead(staticFilePath, {});

                if (staticChunk) {
                    return {
                        chunk: staticChunk,
                        statusCode: 200,
                        headers: { 'Content-Type': getContentType(staticFilePath) },
                        isStatic: true,
                    };
                }

                let routePages = {};

                routePages = parsePageContent();

                const page = routePages[urlPath];

                // page route exists for url build it on the fly
                if (page) {
                    return {
                        chunk: await buildHtml(page, routePages),
                        statusCode: 200,
                        headers: { 'Content-Type': 'text/html' },
                    };
                }

                return res404();
            } catch (error) {
                console.error(error);
                return res500(new Error(error));
            }
        })();

        const { chunk, statusCode, headers, isStatic } = res;

        response.writeHead(statusCode, headers);

        const chunkUpdated = !isStatic
            ? chunk.replace('</body>', `<script src="/javascripts/dev.js"></script></body>`)
            : chunk;

        response.end(chunkUpdated);
    }).listen(port, () => {
        console.info(`\x1b[32m%s\x1b[0m`, `Server is running at http://${host}:${port}`);
    });
})();
