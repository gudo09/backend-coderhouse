import 'winston';

declare module "winston" {
  interface Logger {
    // niveles personalizados para winston
    fatal: LeveledLogMethod;
    error: LeveledLogMethod;
    warning: LeveledLogMethod;
    info: LeveledLogMethod;
    http: LeveledLogMethod;
    debug: LeveledLogMethod;
  } 
}