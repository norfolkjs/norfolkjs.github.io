import path from 'node:path';

export const baseDir = process.cwd();
export const templatesDir = path.resolve(baseDir, 'templates');
export const contentDir = path.resolve(baseDir, 'content');
export const staticDir = path.resolve(baseDir, 'static');
