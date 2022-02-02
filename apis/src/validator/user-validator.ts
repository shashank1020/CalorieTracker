import * as Joi from 'joi';
import { ValidationResult } from 'joi';

export const validateUserEntry = ({
  dailyCalorieThreshold,
  monthlyBudgetThreshold,
  name,
}): ValidationResult => {
  const UserSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    dailyCalorieThreshold: Joi.number().min(1000).max(10000).required(),
    monthlyBudgetThreshold: Joi.number().min(500).max(10000).required(),
  });

  return UserSchema.validate({
    dailyCalorieThreshold,
    monthlyBudgetThreshold,
    name,
  });
};
