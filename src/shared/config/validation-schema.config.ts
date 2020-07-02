import * as Joi from '@hapi/joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().default(4000),
  DB_HOST: Joi.string(),
  DB_PORT: Joi.number().default(5432),
  DB_NAME: Joi.string(),
  DB_USERNAME: Joi.string(),
  DB_PASSWORD: Joi.string(),

  JWT_SECRET: Joi.string(),
  ACCESS_JWT_EXPIRES_IN: Joi.number(),
  REFRESH_JWT_EXPIRES_IN: Joi.number(),
});
