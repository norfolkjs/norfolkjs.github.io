import moment from 'moment';
import handlebars from 'handlebars';

handlebars.registerHelper('dateFormat', function (format, date) {
    return moment(new Date(date * 1000)).format(format);
});
