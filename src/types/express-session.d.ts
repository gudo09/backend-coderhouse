// tipado para usar session en params
import session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    user: { [key: string]: any }; // ajusta el tipo de 'user' según tu esquema
    counter?: number;
  }
}