import * as Joi from 'joi';
import { ValidationResult } from 'joi';

import { createdAtValidator, dateValidator } from './shared-validators';

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

export const validateFoodListing = ({ startDate, endDate, page }) => {
  const ListSchema = Joi.object({
    startDate: Joi.string().default('2000-01-01').custom(dateValidator),
    endDate: Joi.string().default('3000-01-01').custom(dateValidator),
    page: Joi.number().default(1).min(1).max(1000),
  });
  return ListSchema.validate({ startDate, endDate, page });
};
