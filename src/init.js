import moment from 'moment';
import handlebars from 'handlebars';

import buildError from './utils/buildError.js';

handlebars.registerHelper('log', function (something) {
    console.log(something);
});

handlebars.registerHelper('dateFormat', function (format, value) {
    const timestamp = typeof value === 'string' ? Date.parse(value) : Date.now();
    if (isNaN(timestamp)) buildError(`Invalid date: ${value}`);
    return moment(timestamp).format(format);
});
