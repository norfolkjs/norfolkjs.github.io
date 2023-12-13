import fs from 'node:fs';
import path from 'node:path';
import * as marked from 'marked';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const templatesDir = path.join(__dirname, '../../templates');
const contentDir = path.join(__dirname, '../../content');

import handlebars from 'handlebars';

const defaultTemplate = handlebars.compile(fs.readFileSync(path.join(templatesDir, 'default.html'), 'utf-8'));

const isContent = (file) => file.match(/\.(html|md|txt)$/g);

export async function buildPage(filePath, urlPath) {
    if (typeof filePath !== 'string') return null;

    let pageContentWithMeta = fs.readFileSync(filePath, 'utf-8');

    try {
        const { content, meta } = parseMeta(pageContentWithMeta);

        let pageContent = content;

        if (filePath.endsWith('.md')) {
            pageContent = marked.parse(content.replace(/<br>/g, '<br>\n'));
        }

        if (filePath.endsWith('.txt')) {
            pageContent = content.replace(/\n/g, '<br>\n');
        }

        let pageContentTemplate = handlebars.compile(pageContent);

        const fileName = path.parse(filePath).name;

        const dataFilePath = [
            path.join(path.dirname(filePath), fileName + '.js'),
            path.join(path.dirname(filePath), meta.template + '.js'),
        ].find((path) => fs.existsSync(path));

        let data = {};
        if (dataFilePath) {
            try {
                const { default: dataCallback } = await import(dataFilePath);
                data = dataCallback({ urlPath });
            } catch (error) {
                console.error(error);
            }
        }

        if (meta.template && meta.template !== 'default') {
            const metaTemplate = fs.readFileSync(path.join(templatesDir, meta.template + '.html'), 'utf-8');

            let metaTemplateTemplate = handlebars.compile(metaTemplate);

            const metaTemplateData = { ...data, page: { ...meta, content: pageContent } };

            pageContentTemplate = handlebars.compile(metaTemplateTemplate(metaTemplateData));
        }

        const defaultContent = pageContentTemplate(data);

        return defaultTemplate({
            content: defaultContent,
            page: meta,
            year: new Date().getFullYear(),
        });
    } catch (error) {
        console.error({ error });
        return null;
    }
}

export function parseMeta(content) {
    const metaMatch = content.match(RegExp('---.*?---', 's'));

    const meta = {};
    if (metaMatch) {
        // remove meta
        content = content.replace(metaMatch[0], '').trim();
        for (const line of metaMatch[0].split('\n')) {
            if (line === '---') continue;
            const [key, value] = line.split(': ', 2).map((k) => k.trim());
            meta[key] = value;
        }
    }

    return {
        content,
        meta,
    };
}

function routesFromDir(dir) {
    const allFiles = fs.readdirSync(dir) || [];

    let routes = {};

    for (const file of allFiles) {
        const filePath = path.join(dir, file);

        if (fs.statSync(filePath).isDirectory()) {
            routes = { ...routes, ...routesFromDir(filePath) };
        }

        if (!isContent(file)) continue;

        const route =
            filePath
                .replace(contentDir, '')
                // remove file ext
                .replace(/\.[a-z]+$/, '')
                // remove index file names
                .replace(/\/index+$/, '') || '/';

        routes[route] = filePath;
    }

    return routes;
}

/**
 * @name getRoutes
 * @function
 * @description builds a dictionary with url paths as keys and file paths to content as the values
 * @param {string} dir
 * @returns {{'/': 'contents/index.html'}}
 */
export function getRoutes() {
    return routesFromDir(contentDir) || [];
}
