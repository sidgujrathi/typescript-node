import { Request, Response, NextFunction } from 'express';
export interface IReqAuth extends Request {
    user: string;
}
export declare const ensureAuth: (req: IReqAuth, res: Response, next: NextFunction) => Promise<import("express-serve-static-core").Response>;
