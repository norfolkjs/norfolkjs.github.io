const fs = require('fs');
const path = require('path');
const { parseMeta } = require('utils');

const blogDir = path.join(__dirname);

module.exports = () => {
    const fileNames = fs
        .readdirSync(blogDir)
        .filter((f) => f.endsWith('.md'))
        .sort()
        .reverse();

    const posts = [];

    for (const fileName of fileNames) {
        const contentWithMeta = fs.readFileSync(path.join(blogDir, fileName), 'utf-8');

        const { meta } = parseMeta(contentWithMeta);

        const [y, m, d] = fileName.split('-');

        const date = new Date(y, m, d);

        posts.push({
            url: '/blog/' + path.parse(fileName).name,
            title: meta.title,
            dateFormatted: date.toLocaleDateString(),
            excerpt: meta.excerpt,
        });
    }

    return { posts };
};
