import * as Joi from 'joi';
import * as moment from 'moment';
import { ValidationResult } from 'joi';

const createdAtValidator = (value, helper) => {
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

const dateValidator = (value, helper) => {
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
export const validateFoodEntry = ({
  createdAt,
  name,
  calorie,
  price,
}): ValidationResult => {
  const FoodSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    calorie: Joi.number().min(50).max(3000).required(),
    price: Joi.number().min(1).max(500).required(),
    createdAt: Joi.string().required().custom(createdAtValidator),
  });
  return FoodSchema.validate({ name, calorie, price, createdAt });
};

export const validateUserEntry = ({
  dailyCalorieLimit,
  monthlyBudget,
  name,
}): ValidationResult => {
  const UserSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    dailyCalorieLimit: Joi.number().min(1000).max(10000).required(),
    monthlyBudget: Joi.number().min(500).max(10000).required(),
  });

  return UserSchema.validate({ dailyCalorieLimit, monthlyBudget, name });
};

export const validateFoodListing = ({ startDate, endDate, page }) => {
  const ListSchema = Joi.object({
    startDate: Joi.string().default('2000-01-01').custom(dateValidator),
    endDate: Joi.string().default('3000-01-01').custom(dateValidator),
    page: Joi.number().default(1).min(1).max(1000),
  });
  return ListSchema.validate({ startDate, endDate, page });
};
