/**
 * metaFrom is a meta processor that allows you to pull in meta data from other routes
 * @param {string} value
 * @param {Object.<string, Page>} routePages
 * @returns {any}
 */
export default function metaFrom(value, routePages) {
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

    return routesMeta;
}
