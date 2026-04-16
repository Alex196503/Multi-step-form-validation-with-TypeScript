import Joi from 'joi';
/* validation schema for the auth object */
export const registerSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(new RegExp(/^\+40[1-9][0-9]{8,9}$/)).required().messages({'string.pattern.base': 'Phone must start with +40, followed by a non-zero digit and 8 to 9 more digits'}).required(),
    password: Joi.string().pattern(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)).required().messages({'string.pattern.base': 'Password must contain at least 8 characters, an uppercase letter, a lowercase letter, a digit and a special character!'}).required()
})
export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});