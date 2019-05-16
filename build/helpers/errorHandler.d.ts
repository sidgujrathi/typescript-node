/// <reference types="node" />
import { Request, Response, NextFunction } from 'express';
import { MongoError } from 'mongodb';
export declare const catchErrors: (fn: any) => (req: Request, res: Response, next: NextFunction) => any;
export declare const notFound: (req: Request, res: Response, next: NextFunction) => void;
export declare const validationErrors: (err: MongoError, req: Request, res: Response, next: NextFunction) => import("express-serve-static-core").Response;
export declare const developmentErrors: (err: NodeJS.ErrnoException, req: Request, res: Response, next: NextFunction) => void;
export declare const productionErrors: (err: NodeJS.ErrnoException, req: Request, res: Response, next: NextFunction) => void;
