import { existsSync, readdirSync, statSync, mkdirSync, copyFileSync, readFileSync } from 'node:fs';
import path from 'node:path';
import * as marked from 'marked';
import { fileURLToPath } from 'node:url';
import handlebars from 'handlebars';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const templatesDir = path.join(__dirname, '../../templates');
const contentDir = path.join(__dirname, '../../content');

const defaultHandlebarsTemplate = handlebars.compile(
    readFileSync(path.join(templatesDir, 'default.html'), 'utf-8')
);

const isContent = (file) => file.match(/\.(html|md|txt)$/g);

/**
 * apply the template to the content
 * @param {Page} page
 * @param {Object.<string, Page>} routePages
 * @returns {string}
 */
export function buildHtml(page, routePages) {
    let { template, ...meta } = Object.fromEntries(page.meta.entries());

    let templateData = { ...meta, content: page.content };

    page.meta.forEach((value, key) => {
        if (routePages && typeof value === 'string' && value.includes('metaFrom ')) {
            const [metaFromRoute, sortBy, property, order] = value.replace('metaFrom ', '').split(' ');

            let routesMeta = Object.keys(routePages)
                // look for routes that start with the metaFromRoute
                .filter((route) => route.startsWith(metaFromRoute))
                // map the routes to the meta data
                .map((route) => ({
                    route,
                    ...Object.fromEntries(routePages[route].meta.entries()),
                }));

            // sort the meta data
            if (sortBy && property && order) {
                routesMeta.sort((a, b) => {
                    if (order === 'asc') {
                        return a[property] - b[property];
                    }
                    return b[property] - a[property];
                });
            }

            templateData[key] = routesMeta;
        }
    });

    // apply the meta data to the page content
    templateData.content = handlebars.compile(page.content)(templateData);

    // apply the template to the page content
    if (template && template !== 'default') {
        // todo: should support hbs and other template file types
        const templatePath = path.join(templatesDir, template + '.html');

        if (!existsSync(templatePath)) {
            return BuildError(
                `Invalid template on content page: '${page.relativePath}'. ` +
                    `Template file '${template}' does not exist.`
            );
        }

        const metaTemplate = handlebars.compile(readFileSync(templatePath, 'utf-8'));

        templateData.content = metaTemplate(templateData);
    }

    return defaultHandlebarsTemplate(templateData);
}

const metaTypes = {
    date: (value) => Math.floor(new Date(value).getTime() / 1000),
};

/**
 * parseMeta
 * @param {RegExpMatchArray} metaMatch
 * @param {string} relativePath
 * @returns {Map}
 */
function parseMeta(metaMatch, relativePath) {
    const meta = new Map();

    if (metaMatch) {
        for (const line of metaMatch[0].split('\n')) {
            if (line === '---') continue;

            if (!line.includes(':')) {
                BuildError(`Invalid meta on content page '${relativePath}'.`);
            }

            const [key, value] = line.split(/:(.*)/s, 2).map((k) => k.trim());

            if (value.includes(':')) {
                const [type, rawValue] = value
                    .split(':')
                    .map((v) => v.trim())
                    .filter(Boolean);

                if (metaTypes[type]) {
                    meta.set(key, metaTypes[type](rawValue));
                    continue;
                }
            } else {
                meta.set(key, value);
            }
        }
    }

    return meta;
}

/**
 * build the url route from the relative path from contents directory
 */
function getUrlRoute(relativePath) {
    return (
        relativePath
            // remove content root (just in case)
            .replace(contentDir, '')
            // remove file ext
            .replace(/\.[a-z]+$/, '')
            // remove index file names
            .replace(/index+$/, '')
            // remove trailing slash
            .replace(/\/$/, '')
    );
}
/**
 * Page
 * @param {string} relativePath
 */
class Page {
    route = ''; // url path
    content = '';
    title = '';
    meta = new Map();

    constructor(relativePath) {
        this.relativePath = relativePath;

        // build the url route from the file path
        this.route = getUrlRoute(relativePath);

        // get the raw content
        const pageFileContent = readFileSync(path.join(contentDir, relativePath), 'utf-8');

        // get the meta data via regex Match
        const metaMatch = pageFileContent.match(RegExp('---.*?---', 's'));

        let content = '';

        let meta = new Map();

        if (metaMatch) {
            // remove meta from content
            content = pageFileContent.replace(metaMatch[0], '').trim();
            // set the parsed the meta data
            meta = parseMeta(metaMatch, relativePath);
        } else {
            content = pageFileContent;
        }

        if (relativePath.endsWith('.md')) {
            content = marked.parse(content.replace(/<br>/g, '<br>\n'));
        }

        if (relativePath.endsWith('.txt')) {
            content = content.replace(/\n/g, '<br>\n');
        }

        this.content = content;
        this.meta = meta;
    }
}

/**
 * BuildError
 * @param {boolean} showError
 * @param {string} errorMessage
 * @returns {void}
 *
 */
export function BuildError(errorMessage) {
    console.error(`
            
        \x1b[41m\x1b[90m Build Error: \x1b[0m
            \x1b[31m${errorMessage}
            
            \x1b[0m`);

    throw new Error(errorMessage);
}

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
export function parsePageContent() {
    if (!existsSync(path.join(contentDir, 'index.html'))) {
        BuildError(`Root page at 'contents/index.html' does not exist`);
    }

    return {
        '/': new Page('index.html'),
        ...parseContentRecursive(contentDir),
    };
}

// todo: replace with bash script
export const copyRecursiveSync = function (src, dest) {
    var exists = existsSync(src);
    var stats = exists && statSync(src);
    var isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        if (!existsSync(dest)) mkdirSync(dest);
        readdirSync(src).forEach((childItemName) => {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        copyFileSync(src, dest);
    }
};
