// intellisense for process.env
declare namespace NodeJS {
  export interface ProcessEnv {
    DB_HOST: string;
    DB_NAME: string;
    DB_PASS: string;
    DB_USER: string;
    SALT_ROUNDS: string;
    TOKEN_SECRET: string;
    REDIS_PORT: string;
    REDIS_HOST: string;
    REDIS_PASSWORD: string;
    PORT: string
  }
}