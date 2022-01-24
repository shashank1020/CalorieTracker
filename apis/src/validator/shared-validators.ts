import * as moment from 'moment';

export const createdAtValidator = (value, helper) => {
  try {
    const date = moment(value, 'YYYY-MM-DD HH:mm', true);
    if (date.isValid())
      if (
        date.format('YYYY-MM-DD') < '2000-01-01 00:00' ||
        date.format('YYYY-MM-DD 00:00') > moment().format('YYYY-MM-DD HH:mm')
      )
        return helper.message(
          'Date has to be in range 2000-01-01 00:00 and ' +
            moment().format('YYYY-MM-DD HH:mm'),
        );
      else return value;
    else {
      return helper.message(
        'Not a valid date time. Acceptable format is YYYY-MM-DD HH:mm',
      );
    }
  } catch (e) {
    return helper.message(
      'Not a valid date time. Acceptable format is YYYY-MM-DD HH:mm',
    );
  }
};

export const dateValidator = (value, helper) => {
  try {
    if (moment(value, 'YYYY-MM-DD', true).isValid()) return value;
    else {
      return helper.message(
        'Not a valid date. Acceptable format is YYYY-MM-DD',
      );
    }
  } catch (e) {
    return helper.message('Not a valid date. Acceptable format is YYYY-MM-DD');
  }
};
