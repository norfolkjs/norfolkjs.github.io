let Parser = require('rss-parser');
let parser = new Parser();


function rss_pull() {
    url = "https://www.meetup.com/NorfolkJS/events/rss/"
    return parser.parseURL(url);

}

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.getMeetups = async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
    }
    return res.status(200).json(await rss_pull())
};

