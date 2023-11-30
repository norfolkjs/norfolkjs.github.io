const fs = require('fs');
const http = require('http');
const path = require('path');
const url = require('url');

const { buildPage, getRoutes } = require('utils');

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

function response404(response, pathname) {
    let chunk = '404 - not found';

    if (routes['/404']) chunk = buildPage(routes['/404'], pathname);

    response.writeHead(404, { 'Content-Type': 'text/html' });
    response.end(chunk);
}

// Create a server
http.createServer((request, response) => {
    const { pathname: urlPath } = url.parse(request.url, true);

    let staticFilePath = path.join(baseDir, 'static', urlPath);

    // static file exists for url
    if (fileExists(staticFilePath)) {
        fs.readFile(staticFilePath, (err, data) => {
            if (!err) {
                response.writeHead(200, { 'Content-Type': getContentType(staticFilePath) });
                response.end(data);
                return;
            }
            console.error(err);
            response404(response, urlPath);
        });
        // we are asynchronously getting the file stop the listener
        return;
    }

    const routeFilePath = routes[urlPath];

    // page route exists for url
    if (routeFilePath) {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(buildPage(routeFilePath, urlPath));
        return;
    }

    response404(response, urlPath);
}).listen(port, () => {
    console.info(`\x1b[32m%s\x1b[0m`, `Server is running at https://${host}:${port}`);
});
