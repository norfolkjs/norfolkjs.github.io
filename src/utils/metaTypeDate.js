export default function metaTypeDate(value) {
    return Math.floor(new Date(value.replace('typeDate ', '')).getTime() / 1000);
}
