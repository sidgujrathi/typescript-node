import { Application, Request, Response } from 'express';
import { BaseApi } from '../BaseAPI';
export declare class CommonApi extends BaseApi {
    constructor();
    register(express: Application): void;
    uploadImage(req: Request, res: Response): Promise<void>;
    private init;
}
