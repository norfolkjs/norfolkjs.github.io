import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import handlebars from 'handlebars';

import buildError from './buildError.js';
import { templatesDir } from './dirs.js';
import metaFrom from './metaFrom.js';

const defaultHandlebarsTemplate = handlebars.compile(
    readFileSync(path.join(templatesDir, 'default.html'), 'utf-8')
);

/**
 * apply the template to the content
 * @param {Page} page
 * @param {Object.<string, Page>} routePages
 * @returns {string}
 */
export default function buildHtml(page, routePages) {
    let { template, ...meta } = Object.fromEntries(page.meta.entries());

    let templateData = { ...meta, content: page.content };

    page.meta.forEach((value, key) => {
        if (routePages && typeof value === 'string' && value.includes('metaFrom ')) {
            templateData[key] = metaFrom(value, routePages);
        }
    });

    // apply the meta data to the page content
    templateData.content = handlebars.compile(page.content)(templateData);

    // apply the template to the page content
    if (template && template !== 'default') {
        // todo: should support hbs and other template file types
        const templatePath = path.join(templatesDir, template + '.html');

        if (!existsSync(templatePath)) {
            return buildError(
                `Invalid template on content page: '${page.relativePath}'. ` +
                    `Template file '${template}' does not exist.`
            );
        }

        const metaTemplate = handlebars.compile(readFileSync(templatePath, 'utf-8'));

        templateData.content = metaTemplate(templateData);
    }

    return defaultHandlebarsTemplate(templateData);
}
