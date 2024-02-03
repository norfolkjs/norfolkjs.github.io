import { existsSync, readFileSync, lstatSync } from 'node:fs';

/**
 *
 * @param {string} path
 */
export default function fileRead(path, options = { encoding: 'utf-8' }) {
    return fileExists(path) && readFileSync(path, options);
}

export function fileExists(path) {
    return existsSync(path) && lstatSync(path).isFile();
}

export function dirExists(path) {
    return existsSync(path) && lstatSync(path).isDirectory();
}
