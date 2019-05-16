import { Request, Response, NextFunction } from 'express';
export declare const validator: (schema: any) => (req: Request, res: Response, next: NextFunction) => void | import("express-serve-static-core").Response;
