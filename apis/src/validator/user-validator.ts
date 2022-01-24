import * as Joi from 'joi';
import { ValidationResult } from 'joi';

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
