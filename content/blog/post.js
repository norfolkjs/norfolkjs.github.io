import { readFileSync } from 'node:fs';
import { join, parse, dirname } from 'node:path';
import * as marked from 'marked';

import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import { parseMeta } from '#utils';

const blogDir = join(__dirname);

export default ({ urlPath }) => {
    const fileName = parse(urlPath).name + '.md';

    const contentWithMeta = readFileSync(join(blogDir, fileName), 'utf-8');

    const { meta, content: markdown } = parseMeta(contentWithMeta);

    return {
        page: {
            title: meta.title,
            content: marked.parse(markdown),
        },
    };
};
