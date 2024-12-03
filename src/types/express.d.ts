import { Response } from 'express';

declare module 'express' {
  interface Response {
    // respuestas personalizadas para custom.routes
    sendSuccess?: (payload: any) => Response;
    sendUserError?: (err: Error) => Response;
    sendServerError?: (err: Error) => Response;
  }
}