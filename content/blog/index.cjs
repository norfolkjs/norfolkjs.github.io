/**
 * blog posts page expressionGenerator
 * @param {Page} currentPage
 * @param {Record<string, Page>} pageRoutes
 * @returns {Record<string, any>}
 */
module.exports = function expressionGenerator(_, pageRoutes) {
    return {
        posts: Object.keys(pageRoutes)
            .filter((route) => route.startsWith('/blog/post'))
            .map((route) => pageRoutes[route].meta)
            .sort((a, b) => new Date(b.posted).getTime() - new Date(a.posted).getTime()),
    };
};
