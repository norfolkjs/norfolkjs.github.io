/**
 * @typedef {import('src/utils/page.js').Page} Page
 */

/**
 * blog posts page expressionGenerator
 * @param {Record<string, Page>} pageRoutes
 * @returns {Record<string, any>}
 */
function expressionGenerator(pageRoutes) {
    return {
        posts: Object.keys(pageRoutes)
            .filter((route) => route.startsWith('/blog/post'))
            .map((route) => pageRoutes[route].meta)
            .sort((a, b) => new Date(b.posted).getTime() - new Date(a.posted).getTime()),
    };
}

export default expressionGenerator;
