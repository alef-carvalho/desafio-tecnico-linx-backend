import * as schema from 'joi';

export const ConfigSchema = schema.object({
    // APPLICATION
    APP_ENV: schema.string().required().valid('local', 'production', 'staging'),

    // CACHE
    CACHE_TTL: schema.string().required(),

    // DATABASE
    DATABASE_URL: schema.string().required().uri(),

    // JWT
    JWT_SECRET: schema.string().required(),
    JWT_EXPIRE_TIME: schema.string().required(),

    // REDIS
    REDIS_HOST: schema.string().required().hostname(),
    REDIS_PORT: schema.number().required().port(),
    REDIS_PASSWORD: schema.string().required(),
});
