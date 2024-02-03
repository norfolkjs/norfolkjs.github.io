import path from 'node:path';
import handlebars from 'handlebars';

import buildError from './buildError.js';
import { templatesDir } from './dirs.js';
import fileRead from './fileRead.js';

const defaultHandlebarsTemplate = handlebars.compile(fileRead(path.join(templatesDir, 'default.html')));

/**
 * @typedef {import('src/utils/page.js').Page} Page
 */

/**
 * apply the template to the content
 * @param {Page} page
 * @param {Record<string, Page>} routePages
 * @returns {Promise<string>}
 */
export default async function buildHtml(page, routePages) {
    let { template, ...meta } = page.meta || {};

    let templateData = { ...meta, content: page.content };

    // if the page has an expressionGenerator, run it and add the result to the template data
    if (page.expressionGenerator) {
        const { default: expressionGenerator } = await import(page.expressionGenerator);
        templateData = { ...templateData, ...expressionGenerator(routePages) };
    }

    // apply the meta data to the page content in case it has handlebar expressions
    templateData.content = handlebars.compile(page.content)(templateData);

    if (template && template !== 'default') {
        // apply the template to the page content
        // todo: should support hbs and other template file types
        const templatePath = path.join(templatesDir, template + '.html');

        const templateChunk = fileRead(templatePath);

        if (!templateChunk) {
            return buildError(
                `Invalid template on content page: '${page.relativePath}'. ` +
                    `Template file '${template}' does not exist.`
            );
        }

        const metaTemplate = handlebars.compile(templateChunk);

        templateData.content = metaTemplate(templateData);
    }

    return defaultHandlebarsTemplate(templateData);
}
