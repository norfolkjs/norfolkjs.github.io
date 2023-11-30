const fs = require('fs');
const path = require('path');
const marked = require('marked');

const { parseMeta } = require('utils');

const blogDir = path.join(__dirname);

module.exports = ({ urlPath }) => {
    const fileName = path.parse(urlPath).name + '.md';

    const contentWithMeta = fs.readFileSync(path.join(blogDir, fileName), 'utf-8');

    const { meta, content: markdown } = parseMeta(contentWithMeta);

    return {
        page: {
            title: meta.title,
            content: marked.parse(markdown),
        },
    };
};
