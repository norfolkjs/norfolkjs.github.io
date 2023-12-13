import { readdirSync, readFileSync } from 'node:fs';
import { join, parse, dirname } from 'node:path';
import { parseMeta } from '#utils';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const blogDir = join(__dirname);

export default () => {
    const fileNames = readdirSync(blogDir)
        .filter((f) => f.endsWith('.md'))
        .sort()
        .reverse();

    const posts = [];

    for (const fileName of fileNames) {
        const contentWithMeta = readFileSync(join(blogDir, fileName), 'utf-8');

        const { meta } = parseMeta(contentWithMeta);

        const [y, m, d] = fileName.split('-');

        const date = new Date(y, m, d);

        posts.push({
            url: '/blog/' + parse(fileName).name,
            title: meta.title,
            dateFormatted: date.toLocaleDateString(),
            excerpt: meta.excerpt,
        });
    }

    return { posts };
};
